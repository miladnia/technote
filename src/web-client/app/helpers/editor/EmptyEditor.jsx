import { useState } from "react";
import { MarkdownEditor } from "@modules";
import SaveAsModal from "./SaveAsModal.jsx";

function EmptyEditor({ open, onSave, onClose }) {
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
  const [content, setContent] = useState(null);

  const handleEditorSave = (content) => {
    setContent(content);
    setIsSaveAsModalOpen(true);
  };

  const handleSaveAs = (filename) => {
    onSave(content, filename);
  };

  return (
    <>
      <MarkdownEditor
        open={open}
        onSave={handleEditorSave}
        onClose={onClose}
      />
      <SaveAsModal
        open={isSaveAsModalOpen}
        placeholder="e.g. my_new_note.md"
        onSave={handleSaveAs}
        onClose={() => setIsSaveAsModalOpen(false)}
      />
    </>
  );
}

export default EmptyEditor;
