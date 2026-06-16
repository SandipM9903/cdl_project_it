import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Service from "../../services/Service";

export default function OpportunityDetailsForm({
  setModalOpen,
  opportunity,
  onDivClick,
}) {
  const [rfpProcess, setRfpProcess] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState(() => {
  // We’ll use this ID to match against rfpProcess when it's loaded
  return opportunity?.rfpProcessId?.toString() || ""; // assumes opportunity has rfpProcessId
});

  const [selectedProcessName, setSelectedProcessName] = useState("");
  const [reason, selectedReason] = useState("");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  const handleReason = (e) => {
    selectedReason(e.target.value);
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;

    setSelectedProcessId(selectedId);

    const selectedProcess = rfpProcess.find((type) => {
      console.log(type.processId, selectedId); // Debugging output
      return type.processId === parseInt(selectedId);
    });
    

    setSelectedProcessName(selectedProcess ? selectedProcess.rfpProcess : "");
    console.log(selectedProcess);
  };
  

  const oppId = opportunity.oppId;

 useEffect(() => {
  Service.getRfpProcess()
    .then((response) => {
      const processList = response.data.data;
      setRfpProcess(processList);

      // If selectedProcessId is empty but opportunity has rfpProcess name
      if (!selectedProcessId && opportunity?.rfpProcess) {
        const matched = processList.find(
          (p) => p.rfpProcess === opportunity.rfpProcess
        );
        if (matched) {
          setSelectedProcessId(matched.rfpProcessId.toString());
          setSelectedProcessName(matched.rfpProcess);
        }
      }
    })
    .catch((error) => console.error(error));
}, []);

  const handleUpdate = () => {
    Service.rfpProcessUpdate(oppId, selectedProcessId, reason)
      .then(() => Service.getRfpByOppId(oppId))
      .then((getResponse) => {
        onDivClick(getResponse.data); // Update UI dynamically
        setModalOpen(false);
      })
      .catch(() => toast.error("Update failed!"));
  };
  

  return (
    <>
<div className="w-fit min-w-[320px] max-w-[420px] p-2 text-sm space-y-4">
  {/* RFP Process Row */}
  <div className="flex items-center justify-between">
    <label className="mr-2">Rfp Process</label>
    <select
      className="border border-gray-400 rounded-md bg-gray-100 px-2 py-1 w-[200px]"
      onChange={handleSelectChange}
      value={selectedProcessId}
    >
      <option disabled>Select RFP Process</option>
      {rfpProcess.map((type) => (
        <option key={type.processId} value={type.processId}>
          {type.rfpProcess}
        </option>
      ))}
    </select>
  </div>

  {/* Reason Field (conditionally rendered) */}
  {(selectedProcessName === "Won" || selectedProcessName === "Lost") && (
    <div className="flex items-center justify-between">
      <label className="mr-2">Reason</label>
      <input
        type="text"
        className="border border-gray-400 rounded-md px-2 py-1 w-[200px]"
        onChange={handleReason}
      />
    </div>
  )}

  {/* Buttons */}
  <div className="flex justify-end space-x-2 mt-4">
    <button
      className="bg-sky-500 px-2 py-1 rounded-md text-sky-50 hover:text-black"
      onClick={handleUpdate}
    >
      Update
    </button>
    <button
      className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-400"
      onClick={() => setModalOpen(false)}
    >
      Cancel
    </button>
  </div>
</div>

      <ToastContainer />
    </>
  );
}
