import { useRef, useState } from "react";
import { FileExplorer } from ".";
import { Modal } from "../ui";

function DirectorySelectorModal({ open, onClose, onDirectorySelect }) {
  const [navigatedDirectory, setNavigatedDirectory] = useState("");
  const directoryInput = useRef(null);

  const handleDirectoryChange = (path) => {
    setNavigatedDirectory(path);
  };

  const handleSelectClick = () => {
    const selectedDirectory = directoryInput.current.value;
    onDirectorySelect(selectedDirectory);
  };

  return (
    <Modal title="Select a directory" open={open} onClose={onClose} noPaddings>
      <div className="container-fluid position-relative">
        <section className="row position-sticky top-0 z-1 py-3 bg-primary">
          <div className="col">
            <input
              className="form-control"
              defaultValue={navigatedDirectory}
              ref={directoryInput}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={handleSelectClick}>
              Select
            </button>
          </div>
        </section>
        <section className="row px-3">
          <FileExplorer
            apiUrl="/explore"
            onDirectoryChange={handleDirectoryChange}
          />
        </section>
      </div>
    </Modal>
  );
}

export default DirectorySelectorModal;
