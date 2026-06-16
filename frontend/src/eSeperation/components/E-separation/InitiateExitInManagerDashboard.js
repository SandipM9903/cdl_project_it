import { useEffect, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./MainExit.css";
import HrPendingForms from "./HrPendingForms";
import axios from "axios";
import ExitProcess from "./ExitProcess";
import ExitedEmployees from "./ExitedEmployees";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import { BASE_URL } from "../../../config/Config";


function InitiateExitInManagerDashboard() {
  const locationOptions = [
    "Bengaluru",
    "Delhi",
    "Mumbai",
    "Rajasthan",
    "Kerala",
  ];
  const deptOptions = ["ssd", "Finance", "Technical", "HR", "Service"];

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [resignDetails, setResignDetails] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [empDetails, setEmpDetails] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState("mainexit");
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [resignReason, setResignReason] = useState([]);
  // const exitReasonDropdown = resignReason.map(reason => reason.reason);
  // const exitReasonDropdown = [
  //   "Looking for better opportunity",
  //   "Career Advancement",
  //   "Look more more Salary",
  //   "Personal Growth",
  // ];
  const [exitReasonDropdown, setExitReasonDropdown] = useState([]);
  const [exitTypeDropdown, setExitTypeDropdown] = useState([]);
  // const empCode = sessionStorage.getItem("UserId");
  const workFlowName = sessionStorage.getItem("workflowName");

  // const empCode=9085389;

  const navigate = useNavigate();

  function handlePrevious() {
    navigate(-1);
  }
  const empCode = localStorage.getItem("empId");

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${BASE_URL}:9020/employee/team/${empCode}`)
        .then((response) => {
          setEmpDetails(response.data);
          console.log(response.data, "+++++++++++++manager under employees");
          response.data.forEach((employee) => {
            // getImage(employee.empCode);
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      };

    axios
      .get(`${BASE_URL}:9029/api/eSeparation/getAllDropdown`)
      .then((res) => {
        setResignReason(res.data);
      })
      .catch((error) => {
        console.log("Error in fetching Data", error);
      });

    fetchData();

  }, []);


  const handleInputChange = (event) => {
    let inputValue = event.target.value;
    if (inputValue.trim() === "") {
      inputValue = inputValue.trimStart(); // Trim only the initial space
    }
    setEmployeeSearch(inputValue); // Set input value, trimming initial space if present
    setSelectedEmployee(null); // Reset selected employee when input changes
  };

  const fetchResignData = () => {
    axios
      .get(`${BASE_URL}:9029/api/eSeparation/getResignDataByMngrEmpId/${empCode}`)
      .then((response) => {
        setResignDetails(response.data);
        console.log(response.data, "response.dataresponse.data");
      })
      .catch((error) => {
        console.error("Error fetching resignation data:", error);
      });
  };

  const handleEmployeeClick = (employee) => {
    fetchResignData();
    setSelectedEmployee(employee);
    setEmployeeSearch(employee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar);
  };

  const handleClearSelectedEmployee = () => {
    setButtonsVisible(true);
    setMessage("");
    setSelectedEmployee(null);
    setEmployeeSearch("");
    setValidationErrors("");
    setResignData((prevState) => ({
      ...prevState,
      empCode: "",
      dateOfResignation: "",
      lastWorkingDay: "",
      lastWorkingDayRequest: null,
      exitType: "",
      reason: "",
      remarks: "",
    }));
  };

  const handleDepartmentChange = (option) => {
    setSelectedDepartment(option.value);
    setSelectedEmployee(null);
  };

  const handleLocationChange = (option) => {
    setSelectedLocation(option.value);
    setSelectedEmployee(null);
  };

  const filteredEmployees = empDetails.filter((emp) => {
    const locationMatches =
      !selectedLocation || emp.location === selectedLocation;
    const departmentMatches =
      !selectedDepartment || emp.department === selectedDepartment;
    const searchMatches =
      employeeSearch &&
      (emp?.fileAndObjectTypeBean?.empResDTO?.empCode?.toString() ===
        employeeSearch ||
        emp?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar
          .toLowerCase()
          .includes(employeeSearch.toLowerCase()));
    return locationMatches && departmentMatches && searchMatches;
  });

  const [resignData, setResignData] = useState({
    empCode: "",
    dateOfResignation: "",
    lastWorkingDay: "",
    lastWorkingDayRequest: null,
    exitType: "",
    reason: "",
    remarks: "",
  });



  const handleDateOfResign = (e) => {
    const dateOfResignation = e.target.value;

    // Calculate the last working day by adding 90 days to the date of resignation
    const lastWorkingDay = new Date(dateOfResignation);
    lastWorkingDay.setDate(lastWorkingDay.getDate() + 90);
    const formattedLastWorkingDay = lastWorkingDay.toISOString().split("T")[0];

    setResignData({
      ...resignData,
      dateOfResignation,
      // lastWorkingDay: formattedLastWorkingDay,
      // lastWorkingDay
    });
  };
const handleRequestlastWorkingDay = (e) => {
        setResignData({
            ...resignData,
            lastWorkingDay: e.target.value
        });
    };
  // const handlelastWorkingDay = (e) => {
  //     setResignData({
  //         ...resignData,
  //         lastWorkingDay: e.target.value
  //     })
  // }

  const handleType = (selectedOptions) => {
    setResignData({
      ...resignData,
      exitType: selectedOptions.value,
    });
  };
  const handleReason = (selectedOptions) => {
    setResignData({
      ...resignData,
      reason: selectedOptions.value,
    });
  };

  const handleRemarks = (e) => {
    setResignData({
      ...resignData,
      remarks: e.target.value,
    });
  };

  const [message, setMessage] = useState("");
  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }
    const formData = {
      ...resignData,
      empCode: selectedEmployee.empCode,
    };
    console.log(formData, "formDataformData");

    axios
      .post(
        `${BASE_URL}:9029/api/eSeparation/initiateExitByManager/${selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.empCode}/${workFlowName}`,
        formData
      )
      .then((res) => {
        console.log("res", res.data);
        axios.get(`${BASE_URL}:9029/api/eSeparation/getmess`).then((response) => {
          console.log(response.data);
          setMessage(response.data);
          setButtonsVisible(false);
        });
      })
      .catch((error) => {
        console.log("Error to Post the Data", error);
      });
  };

  const [validationErrors, setValidationErrors] = useState({
    dateOfResignation: "",
    exitType: "",
    reason: "",
    lastWorkingDay: "",
  });

  const validateFields = () => {
    let isValid = true;
    const errors = {};

    if (!resignData.dateOfResignation) {
      errors.dateOfResignation = "Date of Resignation is required";
      isValid = false;
    } else {
      errors.dateOfResignation = "";
    }
    if (!resignData.exitType) {
      errors.exitType = "Exit Type is required";
      isValid = false;
    } else {
      errors.exitType = "";
    }
    if (!resignData.lastWorkingDay) {
      errors.lastWorkingDay = "Last Working Day is required";
      isValid = false;
    } else {
      errors.lastWorkingDay = "";
    }


    if (!resignData.reason) {
      errors.reason = "Reason is required";
      isValid = false;
    } else {
      errors.reason = "";
    }

    setValidationErrors(errors);
    return isValid;
  };
  useEffect(() => {
    axios.get(`${BASE_URL}:9029/api/eSeparation/exitReasonsinHrDashBoard`)
      .then(response => {
        setExitReasonDropdown(response.data);
      })
      .catch(error => {
        console.error("Error fetching exit reasons:", error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}:9029/api/eSeparation/exitTypeForHR`)
      .then(response => {
        setExitTypeDropdown(response.data);
      })
      .catch(error => {
        console.error("Error fetching exit reasons:", error);
      });
  }, []);

  useEffect(() => {
    setButtonsVisible(true);
    setMessage("");
    setSelectedEmployee(null);
    setEmployeeSearch("");
  }, [activeTab]);
  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem("role")) || [];
  } catch (e) {
    console.error("Error parsing roles from sessionStorage:", e);
  }

  // Function to check if the user has a specific role
  const hasRole = (role) => roles.includes(role);
  return (
    <div className="">
<Header/>
      {/* Employee-specific navigation */}
      <div className=" mt-20 bg-white-300">
        <div className="flex lg:flex-row md:flex-row flex-col border-b border-gray-300">
          <div className="flex items-center text-gray-800 gap-5 lg:p-4 md:p-4 p-2">
            <button className="text-blue-500  text-xs" onClick={handlePrevious}>
              <FaArrowLeftLong />
            </button>
            <h1 className="text-xs font-bold ">Exit</h1>
          </div>
          <div className="mx-auto text-xs p-4 lg:mt-5 md:mt-5 mt-0 ">
            <ul className="flex lg:-ml-36 md:-ml-20 ml-0 lg:space-x-6 md:space-x-2 space-x-0 ">
              <li className="me-2">
                <button
                  href="/mainexit"
                  type="button"
                  onClick={() => setActiveTab("mainexit")}
                  className={` inline-block p-2 border-b-2 font-bold ${activeTab === "mainexit"
                      ? "lg:border-blue-600 md:border-blue-600 border-transparent text-blue-600"
                      : "border-transparent hover:text-gray-900"
                    }`}
                >
                  Initiate Exit
                </button>
              </li>
           { /*  <li className="me-2">
                <button
                  href="/pending"
                  type="button"
                  onClick={() => setActiveTab("pending")}
                  className={`inline-block p-2 border-b-2 font-bold ${activeTab === "pending"
                      ? "lg:border-blue-600 md:border-blue-600 border-transparent text-blue-600"
                      : "border-transparent hover:text-gray-900"
                    }`}
                >
                  My Pending Requests
                </button>
              </li>
              <li className="me-2">
                <button
                  href="/exitProcess"
                  type="button"
                  onClick={() => setActiveTab("exitProcess")}
                  className={`inline-block p-2 border-b-2 font-bold ${activeTab === "exitProcess"
                      ? "lg:border-blue-600 md:border-blue-600 border-transparent text-blue-600"
                      : "border-transparent hover:text-gray-900"
                    }`}
                >
                  In Exit Process
                </button>
              </li>
              <li className="me-2">
                <button
                  href="/exitEmployees"
                  type="button"
                  onClick={() => setActiveTab("exitEmployees")}
                  className={`inline-block p-2 border-b-2 font-bold ${activeTab === "exitEmployees"
                      ? "lg:border-blue-600 md:border-blue-600 border-transparent text-blue-600"
                      : "border-transparent hover:text-gray-900"
                    }`}
                >
                  Exited Employees
                </button>
              </li> */}
            </ul>
          </div>
        </div>
        {activeTab === "mainexit" && (
          <div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1">
              <div className="col-span-1 lg:w-full md:w-full w-full">
                <div className="flex items-center  justify-between">
                  <h1 className="font-semibold text-gray-800 lg:ml-12 md:ml-12 ml-6 text-sm mt-6">
                    Initiate Exit
                  </h1>
                  {message && (
                    <h1 className=" flex gap-2 items-center text-green-500 -mr-28">
                      <FaCheckCircle />
                      Successfully initiated E-Exit to{" "}
                      {
                        selectedEmployee?.fileAndObjectTypeBean?.empResDTO
                          ?.fullNameAsAadhaar
                      }
                    </h1>
                  )}
                </div>
                <h1 className="text-gray-500 lg:ml-16 md:ml-12 ml-8 text-xs mt-3 font-semibold">
                  Search for an employee here to initiate the Exit
                </h1>
                <div className="flex lg:flex-row md:flex-col flex-col mt-8 items-center font-semibold gap-4">
                  <div className="MainExitDropdown flex items-center lg:ml-14 md:ml-0 ml-0 gap-4 text-xs">
                    <h1 className="text-gray-500">Location:</h1>
                    <Dropdown
                      className="w-36 border-b border-gray-300"
                      options={locationOptions}
                      onChange={handleLocationChange}
                      value={selectedLocation}
                      placeholder={"All Location"}
                    />
                  </div>
                  <div className="MainExitDropdown flex items-center gap-4 text-xs">
                    <h1 className="text-gray-500">Departments:</h1>
                    <Dropdown
                      className="w-32 border-b border-gray-300"
                      options={deptOptions}
                      onChange={handleDepartmentChange}
                      value={selectedDepartment}
                      placeholder={"All Dept"}
                    />
                  </div>
                </div>
                <h1 className="text-gray-500 lg:ml-16 md:ml-12 ml-8 text-xs font-semibold lg:mt-6 md:mt-6 mt-2">
                  Search Employee
                </h1>
                <div className="flex items-center mt-4 lg:ml-20 md:ml-12 ml-6 gap-4">
                  <img
                    src="image.png"
                    alt="Search Icon"
                    className="lg:h-[10vh] lg:w-[10vh] md:h-[10vh] md:w-[10vh] h-[7vh] w-[7vh] rounded-[9999px]"
                  />
                  <input
                    type="text"
                    id="default-search"
                    value={employeeSearch}
                    onChange={handleInputChange}
                    className="block lg:w-[420px] md:w-[320px] w-[220px] p-1 lg:h-[48px] md:h-[48px] h-[40px] text-xs text-center text-black border border-gray-400 rounded-[22px] outline-none bg-white"
                    placeholder="Search by Emp Code / Name"
                  />
                  {selectedEmployee && (
                    <FaTimes
                      className="lg:ml-[-4rem] md:ml-[-3rem] ml-[-3rem] text-red-500"
                      onClick={handleClearSelectedEmployee}
                    />
                  )}
                </div>
                {selectedEmployee
                  ? null
                  : employeeSearch && (
                    <ul>
                      <div
                        className={`border-gray-100 shadow-bottom lg:w-[360px] md:w-[300px] w-[200px] lg:ml-44 md:ml-36 ml-24 h-${filteredEmployees.length > 2 ? "40" : "auto"
                          } overflow-y-auto`}
                      >
                        {filteredEmployees.map((employee) => (
                          <li
                            key={
                              employee?.fileAndObjectTypeBean?.empResDTO?.empCode
                            }
                          >
                            <button
                              onClick={() => handleEmployeeClick(employee)}
                            >
                              <div className="flex items-center">
                                <div>
                                  <img
                                    src="profile.webp"
                                    alt="profile"
                                    className="lg:h-[7vh] lg:w-[7vh] h-[5vh] w-[5vh]  rounded-[9999px] my-2 mx-3"
                                  />
                                </div>
                                <div className="lg:ml-5 ml-1 lg:w-[265px] w-[160px] text-left">
                                  <h1 className="text-xs text-gray-900">
                                    {
                                      employee.fileAndObjectTypeBean.empResDTO
                                        .fullNameAsAadhaar 
                                    }{" "}
                                    -{" "}
                                    {
                                      employee.fileAndObjectTypeBean.empResDTO
                                        .empCode
                                    }
                                  </h1>
                                  <h1 className="text-xs text-gray-500">
                                    {
                                      employee.fileAndObjectTypeBean.empResDTO
                                        .department
                                    }
                                  </h1>
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                      </div>
                    </ul>
                  )}
              </div>
              <div className="col-span-1 px-10 py-10 lg:mt-12 md:mt-12 mt-2 lg:ml-8">
                <img
                  src="mainExit.jpg"
                  alt="ResignImg"
                  className="w-full lg:h-[35vh] md:h-auto h-[20vh]"
                />
              </div>
            </div>
            {selectedEmployee &&
              (resignDetails.filter(
                (resign) =>
                  resign.empCode ===
                  selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.empCode &&
                  resign.overAllStatus !== "Closed" &&
                  resign.overAllStatus !== "Withdrawn"
              ).length > 0 ? (
                <div className="lg:ml-16 ml-2 mt-4 p-4 bg-yellow-100 border-l-4 text-sm border-yellow-400 text-yellow-600">
                  {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar}{" "}
                  has already initiated for exit process.
                </div>
              ) : (
                <div className="container sm:w-full w-[85%] mx-auto mt-2 border border-gray-400 shadow-bottom">
                  <div className="border-b border-gray-400">
                    <h1 className="text-gray-700 font-bold text-xs py-5 ml-5">
                      Employee Exit Details
                    </h1>
                  </div>
                  
                  <div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="col-span-1 order-last lg:order-first md:order-last">
                        <div>
                          <div className="mt-4 mx-5 grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 items-center justify-between">
                            <h1 className="text-gray-500 font-medium">
                              Exit Type{" "}
                              <span className="text-red-600"> *</span>
                            </h1>
                            <Dropdown
                              placeholder={"Select"}
                              className="mr-[105px] lg:w-[256px] md:w-[256px] w-[140px]"
                              options={exitTypeDropdown}
                              onChange={handleType}
                              disabled={!buttonsVisible}
                            />
                          </div>
                          <div>
                            <h3 className="text-xs text-red-600 lg:ml-[240px] md:ml-[270px] sm:ml-[330px] ml-[180px] mt-1">
                              {validationErrors.exitType && (
                                <span>{validationErrors.exitType}</span>
                              )}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <div className="mt-4 mx-5 grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 items-center justify-between">
                            <h1 className="text-gray-500 font-medium">
                              Reason for Exit{" "}
                              <span className="text-red-600"> *</span>
                            </h1>
                            <Dropdown
                              placeholder={"Select"}
                              className="mr-[105px] lg:w-[256px] md:w-[256px] w-[140px]"
                              options={exitReasonDropdown}
                              onChange={handleReason}
                              disabled={!buttonsVisible}
                            />
                          </div>
                          <div>
                            <h3 className="text-xs text-red-600 lg:ml-[240px] md:ml-[270px] sm:ml-[330px] ml-[180px] mt-1">
                              {validationErrors.reason && (
                                <span>{validationErrors.reason}</span>
                              )}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 mt-12 mx-5 items-center justify-between">
                            <h1 className="text-gray-500 text-xs font-medium">
                              Date of Resignation{" "}
                              <span className="text-red-600"> *</span>
                            </h1>
                            <form action="/action_page.php">
                              <input
                                type="date"
                                className="lg:w-[200px] md:w-[200px] w-[130px] border border-gray-300 h-9 px-2 outline-none"
                                onChange={handleDateOfResign}
                                value={resignData.dateOfResignation}
                                disabled={!buttonsVisible}
                              />
                            </form>
                          </div>
                          <div className="">
                            <h3 className="text-xs text-red-600 lg:ml-[220px] md:ml-[270px] sm:ml-[330px] ml-[160px] mt-1">
                              {validationErrors.dateOfResignation && (
                                <span>
                                  {validationErrors.dateOfResignation}
                                </span>
                              )}
                            </h3>
                          </div>
                        </div>

                        <div className="mt-4 mx-5 grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 items-start justify-between">
                          <h1 className="text-gray-500 font-medium">
                            Additional Remarks
                          </h1>
                          <textarea
                            rows={4}
                            className=" lg:w-72 md:w-72 w-32outline-none rounded-none border border-gray-300"
                            onChange={handleRemarks}
                            disabled={!buttonsVisible}
                          />
                        </div>
                        {/* <div className="text-center mt-2">
                          <h1 className=" text-gray-500 font-medium text-xs">
                            Notice Period:{" "}
                            <span className="text-red-500 text-xs">
                              90 day(s)
                            </span>
                          </h1>
                        </div> */}
                        <div>
                          {/* <h1 className='text-gray-500 font-medium'>Last Working Date <span className='text-red-600'> *</span></h1>
                                                <form action="/action_page.php">
                                                    <input type="date" className='mr-40 w-[200px] border border-gray-300 h-9 px-2 outline-none' onChange={handlelastWorkingDay} min={new Date().toISOString().split("T")[0]} disabled={!buttonsVisible} />
                                                </form> */}
                          <div className="mt-4 mx-5 grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 items-center justify-between">
                            <h1 className="text-gray-500 font-medium">
                              Last Working Date{" "}
                              <span className="text-red-600"> *</span>
                            </h1>
                            {/* <input
                              type="text"
                              className="lg:w-[200px] md:w-[200px] w-[130px] border border-gray-300 h-9 px-2 outline-none bg-gray-100"
                              value={resignData.lastWorkingDay}
                              readOnly
                            /> */}
                              <form action="/action_page.php">
                              <input
                                type="date"
                                className="lg:w-[200px] md:w-[200px] w-[130px] border border-gray-300 h-9 px-2 outline-none"
                                onChange={handleRequestlastWorkingDay}
                                value={resignData?.lastWorkingDay}
                                disabled={!buttonsVisible}
                              />
                            </form>
                            {/* <form action="/action_page.php" className="flex flex-col md:flex-row gap-4">
                                                    <input type="date" className='border border-gray-300 h-7 px-2 outline-none text-xs w-full md:w-[180px] lg:w-[250px] mr-16' onChange={handleRequest}  />
                                                </form> */}
                          </div>
                          <div className="">
                            <h3 className="text-xs text-red-600 lg:ml-[220px] md:ml-[270px] sm:ml-[330px] ml-[160px] mt-1">
                              {validationErrors.lastWorkingDay && (
                                <span>
                                  {validationErrors.lastWorkingDay}
                                </span>
                              )}
                            </h3>
                          </div>
                        </div>
                        
                        
                        
                      </div>
                      <div className="col-span-1 lg:mx-12 mx-2 lg:my-12 my-2 border border-gray-400 shadow-bottom order-first lg:order-last md:order-first">
                        <div className="py-3 text-center">
                          <img
                            src="profile.webp"
                            alt="Profile"
                            className="lg:h-[13vh] lg:w-[13vh] h-[10vh] w-[10vh] rounded-[9999px] mx-auto"
                          />
                          <h1 className="text-xs text-blue-500 font-bold">
                            {selectedEmployee?.fileAndObjectTypeBean?.empResDTO
                              ?.fullNameAsAadhaar || "-"}
                          </h1>
                          <h1 className="text-xs text-gray-500">
                            {selectedEmployee?.fileAndObjectTypeBean?.empResDTO
                              ?.designation || "-"}
                          </h1>
                        </div>
                        <div className="grid grid-cols-1 text-xs px-4 lg:p-4 mb-10 break-words">
                          <div className="grid grid-cols-3 lg:mt-2 gap-3">
                            <div>
                              <h1 className="text-gray-500">Employee Id</h1>
                              <h1 className="text-[#00007D]">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.empCode || "-"}
                              </h1>
                            </div>
                            <div>
                              <h1>
                                Joining Date
                              </h1>
                              <h1 className="text-[#00007D]">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.dateOfJoining || "-"}
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
                          <div className="grid grid-cols-3 text-xs lg:mt-2 gap-3">
                            <div>
                              <h1 className="text-gray-500 lg:mt-8 md:mt-4 mt-2">
                                Department
                              </h1>
                              <h1 className="text-[#00007D]">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.mainDeptResDTO?.mainDepartment ||
                                  "-"}
                              </h1>
                            </div>
                            <div>
                              <h1 className="text-gray-500 lg:mt-8 md:mt-4 mt-2">
                                Reporting to
                              </h1>
                              <h1 className="text-[#00007D]">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.reportingManager || "-"}
                              </h1>
                            </div>
                            <div>
                              <h1 className="text-gray-500 lg:mt-8 md:mt-4 mt-2">
                                Emp Type
                              </h1>
                              <h1 className="text-[#00007D]">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.designationResDTO
                                  ?.designationName || "-"}
                              </h1>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 text-xs lg:mt-2 gap-3">
                            <div>
                              <h1 className="text-gray-500 lg:mt-8 md:mt-4 mt-2">
                                Location
                              </h1>
                              <h1 className="text-[#00007D]">
                                {selectedEmployee?.userDTO?.locationResDTO
                                  ?.locationName || "-"}
                              </h1>
                            </div>
                            <div>
                              <h1 className="text-gray-500 lg:mt-8 md:mt-4 mt-2">
                                Empo
                              </h1>
                              <h1 className="text-[#00007D]">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.empo || "-"}
                              </h1>
                            </div>
                            <div>
                              <h1 className="text-gray-500 lg:mt-8 md:mt-4 mt-2">
                                Project / Cost Centre
                              </h1>
                              <h1 className="text-[#00007D]">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.projectResDTO?.projectId || "-"}
                              </h1>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 text-xs lg:mt-2">
                           
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-x-10 lg:-mt-16 mt-3 mb-10 flex lg:ml-72 ml-6 md:ml-52">
                      {/* <button className='bg-gray-500 px-5 py-[5px]  text-xs text-white rounded-lg hover:bg-gray-700'>Cancel</button>
                                        <button className='bg-blue-500 px-5 py-[5px]  text-xs text-white rounded-lg flex items-center gap-5  hover:bg-blue-700' onClick={handleSubmit}>Intiate Exit <FaArrowRightLong /></button> */}
                      {buttonsVisible && (
                        <>
                          <button className="bg-gray-500 lg:px-5 md:px-3 md:py-[3px] lg:py-[5px] px-2 py-[2px]  text-sm text-white rounded-md hover:bg-gray-700">
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmit}
                            className="bg-blue-500 lg:py-[5px] md:px-3 md:py-[3px] px-2 py-[2px] text-sm text-white rounded-md flex items-center gap-5  hover:bg-blue-700"
                          >
                            <h1>Initiate Exit</h1>
                            <FaArrowRightLong />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
       
       
        
      </div>
    </div>
  );
}
export default InitiateExitInManagerDashboard;
