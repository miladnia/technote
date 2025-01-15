"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
    initSidebar();
    initSearchBox();
    initEditor();
    initKeyboardShortcuts();
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', event => {
        // Shift + Ctrl + [
        if (event.ctrlKey && event.shiftKey && 'BracketLeft' === event.code) {
            toggleSidebar();
        }
        // Shift + Ctrl + ]
        else if (event.ctrlKey && event.shiftKey && 'BracketRight' === event.code) {
            toggleTocPanel();
        }
        // Shift + Ctrl + /
        else if (event.ctrlKey && event.shiftKey && 'Slash' === event.code) {
            focusSearchBox();
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
