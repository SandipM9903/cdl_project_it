import React, { useEffect, useState } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { IoEnterOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import axios from "axios";
import { BASE_URL } from "../../../config/Config";

function ViewDetails({
  resignationDetails,
  employeeDetails,
  closeDetails,
  fnfData,
  fillFNFForm,
}) {
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

  const [commentFetched, setCommentFetched] = useState([]);
  console.log(resignationDetails, "resignationDetailsresignationDetailsresignationDetails++++++++")
  const mgrComments = resignationDetails?.mgrComments
    ? resignationDetails?.mgrComments.split(",")
    : [];
  const mgrCommentDates = resignationDetails?.mgrCommentDateTime
    ? resignationDetails?.mgrCommentDateTime.split(",")
    : [];

  const hrComments = resignationDetails?.hrComments
    ? resignationDetails?.hrComments.split(",")
    : [];
  const hrCommentDates = resignationDetails?.hrCommentDateTime
    ? resignationDetails?.hrCommentDateTime.split(",")
    : [];

  const empComments = resignationDetails?.empComments
    ? resignationDetails?.empComments.split(",")
    : [];
  const empCommentDates = resignationDetails?.empCommentDateTime
    ? resignationDetails?.empCommentDateTime.split(",")
    : [];

  const handleOpenWithdraw = () => {
    setIsPopupVisible(true);
  };

const handleWithdrawExit = async () => {
  const url = `${BASE_URL}:9029/api/eSeparation/withdraw/${resignationDetails.empCode}`;
  
  const updatedResignationDetails = {
    r1Status: "Closed",
    overAllStatus: "Withdrawn",
    hrStatus: "Closed",
  };

  try {
    const response = await axios.put(url, updatedResignationDetails);

    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Successfully withdrawn!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      window.location.reload();
    } else if (response.status === 404) {
      alert("Resignation details not found.");
    } else {
      alert("Failed to withdraw. Try again.");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};



  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setIsChecked(false);
  };
  const fetchComment = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}:9029/api/eSeparation/getEmpComments/${resignationDetails?.empCode}`
      );
      setCommentFetched(response.data);
      console.log(response.data, "+++++++++++++++++")
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComment();
  }, [resignationDetails]);

  // Combine the comments dynamically in the render logic
  const combinedComments = [
    ...empComments.map((comment, index) => ({
      comment,
      dateTime: empCommentDates[index],
      author:
        employeeDetails?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar ||
        "Employee", // Use Employee's name
    })),
    ...mgrComments.map((comment, index) => ({
      comment,
      dateTime: mgrCommentDates[index],
      author:
        employeeDetails?.fileAndObjectTypeBean?.empResDTO?.reportingManager ||
        "Manager",
    })),
    ...hrComments.map((comment, index) => ({
      comment,
      dateTime: hrCommentDates[index],
      author: employeeDetails?.hrName || "HR",
    })),
    ...commentFetched
      .filter((comment) => {
        const commentText = comment?.comment?.trim();
        return commentText;
      })
      .map((comment) => ({
        comment: comment.comment,
        dateTime: comment.dateTime,
        author: comment.author,
      })),
  ];

  combinedComments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const [comment, setComment] = useState("");

  const postComment = () => {
    if (comment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }
    const url = `${BASE_URL}:9029/api/eSeparation/sendEmpComments/${resignationDetails?.empCode}`;

    const payload = {
      empComments: comment, // The comment text needs to be sent as 'mgrComments'
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
            employeeDetails?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar ||
            "Employee",
        };

        // Add the new comment to the state
        setCommentFetched((prevComments) => [newComment, ...prevComments]);

        // Show success toast
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

        setComment(""); // Reset comment input
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
  console.log(combinedComments, "combinedCommentscombinedComments")
  const visibleComments = showMore
    ? combinedComments.reverse().slice()
    : combinedComments.reverse().slice(0, 2);

  return (
    <div className="container mx-auto h-[650px]">
      <div className="p-3 text-right">
        <button className="text-red-500 text-xl" onClick={closeDetails}>
          <FaRegCircleXmark />
        </button>
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:mx-3 mx-0 p-4 shadow-bottom ">
        <div className="col-span-1 p-2  shadow-bottom">
          <div className="py-3 text-center">
            {employeeDetails?.fileAndObjectTypeBean &&
              employeeDetails?.fileAndObjectTypeBean?.fileAndContentTypeBean &&
              employeeDetails?.fileAndObjectTypeBean?.fileAndContentTypeBean
                .file ? (
              <img
                src={`data:${employeeDetails?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${employeeDetails?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file}`}
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
            <h1 className="text-sm text-blue-500 font-bold">
              {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || "-"}
            </h1>
            <h1 className="text-xs text-gray-500">
              {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.designationResDTO
                ?.designationName || "-"}
            </h1>
          </div>
          <div className="grid grid-cols-3 text-xs px-4 gap-2">
            <div>
              <h1 className="text-gray-500">Employee Id</h1>
              <h1 className="text-[#00007D]">
                {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.empCode || "-"}
              </h1>
            </div>
            <div>
              <h1 className="text-gray-500">Contact No</h1>
              <h1 className="text-[#00007D]">
                {employeeDetails?.fileAndObjectTypeBean?.empResDTO
                  ?.primaryContactNo || "-"}
              </h1>
            </div>
            <div>
              <h1 className="text-gray-500">Email</h1>
              <h1 className="text-[#00007D] break-words">
                {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.emailId || "-"}
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-3 text-xs p-4 gap-2">
            <div>
              <h1 className="text-gray-500">Department</h1>
              <h1 className="text-[#00007D]">
                {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.mainDeptResDTO
                  ?.mainDepartment || "-"}
              </h1>
            </div>
            <div>
              <h1 className="text-gray-500">Reporting to</h1>
              <h1 className="text-[#00007D]">
                {employeeDetails?.fileAndObjectTypeBean?.empResDTO
                  ?.reportingManager || "-"}
              </h1>
            </div>
            <div>
              <h1 className="text-gray-500">Designation</h1>
              <h1 className="text-[#00007D]">
                {employeeDetails?.fileAndObjectTypeBean?.empResDTO
                  ?.designationResDTO?.designationName || "-"}
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-3 text-xs p-4 gap-2">
            <div>
              <h1 className="text-gray-500">Location</h1>
              <h1 className="text-[#00007D]">
                {employeeDetails?.userDTO?.locationResDTO?.locationName || "-"}
              </h1>
            </div>
            <div>
              <h1 className="text-gray-500">Empo</h1>
              <h1 className="text-[#00007D]">{employeeDetails?.empo || "-"}</h1>
            </div>
            <div>
              <h1 className="text-gray-500">Project / Cost Centre</h1>
              <h1 className="text-[#00007D]">
                {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.projectResDTO
                  ?.projectId || "-"}
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-3 text-xs p-4 gap-2">
            <div>
              <h1 className="text-gray-500">Joining Date</h1>
              <h1 className="text-[#00007D]">
                {formatDate(
                  employeeDetails?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining
                ) || "-"}
              </h1>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          {/* <img
            src="exitMan.png"
            className="mt-10 h-[60vh] w-[40vh] mx-auto"
            alt="ResignationImage"
          /> */}
          <div className="">
            <div className="col-span-1 flex gap-2 lg:mx-10 mx-2 lg:mt-0 md:mt-0 mt-2">
              <h1 className="font-semibold lg:text-base text-base text-gray-700 whitespace-nowrap">
                Status :
              </h1>
              <h1
                className={`font-semibold lg:text-base text-base whitespace-nowrap  ${resignationDetails?.overAllStatus === "In progress"
                    ? "text-[#DFCC22]"
                    : resignationDetails?.overAllStatus === "Completed"
                      ? "text-[#1FD127]"
                      : "text-red-500"
                  }`}
              >
                {resignationDetails?.overAllStatus === "Submitted to Manager" ||
                  resignationDetails?.overAllStatus === "Pending With HR" ||
                  resignationDetails?.overAllStatus === "Not Started"
                  ? "Pending"
                  : resignationDetails?.overAllStatus}
              </h1>
            </div>
            <div className="mx-10">
              <div className="mx-10 flex items-center justify-between">
                <h1 className="font-semibold text-base mt-2 text-gray-700">
                  Discussion Thread
                </h1>
                <button
                  className="bg-red-500 text-white w-[84px] rounded-md text-[15px]"
                  onClick={handleOpenWithdraw}
                >
                  Withdraw
                </button>
              </div>
              {isPopupVisible && (
                <div className="popup fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 py-10 px-56">
                  <div className="popup-content bg-white md:p-24 p-3 h-[]50% md:w-full w-[412px] flex flex-col text-base">
                    <div>
                      Are you sure you want to withdraw the already submitted
                      exit request? It will remove the request from the
                      manager's pending requests page.
                    </div>
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="agree"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="agree">I agree</label>
                    </div>
                    <div className="mt-4">
                      <button
                        className="bg-red-500 text-white p-2 rounded mr-2"
                        disabled={!isChecked}
                        onClick={handleWithdrawExit}
                      >
                        Withdraw
                      </button>
                      <button
                        className="bg-gray-500 text-white p-2 rounded"
                        onClick={handleClosePopup}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-6 mt-3 items-center">
                <div className="col-span-1 border-r-2 border-gray-300 h-full mr-3">
                  {resignationDetails?.r1Status !== "Retained" && (
                    <h1 className=" text-base bg-lime-400 rounded-full h-10 w-10 text-center text-white font-semibold mt-2 pt-[8px]">
                      {
                        // employeeDetails?.fileAndObjectTypeBean?.empResDTO
                        //   .hiringHr
                        "HR"}
                    </h1>
                  )}
                  <h1 className=" text-base bg-orange-500 rounded-full h-10 w-10 text-center text-white font-semibold mt-4 pt-[8px]">
                    {initial(
                      employeeDetails?.fileAndObjectTypeBean?.empResDTO
                        ?.reportingManager
                    )}
                  </h1>
                  <h1 className=" text-base bg-blue-500 rounded-full h-10 w-10 text-center text-white font-semibold mt-5 pt-[8px]">
                    {initial(
                      employeeDetails?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar
                    )}
                  </h1>
                </div>
                <div className="col-span-5">
                  {resignationDetails?.r1Status !== "Retained" && (
                    <h1 className="font-semibold text-gray-800 text-sm pt-2">
                      {resignationDetails?.hrStatus === "Approved" ? (
                        <h1>
                          Approved<br></br>{" "}
                          <span className="text-gray-500 text-xs font-normal">
                            By HR
                          </span>
                        </h1>
                      ) : resignationDetails?.hrStatus === "Retained" ? (
                        <h1>
                          Retained<br></br>
                          <span className="text-gray-500 text-xs font-normal">
                            By HR
                            {
                              employeeDetails?.fileAndObjectTypeBean?.empResDTO
                                ?.hrName
                            }
                          </span>
                        </h1>
                      ) : (
                        <h1>
                          Pending<br></br>
                          <span className="text-gray-500 text-xs font-normal">
                            With HR
                            {
                              employeeDetails?.fileAndObjectTypeBean?.empResDTO
                                ?.hrName
                            }
                          </span>
                        </h1>
                      )}
                    </h1>
                  )}
                  <h1 className="font-semibold text-gray-800 text-sm mt-4">
                    {resignationDetails?.r1Status === "Approved" ? (
                      <h1>
                        Approved<br></br>{" "}
                        <span className="text-gray-500 text-xs font-normal">
                          By{" "}
                          {
                            employeeDetails?.fileAndObjectTypeBean?.empResDTO
                              ?.reportingManager
                          }
                        </span>
                      </h1>
                    ) : resignationDetails?.hrStatus === "Retained" ? (
                      <h1>
                        Retained<br></br>
                        <span className="text-gray-500 text-xs font-normal">
                          By{" "}
                          {
                            employeeDetails?.fileAndObjectTypeBean?.empResDTO
                              ?.reportingManager
                          }
                        </span>
                      </h1>
                    ) : (
                      <h1>
                        Pending<br></br>
                        <span className="text-gray-500 text-xs font-normal">
                          With{" "}
                          {
                            employeeDetails?.fileAndObjectTypeBean?.empResDTO
                              ?.reportingManager
                          }
                        </span>
                      </h1>
                    )}
                  </h1>
                  <h1 className="text-gray-800 text-sm font-semibold mt-4">
                    {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar}{" "}
                    <br></br>
                    <span className="text-gray-500 text-xs font-normal">
                      has Submitted
                    </span>
                  </h1>
                  <h1 className="text-gray-500 text-xs">
                    {resignationDetails?.dateOfResignation}
                  </h1>
                </div>
              </div>
              <div className="">
                <div>
                  <div className="flex py-4 mt-2">
                    <input
                      className="border border-gray-300 w-[80%] outline-none text-sm p-1"
                      placeholder="Add your comment here....."
                      value={comment}
                      disabled={
                        resignationDetails?.hrStatus === "Approved" &&
                        resignationDetails?.hrStatus === "Closed" &&
                        resignationDetails?.hrStatus === "Retained" &&
                        resignationDetails?.r1Status === "Closed" &&
                        resignationDetails?.r1Status === "Retained"
                      }
                      onChange={(e) => setComment(e.target.value)}
                    />
                    {resignationDetails?.hrStatus === "Approved" &&
                      resignationDetails?.hrStatus === "Closed" &&
                      resignationDetails?.hrStatus === "Retained" &&
                      resignationDetails?.r1Status === "Closed" &&
                      resignationDetails?.r1Status === "Retained" ? (
                      ""
                    ) : (
                      <IoEnterOutline
                        className="ml-[-2rem] mt-[5px] text-xl cursor-pointer"
                        onClick={postComment}
                      />
                    )}
                  </div>
                  <div className="mt-3 px-4 text-base">
                    {combinedComments.length > 0 ? (
                      <div
                        className={`overflow-y-auto ${showMore ? "h-52" : ""}`}
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
                                    className={`text-base ${index % 2 === 0
                                        ? "bg-blue-500"
                                        : "bg-orange-500"
                                      } rounded-full h-10 w-10 text-center text-white font-semibold pt-[8px]`}
                                  >
                                    {initial(entry.author)}
                                  </h1>
                                </div>
                                <div className="col-span-5">
                                  <p className="text-gray-600 font-normal">
                                    <strong>{entry.author}</strong> added a{" "}
                                    <strong>Comment</strong>
                                  </p>
                                  <p className="text-gray-500">
                                    {entry.comment}
                                  </p>
                                  <p className="text-gray-400 font-medium mb-4">
                                    {entry.dateTime}
                                  </p>
                                </div>
                              </div>
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
        </div>
      </div>
      <div className="mx-3 mt-3 shadow-bottom">
        <div>
          <h1 className="font-semibold lg:text-base md:text-base text-sm mx-5 mt-4 pt-3 text-gray-700">
            Employee Exit Details
          </h1>
        </div>
        <div className="grid grid-cols-1">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center lg:text-base md:text-base text-sm px-5 font-normal lg:space-y-4 md:space-y-2 space-y-1">
            <h1 className="mt-4">Date of Resignation</h1>
            <h1 className="border border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
              {formatDate(resignationDetails?.dateOfResignation) || "="}
            </h1>
            <h1 className="">Last working Date Requested</h1>
            <h1 className="border border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
              {formatDate(resignationDetails?.lastWorkingDayRequest) || "-"}
            </h1>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center lg:text-base md:text-base text-sm font-normal px-5 lg:py-2 md:py-0 lg:space-y-4 md:space-y-2 space-y-1">
            <h1 className="mt-4">Last working Date</h1>
            <h1 className="border border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
              {formatDate(resignationDetails?.lastWorkingDay) || "-"}
            </h1>
            <h1>Reason for Exit</h1>
            <h1 className="border border-gray-400 py-1 px-2 lg:w-[170px] md:w-[140px] w-[130px]">
              {resignationDetails?.reason || "-"}
            </h1>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center lg:py-2 md:py-0 lg:text-base md:text-base text-sm font-normal px-5 lg:pb-3 md:pb-1 pb-1 lg:space-y-4 md:space-y-2 space-y-1">
            <h1 className="lg:whitespace-nowrap md:whitespace-nowrap whitespace-nowrap lg:mt-4 md:mt-0 ">
              Additional Remarks
            </h1>
            <h1 className="text-wrap border border-gray-400 py-1 px-4 lg:w-[270px] md:w-[200px] w-[145px]">
              {resignationDetails?.remarks || "-"}
            </h1>
          </div>
        </div>
      </div>
      <div className="mx-3 mt-3 shadow-bottom">
        <div>
          <h1 className="font-semibold  lg:text-base md:text-base text-sm mx-5 mt-4 pt-3 text-gray-700">
            Filled by Manager
          </h1>
        </div>
        <div className="">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 lg:text-base md:text-base text-sm px-5 mt-2 items-center font-normal lg:space-y-4 md:space-y-2 space-y-1">
            <h1 className="whitespace-nowrap mt-4">Notice Period Waiver</h1>
            <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 px-10 p-1">
              {resignationDetails?.noticePeriodWaiver ? "Yes" : "No" || "-"}
            </h1>
            <h1 className="lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal">
              Remarks to Employee
            </h1>
            <h1 className="border border-gray-300 lg:w-52 md:w-60 w-36 p-1">
              {resignationDetails?.managerRemarksToEmp || "-"}
            </h1>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 lg:py-3 md:py-0 text-gray-500 lg:text-base md:text-base text-sm px-5 lg:mt-2 md:mt-0 mt-0 items-center font-normal lg:space-y-4 md:space-y-2 space-y-1">
            <h1>Expected Last working Date</h1>
            <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-10">
              {formatDate(resignationDetails?.expectedLastWorkingDay || "-")}
            </h1>
            <h1 className="whitespace-nowrap">Remarks to Reviewer</h1>
            <h1 className="border border-gray-300 lg:w-52 md:w-60 w-36 p-1">
              {resignationDetails?.managerRemarksToReviewer || "-"}
            </h1>
          </div>
        </div>
      </div>
      <div className="mx-3 mt-3 shadow-bottom pb-6">
        <div>
          <h1 className="font-semibold lg:text-base md:text-base text-sm mx-5 mt-4 pt-3 text-gray-700">
            To be filled by HR
          </h1>
        </div>
        <div className="flex items-center gap-12 lg:text-base md:text-base text-sm">
          <h1 className="lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal text-gray-500 p-5 font-normal ">
            Remarks to Reviewer
          </h1>
          <textarea
            rows={1}
            className="outline-none rounded-none border border-gray-400 text-gray-700 mr-2 w-1/2 p-2 my-6"
            placeholder="Enter your remarks here"
            value={resignationDetails?.hrRemarksToReviewer || "NA"}
            disabled
          />
        </div>
      </div>
      {/* {resignationDetails?.overAllStatus === "In progress" && (
        <div className="flex items-center py-5 px-8 justify-between mx-3 mt-3 shadow-bottom bg-[#FCFF65]">
          <h1 className="text-lg font-semibold text-gray-800">
            F & F settlement form
          </h1>
          <button
            className="px-5 py-1 text-blue-600 border font-semibold bg-white border-blue-600"
            onClick={() => {
              fillFNFForm(resignationDetails);
            }}
          >
            {fnfData.exitFormStatus === "Submitted"
              ? "View FNF Form"
              : "Fill & Submit"}
          </button>
        </div>
      )} */}
    </div>
  );
}

export default ViewDetails;
