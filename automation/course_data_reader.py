import json
import sys
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from config import CURRICULUM_FILE

def ensure_curriculum_exists():
    """Ensure curriculum.json is generated from the project's source JS files."""
    if not CURRICULUM_FILE.exists():
        print("[Reader] curriculum.json not found. Exporting from src/data/...")
        export_script = BASE_DIR / "export_curriculum.js"
        try:
            subprocess.run(["node", str(export_script)], check=True, capture_output=True, text=True)
            print("[Reader] Export finished successfully.")
        except Exception as e:
            print(f"[Reader] Error running export_curriculum.js: {e}")

def load_curriculum():
    ensure_curriculum_exists()
    if not CURRICULUM_FILE.exists():
        raise FileNotFoundError(f"Cannot find {CURRICULUM_FILE}. Make sure export_curriculum.js has run.")
    with open(CURRICULUM_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def get_day_info(day: int, subject: str = "arabic"):
    """
    Returns curriculum information for a given day and subject ('arabic' or 'english').
    - If day is odd (1, 3, 5...): mode is 'pdf', returns Drive resource + lesson vocabulary cards.
    - If day is even (2, 4, 6...): mode is 'mcq', returns quiz questions list.
    """
    data = load_curriculum()
    subject = subject.lower().strip()
    is_pdf_day = (day % 2 != 0)

    course = data.get("course", {}).get(subject, {})
    modules = course.get("modules", [])
    lessons = modules[0].get("lessons", []) if modules else []
    lesson = lessons[day - 1] if 0 <= day - 1 < len(lessons) else {}

    if is_pdf_day:
        resources = data.get("resources", {}).get(subject, [])
        resource = next((r for r in resources if r.get("day") == day), None)
        
        cards = lesson.get("cards", [])
        phrases = lesson.get("phrases", [])

        return {
            "day": day,
            "subject": subject,
            "mode": "pdf",
            "resource": resource,
            "lesson_title": lesson.get("title", f"Day {day} Lesson"),
            "cards": cards,
            "phrases": phrases
        }
    else:
        quiz_questions = lesson.get("quiz", []) if lesson else []
        
        return {
            "day": day,
            "subject": subject,
            "mode": "mcq",
            "questions": quiz_questions,
            "lesson_title": lesson.get("title", f"Lesson {day} Quiz")
        }

if __name__ == "__main__":
    ar_d1 = get_day_info(1, subject="arabic")
    print("Arabic Day 1 Info:", json.dumps(ar_d1, ensure_ascii=False, indent=2))
    ar_d2 = get_day_info(2, subject="arabic")
    print(f"Arabic Day 2 Quiz Count: {len(ar_d2.get('questions', []))}")
