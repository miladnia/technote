from flask import Flask, flash, jsonify, redirect, render_template, request, url_for
from flask_session import Session

from helpers import release_resources, render_notfound, render_badrequest
import technote

app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.teardown_appcontext
def close_connection(exception):
    release_resources()


@app.route("/")
def index():
    try:
        grouped_notes = technote.get_grouped_notes_or_fail()
    except ValueError:
        # The user has not determined any directory of notes yet
        return render_template("welcome.html")
    return render_template("home.html", grouped_notes=grouped_notes)


@app.route("/notes/<note_id>")
def note(note_id):
    try:
        grouped_notes = technote.get_grouped_notes_or_fail()
    except ValueError:
        # The user has not determined any directory of notes yet
        return redirect("/")

    try:
        note = technote.find_note(note_id, with_preview=True)
    except ValueError:
        return render_notfound()

    return render_template("note.html", grouped_notes=grouped_notes, note=note)


@app.route("/plain_notes/<note_id>", methods=["GET", "POST"])
def plain_note(note_id):
    if "POST" == request.method:
        content = request.form.get("note_content")
        # Validate inputs
        if not content:
            return render_badrequest()
        # Update content of the note
        technote.write_note_content(note_id, content)
        return redirect(url_for("note", note_id=note_id))

    try:
        note = technote.find_note(note_id, with_content=True)
    except ValueError:
        return render_notfound()

    return note.content


@app.route("/new_note", methods=["POST"])
def new_note():
    content = request.form.get("note_content")
    filename = request.form.get("note_filename")
    # Validate inputs
    if not content or not filename:
        return render_badrequest()
    note_id = technote.create_note_file(content, filename)
    return redirect(url_for("note", note_id=note_id))


@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q")
    if not query:
        return render_badrequest()
    result = technote.search(query)
    return jsonify(result)


@app.route("/setup", methods=["POST"])
def setup():
    for dir in request.form.getlist("directories"):
        try:
            technote.add_directory(dir)
        except ValueError:
            flash(f"'{dir}' is not a valid directory.")
    return redirect("/")


if "__main__" == __name__:
    app.run(host="0.0.0.0", port=8087)
