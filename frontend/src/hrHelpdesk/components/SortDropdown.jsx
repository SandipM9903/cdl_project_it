import { useState, useRef, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

const SortDropdown = ({ sortOrder, setSortOrder }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (order) => {
    setSortOrder(order);
    setOpen(false); 
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border rounded px-3 py-2 font-content shadow-sm cursor-pointer bg-white hover:bg-gray-100"
      >
        <FaFilter />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-28 z-10">
          <button
            onClick={() => handleSelect("asc")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
              sortOrder === "asc" ? "font-bold text-blue-600" : ""
            }`}
          >
            Asc sort
          </button>
          <button
            onClick={() => handleSelect("desc")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
              sortOrder === "desc" ? "font-bold text-blue-600" : ""
            }`}
          >
            Desc sort
          </button>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;