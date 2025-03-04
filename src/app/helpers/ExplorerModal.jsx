import { Explorer } from '../../modules';
import { Modal } from '../../ui';

function ExplorerModal({ open, onClose }) {
  return (
    <Modal title="Select a directory" open={open} onClose={onClose}>
      <Explorer apiUrl="/explore" />
    </Modal>
  );
}

export default ExplorerModal;
