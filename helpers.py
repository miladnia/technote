from hashlib import md5
import json
import sqlite3

from flask import g, render_template, url_for
from config import DATABASE_FILE, VITE_MANIFEST


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE_FILE)
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


def render_vite_assets(dev_mode: bool) -> str:
    if dev_mode:
        return """
            <script type="module">
                import RefreshRuntime from 'http://localhost:5173/@react-refresh'
                RefreshRuntime.injectIntoGlobalHook(window)
                window.$RefreshReg$ = () => {}
                window.$RefreshSig$ = () => (type) => type
                window.__vite_plugin_react_preamble_installed__ = true
            </script>
            <script type="module" src="http://localhost:5173/@vite/client"></script>
            <script type="module" src="http://localhost:5173/src/main.jsx"></script>
        """
    else:
        assets = []
        with open(VITE_MANIFEST) as f:
            manifest = json.load(f)
        for v in manifest.values():
            if v.get("isEntry", False):
                asset_url = url_for("static", filename=f"dist/{v.get("file")}")
                assets.append(f'<script type="module" src="{asset_url}"></script>')
                for css in v.get("css", []):
                    asset_url = url_for("static", filename=f"dist/{css}")
                    assets.append(f'<link href="{asset_url}" rel="stylesheet">')
        return "\n".join(assets)


def prettify(name: str) -> str:
    """Create a pretty title."""
    return (
        name.replace("_", " ")
            .replace("-", " ")
            .replace(".", " ")
            .title()
    )
