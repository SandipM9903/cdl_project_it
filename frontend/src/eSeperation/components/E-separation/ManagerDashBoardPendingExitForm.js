import { useEffect, useState, useMemo } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { FaRegCircleXmark, FaArrowLeftLong } from "react-icons/fa6";
import { GrPrevious, GrNext } from "react-icons/gr";
import "./PendingExitForm.css";
import axios from "axios";
import Swal from "sweetalert2";
import { IoEnterOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { FaRegClock, FaArrowRight, FaArrowDown } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { BASE_URL } from '../../../config/Config';
function ManagerDashBoardPendingExitForm() {
  const [empDetails, setEmpDetails] = useState([]);
  const [resignDetails, setResignDetails] = useState([]);

  // const [imageUrl, setImageUrl] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isRetainSelected, setIsRetainSelected] = useState(false);
  const [noticePeriodWaiver, setNoticePeriodWaiver] = useState(false);
  const [openActionIds, setOpenActionIds] = useState([]); // store ids of employees whose action section is open


  const [requestId, setRequestId] = useState("");

  const [action, setAction] = useState(false);
  const [isOn, setIsOn] = useState(false);
  // const dropdownOptions = [
  //   { value: "Yes", label: "Yes" },
  //   { value: "No", label: "No" },
  // ];
  const dropdownOptions = useMemo(() => {
    return isRetainSelected
      ? [{ value: "N/A", label: "N/A" }]
      : [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ];
  }, [isRetainSelected]);

  const [managerApprovalDetails, setManagerApprovalDetails] = useState({
    expectedLastWorkingDay: "",
    managerRemarksToEmp: "",
    noticePeriodWaiver: false,
    managerRemarksToReviewer: "",
  });

  const handleExpectedLastWorkingDay = (e) => {
    setManagerApprovalDetails({
      ...managerApprovalDetails,
      expectedLastWorkingDay: e.target.value,
    });
  };

  const handleManagerRemarksToEmp = (e) => {
    setManagerApprovalDetails({
      ...managerApprovalDetails,
      managerRemarksToEmp: e.target.value,
    });
  };

  const handleDropdownChange = (selectedOptions) => {
    setManagerApprovalDetails({
      ...managerApprovalDetails,
      noticePeriodWaiver: selectedOptions.value === "Yes",
    });
  };

  const handleManagerRemarksToReviewer = (e) => {
    setManagerApprovalDetails({
      ...managerApprovalDetails,
      managerRemarksToReviewer: e.target.value,
    });
  };
  const handleforwardEmailsTo = (e) => {
    setManagerApprovalDetails({
      ...managerApprovalDetails,
      forwardEmailsTo: e.target.value,
    });
  };
  // const empCode = sessionStorage.getItem("UserId");
  const empCode = localStorage.getItem('empId');

  useEffect(() => {
    axios
      .get(
        `${BASE_URL}:9029/api/eSeparation/getResignDataByStatus/Pending/${empCode}`
      )
      .then((res) => {
        const resignData = res.data;
        console.log(resignData, "resignData");
        // Create an array of promises to fetch employee details for each resignation
        const employeeDetailPromises = resignData.map((resignDetail) =>
          axios.get(
            `${BASE_URL}:9029/api/eSeparation/getEmployee/${resignDetail.empCode}`
          )
        );
        // Wait for all promises to resolve
        Promise.all(employeeDetailPromises)
          .then((responses) => {
            // Extract the employee details from each response
            const empDetails = responses.map((response) => response.data);
            console.log(empDetails, "empDetailsempDetails");
            // Merge the resignation details with the corresponding employee details
            const mergedData = empDetails.map((empDetail) => {
              const matchingResignDetail = resignData.find(
                (resignDetail) =>
                  empDetail?.fileAndObjectTypeBean?.empResDTO?.empCode ===
                  resignDetail?.empCode
              );
              return { ...empDetail, ...matchingResignDetail };
            });
            console.log(mergedData, "mergeData");

            setEmpDetails(mergedData);
            // Call getImage for each empCode in mergedData
            // mergedData.forEach(empDetail => getImage(empDetail.empCode));
          })
          // .catch((error) => {
          //   console.log("Error fetching employee details", error);
          // });
          .catch(error => {
            if (error.response?.data?.message) {
              alert(error.response.data.message); // shows user-friendly message
            } else {
              alert("Something went wrong");
            }
          });

      })
      // .catch((error) => {
      //   console.log("No Resignation Details Fetched", error);
      // });
      .catch(error => {
        if (error.response?.data?.message) {
          alert(error.response.data.message); // shows user-friendly message
        } else {
          alert("Something went wrong");
        }
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "-";
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const initial = (name) => {
    if (name === null) {
      return;
    }
    const word = name;
    let [firstName, lastName] = word.split(" ");
    let firstLetter = firstName.charAt(0);
    let secondLetter = lastName ? lastName.charAt(0) : firstName.charAt(1);
    return `${firstLetter}${secondLetter}`;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(empDetails.length / itemsPerPage);

  // Calculate start and end indexes for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, empDetails.length); // Ensure endIndex doesn't exceed claims.length



  // Event handler for "Previous" button
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Event handler for "Next" button
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const popupStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  };

  const popupContentStyles = {
    top: 0,
    width: "80%",
    height: "90%",
    background: "white",
    position: "relative",
    overflowY: "auto",
    zIndex: 999,
  };



  const handleAccept = (employee, option) => {
    setIsPopupOpen(true);

 setTimeout(() => {
        alert('If you are aware of who will take the KT, or if a replacement is already in place, please add their email address in the forwarding email section.');
    }, 500); // delay 50ms so popup renders
    setSelectedEmployee(employee);
    setRequestId(employee.empCode);

    // Call fetchComment with employee.empCode directly
    fetchComment(employee.empCode);

    if (option === "retain") {
      setIsRetainSelected(true);
      setNoticePeriodWaiver("N/A");
    } else {
      setIsRetainSelected(false);
      setNoticePeriodWaiver("");
    }
  };

  const handleTakeAction = (employee) => {
    // Toggle the action section for this employee
    if (openActionIds.includes(employee.id)) {
      setOpenActionIds(openActionIds.filter(id => id !== employee.id)); // close
    } else {
      setOpenActionIds([...openActionIds, employee.id]); // open
    }

    // Store selected employee info if needed
    setSelectedEmployee(employee);
    setRequestId(employee.empCode);

    // Fetch comments
    fetchComment(employee.empCode);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setSearchQuery("");
    setSelectedEmployee(null);
  };

  const handleApprove = () => {
    if (!validateFields()) {
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Forward the Resignation to next level ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Accept",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${BASE_URL}:9029/api/eSeparation/approve/${selectedEmployee.id}`,
            managerApprovalDetails
          )
          .then(() => {
            Swal.fire(
              "Approved!",
              "The employee has been approved.",
              "success"
            );
            // window.location.reload();
            navigate('/Dashboard');
          })
          .catch((error) => {
            console.log("Error during posting", error);
          });
      }
    });
  };


  const handleRetain = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Retain ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Accept",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${BASE_URL}:9029/api/eSeparation/retainByMgr/${selectedEmployee.id}`,
            managerApprovalDetails
          )
          .then(() => {
            Swal.fire(
              "Approved!",
              "The employee has been retained.",
              "success"
            );
            window.location.reload();
          })
          .catch((error) => {
            console.log("Error during posting", error);
          });
      }
    });
  };

  const [validationErrors, setValidationErrors] = useState({
    managerRemarksToEmp: "",
  });

  const validateFields = () => {
    let isValid = true;
    const errors = {};

    if (!managerApprovalDetails.managerRemarksToEmp) {
      errors.managerRemarksToEmp = "Manager Remarks is required";
      isValid = false;
    } else {
      errors.managerRemarksToEmp = "";
    }

    setValidationErrors(errors);
    return isValid;
  };

  const navigate = useNavigate();

  function handlePrevious() {
    window.history.back();
  }

  console.log(empDetails, "++++++++");
  const [commentFetched, setCommentFetched] = useState([]);

  const empDetail =
    empDetails && empDetails?.length > 0
      ? empDetails.find((detail) => detail.empCode === requestId)
      : null;

  // Extract manager and HR comments with corresponding dates
  const mgrComments = empDetail?.mgrComments
    ? empDetail.mgrComments.split(",")
    : [];
  const mgrCommentDates = empDetail?.mgrCommentDateTime
    ? empDetail.mgrCommentDateTime.split(",")
    : [];

  const hrComments = empDetail?.hrComments
    ? empDetail.hrComments.split(",")
    : [];
  const hrCommentDates = empDetail?.hrCommentDateTime
    ? empDetail.hrCommentDateTime.split(",")
    : [];

  const empComments = empDetail?.empComments
    ? empDetail.empComments.split(",")
    : [];
  const empCommentDates = empDetail?.empCommentDateTime
    ? empDetail.empCommentDateTime.split(",")
    : [];


  const fetchComment = async (empCode) => {
    try {
      const response = await axios.get(
        `${BASE_URL}:9029/api/eSeparation/getMgrComments/${empCode}`
      );

      if (response.data) {
        setCommentFetched(response.data);
      } else {
        setCommentFetched(null);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };




  // Combine mgrComments and hrComments into a single array with author and date information
  const combinedComments = [
    ...mgrComments.map((comment, index) => ({
      comment,
      dateTime: mgrCommentDates[index],
      author:
        selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.reportingManager ||
        "Manager", // Use reportingManager's name
    })),
    ...hrComments.map((comment, index) => ({
      comment,
      dateTime: hrCommentDates[index],
      author: selectedEmployee?.hrName || "HR", // Use HR's name
    })),
    ...empComments.map((comment, index) => ({
      comment,
      dateTime: empCommentDates[index],
      author:
        selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.firstName ||
        "Employee", // Use Employee's name
    })),
    ...commentFetched
      .filter((comment) => {
        const commentText = comment?.comment?.trim(); // Extract the comment text
        return commentText; //&& commentText !== 'added a Comment';  // Ensure it's not a placeholder
      })
      .map((comment) => ({
        comment: comment.comment,
        dateTime: comment.dateTime,
        author: comment.author,
      })),
  ];

  const handleOpenPendingDoc = (docId) => {
    if (!docId) {
      Swal.fire({
        icon: "error",
        title: "File Not Available",
        text: "The requested document is not available.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    // const docViewerUrl = `/doc-viewerExit/${docId}`;
    // window.open(docViewerUrl, "_blank");
    window.open(`${BASE_URL}:9029/api/eSeparation/viewExitDocument/${docId}`, "_blank");
  };

  // Sort combinedComments by dateTime
  combinedComments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const [comment, setComment] = useState("");

  const postComment = () => {
    if (comment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }
    const url = `${BASE_URL}:9029/api/eSeparation/sendMgrComments/${requestId}`;
    const payload = {
      mgrComments: comment, // The comment text needs to be sent as 'mgrComments'
    };
    axios
      .post(url, payload, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        console.log(`Comment posted successfully:`, response.data);
        // Immediately update the combinedComments state to show the new comment
        const newComment = {
          comment,
          dateTime: new Date().toISOString(), // Set current date-time as the comment date
          author:
            selectedEmployee?.fileAndObjectTypeBean?.empResDTO
              ?.reportingManager || "Manager",
        };
        // Add the new comment to the state
        setCommentFetched((prevComments) => [newComment, ...prevComments]);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "custom-toast",
          },
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Message sent successfully!",
        });
        setComment("");
      })
      .catch((error) => {
        console.error(`Error posting comment:`, error);
        alert("Failed to post comment. Please try again.");
      });
  };

  const [showMore, setShowMore] = useState(false);

  // Toggle between showing all comments or only the first three
  const toggleShowMore = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  const visibleComments = showMore
    ? combinedComments.reverse().slice()
    : combinedComments.reverse().slice(0, 2);

  return (
    //     <div >
    //       <div>
    //         <div className="flex justify-center mb-8">
    //           <button
    //             className="bg-blue-400 py-2 px-10 rounded-md text-white font-semibold mt-8"
    //             onClick={() => {
    //               sessionStorage.setItem('workflowName', "E-Separation");
    //               // Example key-value
    //               navigate('/initiateExitByManager');
    //             }}
    //           >Initiate Exit For Employee</button></div>
    //         <div>
    //           {empDetails?.length === 0 ? (
    //             <div className="">
    //               <h2 className="text-xl font-semibold">There are no exit Requests</h2>
    //             </div>
    //           ) : (
    //             <>
    //               {empDetails?.map((employee) => (
    //                 <div
    //                   key={employee?.id}
    //                   className="px-4 sm:px-6 lg:px-8"
    //                 >
    //                   <div className='bg-[#FAFAFA] rounded-[34px] shadow-lg pt-4 pb-4 mb-6'>

    //                     {/* Top Header */}
    //                     <div className='flex items-center gap-3  pl-4 pb-3 mt-4'>
    //                       {/* Profile Section */}
    //                       {employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file ? (
    //                         <img
    //                           src={`data:${employee.fileAndObjectTypeBean.fileAndContentTypeBean.contentType};base64,${employee.fileAndObjectTypeBean.fileAndContentTypeBean.file}`}
    //                           className="h-10 w-10 rounded-full ml-6"
    //                           alt="ProfilePicture"
    //                         />
    //                       ) : (
    //                         <img
    //                           src="profile.webp"
    //                           className="h-10 w-10 rounded-full ml-6"
    //                           alt="ProfilePicture"
    //                         />
    //                       )}

    //                       <div>
    //                         <h1 className='text-sm font-medium'>
    //                           {employee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || "-"}
    //                         </h1>
    //                         <div className='flex flex-wrap items-center space-x-2 mt-1 text-xs text-[#49454F]'>
    //                           <span className='flex items-center'>
    //                             <MdOutlineMailOutline className='mr-1' />
    //                             {employee?.fileAndObjectTypeBean?.empResDTO?.emailId || "-"}
    //                           </span>
    //                         </div>
    //                       </div>


    //                     </div>

    //                     {/* 🔹 border after Overall Status */}
    //                     <div className="border-b mx-4"></div>

    //                     {/* Resignation Info */}
    //                     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:border-b mx-4'>
    //                       <div>
    //                         <h1 className='text-[14px] text-[#757575]'>Date of Resignation</h1>
    //                         <h1 className='text-[14px] font-medium text-[#000000]'>{formatDate(employee.dateOfResignation) || "-"}</h1>
    //                       </div>
    //                       <div>
    //                         <h1 className='text-[14px] text-[#757575]'>Requested Last Working Day</h1>
    //                         <h1 className='text-[14px] font-medium text-[#000000]'>{formatDate(employee.lastWorkingDayRequest) || "NA"}</h1>
    //                       </div>
    //                       <div>
    //                         <h1 className='text-[14px] text-[#757575]'>As per Notice Period (LWD)</h1>
    //                         <h1 className='text-[14px] font-medium text-[#000000]'>{formatDate(employee.lastWorkingDay) || "-"}</h1>
    //                       </div>
    //                       <div>
    //                         <h1 className='text-[14px] text-[#757575]'>Last Working Day (LWD)</h1>
    //                         <h1 className='text-[14px] font-medium text-[#000000]'>{formatDate(employee.expectedLastWorkingDay) || "-"}</h1>
    //                       </div>
    //                     </div>

    //                     {/* Reason and CTA */}
    //                     {/* Reason and Remarks */}
    //                     <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 px-4 py-2 mx-4'>
    //                       <div>
    //                         <h1 className='text-[14px] text-[#757575]'> Exit Type</h1>
    //                         <h1 className='text-[14px] font-medium text-[#000000]'>{employee.exitType || "-"}</h1>
    //                       </div>
    //                       <div>
    //                         <h1 className='text-[14px] text-[#757575]'>Reason for Exit</h1>
    //                         <h1 className='text-[14px] font-medium text-[#000000]'>{employee.reason || "-"}</h1>
    //                       </div>

    //                       <div>
    //                         <h1 className='text-[14px] text-[#757575]'>Uploaded Doc</h1>
    //                         <h1
    //                           onClick={() => handleOpenPendingDoc(selectedEmployee?.docId)}
    //                           className="text-[14px] font-medium text-red-500 hover:text-blue-700 cursor-pointer"
    //                           title="View Document"
    //                         >
    //                           Resignation.Doc
    //                         </h1>
    //                       </div>
    //                     </div>

    //                     {/* Take an Action Button */}
    //                     <div className='flex justify-end px-4 py-1 mx-4'>
    //                       <button
    //                         className='flex items-center gap-2 font-medium text-[#DC3545] hover:text-red-600 transition-colors'
    //                         onClick={() => handleTakeAction(employee)}
    //                       >
    //                         Take an Action {openActionIds.includes(employee.id) ? <FaArrowDown /> : <FaArrowRight />}
    //                       </button>
    //                     </div>



    //                     {openActionIds.includes(employee.id) && (
    //                       <div className="mt-2">
    //                         {/* First Row */}
    //                         <div className="grid grid-cols-1 lg:grid-cols-3 p-4 sm:mx-12">
    //                           {/* Notice Period Waiver */}
    //                           <div>
    //                             <label className="text-[14px] text-[#000000]">Notice Period Waiver</label>
    //                             <label className="flex items-center cursor-pointer mt-4">
    //                               <div className="relative">
    //                                 <input
    //                                   type="checkbox"
    //                                   checked={isOn}
    //                                   onChange={() => setIsOn(!isOn)}
    //                                   className="sr-only"
    //                                 />
    //                                 <div
    //                                   className={`w-20 h-8 rounded-full shadow-inner flex items-center px-4 text-sm font-semibold text-white transition-all duration-300 ${isOn
    //                                     ? "bg-green-500 justify-start"
    //                                     : "bg-red-500 justify-end"
    //                                     }`}
    //                                 >
    //                                   {isOn ? "Yes" : "No"}
    //                                 </div>
    //                                 <div
    //                                   className={`absolute top-0.5 left-0.5 w-[27px] h-[27px] bg-white rounded-full shadow transform transition-transform duration-300 ${isOn ? "translate-x-[50px]" : ""
    //                                     }`}
    //                                 ></div>
    //                               </div>
    //                             </label>
    //                           </div>

    //                           {/* New Last Working Day */}
    //                           <div>
    //                             <label className="text-[14px] text-[#000000]">New Last Working Day</label>
    //                             <input
    //                               type="date"
    //                               disabled={!isOn}
    //                               className={`w-full mt-2 h-[60px] rounded-full px-6 text-[16px] border shadow-sm ${isOn
    //                                 ? "border-black"
    //                                 : "border-gray-300 bg-gray-100 cursor-not-allowed"
    //                                 }`}
    //                             />
    //                           </div>

    //                           {/* Remarks to Employee */}
    //                           <div>
    //                             <label className="text-[14px] text-[#000000]">Remarks to Employee</label>
    //                             <input
    //                               type="text"
    //                               className="w-full mt-2 h-[60px] rounded-[15px] px-6 text-[16px] border border-black shadow-sm"
    //                             />
    //                           </div>
    //                         </div>

    //                         {/* Second Row */}
    //                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 sm:mx-12">
    //                           {/* Discussion Thread */}
    //                           <div>
    //                             <label className="text-[14px] text-[#000000]">Discussion Thread</label>
    //                             <button
    //                               onClick={() => setIsPopupOpen(true)}
    //                               className="w-full mt-2 h-[60px] rounded-[15px] px-6 text-[16px] border border-black shadow-sm bg-[#f7f7f7] hover:bg-[#e0e0e0]"
    //                             >
    //                               Open Discussion
    //                             </button>
    //                           </div>

    //                           {/* Additional Remarks */}
    //                           <div>
    //                             <label className="text-[14px] text-[#000000]">Additional Remarks</label>
    //                             <input
    //                               type="text"
    //                               className="w-full mt-2 h-[60px] rounded-[15px] px-6 text-[16px] border border-black shadow-sm"
    //                             />
    //                           </div>
    //                         </div>

    //                         {/* Buttons */}
    //                         <div className="flex flex-wrap justify-center gap-4 py-5 px-4 sm:px-0">
    //                           <button
    //                             className="text-[14px] rounded-[56px] py-2 px-5 font-semibold text-[#000000] border border-[#7A7A7A] bg-[#EBEBEB] hover:bg-[#c9c9c9]"
    //                             onClick={() =>
    //                               setOpenActionIds(openActionIds.filter((id) => id !== employee.id))
    //                             }
    //                           >
    //                             Cancel
    //                           </button>
    //                           <button className="text-[14px] rounded-[56px] py-2 px-5 font-semibold text-[#DC3545] border border-[#DC3545] bg-[#FFE9E8] hover:bg-[#ffd6d4]">
    //                             Retain
    //                           </button>
    //                           <button className="text-[14px] rounded-[56px] py-2 px-5 font-semibold text-white bg-[#DC3545] hover:bg-[#ec384a]">
    //                             Accept & Forward
    //                           </button>
    //                         </div>
    //                       </div>
    //                     )}

    //                     {/* Popup Modal */}
    //                     {isPopupOpen && (
    //                       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    //                         <div className="bg-white rounded-xl shadow-lg w-[600px] max-w-full p-6">
    //                           <h2 className="text-lg font-semibold mb-4">Discussion Thread</h2>

    //                           <div className="">
    //                             <div className="grid grid-cols-6 mt-3 items-center">
    //                               <div className="col-span-1 border-r-2 border-gray-300 h-full mr-3">
    //                                 <h1 className=" text-xs bg-blue-500 rounded-full h-10 w-10 text-center text-white font-semibold mt-3 pt-[8px]">
    //                                   {initial(
    //                                     selectedEmployee?.fileAndObjectTypeBean
    //                                       ?.empResDTO?.fullNameAsAadhaar
    //                                   )}
    //                                 </h1>
    //                               </div>
    //                               <div className="col-span-5">
    //                                 <h1 className="text-gray-800 text-xs font-semibold mt-2">
    //                                   {selectedEmployee?.fileAndObjectTypeBean
    //                                     ?.empResDTO?.fullNameAsAadhaar}{" "}
    //                                   <br></br>
    //                                   <span className="text-gray-500 text-xs font-normal">
    //                                     has Submitted
    //                                   </span>
    //                                 </h1>
    //                                 <h1 className="text-gray-500 text-xs">
    //                                   {selectedEmployee?.dateOfResignation}
    //                                 </h1>
    //                               </div>
    //                             </div>

    //                             <div className="flex p-4">
    //                               <input
    //                                 className="border border-gray-300 text-[#2E2F31] w-[80%] text-xs p-1"
    //                                 placeholder="Add your comment here....."
    //                                 value={comment}
    //                                 onChange={(e) => setComment(e.target.value)} />
    //                               <IoEnterOutline
    //                                 className="ml-[-2rem] text-gray-800 mt-[4px] text-xl cursor-pointer"
    //                                 onClick={postComment} // Post the comment on icon click
    //                               />
    //                             </div>
    //                             <div className="mt-3 px-4 text-sm">
    //                               {combinedComments.length > 0 ? (
    //                                 <div
    //                                   className={`overflow-y-auto ${showMore ? "h-52" : ""}`}
    //                                 >
    //                                   <ul>
    //                                     {visibleComments.map((entry, index) => (
    //                                       <li
    //                                         key={index}
    //                                         // style={{ marginBottom: "10px" }}
    //                                         className="text-xs"
    //                                       >
    //                                         <div className="grid grid-cols-6 items-center ">
    //                                           <div className="mr-2 col-span-1 border-r-2 border-gray-300 h-full ">
    //                                             <h1
    //                                               className={`text-sm ${index % 2 === 0
    //                                                 ? "bg-blue-500"
    //                                                 : "bg-orange-500"} rounded-full h-10 w-10 text-center text-white font-semibold pt-[8px]`}
    //                                             >
    //                                               {initial(entry.author)}
    //                                             </h1>
    //                                           </div>
    //                                           <div className="col-span-5">
    //                                             <p className="text-gray-600 text-xs font-normal">
    //                                               <strong>
    //                                                 {entry.author}
    //                                               </strong>{" "}
    //                                               added a{" "}
    //                                               <strong>Comment</strong>
    //                                             </p>
    //                                             <p className="text-gray-500 text-xs ">
    //                                               {entry.comment}
    //                                             </p>
    //                                             <p className="text-gray-400 text-xs font-medium mb-4">
    //                                               {entry.dateTime}
    //                                             </p>
    //                                           </div>
    //                                         </div>
    //                                       </li>
    //                                     ))}
    //                                   </ul>
    //                                 </div>
    //                               ) : (
    //                                 <div className="text-gray-800">
    //                                   No comments available
    //                                 </div>
    //                               )}
    //                               {combinedComments.length > 2 && (
    //                                 <div>
    //                                   <button
    //                                     onClick={toggleShowMore}
    //                                     className="text-blue-500 mt-4"
    //                                   >
    //                                     {showMore ? (
    //                                       <IoIosArrowDropup
    //                                         size={24}
    //                                         className="ml-36 mt-3 text-blue-600" />
    //                                     ) : (
    //                                       <IoIosArrowDropdown
    //                                         size={24}
    //                                         className="ml-36 mt-3 text-blue-600" />
    //                                     )}
    //                                   </button>
    //                                 </div>
    //                               )}

    //                               {/* Popup buttons */}
    //                               <div className="flex justify-center mt-4">
    //                                 <button
    //                                   onClick={() => setIsPopupOpen(false)}
    //                                   className="px-6 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
    //                                 >
    //                                   Close
    //                                 </button>
    //                               </div>
    //                             </div>
    //                           </div>
    //                         </div>
    //                       </div>
    //                     )}

    //                     {/* </div> */}

    //                   </div>
    //                 </div>
    //               ))}
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    // export default ManagerDashBoardPendingExitForm;

    <div className="container mx-auto z-50">
      <div className="flex">
        <div className="flex mx-14 gap-6">
          <button
            className="text-blue-500 lg:text-2xl md:text-lg text-base"
            onClick={handlePrevious}
          >
            <FaArrowLeftLong />
          </button>
          <h1 className="lg:text-xl md:text-xl whitespace-nowrap text-lg text-gray-900 font-semibold lg:mt-6 mt-10">
            Pending Exits
          </h1>

          <button
            className="bg-blue-400 py-2 px-10 rounded-md text-white font-semibold mt-8"
            onClick={() => {
              sessionStorage.setItem('workflowName', "E-Separation");
              // Example key-value
              navigate('/initiateExitByManager');
            }}
          >Initiate Exit For Employee</button>
        </div>
        <div className="">
          <div className="flex lg:text-base md:text-sm text-xs justify-between lg:mt-12 md:mt-[62px] mt-[85px] lg:ml-32 md:ml-16 -ml-10 mx-5 text-gray-500 font-semibold">
            <span className="pagination-info mr-3">
              {currentPage} - {totalPages} / {totalPages}
            </span>
            <div className="flex items-center lg:space-x-4 space-x-0">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <GrPrevious />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                <GrNext />
              </button>
            </div>
          </div>
        </div>
      </div>
      {empDetails?.length === 0 ? (
        <div className="mt-10 text-center text-gray-700">
          <h2 className="text-xl font-semibold">There are no exit Requests</h2>
        </div>
      ) : (
        <>
          {empDetails?.map((employee) => (
            //console.log(currentresignDetails+"::::::employeee")
            <div
              key={employee?.id}
              className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:mx-16 md:mx-8 mx-12 mt-6 border rounded-lg border-gray-500 p-2 shadow-bottom"
            >
              <div className="col-span-1 lg:w-48 md:w-full w-full text-center">
                <h1 className="text-gray-600 font-semibold">Employee Name</h1>
                <img
                  src={
                    employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file
                      ? `data:${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file}`
                      : 'profile.webp'
                  }
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // ✅ fallback default image
                  }}
                  className="h-[12vh] w-[14vh] rounded-[50%/50%] mt-3 mx-auto"
                  alt="ProfilePicture"
                />

                <h1 className="text-sm text-blue-700 font-semibold">
                  {employee?.fileAndObjectTypeBean?.empResDTO?.firstName}
                </h1>
                <h1 className="text-xs text-gray-600">
                  {employee?.fileAndObjectTypeBean?.empResDTO?.designationResDTO?.designationName === "SSD"
                    ? "Software Solutions & Delivery"
                    : employee?.fileAndObjectTypeBean?.empResDTO?.designationResDTO?.designationName}
                </h1>
                <h1 className="text-gray-800 text-xs">
                  {employee?.fileAndObjectTypeBean?.empResDTO?.empCode}
                </h1>
              </div>
              <div className="col-span-1 lg:-ml-7 lg:w-60 md:w-full w-full">
                <h1 className="mx-4 text-gray-600 font-semibold">Exit Info</h1>
                <div className="">
                  <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                    <h1 className="mt-2">Joining Date</h1>
                    <h1 className="mt-2 text-[#00007D]">
                      {formatDate(
                        employee?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining
                      ) || "-"}
                    </h1>
                  </div>
                  <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                    <h1 className="my-3">Resignation Date</h1>
                    <h1 className="my-3 text-[#00007D]">
                      {formatDate(employee?.dateOfResignation) || "-"}
                    </h1>
                  </div>
                  <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                    <h1>Last Working Date</h1>
                    <h1 className="text-[#00007D]">
                      {formatDate(employee?.lastWorkingDay) || "-"}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="col-span-1 lg:w-72 md:w-full w-full lg:-ml-2">
                <h1 className="text-gray-600 font-semibold mx-4">
                  Exit Reason
                </h1>
                <h1 className="text-gray-800 font-semibold text-sm mt-3  mx-6">
                  {employee?.reason || "-"}
                </h1>
                <h1 className="text-gray-600 text-sm ml-6">
                  {employee?.remarks || "-"}
                </h1>
              </div>
              <div className="col-span-1 flex lg:flex-col md:mt-4 md:flex-row flex-col gap-4 lg:mx-5 md:mx-40 md:whitespace-nowrap lg:whitespace-normal whitespace-normal  text-red-500 font-semibold text-right lg:mt-12">

                <button
                  className="border border-blue-400 py-1 mx-3 ml-10 lg:px-0 md:px-4 rounded-md inline-block text-blue-400 font-semibold text-center "
                  onClick={() => handleAccept(employee, "accept")}
                >
                  Proceed
                </button>
                <button
                  className="border inline-block border-red-500 py-1 lg:px-0 md:px-4 ml-9 mx-3 rounded-md"
                  onClick={() => handleAccept(employee, "retain")}
                >
                  Retain
                </button>
                {/* </div>
          <div className="col-span-1 ml-3 mt-36 "> */}

                {isPopupOpen && selectedEmployee && (

                  <div style={popupStyles} className="text-left">
                    <div style={popupContentStyles}>

                      <div>
                        <div className="p-3 text-right">
                          <button
                            className="text-red-500 text-xl"
                            onClick={handleClose}
                          >
                            <FaRegCircleXmark />
                          </button>
                        </div>
                        <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:mx-3 mx-0 p-4 shadow-bottom">
                          <div className="col-span-1 p-2  shadow-bottom">
                            <div className="py-3 text-center ">
                              {employee?.fileAndObjectTypeBean &&
                                employee?.fileAndObjectTypeBean?.fileAndContentTypeBean &&
                                employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file ? (
                                <img
                                  src={`data:${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${employee.fileAndObjectTypeBean.fileAndContentTypeBean.file}`}
                                  className="h-[12vh] w-[14vh] rounded-[50%/50%] mt-10 mx-auto"
                                  alt="ProfilePicture"
                                />
                              ) : (
                                <img
                                  src="profile.webp"
                                  alt="ProfilePicture"
                                  className="h-[12vh] w-[14vh] rounded-[50%/50%] mt-10 mx-auto"
                                />
                              )}
                              <h1 className="text-sm text-blue-500 font-bold break-words">
                                {employee?.fileAndObjectTypeBean?.empResDTO
                                  ?.firstName || "-"}
                              </h1>
                              <h1 className="text-xs text-gray-500 break-words">
                                {employee?.fileAndObjectTypeBean?.empResDTO
                                  ?.designationResDTO?.designationName || "-"}
                              </h1>
                            </div>
                            <div className="grid grid-cols-3 text-xs px-4 gap-2">
                              <div>
                                <h1 className="text-gray-500">Employee Id</h1>
                                <h1 className="text-[#00007D] break-words">
                                  {employee?.fileAndObjectTypeBean?.empResDTO
                                    ?.empCode || "-"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-gray-500">Contact No</h1>
                                <h1 className="text-[#00007D] break-words">
                                  {employee?.fileAndObjectTypeBean?.empResDTO
                                    ?.primaryContactNo || "-"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-gray-500">Email</h1>
                                <h1 className="text-[#00007D] break-words">
                                  {employee?.fileAndObjectTypeBean?.empResDTO
                                    ?.emailId || "-"}
                                </h1>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 text-xs p-4 gap-2">
                              <div>
                                <h1 className="text-gray-500">Department</h1>
                                <h1 className="text-[#00007D] break-words">
                                  {employee?.fileAndObjectTypeBean?.empResDTO
                                    ?.mainDeptResDTO?.mainDepartment || "-"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-gray-500">Reporting to</h1>
                                <h1 className="text-[#00007D] break-words">
                                  {employee?.fileAndObjectTypeBean?.empResDTO
                                    ?.reportingManager || "-"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-gray-500">Designation</h1>
                                <h1 className="text-[#00007D] break-words">
                                  {employee?.fileAndObjectTypeBean?.empResDTO
                                    ?.designationResDTO?.designationName || "-"}
                                </h1>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 text-xs p-4 gap-2">
                              <div>
                                <h1 className="text-gray-500">Location</h1>
                                <h1 className="text-[#00007D] break-words">
                                  {employee?.userDTO?.locationResDTO
                                    ?.locationName || "-"}
                                </h1>
                              </div>

                              <div>
                                <h1 className="text-gray-500">
                                  Project / Cost Centre
                                </h1>
                                <h1 className="text-[#00007D] break-words">
                                  {employee?.fileAndObjectTypeBean?.empResDTO
                                    ?.projectResDTO?.projectId || "-"}
                                </h1>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 text-xs p-4 gap-2">
                              <div>
                                <h1 className="text-gray-500">Joining Date</h1>
                                <h1 className="text-[#00007D] break-words">
                                  {formatDate(
                                    employee?.fileAndObjectTypeBean?.empResDTO
                                      ?.dateOfJoining
                                  ) || "-"}
                                </h1>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="col-span-1 flex gap-2 mx-10">
                              <h1 className="font-semibold text-base text-[#2E2F31] whitespace-nowrap">
                                Status :
                              </h1>
                              <h1
                                className={`font-semibold text-base whitespace-nowrap ${selectedEmployee?.overAllStatus ===
                                  "In progress"
                                  ? "text-[#DFCC22]"
                                  : selectedEmployee?.overAllStatus ===
                                    "Completed"
                                    ? "text-[#1FD127]"
                                    : "text-red-500"
                                  }`}
                              >
                                {selectedEmployee?.overAllStatus ===
                                  "Submitted to Manager"
                                  ? "Pending  With Manager"
                                  : selectedEmployee?.overAllStatus}
                              </h1>
                            </div>
                            <div className="mx-10 mt-3">
                              <h2 className="mb-1 text-base text-[#2E2F31] font-semibold ml-2">
                                Discussion Thread
                              </h2>
                              <div className="">
                                <div className="grid grid-cols-6 mt-3 items-center">
                                  <div className="col-span-1 border-r-2 border-gray-300 h-full mr-3">
                                    <h1 className=" text-xs bg-blue-500 rounded-full h-10 w-10 text-center text-white font-semibold mt-3 pt-[8px]">
                                      {initial(
                                        selectedEmployee?.fileAndObjectTypeBean
                                          ?.empResDTO?.firstName
                                      )}
                                    </h1>
                                  </div>
                                  <div className="col-span-5">
                                    <h1 className="text-gray-800 text-xs font-semibold mt-2">
                                      {
                                        selectedEmployee?.fileAndObjectTypeBean
                                          ?.empResDTO?.firstName
                                      }{" "}
                                      <br></br>
                                      <span className="text-gray-500 text-xs font-normal">
                                        has Submitted
                                      </span>
                                    </h1>
                                    <h1 className="text-gray-500 text-xs">
                                      {selectedEmployee?.dateOfResignation}
                                    </h1>
                                  </div>
                                </div>

                                <div className="flex p-4">
                                  <input
                                    className="border border-gray-300 text-[#2E2F31] w-[80%] text-xs p-1"
                                    placeholder="Add your comment here....."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                  />
                                  <IoEnterOutline
                                    className="ml-[-2rem] text-gray-800 mt-[4px] text-xl cursor-pointer"
                                    onClick={postComment} // Post the comment on icon click
                                  />
                                </div>
                                <div className="mt-3 px-4 text-sm">
                                  {combinedComments.length > 0 ? (
                                    <div
                                      className={`overflow-y-auto ${showMore ? "h-52" : ""
                                        }`}
                                    >
                                      <ul>
                                        {visibleComments.map((entry, index) => (
                                          <li
                                            key={index}
                                            // style={{ marginBottom: "10px" }}
                                            className="text-xs"
                                          >
                                            <div className="grid grid-cols-6 items-center ">
                                              <div className="mr-2 col-span-1 border-r-2 border-gray-300 h-full ">
                                                <h1
                                                  className={`text-sm ${index % 2 === 0
                                                    ? "bg-blue-500"
                                                    : "bg-orange-500"
                                                    } rounded-full h-10 w-10 text-center text-white font-semibold pt-[8px]`}
                                                >
                                                  {initial(entry.author)}
                                                </h1>
                                              </div>
                                              <div className="col-span-5">
                                                <p className="text-gray-600 text-xs font-normal">
                                                  <strong>
                                                    {entry.author}
                                                  </strong>{" "}
                                                  added a{" "}
                                                  <strong>Comment</strong>
                                                </p>
                                                <p className="text-gray-500 text-xs ">
                                                  {entry.comment}
                                                </p>
                                                <p className="text-gray-400 text-xs font-medium mb-4">
                                                  {entry.dateTime}
                                                </p>
                                              </div>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : (
                                    <div className="text-gray-800">
                                      No comments available
                                    </div>
                                  )}
                                  {combinedComments.length > 2 && (
                                    <div>
                                      <button
                                        onClick={toggleShowMore}
                                        className="text-blue-500 mt-4"
                                      >
                                        {showMore ? (
                                          <IoIosArrowDropup
                                            size={24}
                                            className="ml-36 mt-3 text-blue-600"
                                          />
                                        ) : (
                                          <IoIosArrowDropdown
                                            size={24}
                                            className="ml-36 mt-3 text-blue-600"
                                          />
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mx-3 mt-3 shadow-bottom">
                          <div>
                            <h1 className="font-semibold lg:text-base md:text-base text-sm mx-5 mt-4 pt-3 text-gray-700">
                              Employee Exit Details
                            </h1>
                          </div>
                          <div className="grid grid-cols-1">
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center px-5 font-normal lg:space-y-3 md:space-y-1 space-y-1">
                              <h1 className="mt-2 text-xs">
                                Date of Resignation
                              </h1>
                              <h1 className="border text-xs border-gray-400 py-1 mt-3 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
                                {formatDate(
                                  selectedEmployee?.dateOfResignation
                                ) || "="}
                              </h1>
                              <h1 className="text-xs">
                                Last working Date Requested
                              </h1>
                              <h1 className="border text-xs border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
                                {formatDate(
                                  selectedEmployee?.lastWorkingDayRequest
                                ) || "-"}
                              </h1>
                            </div>
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center font-normal px-5 lg:py-2 md:py-0 lg:space-y-1 md:space-y-1 space-y-1">
                              <h1 className="mt-4 text-xs">
                                LWD (As Per 90-Day Notice Period)
                              </h1>
                              <h1 className="border text-xs border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
                                {formatDate(selectedEmployee?.lastWorkingDay) ||
                                  "-"}
                              </h1>
                              <h1 className="text-xs">Reason for Exit</h1>
                              <h1 className="border text-xs border-gray-400 whitespace-normal py-1 px-2 lg:w-[170px] md:w-[140px] w-[130px]">
                                {selectedEmployee?.reason || "-"}
                              </h1>
                            </div>
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center lg:py-2 md:py-0  font-normal px-5 lg:pb-3 md:pb-1 pb-1 lg:-space-y-3 md:space-y-2 space-y-1">

                              <h1 className="text-xs">Resignation Mail PDF</h1>
                              <button
                                onClick={() => handleOpenPendingDoc(selectedEmployee?.docId)}
                                className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
                                title=" View Document"
                              >
                                <IoEyeSharp />
                              </button>
                              <h1 className="lg:whitespace-nowrap text-xs md:whitespace-nowrap whitespace-nowrap lg:mt-4 md:mt-0 ">
                                Additional Remarks
                              </h1>
                              <h1 className="text-wrap border text-xs border-gray-400 py-1 px-4 lg:w-[270px] md:w-[200px] w-[145px]">
                                {selectedEmployee?.remarks || "-"}
                              </h1>
                            </div>
                          </div>
                        </div>
                        <div className="mx-3 mt-3 shadow-bottom">
                          <div>
                            <h1 className="font-semibold  lg:text-base md:text-base text-sm mx-5 mt-4 pt-3 text-gray-700">
                              To be filled by Manager
                            </h1>
                          </div>

                          <div className="">
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 px-5 mt-2 items-center font-normal lg:space-y-4 md:space-y-2 space-y-1">
                              <h1 className="waiver whitespace-nowrap mt-4 text-xs">
                                Notice Period Waiver{" "}
                                <span className="text-lg text-red-500">*</span>
                              </h1>
                              <Dropdown
                                className="border border-gray-300 lg:w-44 text-xs md:w-40 w-32 px-2 p-1"
                                placeholder={"Select"}
                                options={dropdownOptions} // Dynamically update options
                                onChange={(selectedOption) => {
                                  // Map "Yes" to true, "No" to false
                                  const isYes = selectedOption?.value === "Yes";
                                  setManagerApprovalDetails({
                                    ...managerApprovalDetails,
                                    noticePeriodWaiver: isYes,
                                  });
                                }}
                                value={
                                  isRetainSelected
                                    ? noticePeriodWaiver
                                    : managerApprovalDetails.noticePeriodWaiver
                                      ? "Yes"
                                      : "No"
                                }
                                disabled={isRetainSelected} // Disable when Retain is selected
                              />


                              {/* <Dropdown
                            className="border border-gray-300 lg:w-44 text-xs md:w-40 w-32 px-2 p-1"
                            placeholder={"Select"}
                            options={dropdownOptions} // Dynamically update options
                            onChange={(selectedOption) => setNoticePeriodWaiver(selectedOption?.value)}
                            value={isRetainSelected ? noticePeriodWaiver : managerApprovalDetails.noticePeriodWaiver
                              ? "Yes"
                              : "No"}
                            disabled={isRetainSelected} // Disable when Retain is selected
                          /> */}
                              <h1 className="lg:whitespace-nowrap text-xs md:whitespace-nowrap whitespace-normal">
                                Remarks to Employee{" "}
                                <span className="text-lg text-red-500">*</span>
                              </h1>
                              <textarea
                                rows={2}
                                className="outline-none rounded-none text-xs border border-gray-400 w-full p-2 -ml-[6px]"
                                placeholder="Write Your Comments here"
                                onChange={handleManagerRemarksToEmp}
                              />
                              <div>
                                <h3 className="text-xs text-red-600 ml-52 -mt-3">
                                  {validationErrors.managerRemarksToEmp && (
                                    <span>
                                      {validationErrors.managerRemarksToEmp}
                                    </span>
                                  )}
                                </h3>
                              </div>
                            </div>
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 lg:py-3 md:py-0 text-gray-500 lg:text-base md:text-base text-xs px-5 mt-0 items-center font-normal lg:-space-y-3 md:space-y-2 space-y-1">
                              <h1 className="mt-0 text-xs">
                                Expected Last working Date
                              </h1>
                              <form action="/action_page.php">
                                <input
                                  type="date"
                                  className="border text-xs border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-2"
                                  value={
                                    !managerApprovalDetails.noticePeriodWaiver
                                      ? selectedEmployee?.lastWorkingDay
                                      : managerApprovalDetails.expectedLastWorkingDay
                                  }
                                  onChange={handleExpectedLastWorkingDay}
                                  disabled={!managerApprovalDetails.noticePeriodWaiver} // enabled only if noticePeriodWaiver is true
                                />

                                {/* <input
                                  type="date"
                                  className="border text-xs border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-2"
                                  value={noticePeriodWaiver !== "Yes" ? selectedEmployee?.lastWorkingDay : managerApprovalDetails.expectedLastWorkingDay}
                                  onChange={handleExpectedLastWorkingDay}
                                  disabled={noticePeriodWaiver !== "Yes"}
                                /> */}
                              </form>
                              <h1 className="whitespace-nowrap text-xs">
                                Remarks to Reviewer
                              </h1>
                              <textarea
                                rows={2}
                                className="outline-none -ml-1 text-xs rounded-none border border-gray-400 w-full p-2"
                                placeholder="Write Your Comments here"
                                onChange={handleManagerRemarksToReviewer}
                              />
                            </div>
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 lg:py-3 md:py-0 text-gray-500 lg:text-base md:text-base text-xs px-5 mt-0 items-center font-normal lg:-space-y-3 md:space-y-2 space-y-1">
                              
                              <h1 className="whitespace-nowrap text-xs">
                               Enter email address to forward mails to
                              </h1>
                              <input
                                rows={2}
                                className="outline-none -ml-1 text-xs rounded-none border border-gray-400 w-full p-2"
                                placeholder="Enter Email Id here"
                                onChange={handleforwardEmailsTo}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-center space-x-4 mt-5 mb-10">
                          <button
                            className="bg-[#686B6F] hover:bg-gray-600 text-white py-2 px-6"
                            onClick={handleClose}
                          >
                            Cancel
                          </button>
                          <button
                            className="hover:bg-[#1B5CAD] bg-[#2970c7] text-white py-2 px-6"
                            onClick={handleRetain}
                          >
                            Retain
                          </button>
                          <button
                            className="hover:bg-[#1FD127] bg-[#39f542] text-white py-2 px-6"
                            onClick={handleApprove}
                          >
                            Accept & Forward
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default ManagerDashBoardPendingExitForm;
