import React, { useState } from "react";

import { SlPeople } from "react-icons/sl";
import { FiUpload } from "react-icons/fi";
import {
  MdOutlineAddBox,
  MdOutlineCancel,
  MdOutlineDeleteForever,
} from "react-icons/md";
import { BsSpeedometer2, BsPersonSquare } from "react-icons/bs";
import { IoPeopleSharp, IoReorderThreeOutline } from "react-icons/io5";
import { GoSearch } from "react-icons/go";
import DataTable from "react-data-table-component";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaArrowUp } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";
import { ImTree } from "react-icons/im";
import AddEmp from "./AddEmp";
import Bulkadd from "./Bulkadd";
import Header from "../components/Header";
import EmployeeConfirmation from "./EmployeeConfirmationCard";

const data = [
  {
    id: 1,
    employeeCode: "761",
    fullName: "John Doe",
    department: "SSD",
    designation: "Software Engineer",
    contactNumber: "8787563425",
    manager: "mathimaran",
    status: "active",
    location: "bengaluru",
  },
  {
    id: 2,
    employeeCode: "422",
    fullName: "Jane Smith",
    department: "GSD",
    status: "inActive",
    designation: "Project Manager",
    contactNumber: "77895634788",
    manager: "harish",
    location: "Kerala",
  },
];

