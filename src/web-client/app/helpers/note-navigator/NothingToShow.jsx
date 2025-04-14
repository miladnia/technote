import { OpenDirectoryButton } from "..";

function NothingToShow({ onDirectoryOpen }) {
  return (
    <div className="h-50 d-flex flex-column align-items-center justify-content-center">
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
  );
}

export default NothingToShow;
