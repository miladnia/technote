from pathlib import Path

APP_DIR = Path(__file__).resolve().parent
PROJECT_DIR = Path(__file__).resolve().parent.parent

CACHE_ENABLED = True
CACHE_DIR = APP_DIR / "instance/cache"
DATABASE_FILE = APP_DIR / "instance/notes.db"
DATABASE_SCHEMA = PROJECT_DIR / "resources/schema.sql"
PANDOC_TEMPLATE = APP_DIR / "templates/pandoc.html"
EXAMPLE_NOTES_DIR = APP_DIR / "examples/example_tech_notes"
VITE_MANIFEST_FILE = APP_DIR / "static/dist/.vite/manifest.json"
DEV_VITE_MAIN_FILE = "/src/web-client/main.jsx"
