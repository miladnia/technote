import Modal from "bootstrap/js/src/modal.js";
import Dropdown from "bootstrap/js/src/dropdown.js";
import Offcanvas from "bootstrap/js/src/offcanvas.js";

globalThis.bootstrap = {
  Modal,
  Dropdown,
  Offcanvas,
};

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/bootstrap-mod.css";
import "./App.css";
import "./assets/note-content.css";

import { Sidebar } from "./app";

function App() {
  return (
    <>
      <Sidebar />
    </>
  );
}

export default App;
