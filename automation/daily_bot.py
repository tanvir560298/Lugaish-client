#!/usr/bin/env python3
import argparse
import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from config import TIMEZONE, DEFAULT_SUBJECT
from course_data_reader import get_day_info
from drive_reader import get_pdf_content_for_day
from ai_service import generate_questions_from_pdf, select_hardest_questions
from fb_service import (
    format_question_post,
    format_answer_comment,
    post_to_feed,
    post_comment
)
from state_manager import (
    load_state,
    set_today_questions,
    record_question_post,
    record_answer_comment
)

def prepare_questions_for_day(day: int, subject: str = "arabic") -> list:
    """Fetch curriculum for day and generate/select 3 questions via AI."""
    print(f"\n[Bot] === Preparing 3 questions for {subject.title()} Day {day} ===")
    info = get_day_info(day, subject=subject)
    mode = info.get("mode")

    if mode == "pdf":
        print(f"[Bot] Mode: PDF Day ({subject.title()} Lecture).")
        resource = info.get("resource", {})
        title = resource.get("title", f"{subject.title()} Day {day} Resource")
        cards = info.get("cards", [])
        print(f"[Bot] Reading PDF / Notes content for: {title}")
        pdf_text = get_pdf_content_for_day(resource, day) if resource else ""
        questions = generate_questions_from_pdf(day, title, pdf_text, count=3, subject=subject, cards=cards)
    else:
        print(f"[Bot] Mode: MCQ Day ({subject.title()} Question Pool).")
        questions_pool = info.get("questions", [])
        print(f"[Bot] Found {len(questions_pool)} questions in pool for Day {day}.")
        print(f"[Bot] AI is analyzing and selecting top 3 most challenging questions...")
        questions = select_hardest_questions(day, questions_pool, count=3, subject=subject)

    print(f"[Bot] Successfully prepared {len(questions)} questions for {subject.title()} Day {day}.\n")
    return questions

def run_post_question(day: int, slot: int, subject: str = "arabic", dry_run: bool = False):
    """Post question for the given slot (10 AM, 2 PM, or 6 PM)."""
    state = load_state()
    today_questions = state.get("today_questions", {})

    # If questions not prepared or for a different day/subject, prepare them
    if not today_questions or str(slot) not in today_questions or state.get("current_day") != day or state.get("subject") != subject:
        questions = prepare_questions_for_day(day, subject=subject)
        state = set_today_questions(day, questions, subject=subject)
        today_questions = state.get("today_questions", {})

    q_obj = today_questions.get(str(slot))
    if not q_obj:
        print(f"[Bot] Error: Could not find question for slot {slot}.")
        return

    post_content = format_question_post(day, slot, q_obj, subject=subject)
    print(f"[Bot] Publishing {subject.title()} Question {slot}/3 for Day {day}...")
    post_id = post_to_feed(post_content, dry_run=dry_run)
    
    record_question_post(slot, post_id)
    print(f"[Bot] Finished Question {slot} for Day {day}.\n")

def run_post_answer(day: int, slot: int, subject: str = "arabic", dry_run: bool = False):
    """Post answer comment for the given slot 2 hours later (12 PM, 4 PM, or 8 PM)."""
    state = load_state()
    today_questions = state.get("today_questions", {})
    pending = state.get("pending_answers", {}).get(str(slot))

    if not today_questions or str(slot) not in today_questions:
        print(f"[Bot] Warning: Question data for slot {slot} not found. Preparing fallback.")
        questions = prepare_questions_for_day(day, subject=subject)
        state = set_today_questions(day, questions, subject=subject)
        today_questions = state.get("today_questions", {})

    q_obj = today_questions.get(str(slot))
    if not q_obj:
        print(f"[Bot] Error: Question object not available for slot {slot}.")
        return

    post_id = pending.get("post_id") if pending else "mock_post_id"
    comment_content = format_answer_comment(day, slot, q_obj, subject=subject)

    print(f"[Bot] Publishing Answer for Question {slot}/3 under Post ID: {post_id}...")
    comment_id = post_comment(post_id, comment_content, dry_run=dry_run)
    
    record_answer_comment(slot, comment_id)
    print(f"[Bot] Finished Answer Comment for Slot {slot}.\n")

def auto_detect_action_and_slot():
    """
    Auto detect slot and action based on Bangladesh Standard Time (UTC+6).
    10 AM BST (04 UTC) -> Question 1
    12 PM BST (06 UTC) -> Answer 1
    02 PM BST (08 UTC) -> Question 2
    04 PM BST (10 UTC) -> Answer 2
    06 PM BST (12 UTC) -> Question 3
    08 PM BST (14 UTC) -> Answer 3
    """
    now_utc = datetime.now(timezone.utc)
    hour = now_utc.hour

    schedule_map = {
        4: ("post_question", 1),
        6: ("post_answer", 1),
        8: ("post_question", 2),
        10: ("post_answer", 2),
        12: ("post_question", 3),
        14: ("post_answer", 3)
    }

    if hour in schedule_map:
        return schedule_map[hour]
    
    return ("post_question", 1)

def main():
    parser = argparse.ArgumentParser(description="LPC Facebook AI Quiz & MCQ Posting Bot")
    parser.add_argument("--action", choices=["post_question", "post_answer"], help="Action to perform")
    parser.add_argument("--slot", type=int, choices=[1, 2, 3], help="Question slot (1: 10AM/12PM, 2: 2PM/4PM, 3: 6PM/8PM)")
    parser.add_argument("--day", type=int, help="Override curriculum day (e.g. 1, 2, 3... 15)")
    parser.add_argument("--subject", choices=["arabic", "english"], default=DEFAULT_SUBJECT, help="Course subject (default: arabic)")
    parser.add_argument("--test", "--dry-run", action="store_true", help="Run in test mode without posting to Facebook")
    parser.add_argument("--auto", action="store_true", help="Auto detect slot based on current time")

    args = parser.parse_args()

    state = load_state()
    subject = args.subject or state.get("subject", DEFAULT_SUBJECT)
    day = args.day if args.day else state.get("current_day", 1)

    if args.auto:
        action, slot = auto_detect_action_and_slot()
        print(f"[Bot Auto] Detected Action: {action}, Slot: {slot} ({subject.title()} Day {day})")
    else:
        action = args.action or "post_question"
        slot = args.slot or 1

    dry_run = args.test

    print(f"==================================================")
    print(f"🚀 LPC Facebook AI Quiz Bot")
    print(f"📚 Subject: {subject.upper()} | 📅 Day: {day} | ⏰ Slot: {slot} | ⚡ Action: {action}")
    print(f"🔧 Mode: {'TEST / DRY RUN' if dry_run else 'LIVE PRODUCTION'}")
    print(f"==================================================")

    if action == "post_question":
        run_post_question(day, slot, subject=subject, dry_run=dry_run)
    elif action == "post_answer":
        run_post_answer(day, slot, subject=subject, dry_run=dry_run)

if __name__ == "__main__":
    main()
