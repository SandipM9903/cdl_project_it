
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "react-dropdown/style.css";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { StyleSheetManager } from "styled-components";
import Service from "../Service";

import {
  useStoreEmpId,
  useStoreTabStatus,
} from "../GlobalStorage/ZustandStore";

import axios from "axios";
import { BASE_URL } from "../../config/Config";
const blueIconStyle = {
  color: "#40cd40",
  fontSize: "20px",
};
function Components({ empCode }) {
  const navigate = useNavigate();
  const [employeePerformance, setEmployeePerformance] = useState([]);
  console.log(employeePerformance, "employeePerformance....9999999999.");
  console.log(
    employeePerformance?.approvedOn,
    "employeePerformance?.approvedOn....."
  );
  const [profileInfo, setProfileInfo] = useState({});
  const date = new Date();
  const Year = date.getFullYear();
  const currentYear = Year.toString();
  const currentYearRange = Year.toString() + "-" + (Year + 1).toString();
  const [year, setYear] = useState(currentYear);
  const [reviewCycle, setReviewCycle] = useState(currentYearRange);
  const [reviewCycleOptions, setReviewCycleOptions] = useState([
    currentYearRange,
  ]);
  const [years, setYears] = useState([]);
  const options1 = years;
  const yearIndex = options1.indexOf(currentYear);
  const defaultOption1 = options1[yearIndex];

  const generateReviewCycleOptions = (years) => {
    const nextYears = parseInt(years) + 1;
    return [`${years}-${nextYears}`];
  };

  const { setEmpId } = useStoreEmpId();

  // useEffect(() => {
  //   setEmpId(empId);
  // }, [empId]);

  const { setTabStatus } = useStoreTabStatus();

  console.warn(
    employeePerformance?.approvedOn !== undefined,
    "000000000000000000000000000000++"
  );

  useEffect(() => {
    if (employeePerformance?.approvedOn !== undefined) {
      setTabStatus("two");
    }
  }, []);

  // if(employeePerformance?.approvedOn.length!==0){
  //   setTabStatus("two");
  // }

  const [reviewCycles, setReviewCycles] = useState([]);
 

  useEffect(() => {
    axios
      .get(`${BASE_URL}:9031/api/getAllReviewCycle`)
      .then((res) => {
        if (Array.isArray(res?.data)) {
          setReviewCycles(res.data); // Directly set review cycles
        } else {
          console.error("Invalid data format:", res?.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching review cycles:", err);
      });
  }, []);

  console.log(years, "years");

  console.log(reviewCycle, "reviewCycle>>>>>>>>>>>>>");
  console.log(reviewCycles, "666");

  useEffect(() => {
    // const empId = 1;
    if (reviewCycle) {
      console.log(year, reviewCycle);
      // Service.getByYearAndReviewCycle(empId,year,reviewCycle)
      Service.getByReviewCycle(empCode, reviewCycle)
        .then((res) => {
          setEmployeePerformance(res.data);
          console.log(res.data, "resresresresres");
        })
        .catch((error) => {
          toast.info("Data not found for " + reviewCycle);
        });
    }
  }, [reviewCycle]);

  const handleSelect2 = (selectedOption) => {
    setReviewCycle(selectedOption.value);
  };

  const columns = [
    {
      name: "Appraisal Cycle",
      selector: (row) => {
        if (row.appraisalCycle === "Quarter 1") {
          return "Quarter 1";
        } else if (row.appraisalCycle === "Quarter 2") {
          return "Quarter 2";
        } else if (row.appraisalCycle === "Quarter 3") {
          return "Quarter 3";
        } else if (row.appraisalCycle === "Quarter 4") {
          return "Quarter 4";
        }
      },
      font: "bold",
      conditionalCellStyles: [
        {
          when: (row) => row.submittedOn === null,
          style: { color: "#6dadd3" },
        },
      ],
    },
    {
      name: " Submitted for Approval",
      cell: (row) =>
        row.submittedOn !== null ? <FaCheck style={blueIconStyle} /> : "",
    },
    {
      name: " Submitted On",
      selector: (row) => row.submittedOn,
    },
    {
      name: "Manager Approval",
      cell: (row) =>
        row.approvedOn !== null ? <FaCheck style={blueIconStyle} /> : "",
    },
    {
      name: " Approved on",
      selector: (row) => row.approvedOn,
    },
    {
      name: " self review",
      cell: (row) =>
        row.submittedOnn !== null ? <FaCheck style={blueIconStyle} /> : "",
    },
    {
      name: " Submitted On",
      selector: (row) => row.submittedOnn,
    },
    {
      name: "Manager",
      selector: (row) => row.manager,
      conditionalCellStyles: [
        {
          when: (row) => row.submittedOn === null,
          style: { color: "#6dadd3" },
        },
      ],
      cell: (row) => {
        if (row.manager === "Mathimaran.P") {
          return (
            <button to="/managerView" onClick={() => renderMV(row.manager)}>
              {profileInfo.mgrName}
            </button>
          );
        } else {
          return row.manager;
        }
      },
    },
    {
      name: " Manager Review  ",
      cell: (row) =>
        row.reviewedOnn !== null ? <FaCheck style={blueIconStyle} /> : "",
    },
    {
      name: " Reviewed On ",
      selector: (row) => row.reviewedOnn,
    },
    {
      name: "current Status",
      selector: (row) => row.currentStatus,
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.submittedOn === null,
          style: { color: "#6dadd3" },
        },
      ],
      cell: (row) => {
        // if (row.currentStatus === "Open" || row.currentStatus === "Save As Draft" || row.currentStatus === "Submitted To Manager" || row.currentStatus === "Reverted" ) {
        //   return (
        //     <button onClick={() => render(row)}>
        //       {row.currentStatus === "Open" ? "Open" : row.currentStatus === "Save As Draft" ? "Save As Draft" : row.currentStatus === "Submitted To Manager" ? "Submitted To Manager": "Reverted"}
        //     </button>
        //   );
        if (
          row.currentStatus === "Open" ||
          row.currentStatus === "Save As Draft" ||
          row.currentStatus === "Submitted To Manager" ||
          row.currentStatus === "Submitted" ||
          row.currentStatus === "Approved" ||
          row.currentStatus === "Reverted" ||
          row.currentStatus === "Disable"
        ) {
          return (
            <button onClick={() => render(row)}>
              {row.currentStatus === "Open"
                ? "Open"
                : row.currentStatus === "Save As Draft"
                ? "Save As Draft"
                : row.currentStatus === "Submitted To Manager"
                ? "Submitted To Manager"
                : row.currentStatus === "Approved"
                ? "Approved"
                : row.currentStatus === "Reverted"
                ? "Reverted"
                : row.currentStatus === "Disable"
                ? "Disable"
                : "Submitted"}
            </button>
          );
        } else {
          return <>{row.currentStatus}</>;
        }
      },
    },

    {
      name: "status",
      selector: (row) => row.status,
      style: { minWidth: "120px", maxWidth: "200px" },
      center: true,
      cell: (row) => {
        if (!row.submittedOn) {
          return (
            <div className="text-sm ml-2">
              <button
                style={{
                  backgroundColor: "gray",
                  padding: "6px",
                  fontWeight: "bold",
                  color: "white",
                  borderRadius: "5px",
                  width: "120px",
                  textAlign: "center",
                }}
                className="text-gray-500"
              >
                No Due Date
              </button>
            </div>
          );
        }
        const requestedDate = new Date(row.submittedOn);
        const approvedDate = row.approvedOn ? new Date(row.approvedOn) : null;
        const currentDate = new Date();

        // Use approvedDate if it exists, otherwise fall back to requestedDate
        const effectiveDate = approvedDate || requestedDate;

        const timeDiff = Math.abs(
          currentDate.getTime() - effectiveDate.getTime()
        );
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        console.log(reviewCycles, "44");
        return (
          <div className="text-sm ml-2">
            <button
              style={{
                backgroundColor: "gray",
                padding: "6px",
                fontWeight: "bold",
                color: "white",
                borderRadius: "5px",
                width: "120px",
                textAlign: "center",
              }}
              className="text-gray-500"
            >
              Due in {diffDays} Days
            </button>
          </div>
        );
      },
    },
  ];
  const newStyle = {
    headCells: {
      style: {
        fontSize: "12px",
        fontWeight: "700",
      },
    },
  };
  const render = (row) => {
    console.log(row, "row");
    navigate("/open", { state: { data: row } });
  };
  const renderMV = (row) => {
    navigate("/managerView", { state: { data: row } });
  };
  return (
    <div style={{ backgroundColor: "#DCDCDC", padding: "10px" }}>
      <Card sx={{ borderRadius: "20px" }}>
        <CardContent>
          <StyleSheetManager
            shouldForwardProp={(prop) => prop !== "sortActive"}
          >
            <div className="ml-5 mt-1">
              <div className="flex flex-col space-y-5 items-center sm:flex-row sm:space-x-28 sm:items-center">
                {/* <div>
                <h1 className='font-bold text-lg mt-[-5px]'>Year</h1>
            </div> */}
                {/* <div className='w-full sm:w-1/6 font-bold'>
            <Dropdown
                    options={options1}
                    onChange={handleSelect1}
                    value={year || defaultOption1}
                    placeholder="Select an option"
                  />
            </div> */}
              </div>
              <div className="flex flex-col space-y-5 items-center mt-1 sm:flex-row sm:space-x-12 sm:mt-0">
                <div>
                  <h1 className="font-bold text-lg mt-[20px]">Financial Year</h1>
                </div>
                <div className="w-full sm:w-1/6 font-bold">
                  {/* <Dropdown
                    options={reviewCycleOptions}
                    onChange={handleSelect2}
                    value={reviewCycle}
                    placeholder="Select an option"
                  /> */}
                  {/* <div className="w-full sm:w-1/6 font-bold">
                    <Dropdown
                      options={reviewCycles.map((cycle) => ({
                        label: cycle,
                        value: cycle,
                      }))}
                      onChange={(selectedOption) =>
                        setReviewCycle(selectedOption.value)
                      }
                      value={reviewCycle}
                      placeholder="Select Financial Year"
                    />
                  </div> */}

                  <div className="w-full  font-bold">
                    <select
                      className="w-full border rounded px-3 py-2 bg-white"
                      value={reviewCycle}
                      onChange={(e) => setReviewCycle(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Financial Year
                      </option>
                      {reviewCycles.map((cycle) => (
                        <option key={cycle} value={cycle}>
                          {cycle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <DataTable
              data={employeePerformance}
              data-testid="comp"
              columns={columns}
              responsive
              customStyles={newStyle}
            />
          </StyleSheetManager>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
}
export default Components;
