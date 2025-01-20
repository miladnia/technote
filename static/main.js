import * as sidebar from './modules/sidebar.js';
import * as searchBox from './modules/searchbox.js';
import * as editor from './modules/editor.js';

function init() {
    sidebar.init();
    searchBox.init();
    editor.init();
    initKeyboardShortcuts();
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', event => {
        // Shift + Ctrl + [
        if (event.ctrlKey && event.shiftKey && 'BracketLeft' === event.code) {
            sidebar.toggle();
        }
        // Shift + Ctrl + ]
        else if (event.ctrlKey && event.shiftKey && 'BracketRight' === event.code) {
            toggleTocPanel();
        }
        // Ctrl + /
        else if (event.ctrlKey && !event.shiftKey && 'Slash' === event.code) {
            searchBox.focus();
        }
        // Shift + Ctrl + /
        else if (event.ctrlKey && event.shiftKey && 'Slash' === event.code) {
            toggleShortcutsModal();
        }
        // Esc
        else if ('Escape' === event.code) {
            // blur any element that is focused now
            document.activeElement?.blur();
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
