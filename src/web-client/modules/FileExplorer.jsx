import { useEffect, useState } from "react";
import { request } from "@utils";

function FileExplorer({ apiUrl, onDirectoryChange }) {
  const [entries, setEntries] = useState(null);

  const loadEntries = (path = "") => {
    request([apiUrl, path], (entries) => {
      setEntries(entries);
      onDirectoryChange(entries.current_directory?.real_path);
    });
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleEntryClick = (entry) => {
    loadEntries(entry.path);
  };

  return (
    <table className="table table-hover table-sm align-middle x-transparent-table">
      <thead>
        <tr>
          <th className="w-50" scope="col">
            Directory
          </th>
          <th className="w-50" scope="col">
            Path
          </th>
        </tr>
      </thead>
      <tbody>
        {entries && (
          <>
            <ParentEntry
              entry={entries.parent_directory}
              onClick={handleEntryClick}
            />
            {entries.directories?.map((entry) => (
              <DirectoryEntry
                key={entry.real_path}
                entry={entry}
                onClick={handleEntryClick}
              />
            ))}
            {entries.files?.map((entry) => (
              <FileEntry key={entry.real_path} entry={entry} />
            ))}
          </>
        )}
      </tbody>
    </table>
  );
}

function DirectoryEntry({ entry, onClick }) {
  return (
    <tr>
      <th scope="row">
        <button
          className="btn btn-link text-light text-decoration-none p-0"
          type="button"
          onClick={() => onClick(entry)}
        >
          <i className="bi bi-folder2 me-2"></i>
          {entry.name}
        </button>
      </th>
      <td>
        <small className="text-secondary">{entry.real_path}</small>
      </td>
    </tr>
  );
}

function FileEntry({ entry }) {
  return (
    <tr>
      <td colSpan="2">
        <i className="bi bi-filetype-md me-2"></i>
        <span className="opacity-50">{entry.name}</span>
      </td>
    </tr>
  );
}

function ParentEntry({ entry, onClick }) {
  return (
    <tr>
      <td className="py-0" colSpan="2">
        <button
          className="btn btn-link text-light text-decoration-none px-0 py-1 w-100 text-start"
          type="button"
          onClick={() => onClick(entry)}
        >
          <i className="bi bi-arrow-90deg-up me-2"></i>
          Back
        </button>
      </td>
    </tr>
  );
}

export default FileExplorer;
