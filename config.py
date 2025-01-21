from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

CACHE_ENABLED = True
CACHE_DIR = BASE_DIR / "instance/cache"
DATABASE_FILE = BASE_DIR / "instance/notes.db"
DATABASE_SCHEMA = BASE_DIR / "resources/schema.sql"
PANDOC_TEMPLATE = BASE_DIR / "templates/pandoc.html"
EXAMPLE_NOTES_DIR = BASE_DIR / "examples/example_tech_notes"
