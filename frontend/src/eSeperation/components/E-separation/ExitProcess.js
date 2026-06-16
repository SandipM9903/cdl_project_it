import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BsArrowRightSquare } from "react-icons/bs";
import ExitFormFNF from "./ExitFormFNF";
import { IoEyeSharp } from "react-icons/io5";
import ViewExitInterviewForm from './ViewExitInterviewForm';
import { FaRegCircleXmark } from "react-icons/fa6";
import { IoEnterOutline } from "react-icons/io5";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import { FaRegClock, FaArrowRight } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { BASE_URL } from '../../../config/Config';

function ExitProcess() {
  const [empDetails, setEmpDetails] = useState([]);
  const [comment, setComment] = useState("");
  // const empCode = sessionStorage.getItem("UserId");
  const hrStatus = "Approved";
  const empCode = localStorage.getItem("empId");
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [viewInterviewOpen, setViewInterviewOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEmployee, setselectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchDetails = () => {
    axios
      .get(
        `${BASE_URL}:9029/api/eSeparation/getResignDataByHrStatus/${hrStatus}/${empCode}`
      )
      .then((res) => {
        const resignData = res.data;
        console.log(resignData, "resignDataresignData");
        resignData.map((resign) =>
          axios
            .get(`${BASE_URL}:9029/api/eSeparation/getOverAllStatus/${resign.wfSeqId}`)
            .then(() => {
              console.log("ok");
            })
            .catch((error) => {
              console.log("Error during Fetching", error);
            })
        );
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

            // Merge the resignation details with the corresponding employee details
            const mergedData = empDetails.map((empDetail) => {
              const matchingResignDetail = resignData.find(
                (resignDetail) =>
                  empDetail.fileAndObjectTypeBean.empResDTO.empCode ===
                  resignDetail.empCode
              );
              return { ...empDetail, ...matchingResignDetail };
            });

            setEmpDetails(mergedData);

            // Call getImage for each empCode in mergedData
            //  mergedData.forEach(empDetail => getImage(empDetail.empCode));
          })
          .catch((error) => {
            console.log("Error fetching employee details", error);
          });
      })
      .catch((error) => {
        console.log("No Resignation Details Fetched", error);
      });
  };
  console.log(empDetails, "empDetailsempDetails");

