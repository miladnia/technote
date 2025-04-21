import * as utils from './utils.js';

function init() {
    const btn = document.getElementById('noteEditorBtn');
    btn?.addEventListener('click', showEditor);
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

    utils.disableFormElements(form);
    utils.fetchText(editorSpec.sourceNote)
        .then(sourceContent => {
            form.note_content.value = sourceContent;
            form.action = editorSpec.sourceNote;
            utils.disableFormElements(form, false);
        })
        .catch(error => {
            console.error(
                `Could not read the source note from "${editorSpec.sourceNote}".`
            );
        });

    return editor;
}

function closeEditor(editor) {
    editor.style.display = 'none';
    document.body.style.removeProperty('overflow');
}

export { init };
