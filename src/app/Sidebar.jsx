import { useState } from 'react';
import { ExplorerModal } from './helpers';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const grouped_notes = [];
  return (
    <aside
      class={`col-12 px-0 sidebar${isOpen ? ' visible-sidebar' : ''}`}
      style={!isOpen ? {width: '0px'} : {}}>
        <div className="row mx-0 flex-column h-100">
          <Header onClose={handleClose} />
          <nav className="col py-2 overflow-auto" aria-label="Notes">
            {grouped_notes.length ? <Notes grouped_notes={grouped_notes} /> : <UserGuide />}
          </nav>
        </div>
    </aside>
  );
}

function Notes({ grouped_notes }) {
  return (
    <ul className="ps-4 pe-3 py-2">
      {grouped_notes.map((directory, notes) => (
        <li className="py-2">
          <span className="list-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-folder" viewBox="0 0 16 16">
              <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
            </svg>
            <strong className="my-0 ms-2">{{ directory }}</strong>
          </span>
          <ul className="ps-3 py-2">
            {notes.map(note => (
              <li>
                <a href="{{ url_for('note', note_id=note.id) }}" title="{{ note.path }}">{note.name}</a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function UserGuide() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-50 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <p>No notes here!</p>
        <button className="btn btn-primary" onClick={showModal}>Open a directory</button>
        {<ExplorerModal open={isModalOpen} onClose={handleClose} />}
        <form action="" method="post">
          <input type="hidden" name="directories" value="{{ example_notes_dir }}" />
          <button className="btn btn-sm btn-secondary my-3" type="submit">
            Try with example notes
          </button>
        </form>
      </div>
    </div>
  );
}

function Header({ onClose }) {
  return (
    <nav className="col-auto py-2" aria-label="Sidebar navigation">
      <div className="row flex-nowrap justify-content-between align-items-center">
        <section className="col-auto h4 m-0"><span className="brand">TechNote</span></section>
        <section className="col-auto px-0">
          <button className="btn x-action-btn x-flat-btn p-2" onClick={onClose} type="button" data-make-hidden="true" aria-controls="sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-layout-sidebar-inset" viewBox="0 0 16 16">
              <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z"/>
              <path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
            </svg>
          </button>
        </section>
      </div>
    </nav>
  );
}

export default Sidebar;
