import { useState } from "react";
import clsx from "clsx";
import { request } from "@utils";

function NoteList({ notes }) {
  const [selectedNote, setSelectedNote] = useState(null);

  const handleClick = (event, note) => {
    setSelectedNote(note);
    if (asyncShowNote(note)) {
      event.preventDefault();
    }
  };

  return (
    <ul className="ps-3 py-2">
      {notes.map((note) => (
        <li
          key={note.id}
          className={clsx(
            "nav-item",
            note === selectedNote && "nav-item-selected"
          )}
        >
          <a
            href={note.url}
            title={note.location_on_disk}
            onClick={(event) => handleClick(event, note)}
          >
            {note.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Temporary solution before switching to Next
function asyncShowNote(note) {
  const noteContentElement = document.getElementById("noteContent");
  if (!noteContentElement) {
    return false;
  }
  request(note.html_content_url, (content) => {
    document.title = note.name;
    window.history.pushState(null, note.name, note.url);
    noteContentElement.innerHTML = content;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
    const noteEditorBtn = document.getElementById("noteEditorBtn");
    if (noteEditorBtn) {
      noteEditorBtn.setAttribute("data-source-note", note.plain_content_url);
      noteEditorBtn.setAttribute("data-editor-id", `noteEditor_${note.id}`);
    }
  });
  return true;
}

export default NoteList;
