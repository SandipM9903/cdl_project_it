import React, { useState, useEffect } from "react";
import "react-dropdown/style.css";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import { Link } from "react-router-dom";
import Service from "./Service";
import { useLocalStorage } from "react-use";
import { BASE_URL } from "../../config/Config";

const ClaimsHome = () => {
  const currentYear = new Date().getFullYear();
  const options = [currentYear.toString(), (currentYear - 1).toString()];
  const [claims, setClaims] = useState([]);
  const [advClaims, setAdvClaims] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [expenseTotals, setExpenseTotals] = useState({
    approved: 0,
    claimed: 0,
    rejected: 0,
    pending: 0,
  });
  const [value, setValue] = useLocalStorage("expType", "exp");
  const [selectedSection, setSelectedSection] = useState("expense");
  const [filteredAdvClaims, setFilteredAdvClaims] = useState([]);
  const [advanceTotals, setAdvanceTotals] = useState({
    approved: 0,
    claimed: 0,
    rejected: 0,
    pending: 0,
  });
  const [overallStatusList, setOverallStatusList] = useState([]);
  //const empCode = 1023446;
  //const empCode = sessionStorage.getItem("UserId");
  const empCode = localStorage.getItem("empId");

  const fetchOverallStatus = (expenseType) => {
    axios
      .get(
        `${BASE_URL}:9028/api/workflow/getOverallClaimMainStatus/${empCode}/${expenseType}`
      )
      // Service.getOverallClaimMainStatus(empCode, expenseType)
      .then((res) => {
        console.log("API Response:", res.data);
        const statusMap = res.data.reduce((acc, item) => {
          const [wfSeqIdPart, overallStatusPart] =
            item.split(", overallStatus: ");
          const wfSeqId = wfSeqIdPart.split("wfSeqId: ")[1];
          const overallStatus = overallStatusPart.trim();
          acc[wfSeqId] = overallStatus;
          return acc;
        }, {});

        setOverallStatusList(statusMap);
        console.log("overall status map==", statusMap);
      })
      .catch((error) => {
        console.log(error);
        alert("Error fetching overall statuses");
      });
  };

  const fetchData = (apiUrl) => {
    return axios
      .get(apiUrl)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching data:", error);
        return []; // Return an empty array if there's an error
      });
  };

  useEffect(() => {
    const fetchAllData = () => {
      const conveyanceItemTableData = fetchData(
        `${BASE_URL}:9030/api/claims/getAllConveyanceItemData/${empCode}`
      );
      const miscellaneousItemTableData = fetchData(
        `${BASE_URL}:9030/api/claims/getAllmiscellaneousItemTableData/${empCode}`
      );
      const foodItemsTableData = fetchData(
        `${BASE_URL}:9030/api/claims/getAllFoodItemsData/${empCode}`
      );
      const mobileItemsTableData = fetchData(
        `${BASE_URL}:9030/api/claims/getAllMobileItemtableData/${empCode}`
      );
      const travelItemTableData = fetchData(
        `${BASE_URL}:9030/api/claims/getAllTravelItemTabledata/${empCode}`
      );

      // Wait for all promises to resolve and merge their results into a single array
      return Promise.all([
        conveyanceItemTableData,
        miscellaneousItemTableData,
        foodItemsTableData,
        mobileItemsTableData,
        travelItemTableData,
      ]).then((results) => results.flat()); // Merge the arrays
    };

    const fetchAdvData = () => {
      const rtaPromise = fetchData(
        `${BASE_URL}:9030/api/claims/getAllRtadata/${empCode}`
      );
      const iouPromise = fetchData(
        `${BASE_URL}:9030/api/claims/getAllIouData/${empCode}`
      );

      return Promise.all([rtaPromise, iouPromise]).then(
        ([rtaResult, iouResult]) => {
          setAdvClaims([...rtaResult, ...iouResult]);
        }
      );
    };
    console.log("advClaims ===>", advClaims);

    fetchAllData().then((mergedData) => {
      setClaims(mergedData);
    });

    fetchAllData().then((mergedData) => {
      console.log("Merged Data:", mergedData); // Debugging line
      setClaims(mergedData); // Update claims state with merged data
      const travelData = mergedData.find((item) => item.claimType); // Assuming travel data contains expenseType
      if (travelData) {
        fetchOverallStatus(travelData.claimType);
      } else {
        console.warn("No travel data with expenseType found");
      }
    });

    fetchAdvData();
  }, [empCode]);

  const handleDropdownChange = (event) => {
    const selectedYear = event.target.value;
    setSelectedYear(selectedYear);
  };

  const toggleSection = (section) => {
    setSelectedSection(section === selectedSection ? null : section);
  };

  useEffect(() => {
    const filterByYear = (claims, advClaims, year) => {
      const filteredClaims = claims.filter((claim) => {
        const claimYear = new Date(claim.createdDate).getFullYear().toString();
        return claimYear === year;
      });

      const filteredAdvClaims = advClaims.filter((advClaim) => {
        const advClaimYear = new Date(advClaim.createdDate)
          .getFullYear()
          .toString();
        return advClaimYear === year;
      });

      return { filteredClaims, filteredAdvClaims };
    };

    // Function to calculate expense totals
    const calculateExpenseTotals = (filteredClaims) => {
      console.log("filteredClaims===>", filteredClaims);
      const approved = filteredClaims.reduce(
        (total, claim) =>
          overallStatusList[claim.claimNum] === "Approved"
            ? claim.amount
            : total,
        0
      );
      const claimed = filteredClaims.reduce(
        (total, claim) =>
          overallStatusList[claim.claimNum] === "Claimed"
            ? total + claim.amount
            : total,
        0
      );
      const rejected = filteredClaims.reduce(
        (total, claim) =>
          overallStatusList[claim.claimNum] === "Rejected"
            ? total + claim.amount
            : total,
        0
      );
      const pending = filteredClaims.reduce(
        (total, claim) =>
          overallStatusList[claim.claimNum] === "Pending"
            ? total + claim.amount
            : total,
        0
      );
      setExpenseTotals({ approved, claimed, rejected, pending });
      console.log("total approved::::::" + approved);
      console.log("total pending::::::" + pending);
    };

    const calculateAdvanceTotals = (filteredAdvClaims) => {
      console.log("filteredAdvClaims===>", filteredAdvClaims);
      const approved = filteredAdvClaims.reduce(
        (total, advClaim) =>
          overallStatusList[advClaim.claimNum] === "Approved"
            ? total + advClaim.amount
            : total,
        0
      );
      const claimed = filteredAdvClaims.reduce(
        (total, advClaim) =>
          overallStatusList[advClaim.claimNum] === "Claimed"
            ? total + advClaim.amount
            : total,
        0
      );
      const rejected = filteredAdvClaims.reduce(
        (total, advClaim) =>
          overallStatusList[advClaim.claimNum] === "Rejected"
            ? total + advClaim.amount
            : total,
        0
      );
      const pending = filteredAdvClaims.reduce(
        (total, advClaim) =>
          overallStatusList[advClaim.claimNum] === "Pending"
            ? total + advClaim.amount
            : total,
        0
      );
      setAdvanceTotals({ approved, claimed, rejected, pending });
      console.log("total approved::::::" + approved);
      console.log("total pending::::::" + pending);
    };
    const { filteredClaims, filteredAdvClaims } = filterByYear(
      claims,
      advClaims,
      selectedYear
    );

    // Calculate the totals
    if (Object.keys(overallStatusList).length > 0) {
      calculateExpenseTotals(filteredClaims);
      calculateAdvanceTotals(filteredAdvClaims);
    }
  }, [claims, advClaims, selectedYear, overallStatusList]);

  return (
    <div className=" rounded-lg">
    <div className="w-full max-w-md p-2 bg-white border border-gray-200 rounded-lg shadow sm:p-4 dark:bg-white">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-sm font-bold leading-none text-gray-900 dark:text-black">
        Expense Reimbursement
        </h5>
        <div className='bg-green-400 rounded-[10px]  text-white hover:bg-green-200 transition delay-800'>
                    <Link to="/claimdashboard">
                        <button className="text-xs  px-2 py-1">View All</button>
                    </Link>
               </div>
      </div>
            <div className='flex mt-3 mb-3'>
                <div className='text-xs text-gray-600'>
                    <h3>Reimbursement for</h3>
                </div>
                <div className='flex ml-7 -mt-1 border'>
                        <select value={selectedYear} onChange={handleDropdownChange}>
                        {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                        </select>
                </div>
            </div>
            {/* <div className='flex justify-center mt-4'> */}
              <div className='flex md:text-med text-xs  text-gray-600 gap-2 border-b-[1px]'>           
                <div onClick={() => { setValue('exp');}} className={`cursor-pointer mr-4 ${value==='exp' ? 'text-blue-400 underline lg:underline-offset-4' : ''}`}>
                  My Expense
                </div>
                <div onClick={() => { setValue('adv');}} className={`cursor-pointer ${value === 'adv' ? 'text-blue-400 underline md:underline-offset-4' : ''}`}>
                  My Advance
                </div>
              </div>
            {/* </div> */}
            <div>
                <div className='flex space-x-8'>
                    <div className='pr-8'>
                        <div className=' mt-3 text-xs flex '>
                            <GoDotFill className='text-green-600 mt-1' />
                            <h5 className='text-gray-500'>Claimed</h5>   
                        </div>
                        {/* <p className=' ml-4 text-med font-semibold text-gray-800'>INR {expenseTotals.claimed}</p> */}
                        <p className=' ml-4 text-med font-semibold text-gray-800 text-xs'>INR {value === 'exp'  ? expenseTotals.claimed : advanceTotals.claimed}</p>
                        
                        <div className=' text-xs flex mt-2'>
                            <GoDotFill className='text-yellow-400 mt-1' />
                            <h5 className='text-gray-500'>Approved</h5>
                        </div>
                        {/* <p className='ml-4 text-med font-semibold text-gray-800'>INR {expenseTotals.approved}</p> */}
                        <p className=' ml-4 text-med font-semibold text-gray-800 text-xs'>INR {value === 'exp' ? expenseTotals.approved : advanceTotals.approved}</p>
                    </div>
                    <div className='border-l-[2px] border-gray-300 '>
                        <div className='ml-8 mt-3 text-xs flex'>
                            <GoDotFill className='text-red-600 mt-1' />
                            <h5 className='text-gray-500'>Un Claimed Amount</h5>
                        </div>
                        {/* <p className='ml-12 text-med font-semibold text-gray-800'>INR {expenseTotals.pending}</p> */}
                        <p className=' ml-12 text-med font-semibold text-gray-800 text-xs'>INR {value === 'exp' ? expenseTotals.pending : advanceTotals.pending}</p>
                    </div>   
                </div>
            </div>
        </div>
    </div>
  );
};

export default ClaimsHome;
