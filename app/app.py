from flask import Flask, jsonify, redirect, render_template, request, url_for

from helpers import api_response, release_resources, render_notfound, render_badrequest, render_vite_assets
import technote
from models import DataOptions

app = Flask(__name__)

noteOptions = DataOptions(
    plain_object=True,
    url_handler=lambda note_id: url_for("note", note_id=note_id),
)
directoryOptions = DataOptions(
    plain_object=True,
    url_handler=lambda directory_id: url_for("list_directory", directory_id=directory_id),
)

@app.context_processor
def inject_helpers():
    def assets():
        return render_vite_assets(app.debug)
    return {"assets": assets}


@app.teardown_appcontext
def close_connection(exception):
    release_resources()


@app.route("/")
def index():
    return render_template("home.html")


@app.route("/notes/<note_id>")
def note(note_id):
    try:
        note = technote.get_note(note_id, with_preview=True)
    except ValueError:
        return render_notfound()

    return render_template("note.html", note=note)


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
        note = technote.get_note(note_id, with_content=True)
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


@app.route("/list")
def list_all():
    return api_response(
        technote.list_all(
            directoryOptions=directoryOptions,
            noteOptions=noteOptions,
        )
    )


@app.route("/list/<directory_id>")
def list_directory(directory_id):
    return api_response(
        technote.list_directory(directory_id, noteOptions=noteOptions)
    )


@app.route("/search")
def search():
    query = request.args.get("q")
    if not query:
        return render_badrequest()
    result = technote.search(query)
    return jsonify(result)


@app.route("/open", methods=["POST"])
def open():
    directory_path = request.json.get("directory", "")
    try:
        directory_id = technote.add_directory(directory_path)
    except ValueError as e:
        return api_response(message=str(e))
    return api_response(
        technote.list_directory(directory_id, noteOptions=noteOptions)
    )


@app.route("/close", methods=["POST"])
def close():
    directory_id = request.json.get("directory_id")
    technote.hide_directory(directory_id)
    return api_response({})


@app.route("/explore/", defaults={'directory': ''})
@app.route("/explore/<path:directory>")
def explore(directory: str):
    return api_response(
        technote.list_filesystem(directory)
    )


if "__main__" == __name__:
    app.run(host="0.0.0.0", port=8087)
