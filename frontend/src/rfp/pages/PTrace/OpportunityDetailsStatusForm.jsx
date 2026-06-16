import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Service from "../../services/Service";
import { useUpdateRfpDocs } from "../../store/RfpStore";

export default function OpportunityDetailsStatusForm({
  setModalStatusOpen,
  opportunity,
  onDivClick,
}) {
  const [status, setStatus] = useState(() => opportunity?.rfpStatus || "");

  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const oppId = opportunity.oppId;
  const { setDocsUpdateStatus } = useUpdateRfpDocs();

  const rfpStatus = ["Open", "Closed", "Hold"];

  const handleStatus = (e) => {
    setStatus(e.target.value);
  };

  // const handleUpdateStatus = () => {
  //   Service.rfpStatusUpdate(oppId, status)

  //     .then((response) => {
  //       //toast.success("Updated successfully!");
  //       setModalStatusOpen(false);

  //       return Service.getRfpByOppId(oppId);
  //     })
  //     .then((getResponse) => {
  //       const opportunityData = getResponse.data;

  //       setSelectedOpportunityId(opportunityData.oppId);
  //       onDivClick(getResponse.data);
  //     })

  //     .catch((error) => toast.error("Update failed!"));
  // };

  const handleUpdateStatus = () => {
    Service.rfpStatusUpdate(oppId, status)
      .then(() => Service.getRfpByOppId(oppId))
      .then((getResponse) => {
        onDivClick(getResponse.data); // Update UI dynamically
        setModalStatusOpen(false);
        setDocsUpdateStatus(true);
        console.log("rerender",status);
      })
      .catch(() => toast.error("Update failed!"));
  };
  

  return (
    <>
      <div className="w-fit min-w-[300px] max-w-[420px] p-2 text-sm space-y-4">
  {/* Status Dropdown Row */}
  <div className="flex items-center justify-between">
    <label className="mr-2">RFP Status</label>
    <select
      className="border border-gray-200 rounded-md bg-gray-100 px-2 py-1 w-[200px]"
      onChange={handleStatus}
      value={status}
    >
      <option value="">Select RFP Status</option>
      {rfpStatus.map((type, index) => (
        <option key={index} value={type}>
          {type}
        </option>
      ))}
    </select>
  </div>

  {/* Buttons */}
  <div className="flex justify-end space-x-2">
    <button
      className="bg-sky-500 px-2 py-1 rounded-md text-sky-50 hover:text-black"
      onClick={handleUpdateStatus}
    >
      Update
    </button>
    <button
      className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-400"
      onClick={() => setModalStatusOpen(false)}
    >
      Cancel
    </button>
  </div>
</div>

      <ToastContainer />
    </>
  );
}
