import { useEffect, useState } from "react";
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
import { BASE_URL } from '../../../config/Config';
function InitiateExitInterview() {
    const [empDetails, setEmpDetails] = useState([]);
    const [imageUrl, setImageUrl] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedEmployee, setselectedEmployee] = useState(null);
    const locationOptions = [
        "Bengaluru",
        "Delhi",
        "Mumbai",
        "Rajasthan",
        "Kerala",
    ];
    const [searchTerm, setSearchTerm] = useState("");
    const deptOptions = ["SSD", "Finance", "Technical", "HR", "Service"];
    const [selectedLocation, setSelectedLocation] = useState("All Location");
    const [selectedDept, setSelectedDept] = useState("All Dept");
    //const empCode = sessionStorage.getItem("UserId");
    const empCode = localStorage.getItem("empId");
    const overAllStatus = "Pending With Interview";
    const workFlowName = sessionStorage.getItem("workflowName");
    const [mailSent, setMailSent] = useState(false);
    const [terminationMailSent, setTerminationMailSent] = useState(false);
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
                        console.log("Merged Data:", mergedData);
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

        const docViewerUrl = `/doc-viewerClaim/${docId}`;
        window.open(docViewerUrl, "_blank");
    };

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



    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


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



    const [hrApprovalDetails, setHrApprovalDetails] = useState({
        hrRemarksToReviewer: " ",
    });



    const handleInitiate = (employee) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Initiate Interview ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Proceed",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .put(
                        `${BASE_URL}:9029/api/eSeparation/initiateExitInterview/${employee?.id}`
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
                                            {employee?.expectedLastWorkingDay
                                                ? formatDate(employee?.expectedLastWorkingDay) || "-"
                                                : formatDate(employee?.lastWorkingDay) || "-"
                                            }
                                        </h1>
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
                                    onClick={() => handleInitiate(employee)}
                                >
                                    Initiate Exit Interview
                                </button>


                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
export default InitiateExitInterview;
