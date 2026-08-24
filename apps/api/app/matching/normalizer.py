"""
ResumeForge AI - Keyword and Skill Normalizer
"""

import re
from typing import List, Set


def normalize_token(token: str) -> str:
    """Normalize a skill token for matching."""
    t = token.lower().strip()
    # Remove version numbers (e.g. "python 3.10" -> "python", "angular 14" -> "angular")
    t = re.sub(r"\s+v?\d+(?:\.\d+)*", "", t)
    # Remove trailing .js or js suffix for frameworks where appropriate
    t = re.sub(r"\.js$", "", t)
    # Strip unnecessary punctuation but preserve # (e.g. C#) and + (e.g. C++)
    t = re.sub(r"[^\w\s\+#\.-]", "", t)
    return t.strip()


def tokenize_text(text: str) -> List[str]:
    """Tokenize a block of text into distinct word tokens and n-grams."""
    clean = re.sub(r"[^\w\s\+#\.-]", " ", text.lower())
    words = [w.strip(".-") for w in clean.split() if len(w.strip(".-")) > 1]
    return words


def get_ngrams(words: List[str], n: int = 2) -> List[str]:
    """Generate n-grams from a list of words."""
    return [" ".join(words[i : i + n]) for i in range(len(words) - n + 1)]
