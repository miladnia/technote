import * as utils from './utils.js';

async function toggle() {
    const list = await utils.fetchText('/explore');
    const explorerModal = document.getElementById('explorerModal');
    const modalBody = explorerModal.querySelector('.modal-body');
    modalBody.innerHTML = list;
    const modal = bootstrap.Modal.getOrCreateInstance(explorerModal);
    modal.toggle();
}

export { toggle };
