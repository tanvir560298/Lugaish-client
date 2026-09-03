import json
import sys
import urllib.request
import urllib.parse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from config import FB_ACCESS_TOKEN, FB_TARGET_ID, FB_API_VERSION

TIME_SLOT_LABELS = {
    1: {"question_time": "সকাল ১০:০০ টা", "answer_time": "দুপুর ১২:০০ টা", "next_time": "দুপুর ০২:০০ টা"},
    2: {"question_time": "দুপুর ০২:০০ টা", "answer_time": "বিকাল ০৪:০০ টা", "next_time": "সন্ধ্যা ০৬:০০ টা"},
    3: {"question_time": "সন্ধ্যা ০৬:০০ টা", "answer_time": "রাত ০৮:০০ টা", "next_time": "আগামীকাল সকাল ১০:০০ টা"}
}

def format_question_post(day: int, slot: int, question_obj: dict, subject: str = "arabic") -> str:
    """Format the MCQ question into an engaging social media post."""
    slot_info = TIME_SLOT_LABELS.get(slot, TIME_SLOT_LABELS[1])
    q_time = slot_info["question_time"]
    ans_time = slot_info["answer_time"]

    q_text = question_obj.get("question", "")
    options = question_obj.get("options", [])

    letters = ["A", "B", "C", "D"]
    formatted_options = []
    for i, opt in enumerate(options):
        letter = letters[i] if i < len(letters) else f"{i+1}"
        if opt.startswith(f"{letter})") or opt.startswith(f"{letter}."):
            formatted_options.append(f"🔘 {opt}")
        else:
            formatted_options.append(f"🔘 {letter}) {opt}")
    
    options_block = "\n".join(formatted_options)

    if subject.lower() == "arabic":
        header_title = f"🕌 **Daily Arabic Mastery Challenge — Day {day}** (কুইজ {slot}/৩)"
        hashtags = "#LPC #ArabicLearning #সহজ_আরবি #DailyQuiz #ArabicLanguage"
    else:
        header_title = f"🧠 **Daily English Mastery Challenge — Day {day}** (কুইজ {slot}/৩)"
        hashtags = "#LPC #EnglishLearning #SpellingMastery #DailyQuiz #ChallengeYourself"

    post = f"""{header_title}
⏰ সময়: {q_time}

{q_text}

{options_block}

━━━━━━━━━━━━━━━━━━━━
💬 আপনার উত্তর কোনটি? এখনই কমেন্ট করে জানান!
💡 ঠিক ২ ঘণ্টা পর ({ans_time}) এই পোস্টের কমেন্টে সঠিক উত্তর ও বিস্তারিত ব্যাখ্যা দেওয়া হবে।

{hashtags}"""
    return post.strip()

def format_answer_comment(day: int, slot: int, question_obj: dict, subject: str = "arabic") -> str:
    """Format the answer and Bengali explanation to be posted as a comment."""
    slot_info = TIME_SLOT_LABELS.get(slot, TIME_SLOT_LABELS[1])
    next_time = slot_info["next_time"]

    options = question_obj.get("options", [])
    ans_idx = question_obj.get("answer_index", 0)
    correct_letter = question_obj.get("correct_option_letter", "A")
    
    correct_opt_text = options[ans_idx] if 0 <= ans_idx < len(options) else ""
    if not correct_opt_text.startswith(f"{correct_letter})"):
        correct_display = f"{correct_letter}) {correct_opt_text}"
    else:
        correct_display = correct_opt_text

    explanation = question_obj.get("explanation", "").strip()

    comment = f"""🎯 **সঠিক উত্তর: {correct_display}**

💡 **বিস্তারিত ব্যাখ্যা ও নিয়ম:**
{explanation}

━━━━━━━━━━━━━━━━━━━━
👏 যারা সঠিক উত্তর দিতে পেরেছেন সবাইকে অনেক অনেক অভিনন্দন! 🎉
⏳ পরবর্তী চ্যালেঞ্জ আসবে {next_time}। সাথেই থাকুন!"""
    return comment.strip()

def post_to_feed(message: str, dry_run: bool = False) -> str:
    """Post message to Facebook Feed (Group or Page)."""
    if dry_run or not FB_ACCESS_TOKEN or not FB_TARGET_ID:
        print("[FB] [DRY RUN / NO TOKEN] Feed post simulated successfully.")
        print("-" * 50)
        print(message)
        print("-" * 50)
        return "mock_post_id_123456789"

    url = f"https://graph.facebook.com/{FB_API_VERSION}/{FB_TARGET_ID}/feed"
    payload = {
        "message": message,
        "access_token": FB_ACCESS_TOKEN
    }
    
    encoded_data = urllib.parse.urlencode(payload).encode("utf-8")
    req = urllib.request.Request(url, data=encoded_data, method="POST")

    with urllib.request.urlopen(req, timeout=30) as resp:
        res_data = json.loads(resp.read().decode("utf-8"))
        post_id = res_data.get("id", "")
        print(f"[FB] Post published successfully. ID: {post_id}")
        return post_id

def post_comment(post_id: str, comment_text: str, dry_run: bool = False) -> str:
    """Post answer comment under the specific question's post."""
    if dry_run or not FB_ACCESS_TOKEN or post_id.startswith("mock_"):
        print(f"[FB] [DRY RUN / NO TOKEN] Comment under Post {post_id} simulated:")
        print("-" * 50)
        print(comment_text)
        print("-" * 50)
        return "mock_comment_id_987654321"

    url = f"https://graph.facebook.com/{FB_API_VERSION}/{post_id}/comments"
    payload = {
        "message": comment_text,
        "access_token": FB_ACCESS_TOKEN
    }

    encoded_data = urllib.parse.urlencode(payload).encode("utf-8")
    req = urllib.request.Request(url, data=encoded_data, method="POST")

    with urllib.request.urlopen(req, timeout=30) as resp:
        res_data = json.loads(resp.read().decode("utf-8"))
        comment_id = res_data.get("id", "")
        print(f"[FB] Comment published successfully. ID: {comment_id}")
        return comment_id
