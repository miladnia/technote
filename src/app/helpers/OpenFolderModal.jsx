import { useRef, useState } from 'react';
import { requestPOST } from '../../utils';
import { FileExplorer } from '../../modules';
import { Modal } from '../../ui';

function OpenFolderModal({ open, onClose, onDirectoryOpen }) {
  const [navigatedDirectory, setNavigatedDirectory] = useState('');
  const directoryInput = useRef(null);

  const handleDirectoryChange = (path) => {
    setNavigatedDirectory(path);
  };

  const handleOpenClick = () => {
    const selectedDirectory = directoryInput.current.value;
    requestPOST('/open', {
        directory: selectedDirectory,
      },
      (result) => {
        onDirectoryOpen(result);
      },
      (message) => {
        alert(message);
      });
  };

  return (
    <Modal title="Open Folder" open={open} onClose={onClose} noPaddings>
      <div className="container-fluid position-relative">
        <section className="row position-sticky top-0 z-1 py-3 bg-primary">
          <div className="col">
            <input className="form-control" defaultValue={navigatedDirectory} ref={directoryInput} />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={handleOpenClick}>Open</button>
          </div>
        </section>
        <section className="row px-3">
          <FileExplorer apiUrl="/explore" onDirectoryChange={handleDirectoryChange} />
        </section>
      </div>
    </Modal>
  );
}

export default OpenFolderModal;
