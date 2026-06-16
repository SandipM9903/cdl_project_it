import React, { useEffect, useRef, useState } from "react";

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  className = "",
  inlineLabel = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${className}`} ref={dropdownRef}>
      <div className={`${inlineLabel ? "flex items-center gap-4" : ""}`}>
        {/* Inline Label */}
        {label && inlineLabel && (
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {label}
          </label>
        )}

        {/* Normal Label */}
        {label && !inlineLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        {/* Select Wrapper */}
        <div className={`relative ${inlineLabel ? "w-[180px]" : "w-full"}`}>
          {/* Select Box */}
          <div
            onClick={() => setOpen(!open)}
            className={`border rounded-lg px-4 py-2 text-sm cursor-pointer flex justify-between items-center
            ${
              open
                ? "border-red-500 ring-2 ring-red-200"
                : "border-gray-300 hover:border-red-400"
            }`}
          >
            <span className={`${value ? "text-gray-800" : "text-gray-400"}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>

            <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute left-0 top-[45px] w-full border border-gray-200 rounded-lg shadow-lg bg-white overflow-hidden z-50">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer transition
                    ${
                      opt.value === value
                        ? "bg-red-500 text-white"
                        : "hover:bg-red-50 text-gray-700"
                    }`}
                >
                  {opt.label}
                </div>
              ))}

              {options.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-400">
                  No options available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Select;