const getLabel = (emp) => {
  const waiver = emp?.noticePeriodWaiver;
  const waiverByHr = emp?.noticePeriodWaiverByHr; 
  const r1Status = emp?.r1Status; 

  if (!waiver && !waiverByHr && r1Status === "Pending") {
    return "Last Working Date";
  }

  if (!waiver && !waiverByHr) {
    return "Last Working Date Approved by R1 ";
  }

  if (waiver && !waiverByHr) {
    return "Last Working Date Approved by R1";
  }

  if (!waiver && waiverByHr) {
    return "Last Working Date Approved by HR";
  }

  if (waiver && waiverByHr) {
    return "Last Working Date Approved by HR";
  }

  return "-";
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
  const handleClose = () => {
    setIsPopupOpen(false);
    // setselectedEmployee(null);
  };
  const handleStayInterview = (employee) => {
    console.log("Stay Interview Clicked", employee);

    setSelectedResignation(employee);
    setViewInterviewOpen(true);
  };
  const [showMore, setShowMore] = useState(false);

  // Toggle between showing all comments or only the first three
  const toggleShowMore = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  // const viewDetails = (employee) => {
  //   setIsPopupOpen(true);
  //   setselectedEmployee(employee);
  //   console.log("selectedEmployee:::::::" + JSON.stringify(employee));
  //     console.log("Selected Resignation::::", selectedResignation);

  // };
  const viewDetails = (employee) => {
    console.log("View Details clicked:", employee); // ✅ should appear in console
    setselectedEmployee(employee);
    setIsPopupOpen(true);
  };
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


  const postComment = () => {
    // Ensure the comment is not empty
    if (comment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    // Define the API URL for posting the comment
    const url = `${BASE_URL}:9029/api/eSeparation/sendHrComments/${selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.empCode}`; // Adjusting the URL

    // Prepare the payload to match the expected format
    const payload = {
      hrComments: comment, // The comment text needs to be sent as 'mgrComments'
    };

    // Make the axios POST request with the correct data structure
    axios
      .post(url, payload, { headers: { "Content-Type": "application/json" } }) // Sending JSON data
      .then((response) => {
        console.log(`Comment posted successfully:`, response.data);

        // Immediately update the combinedComments state to show the new comment
        const newComment = {
          comment,
          dateTime: new Date().toISOString(), // Set current date-time as the comment date
          author: empDetails?.hrName || "HR",
        };

        // Add the new comment to the state
        setCommentFetched((prevComments) => [newComment, ...prevComments]);

        // Use SweetAlert for success notification
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

        // Clear the comment input after successful submission
        setComment("");
        // Optionally re-fetch comments if needed
        // fetchComment();
      })
      .catch((error) => {
        console.error(`Error posting comment:`, error);
        alert("Failed to post comment. Please try again.");
      });
  };

  const [commentFetched, setCommentFetched] = useState([]);
  console.log(empDetails, "empDetails>>>>>>>>>>>>");

  const empDetail =
    empDetails && empDetails.length > 0
      ? empDetails.find((detail) => detail === detail)
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

  const fetchComment = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}:9029/api/eSeparation/getHrComments/${empDetails.empCode}`
      );
      setCommentFetched(response.data.comments || []); // Adjust based on actual API response structure
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Combine mgrComments and hrComments into a single array with author and date information
  // Combine the comments dynamically in the render logic

  useEffect(() => {
    fetchDetails();
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

  // const releaseFNF = () =>{
  //     axios.put(`http://localhost:9029/api/eSeparation/releaseFNF/${id}`)
  // }
  // const releaseFNF = (employee) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to Release FNF Form?",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     cancelButtonText: "No",
  //     confirmButtonText: "Yes",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       axios
  //         .put(`http://localhost:9029/api/eSeparation/releaseFNF/${employee?.id}`)
  //         .then(() => {
  //           console.log("Released");
  //           // fetchDetails();
  //         })
  //         .catch((error) => {
  //           console.log("Error during posting", error);
  //         });
  //     }
  //   });
  // };
  const combinedComments = [
    ...empComments.map((comment, index) => ({
      comment,
      dateTime: empCommentDates[index],
      author:
        empDetail?.fileAndObjectTypeBean?.empResDTO?.firstName || "Employee", // Use Employee's name
    })),
    ...mgrComments.map((comment, index) => ({
      comment,
      dateTime: mgrCommentDates[index],
      author:
        empDetail?.fileAndObjectTypeBean?.empResDTO?.reportingManager ||
        "Manager",
    })),
    ...hrComments.map((comment, index) => ({
      comment,
      dateTime: hrCommentDates[index],
      author: empDetail?.hrName || "HR",
    })),

    // Filter out comments that contain placeholder text and only map over valid comments
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

  combinedComments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const visibleComments = showMore
    ? combinedComments.reverse().slice()
    : combinedComments.reverse().slice(0, 2);
  const releaseFNF = (employee) => {
    if (employee?.overAllStatus === "Not Started") {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Release FNF Form?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .put(`${BASE_URL}:9029/api/eSeparation/releaseFNF/${employee?.id}`)
            .then(() => {
              console.log("FNF Form Released");
              // Optionally refetch data
              fetchDetails();
            })
            .catch((error) => {
              console.log("Error during FNF release", error);
            });
        }
      });
    } else {
      // 👇 Get FNF status first before showing popup
      axios
        .get(`${BASE_URL}:9029/api/eSeparation/getFnfStatusOfEmployeeinHrDashboard/${employee?.id}`)
        .then((res) => {
          const fnfStatus = res.data;
          console.log("FNF Status:", fnfStatus);
          if (fnfStatus === "Submitted") {
            setSelectedResignation(employee);
            setPopupOpen(true);
          } else {
            Swal.fire({
              icon: "info",
              title: "FNF Not Submitted",
              text: "The employee has not yet submitted the FNF form.",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching FNF status", err);
        });
    }
  };

  const closeFNF = () => {
    setPopupOpen(false);
    setSelectedResignation(null);
  };


  const exitEmployee = (employee) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to move Employee?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${BASE_URL}:9029/api/eSeparation/exit/${employee?.id}`)
          .then(() => {
            console.log("Released");
            fetchDetails();
          })
          .catch((error) => {
            console.log("Error during posting", error);
          });
      }
    });
  };

const filteredEmployeeList = empDetails.filter((emp) => {
    const name = emp?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || "";
    const empCode = emp?.fileAndObjectTypeBean?.empResDTO?.empCode || "";
    const query = searchTerm.toLowerCase();

    return name.toLowerCase().includes(query) || empCode.toLowerCase().includes(query);
});
  
  return (
    <div className="container mx-auto">
      <div>
        <h1 className="text-gray-800 text-base mx-8 mt-3 font-semibold">
          In Exit Process
        </h1>
        <div className="flex justify-center gap-2 mt-6">
          <input
            type="text"
            placeholder="Search by employee name or employee code..."
            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-96 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}

          />
        </div>
      </div>
      {empDetails.length === 0 ? (
        <div className="mx-8 mt-6 text-gray-600 text-center text-base font-semibold">
          There are no pending requests.
        </div>
      ) : (
        filteredEmployeeList.map((employee) => (
          <div
            key={employee?.id}
            className="grid lg:grid-cols-6 md:grid-cols-3 bg-white grid-cols-2 lg:mx-2 md:mx-6 mx-6 mt-6 border rounded-lg border-gray-500 p-2 shadow-bottom"
          >
            <div className="col-span-1 lg:w-40 md:w-full w-full text-center">
              <h1 className="text-gray-600 font-semibold">Employee Name</h1>
              {employee?.fileAndObjectTypeBean &&
                employee?.fileAndObjectTypeBean?.fileAndContentTypeBean &&
                employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file ? (
                <img
                  src={`data:${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file}`}
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
              {/* <img src='profile.webp' alt='ProfilePicture' className='h-[12vh] w-[14vh] rounded-[50%/50%] mt-7 mx-auto' /> */}
              <h1 className="text-sm text-blue-700 font-semibold">
                {employee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || "-"}
              </h1>
              <h1 className="text-xs -mt-1 text-gray-600">
                {employee?.fileAndObjectTypeBean?.empResDTO?.designationResDTO
                  .designationName || "-"}
              </h1>
              <h1 className="text-gray-800 text-xs">
                {employee?.fileAndObjectTypeBean?.empResDTO?.empCode || "-"}
              </h1>
            </div>
            <div className="col-span-1 lg:-ml-2 lg:w-48 md:w-full w-full">
              <h1 className="mx-4 text-gray-600 font-semibold">Exit Info</h1>
              <div className="">
                <div className="grid grid-cols-2  text-sm text-gray-700 p-2">
                  <h1 className="mt-2 text-xs">Joining Date</h1>
                  <h1 className="mt-2 text-xs text-[#00007D]">
                    {formatDate(
                      employee?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining
                    ) || "-"}
                  </h1>
                </div>
                <div className="grid grid-cols-2 text-sm text-gray-700 p-2">
                  <h1 className="text-xs">Resignation Date</h1>
                  <h1 className="text-xs text-[#00007D]">
                    {formatDate(employee?.dateOfResignation) || "-"}
                  </h1>
                </div>
                {/* <div className="grid grid-cols-2  text-sm text-gray-700 p-2 text-xs">
                  <h1>Last Working Date</h1>
                  <h1 className="text-[#00007D] text-xs">
                    {formatDate(employee?.lastWorkingDay) || "-"}
                  </h1>
                </div> */}
                
                <div className="grid grid-cols-2 text-sm text-gray-700 p-2 text-xs">
                  <h1>
                    Last Working <br></br>requested Date
                  </h1>
                  <h1 className="text-[#00007D]">
                    {formatDate(employee?.lastWorkingDayRequest) || "-"}
                  </h1>
                </div>
                <div className="grid grid-cols-2 text-sm text-gray-700 p-2 text-xs">
                  <h1>{getLabel(employee)}</h1>
                  <h1 className="text-[#00007D] text-xs">
                    {employee?.expectedLastWorkingDay
                      ? formatDate(employee?.expectedLastWorkingDay) || "-"
                      : formatDate(employee?.lastWorkingDay) || "-"
                    }
                  </h1>
                </div>
              </div>
            </div>
            <div className="col-span-1 lg:w-[200px] md:w-full w-full lg:ml-4">
              <h1 className="text-gray-600 font-semibold mx-4 text-xs">Exit Reason</h1>
              <h1 className="text-gray-800 font-semibold text-sm mt-3 text-xs mx-6">
                {employee?.reason || "-"}
              </h1>
              <h1 className="text-gray-600 text-xs ml-6">
                {employee?.remarks || "-"}
              </h1>
            </div>
            <div className="col-span-1 lg:ml-11 md:ml-0 ml-0 lg:w-32 w-full md:w-full">
              <h1 className="text-gray-600 font-semibold lg:text-center md:text-center text-left lg:mx-1 md:mx-1 mx-4">
                R1 Approval Status
              </h1>
              <h1
                className={`text-gray-900 p-1 px-1 font-semibold mt-5 text-sm lg:mx-6 md:mx-12 mx-6 mr-6 inline-block rounded-md bg-[#A8ED87]`}
              >
                {employee?.r1Status}
              </h1>
            </div>
            <div className="col-span-1 lg:ml-4 md:ml-0 ml-0 lg:w-32 md:w-full w-full">
              <h1 className="text-gray-600 font-semibold lg:text-center md:text-center text-left lg:mx-2 md:mx-1 mx-4">
                HR Approval Status
              </h1>
              <h1
                className={`text-gray-900 p-1 lg:mx-6 md:mx-12 mx-1 font-semibold text-sm mt-5 px-1 inline-block rounded-md bg-[#A8ED87]`}
              >
                {employee?.hrStatus}
              </h1>
            </div>
            <div className="col-span-1 lg:-ml-8 flex lg:flex-row md:flex-row flex-col justify-between items-start w-full">
              <div className="mx-2">
                <h1 className="text-gray-600 font-semibold ml-5 whitespace-nowrap">
                  Exit Status
                </h1>
                <h1
                  className={`inline-block px-3 py-[2px]  ${employee?.overAllStatus === "Completed"
                    ? "bg-[#A8ED87] text-black"
                    : employee?.overAllStatus === "In progress"
                      ? "bg-[#DFCC22] text-white"
                      : "bg-[#DDDBDB] text-gray-900"
                    } font-semibold text-sm rounded-md lg:mt-11 md:mt-7 mt-2 ml-4 text-center`}
                >
                  {employee?.overAllStatus}
                </h1>
              </div>
              <div>
                <h1 className="text-gray-600 font-semibold lg:mx-4 md:mx-4 mx-8">
                  Action
                </h1>
                {/* <button
                  className={`border py-[1px] inline-block text-sm font-semibold rounded-md lg:mt-11 md:mt-7 mt-2 text-center ${employee?.overAllStatus === "Not Started"
                      ? "text-blue-500 border-blue-400 px-1 ml-2"
                      : "text-gray-400 border-[#978D8D] px-[1px] lg:ml-0 md:-ml-2 ml-7 cursor-not-allowed"
                    }`}
                  disabled={employee?.overAllStatus !== "Not Started"}
                  onClick={() => releaseFNF(employee)}
                >
                  {employee?.overAllStatus === "Not Started"
                    ? "Release FNF Form"
                    : "View FNF Form"}
                </button> */}

                <button
                  className={`border py-[1px] inline-block text-sm font-semibold rounded-md lg:mt-11 md:mt-7 mt-2 text-center 
    ${employee?.overAllStatus === "Not Started"
                      ? "text-blue-500 border-blue-400 px-1 ml-2"
                      : "text-green-600 border-green-500 px-[4px] lg:ml-0 md:-ml-2 ml-7 hover:bg-green-50"
                    }`}
                  onClick={() => releaseFNF(employee)}
                >
                  {employee?.overAllStatus === "Not Started"
                    ? "Release FNF Form"
                    : "View FNF Form"}
                </button>
                <button
                  className="flex items-center text-blue-600 border-blue-500 gap-2 lg:-ml-28 md:-ml-20 mr-5 mt-10 py-2 hover:bg-blue-50 font-semibold rounded-md  px-1"
                  onClick={() => viewDetails(employee)}>
                  View Details <FaArrowRight />
                </button>
                {employee?.overAllStatus === "Completed" && (
                  <button
                    className="flex items-center gap-2 lg:-ml-28 md:-ml-20 mr-5 mt-10 py-2 bg-blue-500 font-semibold rounded-md text-sm text-white px-1"
                    onClick={() => exitEmployee(employee)}
                  >
                    Move to Exited Employee
                    <span className="bg-white text-blue-500 text-lg mt-1">
                      <BsArrowRightSquare />
                    </span>
                  </button>
                )}
              </div>

            </div>

          </div>
        ))
      )}
      {popupOpen && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
          <div className="w-[75%] h-[90%] bg-white relative overflow-y-auto z-[200]">
            <ExitFormFNF
              closeFNF={closeFNF}
              resignationDetails={selectedResignation}
              resignationData={empDetails} // or a filtered list if needed
              readOnly={true}
            />
          </div>
        </div>
      )}

      <div className="-ml-4">

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
                      {selectedEmployee?.fileAndObjectTypeBean &&
                        selectedEmployee?.fileAndObjectTypeBean
                          ?.fileAndContentTypeBean &&
                        selectedEmployee?.fileAndObjectTypeBean
                          ?.fileAndContentTypeBean?.file ? (
                        <img
                          src={`data:${selectedEmployee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${selectedEmployee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file}`}
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
                        {selectedEmployee?.fileAndObjectTypeBean
                          ?.empResDTO?.firstName || "-"}
                      </h1>
                      <h1 className="text-xs text-gray-500 break-words">
                        {selectedEmployee?.fileAndObjectTypeBean
                          ?.empResDTO.designationResDTO
                          ?.designationName || "-"}
                      </h1>
                    </div>
                    <div className="grid grid-cols-3 text-xs px-4 gap-2">
                      <div>
                        <h1 className="text-gray-500">Employee Id</h1>
                        <h1 className="text-[#00007D] break-words">
                          {selectedEmployee?.fileAndObjectTypeBean
                            ?.empResDTO?.empCode || "-"}
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-gray-500">Contact No</h1>
                        <h1 className="text-[#00007D] break-words">
                          {selectedEmployee?.fileAndObjectTypeBean
                            ?.empResDTO?.primaryContactNo || "-"}
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-gray-500">Email</h1>
                        <h1 className="text-[#00007D] break-words">
                          {selectedEmployee?.fileAndObjectTypeBean
                            ?.empResDTO?.emailId || "-"}
                        </h1>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 text-xs p-4 gap-2">
                      <div>
                        <h1 className="text-gray-500">Department</h1>
                        <h1 className="text-[#00007D] break-words">
                          {selectedEmployee?.fileAndObjectTypeBean
                            ?.empResDTO?.mainDeptResDTO
                            ?.mainDepartment || "-"}
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-gray-500">
                          Reporting to
                        </h1>
                        <h1 className="text-[#00007D] break-words">
                          {selectedEmployee?.fileAndObjectTypeBean
                            ?.empResDTO?.reportingManager || "-"}
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-gray-500">Designation</h1>
                        <h1 className="text-[#00007D] break-words">
                          {selectedEmployee?.fileAndObjectTypeBean
                            ?.empResDTO?.designationResDTO
                            ?.designationName || "-"}
                        </h1>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 text-xs p-4 gap-2">
                      <div>
                        <h1 className="text-gray-500">Location</h1>
                        <h1 className="text-[#00007D] break-words">
                          {selectedEmployee?.userDTO?.locationResDTO
                            ?.locationName || "-"}
                        </h1>
                      </div>

                      <div>
                        <h1 className="text-gray-500">
                          Project / Cost Centre
                        </h1>
                        <h1 className="text-[#00007D] break-words">
                          {selectedEmployee?.fileAndObjectTypeBean
                            ?.empResDTO?.projectResDTO?.projectId || "-"}
                        </h1>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 text-xs p-4 gap-2">
                      <div>
                        <h1 className="text-gray-500">
                          Joining Date
                        </h1>
                        <h1 className="text-[#00007D] break-words">
                          {formatDate(
                            selectedEmployee?.fileAndObjectTypeBean
                              ?.empResDTO?.dateOfJoining
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
                            <h1 className=" text-xs bg-orange-500 rounded-full h-10 w-10 text-center text-white font-semibold mt-4 pt-[12px]">
                              {initial(
                                selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.reportingManager
                              )}
                            </h1>
                            <h1 className=" text-xs bg-blue-500 rounded-full h-10 w-10 text-center text-white font-semibold mt-3 pt-[12px]">
                              {initial(
                                selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.firstName
                              )}
                            </h1>
                          </div>
                          <div className="col-span-5">
                            <h1 className="font-semibold text-gray-800 text-xs mt-4">
                              {selectedEmployee?.r1Status ===
                                "Approved" ? (
                                <h1>
                                  Approved<br></br>{" "}
                                  <span className="text-gray-500 text-xs font-normal">
                                    By{" "}
                                    {
                                      selectedEmployee
                                        ?.fileAndObjectTypeBean
                                        ?.empResDTO?.reportingManager
                                    }
                                  </span>
                                </h1>
                              ) : selectedEmployee?.hrStatus ===
                                "Retained" ? (
                                <h1>
                                  Retained<br></br>
                                  <span className="text-gray-500 text-xs font-normal">
                                    By{" "}
                                    {
                                      selectedEmployee
                                        ?.fileAndObjectTypeBean
                                        ?.empResDTO?.reportingManager
                                    }
                                  </span>
                                </h1>
                              ) : (
                                <h1>
                                  Pending<br></br>
                                  <span className="text-gray-500 text-xs font-normal">
                                    With{" "}
                                    {
                                      selectedEmployee
                                        ?.fileAndObjectTypeBean
                                        ?.empResDTO?.reportingManager
                                    }
                                  </span>
                                </h1>
                              )}
                            </h1>
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
                            onChange={(e) =>
                              setComment(e.target.value)
                            }
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
                                {visibleComments.map(
                                  (entry, index) => (
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
                                  )
                                )}
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
                      <h1 className="mt-2 text-sm">
                        Resignation Date
                      </h1>
                      <h1 className="border text-sm border-gray-400 py-1 mt-3 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
                        {formatDate(
                          selectedEmployee?.dateOfResignation
                        ) || "="}
                      </h1>
                      <h1 className="text-sm">
                        Last working Date Requested
                      </h1>
                      <h1 className="border text-sm border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
                        {formatDate(
                          selectedEmployee?.lastWorkingDayRequest
                        ) || "-"}
                      </h1>
                    </div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center font-normal px-5 lg:py-2 md:py-0 lg:space-y-1 md:space-y-1 space-y-1">
                      <h1 className="text-sm">{getLabel(selectedEmployee)}</h1>
                      <h1 className="border text-sm border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">

                    {selectedEmployee?.expectedLastWorkingDay
                      ? formatDate(selectedEmployee?.expectedLastWorkingDay) || "-"
                      : formatDate(selectedEmployee?.lastWorkingDay) || "-"
                    }
                  </h1>
                      <h1 className="text-sm">Reason for Exit</h1>
                      <h1 className="border text-sm border-gray-400 whitespace-normal py-1 px-2 lg:w-[170px] md:w-[140px] w-[130px]">
                        {selectedEmployee?.reason || "-"}
                      </h1>
                    </div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center lg:py-2 md:py-0  font-normal px-5 lg:pb-3 md:pb-1 pb-1 lg:-space-y-3 md:space-y-2 space-y-1">
                      <h1 className="text-sm">Resignation Mail PDF</h1>
                      <button
                        onClick={() => handleOpenPendingDoc(selectedEmployee?.docId)}
                       
                        className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm focus:outline-none border-none bg-transparent"
                        title=" View Document"
                      >
                        <IoEyeSharp />
                      </button>

                      <h1 className="lg:whitespace-nowrap text-sm md:whitespace-nowrap whitespace-nowrap lg:mt-4 md:mt-0 ">
                        Additional Remarks
                      </h1>
                      <h1 className="text-wrap border text-sm border-gray-400 py-1 px-4 lg:w-[270px] md:w-[200px] w-[145px]">
                        {selectedEmployee?.remarks || "-"}
                      </h1>
                    </div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center lg:py-2 md:py-0  font-normal px-5 lg:pb-3 md:pb-1 pb-1 lg:-space-y-3 md:space-y-2 space-y-1">
                      <h1 className="text-sm">StayIn Interview Form</h1>
                      <button onClick={() => handleStayInterview(selectedEmployee)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm">
                        <IoEyeSharp />
                      </button>
                      {viewInterviewOpen && selectedResignation && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto">
                            <ViewExitInterviewForm
                              resignationDetails={selectedResignation}
                              closeViewInterview={() => setViewInterviewOpen(false)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mx-3 mt-3 shadow-bottom">
                  <div>
                    <h1 className="font-semibold text-sm mx-5 mt-4 pt-3 text-gray-700">
                      Filled by Manager
                    </h1>
                  </div>
                  <div className="">
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 text-sm px-5 mt-2 items-center font-normal lg:space-y-4 md:space-y-2 space-y-1">
                      <h1 className="whitespace-nowrap mt-4">
                        Notice Period Waiver
                      </h1>
                      <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 px-10 p-1">
                        {selectedEmployee?.noticePeriodWaiver ? "Yes" : "No" || "-"}
                      </h1>
                      <h1 className="lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal">
                        Remarks to Employee
                      </h1>
                      <h1 className="border border-gray-300 lg:w-52 md:w-60 w-36 p-1">
                        {selectedEmployee?.managerRemarksToEmp || "-"}
                      </h1>
                    </div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 lg:py-3 md:py-0 text-gray-500 text-sm px-5 lg:mt-2 md:mt-0 mt-0 items-center font-normal lg:-space-y-4 md:space-y-2 space-y-1">
                      <h1 className="-mt-3">
                        Final Last working Date
                      </h1>
                      <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-10">
                        {selectedEmployee?.expectedLastWorkingDay
                      ? formatDate(selectedEmployee?.expectedLastWorkingDay) || "-"
                      : formatDate(selectedEmployee?.lastWorkingDay) || "-"
                    }
                      </h1>
                      <h1 className="whitespace-nowrap">
                        Remarks to Reviewer
                      </h1>
                      <p className="border border-gray-300 lg:w-52 md:w-60 w-36 p-1">
                        {selectedEmployee?.managerRemarksToReviewer || "-"}
                      </p>
                    </div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 lg:py-3 md:py-0 text-gray-500 text-sm px-5 lg:mt-2 md:mt-0 mt-0 items-center font-normal lg:-space-y-4 md:space-y-2 space-y-1">

                      <h1 className="whitespace-nowrap">
                        Forwarding Mails To
                      </h1>
                      <p className="border border-gray-300 lg:w-52 md:w-60 w-36 p-1">
                        {selectedEmployee?.forwardEmailsTo || "-"}
                      </p>
                    </div>
                  </div>
                </div>
 {/* +++++++++++++++++++++++++ */}

                      <div className="mx-3 mt-3 shadow-bottom pb-6">
                        <div>
                          <h1 className="font-semibold text-sm mx-5 mt-4 pt-3 text-gray-700">
                            Filled or To be filled by HR
                          </h1>
                        </div>

                        {/* Grid layout for checkbox and remarks */}
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 text-sm px-5 mt-2 items-center font-normal lg:space-y-4 md:space-y-2 space-y-1">

                          <h1 className="whitespace-nowrap mt-4">
                            FNF Enable for BU
                          </h1>

                          {/* FNF Checkbox */}
                          <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 px-10 p-1">
                            {selectedEmployee?.fnfEnableForBU ? "Yes" : "No" || "-"}
                          </h1>
                          {/* FNF Label */}
                          <h1 className="whitespace-nowrap mt-4">
                            FNF Enable for Sales
                          </h1>

                          {/* FNF Checkbox */}
                          <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 px-10 p-1">
                            {selectedEmployee?.fnfEnableForSales ? "Yes" : "No" || "-"}
                          </h1>
                          <h1 className="waiver whitespace-nowrap mt-4 text-xs">
                            Notice Period Waiver{" "}
                        
                          </h1>
                          <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 px-10 p-1">
                            {selectedEmployee?.noticePeriodWaiverByHr ? "Yes" : "No" || "-"}
                          </h1>

                          <h1 className="mt-0 ">
                            Final Last working Date
                          </h1>
                          <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-10">
                            {selectedEmployee?.expectedLastWorkingDay
                      ? formatDate(selectedEmployee?.expectedLastWorkingDay) || "-"
                      : formatDate(selectedEmployee?.lastWorkingDay) || "-"
                    }
                          </h1>
                          {/* Remarks Label */}
                          <h1 className="lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal mt-4">
                            Remarks to Reviewer
                          
                          </h1>

                          {/* Remarks Textarea */}
                         <div
                    className="border border-gray-300 p-2 w-full break-words whitespace-pre-wrap ounded-md">
                    {selectedEmployee?.hrRemarksToReviewer || "-"}
                  </div>
                        </div>

                      </div>
              </div>
            </div>
          </div>
        )}

      </div>



    </div>
  );
}

export default ExitProcess;
