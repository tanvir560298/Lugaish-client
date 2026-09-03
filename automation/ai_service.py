import json
import re
import sys
import urllib.request
import urllib.error
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from config import GEMINI_API_KEY, GEMINI_MODEL

def call_gemini(prompt: str) -> str:
    """Call Google Gemini REST API using standard urllib."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set. Please set it in .env or GitHub Secrets.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "topP": 0.95
        }
    }

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=45) as response:
        res_body = response.read().decode("utf-8")
        data = json.loads(res_body)
        candidates = data.get("candidates", [])
        if not candidates:
            raise RuntimeError(f"No candidates returned from Gemini: {res_body}")
        
        parts = candidates[0].get("content", {}).get("parts", [])
        text = "".join(p.get("text", "") for p in parts)
        return text

def parse_json_from_ai(text: str):
    """Extract and parse JSON array or object from AI response text."""
    clean = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", clean)
    if match:
        clean = match.group(1).strip()
    return json.loads(clean)

def generate_questions_from_pdf(day: int, title: str, pdf_text: str, count: int = 3, subject: str = "arabic", cards: list = None) -> list:
    """
    On PDF days (Day 1, 3, 5...), ask Gemini to generate `count` MCQs
    based on the lesson PDF content and vocabulary cards.
    """
    if not GEMINI_API_KEY:
        print(f"[AI] GEMINI_API_KEY not configured. Generating offline mock questions for {subject.title()} PDF day.")
        return _fallback_pdf_questions(day, title, count, subject=subject, cards=cards)

    cards_text = ""
    if cards:
        cards_text = "\nLesson Key Vocabulary:\n" + json.dumps(cards, ensure_ascii=False, indent=2)

    subject_instruction = (
        "Focus on Modern Standard Arabic (فصحى) vocabulary, word meanings in Bengali/Bangla, sentence translation, pronunciation, or basic grammar rules."
        if subject.lower() == "arabic"
        else "Focus on English spelling rules, silent letters, homophones, or confusing words."
    )

    prompt = f"""
You are an expert {subject.title()} language educator designing daily quiz posts for an educational Facebook community group.
We are on Day {day} of the {subject.title()} Pathway.
Lesson Title: "{title}"
{cards_text}

Lesson PDF extract / notes:
{pdf_text[:4000]}

Your task:
Create exactly {count} distinct, high-quality Multiple Choice Questions (MCQ) testing the core concepts of this lesson.
{subject_instruction}

Format requirements:
- Question text in clear, engaging Bangla / English.
- 4 clear options labeled A, B, C, D.
- Correct option index (0 for A, 1 for B, 2 for C, 3 for D).
- Detailed, friendly explanation written in Bengali (Bangla) explaining why that option is correct and the memory rule/trick.

Return ONLY a JSON array with this schema:
[
  {{
    "question": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer_index": 0,
    "correct_option_letter": "A",
    "explanation": "বাংলায় বিস্তারিত ব্যাখ্যা: ..."
  }}
]
"""
    try:
        raw = call_gemini(prompt)
        items = parse_json_from_ai(raw)
        if isinstance(items, list) and len(items) >= count:
            return items[:count]
        return items
    except Exception as e:
        print(f"[AI] Error generating questions from Gemini: {e}")
        return _fallback_pdf_questions(day, title, count, subject=subject, cards=cards)

def select_hardest_questions(day: int, questions_pool: list, count: int = 3, subject: str = "arabic") -> list:
    """
    On MCQ days (Day 2, 4, 6...), ask Gemini to review the pool of questions (e.g. 10 questions)
    and select the top `count` most challenging, tricky, or concept-rich questions for learners.
    """
    if not GEMINI_API_KEY:
        print(f"[AI] GEMINI_API_KEY not configured. Selecting offline top questions from {subject.title()} pool.")
        return _fallback_select_pool(questions_pool, count)

    pool_json = json.dumps(questions_pool, ensure_ascii=False, indent=2)

    prompt = f"""
You are an expert {subject.title()} teacher selecting quiz questions for a Facebook learning group.
Today is Day {day} (Quiz Day) of the {subject.title()} Pathway.

Here is the complete pool of {len(questions_pool)} questions for today:
{pool_json}

Your task:
1. Carefully analyze all the questions in the pool.
2. Select the top {count} most DIFFICULT, TRICKY, or COMMONLY CONFUSED questions where learners make the most mistakes.
3. For each selected question, ensure the explanation in Bengali (Bangla) is clear, instructive, and easy for students to grasp.

