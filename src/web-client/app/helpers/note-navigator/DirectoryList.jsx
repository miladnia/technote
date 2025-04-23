import { OpenDirectoryButton } from "..";
import { DropDownMenu } from "@ui";

function DirectoryList({ directories, onDirectoryClick, onDirectoryOpen }) {
  return (
    <>
      <div className="d-flex align-items-center list-title">
        <i className="bi bi-folder"></i>
        <div className="flex-grow-1 ms-2 opacity-75">
          <strong>Directories</strong>
        </div>
        <DropDownMenu>
          <li>
            <OpenDirectoryButton 
              className="dropdown-item d-flex align-items-center"
              onDirectoryOpen={onDirectoryOpen}>
                <i className="bi bi-folder-plus me-2"></i>
                Open a directory
            </OpenDirectoryButton>
          </li>
        </DropDownMenu>
      </div>
      <ul className="ps-3 py-2">
        {directories.map((dir) => (
          <li key={dir.id}>
            <button
              className="btn btn-link w-100 text-start"
              title={dir.location_on_disk}
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

export default DirectoryList;
