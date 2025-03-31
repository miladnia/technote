import { useState } from "react";
import clsx from "clsx";
import { NotesNav } from "./helpers";
import "./Sidebar.css";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <aside
      className={clsx(
        "col-12 px-0 sidebar",
        isSidebarOpen ? "visible-sidebar" : "invisible-sidebar"
      )}
    >
      <div className="row mx-0 flex-column h-100">
        <nav className="col-auto py-2" aria-label="Sidebar navigation">
          <div className="row flex-nowrap justify-content-between align-items-center">
            <section className="col-auto h4 m-0">
              <span className="brand">TechNote</span>
            </section>
            <section className="col-auto px-0">
              <button
                className="btn x-action-btn x-flat-btn p-2"
                onClick={handleClose}
                type="button"
                data-make-hidden="true"
                aria-controls="sidebar"
              >
                <i className="bi bi-layout-sidebar-inset fs-4"></i>
              </button>
            </section>
          </div>
        </nav>
        <nav className="col py-2 overflow-auto entries" aria-label="Notes">
          <NotesNav />
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
