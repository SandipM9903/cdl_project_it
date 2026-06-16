import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import { IoIosArrowDown } from "react-icons/io";
import { CiExport, CiSearch } from "react-icons/ci";
import { FaSquarePlus, FaRegCircleXmark } from "react-icons/fa6";
import { Box, Modal } from "@mui/material";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { LuFilter } from "react-icons/lu";
import Service from "../Service";
import "./ERFComponent.css";
import Header from "../../components/Header";

function EmployeeRequisition() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [requisitionType, setRequisitionType] = useState([]);
  const [employmentType, setEmploymentType] = useState([]);
  const [billingType, setBillingType] = useState([]);
  const [jobDescriptionType, setJobDescriptionType] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [filterRequisition, setFilterRequisition] = useState("");

  const [employeeRequisition, setEmployeeRequisition] = useState("");
  const [newEmployeeRequisition, setNewEmployeeRequisition] = useState([]);

  const [resolvedCount, setResolvedCount] = useState(0);
  const [resolvedRequestsCount, setResolvedRequestsCount] = useState(null);
  const [openCount, setOpenCount] = useState(0);
  const [openRequestsCount, setOpenRequestsCount] = useState(null);

  const daysOptions = [
    "Last 30 Days",
    "Last 60 Days",
    "Last 90 Days",
    "Last 120 Days",
  ];
  const defaultDays = daysOptions[0];

  const [createRequest, setCreateRequest] = useState(defaultDays);
  const [resolvedRequest, setResolvedRequest] = useState(defaultDays);
  const [openRequest, setOpenRequest] = useState(defaultDays);
  const [totalRequestsCreated, setTotalRequestsCreated] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [validationErrors, setValidationErrors] = useState({
    requisitionType: "",
    appliedOn: "",
    employmentType: "",
    billingType: "",
    selectedJob: "",
    jobDescription: "",
    requiredSkills: "",
    additionalSkills: "",
    replacementType: "",
    employeeCode: "",
    replacementProject: "",
    replacementDepartment: "",
    replacementLocation: "",
    ctc: "",
    department: "",
    position: "",
    experienceRange: "",
    minimumExperienceRange: "",
    maximumExperienceRange: "",
    education: "",
    certifications: "",
    location: "",
    reportingTo: "",
    budget: "",
    noOfPositions: "",
    itAsset: "",
    configurations: "",
    additionalInformations: "",
    initiatedBy: "",
    firstLevelApprover: "",
    secondLevelApprover: "",
    initiatorName: "",
    initiatorEmployeeCode: "",
    buHead: "",
    initiatorLocation: "",
  });

  // const [validationErrors, setValidationErrors] = useState({
  //   employeeRequisition: "",
  // });

  const [currentPage, setCurrentPage] = useState(1);

  // Pagination setting
  const ItemsPerPage = 5;

  const customArrow = (
    <span>
      <IoIosArrowDown className="-mt-5 ml-28" />
    </span>
  );

  useEffect(() => {
    Service.getAllEmployeerequisition()
      .then((res) => {
        setNewEmployeeRequisition(res.data);

        // Calculate open requests count for both 'Rejected' and 'Pending'
        const openStatuses = ["Rejected", "Pending", "In Progress"];
        calculateRequestsCounts(
          res.data,
          openStatuses,
          openRequest,
          setOpenCount,
          setOpenRequestsCount
        );

        // Calculate resolved requests count for 'Approved'
        calculateRequestsCounts(
          res.data,
          ["Approved"],
          resolvedRequest,
          setResolvedCount,
          setResolvedRequestsCount
        );

        // Calculate total requests created
        calculateRequestsCounts(
          res.data,
          [],
          createRequest,
          null,
          setTotalRequestsCreated
        );
      })
      .catch((error) => {
        console.error("Fetching error", error);
      });
  }, [createRequest, resolvedRequest, openRequest]);

  function calculateRequestsCounts(
    newEmployeeRequisition,
    statuses,
    option,
    setStatusCount,
    setRequestsCount
  ) {
    let filteredRequests;

    if (Array.isArray(statuses) && statuses.length > 0) {
      filteredRequests = newEmployeeRequisition.filter((request) =>
        statuses.includes(request.overallStatus)
      );
    } else if (statuses.length === 0) {
      filteredRequests = newEmployeeRequisition;
    } else {
      filteredRequests = newEmployeeRequisition.filter(
        (request) => request.overallStatus === statuses
      );
    }

    const requestRaisedDate = filteredRequests.map(
      (request) => new Date(request.appliedOn)
    );
    const currentDate = new Date();
    const dateDifferences = requestRaisedDate.map((appliedOn) =>
      Math.floor((currentDate - appliedOn) / (1000 * 60 * 60 * 24))
    );

    if (option === "Last 30 Days") {
      setRequestsCount(
        getRequestsWithinNDays(filteredRequests, dateDifferences, 30)
      );
    } else if (option === "Last 60 Days") {
      setRequestsCount(
        getRequestsWithinNDays(filteredRequests, dateDifferences, 60)
      );
    } else if (option === "Last 90 Days") {
      setRequestsCount(
        getRequestsWithinNDays(filteredRequests, dateDifferences, 90)
      );
    } else if (option === "Last 120 Days") {
      setRequestsCount(
        getRequestsWithinNDays(filteredRequests, dateDifferences, 120)
      );
    }

    if (setStatusCount) {
      setStatusCount(filteredRequests.length);
    }
  }

  function getRequestsWithinNDays(
    newEmployeeRequisition,
    dateDifferences,
    days
  ) {
    return newEmployeeRequisition.filter(
      (_, index) => dateDifferences[index] <= days
    ).length;
  }

  const handleCreateRequest = (option) => {
    setCreateRequest(option.value);
  };

  const handleResolvedRequest = (option) => {
    setResolvedRequest(option.value);
  };

  const handleOpenRequest = (option) => {
    setOpenRequest(option.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // search and filter functionality
  const filteredData = newEmployeeRequisition.filter((item) => {
    // General search functionality
    const searchMatch =
      item.requisitionNumber ||
      item.requisitionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.approvalStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.overallStatus.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtering based on selected options and date range
    const positionMatch =
      !filterTerm || item.position.toLowerCase() === filterTerm.toLowerCase();

    const requisitionTypeMatch =
      !filterRequisition ||
      item.requisitionType.toLowerCase() === filterRequisition.toLowerCase();

    const fromDateMatch =
      !fromDate || new Date(item.appliedOn) >= new Date(fromDate);

    const toDateMatch = !toDate || new Date(item.appliedOn) <= new Date(toDate);

    // Combine search match and filtering matches
    return (
      searchMatch &&
      positionMatch &&
      requisitionTypeMatch &&
      fromDateMatch &&
      toDateMatch
    );
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ItemsPerPage);

  const startIndex = (currentPage - 1) * ItemsPerPage;
  const endIndex = startIndex + ItemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // for fetching dropdown values

  useEffect(() => {
    Service.getAllRequisitionType()
      .then((response) => {
        setRequisitionType(response.data);
      })
      .catch((error) => console.error(error));

    Service.getAllEmploymentType()
      .then((response) => {
        setEmploymentType(response.data);
      })
      .catch((error) => console.error(error));

    Service.getAllBillingType()
      .then((response) => {
        setBillingType(response.data);
      })
      .catch((error) => console.error(error));

    Service.getAllJobDescription()
      .then((response) => {
        setJobDescriptionType(response.data);
      })
      .catch((error) => console.error(error));

    fetchData();
  }, []);

  const requisitionOptions = requisitionType.map(
    (requisition) => requisition.requisitionTypeName
  );

  const employmentOptions = employmentType.map(
    (employment) => employment.employmentTypeName
  );

  const billingOptions = billingType.map((bill) => bill.billingTypeName);

  const jobDescriptionOptions = jobDescriptionType.map(
    (jobDescription) => jobDescription.jobDescriptionName
  );

  const positions = newEmployeeRequisition.map((item) => item.position);

  const role1 = {
    positions: positions,
    requisitionTypes: requisitionOptions,
  };

  const fetchData = () => {
    Service.getAllEmployeerequisition()
      .then((response) => {
        setNewEmployeeRequisition([]);
        setNewEmployeeRequisition(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // searching option based on no,type,position
  const searchTermValue = (search) => {
    if (search === "") {
      fetchData();
    } else {
      return Service.getSearchData(search)

        .then((res) => {
          setNewEmployeeRequisition([]);
          setNewEmployeeRequisition(res.data);
        })
        .catch((err) => {
          alert("Your searching data not found");
        });
    }
  };

  //pop up dropdown values selection
  const handleFilterChangePosition = (selectedOption) => {
    setFilterTerm(selectedOption.value);
  };

  const handleFilterChangeRequisition = (selectedOption) => {
    setFilterRequisition(selectedOption.value);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const exportToExcel = () => {
    const dataToExport =
      filteredData.length > 0 ? filteredData : newEmployeeRequisition;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Requisition");
    XLSX.writeFile(workbook, "employee_requisition.xlsx");
  };

  const getApprovalStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "not approved":
        return "bg-red-200 text-red-800";
      case "approved":
        return "bg-green-200 text-green-800";
      default:
        return "";
    }
  };

  const getOverallStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      case "in progress":
        return "bg-yellow-200 text-yellow-800";
      case "approved":
        return "bg-green-200 text-green-800";
      default:
        return "";
    }
  };

  // pop up screen styling
  const style = {
    width: "100%",
    bgcolor: "white",
    position: "relative",
    left: "1%",
    top: "5%",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  // filter button screen styling
  const filterStyle = {
    width: "40%",
    bgcolor: "white",
    position: "relative",
    left: "35%",
    top: "40%",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const handleSelectRequisitionType = (selectedOption) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      requisitionType: `${selectedOption.value}`,
    });
  };

  const handleSelectAppliedOn = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      appliedOn: e.target.value,
    });
  };

  const handleSelectEmploymentType = (selectedOption) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      employmentType: `${selectedOption.value}`,
    });
  };

  const handleSelectBillingType = (selectedOption) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      billingType: `${selectedOption.value}`,
    });
  };

  const handleSelectReplacementType = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      replacementType: e.target.value,
    });
  };

  const handleSelectEmployeeCode = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      employeeCode: e.target.value,
    });
  };

  const handleSelectReplacementProject = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      replacementProject: e.target.value,
    });
  };

  const handleSelectReplacementDepartment = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      replacementDepartment: e.target.value,
    });
  };

  const handleSelectReplacementLocation = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      replacementLocation: e.target.value,
    });
  };

  const handleSelectCtc = (e) => {
    setEmployeeRequisition({ ...employeeRequisition, ctc: e.target.value });
  };

  const handleSelectDepartment = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      department: e.target.value,
    });
  };

  const handleSelectPosition = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      position: e.target.value,
    });
  };

  const handleSelectExperienceRange = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      experienceRange: e.target.value,
    });
  };

  const handleSelectMinimumExperienceRange = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      minimumExperienceRange: e.target.value,
    });
  };

  const handleSelectMaximumExperienceRange = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      maximumExperienceRange: e.target.value,
    });
  };

  const handleSelectEducation = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      education: e.target.value,
    });
  };

  const handleSelectCertifications = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      certifications: e.target.value,
    });
  };

  const handleSelectLocation = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      location: e.target.value,
    });
  };

  const handleSelectReportingTo = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      reportingTo: e.target.value,
    });
  };

  const handleSelectBudget = (e) => {
    setEmployeeRequisition({ ...employeeRequisition, budget: e.target.value });
  };

  const handleSelectNoOfPositions = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      noOfPositions: e.target.value,
    });
  };

  const handleSelectJob = (selectedOption) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      selectedJob: `${selectedOption.value}`,
    });
  };

  const handleSelectJobDescription = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      jobDescription: e.target.value,
    });
  };

  const handleSelectRequiredSkills = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      requiredSkills: e.target.value,
    });
  };

  const handleSelectAdditionalSkills = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      additionalSkills: e.target.value,
    });
  };

  const handleSelectItAsset = (e) => {
    setEmployeeRequisition({ ...employeeRequisition, itAsset: e.target.value });
  };

  const handleSelectConfigurations = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      configuartions: e.target.value,
    });
  };

  const handleSelectAdditionalInformations = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      additionalInformations: e.target.value,
    });
  };

  const handleSelectInitiatedBy = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      initiatedBy: e.target.value,
    });
  };

  const handleSelectFirstLevelApprover = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      firstLevelApprover: e.target.value,
    });
  };

  const handleSelectSecondLevelApprover = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      secondLevelApprover: e.target.value,
    });
  };

  const handleSelectInitiatorName = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      initiatorName: e.target.value,
    });
  };

  const handleSelectInitiatorEmployeeCode = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      initiatorEmployeeCode: e.target.value,
    });
  };

  const handleSelectBuhead = (e) => {
    setEmployeeRequisition({ ...employeeRequisition, buHead: e.target.value });
  };

  const handleSelectInitiatorLocation = (e) => {
    setEmployeeRequisition({
      ...employeeRequisition,
      initiatorLocation: e.target.value,
    });
  };

  const validateFields = () => {
    let isValid = true;
    const errors = {};

    // Validate requisitionType
    if (!employeeRequisition.requisitionType) {
      errors.requisitionType = "Requisition type is required";
      isValid = false;
    } else {
      errors.requisitionType = "";
    }
    if (!employeeRequisition.appliedOn) {
      errors.appliedOn = "Date is required";
      isValid = false;
    } else {
      errors.appliedOn = "";
    }
    if (!employeeRequisition.employmentType) {
      errors.employmentType = "Employment type is required";
      isValid = false;
    } else {
      errors.employmentType = "";
    }
    if (!employeeRequisition.billingType) {
      errors.billingType = "Billing type is required";
      isValid = false;
    } else {
      errors.billingType = "";
    }

    if (!employeeRequisition.department) {
      errors.department = "Department is required";
      isValid = false;
    } else {
      errors.department = "";
    }
    if (!employeeRequisition.position) {
      errors.position = "Position is required";
      isValid = false;
    } else {
      errors.position = "";
    }
    if (!employeeRequisition.experienceRange) {
      errors.experienceRange = "Experience Range is required";
      isValid = false;
    } else {
      errors.experienceRange = "";
    }
    if (!employeeRequisition.minimumExperienceRange) {
      errors.minimumExperienceRange = "MinimumExperienceRange is required";
      isValid = false;
    } else {
      errors.minimumExperienceRange = "";
    }
    if (!employeeRequisition.maximumExperienceRange) {
      errors.maximumExperienceRange = "MaximumExperienceRange is required";
      isValid = false;
    } else {
      errors.maximumExperienceRange = "";
    }
    if (!employeeRequisition.education) {
      errors.education = "Education is required";
      isValid = false;
    } else {
      errors.education = "";
    }
    if (!employeeRequisition.certifications) {
      errors.certifications = "Certifications is required";
      isValid = false;
    } else {
      errors.certifications = "";
    }
    if (!employeeRequisition.location) {
      errors.location = "Location is required";
      isValid = false;
    } else {
      errors.location = "";
    }
    if (!employeeRequisition.reportingTo) {
      errors.reportingTo = "Reporting To is required";
      isValid = false;
    } else {
      errors.reportingTo = "";
    }
    if (!employeeRequisition.budget) {
      errors.budget = "Budget is required";
      isValid = false;
    } else {
      errors.budget = "";
    }
    if (!employeeRequisition.noOfPositions) {
      errors.noOfPositions = "No Of Positions is required";
      isValid = false;
    } else {
      errors.noOfPositions = "";
    }
    if (!employeeRequisition.selectedJob) {
      errors.selectedJob = "JD is required";
      isValid = false;
    } else {
      errors.selectedJob = "";
    }
    if (!employeeRequisition.jobDescription) {
      errors.jobDescription = "Job Description is required";
      isValid = false;
    } else {
      errors.jobDescription = "";
    }
    if (!employeeRequisition.requiredSkills) {
      errors.requiredSkills = "Required skills is required";
      isValid = false;
    } else {
      errors.requiredSkills = "";
    }
    if (!employeeRequisition.additionalSkills) {
      errors.additionalSkills = "Additional skills is required";
      isValid = false;
    } else {
      errors.additionalSkills = "";
    }
    if (!employeeRequisition.itAsset) {
      errors.itAsset = "IT Asset is required";
      isValid = false;
    } else {
      errors.itAsset = "";
    }
    if (!employeeRequisition.configuartions) {
      errors.configuartions = "config is required";
      isValid = false;
    } else {
      errors.configuartions = "";
    }
    if (!employeeRequisition.additionalInformations) {
      errors.additionalInformations = "AI is required";
      isValid = false;
    } else {
      errors.additionalInformations = "";
    }
    if (!employeeRequisition.initiatedBy) {
      errors.initiatedBy = "InitiatedBy is required";
      isValid = false;
    } else {
      errors.initiatedBy = "";
    }
    if (!employeeRequisition.firstLevelApprover) {
      errors.firstLevelApprover = "FLA is required";
      isValid = false;
    } else {
      errors.firstLevelApprover = "";
    }
    if (!employeeRequisition.secondLevelApprover) {
      errors.secondLevelApprover = "SLA is required";
      isValid = false;
    } else {
      errors.secondLevelApprover = "";
    }
    if (!employeeRequisition.initiatorName) {
      errors.initiatorName = "Name is required";
      isValid = false;
    } else {
      errors.initiatorName = "";
    }
    if (!employeeRequisition.initiatorEmployeeCode) {
      errors.initiatorEmployeeCode = "EC is required";
      isValid = false;
    } else {
      errors.initiatorEmployeeCode = "";
    }
    if (!employeeRequisition.buHead) {
      errors.buHead = "BU Head is required";
      isValid = false;
    } else {
      errors.buHead = "";
    }
    if (!employeeRequisition.initiatorLocation) {
      errors.initiatorLocation = "Location is required";
      isValid = false;
    } else {
      errors.initiatorLocation = "";
    }

    setValidationErrors(errors);
    return isValid;
  };

  //pop up form submission
  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }

    Service.createNewEmployeeRequisition(employeeRequisition)
      .then((response) => {
        console.log("response<>>>>>", response);
        Swal.fire({
          icon: "success",
          title: "Successfully Submitted!",
          text: "Employee requisition form has been submitted successfully.",
        });
        setModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error during submission:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error during submission. Please try again.",
        });
      });
    console.log("Employee Requisition Data: ", employeeRequisition);
  };

  const handleModalClose = () => {
    setValidationErrors({
      requisitionType: "",
      appliedOn: "",
      employmentType: "",
      billingType: "",
      selectedJob: "",
      jobDescription: "",
      requiredSkills: "",
      additionalSkills: "",
      replacementType: "",
      employeeCode: "",
      replacementProject: "",
      replacementDepartment: "",
      replacementLocation: "",
      ctc: "",
      department: "",
      position: "",
      experienceRange: "",
      minimumExperienceRange: "",
      maximumExperienceRange: "",
      education: "",
      certifications: "",
      location: "",
      reportingTo: "",
      budget: "",
      noOfPositions: "",
      itAsset: "",
      configurations: "",
      additionalInformations: "",
      initiatedBy: "",
      firstLevelApprover: "",
      secondLevelApprover: "",
      initiatorName: "",
      initiatorEmployeeCode: "",
      buHead: "",
      initiatorLocation: "",
    });

    // setValidationErrors({ employeeRequisition: "" });
    setEmployeeRequisition("");
    setModalOpen(false);
  };
  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem('role')) || [];
  } catch (e) {
    console.error('Error parsing roles from sessionStorage:', e);
  }

  // Function to check if the user has a specific role
  const hasRole = (role) => roles.includes(role);

  return (
    <>
    <div className="">
  <Header/>
      <div className="  mt-20 bg-white-300">
      <div className="bg-white h-auto pb-4 rounded-md">
        <div className="flex space-x-3">
          <h2 className="ml-6 font-semibold mt-2">
            Employee Requisition
          </h2>
          <img src="req2.jpg" alt="req2" className="h-10 mt-2" />
        </div>
        <h2 className="border-b-2 mt-2" aria-hidden="true"></h2>
     <div className="mt-8 px-4 sm:px-8">
  <h3 className="text-lg font-semibold mb-4">Overview</h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Card 1: Create Requests */}
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 h-40 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Create Requests</h3>
        <Dropdown
          className="text-gray-500"
          options={daysOptions}
          value={createRequest}
          placeholder="Select"
          arrowOpen={customArrow}
          arrowClosed={customArrow}
          onChange={handleCreateRequest}
        />
      </div>
      <h1 className="text-4xl font-bold text-blue-500 text-center">
        {totalRequestsCreated}
      </h1>
    </div>

    {/* Card 2: Resolved Requests */}
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 h-40 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Resolved Requests</h3>
        <Dropdown
          className="text-gray-500"
          options={daysOptions}
          value={resolvedRequest}
          placeholder="Select"
          arrowOpen={customArrow}
          arrowClosed={customArrow}
          onChange={handleResolvedRequest}
        />
      </div>
      <h1 className="text-4xl font-bold text-green-500 text-center">
        {resolvedRequestsCount}
      </h1>
    </div>

    {/* Card 3: Open Requests */}
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 h-40 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Open Requests</h3>
        <Dropdown
          className="text-gray-500"
          options={daysOptions}
          value={openRequest}
          placeholder="Select"
          arrowOpen={customArrow}
          arrowClosed={customArrow}
          onChange={handleOpenRequest}
        />
      </div>
      <h1 className="text-4xl font-bold text-red-500 text-center">
        {openRequestsCount}
      </h1>
    </div>
  </div>
