import Modal from "bootstrap/js/src/modal.js";
import Dropdown from "bootstrap/js/src/dropdown.js";
import Offcanvas from "bootstrap/js/src/offcanvas.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Sidebar } from "./app";
import "./App.css";

globalThis.bootstrap = {
  Modal,
  Dropdown,
  Offcanvas,
};

function App() {
  return (
    <>
      <Sidebar />
    </>
  );
}

export default App;