Return ONLY a JSON array with exactly {count} items in this schema:
[
  {{
    "question": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer_index": 1,
    "correct_option_letter": "B",
    "explanation": "বাংলায় সহজ ব্যাখ্যা: ..."
  }}
]
"""
    try:
        raw = call_gemini(prompt)
        items = parse_json_from_ai(raw)
        if isinstance(items, list) and len(items) >= count:
            return items[:count]
        return items
    except Exception as e:
        print(f"[AI] Error selecting hardest questions with Gemini: {e}")
        return _fallback_select_pool(questions_pool, count)

def _fallback_pdf_questions(day: int, title: str, count: int = 3, subject: str = "arabic", cards: list = None) -> list:
    """Mock fallback for PDF day when API key is not present (for testing)."""
    if subject.lower() == "arabic":
        # If cards exist (e.g. Day 1 has Leadership Words), generate questions based on cards
        if cards and len(cards) >= 3:
            res = []
            letters = ["A", "B", "C", "D"]
            for i in range(min(count, len(cards))):
                c = cards[i]
                res.append({
                    "question": f"আরবি শব্দ “{c.get('translation')}” ({c.get('word')}) এর সঠিক অর্থ বা ব্যবহার কোনটি?",
                    "options": [
                        f"{c.get('explanation')}",
                        "কঠিন পরিস্থিতি এড়িয়ে যাওয়া",
                        "শুধুমাত্র ব্যক্তিগত লাভ খোঁজা",
                        "দলীয় কাজে অংশ না নেওয়া"
                    ],
                    "answer_index": 0,
                    "correct_option_letter": "A",
                    "explanation": f"সঠিক উত্তর A। {c.get('translation')} ({c.get('word')}): {c.get('explanation')} {c.get('example', '')}"
                })
            return res
        return [
            {
                "question": f"আরবি রিডিং প্র্যাকটিস — Day {day} (প্রশ্ন ১): “كِتَابٌ” (Kitaabun) শব্দের অর্থ কী?",
                "options": ["একটি কলম", "একটি বই", "একটি টেবিল", "একটি বাড়ি"],
                "answer_index": 1,
                "correct_option_letter": "B",
                "explanation": "সঠিক উত্তর B) একটি বই। আরবিতে كِتَابٌ মানে বই।"
            },
            {
                "question": f"আরবি রিডিং প্র্যাকটিস — Day {day} (প্রশ্ন ২): “هٰذَا” (Hadha) শব্দটি ব্যাকরণগতভাবে কী নির্দেশ করে?",
                "options": ["দূরের কিছু নির্দেশ করতে (That)", "কাছের পুরুষবাচক কিছু নির্দেশ করতে (This)", "বহুবচন নির্দেশ করতে (These)", "প্রশ্ন করতে (What)"],
                "answer_index": 1,
                "correct_option_letter": "B",
                "explanation": "সঠিক উত্তর B। “هٰذَا” হলো ইসমুল ইশারা (ইসমে ইশারা লিল-ক্বারীব), যা কাছের কোনো পুরুষবাচক বস্তু বা ব্যক্তিকে নির্দেশ করতে ব্যবহৃত হয়।"
            },
            {
                "question": f"আরবি রিডিং প্র্যাকটিস — Day {day} (প্রশ্ন ৩): “একটি দরজা” এর সঠিক আরবি কী?",
                "options": ["بَابٌ (Baabun)", "بَيْتٌ (Baytun)", "مَسْجِدٌ (Masjidun)", "قَلَمٌ (Qalamun)"],
                "answer_index": 0,
                "correct_option_letter": "A",
                "explanation": "সঠিক উত্তর A) بَابٌ (Baabun) অর্থ দরজা।"
            }
        ][:count]
    else:
        return [
            {
                "question": f"Day {day} Challenge (Q1): Select the correctly spelled word:",
                "options": ["Accommodation", "Acommodation", "Accomodation", "Acomodation"],
                "answer_index": 0,
                "correct_option_letter": "A",
                "explanation": "সঠিক উত্তর A) Accommodation। মনে রাখবেন এতে দুটি 'c' এবং দুটি 'm' রয়েছে।"
            },
            {
                "question": f"Day {day} Challenge (Q2): Which sentence has the correct spelling?",
                "options": ["I recieved your letter.", "I received your letter.", "I receved your letter.", "I recived your letter."],
                "answer_index": 1,
                "correct_option_letter": "B",
                "explanation": "সঠিক উত্তর B) I received...। 'i before e except after c'।"
            },
            {
                "question": f"Day {day} Challenge (Q3): 'It was a great ________.'",
                "options": ["Privilege", "Priviledge", "Privelege", "Privelidge"],
                "answer_index": 0,
                "correct_option_letter": "A",
                "explanation": "সঠিক উত্তর A) Privilege। এই বানানে কোনো 'd' নেই।"
            }
        ][:count]

def _fallback_select_pool(questions_pool: list, count: int = 3) -> list:
    """Select 3 diverse questions from existing pool if offline/testing."""
    letters = ["A", "B", "C", "D"]
    selected = []
    indices = [0, 1, 2] if len(questions_pool) <= 3 else [1, 2, 0]
    for idx in indices[:count]:
        if idx < len(questions_pool):
            q = questions_pool[idx]
            ans_idx = q.get("answer", 0)
            opt_letter = letters[ans_idx] if ans_idx < len(letters) else "A"
            correct_text = q.get("options", [])[ans_idx] if ans_idx < len(q.get("options", [])) else ""
            expl = q.get("explanation", "")
            formatted_expl = f"সঠিক উত্তর {opt_letter}) {correct_text}। {expl}"
            selected.append({
                "question": q.get("question", ""),
                "options": q.get("options", []),
                "answer_index": ans_idx,
                "correct_option_letter": opt_letter,
                "explanation": formatted_expl
            })
    return selected
