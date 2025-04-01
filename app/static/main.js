import * as searchBox from './modules/searchbox.js';
import * as editor from './modules/editor.js';

function init() {
    searchBox.init();
    editor.init();
    initKeyboardShortcuts();
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.shiftKey) {
            // Shift + Ctrl + [
            if ('BracketLeft' === event.code) {
                event.preventDefault();
                // sidebar.toggle();
            }
            // Shift + Ctrl + ]
            else if ('BracketRight' === event.code) {
                event.preventDefault();
                toggleTocPanel();
            }

            return;
        }

        if (event.ctrlKey) {
            // Ctrl + /
            if ('Slash' === event.code) {
                event.preventDefault();
                toggleShortcutsModal();
            }

            return;
        }

        // When user is typing, disable any shortcut that triggers with a single character
        if ('INPUT' === event.target.tagName ||
            'TEXTAREA' === event.target.tagName) {
                return;
        }

        // Slash (/)
        if ('Slash' === event.code) {
            event.preventDefault();
            searchBox.focus();
        }
    });
}

function toggleTocPanel() {
    const panel = bootstrap.Offcanvas.getOrCreateInstance('#tocPanel');
    panel.toggle();
}

function toggleShortcutsModal() {
    const modal = bootstrap.Modal.getOrCreateInstance('#shortcutsModal');
    modal.toggle();
}

document.addEventListener('DOMContentLoaded', init);
