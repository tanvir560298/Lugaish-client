import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Load .env if python-dotenv is available
try:
    from dotenv import load_dotenv
    base_dir = BASE_DIR.parent
    local_env = BASE_DIR / ".env"
    root_env = base_dir / ".env"
    if local_env.exists():
        load_dotenv(local_env)
    elif root_env.exists():
        load_dotenv(root_env)
    else:
        load_dotenv()
except ImportError:
    pass

PROJECT_ROOT = BASE_DIR.parent
CACHE_DIR = BASE_DIR / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

CURRICULUM_FILE = BASE_DIR / "curriculum.json"
STATE_FILE = BASE_DIR / "state.json"

# API Keys & Secrets
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
FB_ACCESS_TOKEN = os.getenv("FB_ACCESS_TOKEN") or os.getenv("FB_PAGE_ACCESS_TOKEN", "").strip()
FB_TARGET_ID = os.getenv("FB_TARGET_ID") or os.getenv("FB_GROUP_ID") or os.getenv("FB_PAGE_ID", "").strip()

DEFAULT_SUBJECT = os.getenv("SUBJECT", "arabic").strip().lower()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash").strip()
TIMEZONE = os.getenv("TIMEZONE", "Asia/Dhaka").strip()
FB_API_VERSION = os.getenv("FB_API_VERSION", "v19.0").strip()
