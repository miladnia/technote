import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import Modal from 'bootstrap/js/src/modal.js';
import Dropdown from 'bootstrap/js/src/dropdown.js';
import Offcanvas from 'bootstrap/js/src/offcanvas.js';

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/bs-mod.css';
import './assets/layout.css';
import './assets/note-content.css';
import './index.css';

globalThis.bootstrap = {
  Modal,
  Dropdown,
  Offcanvas,
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
