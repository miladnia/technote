"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
    initSidebar();
    initSearchForm();
    initEditor();
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) {
        return;
    }

    const buttons = document.querySelectorAll('button[data-target="sidebar"]');
    buttons.forEach(btn => {
        btn.addEventListener('click', toggle);
    });

    sidebar.addEventListener('transitionend', (event) => {
        // TODO check `target`
        const headerBtn = document.getElementById('headerSidebarBtn');
        headerBtn.style.display = (0 === sidebar.offsetWidth) ? 'block' : 'none';
    });

    // Auto close the side bar if the main element has been clicked
    const mainElement = document.querySelector('main');
    mainElement.addEventListener('dblclick', (event) => {
        if (sidebar.offsetWidth <= 0) {
            return;
        }

        close();
    });

    function toggle() {
        if (sidebar.offsetWidth > 0) {
            close();
        } else {
            open();
        }
    }

    function close() {
        sidebar.style.width = '0px';
        sidebar.classList.remove('full-width');
    }

    function open() {
        sidebar.classList.add('full-width');
        sidebar.style.removeProperty('width');
        // Hide the sidebar button in the header
        const headerBtn = document.getElementById('headerSidebarBtn');
        headerBtn.style.display = 'none';
    }
}

function initSearchForm() {
    const searchBox = document.getElementById('searchBox');

    if (!searchBox) {
        return;
    }

    // On submit
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        await submitSearchQuery(searchForm);
    });

    // On focus out
    searchBox.addEventListener('focusout', (event) => {
        if (event.relatedTarget === searchBox ||
            event.relatedTarget === searchInput) {
                return;
        }

        // Fixed: links does not working
        window.setTimeout(() => {
            closeSearchPanel();
        }, 500);
    });
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

    renderSearchResult(result);
}

function renderSearchResult(result) {
    const template = document.getElementById('searchResultTemplate');
    const fragment = document.createDocumentFragment();

    // The ref node for the source items
    const srcItemRef = template.content.firstElementChild.cloneNode(true);

    result.forEach(source => {
        // Create a source item
        const srcItem = srcItemRef.cloneNode(true);
        fragment.appendChild(srcItem);
        // Replace the placeholders
        srcItem.innerHTML = srcItem.innerHTML
            .replaceAll('[[ source ]]', source['source']);

        // The ref node for the occurrence items
        const occItemRef = srcItem.querySelector('[data-item="occurrence"]');
        // Add the occurrences
        source['occurrences'].forEach(occurrence => {
            // Create a occurrence item
            const occItem = occItemRef.cloneNode(true);
            occItemRef.parentNode.appendChild(occItem);
            // Replace the placeholders
            occItem.innerHTML = occItem.innerHTML
                .replaceAll('[[ occurrence ]]', occurrence['text'])
                .replaceAll('[[ link ]]', occurrence['link']);
        });
        // Remove the ref node
        occItemRef.remove();
    });

    // Remove the ref node
    srcItemRef.remove();
    showSearchPanel(fragment);
}

function renderSearchLoading() {
    const template = document.getElementById('searchLoadingTemplate');
    const templateNode = template.content.firstElementChild.cloneNode(true);
    showSearchPanel(templateNode);
}

function renderSearchNoResult() {
    const template = document.getElementById('searchNoResultTemplate');
    const templateNode = template.content.firstElementChild.cloneNode(true);
    showSearchPanel(templateNode);
}

function showSearchPanel(fragment) {
    const panel = document.getElementById('searchPanel');
    const container = panel.querySelector('.panel-container');
    container.textContent = '';
    container.appendChild(fragment);
    panel.style.display = 'block';
}

function closeSearchPanel() {
    const panel = document.getElementById('searchPanel');
    panel.style.display = 'none';
    const container = panel.querySelector('.panel-container');
    container.textContent = '';
}

function initEditor() {
    ['noteCreatorBtn', 'noteEditorBtn'].forEach((btnId) => {
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
