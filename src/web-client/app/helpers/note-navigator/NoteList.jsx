function NoteList({ notes, onNoteClick }) {
  const handleClick = (event, note) => {
    event.preventDefault();
    onNoteClick(note);
  };

  return (
    <ul className="ps-3 py-2">
      {notes.map((note) => (
        <li key={note.id}>
          <a
            href={note.url}
            title={note.location_on_disk}
            onClick={(event) => handleClick(event, note)}
          >
            {note.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
