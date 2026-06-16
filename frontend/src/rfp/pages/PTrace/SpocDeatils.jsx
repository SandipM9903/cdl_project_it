
import React, { useState } from "react";
import SpocDetailForm from "./SpocDetailForm";
import { Box, Modal } from "@mui/material";
import { FiPlusCircle } from "react-icons/fi";

const style = {
  width: "20%",
  bgcolor: "white",
  position: "relative",
  left: "55%",
  top: "5%",
  maxHeight: "80vh",
  overflowY: "auto",
};

export default function SpocDetails({ opportunity, onDivClick, show }) {
  const [modalOpen, setModalOpen] = useState(false);
  if(!show) return null;

  return (
    <>
<div className="bg-sky-100 absolute top-full left-0 mt-1 z-50 border border-gray-200 rounded-md shadow-lg w-[250px]">
  {/* Header */}
  <div className=" rounded-t-md flex pb-1 border-b">
    <strong className="text-sky-400 font-semibold flex items-center gap-1 p-0.5 text-xs ml-[5px]">SPOCS</strong>
    <button onClick={() => setModalOpen(true)}>
      <FiPlusCircle className="ml-1 text-xs text-[#0ea5e9] cursor-pointer hover:text-gray-700" />
    </button>
  </div>

  {/* Scrollable Area Only Here */}
  <div className="max-h-[30vh] overflow-y-auto px-1 py-1 bg-sky-200">
     {/* Conditional rendering based on spocs array length */}
          {opportunity.spocs && opportunity.spocs.length > 0 ? (
            opportunity.spocs.map((spoc) => (
              <div key={spoc.spocId} className="relative h-[2rem] overflow-hidden group odd:bg-white even:bg-sky-200 border-b">
                <div className="absolute inset-0 flex items-center justify-between gap-2 px-2 rounded-md">
                  <div className="flex flex-col w-[9rem] text-[11px] leading-tight ">
                    <span className="text-gray-700 font-semibold truncate">
                      {spoc.spocName}
                      <span className="text-gray-300 font-medium group-hover:text-gray-500 ml-1">({spoc.spocTypes.spocType.substring(0, 12)})</span>
                    </span>
                    <span className="text-red-500 truncate">{spoc.spocEmail}</span>
                  </div>
                  <span className="text-[11px] text-gray-600 whitespace-nowrap">{spoc.spocContactNumber}</span>
                </div>
              </div>
            ))
          ) : (
            // This is the message that will be shown if spocs is empty
            <div className="p-2 text-center text-gray-500 text-xs">No SPOCs added.</div>
          )}
        </div>
      </div>


      {/* Modal for Adding SPOC */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
          <SpocDetailForm
            onDivClick={onDivClick}
            setModalOpen={setModalOpen}
            opportunity={opportunity}
          />
        </Box>
      </Modal>
    </>
  );
}
