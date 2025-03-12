import { createPortal } from 'react-dom';
import clsx from 'clsx';

function Modal({ title, open, onClose, noPaddings = false, children }) {
  return createPortal(
    <div
      className='modal'
      style={{display: open ? 'block' : 'none'}}
      tabIndex="-1"
      aria-labelledby={title.replaceAll(' ', '-')}
      aria-hidden={!open ? 'true' : undefined}
      aria-modal={open ? 'true' : undefined}
      role={open ? 'dialog' : undefined}
      >
        <div className="modal-backdrop x-modal-backdrop show" onClick={onClose}></div>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={title.replaceAll(' ', '-')}>
                {title}
              </h1>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className={clsx("modal-body", noPaddings && "p-0")}>
              {children}
            </div>
          </div>
        </div>
    </div>,
    document.body
  );
}

export default Modal;
