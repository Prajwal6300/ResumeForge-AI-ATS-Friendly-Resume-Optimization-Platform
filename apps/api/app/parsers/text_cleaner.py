"""
ResumeForge AI - Text Cleaner & Normalization Utility
Cleans raw extracted text from PDFs, DOCX, and pasted text.
"""

import re
import unicodedata
from typing import List


def clean_text(text: str) -> str:
    """Clean and normalize raw extracted document text."""
    if not text:
        return ""

    # Normalize unicode to NFKC
    text = unicodedata.normalize("NFKC", text)

    # Remove null bytes and non-printable control chars except \n, \r, \t
    text = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)

    # Standardize newline characters
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Standardize bullet point symbols to standard hyphen
    bullet_chars = r"[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25AB\u25CF\u25CB\u25A0\u25A1\u2713\u2714\u27A2\u2192]"
    text = re.sub(bullet_chars, "- ", text)

    # Standardize dashes/hyphens
    text = re.sub(r"[\u2010\u2011\u2012\u2013\u2014\u2015]", "-", text)

    # Standardize single and double quotes
    text = re.sub(r"[\u2018\u2019\u201A\u201B]", "'", text)
    text = re.sub(r"[\u201C\u201D\u201E\u201F]", '"', text)

    # Replace non-breaking spaces with standard space
    text = text.replace("\u00A0", " ").replace("\u200B", "")

    # Collapse multiple consecutive spaces (but keep single newlines)
    text = re.sub(r"[ \t]+", " ", text)

    # Collapse more than 2 consecutive newlines into 2
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def split_into_lines(text: str) -> List[str]:
    """Split text into non-empty stripped lines."""
    cleaned = clean_text(text)
    return [line.strip() for line in cleaned.split("\n") if line.strip()]
