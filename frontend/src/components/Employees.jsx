import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Header from "./Header";
import { BASE_URL } from "../config/Config";
import debounce from 'lodash/debounce';

const Employees = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(200);
  const [filterOption, setFilterOption] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const fallbackImageUrl = "https://militaryhealthinstitute.org/wp-content/uploads/sites/37/2021/08/blank-profile-picture-png.png";
  const navigate = useNavigate();
  const locationId = sessionStorage.getItem("locationId")

  useEffect(() => {
    if (filterOption === 'location') {
      fetchLocationBasedEmployees(locationId, currentPage);
    }
    else {
      fetchEmployeeData(currentPage);
    }
  }, [currentPage]);

  const fetchEmployeeData = (pageNumber = 0) => {
    setSearchActive(false);
    setEmployeeData([]);
    setFilterOption("");
    axios
      .get(`${BASE_URL}:9020/employee/getAll/${pageNumber}`)
      .then((response) => {
        const employees = response.data;
        const employeeDataWithImages = employees.map((employee) => {
          const empResDTO = employee.empResDTO;
          let fileUrl = fallbackImageUrl;
          if (employee && employee.fileAndContentTypeBean) {
            const { file, contentType } = employee.fileAndContentTypeBean;
            if (file && contentType) {
              const byteArray = new Uint8Array(atob(file).split("").map((c) => c.charCodeAt(0)));
              const blob = new Blob([byteArray], { type: contentType });
              fileUrl = URL.createObjectURL(blob);
            }
          }
          return { ...empResDTO, fileUrl };
        });
        setEmployeeData(employeeDataWithImages);
      })
      .catch((error) => console.log("API Error:", error));
  };

  const fetchSearchData = async (data) => {
    setSearchActive(true);
    setEmployeeData([])
    try {
      const response = await axios.get(`${BASE_URL}:9020/employee/search/${data}`);
      const employees = response.data;
      const employeeDataWithImages = employees.map((employee) => {
        const empResDTO = employee.empResDTO;
        let fileUrl = fallbackImageUrl;
        if (employee && employee.fileAndContentTypeBean) {
          const { file, contentType } = employee.fileAndContentTypeBean;
          if (file && contentType) {
            const byteArray = new Uint8Array(atob(file).split("").map((c) => c.charCodeAt(0)));
            const blob = new Blob([byteArray], { type: contentType });
            fileUrl = URL.createObjectURL(blob);
          }
        }
        return { ...empResDTO, fileUrl };
      });
      setEmployeeData(employeeDataWithImages);
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchSearchData, 1000), []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() !== '') {
      debouncedFetch(value);
    }
  };

  const handleSort = (event) => {
    setSortOption(event.target.value);
  };

  const getFilteredEmployees = () => {
    let employees = [...employeeData];

    if (filterOption === "location") {
      return employees;
    }

    if (searchQuery && !searchActive) {
      employees = employees.filter((employee) =>
        employee.fullNameAsAadhaar?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption) {
      employees.sort((a, b) => {
        if (sortOption === "firstName") {
          return a.firstName?.localeCompare(b.firstName);
        } else if (sortOption === "lastName") {
          return a.lastName?.localeCompare(b.lastName);
        }
        return 0;
      });
    }

    return employees;
  };

  const filteredEmployees = useMemo(() => getFilteredEmployees(), [employeeData, searchQuery, sortOption, filterOption]);
  console.log(filteredEmployees);

  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem("role")) || [];
  } catch (e) {
    console.error("Error parsing roles from sessionStorage:", e);
  }

  const hasRole = (role) => roles.includes(role);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleEmployeeClick = (email) => {
    navigate(`/employee/${email}`);
  };

  const handleFilterChange = async (event) => {
    const value = event.target.value;
    setFilterOption(value);

    if (value === "location") {
      try {
        setSearchActive(false);
        await fetchLocationBasedEmployees(locationId, currentPage);
        setSortOption("");
        setSearchQuery("");
        setCurrentPage(0);
      } catch (err) {
        console.error("Failed to fetch location-based employees:", err);
      }
    } else {
      fetchEmployeeData(0);
    }
  };

  const fetchLocationBasedEmployees = (locationId, currentPage) => {
    setSearchActive(false);
    setEmployeeData([]);
    axios.get(`${BASE_URL}:9020/employee/loc/based/${locationId}/${currentPage}`).then((response) => {
      const employees = response.data;
      const employeeDataWithImages = employees.map((employee) => {
        const empResDTO = employee.fileAndObjectTypeBean.empResDTO;
        let fileUrl = fallbackImageUrl;
        if (employee && employee.fileAndContentTypeBean) {
          const { file, contentType } = employee.fileAndContentTypeBean;
          if (file && contentType) {
            const byteArray = new Uint8Array(atob(file).split("").map((c) => c.charCodeAt(0)));
            const blob = new Blob([byteArray], { type: contentType });
            fileUrl = URL.createObjectURL(blob);
          }
        }
        return { ...empResDTO, fileUrl };
      });
      setEmployeeData(employeeDataWithImages);
      setSearchQuery("");
    }).catch((err) => {
      alert(err);
    });
  };

  return (
    <div className="flex bg-slate-100">
      <Header />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full h-screen">
        <div className=" bg-white-300 p-5 mt-20">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-1/2">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-3 pl-10 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow focus:outline-none focus:border-blue-500"
                placeholder="Search employees by name..."
              />
            </div>

            <div className="flex gap-4">
              <select
                value={filterOption}
                onChange={handleFilterChange}
                className="p-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow focus:outline-none focus:border-blue-500"
              >
                <option value="">Filter by Department</option>
                <option value="location">Location</option>
              </select>
              <select
                value={sortOption}
                onChange={handleSort}
                className="p-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow focus:outline-none focus:border-blue-500"
              >
                <option value="">Sort by</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out"
                  onClick={() => handleEmployeeClick(employee.emailId)}
                >
                  <img
                    src={employee.fileUrl || fallbackImageUrl}
                    alt={employee.firstName}
                    className="w-full h-40 object-contain text-red-700"
                  />
                  <div className="p-4">
                    <h2 className="text-xs font-semibold text-red-700">{employee.fullNameAsAadhaar}</h2>
                    <p className="text-gray-600 mt-2 text-xs text-black">{employee.designationResDTO?.designationName}</p>
                    <a
                      href={`mailto:${employee.emailId}`}
                      className="text-blue-500 mt-2 text-xs block"
                    >
                      {employee.emailId}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-6">No employees found</p>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className={`p-3 rounded-lg ${currentPage === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            >
              Previous
            </button>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`p-3 rounded-lg ${currentPage >= totalPages - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;