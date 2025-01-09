from pathlib import Path

PROJECT_ROOT = Path(__file__).parent

CACHE_ENABLED = True
CACHE_DIR = PROJECT_ROOT / ".cache"
DATABASE = PROJECT_ROOT / "notes.db"
DATABASE_SCHEMA = PROJECT_ROOT / "schema.sql"
PANDOC_TEMPLATE = PROJECT_ROOT / "templates/pandoc.html"
