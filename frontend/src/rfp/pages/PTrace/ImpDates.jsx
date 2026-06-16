
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import Service from "../../services/Service";
// import { MdDelete, MdSend } from "react-icons/md";
// import { useUpdateRfpDocs } from "../../store/RfpStore";
// import { Tooltip } from "@mui/material";
// import DatePicker from "react-datepicker";
// import { CalendarIcon } from "@heroicons/react/24/outline";
// import "react-datepicker/dist/react-datepicker.css";

// export default function ImpDates({ opportunity, onDivClick }) {
//   const oppId = opportunity.oppId;
//   const [rfpDateName, setRfpDateName] = useState([]);
//   const [impDates, setImpDates] = useState({});
//   const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
//   const [datesUpdateStatus, setDatesUpdateStatus] = useState(null);
//   const [selectedDateId, setSelectedDateId] = useState("");
//   const [customDateName, setCustomDateName] = useState("");
//   const [dueDate, setDueDate] = useState(null); // JS Date
//   const [showCalendar, setShowCalendar] = useState(false);

//   const { setDocsUpdateStatus } = useUpdateRfpDocs();

//   useEffect(() => {
//     Service.getRfpDates()
//       .then((response) => {
//         // sanitize IDs & names (trim newlines/spaces)
//         const cleaned = (response.data.data || []).map((t) => ({
//           ...t,
//           rfpDateId: String(t.rfpDateId ?? "").trim(),
//           rfpDateName: t.rfpDateName ? String(t.rfpDateName).trim() : t.rfpDateName,
//         }));
//         setRfpDateName(cleaned);
//       })
//       .catch((error) => console.error(error));
//     // no automatic fetchDatesData loop here; parent provides `opportunity`
//   }, []);

//   const handleRfpDateName = (e) => {
//     const value = String(e.target.value ?? "").trim(); // trimmed ID
//     setSelectedDateId(value);
//     setImpDates((prev) => ({ ...prev, rfpDateId: value }));
//     // clear custom input when non-others selected
//     const sel = rfpDateName.find((t) => t.rfpDateId === value);
//     if (sel && sel.rfpDateName?.toLowerCase() !== "others") {
//       setCustomDateName("");
//     }
//   };

//   // const handleCalendarSelect = (date) => {
//   //   // date is a JS Date; backend expects LocalDate string -> use ISO date part
//   //   const iso = date ? date.toISOString().split("T")[0] : null;
//   //   setDueDate(date);
//   //   setImpDates((prev) => ({ ...prev, dueDate: iso }));
//   //   setShowCalendar(false);
//   // };
//   const handleCalendarSelect = (date) => {
//     if (!date) return;

//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
//     const day = String(date.getDate()).padStart(2, "0");

//     const localDate = `${year}-${month}-${day}`; // format YYYY-MM-DD
//     setDueDate(date);
//     setImpDates((prev) => ({ ...prev, dueDate: localDate }));
//     setShowCalendar(false);
//   };

//   const [empData, setEmpData] = useState({});

//   useEffect(()=>{
//     const empCode = localStorage.getItem("empId");
//     axios.get(`http://43.205.24.208:9020/employee/eCode/${empCode}`).then(res=>{
//       setEmpData({});
//       setEmpData(res.data);
//     }).catch(err=>{
//       alert(err);
//     })
//   },[])
//   const loggedInUserName = empData?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar;

//   const handleSubmit = () => {
//     if (!selectedDateId || !impDates.dueDate) {
//       alert("Please select a date type and pick a due date.");
//       return;
//     }

//     // find selected rfp meta by id
//     const selectedRfp = rfpDateName.find((type) => type.rfpDateId === selectedDateId);

//     const opportunityDates = {
//       ...impDates,
//       oppId: oppId,
//       // always send the (trimmed) rfpDateId to backend
//       rfpDateId: selectedDateId,
//       // description: if selected rfpName is "Others" use custom, else populate with rfpDateName
//       description:
//         selectedRfp?.rfpDateName?.toLowerCase() === "others"
//           ? customDateName
//           : selectedRfp?.rfpDateName || "",
//     };

