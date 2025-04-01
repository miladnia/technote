import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

function DropDownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="btn-group" ref={containerRef}>
      <button
        type="button"
        className="btn x-action-btn x-flat-btn dropdown-toggle x-no-default-icon p-2"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>
      <ul
        className={clsx("dropdown-menu", isOpen && "show")}
        style={
          isOpen
            ? {
                position: "absolute",
                inset: "0px 0px auto auto",
                margin: 0,
                transform: "translate(0px, 34px)",
              }
            : {}
        }
      >
        {children}
      </ul>
    </div>
  );
}

export default DropDownMenu;
