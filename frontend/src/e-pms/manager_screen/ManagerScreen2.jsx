
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CiFilter } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import { useStoreEmpId, useStoreSID } from "../GlobalStorage/ZustandStore";

import { ToastContainer } from "react-toastify";
import { BASE_URL } from "../../config/Config";

function ManagerScreen2() {
  const [value, setValue] = useState([]);
  const [filter, setFilter] = useState(false);
  const [filterType, setFilterType] = useState(1); // Default to "All"
  const [empDetails, setEmpDetails] = useState([]);
  const [employeesDetailsList, setEmployeesDetailsList] = useState([]);
  const [completeEmployeeStatus, setCompleteEmployeeStatus] = useState([]);

  const location = useLocation();
  console.warn(location, "locationlllllllllllllllllllll");

  const pendingScreenInfo = location?.state?.data;
  console.log(pendingScreenInfo, "quarterInfo1@@@@@@@@@2");

  const { setEmpId } = useStoreEmpId();
  const { setSID } = useStoreSID();

  const navigate = useNavigate();

  // const managerId = sessionStorage.getItem("managerId");

  // console.log("managherdnjvnjd", managerId);

  // const { mgrId } = useStoreManagerId();

  const mgrId = localStorage.getItem("empId");

  console.log(mgrId, "mgrId..... +mgrId");

  // const {empId}=useStoreEmpId();

  //9085389

  useEffect(() => {
    // Fetch employee data from the API
    const fetchAllEmployeeFromEmployeeService = async () => {
      try {
   

        const res = await axios.get(
          `${BASE_URL}:9020/employee/report/to/${mgrId}`
        );
        setEmpDetails(res?.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllEmployeeFromEmployeeService();
  }, []);

  console.log(empDetails, "empDetails11111!!!!");

  useEffect(() => {
  if (!empDetails || empDetails.length === 0) return;

  // Step 1: Transform empDetails
  const newEmployeesList = empDetails.map((i) => {
    const { fileAndObjectTypeBean } = i;

    const empId = fileAndObjectTypeBean?.empResDTO?.empId;
    const empCode = fileAndObjectTypeBean?.empResDTO?.empCode;
    const fullName = fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar;
    const designation = fileAndObjectTypeBean?.empResDTO?.designationResDTO?.designationName;
    const experience = fileAndObjectTypeBean?.empResDTO?.expWithCurrentCompany;

    return {
      empId,
      employeeCode: empCode,
      fullName,
      designation,
      experience,
      submittedOn: null,     // Placeholder values
      submittedOnn: null,
      approvedOn: null,
      reviewedOnn: null,
    };
  });

  setEmployeesDetailsList(newEmployeesList); // Set the list

  // Step 2: Send data to API
  axios
    .post(
      `${BASE_URL}:9031/api/getAllEmployeeDetailsAndStatus`,
      newEmployeesList
    )
    .then((res) => {
      const filteredList = res?.data?.data?.filter((item) =>
        Object.values(item).some((value) => value !== null)
      );

      console.log(filteredList, "Filtered employee status");

      setCompleteEmployeeStatus(filteredList || []);
    })
    .catch((err) => {
      console.error("Error fetching employee status:", err);
    });

}, [empDetails]);


  console.dir(completeEmployeeStatus[2], "ppppppppppppppppppppppppp");

  console.dir(
    completeEmployeeStatus,
    { depth: null },
    "uyyyyyyyyyyyyyyyyyyrrrrrrruuuuuuuuuu"
  );

  // =======================================================================================
  // Filter function
  const getFilteredData = () => {
    if (filterType === 2) {
      // Pending with Employee: Filter rows where `submittedOn` or `submittedOnn` is `null`
      return completeEmployeeStatus.filter(
        (row) => !row.submittedOn || !row.submittedOnn
      );
    } else if (filterType === 3) {
      // Pending with Manager: Filter rows where `approvedOn` or `reviewedOnn` is `null`
      return completeEmployeeStatus.filter(
        (row) => !row.approvedOn || !row.reviewedOnn
      );
    }
    // All: Show rows with pending status in any column
    return completeEmployeeStatus.filter(
      (row) =>
        !row.submittedOn ||
        !row.submittedOnn ||
        !row.approvedOn ||
        !row.reviewedOnn
    );
  };

  const handlePendingClick1 = (row) => {
    setEmpId(row?.empId);

    console.log(row?.empId, "row?.empId");
    axios
      .get(`${BASE_URL}:9031/api/getUniqueEmployeeStatus/${row?.empId}`)
      .then((res) => {
        setSID(res?.data?.employeeStatusId);
      })
      .catch(() => {
        // toast.warn("querter details is new");
      });

    console.log("row///", row);
  };

  // =================================================================================================

  const columns = [
    {
      name: (
        <div className="text-sm font-medium text-black ml-16">Employee</div>
      ),
      minWidth: "100px",
      cell: (row) => (
        <div
          className="flex mb-2 hover:cursor-pointer"
          onClick={() => handleNavigate(row)}
        >
          <img
            src={require("../profille.jpg")}
            className="rounded-full h-[34px] w-[36px] ml-6 mt-4"
            alt="Profile"
          />
          <div>
            <h1 className="text-sm font-normal text-black pl-4 pt-2">
              <span className="text-blue-600 font-medium">
                {row.employeeCode}
              </span>{" "}
              -{" "}
              <span className="text-blue-600 font-medium">{row?.fullName}</span>
            </h1>
            <div className="ml-12">
              <h3 className="text-sm text-gray-500 -ml-8">{row.designation}</h3>
              <h3 className="text-m text-gray-500 -ml-8">{row.experience}</h3>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: (
        <div className="text-sm font-medium text-black ml-4">
          Employee Submit
        </div>
      ),
      maxWidth: "200px",
      cell: (row) => (
        <div className="text-sm ml-4">
          <span className="text-green-600">
            {row.submittedOn ? "Submitted" : "Pending"}
          </span>
        </div>
      ),
    },
    // {
    //   name: (
    //     <div className="text-sm font-medium text-black ml-4">
    //       Manager Approval
    //     </div>
    //   ),
    //   maxWidth: "200px",
    //   cell: (row) => (
    //     <div className="text-sm ml-4">
    //       {row.approvedOn ? (
    //         <span className="text-gray-600">Submitted</span>
    //       ) : (
    //         <span
    //           className="text-red-500 underline cursor-pointer"
    //           onClick={() =>
    //             navigate("/managerView", {
    //               state: { empCode: row },
    //             })
    //           }
    //         >
    //           Pending
    //         </span>
    //       )}
    //     </div>
    //   ),
    // },

    {
      name: (
        <div className="text-sm font-medium text-black ml-4">
          Manager Approval
        </div>
      ),
      maxWidth: "200px",
      cell: (row) => {
        const handlePendingClick = (row) => {
          // Print the row data
          console.log(row, "Row Info");

          // Navigate with the row data
          navigate("/managerView", {
            state: { empCode: { ...row, ...pendingScreenInfo } },
          });
        };

        return (
          <div className="text-sm ml-4">
            {row.approvedOn ? (
              <span className="text-gray-600">Submitted</span>
            ) : (
              <span
                className="text-blue-600 underline cursor-pointer"
                onClick={() => {
                  handlePendingClick(row);
                  handlePendingClick1(row);
                }}
              >
                Pending
              </span>
            )}
          </div>
        );
      },
    },
    {
      name: (
        <div className="text-sm font-medium text-black ml-4">
          Self Assessment
        </div>
      ),
      maxWidth: "200px",
      cell: (row) => (
        <div className="text-sm ml-4">
          <span className="text-blue-600">
            {row.submittedOnn ? "Submitted" : "Pending"}
          </span>
        </div>
      ),
    },
    // {
    //   name: (
    //     <div className="text-sm font-medium text-black ml-4">
    //       Manager Assessment
    //     </div>
    //   ),
    //   maxWidth: "235px",
    //   cell: (row) => (
    //     <div className="text-sm ml-4">
    //       <span className="text-gray-600">
    //         {row.reviewedOnn ? "Submitted" : "Pending"}
    //       </span>
    //     </div>
    //   ),
    // },

    {
      name: (
        <div className="text-sm font-medium text-black ml-4">
          Manager Assessment
        </div>
      ),
      maxWidth: "235px",
      cell: (row) => (
        <div className="text-sm ml-4">
          {row.reviewedOnn ? (
            <span className="text-green-600">Submitted</span>
          ) : (
            <span
              className="text-blue-600 underline cursor-pointer"
              onClick={() =>
                navigate("/ManagerScreen", {
                  state: { empCode: { ...row, ...pendingScreenInfo } },
                })
              }
            >
              Pending
            </span>
          )}
        </div>
      ),
    },
  ];

  const handleNavigate = (row) => {
    navigate("/managerView", { state: { data: row } });
  };

  const handleClick = () => setFilter(!filter);
  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem("role")) || [];
  } catch (e) {
    console.error("Error parsing roles from sessionStorage:", e);
  }

  // Function to check if the user has a specific role
  const hasRole = (role) => roles.includes(role);

  console.log(completeEmployeeStatus, "completeEmployeeStatus^^^");

  return (
    <div className="">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-full">
        <div className="bg-white-300 mt-5">
          <div className="w-full h-screen bg-gray-200">
            <div className="bg-white rounded-md relative top-12 ml-4 mr-3 border-[1px] border-blue-400 pb-24">
              <div className="flex justify-between">
                <h1 className="text-[22px] font-medium text-black pl-12 pt-12">
                  Team
                </h1>
                <div className="mt-12 ml-[460px] text-4xl text-black mr-10">
                  <CiFilter onClick={handleClick} />
                </div>
                {filter && (
                  <div className="absolute ml-[1200px] mt-24 z-50">
                    <div className="border-[2px] border-black bg-gray-100 -ml-24 pb-12 rounded-md">
                      <MenuItem
                        value={1}
                        onClick={() => {
                          setFilterType(1);
                          setFilter(false);
                        }}
                      >
                        All
                      </MenuItem>
                      <MenuItem
                        value={2}
                        onClick={() => {
                          setFilterType(2);
                          setFilter(false);
                        }}
                      >
                        Pending with Employee
                      </MenuItem>
                      <MenuItem
                        value={3}
                        onClick={() => {
                          setFilterType(3);
                          setFilter(false);
                        }}
                      >
                        Pending with Manager
                      </MenuItem>
                    </div>
                  </div>
                )}
              </div>
              <DataTable
                className="mt-10"
                columns={columns}
                data={getFilteredData()} // Pass filtered data
                // data={
                //   completeEmployeeStatus?.length !== 0
                //     ? completeEmployeeStatus
                //     : []
                // }
                selectableRows
                highlightOnHover
                striped
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ManagerScreen2;