//   //   Service.addImpDate(opportunityDates)
//   //     .then(() => Service.getRfpByOppId(oppId))
//   //     .then((getResponse) => {
//   //       const opportunityData = getResponse.data;
//   //       setSelectedOpportunityId(opportunityData.oppId);
//   //       onDivClick(opportunityData); // parent refresh
//   //       // reset
//   //       setSelectedDateId("");
//   //       setCustomDateName("");
//   //       setDueDate(null);
//   //       setShowCalendar(false);
//   //       setImpDates({});
//   //     })
//   //     .catch((err) => {
//   //       console.error(err);
//   //       alert("Failed to save important date");
//   //     });
//   // };
//  Service.addImpDate(opportunityDates)
//       .then(() => Service.getRfpByOppId(oppId))
//       .then((getResponse) => {
//         const opportunityData = getResponse.data;
//         setSelectedOpportunityId(opportunityData.oppId);
//         onDivClick(opportunityData); // parent refresh
//         // reset
//         setSelectedDateId("");
//         setCustomDateName("");
//         setDueDate(null);
//         setShowCalendar(false);
//         setImpDates({});
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("Failed to save important date");
//       });
//   };

//   const handleDelete = async (id) => {
//     try {
//       await Service.deleteDate(id);
//       alert("Date deleted successfully!");
//       setDocsUpdateStatus(true);
//       // parent will refresh via store / onDivClick if needed
//     } catch (error) {
//       console.error("Error deleting date:", error);
//       alert("Failed to delete date. Please try again.");
//     }
//   };

//   // helper to get selected rfp name for conditional rendering
//   const selectedRfpName = rfpDateName.find((t) => t.rfpDateId === selectedDateId)?.rfpDateName;

//   return (
//     <>
//       <div className="w-full h-[200px] bg-white rounded-md border border-gray-200 text-xs">
//         {/* HEADER */}
//         <div className="bg-sky-100 flex justify-between rounded-t-md items-center border-b px-2 py-[1px]">
//           <strong className="text-sky-400 font-semibold flex items-center">Important Dates</strong>

//           <div className="flex items-center gap-2">
//             <select
//               className="py-[3px] px-2 border rounded bg-gray-50 text-xs"
//               value={selectedDateId}
//               onChange={handleRfpDateName}
//             >
//               <option value="" disabled>
//                 Select Date
//               </option>
//               {rfpDateName.map((type) => (
//                 <option key={type.rfpDateId} value={type.rfpDateId}>
//                   {type.rfpDateName}
//                 </option>
//               ))}
//             </select>

//             {/* If selected option's name is Others -> show inline custom input */}
//             {selectedRfpName?.toLowerCase() === "others" && (
//               <input
//                 type="text"
//                 placeholder="Enter name"
//                 className="border px-2 py-1 rounded text-xs w-40"
//                 value={customDateName}
//                 onChange={(e) => setCustomDateName(e.target.value)}
//               />
//             )}

//             {/* Calendar */}
//             <div className="relative">
//               {/* <button
//                 type="button"
//                 onClick={() => setShowCalendar((s) => !s)}
//                 className="px-1 py-[3px] border rounded bg-white hover:bg-gray-100 flex items-center gap-1 text-xs"
//                 title="Pick due date"
//               >
//                 <CalendarIcon className="h-3.5 w-4 text-gray-600" />
//                 <span>{dueDate ? dueDate.toISOString().split("T")[0] : "Pick Date"}</span>
//               </button> */}
//               <button
//                 type="button"
//                 onClick={() => setShowCalendar((s) => !s)}
//                 className="px-1 py-[3px] border rounded bg-white hover:bg-gray-100 flex items-center gap-1 text-xs"
//                 title="Pick due date"
//               >
//                 <CalendarIcon className="h-3.5 w-4 text-gray-600" />
//                 <span>{dueDate ? dueDate.toLocaleDateString("en-CA") : "Pick Date"}</span>
//               </button>


//               {showCalendar && (
//                 <div className="absolute right-0 mt-1 z-20 bg-white shadow-lg">
//                   <DatePicker selected={dueDate} onChange={handleCalendarSelect} inline />
//                 </div>
//               )}
//             </div>

