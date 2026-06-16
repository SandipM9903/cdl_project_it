import React, { useRef, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
export default function ThreeDots({ onEdit, onDelete, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    const onScroll=()=>{
      onClose();
    };
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll",onScroll,true)
    return () => {document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", onScroll, true);
    }
  }, [onClose]);

  return (
    <div
      ref={ref}
      className=" bg-white border rounded shadow-md w-[60px] text-xs z-50"
    >
      <button onClick={onEdit} className="flex justify-between w-full px-1 py-1 text-left hover:bg-gray-100">
        <span className="">Edit</span>
        <span><CiEdit/></span>
      </button>
      <button onClick={onDelete} className="flex justify-between w-full px-1 py-1 text-left text-red-500 hover:bg-gray-100">
        <span>Delete</span>
        <span><MdDeleteOutline/></span>
      </button>
    </div>
  );
}
