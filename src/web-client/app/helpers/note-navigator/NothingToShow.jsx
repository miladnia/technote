import { requestPOST } from "@utils";
import { OpenDirectoryButton } from "..";

function NothingToShow({ onDirectoryOpen }) {
  const handleExampleNotesClick = () => {
    requestPOST("/open_example_notes", {}, (entries) => {
      onDirectoryOpen(entries);
    });
  };

  return (
    <div className="h-50 d-flex flex-column align-items-center justify-content-center">
      <p className="w-50 text-center">You have not yet opened a directory.</p>
      <OpenDirectoryButton
        className="btn btn-primary"
        onDirectoryOpen={onDirectoryOpen}
      >
        Open a directory
      </OpenDirectoryButton>
      <button
        className="btn btn-sm btn-secondary my-3"
        onClick={handleExampleNotesClick}
        type="button"
      >
        Try with example notes
      </button>
    </div>
  );
}

export default NothingToShow;