//             <Tooltip title="Submit">
//               <button
//                 onClick={handleSubmit}
//                 className="p-0.5 rounded bg-sky-500 text-white hover:bg-sky-600 flex items-center justify-center"
//                 title="Submit"
//               >
//                 <MdSend className="text-base" />
//               </button>
//             </Tooltip>
//           </div>
//         </div>

//         {/* DATES GRID */}
//         <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 px-1 py-2 min-h-[140px] max-h-[140px] overflow-auto">
//           {opportunity.opportunityDates
//             .filter((date) => new Date(date.dueDate) >= new Date())
//             .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
//             .concat(
//               opportunity.opportunityDates
//                 .filter((date) => new Date(date.dueDate) < new Date())
//                 .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
//             )
//             .map((date) => {
//               const dueDateObj = new Date(date.dueDate);
//               const currentDate = new Date();
//               const timeDifference = dueDateObj - currentDate;
//               const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

//               // Prefer description if available; otherwise show rfpDateName
//               const displayName = date.description || date.rfpDates?.rfpDateName || "Unknown";
//               const trimmedName = displayName.length > 12 ? displayName.slice(0, 9) + ".." : displayName;

//               return (
//                 <Tooltip key={date.opportunityDateId} title={`${displayName || "Unknown"}`}>
//                   <div className="relative group border border-gray-300 rounded-sm p-2 bg-white shadow-sm flex flex-col hover:shadow-md transition justify-start items-start h-[70px] text-left">
//                     <span className="text-gray-500 text-[11px] w-full leading-[10px] mt-[1px]" title={displayName}>
//                       {trimmedName}
//                     </span>

//                     <span className="mt-1 text-sky-500 text-xs font-medium p-0.5 rounded-lg bg-sky-50">
//                       {date.dueDate}
//                     </span>

//                     {timeDifference > 0 && (
//                       <span className="text-red-400 text-[10px] mt-1">
//                         ({daysLeft} {daysLeft === 1 ? "day" : "days"} left)
//                       </span>
//                     )}

//                     <button
//                       onClick={() => {
//                         handleDelete(date.opportunityDateId);
//                         setDatesUpdateStatus(true);
//                       }}
//                       className="absolute top-1 right-1 text-red-500 hover:text-red-800 hidden group-hover:flex"
//                       title="Delete"
//                     >
//                       <MdDelete className="text-base" />
//                     </button>
//                   </div>
//                 </Tooltip>
//               );
//             })}
//         </div>
//       </div>
//       {/* <ToastContainer /> */}
//     </>
//   );
// }



import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Service from "../../services/Service";
import { MdDelete } from "react-icons/md";
import { useUpdateRfpDocs } from "../../store/RfpStore";
import { Tooltip } from "@mui/material";

