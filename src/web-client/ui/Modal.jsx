import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

function Modal({
  title,
  open,
  onClose,
  hasButtons = false,
  buttonLabel = "OK",
  onButtonClick = null,
  noPaddings = false,
  children,
}) {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  useEffect(() => {
    if (open) {
      // This is the first time the modal is opened
      setHasBeenOpened(true);
    }
  }, [open]);

  if (!hasBeenOpened) {
    return null;
  }

  return createPortal(
    <div
      className="modal"
      style={{ display: open ? "block" : "none" }}
      tabIndex="-1"
      aria-labelledby={title.replaceAll(" ", "-")}
      aria-hidden={!open ? "true" : undefined}
      aria-modal={open ? "true" : undefined}
      role={open ? "dialog" : undefined}
    >
      <div
        className="modal-backdrop x-modal-backdrop show"
        onClick={onClose}
      ></div>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={title.replaceAll(" ", "-")}>
              {title}
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className={clsx("modal-body", noPaddings && "p-0")}>
            {children}
          </div>
          {hasButtons && (
            <div className="modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onButtonClick}
                className="btn btn-primary"
              >
                {buttonLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
