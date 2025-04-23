import { useState } from "react";
import { request, requestPOST } from "@utils";
import { EmptyEditor as Editor } from "@helpers";
import NoteList from "./NoteList.jsx";
import DirectoryOptions from "./DirectoryOptions";

function SingleDirectory({
  directory,
  onDirectoryOpen,
  onDirectoryClose,
  hasBackToHome,
  onBackToHomeClick,
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleNoteCreate = () => {
    setIsEditorOpen(true);
  };

  const handleNoteSave = (content, filename) => {
    requestPOST(
      "/api/notes",
      {
        note_directory_id: directory.id,
        note_content: content,
        note_filename: filename,
      },
      (result) => {
        window.location.href = result.note.url;
      },
      (message) => {
        alert(message);
      }
    );
  };

  const handleNoteClick = (note) => {
    asyncShowNote(note);
  };

  return (
    <>
      <div className="d-flex align-items-center list-title">
        {hasBackToHome ? (
          <button className="btn p-0 pe-1" onClick={onBackToHomeClick}>
            <i className="bi bi-arrow-left fs-5"></i>
          </button>
        ) : (
          <i className="bi bi-folder"></i>
        )}
        <div className="flex-grow-1 ms-2 opacity-75">
          <strong>{directory.name}</strong>
        </div>
        <DirectoryOptions
          onNoteCreate={handleNoteCreate}
          onDirectoryClose={onDirectoryClose}
          onDirectoryOpen={onDirectoryOpen}
        />
      </div>
      <Editor
        open={isEditorOpen}
        onSave={handleNoteSave}
        onClose={() => setIsEditorOpen(false)}
      />
      <NoteList notes={directory.notes} onNoteClick={handleNoteClick} />
    </>
  );
}

// Temporary solution before switching to Next
function asyncShowNote(note) {
  request(note.html_content_url, (content) => {
    document.title = note.name;
    window.history.pushState(null, note.name, note.url);
    const noteContentElement = document.getElementById("noteContent");
    if (noteContentElement) {
      noteContentElement.innerHTML = content;
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 500);
    }
    const noteEditorBtn = document.getElementById("noteEditorBtn");
    if (noteEditorBtn) {
      noteEditorBtn.setAttribute("data-source-note", note.plain_content_url);
      noteEditorBtn.setAttribute("data-editor-id", `noteEditor_${note.id}`);
    } 
  });
}

export default SingleDirectory;
