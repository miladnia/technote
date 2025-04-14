import { useRef } from "react";
import { Modal } from "@ui";

function SaveAsModal({ open, placeholder, onSave, onClose }) {
  const filenameInputRef = useRef(null);

  const handleSaveClick = () => {
    const filename = filenameInputRef.current.value;
    if (!filename) {
      alert("Please enter a filename.");
      return;
    }
    onSave(filename);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a new file"
      hasButtons
      buttonLabel="Save"
      onButtonClick={handleSaveClick}
    >
      <div className="mb-3">
        <label htmlFor="save-as-filename" className="col-form-label">
          Filename:
        </label>
        <input
          ref={filenameInputRef}
          placeholder={placeholder}
          className="form-control"
          id="save-as-filename"
          type="text"
          autoComplete="off"
          required
        />
      </div>
    </Modal>
  );
}

export default SaveAsModal;
