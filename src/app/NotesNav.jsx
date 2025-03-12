import { useEffect, useState } from "react";
import { ExplorerModal } from "./helpers";
import { Loading } from "../ui";
import { request } from "../utils";

function NotesNav() {
  const [entries, setEntries] = useState(null);
  const [isHome, setIsHome] = useState(true);
  const isLoading = null === entries;
  const isEmpty = null !== entries && 0 === Object.keys(entries).length;

  const loadEntries = (url = null) => {
    const apiUrl = "/list";
    request(url || apiUrl, (entries) => {
      setEntries(entries);
      setIsHome(null === url);
    });
  };

  const handleFolderOpen = (notes) => {
    setEntries(notes);
    setIsHome(false);
  };

  const handleBackToHomeClick = () => {
    loadEntries();
  };

  const handleFolderClick = (directory) => {
    loadEntries(directory.url);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (isEmpty) {
    return <EmptyNotesMessage onFolderOpen={handleFolderOpen} />;
  }

  return (
    <>
      <OpenFolderButton onFolderOpen={handleFolderOpen} />
      <hr />
      {entries.directory && (
        <FolderNotes
          notes={entries.directory.note_list}
          title={entries.directory.name}
          backToHome={!isHome}
          onBackToHomeClick={handleBackToHomeClick}
        />
      )}
      {entries.directory_list && (
        <FolderList
          folders={entries.directory_list}
          onFolderClick={handleFolderClick}
        />
      )}
    </>
  );
}

function FolderList({ folders, onFolderClick }) {
  return (
    <>
      <div className="d-flex align-items-center list-title">
        <i className="bi bi-folder"></i>
        <strong className="my-0 ms-2">Folders</strong>
      </div>
      <ul className="ps-3 py-2">
        {folders.map((folder) => (
          <li key={folder.id}>
            <button
              className="btn btn-link w-100 text-start"
              title={folder.path}
              onClick={() => onFolderClick(folder)}
            >
              {folder.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function FolderNotes({ notes, title, backToHome, onBackToHomeClick }) {
  return (
    <>
      <div className="d-flex align-items-center list-title">
        {backToHome ? (
          <button className="btn" onClick={onBackToHomeClick}>
            <i className="bi bi-arrow-left"></i>
          </button>
        ) : (
          <i className="bi bi-folder"></i>
        )}
        <div className="flex-grow-1 ms-2">
          <strong>{title}</strong>
        </div>
      </div>
      <ul className="ps-3 py-2">
        {notes.map((note) => (
          <li key={note.id}>
            <a href={note.url} title={note.path}>
              {note.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

function EmptyNotesMessage({ onFolderOpen }) {
  return (
    <div className="h-50 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <p>No notes here!</p>
        <OpenFolderButton
          className="btn btn-primary"
          onFolderOpen={onFolderOpen}
        >
          Open a directory
        </OpenFolderButton>
        <button className="btn btn-sm btn-secondary my-3" type="button">
          Try with example notes
        </button>
      </div>
    </div>
  );
}

function OpenFolderButton({ className, onFolderOpen, children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className={className || "btn btn-sm btn-secondary"}
        type="button"
        onClick={showModal}
      >
        {children || <i className="bi bi-folder2"></i>}
      </button>
      <ExplorerModal
        open={isModalOpen}
        onClose={handleClose}
        onDirectoryOpen={onFolderOpen}
      />
    </>
  );
}

export default NotesNav;
