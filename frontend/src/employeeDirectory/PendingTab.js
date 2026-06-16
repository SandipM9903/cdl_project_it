import React, { useEffect, useState } from "react";
import "./PendingTab.css";
import axios from "axios";
import Swal from "sweetalert2";
import { IoEnterOutline } from "react-icons/io5";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";

function PendingTab({ employeeDetails, resignationDetails }) {
  const [resignData] = resignationDetails.filter(
    (detail) =>
      detail.overAllStatus !== "Closed" && detail.overAllStatus !== "Withdrawn" && detail.overAllStatus !== "Rejected"
  );

  console.log(resignData, "+++++++++++++++++++");
  console.log(employeeDetails, "+++++++++++++++++++>>>>>>>");

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

  const [imageUrl, setImageUrl] = useState([]);
  const empId = employeeDetails.empId;

  const calculateNoticePeriod = (dateOfResignation, expectedLastWorkingDay) => {
    const resignationDate = new Date(dateOfResignation);
    const lastWorkingDay = new Date(expectedLastWorkingDay);
    if (isNaN(resignationDate) || isNaN(lastWorkingDay)) return "-";
    const diffDays = Math.ceil(
      (lastWorkingDay - resignationDate) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 0 ? diffDays : "-";
  };
  const noticePeriod = calculateNoticePeriod(
    resignData.dateOfResignation,
    resignData.expectedLastWorkingDay
  );

  // useEffect(() => {
  //   const getImage = (empId) => {
  //     axios
  //       .get(`http://localhost:9029/api/download?empId=${empId}`, {
  //         responseType: "arraybuffer",
  //       })
  //       .then((response) => {
  //         const imageBlob = new Blob([response.data], { type: "image/png" });
  //         const image = URL.createObjectURL(imageBlob);
  //         setImageUrl((prevState) => ({
  //           ...prevState,
  //           [empId]: image, // Store image URL for each employee using their empId as key
  //         }));
  //       })
  //       .catch((error) => console.error(error));
  //   };
  //   if (empId) {
  //     getImage(empId);
  //   }
  // }, [empId]);

  const [commentFetched, setCommentFetched] = useState([]);

  const empDetail =
    resignData && resignationDetails.length > 0
      ? resignationDetails.find((detail) => detail.id === resignData.id)
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
        `http://localhost:9029/api/getEmpComments/${resignData.empId}`
      );
      console.log(response.data, "{{{{{{{{{{{{")
      setCommentFetched(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComment();
  }, [resignData]);

  // Combine the comments dynamically in the render logic
  const combinedComments = [
    ...empComments.map((comment, index) => ({
      comment,
      dateTime: empCommentDates[index],
      author:
        employeeDetails?.fileAndObjectTypeBean?.empResDTO?.firstName ||
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

  const [comment, setComment] = useState("");

  const postComment = () => {
    if (comment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }
    const url = `http://localhost:9029/api/sendEmpComments/${resignData.empId}`;

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
            employeeDetails?.fileAndObjectTypeBean?.empResDTO?.firstName ||
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

  const visibleComments = showMore
    ? combinedComments.reverse().slice()
    : combinedComments.reverse().slice(0, 2);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleOpenWithdraw = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setIsChecked(false);
  };

  const handleWithdrawExit = async () => {
    const url = `http://localhost:9029/api/withdraw/${resignData.empId}`;
    const resignationDetails = {
      r1Status: "Closed",
      overAllStatus: "Withdrawn",
      hrStatus: "Closed",
    };

    try {
      const response = await axios.put(url, resignationDetails);

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

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3">
        <div className="col-span-2 py-4 px-2">
          <div className="grid grid-cols-12 border border-gray-300 shadow-bottom">
            <div className="col-span-3 text-center">
              {employeeDetails.fileAndObjectTypeBean &&
                employeeDetails.fileAndObjectTypeBean.fileAndContentTypeBean &&
                employeeDetails.fileAndObjectTypeBean.fileAndContentTypeBean
                  .file ? (
                <img
                  src={`data:${employeeDetails.fileAndObjectTypeBean.fileAndContentTypeBean.contentType};base64,${employeeDetails.fileAndObjectTypeBean.fileAndContentTypeBean.file}`}
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
              <h1 className="text-[#1B5CAD] text-lg font-semibold">
                {employeeDetails.fileAndObjectTypeBean.empResDTO.firstName ||
                  "NA"}
              </h1>
              <h1 className="text-[#686B6F] text-sm">
                {employeeDetails.fileAndObjectTypeBean.empResDTO
                  .designationResDTO.designationName || "NA"}
              </h1>
            </div>
            <div className="col-span-9 ml-8">
              <div className="grid grid-cols-3 text-[14px] mt-2 gap-2 mx-4">
                <div>
                  <h1 className="text-[#686B6F] mt-5">Employee ID</h1>
                  <h1 className="text-[#021C59] mt-1">
                    {employeeDetails.fileAndObjectTypeBean.empResDTO.empId ||
                      "NA"}
                  </h1>
                </div>
                <div>
                  <h1 className="text-[#686B6F] mt-5">Contact</h1>
                  <h1 className="text-[#021C59] mt-1">
                    {employeeDetails.fileAndObjectTypeBean.empResDTO
                      .primaryContactNo || "NA"}
                  </h1>
                </div>
                <div>
                  <h1 className="text-[#686B6F] mt-5">Email</h1>
                  <h1 className="text-[#021C59] mt-1 break-words">
                    {employeeDetails.fileAndObjectTypeBean.empResDTO.emailId ||
                      "NA"}
                  </h1>
                </div>
              </div>
              <div className="grid grid-cols-3 mt-2 text-[14px] gap-2 mx-4">
                <div>
                  <h1 className="text-[#686B6F] mt-3">Department</h1>
                  <h1 className="text-[#021C59] mt-1">
                    {employeeDetails.fileAndObjectTypeBean.empResDTO
                      .mainDeptResDTO.mainDepartment || "NA"}
                  </h1>
                </div>
                <div>
                  <h1 className="text-[#686B6F] mt-3">Reporting To</h1>
                  <h1 className="text-[#021C59] mt-1">
                    {employeeDetails.fileAndObjectTypeBean.empResDTO
                      .reportingManager || "NA"}
                  </h1>
                </div>
                <div>
                  <h1 className="text-[#686B6F] mt-3">Employment Type</h1>
                  <h1 className="text-[#021C59] mt-1">
                    {employeeDetails.empType || "NA"}
                  </h1>
                </div>
              </div>
              <div className="grid grid-cols-3 mt-2 text-[14px] gap-2 mx-4">
                <div>
                  <h1 className="text-[#686B6F] mt-3">Location</h1>
                  <h1 className="text-[#021C59] mt-1">
                    {employeeDetails.userDTO.locationResDTO.locationName ||
                      "NA"}
                  </h1>
                </div>
                <div>
                  <h1 className="text-[#686B6F] mt-3">Empo</h1>
                  <h1 className="text-[#021C59] mt-1">
                    {employeeDetails.empo || "NA"}
                  </h1>
                </div>
              </div>
              <div className="grid grid-cols-3 mt-2 text-[14px] gap-2 mx-4">
                <div>
                  <h1 className="text-[#686B6F] mt-3">Joining Date</h1>
                  <h1 className="text-[#021C59] mt-1 mb-1">
                    {formatDate(
                      employeeDetails.fileAndObjectTypeBean.empResDTO
                        .dateOfJoining
                    ) || "NA"}
                  </h1>
                </div>
                <div>
                  <h1 className="text-[#686B6F] mt-3">Project/Cost Centre</h1>
                  <h1 className="text-[#021C59] mt-1 mb-1">
                    {employeeDetails.fileAndObjectTypeBean.empResDTO
                      .projectResDTO.projectName || "NA"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="grid mt-4 grid-cols-1  font-semibold border border-gray-300 shadow-bottom">
            <div className="grid grid-cols-3 mx-10">
              <div>
                <h1 className="text-[#686B6F] mt-4">Date of Resignation</h1>
                <h1 className="text-gray-800 mt-1">
                  {formatDate(resignData.dateOfResignation) || "-"}
                </h1>
              </div>
              <div>
                <h1 className="text-[#686B6F] mt-4">Reason for Exit</h1>
                <h1 className="text-gray-800 mt-1">
                  {resignData.reason || "-"}
                </h1>
              </div>
              <div>
                <h1 className="text-[#686B6F] mt-3">Notice Period</h1>
                <h1 className="text-gray-800 mt-1">{noticePeriod} Days</h1>
              </div>
            </div>
            <div className="grid grid-cols-3 mx-10">
              <div>
                <h1 className="text-[#686B6F] mt-5">
                  Last Working Day Requested
                </h1>
                <h1 className="text-gray-800 mt-1 mb-3">
                  {formatDate(resignData.lastWorkingDayRequest) || "-"}
                </h1>
              </div>
              <div>
                <h1 className="text-[#686B6F] mt-5">
                  Last Working Day Accepted
                </h1>
                <h1 className="text-gray-800 mt-1 mb-3">
                  {formatDate(resignData.expectedLastWorkingDay) || "-"}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1  border border-gray-300 mt-4 mb-4">
          <div className="">
            <div className="ml-3 border-gray-300">
              <h2 className="mb-6 text-base font-semibold ml-4 mt-2">Timeline</h2>
              <div className="flex justify-between items-center p-4">
                <div>
                  <h2 className="text-sm text-[#4B4C4D] font-medium">{resignData.overAllStatus === 'Submitted to Manager'
                    ? (<h1><span className="font-medium text-red-500">Pending</span><br></br>With Manager</h1>)
                    : resignData.overAllStatus === 'Pending With HR' || resignData.overAllStatus === 'Not Started'
                      ? (<h1><span className="font-medium text-red-500">Pending</span><br></br>With HR</h1>)
                      : resignData.overAllStatus === 'In progress'
                        ? (<h1><span className="font-medium text-red-500">Pending</span><br></br>With Departments</h1>)
                        : resignData.overAllStatus === 'Completed'
                          ? (<h1 className="flex items-center gap-2">Status :<br></br><span className="font-medium text-[#3ED745]">Completed</span></h1>)
                          : (<h1 className="flex items-center gap-2">Status :<br></br><span className="font-medium text-[#3ED745]">Exited</span></h1>)}</h2>
                </div>

                {/* Move the button to the right */}
                <button className="bg-red-500 text-white w-[84px] rounded-md text-[15px] ml-auto" onClick={handleOpenWithdraw}>Withdraw</button>
              </div>
              {isPopupVisible && (
                <div className="popup fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 py-36 px-56">
                  <div className="popup-content bg-white md:p-24 p-3 h-full md:w-full w-[412px] flex flex-col text-base">
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

              <div className="flex p-4">
                <input
                  className="border border-gray-300 w-full outline-none text-sm p-1"
                  placeholder="Add your comment here....."
                  value={comment}
                  disabled={(resignData.hrStatus === 'Approved' || resignData.hrStatus === 'Closed' || resignData.hrStatus === 'Retained' || resignData.r1Status === 'Closed' || resignData.r1Status === 'Retained')}
                  onChange={(e) => setComment(e.target.value)}
                />
                {(resignData.hrStatus === 'Approved' && resignData.hrStatus === 'Closed' && resignData.hrStatus === 'Retained' && resignData.r1Status === 'Closed' && resignData.r1Status === 'Retained') ? "":
                  <IoEnterOutline
                    className="ml-[-2rem] mt-[5px] text-xl cursor-pointer"
                    onClick={postComment} 
                  />
                }
              </div>
              <div className="mt-3 px-4 text-base">
                {combinedComments.length > 0 ? (
                  <div className={`overflow-y-auto ${showMore ? "h-52" : ""}`}>
                    <ul>
                      {visibleComments.map((entry, index) => (
                        <li
                          key={index}
                          style={{ marginBottom: "10px" }}
                          className="text-xs"
                        >
                          <p className="text-gray-600 font-normal">
                            <strong>{entry.author}</strong> added a{" "}
                            <strong>Comment</strong>
                          </p>
                          <p className="text-gray-500">{entry.comment}</p>
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
    </div>
  );
}

export default PendingTab;
