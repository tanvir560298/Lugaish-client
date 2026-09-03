import re
import os
import urllib.request
from pathlib import Path
from config import CACHE_DIR

def extract_drive_file_id(url: str) -> str:
    """Extract Google Drive file ID from various Drive URL formats."""
    if not url:
        return ""
    patterns = [
        r"/file/d/([a-zA-Z0-9_-]+)",
        r"id=([a-zA-Z0-9_-]+)",
        r"/d/([a-zA-Z0-9_-]+)"
    ]
    for pattern in patterns:
        m = re.search(pattern, url)
        if m:
            return m.group(1)
    return ""

def download_drive_pdf(url: str, day: int) -> Path:
    """
    Downloads a PDF from Google Drive and caches it in cache/day_{day}.pdf.
    Returns the path to the PDF file.
    """
    file_id = extract_drive_file_id(url)
    if not file_id:
        raise ValueError(f"Could not extract Google Drive File ID from URL: {url}")
    
    cached_path = CACHE_DIR / f"day_{day}.pdf"
    if cached_path.exists() and cached_path.stat().st_size > 1000:
        print(f"[DriveReader] Using cached PDF for Day {day}: {cached_path}")
        return cached_path

    # Direct download URLs
    download_urls = [
        f"https://drive.google.com/uc?export=download&id={file_id}",
        f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"
    ]

    last_err = None
    for dl_url in download_urls:
        try:
            req = urllib.request.Request(
                dl_url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
                }
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                # Check if received content is a PDF
                if data.startswith(b"%PDF") or len(data) > 2000:
                    with open(cached_path, "wb") as f:
                        f.write(data)
                    print(f"[DriveReader] Downloaded and cached {len(data)} bytes to {cached_path}")
                    return cached_path
        except Exception as e:
            last_err = e

    print(f"[DriveReader] Note: Could not download direct Drive PDF ({last_err}). Creating fallback text.")
    return None

def extract_pdf_text(pdf_path: Path) -> str:
    """Extract text from a local PDF using pypdf if available."""
    if not pdf_path or not pdf_path.exists():
        return ""

    try:
        from pypdf import PdfReader
        reader = PdfReader(str(pdf_path))
        text_pages = []
        for i, page in enumerate(reader.pages):
            txt = page.extract_text()
            if txt:
                text_pages.append(f"--- Page {i+1} ---\n{txt}")
        full_text = "\n\n".join(text_pages).strip()
        return full_text
    except ImportError:
        print("[DriveReader] pypdf not installed. Reading raw text if applicable.")
        try:
            with open(pdf_path, "rb") as f:
                content = f.read().decode("latin-1", errors="ignore")
                # Simple extraction of printable words
                words = re.findall(r"[A-Za-z0-9\-.,']{3,}", content)
                return " ".join(words[:2000])
        except Exception:
            return ""
    except Exception as e:
        print(f"[DriveReader] Error reading PDF: {e}")
        return ""

def get_pdf_content_for_day(resource: dict, day: int) -> str:
    """Helper to fetch and extract text for a given day's learning resource."""
    url = resource.get("url", "")
    title = resource.get("title", f"Day {day} Learning Resource")
    desc = resource.get("description", "")
    
    pdf_path = download_drive_pdf(url, day)
    extracted_text = extract_pdf_text(pdf_path) if pdf_path else ""

    if not extracted_text:
        # Graceful fallback context for Gemini AI
        extracted_text = f"Title: {title}\nDescription: {desc}\nSubject: English spelling masterclass and vocabulary lessons."

    return extracted_text

if __name__ == "__main__":
    test_url = "https://drive.google.com/file/d/1RfoKlPS3gLscJRuu98ekbXkRf8LTprH3/view?usp=sharing"
    fid = extract_drive_file_id(test_url)
    print("Extracted File ID:", fid)
