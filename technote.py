from itertools import groupby
from pathlib import Path
import re

from flask import url_for
from markupsafe import Markup
import pypandoc as pandoc

from config import CACHE_ENABLED, CACHE_DIR, PANDOC_TEMPLATE
from helpers import dbhash, get_db, prettify, query_db
from models import Note


def add_directory(directory_path: str):
    """Add the directory with all the `.md` files to the database"""

    if not directory_path:
        return

    dir = Path(directory_path)
    # Validate the directory
    if not dir.is_dir():
        raise ValueError
    # Get all the Markdown files located in the directory
    md_files = dir.glob("*.md")

    with get_db() as db:
        # Create a new directory in the database
        cur = db.execute(
            "INSERT INTO directories(directory_path) VALUES (?)", (str(dir.resolve()),)
        )
        # Create a new note with a unique hash and a pretty name in the database
        db.executemany(
            "INSERT INTO notes(note_id, note_pretty_name, note_filename, note_directory) VALUES (?, ?, ?, ?)",
            [(dbhash(str(f.resolve())), prettify(f.stem), f.name, cur.lastrowid,) for f in md_files]
        )


def get_all():
    db_rows = query_db(
        "SELECT * FROM notes JOIN directories ON note_directory = directory_id ORDER BY note_directory, note_pretty_name"
    )
    notes = []
    for db_row in db_rows:
        notes.append(Note(
            id=db_row["note_id"],
            name=db_row["note_pretty_name"],
            path=Path(db_row["directory_path"]) / str(db_row["note_filename"])
        ))
    return notes


def get_grouped_notes_or_fail():
    notes = get_all()
    if not notes:
        # Check if user has determined any directory of notes yet
        db_row = query_db(
            "SELECT COUNT(*) as count FROM directories", one=True
        )
        if 0 == db_row["count"]:
            raise ValueError
    return groupby(notes, key=lambda note: note.path.parent.stem)


def find_note(note_id: str, with_content: bool=False, with_preview: bool=False):
    db_row = query_db(
        "SELECT * FROM notes JOIN directories ON note_directory = directory_id WHERE note_id = ?",
        (note_id,), one=True
    )
    if db_row is None:
        raise ValueError
    note = Note(
        id=db_row["note_id"],
        name=db_row["note_pretty_name"],
        path=Path(db_row["directory_path"]) / str(db_row["note_filename"])
    )
    if with_content:
        note.content = note.path.read_text()
    if with_preview:
        note.preview = Markup(_render_note_content(note))
    return note


def write_note_content(note_id: str, content: str):
    note = find_note(note_id)
    note.path.write_text(content)


def create_note_file(content: str, filename: str, directory_id: int = -1):
    if directory_id < 0:
        # Get the first directory (FIXME this is just temporary)
        db_row = query_db(
            "SELECT directory_id, directory_path FROM directories ORDER BY directory_id ASC LIMIT 1",
            one=True
        )
        directory_id = db_row["directory_id"]
    else:
        db_row = query_db(
            "SELECT directory_path FROM directories WHERE directory_id = ?",
            (directory_id,), one=True
        )

    if db_row is None:
        raise ValueError

    note_path = (Path(db_row["directory_path"]) / filename).with_suffix(".md")
    # Create a new file but fail if the file already exists
    with note_path.open(mode="x") as f:
        f.write(content)
    # Create a new record for the new note in the database
    note_id = dbhash(str(note_path.resolve()))
    with get_db() as db:
        db.execute(
            "INSERT INTO notes(note_id, note_pretty_name, note_filename, note_directory) VALUES (?, ?, ?, ?)",
            (note_id, prettify(note_path.stem), note_path.name, directory_id,)
        )
    return note_id


def search(query: str):
    query = query.strip()
    if not query:
        return []
    pattern = re.compile(rf"{re.escape(query)}")
    results = []
    for note in get_all():
        if not note.path.is_file():
            continue
        with note.path.open("r", encoding="utf-8") as f:
            for line in f:
                if not pattern.search(line):
                    continue
                # In some cases like reference links it could be empty
                plain_text = _md_to_text(line)
                if not plain_text:
                    continue
                if not results or note.path.name != results[-1]["source"]:
                    results.append({
                        "source": note.path.name,
                        "source_url": url_for("note", note_id=note.id),
                        "occurrences": []
                    })
                results[-1]["occurrences"].append(plain_text)
    return results


def _render_note_content(note: Note) -> str:
    if not note.path.is_file():
        return ""

    if not CACHE_ENABLED:
        return _md_to_html(note.path)

    cache_file = Path(CACHE_DIR) / note.id
    cache_expired = not cache_file.is_file() or cache_file.stat().st_mtime <= note.path.stat().st_mtime
    # Generate a new cache
    if cache_expired:
        html_content = _md_to_html(note.path)
        # Make sure the cache directory exists
        cache_file.parent.mkdir(parents=True, exist_ok=True)
        cache_file.write_text(html_content)
        return html_content

    return cache_file.read_text()


def _md_to_html(source_file) -> str:
    """Convert a Markdown file to an HTML document"""
    return pandoc.convert_file(source_file, format="markdown", to="html5", extra_args=[
        "--standalone",
        f"--template={PANDOC_TEMPLATE}",
        "--table-of-contents",
        "--toc-depth=2"
    ])


def _md_to_text(markdown: str) -> str:
    """Convert Markdown text to plain text"""
    text = pandoc.convert_text(markdown, format="markdown", to="plain", extra_args={
        "--wrap=none"
    })
    # Convert reference links `[title][ref]` to plain text `title`
    text = re.sub(r'\[([^\]]+)\]\[[^\]]*\]', r'\1', text)
    # Remove spaces, list symbols, table borders
    text = text.strip(' \n-*+|')
    return text
