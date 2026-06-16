import { useEffect, useState } from "react";
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
import { BASE_URL } from "../../../config/Config";

function PendingExitForm() {
  const [empDetails, setEmpDetails] = useState([]);
  const [resignDetails, setResignDetails] = useState([]);

  // const [imageUrl, setImageUrl] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const dropdownOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const [managerApprovalDetails, setManagerApprovalDetails] = useState({
    expectedLastWorkingDay: "",
    managerRemarksToEmp: "",
    noticePeriodWaiver: "",
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
  // const empCode = sessionStorage.getItem("UserId");
  const empCode = localStorage.getItem('empId');

  useEffect(() => {
    axios
      .get(`${BASE_URL}:9029/api/eSeparation/getResignDataByStatus/Pending/${empCode}`)
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
                  empDetail.fileAndObjectTypeBean?.empResDTO?.empCode ===
                  resignDetail.empCode
              );
              return { ...empDetail, ...matchingResignDetail };
            });
            console.log(mergedData, "mergeData");
            setEmpDetails(mergedData);
            // Call getImage for each empCode in mergedData
            // mergedData.forEach(empDetail => getImage(empDetail.empCode));
          })
          .catch((error) => {
            console.log("Error fetching employee details", error);
          });
      })
      .catch((error) => {
        console.log("No Resignation Details Fetched", error);
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

  // const getImage = (empCode) => {
  //     // axios.get(`${BASE_URL}:9029/api/eSeparation/download?empCode=${empCode}`, {
  //     //     responseType: 'arraybuffer',
  //     // })
  //     Service.getEmployeeImage(empCode)
  //         .then(response => {
  //             const imageBlob = new Blob([response.data], { type: 'image/png' });
  //             const image = URL.createObjectURL(imageBlob);
  //             setImageUrl(prevState => ({
  //                 ...prevState,
  //                 [empCode]: image  // Store image URL for each employee using their empCode as key
  //             }));
  //         })
  //         .catch(error => console.error(error));
  // };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(empDetails.length / itemsPerPage);

  // Calculate start and end indexes for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, empDetails.length); // Ensure endIndex doesn't exceed claims.length

  // Slice the empDetails array to display only items for the current page
  // const filteredEmpDetails = empDetails.filter(emp =>
  //     emp.empName.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  // const filteredEmpDetails = empDetails.filter(emp =>
  //     emp.empName && emp.empName.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  // console.log(filteredEmpDetails,"filteredEmpDetails")
  //     const currentresignDetails = filteredEmpDetails.slice(startIndex, endIndex);
  //     console.log(currentresignDetails,"currentresignDetails");

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
  };

  const popupContentStyles = {
    top: 0,
    width: "80%",
    height: "90%",
    background: "white",
    position: "relative",
    overflowY: "auto",
  };

  const [requestId, setRequestId] = useState("");
  const handleAccept = (employee) => {
    setIsPopupOpen(true);
    setSelectedEmployee(employee);
    setRequestId(employee.empCode);
    console.log("req>>>>>>>>>", requestId);
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
            `${BASE_URL}:9029/api/eSeparation/approve/${selectedEmployee?.id}`,
            managerApprovalDetails
          )
          .then(() => {
            Swal.fire(
              "Approved!",
              "The employee has been approved.",
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
            `${BASE_URL}:9029/api/eSeparation/retainByMgr/${selectedEmployee?.id}`,
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
    navigate("/exitDashboard");
  }

  console.log(empDetails, "++++++++");
  const [commentFetched, setCommentFetched] = useState([]);

  const empDetail =
    empDetails && empDetails.length > 0
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

  const fetchComment = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}:9029/api/eSeparation/getMgrComments/${requestId}`
      );

      setCommentFetched(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComment();
  }, []);

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
        selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar ||
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
            selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.reportingManager ||
            "Manager",
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
    ? combinedComments
    : combinedComments.slice(0, 2);

  return (
    <div className="container mx-auto">
      <div className="flex">
        <div className="flex mx-14 gap-6">
          <button className="text-blue-500 text-2xl" onClick={handlePrevious}>
            <FaArrowLeftLong />
          </button>
          <h1 className="text-xl text-gray-900 font-semibold mt-6">
            Pending Exits
          </h1>
          <input
            type="text"
            id="default-search"
            className="block w-72 px-6 mt-12 text-sm text-black border shadow-bottom rounded-none outline-none bg-white ml-40 h-8"
            placeholder="Search for Employee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
        </div>
        <div className="">
          <div className="flex justify-between mt-12 ml-40 mx-5 text-gray-500 font-semibold">
            <span className="pagination-info mr-3">
              {currentPage} - {totalPages} / {totalPages}
            </span>
            <div className="flex items-center space-x-4">
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
      {empDetails.length === 0 ? (
        <div className="mt-10 text-center text-gray-700">
          <h2 className="text-xl font-semibold">There are no exit Requests</h2>
        </div>
      ) : (
        <>
          {empDetails.map((employee) => (
            //console.log(currentresignDetails+"::::::employeee")
            <div
              key={employee.id}
              className="grid grid-cols-5 mx-16 mt-6 border rounded-lg border-gray-500 p-2 shadow-bottom"
            >
              <div className="col-span-1 w-48 text-center">
                <h1 className="text-gray-600 font-semibold">Employee Name</h1>
                {employee?.fileAndObjectTypeBean &&
                employee?.fileAndObjectTypeBean.fileAndContentTypeBean &&
                employee?.fileAndObjectTypeBean.fileAndContentTypeBean.file ? (
                  <img
                    src={`data:${employee?.fileAndObjectTypeBean.fileAndContentTypeBean.contentType};base64,${employee?.fileAndObjectTypeBean.fileAndContentTypeBean.file}`}
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
                <h1 className="text-lg text-blue-700 font-semibold">
                  {employee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar}
                </h1>
                <h1 className="text-xs text-gray-600">
                  {employee?.fileAndObjectTypeBean?.empResDTO?.designationResDTO
                    .designationName === "SSD"
                    ? "Software Solutions & Delivery"
                    : employee?.fileAndObjectTypeBean?.empResDTO?.designationResDTO
                        .designationName}
                </h1>
                <h1 className="text-gray-800 text-xs">
                  {employee?.fileAndObjectTypeBean?.empResDTO?.empCode}
                </h1>
              </div>
              <div className="col-span-1 -ml-7 w-60">
                <h1 className="mx-4 text-gray-600 font-semibold">Exit Info</h1>
                <div className="flex">
                  <div className="text-sm text-gray-700 p-2">
                    <h1 className="mt-2">Joining Date</h1>
                    <h1 className="my-3">Date of Resignation</h1>
                    <h1>Last Working Date</h1>
                  </div>
                  <div className="text-sm text-[#00007D] p-2">
                    <h1 className="mt-2">
                      {formatDate(
                        employee?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining
                      ) || "-"}
                    </h1>
                    <h1 className="my-3">
                      {formatDate(employee.dateOfResignation) || "-"}
                    </h1>
                    <h1>{formatDate(employee.lastWorkingDay) || "-"}</h1>
                  </div>
                </div>
              </div>
              <div className="col-span-1 w-60">
                <h1 className="text-gray-600 font-semibold mx-4">
                  Exit Reason
                </h1>
                <h1 className="text-gray-800 font-semibold text-sm mt-3  mx-6">
                  {employee.reason || "-"}
                </h1>
                <h1 className="text-gray-600 text-sm ml-6">
                  {employee.remarks || "-"}
                </h1>
              </div>
              <div className="col-span-1 ml-6 text-red-500 font-semibold text-right mt-36">
                <button
                  className="border border-red-500 py-1 px-8 rounded-md"
                  onClick={() => handleAccept(employee)}
                >
                  Retain
                </button>
              </div>
              <div className="col-span-1 ml-3 mt-36">
                <button
                  className="border border-blue-400 py-1 px-8 rounded-md  text-blue-400 font-semibold text-left "
                  onClick={() => handleAccept(employee)}
                >
                  Accept & Forward
                </button>
                {isPopupOpen && selectedEmployee && (
                  <div style={popupStyles}>
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
                        <div className="grid grid-cols-2 mx-3 p-4 shadow-bottom">
                          <div className="col-span-1 p-2  shadow-bottom">
                            <div className="py-3 text-center">
                              {employee?.fileAndObjectTypeBean &&
                              employee?.fileAndObjectTypeBean
                                ?.fileAndContentTypeBean &&
                              employee?.fileAndObjectTypeBean
                                ?.fileAndContentTypeBean?.file ? (
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
                              <h1 className="text-lg text-blue-500 font-bold">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.fullNameAsAadhaar || "-"}
                              </h1>
                              <h1 className="text-sm text-gray-500">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.designationResDTO
                                  ?.designationName || "-"}
                              </h1>
                            </div>
                            <div className="grid grid-cols-3 text-sm px-4 gap-2">
                              <div>
                                <h1 className="text-gray-500">Employee Id</h1>
                                <h1 className="text-[#00007D]">
                                  {selectedEmployee?.fileAndObjectTypeBean
                                    ?.empResDTO?.empCode || "-"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-gray-500">Contact No</h1>
                                <h1 className="text-[#00007D]">
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
                            <div className="grid grid-cols-3 text-sm p-4 gap-2">
                              <div>
                                <h1 className="text-gray-500">Department</h1>
                                <h1 className="text-[#00007D]">
                                  {selectedEmployee?.fileAndObjectTypeBean
                                    ?.empResDTO?.mainDeptResDTO?.mainDepartment ||
                                    "-"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-gray-500">Reporting to</h1>
                                <h1 className="text-[#00007D]">
                                  {selectedEmployee?.fileAndObjectTypeBean
                                    ?.empResDTO?.reportingManager || "-"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-gray-500">Designation</h1>
                                <h1 className="text-[#00007D]">
                                  {selectedEmployee?.fileAndObjectTypeBean
                                    ?.empResDTO?.designationResDTO
                                    ?.designationName || "-"}
                                </h1>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 text-sm p-4 gap-2">
                              <div>
                                <h1 className="text-gray-500">Location</h1>
                                <h1 className="text-[#00007D]">
                                  {selectedEmployee?.userDTO?.locationResDTO
                                    .locationName || "-"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-gray-500">Empo</h1>
                                <h1 className="text-[#00007D]">
                                  {selectedEmployee?.empo || "-"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-gray-500">
                                  Project / Cost Centre
                                </h1>
                                <h1 className="text-[#00007D]">
                                  {selectedEmployee?.fileAndObjectTypeBean
                                    ?.empResDTO?.projectResDTO?.projectId || "-"}
                                </h1>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 text-sm p-4 gap-2">
                              <div>
                                <h1 className="text-gray-500">Joining Date</h1>
                                <h1 className="text-[#00007D]">
                                  {formatDate(
                                    selectedEmployee?.fileAndObjectTypeBean
                                      ?.empResDTO?.dateOfJoining
                                  ) || "-"}
                                </h1>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1">
                            {/*<img src='exitMan.png' className='mt-10 h-[60vh] w-[40vh] mx-auto' alt='ResignationImage' />*/}

                            <div className="">
                              <h2 className="mb-10 text-xl font-semibold text-center ml-2">
                                Discussion Thread
                              </h2>
                              <div className="ml-56 border-l-[2px] border-gray-300">
                                <div className="justify-between items-center p-4">
                                  <h2 className="text-lg font-medium text-red-500">
                                    Pending
                                  </h2>
                                  <div className="flex">
                                    <div className="text-gray-400 font-medium mr-2">
                                      With
                                    </div>
                                    <div className="text-gray-700 font-medium">
                                      Manager
                                    </div>
                                  </div>
                                </div>
                                <div className="flex p-4">
                                  <input
                                    className="border border-gray-300 w-full text-sm p-2"
                                    placeholder="Add your comment here....."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                  />
                                  <IoEnterOutline
                                    className="ml-[-2rem] mt-1 text-xl cursor-pointer"
                                    onClick={postComment} // Post the comment on icon click
                                  />
                                </div>
                                <div className="mt-3 p-4 text-base">
                                  {combinedComments.length > 0 ? (
                                    <div
                                      className={`overflow-y-auto ${
                                        showMore ? "h-64" : ""
                                      }`}
                                    >
                                      <ul>
                                        {visibleComments.map((entry, index) => (
                                          <li
                                            key={index}
                                            style={{ marginBottom: "10px" }}
                                            className="text-sm"
                                          >
                                            <p className="text-gray-600 font-normal">
                                              <strong>{entry.author}</strong>{" "}
                                              added a <strong>Comment</strong>
                                            </p>
                                            <p className="text-gray-500">
                                              {entry.comment}
                                            </p>
                                            <p className="text-gray-400 font-medium mb-4">
                                              {entry.dateTime}
                                            </p>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : (
                                    <div>No comments available</div>
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
                            <h1 className="font-semibold mx-5 mt-4 pt-3 text-gray-700">
                              Employee Exit Details
                            </h1>
                          </div>
                          <div className="grid grid-cols-1">
                            <div className="grid grid-cols-4 text-gray-500 items-center text-base px-5 font-normal space-y-4">
                              <h1 className="mt-4">Date of Resignation</h1>
                              <h1 className="border border-gray-400 py-1 px-4 w-[200px]">
                                {formatDate(
                                  selectedEmployee?.dateOfResignation
                                ) || "="}
                              </h1>
                              <h1 className="">Last working Date Requested</h1>
                              <h1 className="border border-gray-400 py-1 px-4 w-[186px]">
                                {formatDate(
                                  selectedEmployee?.lastWorkingDayRequest
                                ) || "-"}
                              </h1>
                            </div>
                            <div className="grid grid-cols-4 text-gray-500 items-center text-base font-normal px-5 py-2 space-y-4">
                              <h1 className="mt-4">Last working Date</h1>
                              <h1 className="border border-gray-400 py-1 px-4 w-[200px]">
                                {formatDate(selectedEmployee?.lastWorkingDay) ||
                                  "-"}
                              </h1>
                              <h1>Reason for Exit</h1>
                              <h1 className="border border-gray-400 py-1 px-2 w-[186px]">
                                {selectedEmployee?.reason || "-"}
                              </h1>
                            </div>
                            <div className="grid grid-cols-5 text-gray-500 items-center text-base font-normal px-5 pb-3 space-y-4">
                              <h1 className="whitespace-nowrap mt-4">
                                Additional Remarks
                              </h1>
                              <h1 className="text-wrap border border-gray-400 py-1 px-4 w-[280px] -ml-[31px]">
                                {selectedEmployee?.remarks || "-"}
                              </h1>
                            </div>
                          </div>
                        </div>
                        <div className="mx-3 mt-3 shadow-bottom">
                          <div>
                            <h1 className="font-semibold mx-5 mt-4 pt-3 text-gray-700">
                              To be filled by Manager
                            </h1>
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="col-span-1 text-gray-500 text-base p-5 font-normal space-y-4">
                              <div className="waiver flex gap-24">
                                <h1 className="whitespace-nowrap">
                                  Notice Period Waiver{" "}
                                  <span className="text-lg text-red-500">
                                    *
                                  </span>
                                </h1>
                                <Dropdown
                                  className="w-48"
                                  placeholder={"Select"}
                                  options={dropdownOptions}
                                  onChange={handleDropdownChange}
                                  value={
                                    managerApprovalDetails.noticePeriodWaiver
                                      ? "Yes"
                                      : "No"
                                  }
                                />
                              </div>
                              <div className="flex gap-[26px]">
                                <h1 className="mt-4">
                                  Expected Last working Date
                                </h1>
                                <form action="/action_page.php">
                                  <input
                                    type="date"
                                    className="w-48 border border-gray-300 text-sm px-2 ml-[36px] h-10 mt-2 rounded-none outline-none"
                                    value={
                                      managerApprovalDetails.expectedLastWorkingDay
                                    }
                                    onChange={handleExpectedLastWorkingDay}
                                    disabled={
                                      !managerApprovalDetails.noticePeriodWaiver
                                    }
                                  />
                                </form>
                              </div>
                            </div>
                            <div className="col-span-1  text-gray-500 text-base p-5 font-normal space-y-4">
                              <div className="flex gap-12">
                                <h1 className="whitespace-nowrap">
                                  Remarks to Employee{" "}
                                  <span className="text-lg text-red-500">
                                    *
                                  </span>
                                </h1>
                                <textarea
                                  rows={2}
                                  className="outline-none rounded-none border border-gray-400 w-full p-2 -ml-[6px]"
                                  placeholder="Write Your Comments here"
                                  onChange={handleManagerRemarksToEmp}
                                />
                              </div>
                              <div>
                                <h3 className="text-xs text-red-600 ml-52 -mt-3">
                                  {validationErrors.managerRemarksToEmp && (
                                    <span>
                                      {validationErrors.managerRemarksToEmp}
                                    </span>
                                  )}
                                </h3>
                              </div>
                              <div className="flex gap-[60px]">
                                <h1 className="whitespace-nowrap">
                                  Remarks to Reviewer
                                </h1>
                                <textarea
                                  rows={2}
                                  className="outline-none rounded-none border border-gray-400 w-full p-2"
                                  placeholder="Write Your Comments here"
                                  onChange={handleManagerRemarksToReviewer}
                                />
                              </div>
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

export default PendingExitForm;
