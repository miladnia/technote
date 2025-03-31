import { useEffect, useState } from "react";
import { OpenDirectoryButton } from ".";
import { DropDownMenu, DropDownItem, Loading } from "../../ui";
import { request, requestPOST } from "../../utils";

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

  const handleDirectoryOpen = (notes) => {
    setEntries(notes);
    setIsHome(false);
  };

  const handleDirectoryClose = (directory) => {
    requestPOST(
      "/close",
      {
        directory_id: directory.id,
      },
      () => {
        loadEntries();
      }
    );
  };

  const handleBackToHomeClick = () => {
    loadEntries();
  };

  const handleDirectoryClick = (directory) => {
    loadEntries(directory.url);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (isEmpty) {
    return <EmptyNotesMessage onDirectoryOpen={handleDirectoryOpen} />;
  }

  return (
    <>
      <OpenDirectoryButton onDirectoryOpen={handleDirectoryOpen} />
      <hr />
      {entries.directory && (
        <SingleDirectory
          notes={entries.directory.note_list}
          title={entries.directory.name}
          onDirectoryClose={() => handleDirectoryClose(entries.directory)}
          hasBackToHome={!isHome}
          onBackToHomeClick={handleBackToHomeClick}
        />
      )}
      {entries.directory_list && (
        <DirectoryList
          directories={entries.directory_list}
          onDirectoryClick={handleDirectoryClick}
        />
      )}
    </>
  );
}

function DirectoryList({ directories, onDirectoryClick }) {
  return (
    <>
      <div className="d-flex align-items-center list-title">
        <i className="bi bi-folder"></i>
        <strong className="my-0 ms-2">Directories</strong>
      </div>
      <ul className="ps-3 py-2">
        {directories.map((dir) => (
          <li key={dir.id}>
            <button
              className="btn btn-link w-100 text-start"
              title={dir.path}
              onClick={() => onDirectoryClick(dir)}
            >
              {dir.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function SingleDirectory({
  notes,
  title,
  onDirectoryClose,
  hasBackToHome,
  onBackToHomeClick,
}) {
  return (
    <>
      <div className="d-flex align-items-center list-title">
        {hasBackToHome ? (
          <button className="btn" onClick={onBackToHomeClick}>
            <i className="bi bi-arrow-left"></i>
          </button>
        ) : (
          <i className="bi bi-folder"></i>
        )}
        <div className="flex-grow-1 ms-2">
          <strong>{title}</strong>
        </div>
        <DropDownMenu>
          <DropDownItem onClick={onDirectoryClose}>
            <i className="bi bi-x-circle me-2"></i>
            Close the directory
          </DropDownItem>
        </DropDownMenu>
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

function EmptyNotesMessage({ onDirectoryOpen }) {
  return (
    <div className="h-50 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <p>No notes here!</p>
        <OpenDirectoryButton
          className="btn btn-primary"
          onDirectoryOpen={onDirectoryOpen}
        >
          Open a directory
        </OpenDirectoryButton>
        <button className="btn btn-sm btn-secondary my-3" type="button">
          Try with example notes
        </button>
      </div>
    </div>
  );
}

export default NotesNav;
