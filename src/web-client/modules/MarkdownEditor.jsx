import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

function MarkdownEditor({ open, defaultContent, onSave, onClose }) {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const contentInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      // This is the first time the editor is opened
      setHasBeenOpened(true);
    }
  }, [open]);

  if (!hasBeenOpened) {
    return null;
  }

  const handleSave = () => {
    const content = contentInputRef.current.value;
    onSave(content);
  };

  return createPortal(
    <div className={clsx("note-editor", !open && "d-none")} tabIndex="1">
      <textarea
        ref={contentInputRef}
        defaultValue={defaultContent}
        placeholder="Write something..."
        required
      />
      <nav className="vertical-sticky position-fixed end-0 me-3 me-md-5 gap-2">
        <button
          className="btn x-action-btn"
          type="button"
          onClick={handleSave}
        >
          <i className="bi bi-check-lg fs-5"></i>
        </button>
        <button className="btn x-action-btn" type="button" onClick={onClose}>
          <i className="bi bi-x-lg fs-5"></i>
        </button>
      </nav>
    </div>,
    document.body
  );
}

export default MarkdownEditor;
