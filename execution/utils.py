"""
execution/utils.py
------------------
Layer 3 shared utilities.

All execution scripts should import from here instead of duplicating
boilerplate. Handles:
  - .env loading
  - Structured logging
  - Reusable HTTP session with sensible defaults
"""

import logging
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

# Always load .env relative to the project root (one level up from execution/)
_PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(_PROJECT_ROOT / ".env")


def get_env(key: str, required: bool = True) -> str | None:
    """
    Fetch an environment variable by key.

    Args:
        key:      The variable name (e.g. 'OPENAI_API_KEY').
        required: If True, raises EnvironmentError when the variable is missing.

    Returns:
        The value as a string, or None if not required and not set.
    """
    value = os.getenv(key)
    if required and not value:
        raise EnvironmentError(
            f"Required environment variable '{key}' is not set. "
            f"Check your .env file (see .env.example for reference)."
        )
    return value


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

def get_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    """
    Return a named logger with consistent formatting.

    Args:
        name:  Typically __name__ of the calling module.
        level: Logging level (default: INFO).

    Returns:
        Configured Logger instance.

    Usage:
        logger = get_logger(__name__)
        logger.info("Starting scrape for %s", url)
    """
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            fmt="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    logger.setLevel(level)
    return logger


# ---------------------------------------------------------------------------
# HTTP Session
# ---------------------------------------------------------------------------

def build_http_session(
    retries: int = 2,
    backoff_factor: float = 0.5,
    timeout: int = 15,
) -> requests.Session:
    """
    Build a requests Session with automatic retry logic and a browser-like UA.

    Args:
        retries:        Number of retry attempts on 5xx / connection errors.
        backoff_factor: Sleep between retries = backoff_factor * (2 ** retry_number).
        timeout:        Default timeout in seconds (stored as session attribute).

    Returns:
        Configured requests.Session.

    Usage:
        session = build_http_session()
        response = session.get(url, timeout=session.timeout)
    """
    session = requests.Session()
    session.timeout = timeout  # type: ignore[attr-defined]

    retry_strategy = Retry(
        total=retries,
        backoff_factor=backoff_factor,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "POST"],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    session.headers.update({
        "User-Agent": (
            "Mozilla/5.0 (compatible; SampleBot/1.0; "
            "+https://github.com/your-org/sample-website-builder)"
        )
    })
    return session
