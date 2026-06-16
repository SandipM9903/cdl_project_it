import { useEffect, useState } from "react";
import ClientDocument from "./ClientDocuments";
import ImpDates from "./ImpDates";
import Opportunities from "./Opportunities";
import DocumentTable from "./DocumentTable";
import OpportunityDeatils from "./OpportunityDetails";
import Remarks from "./Remarks";
import {  useUpdateRfpDocs } from "../../store/RfpStore";
import axios from "axios"


export default function PTrace() {
  const [activeDiv, setActiveDiv] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [opportunities, setOpportunities] = useState([]);


  const {setOpportunity}=useUpdateRfpDocs();

  const handleDivClick = (opportunity) => {

    
    setActiveDiv(opportunity.oppId);
    
    setSelectedOpportunity(opportunity);
    
    setOpportunity(opportunity)
  };




  const handleDeleteClicked=(data)=>{
    console.warn(data,"data deleted")
       if(data){
        setActiveDiv(null);
       }
  }


  

  const handleChildMessage = () => {
    setActiveDiv(null);
  }

  return (
    <div className="flex flex-col md:flex-row gap-0.5 w-full">

  <Opportunities
    onDivClick={handleDivClick}
    handleDeleteClicked={handleDeleteClicked}
    onFilterChange={handleChildMessage}
  />

  {activeDiv !== null && (
    <div className="flex flex-col md:flex-row gap-0.5 flex-1 overflow-hidden w-full">
      
      {/* Left Column */}
      <div className="flex flex-col flex-1 min-h-0 gap-0.5">
        <OpportunityDeatils
          onDivClick={handleDivClick}
          opportunity={selectedOpportunity}
        />
        <DocumentTable
          onDivClick={handleDivClick}
          opportunity={selectedOpportunity}
        />
        <ClientDocument
          onDivClick={handleDivClick}
          opportunity={selectedOpportunity}
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col flex-1 min-h-0 gap-0.5 overflow-y-auto">
        <ImpDates
          onDivClick={handleDivClick}
          opportunity={selectedOpportunity}
          key={selectedOpportunity["oppId"]}
        />
        <Remarks
          onDivClick={handleDivClick}
          opportunity={selectedOpportunity}
        />
      </div>

    </div>
  )}
</div>
  );
}
