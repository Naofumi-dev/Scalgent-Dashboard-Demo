"""
execution/scrape_single_site.py
--------------------------------
Layer 3 — Execution Script

Fetches a single URL, extracts the page title and body text,
and writes structured JSON output to the outputs/ directory.

Directive: directives/example_scrape_website.md

Usage:
    python execution/scrape_single_site.py --url "https://example.com"
    python execution/scrape_single_site.py --url "https://example.com" --output outputs/my_result.json
    python execution/scrape_single_site.py --help
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from bs4 import BeautifulSoup

# Import shared utilities from this layer
sys.path.insert(0, str(Path(__file__).resolve().parent))
from utils import build_http_session, get_logger

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUTS_DIR = PROJECT_ROOT / "outputs"
logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# Core logic
# ---------------------------------------------------------------------------

def scrape(url: str) -> dict:
    """
    Fetch a URL and extract its title + body text.

    Args:
        url: The full URL to scrape.

    Returns:
        A dict with keys: url, title, body_text, scraped_at, status.
        On failure, includes an 'error' key and status='failed'.
    """
    session = build_http_session(retries=2, timeout=15)
    logger.info("Fetching %s", url)

    try:
        response = session.get(url, timeout=session.timeout)  # type: ignore[attr-defined]
        response.raise_for_status()
    except Exception as exc:
        logger.error("Request failed: %s", exc)
        return {
            "url": url,
            "status": "failed",
            "error": str(exc),
            "scraped_at": _now_iso(),
        }

    soup = BeautifulSoup(response.text, "html.parser")

    # Title
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else "(no title)"

    # Body text — fall back gracefully if no <body>
    body_tag = soup.find("body")
    if body_tag:
        body_text = body_tag.get_text(separator=" ", strip=True)
    else:
        logger.warning("No <body> tag found in %s — extracting all text", url)
        body_text = soup.get_text(separator=" ", strip=True)

    logger.info("Extracted %d characters from '%s'", len(body_text), title)

    return {
        "url": url,
        "title": title,
        "body_text": body_text,
        "scraped_at": _now_iso(),
        "status": "success",
    }


def _now_iso() -> str:
    """Return current UTC time as an ISO 8601 string."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Scrape a single website and save extracted content as JSON.\n"
            "Directive: directives/example_scrape_website.md"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--url",
        required=True,
        help="Full URL to scrape (e.g. https://example.com)",
    )
    parser.add_argument(
        "--output",
        default=None,
        help=(
            "Output JSON file path. "
            "Defaults to outputs/scraped_<timestamp>.json"
        ),
    )
    args = parser.parse_args()

    # Determine output path
    if args.output:
        output_path = Path(args.output)
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = OUTPUTS_DIR / f"scraped_{timestamp}.json"

    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Run scrape
    result = scrape(args.url)

    # Write output
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    logger.info("Output saved → %s", output_path.resolve())

    # Exit with error code if scrape failed (useful for CI / orchestration)
    if result.get("status") == "failed":
        sys.exit(1)


if __name__ == "__main__":
    main()
