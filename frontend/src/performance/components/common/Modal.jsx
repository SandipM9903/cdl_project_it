import React from "react";

const Modal = ({ title, isOpen, onClose, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg border border-gray-200 overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-visible">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;