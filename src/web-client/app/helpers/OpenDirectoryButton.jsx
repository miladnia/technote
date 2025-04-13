import { useState } from "react";
import { requestPOST } from "@utils";
import { DirectorySelectorModal } from "@modules";

function OpenDirectoryButton({ className, onDirectoryOpen, children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDirectorySelect = (directoryPath) => {
    requestPOST('/open', {
        directory: directoryPath,
      },
      (result) => {
        onDirectoryOpen(result);
      },
      (message) => {
        alert(message);
      });
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
      <DirectorySelectorModal
        open={isModalOpen}
        onClose={handleModalClose}
        onDirectorySelect={handleDirectorySelect}
      />
    </>
  );
}

export default OpenDirectoryButton;