</div>

        <div className="mt-12 mx-auto border border-gray-400 w-11/12 max-w-7xl bg-white rounded-md shadow-sm">
  {/* Header Row */}
  <div className="flex flex-col md:flex-row justify-between items-center px-6 pt-4">
    <h3 className="text-lg font-semibold">My Requisitions</h3>

    <div className="flex items-center space-x-4 mt-4 md:mt-0 text-blue-600 text-2xl">
      <button onClick={exportToExcel} title="Export to Excel">
        <CiExport />
      </button>
      <button onClick={() => setModalOpen(true)} title="Add Requisition">
        <FaSquarePlus />
      </button>
    </div>
  </div>

  {/* Search + Filters + Pagination */}
  <div className="flex flex-col md:flex-row md:items-center justify-between px-6 mt-6 space-y-4 md:space-y-0">
    {/* Search */}
    <div className="relative w-full md:w-1/3">
      <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder="Search in Requisitions"
        className="w-full border border-gray-300 rounded px-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyUp={() => searchTermValue(searchTerm)}
      />
    </div>

    {/* Filters */}
    <button
      className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-4 py-2 rounded"
      onClick={() => setFilterOpen(true)}
    >
      <LuFilter className="mr-2" />
      Filters
    </button>

    {/* Pagination */}
    <div className="flex items-center space-x-3 text-sm text-gray-700">
      <span>
        {`${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`}
      </span>
      <button
        className="disabled:opacity-30"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      <button
        className="disabled:opacity-30"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  </div>

  {/* Divider */}
  <hr className="my-4 border-t border-gray-300" />

  {/* Data List */}
  {paginatedData.length === 0 ? (
    <div className="text-center font-semibold text-xl text-gray-600 py-8">
      Data not found!
    </div>
  ) : (
    paginatedData.map((item) => (
      <div
        key={item.requisitionNumber}
        className="border m-4 p-4 rounded-md shadow-sm bg-gray-50"
        data-testid="newEmployeeRequisition"
      >
        {/* Top Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
           
            <div>
              <p className="text-sm text-gray-500 font-semibold">Requisition No</p>
              <p className="text-black font-semibold">{item.requisitionNumber}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-semibold">Department</p>
            <p className="text-black font-semibold">{item.department}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 px-2">
          <div>
            <p className="text-sm text-gray-500 font-semibold">Requisition Type</p>
            <p className="text-black font-semibold">{item.requisitionType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Date</p>
            <p className="text-black font-semibold">{item.appliedOn}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Position</p>
            <p className="text-black font-semibold">{item.position}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">No of Positions</p>
            <p className="text-black font-semibold">{item.noOfPositions}</p>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
          <div>
            <p className="text-sm text-gray-500 font-semibold">Approval Status</p>
            {item.approvalStatus && (
              <p
                className={`font-semibold mt-1 w-fit px-3 py-1 rounded ${getApprovalStatusClass(
                  item.approvalStatus
                )}`}
              >
                {item.approvalStatus}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 font-semibold">Overall Status</p>
            {item.overallStatus && (
              <p
                className={`font-semibold mt-1 w-fit px-3 py-1 rounded ${getOverallStatusClass(
                  item.overallStatus
                )}`}
              >
                {item.overallStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    ))
  )}
</div>

      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
          <div className="border shadow rounded-md bg-white m-2 h-auto">
            <div className="m-2">
              <div className="flex justify-between border-b-2">
                <h3 className="ml-2 font-semibold">
                  Create New Employee Requisition
                </h3>
                <button
                  onClick={handleModalClose}
                  className="text-xl mr-2 text-red-600"
                >
                  <FaRegCircleXmark />
                </button>
              </div>
              <div className="flex m-6 space-x-8 mt-10">
                <div className="flex">
                  <h3 className="text-sm font-semibold">
                    Requisition type
                  </h3>
                  <h3 className="text-red-600 -mt-1 ml-1">*</h3>
                </div>
                <Dropdown
                  data-testid="requisitionType"
                  onChange={handleSelectRequisitionType}
                  options={requisitionOptions}
                  className="-mt-2 border border-gray-400 w-64"
                />
              </div>
              <h3 className="text-sm text-red-600 ml-44">
                {validationErrors.requisitionType && (
                  <span>{validationErrors.requisitionType}</span>
                )}
              </h3>
              <div className="m-6">
                <div className="flex space-x-1">
                  <h3 className="text-sm font-semibold">Date</h3>
                  <h3 className="text-red-600 -mt-1">*</h3>
                </div>
                <h3 className="mt-1">
                  <form action="/action_page.php">
                    <input
                      onChange={handleSelectAppliedOn}
                      type="date"
                      className="mr-4 border border-gray-400"
                    />
                  </form>
                </h3>
                <h3 className="text-sm text-red-600 ml-2 mt-1">
                  {validationErrors.appliedOn && (
                    <span>{validationErrors.appliedOn}</span>
                  )}
                </h3>
              </div>

              <div className="m-6">
                <div className="flex space-x-1">
                  <h3 className="text-sm font-semibold">
                    Employment Type
                  </h3>
                  <h3 className="text-red-600 -mt-1">*</h3>
                </div>
                <Dropdown
                  onChange={handleSelectEmploymentType}
                  options={employmentOptions}
                  className="mt-2 border border-gray-400 w-64"
                />
                <h3 className="text-sm text-red-600 ml-2 mt-1">
                  {validationErrors.employmentType && (
                    <span>{validationErrors.employmentType}</span>
                  )}
                </h3>
              </div>

              <div className="m-6">
                <div className="flex space-x-1">
                  <h3 className="text-sm font-semibold">Billing Type</h3>
                  <h3 className="text-red-600 -mt-1">*</h3>
                </div>
                <Dropdown
                  onChange={handleSelectBillingType}
                  options={billingOptions}
                  className="mt-2 border border-gray-400 w-64"
                />
                <h3 className="text-sm text-red-600 ml-2 mt-1">
                  {validationErrors.billingType && (
                    <span>{validationErrors.billingType}</span>
                  )}
                </h3>
              </div>

              {(employeeRequisition.requisitionType ===
                "Replacement (Approved Head Count)" ||
                employeeRequisition.requisitionType ===
                  "Replacement (Project Head Count)") && (
                <div className="m-4 bg-teal-100 h-auto pb-2">
                  <h3 className="ml-4 font-semibold">Replacement</h3>
                  <div className="md:flex flex-1 md:space-x-5 space-y-1 ml-3 mt-4">
                    <div>
                      <h3 className="text-sm">Name of Replacement</h3>
                      <h3 className="mt-5">
                        <form action="/action_page.php">
                          <input
                            type="text"
                            id="w3review"
                            name="position"
                            style={{ border: "1.5px solid #ccc" }}
                            className="mr-4 mt-1 h-12 w-48"
                            onChange={handleSelectReplacementType}
                          />
                        </form>
                      </h3>
                    </div>

                    <div>
                      <h3 className="text-sm">Employee Code</h3>
                      <h3 className="mt-4">
                        <form action="/action_page.php">
                          <input
                            type="text"
                            id="w3review"
                            name="position"
                            style={{ border: "1.5px solid #ccc" }}
                            className="mr-4 mt-1 h-12 w-36"
                            onChange={handleSelectEmployeeCode}
                          />
                        </form>
                      </h3>
                    </div>

                    <div>
                      <h3 className="text-sm">Project</h3>
                      <h3 className="mt-4">
                        <form action="/action_page.php">
                          <input
                            type="text"
                            id="w3review"
                            name="position"
                            style={{ border: "1.5px solid #ccc" }}
                            className="mr-4 mt-1 h-12 w-44"
                            onChange={handleSelectReplacementProject}
                          />
                        </form>
                      </h3>
                    </div>

                    <div>
                      <h3 className="text-sm">Department</h3>
                      <h3 className="mt-4">
                        <form action="/action_page.php">
                          <input
                            type="text"
                            id="w3review"
                            name="position"
                            style={{ border: "1.5px solid #ccc" }}
                            className="mr-4 mt-1 h-12 w-44"
                            onChange={handleSelectReplacementDepartment}
                          />
                        </form>
                      </h3>
                    </div>

                    <div>
                      <h3 className="text-sm">Location</h3>
                      <h3 className="mt-4">
                        <form action="/action_page.php">
                          <input
                            type="text"
                            id="w3review"
                            name="position"
                            style={{ border: "1.5px solid #ccc" }}
                            className="mr-4 mt-1 h-12 w-40"
                            onChange={handleSelectReplacementLocation}
                          />
                        </form>
                      </h3>
                    </div>

                    <div>
                      <h3 className="text-sm">CTC</h3>
                      <h3 className="mt-4 mr-1">
                        <form action="/action_page.php">
                          <input
                            type="text"
                            id="w3review"
                            name="position"
                            style={{ border: "1.5px solid #ccc" }}
                            className="mr-4 mt-1 h-12 w-36"
                            onChange={handleSelectCtc}
                          />
                        </form>
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="m-4 bg-teal-100 h-aut pb-2">
                <h3 className="ml-4 font-semibold">Position Details</h3>
                <div className="md:flex flex-1 md:space-x-4 space-y-1 ml-2 mt-3">
                  <div>
                    <h3 className="text-sm mt-1">Department</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 mt-1 h-12 w-48"
                          onChange={handleSelectDepartment}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.department && (
                        <span>{validationErrors.department}</span>
                      )}
                    </h3>
                  </div>

                  <div>
                    <h3 className="text-sm">Position</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 mt-1 h-12 w-48"
                          onChange={handleSelectPosition}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.position && (
                        <span>{validationErrors.position}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <div className="flex space-x-1">
                      <h3 className="text-sm">Experience</h3>
                      <h3 className="text-sm">Range</h3>
                    </div>
                    <h3 className="text-sm">(In years)</h3>
                    <h3 className="">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-28"
                          onChange={handleSelectExperienceRange}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.experienceRange && (
                        <span>{validationErrors.experienceRange}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <div className="flex text-sm space-x-1">
                      <h3 className="text-sm">Experience Range</h3>
                      <h3>(In years)</h3>
                    </div>
                    <div className="flex space-x-10 mt-5">
                      <h3>
                        <form action="/action_page.php">
                          <input
                            type="text"
                            id="w3review"
                            name="position"
                            style={{ border: "1.5px solid #ccc" }}
                            className="mr-4 h-12 w-12"
                            onChange={handleSelectMinimumExperienceRange}
                          />
                        </form>
                      </h3>
                      <h3 className="text-sm mt-4">To</h3>
                      <h3>
                        <form action="/action_page.php">
                          <input
                            type="text"
                            id="w3review"
                            name="position"
                            style={{ border: "1.5px solid #ccc" }}
                            className="mr-4 h-12 w-12"
                            onChange={handleSelectMaximumExperienceRange}
                          />
                        </form>
                      </h3>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm">Education</h3>
                    <h3 className="mt-5">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-40"
                          onChange={handleSelectEducation}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.education && (
                        <span>{validationErrors.education}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm">Certifications (If any)</h3>
                    <h3 className="mt-5 mr-1">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-40"
                          onChange={handleSelectCertifications}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.certifications && (
                        <span>{validationErrors.certifications}</span>
                      )}
                    </h3>
                  </div>
                </div>
                <div className="md:flex flex-1 md:space-x-4 space-y-1 ml-2 mt-3">
                  <div className="">
                    <h3 className="text-sm">Location</h3>
                    <h3 className="mt-5">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-48"
                          onChange={handleSelectLocation}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.location && (
                        <span>{validationErrors.location}</span>
                      )}
                    </h3>
                  </div>
                  <div className="">
                    <h3 className="text-sm">Reporting To</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-48"
                          onChange={handleSelectReportingTo}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.reportingTo && (
                        <span>{validationErrors.reportingTo}</span>
                      )}
                    </h3>
                  </div>
                  <div className="">
                    <h3 className="text-sm">Budget</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-28"
                          onChange={handleSelectBudget}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.budget && (
                        <span>{validationErrors.budget}</span>
                      )}
                    </h3>
                  </div>
                  <div className="">
                    <h3 className="text-sm">No of Positions</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-28"
                          onChange={handleSelectNoOfPositions}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.noOfPositions && (
                        <span>{validationErrors.noOfPositions}</span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="md:mt-2 mt-8">
                <div className="m-6">
                  <div className="flex space-x-1">
                    <h3 className="text-sm font-semibold">Select Job Role</h3>
                    <h3 className="text-red-600 -mt-1">*</h3>
                  </div>
                  <Dropdown
                    onChange={handleSelectJob}
                    options={jobDescriptionOptions}
                    className="mt-2 border border-gray-400 w-64"
                  />
                  <h3 className="text-red-600 ml-2">
                    {validationErrors.selectedJob && (
                      <span>{validationErrors.selectedJob}</span>
                    )}
                  </h3>
                </div>

                <div className="m-6">
                  <div className="flex space-x-1">
                    <h3 className="text-sm font-semibold">
                      Job Description
                    </h3>
                    <h3 className="text-red-600 -mt-1">*</h3>
                  </div>
                  <h3 className="mt-2">
                    <form action="/action_page.php">
                      <textarea
                        id="w3review"
                        name="jobDescription"
                        rows="5"
                        cols="125"
                        style={{ border: "1.5px solid #ccc" }}
                        onChange={handleSelectJobDescription}
                      ></textarea>
                      <br />
                    </form>
                  </h3>
                  <h3 className="text-red-600 ml-2">
                    {validationErrors.jobDescription && (
                      <span>{validationErrors.jobDescription}</span>
                    )}
                  </h3>
                </div>

                <div className="m-6">
                  <div className="flex space-x-1">
                    <h3 className="text-sm font-semibold">
                      Required Skills
                    </h3>
                    <h3 className="text-red-600 -mt-1">*</h3>
                  </div>
                  <h3 className="mt-2">
                    <form action="/action_page.php">
                      <textarea
                        id="w3review"
                        name="requiredSkills"
                        rows="3"
                        cols="80"
                        style={{ border: "1.5px solid #ccc" }}
                        onChange={handleSelectRequiredSkills}
                      ></textarea>
                      <br />
                    </form>
                  </h3>
                  <h3 className="text-red-600 ml-2">
                    {validationErrors.requiredSkills && (
                      <span>{validationErrors.requiredSkills}</span>
                    )}
                  </h3>
                </div>

                <div className="m-6">
                  <div className="flex space-x-1">
                    <h3 className="text-sm font-semibold">
                      Additional Skills
                    </h3>
                    <h3 className="text-red-600 -mt-1">*</h3>
                  </div>
                  <h3 className="mt-2">
                    <form action="/action_page.php">
                      <textarea
                        id="w3review"
                        name="additionalSkills"
                        rows="3"
                        cols="80"
                        style={{ border: "1.5px solid #ccc" }}
                        onChange={handleSelectAdditionalSkills}
                      ></textarea>
                      <br />
                    </form>
                  </h3>
                  <h3 className="text-red-600 ml-2">
                    {validationErrors.additionalSkills && (
                      <span>{validationErrors.additionalSkills}</span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="m-4 bg-teal-100 h-auto pb-2">
                <h3 className="ml-4 font-semibold">
                  IT Asset Requirements
                </h3>
                <div className="md:flex flex-1 md:space-x-7 space-y-1 ml-3 mt-4">
                  <div>
                    <h3 className="text-sm">IT Asset</h3>
                    <h3 className="mt-5">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-40"
                          onChange={handleSelectItAsset}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.itAsset && (
                        <span>{validationErrors.itAsset}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm">Configurations</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-36"
                          onChange={handleSelectConfigurations}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.configuartions && (
                        <span>{validationErrors.configuartions}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm">Additional Informations</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-40"
                          onChange={handleSelectAdditionalInformations}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.additionalInformations && (
                        <span>{validationErrors.additionalInformations}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm">Initiated By(Hiring manager)</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-44"
                          onChange={handleSelectInitiatedBy}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.initiatedBy && (
                        <span>{validationErrors.initiatedBy}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm">First Level Approver</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="h-12 w-40"
                          onChange={handleSelectFirstLevelApprover}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.firstLevelApprover && (
                        <span>{validationErrors.firstLevelApprover}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm">Second Level Approver</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="h-12 w-40"
                          onChange={handleSelectSecondLevelApprover}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.secondLevelApprover && (
                        <span>{validationErrors.secondLevelApprover}</span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="m-4 bg-teal-100 h-auto pb-2">
                <h3 className="ml-4 font-semibold">Initiator Details</h3>
                <div className="md:flex flex-1 md:space-x-7 space-y-1 ml-3 mt-4">
                  <div>
                    <h3 className="text-sm font-medium">Name</h3>
                    <h3 className="mt-5">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-40"
                          onChange={handleSelectInitiatorName}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.initiatorName && (
                        <span>{validationErrors.initiatorName}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Employee Code</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-36"
                          onChange={handleSelectInitiatorEmployeeCode}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.initiatorEmployeeCode && (
                        <span>{validationErrors.initiatorEmployeeCode}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">BU Head</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-40"
                          onChange={handleSelectBuhead}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.buHead && (
                        <span>{validationErrors.buHead}</span>
                      )}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Location</h3>
                    <h3 className="mt-4">
                      <form action="/action_page.php">
                        <input
                          type="text"
                          id="w3review"
                          name="position"
                          style={{ border: "1.5px solid #ccc" }}
                          className="mr-4 h-12 w-40"
                          onChange={handleSelectInitiatorLocation}
                        />
                      </form>
                    </h3>
                    <h3 className="text-sm text-red-600 ml-1">
                      {validationErrors.initiatorLocation && (
                        <span>{validationErrors.initiatorLocation}</span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="ml-4 md:flex flex-1 md:space-x-20 space-y-3 mb-3">
                <h3 className="text-red-500 text-sm">
                  *Desclaimer : All the Details are Subject to approval of BU
                  Head and HR Head
                </h3>
                <div className="ml-4 flex space-x-8">
                  <button
                    onClick={handleSubmit}
                    data-testid="submit"
                    className="border border-blue-600 px-4 py-2 text-blue-500 font-semibold"
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleModalClose}
                    className="bg-blue-400 px-4 py-2 text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal open={filterOpen} onClose={() => setFilterOpen(false)}>
        <Box sx={filterStyle}>
          <div className="ml-2 md:h-72 h-auto border shadow-md mt-2 rounded-md">
            <div className="flex md:flex-row flex-col m-2 ml-8 mt-4">
              <h3 className="md:ml-0 ml-8 font-semibold">Positions</h3>
              <Dropdown
                options={[...role1.positions]}
                placeholder="Select position"
                onChange={handleFilterChangePosition}
                className="md:ml-52 ml-0"
              />
            </div>
            <div className="flex md:flex-row flex-col m-2 ml-8">
              <h3 className="md:ml-0 ml-8 font-semibold">
                RequisitionType
              </h3>
              <Dropdown
                options={[...role1.requisitionTypes]}
                placeholder="Select requisition type"
                onChange={handleFilterChangeRequisition}
                className="md:ml-24 ml-1"
              />
            </div>
            <div className="flex md:flex-row flex-col ml-8 m-2">
              <h3 className="md:ml-0 ml-8 font-semibold">From Date</h3>
              <input
                type="date"
                className="mr-4 border border-gray-400 md:ml-52 ml-8"
                value={fromDate}
                onChange={handleFromDateChange}
              />
            </div>
            <div className="flex md:flex-row flex-col ml-8 pt-2 m-2">
              <h3 className="md:ml-0 ml-8 font-semibold">To Date</h3>
              <input
                type="date"
                className="border border-gray-400 md:ml-[230px] ml-8"
                value={toDate}
                onChange={handleToDateChange}
              />
            </div>
            <div className="md:ml-52 ml-28 mt-7">
              <button
                onClick={() => setFilterOpen(false)}
                className="p-1 bg-blue-400 rounded-md"
              >
                Search
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      </div>
      </div>
    </>
  );
}

export default EmployeeRequisition;