export default function ImpDates({ opportunity, onDivClick }) {
  const oppId = opportunity.oppId;
  const [rfpDateName, setRfpDateName] = useState([]);
  const [impDates, setImpDates] = useState("");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const [datesUpdateStatus, setDatesUpdateStatus] = useState(null);
  const [selectedDateId, setSelectedDateId] = useState("");

  useEffect(() => {
    Service.getRfpDates()

      .then((response) => {
        setRfpDateName(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetchDatesData();
  });

  const fetchDatesData = () => { };

  const handleRfpDateName = (e) => {
    const value = e.target.value;
    setSelectedDateId(value);
    setImpDates((prev) => ({ ...prev, rfpDateId: value }));
  };


  const handleRfpDueDate = (e) => {
    setImpDates({
      ...impDates,
      dueDate: e.target.value,
    });
  };

  // console.warn(impDates, "impDates>>>>>>>>>>>>>>>>>>>>");
  const [empData, setEmpData] = useState({});

  useEffect(() => {
    const empCode = localStorage.getItem("empId");
    axios.get(`http://43.205.24.208:9020/employee/eCode/${empCode}`).then(res => {
      setEmpData({});
      setEmpData(res.data);
    }).catch(err => {
      alert(err);
    })
  }, [])


  const loggedInUserName = empData?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar;

  const handleSubmit = () => {
    const opportunityDates = { ...impDates, oppId: oppId, remarksBy: loggedInUserName };

    Service.addImpDate(opportunityDates)
      .then((response) => {
        // toast.success("Added Imp date successfully!");

        return Service.getRfpByOppId(oppId);
      })
      .then((getResponse) => {
        const opportunityData = getResponse.data;

        setSelectedOpportunityId(opportunityData.oppId);
        onDivClick(getResponse.data);
        setSelectedDateId("");
        setImpDates((prev) => ({ ...prev, rfpDateId: "", oppDate: "" }));
      })
      .catch((err) => {
        alert(err);
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });

  };


  const { setDocsUpdateStatus } = useUpdateRfpDocs();

  const handleDelete = async (id) => {
    try {
      await Service.deleteDate(id);
      alert("File deleted successfully!");
      setDocsUpdateStatus(true);

      // Optionally refresh the document list by reloading or updating state
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full h-[200px] bg-white rounded-md border border-gray-200 text-xs">
        <div className="bg-sky-100 flex justify-between rounded-t-md items-center border-b pb-1 px-2 py-1">
          <strong className="text-sky-400 font-semibold flex items-center">Important Dates</strong>
             <div className="flex items-center gap-1 px-1 py-1 border-t">
          <select
            className="w-1/3 py-1 border rounded bg-gray-50"
            value={selectedDateId}
            onChange={handleRfpDateName}
          >
            <option value="" disabled>Select Date</option>
            {rfpDateName.map((type) => (
              <option key={type.rfpDateId} value={type.rfpDateId}>
                {type.rfpDateName}
              </option>
            ))}
          </select>

          <input
            type="date"
            id="oppDate"
            style={{ border: "0.5px solid #ccc" }}
            className="w-1/3 px-1 py-[3px] rounded bg-gray-50"
            onChange={handleRfpDueDate}
            min={new Date().toISOString().split("T")[0]}

          />

          <button
            className="w-1/3 py-1 bg-sky-500 rounded text-white"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        </div>
     
        <div className="grid grid-cols- sm:grid-cols-2 md:grid-cols-4 gap-2 px-1 py-2 min-h-[140px] max-h-[140px] overflow-auto">
          {opportunity.opportunityDates
            .filter((date) => new Date(date.dueDate) >= new Date())
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .concat(
              opportunity.opportunityDates
                .filter((date) => new Date(date.dueDate) < new Date())
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            )
            .map((impDates) => {
              const dueDate = new Date(impDates.dueDate);
              const currentDate = new Date();
              const timeDifference = dueDate - currentDate;
              const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

              const trimmedName =
                impDates.rfpDates.rfpDateName.length > 12
                  ? impDates.rfpDates.rfpDateName.slice(0, 9) + ".."
                  : impDates.rfpDates.rfpDateName;

              return (
                <Tooltip title={`${impDates.rfpDates.rfpDateName || "Unknown"}`}>
                  <div
                    key={impDates.opportunityDateId}
                    className="relative group border border-gray-300 rounded-sm p-1 bg-white shadow-sm flex flex-col hover:shadow-md transition justify-between items-center h-[70px] text-center"
                  >
                    {/* Date Name */}
                    <span
                      className="font-sm text-gray-500 text-[11px] truncate w-full"
                      title={impDates.rfpDates.rfpDateName}
                    >
                      {trimmedName}
                    </span>

                    {/* Date */}
                    <span className=" absolute mt-[20px] text-sky-500 text-xs font-medium p-0.5 rounded-lg bg-sky-50">
                      {impDates.dueDate}
                    </span>

                    {/* Days left */}
                    {timeDifference > 0 && (
                      <span className="font-xs absolute mt-[40px] text-red-200 group-hover:text-red-500 text-[10px] overflow-hidden">
                        ({daysLeft} {daysLeft === 1 ? "day" : "days"} left)
                      </span>
                    )}

                    {/* Delete Icon */}
                    <button
                      onClick={() => {
                        handleDelete(impDates.opportunityDateId);
                        setDatesUpdateStatus(true);
                      }}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-800 hidden group-hover:flex"
                      title="Delete"
                    >
                      <MdDelete className="text-base" />
                    </button>
                  </div>
                </Tooltip>
              );
            })}
        </div>

      </div>
      {/* <ToastContainer /> */}
    </>
  );
}