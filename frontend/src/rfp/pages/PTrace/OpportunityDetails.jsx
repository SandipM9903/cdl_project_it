import { Box, Modal } from "@mui/material";
import { useState,useEffect,useRef } from "react";
import OpportunityDetailsForm from "./OpportunityDetailsForm";
import OpportunityDetailsStatusForm from "./OpportunityDetailsStatusForm";
import { CiCircleInfo } from "react-icons/ci";
import { RiContactsBook3Fill } from "react-icons/ri";
import OpportunityDetails2 from "./OpportunityDetails2";
import SpocDetails from "./SpocDeatils";

export default function OpportunityDeatils({ opportunity, onDivClick }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatusOpen, setModalStatusOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSpoc, setShowSpoc] = useState(false);
  const wrapperRef = useRef(null);


  const style = {
    width: "30%",
    bgcolor: "white",
    position: "relative",
    left: "35%",
    top: "5%",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
  //       setShowInfo(false);
  //       setShowSpoc(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);can be used if we want to handle outside click

 useEffect(() => {
    // This will run whenever the 'opportunity' prop changes
    setShowInfo(false);
    setShowSpoc(false);
  }, [opportunity]); // Dependency array: the effect runs when 'opportunity' changes


  return (
    <>
      <div className="w-full sm:w-3/4 md:w-full lg:w-full 
      bg-white rounded-md border border-gray-200 text-xs
      h-[120px]">
        {/* header */}
       {/* header */}
<div className="bg-sky-100 flex justify-between rounded-t-md items-center border-b px-2 pb-1 mb-2 py-1">
  
  {/* Left side: Info + ShortDesc + Business Unit */}
  <div className="flex items-center gap-1 text-sky-400 font-semibold truncate">
    <CiCircleInfo
      className="text-lg hover:text-green-500 cursor-pointer"
      title="More Info"
      onClick={() => {
        setShowInfo((prev) => !prev);
        setShowSpoc(false);
      }}
    />
    <span className="truncate">{opportunity.oppShortDesc}</span>
    <span className="text-gray-500">/</span>
    <span className="truncate">{opportunity.rfpBusinessUnit.businessUnit}</span>
  </div>

  {/* Right side: Lead Practice Unit + Date */}
  <div className="flex items-center gap-1 text-gray-600 text-xs">
    <span>{opportunity.rfpLeadPracticeUnit.leadPracticeUnit}</span>
    <span className="text-gray-400">/</span>
    <span>{opportunity.oppDate}</span>
  </div>

</div>


        {/* First line */}
        <div className="flex justify-between items-center gap-1 text-gray-700 mb-2">
          <div className="flex gap-2 items-center text-gray-700">
          <span className="font-medium bg-sky-50 text-sky-500 truncate" title="Customer Name">{opportunity.customerName}</span>
          <span className="text-gray-500">/</span>
          <span className="truncate bg-green-50 text-green-500" title="Customer Type">{opportunity.custType.custType}</span>
          </div>
          <div className="flex gap-2">
              <button
                  className="px-2 py-1 border rounded text-xs bg-gray-100 hover:bg-gray-200"
                  onClick={() => setModalOpen(true)}
                >
                  {opportunity.rfpProcess.rfpProcess} ▼
              </button>
              <button
                  className={`px-2 py-1 border rounded text-xs text-white ${
                    opportunity.rfpStatus === "Open" ? "bg-green-500" : "bg-red-500"
                  }`}
                  onClick={() => setModalStatusOpen(true)}
                >
                  {opportunity.rfpStatus} ▼
              </button>
        </div>
          
        </div>

        {/* Dropdowns */}
        

       

        {/* Additional Details */}
        <div className="flex flex-wrap gap-3 text-gray-800 relative inline-block px-1 " ref={wrapperRef}>
            
                <div className="flex gap-2">
                    
                    <button title="Spoc" onClick={() => {
                    setShowSpoc((prev) => !prev);
                    setShowInfo(false);
                    }}>
                    <RiContactsBook3Fill className="text-xl hover:text-sky-500" />
                    </button>
                </div>

            {/* Show components as dropdowns/panels */}
                <OpportunityDetails2 opportunity={opportunity} show={showInfo} />
                <SpocDetails opportunity={opportunity} onDivClick={onDivClick} show={showSpoc} />
          </div>
        </div>
  

      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
          <OpportunityDetailsForm
            setModalOpen={setModalOpen}
            opportunity={opportunity}
            onDivClick={onDivClick}
          />
        </Box>
      </Modal>

      <Modal open={modalStatusOpen} onClose={() => setModalStatusOpen(false)}>
        <Box sx={style}>
          <OpportunityDetailsStatusForm
            setModalStatusOpen={setModalStatusOpen}
            opportunity={opportunity}
            onDivClick={onDivClick}
          />
        </Box>
      </Modal>
    </>
  );
}
