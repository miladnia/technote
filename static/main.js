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

function initSidebar() {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) {
        return;
    }

    const buttons = document.querySelectorAll('button[data-target="sidebar"]');
    buttons.forEach(btn => {
        btn.addEventListener('click', toggleSidebar);
    });

    sidebar.addEventListener('transitionend', event => {
        // TODO check `target`
        const headerBtn = document.getElementById('headerSidebarBtn');
        headerBtn.style.display = (0 === sidebar.offsetWidth) ? 'block' : 'none';
    });

    // Auto close the side bar if the main element has been clicked
    const mainElement = document.querySelector('main');
    mainElement.addEventListener('dblclick', () => {
        if (sidebar.offsetWidth <= 0) {
            return;
        }

        closeSidebar();
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.offsetWidth > 0) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.width = '0px';
    sidebar.classList.remove('full-width');
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('full-width');
    sidebar.style.removeProperty('width');
    // Hide the sidebar button in the header
    const headerBtn = document.getElementById('headerSidebarBtn');
    headerBtn.style.display = 'none';
}

function initSearchBox() {
    const searchBox = document.getElementById('searchBox');

    if (!searchBox) {
        return;
    }

    // On `#searchInput` focus
    document.getElementById('searchInput').addEventListener(
        'focus', onSearchInputFocus
    );
    // On `#searchForm` submit
    document.getElementById('searchForm').addEventListener(
        'submit', onSearchFormSubmit
    );
    // On `#searchBox` focus out
    searchBox.addEventListener(
        'focusout', onSearchBoxFocusOut
    );
}

function onSearchInputFocus(event) {
    const searchInput = event.currentTarget;
    searchInput.select();
    openSearchPanel();
}

async function onSearchFormSubmit(event) {
    event.preventDefault();
    const searchForm = event.currentTarget;
    await submitSearchQuery(searchForm);
}

function onSearchBoxFocusOut(event) {
    const searchBox = event.currentTarget;
    // Is it an Element inside searchBox?
    if (event.relatedTarget &&
        event.relatedTarget.closest(`#${searchBox.id}`)) {
            return;
    }
    closeSearchPanel();
}

function focusSearchBox() {
    document.getElementById('searchInput').focus();
}

async function submitSearchQuery(form) {
    renderSearchLoading();
    let result = [];

    try {
        result = await submitForm(form);
    } catch (error) {
        console.error(error.message);
    }

    if (!result.length) {
        renderSearchNoResult();
        return;
    }

    const query = form.q.value;
    renderSearchResult(query, result);
}

function renderSearchResult(query, result) {
    const template = document.getElementById('searchResultTemplate');
    const fragment = document.createDocumentFragment();
    // The ref node for the source items
    const srcItemRef = template.content.firstElementChild.cloneNode(true);

    result.forEach(entry => {
        // Create a source item
        const srcItem = srcItemRef.cloneNode(true);
        fragment.appendChild(srcItem);
        // Replace the placeholders
        srcItem.innerHTML = srcItem.innerHTML
            .replaceAll('[[ source ]]', entry['source']);

        // The ref node for the occurrence items
        const occItemRef = srcItem.querySelector('[data-item="occurrence"]');
        // Add the occurrences
        entry['occurrences'].forEach(occurrence => {
            // Create a occurrence item
            const occItem = occItemRef.cloneNode(true);
            occItemRef.parentNode.appendChild(occItem);
            // Replace the placeholders
            const markedText = occurrence.replaceAll(
                query, `<mark>${query}</mark>`
            );
            const fragUrl = entry['source_url'] + '#:~:text=';
            occItem.innerHTML = occItem.innerHTML
                .replaceAll('[[ occurrence ]]', markedText)
                .replaceAll('[[ url ]]', fragUrl);
        });
        // Remove the ref node
        occItemRef.remove();
    });

    // Remove the ref node
    srcItemRef.remove();
    openSearchPanel(fragment);
}

function renderSearchLoading() {
    const template = document.getElementById('searchLoadingTemplate');
    const templateNode = template.content.firstElementChild.cloneNode(true);
    openSearchPanel(templateNode);
}

function renderSearchNoResult() {
    const template = document.getElementById('searchNoResultTemplate');
    const templateNode = template.content.firstElementChild.cloneNode(true);
    openSearchPanel(templateNode);
}

function openSearchPanel(fragment) {
    const panel = document.getElementById('searchPanel');
    const container = panel.querySelector('.panel-container');
    
    if (!fragment && '' == container.textContent) {
        return;
    }

    if (fragment) {
        container.textContent = '';
        container.appendChild(fragment);
    }

    panel.style.display = 'block';
}

function closeSearchPanel() {
    const panel = document.getElementById('searchPanel');
    panel.style.display = 'none';
}

function initEditor() {
    ['noteCreatorBtn', 'noteEditorBtn'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        btn?.addEventListener('click', showEditor);
    });
}

function showEditor(event) {
    const editorSpec = exportEditorSpec(event.currentTarget);
    const editor = getOrCreateEditor(editorSpec);
    document.body.style.overflow = 'hidden';
    editor.style.display = 'block';
    const form = editor.querySelector('form');
    form.note_content.focus();
}

function exportEditorSpec(btn) {
    return {
        id: btn.getAttribute('data-editor-id'),
        sourceNote: btn.getAttribute('data-source-note'),
    };
}

function getOrCreateEditor(editorSpec) {
    let editor = document.getElementById(editorSpec.id);

    if (editor) {
        return editor;
    }

    const template = document.getElementById('noteEditorTemplate');
    editor = template.content.firstElementChild.cloneNode(true);
    document.body.appendChild(editor);
    editor.id = editorSpec.id;
    editor.style.display = 'none';
    const form = editor.querySelector('form');

    // Init the buttons
    const cancelBtn = editor.querySelector('button[data-editor-action="cancel"]');
    cancelBtn.addEventListener('click', () => {
        closeEditor(editor);
    });

    // Check if there is any source note to edit
    if (editorSpec.sourceNote) {
        disableFormElements(form);
        fetchText(editorSpec.sourceNote)
            .then(sourceContent => {
                form.note_content.value = sourceContent;
                form.action = editorSpec.sourceNote;
                disableFormElements(form, false);
            })
            .catch(error => {
                console.error(
                    `Could not read the source note from "${editorSpec.sourceNote}".`
                );
            });
    } else {
        // Open a modal and get some information to create a new note
        form.addEventListener('submit', event => {
            event.preventDefault();
            const modalElement = document.getElementById('noteCreatorModal');
            // Copy note content from editor's form to modal's form
            const modalForm = modalElement.querySelector('form');
            modalForm.note_content.value = form.note_content.value;
            // Show the modal
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.show();
            // Focus the first element of the modal form
            modalElement.addEventListener('shown.bs.modal', () => {
                modalForm.elements?.[0].focus();
            });
        });
    }

    return editor;
}

function closeEditor(editor) {
    editor.style.display = 'none';
    document.body.style.removeProperty('overflow');
}

async function submitForm(form) {
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData).toString();
    const response = await fetch(`${form.action}?${queryString}`);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
}

async function fetchUrl(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return response;
}

async function fetchText(url) {
    const response = await fetchUrl(url);
    return await response.text();
}

function disableFormElements(form, disabled = true) {
    // Disable all of the elements
    Array.from(form.elements).forEach(element => {
        // Ignore the buttons with `button` type.
        if ('button' === element.type) {
            return;
        }
        element.disabled = disabled
    });
}
