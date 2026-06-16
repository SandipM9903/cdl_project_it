import { useEffect, useState, useMemo } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { GrPrevious, GrNext } from "react-icons/gr";
import Service from "../../services/Service";
import axios from "axios";
import Swal from "sweetalert2";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./HrPendingForm.css";
import { IoEnterOutline } from "react-icons/io5";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import { BiFilterAlt } from "react-icons/bi";
import { IoEyeSharp } from "react-icons/io5";
import ViewExitInterviewForm from './ViewExitInterviewForm';
import { BASE_URL } from '../../../config/Config';

function HrPendingForms() {
  const [empDetails, setEmpDetails] = useState([]);
  const [imageUrl, setImageUrl] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEmployee, setselectedEmployee] = useState(null);
  const [isRetainSelected, setIsRetainSelected] = useState(false);
  const locationOptions = [
    "Bengaluru",
    "Delhi",
    "Mumbai",
    "Rajasthan",
    "Kerala",
  ];
  const deptOptions = ["SSD", "Finance", "Technical", "HR", "Service"];
  const [selectedLocation, setSelectedLocation] = useState("All Location");
  const [selectedDept, setSelectedDept] = useState("All Dept");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [viewInterviewOpen, setViewInterviewOpen] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [noticePeriodWaiverByHr, setNoticePeriodWaiverByHr] = useState(false);
  //const empCode = sessionStorage.getItem("UserId");
  const empCode = localStorage.getItem("empId");
  const overAllStatus = "Pending With HR";
  const workFlowName = sessionStorage.getItem("workflowName");
  const [mailSent, setMailSent] = useState(false);
  const [terminationMailSent, setTerminationMailSent] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
  const handleViewInterview = (resignation) => {
    setSelectedResignation(resignation);
    setViewInterviewOpen(true);
  };
  const fetchData = () => {
    axios
      .get(
        `${BASE_URL}:9029/api/eSeparation/getResignDataByOverAllStatus/${overAllStatus}/${empCode}`
      )
      .then((res) => {
        const resignData = res.data;

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
                  empDetail?.fileAndObjectTypeBean?.empResDTO?.empCode ===
                  resignDetail?.empCode
              );
              return { ...empDetail, ...matchingResignDetail };
            });

            setEmpDetails(mergedData);
            console.log("Merged data:::" + JSON.stringify(mergedData))
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

  const dropdownOptions = useMemo(() => {
    return isRetainSelected
      ? [{ value: "N/A", label: "N/A" }]
      : [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ];
  }, [isRetainSelected]);
  const handleExpectedLastWorkingDay = (e) => {
    setHrApprovalDetails({
      ...hrApprovalDetails,
      expectedLastWorkingDay: e.target.value,
    });
  };
  useEffect(() => {
    // First, fetch the resignation details
    fetchData();
  }, []);
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
  const toInputDate = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-"); // because your API gives DD-MM-YYYY
    if (!day || !month || !year) return "";

    return `${year}-${month}-${day}`; // convert to YYYY-MM-DD
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

  // const formatDate = (dateString) => {
  //   if (!dateString || isNaN(new Date(dateString).getTime())) {
  //     return "-";
  //   }
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    // Support both Date objects and strings
    const date = new Date(dateString);

    // Invalid date check
    if (isNaN(date.getTime())) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // const getImage = (empCode) => {
  //     // axios.get(`http://localhost:9029/api/eSeparation/download?empCode=${empCode}`, {
  //     //     responseType: 'arraybuffer',
  //     // })
  //     Service.getEmployeeImage(empCode)
  //         .then(response => {
  //             const imageBlob = new Blob([response.data], { type: 'image/png' });
  //           //  const image = URL.createObjectURL(imageBlob);
  //             // setImageUrl(prevState => ({
  //             //     ...prevState,
  //             //     [empCode]: image  // Store image URL for each employee using their empCode as key
  //             // }));
  //         })
  //         .catch(error => console.error(error));
  // };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // const filteredResignDetails = empDetails
  //     .filter(emp =>
  //         (selectedLocation === 'All Location' || emp.location === selectedLocation) &&
  //         (selectedDept === 'All Dept' || emp.department === selectedDept) &&
  //         emp.empName.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  const filteredResignDetails = empDetails.filter(
    (emp) =>
      (selectedLocation === "All Location" ||
        emp.location === selectedLocation) &&
      (selectedDept === "All Dept" || emp.department === selectedDept) &&
      emp.empName &&
      emp.empName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFilteredPages = Math.ceil(
    filteredResignDetails.length / itemsPerPage
  );
  const startFilteredIndex = (currentPage - 1) * itemsPerPage;
  const endFilteredIndex = Math.min(
    startFilteredIndex + itemsPerPage,
    filteredResignDetails.length
  );
  const currentFilteredDetails = filteredResignDetails.slice(
    startFilteredIndex,
    endFilteredIndex
  );

  const handlePreviousPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalFilteredPages));

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

  const handleAccept = (employee) => {
    setIsPopupOpen(true);
    setselectedEmployee(employee);
    console.log("selectedEmployee:::::::" + JSON.stringify(employee));



  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setselectedEmployee(null);
  };
  const handleStayInterview = (employee) => {
    console.log("Stay Interview Clicked", employee);
    setSelectedResignation(employee);
    setViewInterviewOpen(true);
  };
  const [hrApprovalDetails, setHrApprovalDetails] = useState({
    hrRemarksToReviewer: "",
    fnfEnableForBu: false,
    fnfEnableForSales: false,
    noticePeriodWaiverByHr: false,
  });
  const handleCheckboxChangeForSales = (e) => {
    setHrApprovalDetails((prev) => ({
      ...prev,
      fnfEnableForSales: e.target.checked,
    }));
  };

  const handleReview = (e) => {
    setHrApprovalDetails((prev) => ({
      ...prev,
      hrRemarksToReviewer: e.target.value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setHrApprovalDetails((prev) => ({
      ...prev,
      fnfEnableForBu: e.target.checked,
    }));
  };

  const handleApproval = () => {
    const wbsId =
      selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.projectResDTO?.projectId; // Ensure wbsId is retrieved from hrApprovalDetails
    const resquestedempCode =
      selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.empCode;
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Forward the Resignation to the next level?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Accept",
    }).then((result) => {
      if (result.isConfirmed) {
        // First, make the axios call to approve the resignation
        // debugger
        console.log("workflow Api call" + workFlowName + selectedEmployee?.id);
        axios
          .put(
            `${BASE_URL}:9029/api/eSeparation/approveByHr/${selectedEmployee?.id}/${workFlowName}`,
            hrApprovalDetails
          )
          .then(() => {
            console.log("Selected Id::::::::" + selectedEmployee?.id);
            console.log(
              "Resignation Details::::::::" + JSON.stringify(hrApprovalDetails)
            );
            console.log("workFlowName Id::::::::" + workFlowName);
            // Show the approved popup
            Swal.fire({
              title: "Approved!",
              text: "The employee has been approved.",
              icon: "success",
              timer: 2000, // Close popup automatically after 2 seconds
              showConfirmButton: false,
            }).then(() => {
              console.log("comming to then");
              // Only after the approval popup is shown, execute the next action
              axios.post(
                `${BASE_URL}:9028/api/workflow/savingMainStatus/${resquestedempCode}/${workFlowName}/${wbsId}`
              );

              setIsPopupOpen(false);
              fetchData();
            });

            // Delay the fetchData call and popup close by 2 seconds
            setTimeout(() => {
              setIsPopupOpen(false);
              fetchData();
            }, 2000); // 2000 milliseconds = 2 seconds
          })
          .catch((error) => {
            console.error(
              "Error details:",
              error.response?.data || error.message
            );
          });
      }
    });
  };


  const handleSendEmail = (employee) => {
    // logic to send email
    console.log(`Sending email for employee: ${employee?.fileAndObjectTypeBean?.empResDTO?.empCode}`);
    const reqEmpCode = employee?.fileAndObjectTypeBean?.empResDTO?.empCode;
    const url = `${BASE_URL}:9029/api/eSeparation/sendProhibitionMailByHR/${reqEmpCode}`;

    axios.post(url)
      .then(response => {
        console.log('API response:', response.data);
        console.log(`Email sent for employee: ${reqEmpCode}`);
        setMailSent(true);
      })
      .catch(error => {
        console.error('Error calling API:', error);
      });
  };

  const handleTerminate = (employee) => {
    // logic to send email
    console.log(`Sending email for employee: ${employee?.fileAndObjectTypeBean?.empResDTO?.empCode}`);
    const reqEmpCode = employee?.fileAndObjectTypeBean?.empResDTO?.empCode;
    const url = `${BASE_URL}:9029/api/eSeparation/sendTerminationMailByHR/${reqEmpCode}`;

    axios.post(url)
      .then(response => {
        console.log('API response:', response.data);
        console.log(`Email sent for employee: ${reqEmpCode}`);
        setTerminationMailSent(true);
      })
      .catch(error => {
        console.error('Error calling API:', error);
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
            `${BASE_URL}:9029/api/eSeparation/retainByHr/${selectedEmployee?.id}`,
            hrApprovalDetails
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

  useEffect(() => {
    if (empDetails && empDetails.empCode) {
      fetchComment();
    }
  }, [empDetails]);

  // Combine mgrComments and hrComments into a single array with author and date information
  // Combine the comments dynamically in the render logic
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

  const [comment, setComment] = useState("");

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

  const [showMore, setShowMore] = useState(false);

  // Toggle between showing all comments or only the first three
  const toggleShowMore = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  const visibleComments = showMore
    ? combinedComments.reverse().slice()
    : combinedComments.reverse().slice(0, 2);
const filteredEmployeeList = empDetails.filter((emp) => {
    const name = emp?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || "";
    const empCode = emp?.fileAndObjectTypeBean?.empResDTO?.empCode || "";
    const query = searchTerm.toLowerCase();

    return name.toLowerCase().includes(query) || empCode.toLowerCase().includes(query);
});
  return (
    <div className="container mx-auto">
      {/* <div className="flex lg:flex-col md:flex-col flex-col">
        <div className="flex lg:flex-row item-center md:flex-row flex-row">
          <h1 className="text-sm text-gray-900 lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal font-semibold mx-8 mt-6">
            Pending Exit Request
          </h1>
          <input
            type="text"
            id="default-search"
            className="block lg:w-72 md:w-72 w-48 px-6 text-sm lg:mt-7 md:mt-6 mt-7 text-black border shadow-bottom rounded-[99px] outline-none bg-white lg:ml-8 md:ml-8 -ml-6  h-8"
            placeholder="Search for Employee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
        </div>
        <div className="flex text-xs lg:flex-row md:flex-col flex-col items-center gap-6 lg:mx-9 lg:ml-8 ml-0 md:-ml-0 mt-5">
          <div className="flex lg:flex:row md:flex-row flex-col md:gap-4">
            <div className="locationDropdown lg:mx-0 mx-10 whitespace-nowrap grid grid-cols-3 text-sm items-center gap-4">
              <h1>Location :</h1>
              <Dropdown
                className="w-40 text-xs border-b -ml-5 border-gray-300"
                placeholder={"All Location"}
                options={locationOptions}
                value={selectedLocation}
                onChange={(option) => setSelectedLocation(option.value)}
              />
            </div>
            <div className="locationDropdown whitespace-nowrap grid grid-cols-3 lg:mt-0 md:mt-0 mt-2 lg:mx-0 mx-10 items-center gap-4">
              <h1>Department :</h1>
              <Dropdown
                className="w-40 border-b -ml-3 border-gray-300"
                placeholder={"All Dept"}
                options={deptOptions}
                value={selectedDept}
                onChange={(option) => setSelectedDept(option.value)}
              />
            </div>
          </div>
          <div className="flex lg:flex:row md:flex-row flex-row md:gap-4 ">
            <div className="flex items-center whitespace-nowrap gap-4  lg:ml-0 md:-ml-36 ml-10">
              <h1>
                <BiFilterAlt />
              </h1>
              <Dropdown
                className="w-40 border-b border-gray-300"
                placeholder={"Advance Filter"}
              />
            </div>
            <div className="flex justify-between mx-3 items-center text-gray-500 lg:ml-20 md:ml-20 ml-3 font-semibold">
              <div className="whitespace-nowrap pagination-info mr-3">
                {currentPage} - {totalFilteredPages} / {totalFilteredPages}
              </div>
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
                  disabled={currentPage === totalFilteredPages}
                  className="pagination-button"
                >
                  <GrNext />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex justify-center gap-2 mt-6">
          <input
            type="text"
            placeholder="Search by employee name or employee code..."
            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-96 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}

          />
        </div>
      {empDetails.length === 0 ? (
        <div className="mx-8 mt-6 text-gray-600 text-center text-lg font-semibold">
          There are no pending requests.
        </div>
      ) : (
        <>
          {filteredEmployeeList.map((employee) => (
            <div
              key={employee?.id}
              className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 mx-8 mt-6 border rounded-lg border-gray-500 p-2 shadow-bottom bg-white"
            >
              <div className="col-span-1 lg:w-40 md:w-full w-full text-center">
                <h1 className="text-gray-600 font-semibold">Employee Name</h1>
                {employee?.fileAndObjectTypeBean &&
                  employee?.fileAndObjectTypeBean.fileAndContentTypeBean &&
                  employee?.fileAndObjectTypeBean.fileAndContentTypeBean?.file ? (
                  <img
                    src={`data:${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${employee?.fileAndObjectTypeBean.fileAndContentTypeBean.file}`}
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
                <h1 className="text-sm text-blue-700 font-semibold">
                  {employee?.fileAndObjectTypeBean?.empResDTO?.firstName}
                </h1>
                <h1 className="text-xs -mt-1 text-gray-600">
                  {
                    employee?.fileAndObjectTypeBean?.empResDTO?.designationResDTO
                      .designationName
                  }
                </h1>
                <h1 className="text-gray-800 text-xs">
                  {employee?.fileAndObjectTypeBean?.empResDTO?.empCode}
                </h1>
              </div>
              {/* <div className='col-span-1 w-60'>
                <h1 className='mx-4 text-gray-600 font-semibold'>Exit Info</h1>
                <div className='flex'>
                    <div className='text-sm p-2 w-32'>
                        <h1 className='mt-2'>Joining Date</h1>
                        <h1 className='my-3'>Date of Exit</h1>
                        <h1 className='my-3'>Last Working Date</h1>
                        <h1 className=''>Expected Last <br/> Working Date</h1>
                    </div>
                    <div className='text-sm text-[#00007D] p-2'>
                        <h1 className='mt-2'>{formatDate(employee?.dateOfJoining)}</h1>
                        <h1 className='my-3'>{formatDate(employee?.dateOfResignation)}</h1>
                        <h1 className='my-3'>{formatDate(employee?.lastWorkingDay) || "NA"}</h1>
                        <h1>{formatDate(employee?.expectedLastWorkingDay) || "NA"}</h1>
                    </div>
                </div>
            </div> */}
              <div className="col-span-1 lg:-ml-2 lg:w-52 md:w-full w-full">
                <h1 className="mx-4 text-gray-600 font-semibold">Exit Info</h1>
                <div className="">
                  <div className="grid grid-cols-2  text-xs text-gray-700 p-2">
                    <h1 className="mt-2">Joining Date</h1>
                    <h1 className="mt-2 text-[#00007D]">
                      {formatDate(
                        employee?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining
                      ) || "-"}
                    </h1>
                  </div>
                  <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                    <h1 className="">Resignation Date</h1>
                    <h1 className=" text-[#00007D]">
                      {formatDate(employee?.dateOfResignation) || "-"}
                    </h1>
                  </div>

                  <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                    <h1>
                      Last Working <br></br>requested Date
                    </h1>
                    <h1 className="text-[#00007D]">
                      {formatDate(employee?.lastWorkingDayRequest) || "-"}
                    </h1>
                  </div>

                  <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                    <h1>{getLabel(employee)}</h1>
                     <h1 className="text-[#00007D]">
                    {
                      employee?.expectedLastWorkingDay
                        ? formatDate(employee.expectedLastWorkingDay)
                        : formatDate(employee?.lastWorkingDay) || "-"
                    }
                    </h1>

                    {/* {(() => {
                      const dateStr = employee?.expectedLastWorkingDay
                        ? employee?.expectedLastWorkingDay || employee?.lastWorkingDay
                        : employee?.lastWorkingDay;

                      if (!dateStr) return "-";

                      const d = new Date(dateStr);
                      if (isNaN(d.getTime())) return "-";

                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                      const year = d.getFullYear();

                      return `${day}/${month}/${year}`;
                    })()} */}



                  </div>

                </div>
              </div>
              <div className="col-span-1 lg:w-[178px] md:w-full w-full lg:ml-4">
                <h1 className="text-gray-600 font-semibold mx-4">
                  Exit Reason
                </h1>
                <h1 className="text-gray-800 font-semibold text-sm mt-3  mx-6">
                  {employee?.reason || "-"}
                </h1>
                <h1 className="text-gray-600 text-xs ml-6">
                  {employee?.remarks || "-"}
                </h1>
              </div>
              <div className="col-span-1 lg:ml-6 md:ml-0 ml-0 lg:w-40 w-full md:w-full">
                <h1 className="text-gray-600 font-semibold lg:text-center md:text-center text-left lg:mx-1 md:mx-1 mx-4">
                  R1 Approval Status
                </h1>
                <h1
                  className={`text-gray-900 p-1 px-5 font-semibold mt-5 text-sm lg:mx-6 md:mx-12 mx-6 mr-6 inline-block rounded-md ${employee?.r1Status === "Approved"
                    ? "bg-[#A8ED87]"
                    : "bg-[#DDDBDB]"
                    }`}
                >
                  {employee?.r1Status}
                </h1>
              </div>
              <div className="col-span-1 lg:ml-8 md:ml-0 ml-0 lg:w-40 md:w-full w-full">
                <h1 className="text-gray-600 font-semibold lg:text-center md:text-center text-left lg:mx-1 md:mx-1 mx-4">
                  HR Approval Status
                </h1>
                <h1
                  className={`text-gray-900 p-1 lg:mx-2 md:mx-12 mx-6 font-semibold text-sm mt-5 px-8 inline-block rounded-md ${employee?.overAllStatus === "Approved"
                    ? "bg-[#A8ED87]"
                    : "bg-[#C1BDBD]"
                    }`}
                >
                  {employee?.hrStatus}
                </h1>
              </div>
              <div className="col-span-1 ml-7 lg:mt-8 md:mt-0 mt-0 lg:w-40 w-full md:w-full">

                <button
                  className="border border-blue-400 py-[1px] lg:mt-8 md:mt-0 mt-0 px-8 rounded-md  text-blue-400 font-semibold inline-block "
                  onClick={() => handleAccept(employee)}
                >
                  Proceed
                </button>

                <div className="text-red-500 font-semibold text-left mt-10">
                  <button
                    className="border border-red-500 py-[1px] lg:mt-8 md:mt-0 mt-0 px-8 rounded-md"
                    onClick={() => handleAccept(employee)}
                  >
                    Retain
                  </button>


                </div>


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
                                {/* <div>
                                  <h1 className="text-gray-500">Empo</h1>
                                  <h1 className="text-[#00007D] break-words">
                                    {selectedEmployee?.empo || "-"}
                                  </h1>
                                </div> */}
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

                              {/* <div className='grid grid-cols-2'>
                                                                    <div className='col-span-1 flex gap-2 mx-10'>
                                                                        <h1 className='font-semibold text-xl text-gray-700'>Status :</h1>
                                                                        <h1 className='font-semibold text-xl text-red-500'>{selectedEmployee?.overAllStatus === "Pending With HR" ? "Pending" : ""}</h1>
                                                                    </div>
                                                                    <div className='col-span-1'>
                                                                        <h1 className='font-semibold mx-10 text-xl text-gray-700'>Time line</h1>
                                                                        <div className='mt-12 border-l border-gray-400 p-2'>
                                                                            <h1 className='font-semibold text-lg text-red-500 pt-64'>{selectedEmployee?.r1Status}</h1>
                                                                            <h1 className='text-base text-gray-500'>With <span className='text-gray-800 text-lg font-semibold'>Manager</span></h1>
                                                                            <h1 className='text-gray-800 text-lg font-semibold mt-10'>{selectedEmployee?.empName} Submitted</h1>
                                                                            <h1 className='text-gray-500'>29,June,2024 05:30 PM</h1>
                                                                        </div>
                                                                    </div>
                                                                </div> */}
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
                                <h1 className="mt-4 text-sm">
                                  {getLabel(selectedEmployee)}
                                </h1>
                                <h1 className="border text-sm border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">

                                  {
                                    selectedEmployee?.expectedLastWorkingDay
                                      ? formatDate(selectedEmployee.expectedLastWorkingDay)
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
                                  className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
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
                                <button onClick={() => handleStayInterview(employee)}
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
                                {/* <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-10">
                                  {(selectedEmployee?.noticePeriodWaiver || selectedEmployee?.noticePeriodWaiverByHr)
                      ? (selectedEmployee?.expectedLastWorkingDay) || "-"
                      : (selectedEmployee?.lastWorkingDay) || "-"
                    }
                                </h1> */}
                                <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-10">
                                  {(() => {
                                    const dateStr = selectedEmployee?.expectedLastWorkingDay
                                      ? selectedEmployee?.expectedLastWorkingDay
                                      : selectedEmployee?.lastWorkingDay;

                                    if (!dateStr) return "-";

                                    const d = new Date(dateStr);
                                    if (isNaN(d.getTime())) return "-";

                                    const day = String(d.getDate()).padStart(2, "0");
                                    const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                                    const year = d.getFullYear();

                                    return `${day}/${month}/${year}`;
                                  })()}
                                </h1>

                                <h1 className="whitespace-nowrap">
                                  Remarks to Reviewer
                                </h1>
                                <p className="border border-gray-300 lg:w-52 md:w-60 w-36 p-1">
                                  {selectedEmployee?.managerRemarksToReviewer || "-"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* +++++++++++++++++++++++++ */}

                          <div className="mx-3 mt-3 shadow-bottom pb-6">
                            <div>
                              <h1 className="font-semibold text-sm mx-5 mt-4 pt-3 text-gray-700">
                                To be filled by HR
                              </h1>
                            </div>

                            {/* Grid layout for checkbox and remarks */}
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 text-sm px-5 mt-2 items-center font-normal lg:space-y-4 md:space-y-2 space-y-1">





                              <h1 className="whitespace-nowrap mt-4">
                                FNF Enable for BU
                              </h1>

                              {/* FNF Checkbox */}
                              <div className="flex items-center mt-4">
                                <input
                                  type="checkbox"
                                  id="hrConfirmed"
                                  checked={hrApprovalDetails.fnfEnableForBu}
                                  onChange={handleCheckboxChange}
                                  className="w-4 h-4"
                                />
                              </div>
                              {/* FNF Label */}
                              <h1 className="whitespace-nowrap mt-4">
                                FNF Enable for Sales
                              </h1>

                              {/* FNF Checkbox */}
                              <div className="flex items-center mt-4">
                                <input
                                  type="checkbox"
                                  id="hrConfirmed"
                                  checked={hrApprovalDetails.fnfEnableForSales}
                                  onChange={handleCheckboxChangeForSales}
                                  className="w-4 h-4"
                                />
                              </div>
                              {/* <h1 className="waiver whitespace-nowrap mt-4 text-xs">
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
                                  setHrApprovalDetails({
                                    ...hrApprovalDetails,
                                    noticePeriodWaiverByHr: isYes,
                                  });
                                }}
                                value={
                                  isRetainSelected
                                    ? noticePeriodWaiverByHr
                                    : hrApprovalDetails.noticePeriodWaiverByHr
                                      ? "Yes"
                                      : "No"
                                }
                                disabled={isRetainSelected} // Disable when Retain is selected
                              />

                              <h1 className="mt-0 text-xs">
                                Final Last working Date
                              </h1>
                              <form action="/action_page.php">
                                <input
                                  type="date"
                                  className="border text-xs border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-2"
                                  value={
                                    !hrApprovalDetails.noticePeriodWaiverByHr
                                      ? selectedEmployee?.lastWorkingDay
                                      : hrApprovalDetails.expectedLastWorkingDay
                                  }
                                  onChange={handleExpectedLastWorkingDay}
                                  disabled={!hrApprovalDetails.noticePeriodWaiverByHr} // enabled only if noticePeriodWaiver is true
                                />


                              </form> */}
                              <h1 className="waiver whitespace-nowrap mt-4 text-xs">
                                Notice Period Waiver{" "}
                                <span className="text-lg text-red-500">*</span>
                              </h1>

                              <Dropdown
                                className="border border-gray-300 lg:w-44 text-xs md:w-40 w-32 px-2 p-1"
                                placeholder={"Select"}
                                options={dropdownOptions}
                                onChange={(selectedOption) => {
                                  const isYes = selectedOption?.value === "Yes";
                                  setHrApprovalDetails({
                                    ...hrApprovalDetails,
                                    noticePeriodWaiverByHr: isYes,
                                  });
                                }}
                                value={hrApprovalDetails.noticePeriodWaiverByHr ? "Yes" : "No"}
                              />

                              <h1 className="mt-0 ">Final Last Working Date</h1>

                              <input
                                type="date"
                                className="border text-xs border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-2"
                                value={
                                  // hrApprovalDetails?.expectedLastWorkingDay ||
                                  // hrApprovalDetails?.lastWorkingDay
                                  hrApprovalDetails?.expectedLastWorkingDay
                                    ? hrApprovalDetails?.expectedLastWorkingDay
                                    : hrApprovalDetails?.lastWorkingDay
                                }
                                onChange={handleExpectedLastWorkingDay}
                              />

                              {/* Remarks Label */}
                              <h1 className="lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal mt-4">
                                Remarks to Reviewer
                                <span className="text-sm text-red-500">*</span>
                              </h1>

                              {/* Remarks Textarea */}
                              <textarea
                                rows={1}
                                className="outline-none rounded-none border border-gray-400 text-sm text-gray-700 w-full p-2 mt-4"
                                placeholder="Enter your remarks here"
                                onChange={handleReview}
                              />
                            </div>
                          </div>



                          {/* +++++++++++++++++++++++++ */}

                          {/* <div className="mx-3 mt-3 shadow-bottom pb-6">
  <div>
    <h1 className="font-semibold text-sm mx-5 mt-4 pt-3 text-gray-700">
      To be filled by HR
    </h1>
  </div> */}

                          {/* Aligned Checkbox Row */}
                          {/* <div className="flex items-center gap-4 px-5 mt-4 text-sm text-gray-700">
    <label htmlFor="hrConfirmed" className="whitespace-nowrap">
      FNF Enable for BU
    </label>
    <input
      type="checkbox"
      id="hrConfirmed"
      checked={isConfirmed}
      onChange={(e) => setIsConfirmed(e.target.checked)}
      className="w-4 h-4"
    />
  </div> */}

                          {/* Remarks */}
                          {/* <div className="flex items-center gap-12 text-sm mt-4">
    <h1 className="lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal text-gray-500 p-5 font-normal">
      Remarks to Reviewer
      <span className="text-sm text-red-500">*</span>
    </h1>
    <textarea
      rows={1}
      className="outline-none rounded-none border border-gray-400 text-sm text-gray-700 w-1/2 p-2 my-6"
      placeholder="Enter your remarks here"
      onChange={handleReview}
    />
  </div>
</div> */}

                          {/* <div className="mx-3 mt-3 shadow-bottom">
                            <div>
                              <h1 className="font-semibold mx-5 mt-4 pt-3 text-gray-700">
                                To be filled by HR
                              </h1>
                            </div>
                            <div className="flex items-center gap-12">
                              <h1 className="whitespace-nowrap text-gray-500 text-base p-5 font-normal ">
                                Remarks to Reviewer{" "}
                                <span className="text-lg text-red-500">*</span>
                              </h1>
                              <textarea
                                rows={1}
                                className="outline-none rounded-none border border-gray-400 text-gray-700 w-1/2 p-2 my-6"
                                placeholder="Enter your remarks here"
                                onChange={handleReview}
                              />
                            </div>
                          </div> */}
                          <div className="flex justify-center">
                            <div className="flex flex-row gap-2 mt-4 flex-wrap">
                              {selectedEmployee?.r1Status === "Absconded by Manager" && (
                                <>
                                  {/* Prohibition Mail Button */}
                                  <button
                                    className={`border border-yellow-500 py-1 px-3 text-sm rounded font-medium ${mailSent
                                      ? 'bg-yellow-100 text-yellow-500 cursor-not-allowed'
                                      : 'text-yellow-500'
                                      }`}
                                    onClick={() => handleSendEmail(employee)}
                                    disabled={mailSent}
                                  >
                                    {mailSent ? 'Abscond Mail Sent' : 'Send Abscond Mail'}
                                  </button>

                                  {/* Terminate Button */}
                                  <button
                                    className={`border border-green-500 py-1 px-3 text-sm rounded font-medium ${terminationMailSent
                                      ? 'bg-yellow-100 text-green-500 cursor-not-allowed'
                                      : 'text-green-500'
                                      }`}
                                    onClick={() => handleTerminate(employee)}
                                    disabled={terminationMailSent}
                                  >
                                    {terminationMailSent ? 'Termination Mail Sent' : 'Send Termination'}
                                  </button>
                                </>
                              )}

                              {/* Always show Retain */}
                              <button
                                className="bg-[#2970c7] hover:bg-[#1B5CAD] text-white py-1 px-3 text-sm rounded font-medium"
                                onClick={handleRetain}
                              >
                                Retain
                              </button>

                              {/* Show Accept & Forward only if not absconded */}
                              {selectedEmployee?.r1Status !== "Absconded by Manager" && (
                                <button
                                  className="bg-[#39f542] hover:bg-[#1FD127] text-white py-1 px-3 text-sm rounded font-medium"
                                  onClick={handleApproval}
                                >
                                  Accept & Forward
                                </button>
                              )}
                            </div>
                          </div>



                          {/* <button
                              className="bg-[#686B6F] hover:bg-gray-600 text-white py-2 px-6"
                              onClick={handleClose}
                            >
                              Generate Defaulter E-mail
                            </button> */}
                          {/* <div className="text-center space-x-4 mt-5 mb-10">
                            


                                             {selectedEmployee?.r1Status === "Absconded by Manager" && (
 
  <div className="flex flex-col gap-2 mt-4"> */}
                          {/* Prohibition Mail Button */}
                          {/* <button
      className={`border border-yellow-500 py-[1px] px-8 rounded-md font-semibold ${
        mailSent
          ? 'bg-yellow-100 text-yellow-500 cursor-not-allowed'
          : 'text-yellow-500'
      }`}
      onClick={() => handleSendEmail(employee)}
      disabled={mailSent}
    >
      {mailSent ? 'Abscond Prohibition Mail Sent' : 'Send Abscond Prohibition Mail'}
    </button> */}

                          {/* Terminate Button (below) */}
                          {/* <button
      className={`hover:bg-[#1FD127] bg-[#39f542] text-white py-2 px-6 ${
        terminationMailSent
          ? 'bg-yellow-100 text-green-500 cursor-not-allowed'
          : 'text-green-500'
      }`}
       onClick={() => handleTerminate(employee)}
    >
      {terminationMailSent ? 'Termination Mail Sent' : 'Send Termination Mail'}
    </button>
  </div>
  )}
                            <button
                              className="hover:bg-[#1B5CAD] bg-[#2970c7] text-white py-2 px-6"
                              onClick={handleRetain}
                            >
                              Retain
                            </button>
                            <button
                              className="hover:bg-[#1FD127] bg-[#39f542] text-white py-2 px-6"
                              onClick={handleApproval}
                            >
                              Accept & Forward
                            </button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

    </div>
  );
}
export default HrPendingForms;
