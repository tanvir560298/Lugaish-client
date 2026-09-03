import json
import sys
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from config import STATE_FILE, DEFAULT_SUBJECT

DEFAULT_STATE = {
    "subject": DEFAULT_SUBJECT,
    "current_day": 1,
    "last_run_timestamp": None,
    "day_initialized_at": None,
    "today_questions": {},
    "pending_answers": {}
}

def load_state() -> dict:
    if not STATE_FILE.exists():
        save_state(DEFAULT_STATE)
        return DEFAULT_STATE.copy()
    try:
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            st = json.load(f)
            if "subject" not in st:
                st["subject"] = DEFAULT_SUBJECT
            return st
    except Exception as e:
        print(f"[StateManager] Warning reading state: {e}. Using defaults.")
        return DEFAULT_STATE.copy()

def save_state(state: dict):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def set_today_questions(day: int, questions: list, subject: str = "arabic"):
    state = load_state()
    state["subject"] = subject
    state["current_day"] = day
    state["day_initialized_at"] = datetime.now().isoformat()
    state["today_questions"] = {
        str(i + 1): q for i, q in enumerate(questions)
    }
    state["pending_answers"] = {}
    save_state(state)
    return state

def record_question_post(slot: int, post_id: str):
    state = load_state()
    if "pending_answers" not in state:
        state["pending_answers"] = {}
    
    state["pending_answers"][str(slot)] = {
        "post_id": post_id,
        "posted_at": datetime.now().isoformat(),
        "revealed": False
    }
    state["last_run_timestamp"] = datetime.now().isoformat()
    save_state(state)

def record_answer_comment(slot: int, comment_id: str):
    state = load_state()
    slot_str = str(slot)
    if "pending_answers" in state and slot_str in state["pending_answers"]:
        state["pending_answers"][slot_str]["revealed"] = True
        state["pending_answers"][slot_str]["comment_id"] = comment_id
        state["pending_answers"][slot_str]["answered_at"] = datetime.now().isoformat()
    
    # If slot 3 answer is completed, advance to the next day!
    if slot == 3:
        next_day = state.get("current_day", 1) + 1
        max_days = 15 if state.get("subject") == "arabic" else 30
        if next_day > max_days:
            next_day = 1 # Loop back to Day 1 after cycle
        print(f"[StateManager] All 3 slots finished for Day {state.get('current_day')}. Advancing to Day {next_day}!")
        state["current_day"] = next_day
        state["today_questions"] = {}
        state["pending_answers"] = {}

    save_state(state)

if __name__ == "__main__":
    st = load_state()
    print("Current State:", json.dumps(st, indent=2, ensure_ascii=False))
