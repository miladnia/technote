import os
import sys
import sqlite3
from pathlib import Path

PROJECT_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(PROJECT_DIR)

from technote.config import DATABASE_FILE, DATABASE_SCHEMA

Path(DATABASE_FILE).parent.mkdir(parents=True, exist_ok=True)
connection = sqlite3.connect(DATABASE_FILE)

with open(DATABASE_SCHEMA) as schema_file:
    connection.executescript(schema_file.read())

connection.commit()
connection.close()
