from hashlib import md5
import sqlite3

from flask import g, render_template
from config import DATABASE


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def close_db():
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def release_resources():
    close_db()


def dbhash(string: str) -> str:
    return md5(string.encode()).hexdigest()


def render_notfound():
    return render_alert("Oops! The page you have requested was not found.", 404)


def render_badrequest():
    return render_alert("Bad request!", 400)


def render_alert(message: str, code: int):
    """Render an alert message."""
    return render_template("alert.html", message=message, code=code), code


def prettify(name: str) -> str:
    """Create a pretty title."""
    return (
        name.replace("_", " ")
            .replace("-", " ")
            .replace(".", " ")
            .title()
    )
