import { useState } from "react";
import { requestPOST } from "@utils";
import { EmptyEditor as Editor } from "@helpers";
import NoteList from "./NoteList.jsx";
import DirectoryOptions from "./DirectoryOptions";

function SingleDirectory({
  directory,
  notes,
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
      <NoteList notes={notes} />
    </>
  );
}

export default SingleDirectory;
