"use strict";

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
