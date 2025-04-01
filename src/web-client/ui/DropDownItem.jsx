function DropDownItem({ onClick, children }) {
  return (
    <li>
      <button
        type="button"
        className="dropdown-item d-flex align-items-center"
        onClick={onClick}
      >
        {children}
      </button>
    </li>
  );
}

export default DropDownItem;
