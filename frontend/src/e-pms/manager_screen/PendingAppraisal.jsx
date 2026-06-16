import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useNavigate } from "react-router-dom";
import { useStore } from "../GlobalStorage/ZustandStore";
import Service from "../Service";

function PendingAppraisal() {
  const navigate = useNavigate();
  const [appraisal, setAppraisal] = useState([]);

  console.warn(
    appraisal,
    "appraisal//////////////////////////////=++++++++++++++++++++"
  );
  const handleActiveClick = (row) => {
    if (row.status === "Active") {
      move(row);
    }
  };

  const move = (row) => {
    navigate("/ManagerScreen2", { state: { data: row } });
  };

  const date = new Date();
  const Year = date.getFullYear();
  const currentYear = Year.toString();
  const currentYearRange = Year.toString() + "-" + (Year + 1).toString();
  const [reviewCycle, setReviewCycle] = useState(currentYearRange);
  const [reviewCycleOptions, setReviewCycleOptions] = useState([
    currentYearRange,
  ]);
  const generateReviewCycleOptions = (year) => {
    const nextYear = parseInt(year) + 1;
    return [`${year}-${nextYear}`];
  };
  const options2 = ["2023-2024", "2024-2025", "2025-2026"];
  const yearIndex = options2.indexOf(currentYearRange);
  const defaultOption1 = options2[yearIndex];

  console.log(reviewCycleOptions, "reviewCycleOptions...//");

  useEffect(() => {
    const initialReviewCycleOptions = generateReviewCycleOptions(currentYear);
    setReviewCycleOptions(initialReviewCycleOptions);
    setReviewCycle(initialReviewCycleOptions[0]);
  }, [currentYear]);

  const setData = useStore((state) => state.setData);

  const handleSetReviewCycleData = () => {
    setData({ a: reviewCycle });
    console.log("hello 123###############################");
  };

  const empId = 1;

  useEffect(() => {
    if (reviewCycle) {
      console.log(reviewCycle, "<<<<<<<<<<<<<<<<<<<<<<<<");
      Service.getPendingAppraisal(reviewCycle).then((res) => {
        setAppraisal(res?.data?.data);
        console.log(res.data, "<<<<<<<<<<<<<<<<<<");
      });
    }
  }, [reviewCycle]);

  console.log();
  const handleSelect = (selectedOption) => {
    setReviewCycle(selectedOption.value);
  };

  console.log(appraisal, ">>>>>>>>>>>>>>>>>>");

  const header = [
    {
      name: <strong>Appraisal Cycle</strong>,
      cell: (row) => (
        <div className="flex-row mt-6 mb-4">
          <h1
            style={{ color: row.status === "Active" ? "#6dadd3" : "inherit" }}
          >
            <strong>{row.appraisalQuarter}</strong>
          </h1>
          <div className="flex">
            <h1>{row.periodFrom}</h1>
            <h1>{row.periodTo}</h1>
          </div>
        </div>
      ),
    },
    {
      name: <strong>Status</strong>,
      selector: (row) => row.status,

      conditionalCellStyles: [
        {
          when: (row) => row.status === "Active",
          style: { color: "#6dadd3" },
        },
      ],
      cell: (row) => {
        if (row.status === "Active" || row.status === "Completed") {
          return (
            <button
              onClick={() => {
                handleActiveClick(row);
                handleSetReviewCycleData();
              }}
              style={{ color: row.status === "Active" ? "#6dadd3" : "inherit" }}
            >
              <strong>{row.status}</strong>
            </button>
          );
        } else {
          return <strong>{row.status}</strong>;
        }
      },
    },
  ];

  const customStyles = {
    header: {
      style: {
        fontSize: "14px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
      },
    },
  };

  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem("role")) || [];
  } catch (e) {
    console.error("Error parsing roles from sessionStorage:", e);
  }

  // Function to check if the user has a specific role
  const hasRole = (role) => roles.includes(role);

  return (
    <>
      <div className="">
        {/* Employee-specific navigation */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-full">
          <div className="bg-white-300 mt-10">
            <div style={{ backgroundColor: "#DCDCDC", padding: "10px" }}>
              <Card sx={{ borderRadius: "20px" }}>
                <CardContent>
                  <div className="flex flex-col space-y-5 items-center mt-1 sm:flex-row sm:space-x-12 sm:mt-0">
                    <div>
                      <h1 className="font-bold text-lg mt-[25px] ml-4">
                        Financial Year
                      </h1>
                    </div>
                    <div className="w-full sm:w-1/6 font-bold">
                      <Dropdown
                        options={options2}
                        onChange={handleSelect}
                        value={defaultOption1}
                        placeholder="Select an option"
                      />
                    </div>
                  </div>
                  <DataTable
                    columns={header}
                    data={appraisal}
                    customStyles={customStyles}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default PendingAppraisal;
