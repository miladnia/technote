import { DropDownDivider, DropDownItem, DropDownMenu } from "@ui";
import { OpenDirectoryButton } from "..";

function DirectoryOptions({ onNoteCreate, onDirectoryClose, onDirectoryOpen }) {
  return (
    <>
      <DropDownMenu>
        <DropDownItem onClick={onNoteCreate}>
          <i className="bi bi-pencil-square me-2"></i>
          Create a new note
        </DropDownItem>
        <DropDownDivider />
        <li>
          <OpenDirectoryButton
            className="dropdown-item d-flex align-items-center"
            onDirectoryOpen={onDirectoryOpen}
          >
            <i className="bi bi-folder-plus me-2"></i>
            Open a directory
          </OpenDirectoryButton>
        </li>
        <DropDownItem onClick={onDirectoryClose}>
          <i className="bi bi-x-circle me-2"></i>
          Close the directory
        </DropDownItem>
      </DropDownMenu>
    </>
  );
}

export default DirectoryOptions;
