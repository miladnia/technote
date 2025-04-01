import os
import sys
import sqlite3
from pathlib import Path

basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../app"))
sys.path.append(basedir)

from config import DATABASE_FILE, DATABASE_SCHEMA

Path(DATABASE_FILE).parent.mkdir(parents=True, exist_ok=True)
connection = sqlite3.connect(DATABASE_FILE)

with open(DATABASE_SCHEMA) as schema_file:
    connection.executescript(schema_file.read())

connection.commit()
connection.close()