function Empdirectory() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmployeepopup, setIsEmployeepopup] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState();
  const [search, setSearch] = useState();
  const [includeField, setincludeField] = useState("");
  const [excludeField, setExcludeField] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const locationOptions = [
    "Bengaluru",
    "Delhi",
    "Mumbai",
    "Rajasthan",
    "Kerala",
  ];
  const inclusionOptions = ["Include", "Exclude"];
  const dueDays = ["30 days", "20 days", "10 days"];
  const departmentOptions = [
    { label: "All Department", value: "All" },
    { label: "SSD", value: "SSD" },
    { label: "GSD", value: "GSD" },
    { label: "IT", value: "IT" },
  ];
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedinclusion, setSelectedInclusion] = useState(null);
  const [selectedDue, setSelectedDue] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleBulkAddClick = () => {
    setIsModalOpen(true);
  };
  const handlefilterClick = () => {
    setIsFilterOpen(true);
    setSearchClicked(false);
  };
  const handleAddEmployee = () => {
    setIsEmployeepopup(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const closeEmployeepopup = () => {
    setIsEmployeepopup(false);
  };
  const handleLocationChange = (option) => {
    setSelectedLocation(option.value);
  };

  const handleDueDays = (option) => {
    setSelectedDue(option.value);
  };

  const handleIncludeExclude = (option) => {
    setSelectedInclusion(option.value);
  };

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
  };

  const handleStatusChange = (option) => {
    setSelectedStatus(option);
  };

  const handleRowSelected = (state) => {
    setSelectedRowsCount(state.selectedRows.length);
  };

  const [fileName, setFileName] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };
  const handleCancel = () => {
    setFileName("");
  };

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#F3F4F6",
        color: "#374151",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  };
  const dataa = [
    { name: "Apr 1", value: 2000 },
    { name: "may 2", value: 1350 },
    { name: "june 3", value: 1400 },
    { name: "jul 4", value: 1500 },
    { name: "Aug 5", value: 1600 },
    { name: "sep 6", value: 1660 },
    { name: "oct 6", value: 1100 },
    { name: "nov 6", value: 1500 },
    { name: "dec 6", value: 1760 },
    { name: "jan 6", value: 1890 },
    { name: "feb 6", value: 2020 },
    { name: "marc 6", value: 2340 },
  ];
  const [fields, setFields] = useState([
    { column: "", inclusion: "", value: "" },
  ]);

  const handleAddField = () => {
    setFields([...fields, { column: "", inclusion: "", value: "" }]);
  };
  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    if (inputValue.trim() === "") {
      inputValue = inputValue.trimStart();
    }
    setSearch(inputValue);
  };

  const columns = [
    {
      name: "Employee Name",
      id: "fullName",
      minWidth: "200px",
      cell: (row) => (
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src={require}
            className="rounded-full h-[34px] w-[36px] "
            alt="Profile"
          />
          <h1 className="text-sm font-medium text-blue-600">{row.fullName} </h1>
        </div>
      ),
    },
    {
      name: "Employee Id",
      selector: (row) => row.employeeCode,
      minWidth: "150px",
      sortable: true,
      id: "employeeCode",
    },
    {
      name: "Contact Number",
      selector: (row) => row.contactNumber,
      minWidth: "180px",
      id: "contactNumber",
    },
    {
      name: "Department",
      selector: (row) => row.department,
      minWidth: "180px",
      id: "department",
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
      minWidth: "180px",
      id: "designation",
    },
    {
      name: "Manager",
      selector: (row) => row.manager,
      minWidth: "180px",
      id: "manager",
    },

    {
      name: "Status",
      selector: (row) => row.status,
      maxWidth: "150px",
      id: "status",
    },
    {
      name: "Employee Status",
      cell: (row) => (
        <span className="text-sm">
          {row.status === "Active" ? "Current Employee" : "Exited Employee"}
        </span>
      ),
      minWidth: "150px",
    },
  ];

  const optionCol = columns.map((col) => col.name);
  const [selectedColumns, setSelectedColumns] = useState(
    columns.map((col) => col.id),
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCheckboxChange = (columnId) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId],
    );
  };

  const isAllSelected = selectedColumns.length === columns.length;
  const filteredColumns = columns.filter((col) =>
    selectedColumns.includes(col.id),
  );

  const handleSelectAll = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(columns.map((col) => col.id));
    }
  };

  const handleSearch = () => {
    setIsFilterOpen(false);
    setSearchClicked(true);
  };

  const filteredEmployees = data.filter((emp) => {
    const lowerSearch = search?.toLowerCase();
    const lowerInclude = includeField?.toLowerCase();
    const lowerExclude = excludeField?.toLowerCase();
    const matchesSearch = search
      ? emp.fullName?.toLowerCase().includes(lowerSearch) ||
        emp.department?.toLowerCase().includes(lowerSearch) ||
        emp.employeeCode
          ?.toString()
          .toLowerCase()
          .includes(lowerSearch) ||
        emp.contactNumber
          ?.toString()
          .toLowerCase()
          .includes(lowerSearch) ||
        emp.designation
          ?.toString()
          .toLowerCase()
          .includes(lowerSearch) ||
        emp.manager
          ?.toString()
          .toLowerCase()
          .includes(lowerSearch) ||
        emp.status
          ?.toString()
          .toLowerCase()
          .includes(lowerSearch) ||
        emp.location?.toLowerCase().includes(lowerSearch)
      : true;

    const matchesInclude =
      searchClicked && includeField
        ? columns.some((column) => {
            const value = column.selector
              ? column.selector(emp)
              : emp[column.id];
            return column.id === "status"
              ? value?.toString().toLowerCase() === lowerInclude
              : value
                  ?.toString()
                  .toLowerCase()
                  .includes(lowerInclude);
          })
        : true;

    const matchesExclude =
      searchClicked && excludeField
        ? !columns.some((column) => {
            const value = column.selector
              ? column.selector(emp)
              : emp[column.id];
            const stringVal = value?.toString().toLowerCase();
            return column.id === "status"
              ? stringVal === lowerExclude
              : stringVal?.includes(lowerExclude);
          })
        : true;

    const matchesDepartment =
      selectedDepartment && selectedDepartment.value !== "All"
        ? emp.department?.toLowerCase() ===
          selectedDepartment.value.toLowerCase()
        : true;

    const matchesStatus =
      selectedStatus && selectedStatus.value !== "All"
        ? emp.status?.toLowerCase() === selectedStatus.value.toLowerCase()
        : true;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesStatus &&
      matchesInclude &&
      matchesExclude
    );
  });

  const departments = [
    { name: "Human Resource", employees: 25 },
    { name: "Operations", employees: 40 },
    { name: "Marketing", employees: 15 },
    { name: "Finance", employees: 30 },
    { name: "Software Services", employees: 30 },
    { name: "Support", employees: 30 },
    { name: "Administration", employees: 30 },
    { name: "Network Team", employees: 30 },
  ];
  const totalEmployee = 2500;
  const men = 1500;
  const women = 1000;
  const menPercentage = Math.min((men / totalEmployee) * 100, 100);
  const womenPercentage = Math.min((women / totalEmployee) * 100, 100);

  const handleClearAllFilters = () => {
    setSelectedLocation(null);
    setSelectedInclusion(null);
    setSelectedDepartment(null);
    setSelectedStatus(null);
    setSearch("");
    setincludeField(null);
    setExcludeField(null);
    setSelectedColumns(columns.map((col) => col.id));
  };

  const handleClearSearch = () => {
    setincludeField("");
    setExcludeField("");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border py-4 px-4 border-gray-300 shadow-md mt-4 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="bg-green-400 p-2 rounded-md shadow-md">
            <SlPeople className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Employee</h1>
            <p className="text-sm font-semibold text-gray-600">
              Manage your Employee
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <button
            onClick={handleAddEmployee}
            className="bg-blue-400 px-4 py-2 rounded-md text-white flex items-center gap-2 text-sm"
          >
            <MdOutlineAddBox className="text-lg" />
            <span>Add Employee</span>
          </button>
          <button
            onClick={handleBulkAddClick}
            className="flex px-4 py-2 border-b-4 border-gray-300 text-blue-500 rounded-md shadow-md items-center gap-2 text-sm"
          >
            <FiUpload className="text-lg" />
            <span className="text-black">Bulk Add</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 px-4">
        <button
          className={`py-2 flex items-center gap-2 border-b-4 ${
            activeTab === "overview"
              ? "border-blue-400 text-blue-500 font-semibold"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <BsSpeedometer2 className="text-2xl" />
          Overview
        </button>

        <button
          className={`py-2 flex items-center gap-2 border-b-4 ${
            activeTab === "directory"
              ? "border-blue-400 text-blue-500 font-semibold"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => setActiveTab("directory")}
        >
          <IoPeopleSharp className="text-2xl" />
          Employee Directory
        </button>

        <button
          className={`py-2 flex items-center gap-2 border-b-4 ${
            activeTab === "confirmation"
              ? "border-blue-400 text-blue-500 font-semibold"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => setActiveTab("confirmation")}
        >
          <BsPersonSquare className="text-xl" />
          Probation Confirmation
        </button>
        <h1></h1>

        <button
          className={`py-2 flex items-center gap-2 border-b-4 ${
            activeTab === "organization"
              ? "border-blue-400 text-blue-500 font-semibold"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => setActiveTab("organization")}
        >
          <ImTree className="text-xl" />
          Organization Chart
        </button>
      </div>
      <div className="">
        {activeTab === "overview" ? (
          <>
            <div className="w-full px-4">
              <h1 className="pt-4 font-semibold text-gray-800">
                Employees Head Count
              </h1>

              <div className="mt-4">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={dataa}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="natural" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* First row of 3 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                {/* Department Card */}
                <div className="p-6 shadow-lg border border-gray-200 rounded-sm w-full">
                  <h1 className="text-orange-500 text-lg font-semibold">
                    {departments.length}
                  </h1>
                  <h2 className="text-base font-semibold text-[#313335] pt-1">
                    Departments
                  </h2>
                  <div
                    className={`${
                      departments.length > 6 ? "h-60 overflow-y-auto" : "h-auto"
                    }`}
                  >
                    {departments.map((dept, index) => (
                      <div key={index} className="my-4 px-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[#4B5C5E] font-medium">
                            {dept.name}
                          </h3>
                          <p className="text-sm">{dept.employees}</p>
                        </div>
                        <div className="w-full bg-gray-300 h-1 rounded-xl overflow-hidden mt-1">
                          <div
                            className="bg-blue-500 h-1"
                            style={{
                              width: `${(dept.employees / totalEmployee) *
                                100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* New Joiners Card */}
                <div className="bg-white shadow-lg rounded-sm p-4 border w-full">
                  <h1 className="text-orange-500 text-lg font-semibold flex justify-between items-center">
                    15
                    <Dropdown
                      className="w-30 h-6 min-h-6 text-xs"
                      options={dueDays}
                      onChange={handleDueDays}
                      value={selectedDue}
                      placeholder="select"
                    />
                    <button className="text-gray-600">
                      <HiDotsHorizontal />
                    </button>
                  </h1>
                  <h2 className="text-base font-semibold text-gray-800 pt-2">
                    New Joiners for 1 Month
                  </h2>
                  <div className="pt-4">
                    <div className="flex items-center space-x-4 cursor-pointer">
                      <img
                        src={require}
                        className="rounded-full h-9 w-9"
                        alt="Profile"
                      />
                      <div>
                        <div className="flex justify-between w-full">
                          <h1 className="text-black">Ammu - 21234555</h1>
                          <h2 className="text-gray-500 text-sm ml-24">
                            2 Days ago
                          </h2>
                        </div>
                        <span className="block text-sm text-gray-500">
                          Software Development
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirmation Due Card */}
                <div className="bg-white shadow-lg rounded-sm p-4 border w-full">
                  <h1 className="text-orange-500 text-lg font-semibold flex justify-between items-center">
                    20
                    <Dropdown
                      className="w-30 h-6 min-h-6 text-xs"
                      options={dueDays}
                      onChange={handleDueDays}
                      value={selectedDue}
                      placeholder="select"
                    />
                    <button className="text-gray-600">
                      <HiDotsHorizontal />
                    </button>
                  </h1>
                  <h2 className="text-base font-semibold text-gray-800 pt-2">
                    Confirmation Due
                  </h2>
                  <div className="pt-4">
                    <div className="flex items-center space-x-4 cursor-pointer">
                      <img
                        src={require}
                        className="rounded-full h-9 w-9"
                        alt="Profile"
                      />
                      <div>
                        <div className="flex justify-between w-full">
                          <h1 className="text-black">Ammu - 21234555</h1>
                          <h2 className="text-gray-500 text-sm ml-24">
                            6 Days ago
                          </h2>
                        </div>
                        <span className="block text-sm text-gray-500">
                          Software Development
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-md p-6 border w-full">
                  <h1 className="text-orange-500 text-lg font-semibold flex justify-between items-center">
                    20
                    <Dropdown
                      className="w-30 h-6 min-h-6 text-xs"
                      options={dueDays}
                      onChange={handleDueDays}
                      value={selectedDue}
                      placeholder="select"
                    />
                    <button className="text-gray-600">
                      <HiDotsHorizontal />
                    </button>
                  </h1>
                  <h2 className="text-base font-semibold text-gray-800 pt-2">
                    Confirmation Due
                  </h2>
                  <div className="pt-4">
                    <div className="flex items-center space-x-4 cursor-pointer">
                      <img
                        src={require}
                        className="rounded-full h-10 w-10"
                        alt="Profile"
                      />
                      <div>
                        <div className="flex justify-between w-full">
                          <h1 className="text-black">Ammu - 21234555</h1>
                          <h2 className="text-gray-500 text-sm ml-24">
                            8 Days ago
                          </h2>
                        </div>
                        <span className="block text-sm text-gray-500">
                          Software Development
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-md p-6 border w-full">
                  <h1 className="text-orange-500 text-lg font-semibold">
                    2500
                  </h1>
                  <h2 className="text-base font-semibold text-gray-800 pt-2">
                    Total Employees
                  </h2>

                  <div className="mt-4">
                    <p className="text-gray-600">Men</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-300 h-2 rounded-xl">
                        <div
                          className="bg-blue-500 h-2"
                          style={{ width: `${menPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{men}</span>
                    </div>

                    <p className="text-gray-600 mt-2">Women</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-300 h-2 rounded-xl">
                        <div
                          className="bg-blue-500 h-2"
                          style={{ width: `${womenPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{women}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-8 flex-wrap">
                    <div className="flex flex-col items-center">
                      <h1>{menPercentage}%</h1>
                      <img
                        src="/men.jpeg"
                        className="rounded-full h-[60px] w-[60px]"
                        alt="Men"
                      />
                      <span className="text-sm text-gray-600 mt-1">Men</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <h1>{womenPercentage}%</h1>
                      <img
                        src="/women.jpeg"
                        className="rounded-full h-[60px] w-[60px]"
                        alt="Women"
                      />
                      <span className="text-sm text-gray-600 mt-1">Women</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === "directory" ? (
          <div className="text-gray-700  mx-4">
            <div className="flex flex-wrap gap-4 justify-end">
              <button className="text-blue-500 text-sm flex items-center gap-1">
                <FaArrowUp className="mt-1" /> Export
              </button>
              <button className="text-blue-500 text-sm flex items-center gap-1">
                <TfiEmail className="mt-1" /> mail
              </button>
              <h1 className="font-semibold text-sm flex items-center ">
                Number Of Employees:{" "}
                <span className="text-blue-500 ml-1">
                  {filteredEmployees.length}
                </span>
              </h1>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {/* Search Input */}
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={handleInputChange}
                  className="pl-10 pr-8 py-1 border rounded-md w-full"
                />
                {search && (
                  <MdOutlineDeleteForever
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                  />
                )}
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handlefilterClick}
                  className="pl-8 pr-2 py-1 border rounded-md whitespace-nowrap"
                >
                  Advance Filter
                </button>
                <button
                  className="pl-2 text-sm whitespace-nowrap"
                  onClick={handleClearAllFilters}
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Custom dropdowns and column chooser */}
            <div className="flex flex-wrap items-center gap-6 mt-6">
              <h1 className="text-sm text-blue-400 font-semibold whitespace-nowrap">
                No of Employees Selected:{" "}
                <span className="text-red-500">{selectedRowsCount}</span>
              </h1>

              <h2 className="flex items-center gap-x-2 relative z-40 whitespace-nowrap">
                Location:
                <Dropdown
                  options={locationOptions}
                  onChange={handleLocationChange}
                  value={selectedLocation}
                  placeholder={"All Location"}
                />
              </h2>

              <h2 className="flex items-center gap-x-2 relative z-40 whitespace-nowrap">
                Department:
                <Dropdown
                  options={departmentOptions}
                  onChange={handleDepartmentChange}
                  value={selectedDepartment}
                  placeholder={"All Department"}
                />
              </h2>

              <h2 className="flex items-center gap-x-2 relative z-40 whitespace-nowrap">
                Employee Status:
                <Dropdown
                  options={statusOptions}
                  onChange={handleStatusChange}
                  value={selectedStatus}
                  placeholder={"All Status"}
                />
              </h2>

              <div className="relative inline-block mt-0">
                <h2
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center gap-x-2 border cursor-pointer select-none"
                >
                  <IoReorderThreeOutline /> Choose Columns
                </h2>

                {showDropdown && (
                  <div className="absolute z-10 right-0 mt-2 border rounded p-2 bg-white shadow-md w-44 max-h-56 overflow-y-auto">
                    <div className="flex items-center gap-x-2 font-semibold mb-1">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                      <label htmlFor="selectAll">Select All</label>
                    </div>
                    <div>
                      {columns.map((col) => (
                        <div key={col.id} className="flex items-center gap-x-2">
                          <input
                            type="checkbox"
                            id={col.id}
                            checked={selectedColumns.includes(col.id)}
                            onChange={() => handleCheckboxChange(col.id)}
                          />
                          <label htmlFor={col.id}>{col.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="mt-4 overflow-x-auto">
              <DataTable
                columns={filteredColumns}
                data={filteredEmployees}
                pagination
                customStyles={customStyles}
                selectableRows
                highlightOnHover
                onSelectedRowsChange={handleRowSelected}
              />
            </div>
          </div>
        ) : activeTab === "confirmation" ? (
          <EmployeeConfirmation />
        ) : activeTab === "organization" ? (
          <>gfds</>
        ) : null}
        {isEmployeepopup && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[565px] shadow-lg rounded-md overflow-auto">
              <AddEmp closeEmployeepopup={closeEmployeepopup} />
            </div>
          </div>
        )}

        {isFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
            <div className="bg-white w-full max-w-4xl h-[450px] p-6 shadow-lg rounded-md overflow-auto">
              <h2 className="text-lg flex justify-between border-gray-300 font-medium text-[#353636]">
                Advance Search{" "}
                <button onClick={closeFilter} className="text-red-600">
                  {" "}
                  <MdOutlineCancel />
                </button>{" "}
              </h2>
              <div className="flex flex-col items-start gap-4">
                <div className="mt-4  w-full">
                  <input
                    type="text"
                    placeholder="include"
                    className="border border-gray-300 p-2 w-3/4 rounded-md"
                    value={includeField}
                    onChange={(e) => setincludeField(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="exclude"
                    className="border border-gray-300 p-2 w-3/4 rounded-md"
                    value={excludeField}
                    onChange={(e) => setExcludeField(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-lg flex border-gray-300 mt-6 font-medium text-[#353636]">
                  Additional Critiria
                </h1>
                <div className="h-24  overflow-y-auto">
                  {fields.map((field, index) => (
                    <div key={index} className="flex items-center gap-4 mt-4">
                      <Dropdown
                        options={optionCol}
                        onChange={(e) =>
                          handleFieldChange(index, "column", e.value)
                        }
                        value={field.column}
                        placeholder="Select a Field"
                      />
                      <Dropdown
                        options={inclusionOptions}
                        onChange={(e) =>
                          handleFieldChange(index, "inclusion", e.value)
                        }
                        value={field.inclusion}
                        placeholder="Select Inclusion"
                      />
                      <input
                        type="text"
                        placeholder="Type Your Field To Search"
                        className="border h-11 rounded-md border-gray-300 w-64 px-2"
                        value={field.value}
                        onChange={(e) =>
                          handleFieldChange(index, "value", e.target.value)
                        }
                      />
                      <button className="pl-4 text-red-500">Delete</button>
                    </div>
                  ))}
                </div>

                <button
                  className="text-blue-600 pt-4 pl-2"
                  onClick={handleAddField}
                >
                  {" "}
                  Add a Field to Search{" "}
                </button>
              </div>
              <div className="float-right mx-10 pt-4">
                <button
                  className="py-2 px-7 mr-5 rounded-md bg-gray-300  text-gray-600"
                  onClick={handleClearSearch}
                >
                  Clear All
                </button>
                <button
                  className="py-2 px-7 rounded-md bg-blue-400  text-white"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
        {isModalOpen && <Bulkadd closeModal={closeModal} />}
      </div>
    </div>
  );
}

export default Empdirectory;
