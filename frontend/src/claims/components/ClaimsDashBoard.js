//==============merge code============12/07/20204

import React, { useEffect, useState } from "react";
import "react-dropdown/style.css";
import { FiUpload } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { format } from "date-fns"; // Import the format function
import AddAdvance from "./AddAdvance";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { useLocalStorage } from "react-use";
import * as XLSX from "xlsx";
import AddClaims from "./AddClaims";
import { CiSearch } from "react-icons/ci";
import Service from "./Service";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./custom-tabs.css";
import { useStore1, useStore2, useStore3 } from "./ClaimStore";
import { BsPrinter } from "react-icons/bs";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { BASE_URL } from "../../config/Config";

// import { FaFileAlt } from "react-icons/fa";

const ClaimsDashBoard = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [filteredDraftClaims, setFilteredDraftClaims] = useState([]);
  const [filteredAdvClaims, setFilteredAdvClaims] = useState([]);
  const options = [currentYear.toString(), (currentYear - 1).toString()];
  const [selectedSection, setSelectedSection] = useState("expense");
  const [showAddClaims, setShowAddClaims] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [advClaims, setAdvClaims] = useState([]);
  const [expenseTotals, setExpenseTotals] = useState({
    approved: 0,
    claimed: 0,
    rejected: 0,
    pending: 0,
  });
  const [advanceTotals, setAdvanceTotals] = useState({
    approved: 0,
    claimed: 0,
    rejected: 0,
    pending: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [currentAdvPage, setCurrentAdvPage] = useState(1);
  const advItemsPerPage = 2;
  // const [value, setValue] = useLocalStorage('expType', 'exp');
  const { expType, setExpType, setEditInfo, setViewDetailsBtnInfo } =
    useStore1();
  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("Draft"); // Default status filter
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDeleteDraftVisible, setIsDeleteDraftVisible] = useState(false);
  const [claimToWithdraw, setClaimToWithdraw] = useState(null);
  const [draftToDelete, setDraftToDelete] = useState(null);
  const [advDraftClaims, setAdvDraftClaims] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [draftClaims, setDraftClaims] = useState([]);
  // const { editClaim, setEditClaim} = useStore1();
  const {
    withdrawClaim,
    setWithdrawClaim,
    removeEditClaim,
    removeWithdrawClaim,
  } = useStore1();
  // const [editBtnInfo, setEditBtnInfo] = useLocalStorage('editInfo', false);
  // const [viewDetailsBtnInfo, setViewDetailsBtnInfo] = useLocalStorage('viewDetailsBtnInfo', false);
  const [toggle, setToggle] = useState(false);
  // const {viewDetails, setViewDetails,removeViewDetailsClaim, setViewAdvDetails, removeViewAdvDetailsClaim} = useStore2();
  const [claimTabIndex, setClaimTabIndex] = useState(0);
  const [overallStatusList, setOverallStatusList] = useState([]);
  const setTabIndex = useStore3((state) => state.setTabIndex);
  const [newWithdrawClaim, setNewWithdrawClaim] = useState([]);
  const { newEditClaim, setNewEditClaim } = useStore3();
  const setClaimStatus = useStore3((state) => state.setClaimStatus);

  console.log(draftClaims, "0000000000000000000000000000000000");
  //const empCode = sessionStorage.getItem("UserId");
  const empCode = localStorage.getItem("empId");
  useEffect(() => {
    axios
      .get(`${BASE_URL}:9030/api/claims/getAllDrafts/${empCode}`)
      .then((response) => {
        console.log(
          response.data.map((i) => i.createdDate.split("-")[0]),
          "))))))))))))000000"
        );
        setDraftClaims(
          response.data.filter(
            (i) => i.createdDate.split("-")[0] === selectedYear
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching drafts:", error);
      });
  }, [selectedYear]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}:9030/api/claims/getAllAdvDrafts/${empCode}`)
      .then((response) => {
        console.log(
          response.data.map((i) => i.createdDate.split("-")[0]),
          "))))))))))))000000"
        );
        setAdvDraftClaims(
          response.data.filter(
            (i) => i.createdDate.split("-")[0] === selectedYear
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching drafts:", error);
      });
  }, [selectedYear]);

  const fetchOverallStatus = (expenseType) => {
    axios
      .get(
        `${BASE_URL}:9028/api/workflow/getOverallClaimMainStatus/${empCode}/${expenseType}`
      )
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

  const getTypeBackgroundColor = (status) => {
    switch (status) {
      case "Saved as Draft":
        return "#c9c4c4";
      case "Pending":
        return "#b2d8f5";
      case "Rejected":
        return "#fbafa3";
      case "Approved":
        // return "#faff9e";
        return "#bdfd9b";
      case "Claimed":
        return "#bdfd9b";
      default:
        return "transparent";
    }
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

    //Function to calculate expense totals
    const calculateExpenseTotals = (filteredClaims) => {
      const approved = filteredClaims.reduce(
        (total, claim) =>
          overallStatusList[claim.claimNum] === "Approved"
            ? total + claim.amount
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
    };

    const { filteredClaims, filteredAdvClaims } = filterByYear(
      claims,
      advClaims,
      selectedYear
    );

    if (Object.keys(overallStatusList).length > 0) {
      calculateExpenseTotals(filteredClaims);
      calculateAdvanceTotals(filteredAdvClaims);
    }
  }, [claims, advClaims, selectedYear, overallStatusList]);

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


  // useEffect(() => {
  //   // Filter claims based on the selected year
  //   const filteredClaims = claims.filter((claim) => {
  //     const claimYear = new Date(claim.createdDate).getFullYear().toString(); // Extract year from the date
  //     return claimYear === selectedYear;
  //   });

  //   // Filter claims based on the search query
  //   const filteredClaimsBySearch =
  //     searchQuery.trim() === ""
  //       ? filteredClaims
  //       : filteredClaims.filter((claim) => {
  //           return Object.entries(claim).some(([key, value]) => {
  //             if (typeof value === "number" || value instanceof Date) {
  //               return value
  //                 .toString()
  //                 .toLowerCase()
  //                 .includes(searchQuery.toLowerCase());
  //             } else if (typeof value === "string") {
  //               return value.toLowerCase().includes(searchQuery.toLowerCase());
  //             }
  //             return false;
  //           });
  //         });

  //   setFilteredClaims(filteredClaimsBySearch);
  // }, [claims, selectedYear, searchQuery]);

  // // Function to filter advClaims based on search query and selected year
  // useEffect(() => {
  //   // Filter advClaims based on the selected year
  //   const filteredAdvClaims = advClaims.filter((advClaim) => {
  //     const advClaimYear = new Date(advClaim.createdDate)
  //       .getFullYear()
  //       .toString(); // Extract year from the date
  //     return advClaimYear === selectedYear;
  //   });

  //   // Filter advClaims based on the search query
  //   const filteredAdvClaimsBySearch =
  //     searchQuery.trim() === ""
  //       ? filteredAdvClaims
  //       : filteredAdvClaims.filter((advClaim) => {
  //           return Object.entries(advClaim).some(([key, value]) => {
  //             if (typeof value === "number" || value instanceof Date) {
  //               return value
  //                 .toString()
  //                 .toLowerCase()
  //                 .includes(searchQuery.toLowerCase());
  //             } else if (typeof value === "string") {
  //               return value.toLowerCase().includes(searchQuery.toLowerCase());
  //             }
  //             return false;
  //           });
  //         });

  //   setFilteredAdvClaims(filteredAdvClaimsBySearch);
  // }, [advClaims, selectedYear, searchQuery]);

  // Event handler for updating searchQuery state

  useEffect(() => {
    const filterClaims = (claims, year, status, searchTerm) => {
      let filteredClaimsByStatus = claims;
      if (status !== "All") {
        if (status === "History") {
          filteredClaimsByStatus = claims.filter((claim) =>
            ["Claimed", "Rejected", "Withdrawn", "Approved"].includes(
              overallStatusList[claim.claimNum]
            )
          );
        } else {
          filteredClaimsByStatus = claims.filter(
            (claim) => overallStatusList[claim.claimNum] === status
          );
        }
      }
      const filteredClaimsByYear = filteredClaimsByStatus.filter((claim) => {
        const claimYear = new Date(claim.createdDate).getFullYear().toString();
        return claimYear === year;
      });
      // Filter by search query (claimNum or expenseType)
      const filteredClaimsBySearch = searchTerm
        ? filteredClaimsByYear.filter((claim) => {
            const searchLower = searchTerm.toLowerCase();
            return (
              (claim.claimNum &&
                claim.claimNum
                  .toString()
                  .toLowerCase()
                  .includes(searchLower)) ||
              (!claim.claimNum &&
                claim.autoNum &&
                claim.autoNum.toString().toLowerCase().includes(searchLower)) ||
              (claim.claimType &&
                claim.claimType.toLowerCase().includes(searchLower))
            );
          })
        : filteredClaimsByYear;
      return filteredClaimsBySearch;
    };
    // Apply filters for claims and advanced claims
    const searchLower = searchQuery.trim().toLowerCase();
    const filteredClaims = filterClaims(
      claims,
      selectedYear,
      statusFilter,
      searchLower
    );
    const filteredAdvClaims = filterClaims(
      advClaims,
      selectedYear,
      statusFilter,
      searchLower
    );
    // Update the state with filtered data
    setFilteredClaims(filteredClaims);
    setFilteredAdvClaims(filteredAdvClaims);
    // Optionally update claim status for Zustand
    if (filteredClaims.length > 0) {
      setClaimStatus(overallStatusList[filteredClaims[0].claimNum]);
    }
  }, [
    claims,
    advClaims,
    selectedYear,
    statusFilter,
    searchQuery,
    overallStatusList,
    setClaimStatus,
  ]);


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


 

  const handleDropdownChange = (event) => {
    const selectedYear = event.target.value;
    setSelectedYear(selectedYear);
  };

  const toggleSection = (section) => {
    setSelectedSection(section === selectedSection ? null : section);
  };

  const handleAddExp = () => {
    setShowAddClaims(true);
    // localStorage.setItem("editInfo", "false");
    setEditInfo(false);
  };

  const closeAddClaims = () => {
    setShowAddClaims(false);
    setToggle(false);
  };

  const handleAddAdv = () => {
    setShowAdvance(true);
    setEditInfo(false);
  };

  const closeAdvance = () => {
    setShowAdvance(false);
    setToggle(false);
  };

  useEffect(() => {
    const filterClaims = (claims, year, status) => {
      let filteredClaimsByStatus = claims;

      if (status !== "All") {
        if (status === "History") {
          filteredClaimsByStatus = claims.filter((claim) =>
            ["Claimed", "Rejected", "Withdrawn", "Approved"].includes(
              overallStatusList[claim.claimNum]
            )
          );
        } else {
          filteredClaimsByStatus = claims.filter(
            (claim) => overallStatusList[claim.claimNum] === status
          );
        }
      }

      const filteredClaimsByYear = filteredClaimsByStatus.filter((claim) => {
        const claimYear = new Date(claim.createdDate).getFullYear().toString();
        return claimYear === year;
      });

      return filteredClaimsByYear;
    };

    const filteredClaims = filterClaims(claims, selectedYear, statusFilter);
    const filteredAdvClaims = filterClaims(
      advClaims,
      selectedYear,
      statusFilter
    );

    setFilteredClaims(filteredClaims);
    setFilteredAdvClaims(filteredAdvClaims);

    // Set the claim status in Zustand
    if (filteredClaims.length > 0) {
      setClaimStatus(overallStatusList[filteredClaims[0].claimNum]); // Set the first claim's status
    }
  }, [
    claims,
    advClaims,
    selectedYear,
    statusFilter,
    overallStatusList,
    setClaimStatus,
  ]);

  // Calculate total number of pages based on the filtered claims
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const advTotalPages = Math.ceil(filteredAdvClaims.length / advItemsPerPage);

  useEffect(() => {
    handleTabChange(0);
  }, [expType]);

  // Function to handle tab change
  const handleTabChange = (tabIndex) => {
    console.log(tabIndex, "tabIndex");
    setTabIndex(tabIndex);
    switch (tabIndex) {
      case 0:
        setStatusFilter("Saved as Draft");
        // fetchDrafts(empCode);
        break;
      case 1:
        setStatusFilter("Pending");
        break;
      case 2:
        setStatusFilter("Approved");
        break;
      case 3:
        setStatusFilter("Rejected");
        break;
      case 4:
        setStatusFilter("History");
        break;
      default:
        setStatusFilter("Saved as Draft");
        //fetchDrafts(empCode);
        break;
    }
    setCurrentPage(1); // Reset current page when tab changes
  };

  // Handle changing pages
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleAdvPreviousPage = () => {
    setCurrentAdvPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleAdvNextPage = () => {
    setCurrentAdvPage((prevPage) => Math.min(prevPage + 1, advTotalPages));
  };

  const currentData = filteredClaims.slice(

    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage

  );



  const currentAdvData = filteredAdvClaims.slice(

    (currentAdvPage - 1) * advItemsPerPage,

    currentAdvPage * advItemsPerPage

  );

  //Export to Excel
  const exportDataToExcel = (data, sheetName, fileName) => {
    if (!Array.isArray(data)) {
      console.error("The data argument is not an array:", data);
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);
  };
  const exportToExcel = () => {
    exportDataToExcel(filteredClaims, "Claims", "claims_data.xlsx");
  };
  const exportAdvToExcel = () => {
    exportDataToExcel(
      filteredAdvClaims,
      "Advance Claims",
      "advance_claims_data.xlsx"
    );
  };

  const handleWithdrawClick = (claim) => {
    setClaimToWithdraw(claim);
    setIsPopupVisible(true);
    //setWithdrawClaim(claim);
    //setNewWithdrawClaim(claim);
  };

  const handleDeleteClick = (claim) => {
    setDraftToDelete(claim);
    setIsDeleteDraftVisible(true);
  };

  const handleAdvDeleteClick = (advClaim) => {
    setDraftToDelete(advClaim);
    setIsDeleteDraftVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setIsDeleteDraftVisible(false);
    setClaimToWithdraw(null);
    setDraftToDelete(null);
    setIsChecked(false);
  };

  console.log(claimToWithdraw, "claimToWithdraw================>");

  // withdraw logic

  const handleConfirmWithdraw = () => {
    if (isChecked && claimToWithdraw) {
      // Filter out the withdrawn claim from the filteredClaims state
      const updatedClaims = filteredClaims.filter(
        (claim) => claim.claimNum !== claimToWithdraw.claimNum
      );
      setFilteredClaims(updatedClaims);

      // Close the popup and reset the state
      setIsPopupVisible(false);
      setClaimToWithdraw(null);
      setIsChecked(false);
      handleWithdrawal(claimToWithdraw);
    } else {
      alert("Please agree to the terms before withdrawing.");
    }
  };

  const handleConfirmWithdrawAdv = () => {
    if (isChecked && claimToWithdraw) {
      // Filter out the withdrawn claim from the filteredClaims state
      const updatedClaims = filteredAdvClaims.filter(
        (advClaim) => advClaim.claimNum !== claimToWithdraw.claimNum
      );
      setFilteredAdvClaims(updatedClaims);

      // Close the popup and reset the state
      setIsPopupVisible(false);
      setClaimToWithdraw(null);
      setIsChecked(false);
      handleWithdrawalAdv(claimToWithdraw);
    } else {
      alert("Please agree to the terms before withdrawing.");
    }
  };

  const handleWithdrawAdvClick = (advClaim) => {
    setClaimToWithdraw(advClaim);
    setIsPopupVisible(true);
    // setWithdrawClaim(advClaim);
  };

  const handleConfirmDelete = () => {
    if (isChecked && draftToDelete) {
      const updatedClaims = filteredClaims.filter(
        (claim) => claim.autoNum !== draftToDelete.autoNum
      );
      setFilteredClaims(updatedClaims);
      setIsDeleteDraftVisible(false);
      setDraftToDelete(null);
      setIsChecked(false);
      handleDeleteDraft();
    } else {
      alert("Please agree to the terms before deleting.");
    }
  };

  const handleConfirmAdvDelete = () => {
    if (isChecked && draftToDelete) {
      const updatedAdvClaims = filteredAdvClaims.filter(
        (advClaim) => advClaim.autoNum !== draftToDelete.autoNum
      );
      setFilteredAdvClaims(updatedAdvClaims);
      setIsDeleteDraftVisible(false);
      setDraftToDelete(null);
      setIsChecked(false);
      handleDeleteAdvDraft();
    } else {
      alert("Please agree to the terms before deleting.");
    }
  };

  const handleWithdrawal = async (claim) => {
    const url = `${BASE_URL}:9028/api/workflow/setOverallStatusOfMainAndItemTableForWithdrawButton/${claim.claimNum}`;

    try {
      const response = await axios.get(url);
      console.log(`Response from ${url}:`, response);

      if (response.status === 200) {
        // alert("Successfully withdrawn");

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
          title: "Successfully withdrawn!",
        });
        window.location.reload();
      } else {
        alert("Failed to withdraw. Please try again.");
      }
    } catch (error) {
      console.error(`Error from ${url}:`, error);
      alert("Error occurred while withdrawing the claim: " + error.message);
    }
  };

  const handleWithdrawalAdv = async (advClaim) => {
    const url = `${BASE_URL}:9030/api/workflow/setOverallStatusOfMainAndItemTableForWithdrawButton/${advClaim.claimNum}`;

    try {
      const response = await axios.get(url);
      console.log(`Response from ${url}:`, response);

      if (response.status === 200) {
        // alert("Successfully withdrawn");
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
          title: "Successfully withdrawn!",
        });
        window.location.reload();
      } else {
        alert("Failed to withdraw. Please try again.");
      }
    } catch (error) {
      console.error(`Error from ${url}:`, error);
      alert("Error occurred while withdrawing the claim: " + error.message);
    }
  };

  const handleDeleteDraft = () => {
    axios
      .delete(
        `${BASE_URL}:9030/api/claims/deleteClaimsDraftTableData/${draftToDelete.empCode}/${draftToDelete.claimType}/${draftToDelete.autoNum}`
      )
      .then((res) => {
        // alert("sucessfully deleted");
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
          title: "Successfully deleted!",
        });
      });
    window.location.reload();
  };

  const handleDeleteAdvDraft = () => {
    axios
      .delete(
        `${BASE_URL}:900/api/claims/deleteAdvance/${draftToDelete.empCode}/${draftToDelete.claimType}/${draftToDelete.autoNum}`
      )
      .then((res) => {
        // alert("sucessfully deleted");
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
          title: "Successfully deleted!",
        });
      });
    window.location.reload();
  };

  const handleToggle = () => {
    setToggle(true);
  };

  console.log(toggle, "toggle");

  const handleEdit = (claim) => {
    console.log(claim, "claim ??????????????????????");
    // setEditClaim(claim);
    // setEditBtnInfo(true);
    setEditInfo(true);
    setViewDetailsBtnInfo(false);
    setNewEditClaim(claim);
    // removeViewDetailsClaim();
    console.log(claim, "claim++++++++++++++");
  };

  const handleEditAdv = (advClaim) => {
    // removeEditClaim();
    // setEditClaim(advClaim);
    // setEditBtnInfo(true);
    setEditInfo(true);
    setViewDetailsBtnInfo(false);
    setNewEditClaim(advClaim);
    // removeViewAdvDetailsClaim();
  };

  const handleViewDetails2 = (claim) => {
    console.log(
      "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
    );
    //  setViewDetails({pendingClaim: claim, tabIndex: claimTabIndex});
    setViewDetailsBtnInfo(true);
    setEditInfo(false);
    setNewEditClaim(claim);

    console.log("viewDetailsClaim===========>>>", claim);

    console.log("claimpend----------", claim);
    //  setEditBtnInfo(false);
    //  removeEditClaim();
    // removeWithdrawClaim();
  };

  const handleViewDetailsAdv = (advClaim) => {
    console.log(
      "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
    );
    //  setViewDetails({pendingClaim: claim, tabIndex: claimTabIndex});
    setViewDetailsBtnInfo(true);
    setEditInfo(false);
    setNewEditClaim(advClaim);

    //  setEditBtnInfo(false);
    //  removeEditClaim();
    // removeWithdrawClaim();
  };

  const handleLocalPlusRemoval = () => {
    // removeEditClaim();
    // removeWithdrawClaim();
    // removeViewDetailsClaim();
    // localStorage.setItem("editInfo",false);
    // localStorage.setItem("viewDetailsBtnInfo",false);
    setEditInfo(false);
    setViewDetailsBtnInfo(false);
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
    <div className="">
<Header/>
      <div className=" mt-20 bg-white">
    {/* <div className='w-[85%] h-screen bg-gray-200 absolute'> */}
      <div className='bg-white text-black rounded-md relative top-1 m-2 md:p-6 p-2 '>
        <h1 className="font-semibold text-base">Reimbursement / Advance</h1>
        <div className="flex justify-center mt-4 border border-gray-700  md:mx-[550px] mx-[116px]">
          <select
            value={selectedYear}
            onChange={handleDropdownChange}
            style={{ width: "200px", textAlign: "center" }}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex justify-center mt-7">
            <div className="flex md:text-med text-xs font-semibold text-gray-600 gap-2 ">
              <div
                onClick={() => {
                  toggleSection("expense");
                  setExpType("exp");
                }}
                className={`cursor-pointer mr-4 ${
                  expType == "exp"
                    ? "text-blue-400 underline lg:underline-offset-4"
                    : ""
                }`}
              >
                My Expense
              </div>
              <div
                onClick={() => {
                  toggleSection("advance");
                  setExpType("adv");
                }}
                className={`cursor-pointer ${
                  expType == "adv"
                    ? "text-blue-400 underline md:underline-offset-4"
                    : ""
                }`}
              >
                My Advance
              </div>
            </div>
          </div>
   
        </div>
        <div className="border-b-[1px] border-gray-300 mt-4 -ml-6"></div>{" "}
        {/* Add this line */}
        {expType == "exp" ? (
          <div className="mt-4">
            {/* Render Expense content here */}
            <h2 className="font-semibold mb-4">Expense Overview</h2>
            <div className="grid grid-cols-12  space-x-3 p-4 px-8 ml-12">
              <div className="col-span-8 border border-gray-300 shadow-xl">
                <div className="grid grid-cols-8  md:p-[12px]">
                  {/* First 2 columns */}
                  <div className="col-span-4 text-center border-r-[1px] border-gray-300 mr-2">
                    <h2 className="text-med lg:mt-8 md:mt-3 sm:mt-2 text-green-500 font-semibold">
                      Approved
                    </h2>
                    <p className="md:p-3 p-2 md:text-sm text-med md:mb-6">
                      {expenseTotals.approved}
                    </p>
                  </div>
                  {/* <div className="col-span-3 text-center border-r-[1px] border-gray-300 mx-3">
                    <h2 className="text-med lg:mt-8 md:mt-3 sm:mt-2 text-green-500 font-semibold mr-2">
                      Claimed
                    </h2>
                    <p className="md:p-3 p-2 md:text-sm text-med md:mb-6 mr-2">
                      {expenseTotals.claimed}
                    </p>
                  </div> */}
                  <div className="col-span-4 text-center ml-2">
                    <h2 className="text-med lg:mt-8 md:mt-3 sm:mt-2 text-red-500 font-semibold ">
                      Rejected
                    </h2>
                    <p className="md:p-3 p-2 md:text-sm text-med md:mb-6">
                      {expenseTotals.rejected}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-3 md:ml-3 ml-12">
                <div className="grid grid-cols-3 md:mt-0 mt-2 md:mr-0 -mr-10">
                  <div className="col-span-3 text-center border border-gray-300 lg:p-[21px] md:p-[2px] sm:p-0 shadow-xl w-72">
                    <img
                      src="/money-in-wallet-icon-psd-53169.jpg"
                      alt="Money in Wallet Icon"
                      className="md:w-10 w-7  md:mt-2 mt-4 mx-24"
                    />
                    <h2 className="md:font-semibold md:text-med lg:mt-2 md:mt-3 sm:mt-2 text-gray-700">
                      Pending Claim Amount
                    </h2>
                    <p className="md:p-2 p-2 md:text-sm text-base text-blue-500 font-medium">
                      INR {expenseTotals.pending}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <Tabs onSelect={handleTabChange}>
                <TabList className="flex justify-center list-none p-0 border border-gray-300">
                  <Tab
                    className="px-12 py-3  cursor-pointer border-r-2 border-gray-300"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    Draft
                  </Tab>
                  <Tab
                    className="px-12 py-3  cursor-pointer border-r-2 border-gray-300"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    Pending
                  </Tab>
                  <Tab
                    className="px-12 py-3  cursor-pointer border-r-2 border-gray-300"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    Approved
                  </Tab>
                  <Tab
                    className="px-12 py-3  cursor-pointer border-r-2 border-gray-300"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    Rejected
                  </Tab>
                  <Tab
                    className="px-12 py-3  cursor-pointer"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    History
                  </Tab>
                </TabList>
              </Tabs>
            </div>
            <div className="md:p-2 p-1 mt-4 border border-gray-300 ">
              <div className="flex justify-between">
                <h2 className="font-semibold">My Expenses</h2>
                <div className="flex md:space-x-8 space-x-3 md:text-xs text-xs">
                  <button onClick={exportToExcel}>
                    <FiUpload className="text-blue-600 text-xl" />
                  </button>
                  <button
                    onClick={() => {
                      handleAddExp();
                      handleLocalPlusRemoval();
                    }}
                  >
                    <IoMdAdd  className="text-blue-600 text-xl" />
                  </button>{" "}
                  {/* Add onClick handler */}
                </div>
                {/* Render PopupForm if showPopup is true */}
                {showAddClaims && <AddClaims onClose={closeAddClaims} />}
              </div>
              <div className="flex justify-between md:px-[124px] px-2 border-b-2 md:py-6 py-4">
                <div className="flex">
                  <CiSearch className="md:mt-[13px] mt-[8px] z-[5px] md:ml-12 text-gray-400 " />
                  <input
                    type="text"
                    placeholder="Search Expense type/Claim no."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border md:w-[400px] w-40 md:px-14 px-5 md:-ml-10 -ml-4 text-xs shadow-md md:py-1"
                  />
                </div>
                <div className="flex justify-between mt-4 md:text-base text-xs">
                  <span className="pagination-info mr-3">
                    {currentPage} - {totalPages} / {totalPages}
                  </span>
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
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      <GrNext />
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto h-80">
                {statusFilter === "Saved as Draft"
                  ? draftClaims.map((claim) => (
                      <div key={claim.id} className="mt-2">
                        <div className="card border border-gray-300 my-6 md:mx-2 mx-0 grid md:grid-cols-12 grid-cols-12 space-x-4 p-2 md:pb-1 shadow-xl">
                          {/* Your claim rendering logic here */}
                          {claim.claimType === "ConveyanceClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/fuel-pump.png"
                                alt="Conveyance"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : claim.claimType === "TravelClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/airplane.png"
                                alt="Travel"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : claim.claimType === "FoodClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/burger.png"
                                alt="Food"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : claim.claimType === "MobileClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/smartphone.png"
                                alt="Food"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : claim.claimType === "MiscellaneousClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/belongings.png"
                                alt="Food"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12"></div>
                          )}
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-xs">
                            <div className="flex mt-1 md:ml-0 -ml-2">
                              <div className="text-gray-400 font-semibold">
                                Request No.{" "}
                              </div>
                              <div className="text-gray-700 font-semibold ml-1">
                                {" "}
                                {claim.autoNum}
                              </div>
                            </div>
                            <div className="text-gray-400 font-semibold md:ml-0 -ml-2">
                              Type of expense
                            </div>
                            <div className="text-gray-700 font-semibold pb-4 md:ml-0 -ml-2">
                              {claim.claimType}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px] md:pl-5 -pl-4">
                            <div className="flex mt-[5.25px] md:ml-0 ml-3">
                              <div className="text-gray-400 font-semibold">
                                WBS.{" "}
                              </div>
                              <div className="font-semibold ml-1 text-gray-700">
                                {" "}
                                {claim.wbsId}
                              </div>
                            </div>
                            <div className=" text-gray-400 font-semibold md:ml-0 ml-3">
                              Date
                            </div>
                            <div className="text-gray-700 pb-4 font-semibold md:ml-0 ml-3">
                              {format(
                                new Date(claim.createdDate),
                                "dd-MM-yyyy"
                              )}
                            </div>
                          </div>
                          <div className="md:col-span-3 col-span-3 break-words space-y-2 md:text-xs text-[10px] ">
                            <div className="md:mt-8 mt-[5.25px] text-gray-400 font-semibold">
                              Description
                            </div>
                            <div className="font-semibold text-gray-700">
                              {claim.description}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px]">
                            <div className="flex gap-4">
                              <button
                                className="bg-blue-500 text-white w-12 rounded-sm"
                                onClick={() => {
                                  handleToggle();
                                  handleEdit(claim);
                                }}
                              >
                                Edit
                              </button>
                              {toggle && <AddClaims onClose={closeAddClaims} />}
                              <button
                                onClick={() => handleDeleteClick(claim)}
                                className="text-blue-600 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                            <div className="mt-8 text-gray-400 font-semibold md:ml-0 -ml-2">
                              Amount
                            </div>
                            <div className="font-semibold md:ml-0 -ml-2 text-gray-700">
                              {claim.amount}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px]">
                            <button
                              className="text-blue-500 font-medium text-xs flex"
                              onClick={() => {
                                handleToggle();
                                handleViewDetails2(claim);
                              }}
                            >
                              View Details{" "}
                              <BsPrinter className="ml-3 text-sm mt-1" />
                            </button>
                            {toggle && <AddClaims onClose={closeAddClaims} />}
                            <div className="mt-8 md:ml-0 -ml-2 text-gray-400 font-semibold">
                              Status
                            </div>
                            <div
                              style={{
                                backgroundColor: getTypeBackgroundColor(
                                  claim.status
                                ),
                              }}
                              className="md:w-[150px] w-[48px] text-center md:p-[2.5px] p-[1.5px] rounded-md md:ml-0 -ml-3"
                            >
                              {claim.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : currentData.map((claim) => (
                      <div key={claim.id} className="mt-2">
                        <div className="card border border-gray-300 my-6 md:mx-2 mx-0 grid md:grid-cols-12 grid-cols-12 space-x-4 p-1 md:pb-1 shadow-xl">
                          {claim.claimType === "ConveyanceClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/fuel-pump.png"
                                alt="Conveyance"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : claim.claimType === "TravelClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/airplane.png"
                                alt="Travel"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : claim.claimType === "FoodClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/burger.png"
                                alt="Food"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : claim.claimType === "MobileClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/smartphone.png"
                                alt="Food"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : claim.claimType === "MiscellaneousClaim" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/belongings.png"
                                alt="Food"
                                className="md:w-12 w-6 md:h-12 h-6"
                              />
                            </div>
                          ) : (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12"></div>
                          )}
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-xs">
                            <div className="flex mt-1 md:ml-0 -ml-2">
                              <div className="text-gray-400 font-semibold">
                                Request No.{" "}
                              </div>
                              <div className="text-gray-700 font-semibold ml-1">
                                {" "}
                                {claim.claimNum}
                              </div>
                            </div>
                            <div className="text-gray-400 font-semibold md:ml-0 -ml-2">
                              Type of expense
                            </div>
                            <div className="text-gray-700 font-semibold pb-4 md:ml-0 -ml-2">
                              {claim.claimType}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px] md:pl-5 -pl-4">
                            <div className="flex mt-[5.25px] md:ml-0 ml-3">
                              <div className="text-gray-400 font-semibold">
                                WBS.{" "}
                              </div>
                              <div className="text-gray-700 font-semibold ml-1">
                                {" "}
                                {claim.wbsId}
                              </div>
                            </div>
                            <div className=" text-gray-400 font-semibold md:ml-0 ml-3">
                              Date
                            </div>
                            <div className="text-gray-700 pb-4 font-semibold md:ml-0 ml-3">
                              {format(
                                new Date(claim.createdDate),
                                "dd-MM-yyyy"
                              )}
                            </div>
                          </div>
                          <div className="md:col-span-3 col-span-3 break-words space-y-2 md:text-xs text-[10px] ">
                            <div className="md:mt-8 mt-[5.25px] text-gray-400 font-semibold">
                              Description
                            </div>
                            <div className="font-semibold text-gray-700">
                              {claim.description}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px]">
                            {overallStatusList[claim.claimNum] ===
                              "Pending" && (
                                <div>
                                <button
                                  onClick={() => handleWithdrawClick(claim)}
                                  className="bg-red-500 text-white w-12 rounded-md text-sm mr-1"
                                >
                                  Delete
                                </button>
                                <button
                                  className="bg-blue-500 text-white w-12 rounded-md text-sm"
                                  onClick={() => {
                                    handleToggle();
                                    handleEdit(claim);
                                  }}
                                >
                                  Edit
                                </button>
                                {toggle && <AddClaims onClose={closeAddClaims} />}
                              </div>
                            )}
                            <div className="mt-8 text-gray-400 font-semibold md:ml-0 -ml-2">
                              Amount
                            </div>
                            <div className="text-gray-700 font-semibold md:ml-0 -ml-2">
                              {claim.amount}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px]">
                            <button
                              className="text-blue-500 font-medium text-xs flex"
                              onClick={() => {
                                handleToggle();
                                handleViewDetails2(claim);
                              }}
                            >
                              View Details{" "}
                              <BsPrinter className="ml-3 text-sm mt-1" />
                            </button>
                            {toggle && <AddClaims onClose={closeAddClaims} />}
                            <div className="mt-8 md:ml-0 -ml-2 text-gray-400 font-semibold">
                              Status
                            </div>
                            <div>
                              {overallStatusList[claim.claimNum] ? (
                                <div
                                  style={{
                                    backgroundColor: getTypeBackgroundColor(
                                      overallStatusList[claim.claimNum]
                                    ),
                                  }}
                                  className="text-gray-700 md:w-[150px] w-[48px] text-center md:p-[2.5px] p-[1.5px] rounded-md md:ml-0 -ml-3"
                                >
                                  {overallStatusList[claim.claimNum]}
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor:
                                      getTypeBackgroundColor("default"),
                                  }}
                                  className="md:w-[150px] w-[48px] text-center md:p-[2.5px] p-[1.5px] rounded-md md:ml-0 -ml-3"
                                >
                                  No Status
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                {isPopupVisible && (
                  <div className="popup fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 py-36 px-56">
                    <div className="popup-content bg-white md:p-24 p-3 h-full md:w-full w-[412px] flex flex-col">
                      <div>
                      Are you sure you want to delete the submitted claim request?
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id="agree"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="agree">I agree</label>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleConfirmWithdraw}
                          className="bg-red-500 text-white p-2 rounded mr-2"
                          disabled={!isChecked}
                        >
                          Delete
                        </button>
                        <button
                          onClick={handleClosePopup}
                          className="bg-gray-500 text-white p-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isDeleteDraftVisible && (
                  <div className="popup fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 py-36 px-56">
                    <div className="popup-content bg-white md:p-24 p-3 h-full md:w-full w-[412px] flex flex-col">
                      <div>
                        Do you want to delete the claim request permanently
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id="agree"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="agree">I agree</label>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleConfirmDelete}
                          className="bg-red-500 text-white p-2 rounded mr-2"
                          disabled={!isChecked}
                        >
                          Delete
                        </button>
                        <button
                          onClick={handleClosePopup}
                          className="bg-gray-500 text-white p-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {expType === "adv" ? (
          <div className="mt-4">
            {/* Render Advance content here */}
            <h2 className="font-semibold mb-4">Advance Overview</h2>
            <div className="grid grid-cols-12  space-x-3 p-4 px-8 ml-12">
              <div className="col-span-8 border border-gray-300 shadow-xl">
                <div className="grid grid-cols-8  md:p-[12px]">
                  {/* First 2 columns */}
                  <div className="col-span-4 text-center border-r-[1px] border-gray-300 mr-2">
                    <h2 className="text-med lg:mt-8 md:mt-3 sm:mt-2 text-green-500 font-semibold">
                      Approved
                    </h2>
                    <p className="md:p-3 p-2 md:text-sm text-med md:mb-6">
                      {advanceTotals.approved}
                    </p>
                  </div>
                  {/* <div className="col-span-3 text-center border-r-[1px] border-gray-300 mx-3">
                    <h2 className="text-med lg:mt-8 md:mt-3 sm:mt-2 text-green-500 font-semibold mr-2">
                      Claimed
                    </h2>
                    <p className="md:p-3 p-2 md:text-sm text-med md:mb-6 mr-2">
                      {advanceTotals.claimed}
                    </p>
                  </div> */}
                  <div className="col-span-4 text-center ml-2">
                    <h2 className="text-med lg:mt-8 md:mt-3 sm:mt-2 text-red-500 font-semibold ">
                      Rejected
                    </h2>
                    <p className="md:p-3 p-2 md:text-sm text-med md:mb-6">
                      {advanceTotals.rejected}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-3 md:ml-3 ml-12 ">
                <div className="grid grid-cols-3 md:mt-0 mt-2 md:mr-0 -mr-10">
                  <div className="col-span-3 text-center border border-gray-300 lg:p-[21px] md:p-[2px] sm:p-0 shadow-xl w-72">
                    <img
                      src="/money-in-wallet-icon-psd-53169.jpg"
                      alt="Money in Wallet Icon"
                      className="md:w-10 w-7  md:mt-2 mt-4 mx-24"
                    />
                    <h2 className="md:font-semibold md:text-med lg:mt-2 md:mt-3 sm:mt-2 text-gray-700">
                      Pending Advance Amount
                    </h2>
                    <p className="md:p-2 p-2 md:text-xs text-base text-blue-500 font-medium">
                      INR {advanceTotals.pending}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <Tabs onSelect={handleTabChange}>
                <TabList className="flex justify-center list-none p-0 border border-gray-300">
                  <Tab
                    className="px-12 py-3  cursor-pointer border-r-2 border-gray-300"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    Draft
                  </Tab>
                  <Tab
                    className="px-12 py-3  cursor-pointer border-r-2 border-gray-300"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    Pending
                  </Tab>
                  <Tab
                    className="px-12 py-3  cursor-pointer border-r-2 border-gray-300"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    Approved
                  </Tab>
                  <Tab
                    className="px-12 py-3  cursor-pointer border-r-2 border-gray-300"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    Rejected
                  </Tab>
                  <Tab
                    className="px-12 py-3  cursor-pointer"
                    selectedClassName="bg-blue-300 border-none"
                  >
                    History
                  </Tab>
                </TabList>
              </Tabs>
            </div>
            <div className="md:p-2 p-1 mt-4 border border-gray-300">
              <div className="flex justify-between">
                <h2 className="font-semibold">My Advances</h2>
                <div className="flex md:space-x-8 space-x-3 md:text-xs text-xs">
                  {/* <button onClick={exportAdvToExcel}><FiUpload className='text-blue-600'/></button> */}
                  <button onClick={exportAdvToExcel}>
                    <FiUpload className="text-blue-600 text-sm" />
                  </button>
                  <button
                    onClick={() => {
                      handleAddAdv();
                      handleLocalPlusRemoval();
                    }}
                  >
                    <IoMdAdd className="text-blue-600 text-sm" />
                  </button>{" "}
                  {/* Add onClick handler */}
                </div>
                {/* Render PopupForm if showPopup is true */}
                {showAdvance && <AddAdvance onClose={closeAdvance} />}
              </div>
              <div className="flex justify-between md:px-[124px] px-2 border-b-2 md:py-6 py-4">
                <div className="flex">
                  <CiSearch className="md:mt-[13px] mt-[8px] z-[5px] md:ml-12 text-gray-400 " />
                  <input
                    type="text"
                    placeholder="Search Advance exp type/Claim no."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border md:w-[400px] w-40 md:px-14 px-5 md:-ml-10 -ml-4 text-xs shadow-md md:py-1"
                  />
                </div>
                <div className="flex justify-between mt-4 md:text-base text-xs">
                  <span className="pagination-info mr-3">
                    {currentAdvPage} - {advTotalPages} / {advTotalPages}
                  </span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleAdvPreviousPage}
                      disabled={currentAdvPage === 1}
                      className="pagination-button"
                    >
                      <GrPrevious />
                    </button>
                    <button
                      onClick={handleAdvNextPage}
                      disabled={currentAdvPage === advTotalPages}
                      className="pagination-button"
                    >
                      <GrNext />
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto h-80">
                {statusFilter === "Saved as Draft"
                  ? advDraftClaims.map((advClaim) => (
                      <div key={advClaim.id} className=" mt-2">
                        <div className="card border border-gray-300 my-6 md:mx-2 mx-0 grid md:grid-cols-12 grid-cols-12 space-x-4 p-2 md:pb-1 shadow-xl">
                          {advClaim.claimType === "RTA" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/user.png"
                                alt="RTA"
                                className="w-12 h-12"
                              />
                            </div>
                          ) : advClaim.claimType === "IOU" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/office-building.png"
                                alt="IOU"
                                className="w-12 h-12"
                              />
                            </div>
                          ) : (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12"></div>
                          )}
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-xs">
                            <div className="flex mt-1 md:ml-0 -ml-2">
                              <div className="text-gray-400 font-semibold">
                                Request No.{" "}
                              </div>
                              <div className="text-gray-700 font-semibold ml-1">
                                {advClaim.autoNum}
                              </div>
                            </div>
                            <div className="text-gray-400 font-semibold">
                              Type of Advance
                            </div>
                            <div className="text-gray-700 font-semibold pb-4">
                              {advClaim.claimType}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px] md:pl-5 -pl-4">
                            <div className="flex mt-[5.25px] md:ml-0 ml-3">
                              <div className="text-gray-400 font-semibold">
                                WBS.{" "}
                              </div>
                              <div className="text-gray-700 font-semibold ml-1">
                                {advClaim.wbsId}
                              </div>
                            </div>
                            <div className="text-gray-400 font-semibold md:ml-0 ml-3">
                              Date
                            </div>
                            <div className="text-gray-700 pb-4 font-semibold md:ml-0 ml-3">
                              {format(
                                new Date(advClaim.createdDate),
                                "dd-MM-yyyy"
                              )}
                            </div>
                          </div>
                          <div className="md:col-span-3 col-span-3 break-words space-y-2 md:text-xs text-[10px]   ">
                            <div className="md:mt-8 mt-[5.25px] text-gray-400 font-semibold">
                              Description
                            </div>
                            <div className="font-semibold text-gray-700">
                              {advClaim.description}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px]">
                            <div className="flex gap-4">
                              <button
                                className="bg-blue-500 text-white w-10"
                                onClick={() => {
                                  handleToggle();
                                  handleEditAdv(advClaim);
                                }}
                              >
                                Edit
                              </button>
                              {toggle && <AddAdvance onClose={closeAdvance} />}
                              <button
                                onClick={() => handleAdvDeleteClick(advClaim)}
                                className="text-blue-600 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                            <div className="mt-8 text-gray-400 font-semibold md:ml-0 -ml-2">
                              Amount
                            </div>
                            <div className="text-gray-700 font-semibold md:ml-0 -ml-2">
                              {advClaim.amount}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px]">
                            <button
                              className="text-blue-500 font-medium text-base flex"
                              onClick={() => {
                                handleToggle();
                                handleViewDetailsAdv(advClaim);
                              }}
                            >
                              View Details{" "}
                              <BsPrinter className="ml-3 text-sm mt-1" />
                            </button>
                            {toggle && <AddAdvance onClose={closeAdvance} />}
                            <div className="mt-8 md:ml-0 -ml-2 text-gray-500 font-semibold">
                              Status
                            </div>
                            <div
                              style={{
                                backgroundColor: getTypeBackgroundColor(
                                  advClaim.status
                                ),
                              }}
                              className="md:w-[150px] w-[48px] text-center md:p-[2.5px] p-[1.5px] rounded-md md:ml-0 -ml-3"
                            >
                              {advClaim.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : currentAdvData.map((advClaim) => (
                      <div key={advClaim.id} className=" mt-2">
                        <div className="card border border-gray-300 my-6 md:mx-2 mx-0 grid md:grid-cols-12 grid-cols-12 space-x-4 p-1 md:pb-1 shadow-xl">
                          {advClaim.claimType === "RTA" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/user.png"
                                alt="RTA"
                                className="w-12 h-12"
                              />
                            </div>
                          ) : advClaim.claimType === "IOU" ? (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12">
                              <img
                                src="/office-building.png"
                                alt="IOU"
                                className="w-12 h-12"
                              />
                            </div>
                          ) : (
                            <div className="md:col-span-1 col-span-1 md:text-base text-xs md:p-5 py-12"></div>
                          )}
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-xs">
                            <div className="flex mt-1 md:ml-0 -ml-2">
                              <div className="text-gray-400 font-semibold">
                                Request No.{" "}
                              </div>
                              <div className="text-gray-700 font-semibold ml-1">
                                {advClaim.claimNum}
                              </div>
                            </div>
                            <div className="text-gray-400 font-semibold">
                              Type of Advance
                            </div>
                            <div className="text-gray-700 font-semibold pb-4">
                              {advClaim.claimType}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px] md:pl-5 -pl-4">
                            <div className="flex mt-[5.25px] md:ml-0 ml-3">
                              <div className="text-gray-400 font-semibold">
                                WBS.{" "}
                              </div>
                              <div className="text-gray-700 font-semibold ml-1">
                                {advClaim.wbsId}
                              </div>
                            </div>
                            <div className="text-gray-400 font-semibold md:ml-0 ml-3">
                              Date
                            </div>
                            <div className="text-gray-700 pb-4 font-semibold md:ml-0 ml-3">
                              {format(
                                new Date(advClaim.createdDate),
                                "dd-MM-yyyy"
                              )}
                            </div>
                          </div>
                          <div className="md:col-span-3 col-span-3 break-words space-y-2 md:text-xs text-[10px]   ">
                            <div className="md:mt-8 mt-[5.25px] text-gray-400 font-semibold">
                              Description
                            </div>
                            <div className="font-semibold text-gray-700">
                              {advClaim.description}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px]">
                            {overallStatusList[advClaim.claimNum] ===
                              "Pending" && (
                                <div>
                              <button
                                onClick={() => handleWithdrawAdvClick(advClaim)}
                                className="bg-red-500 text-white p-1 w-[72px] rounded-md text-xs"
                              >
                                Delete
                              </button>
                              <button
                              className="bg-blue-500 text-white w-10"
                              onClick={() => {
                                handleToggle();
                                handleEditAdv(advClaim);
                              }}
                            >
                              Edit
                            </button>
                            {toggle && <AddAdvance onClose={closeAdvance} />}
                            </div>
                            )}
                            <div className="mt-8 text-gray-400 font-semibold md:ml-0 -ml-2">
                              Amount
                            </div>
                            <div className="text-gray-700 font-semibold md:ml-0 -ml-2">
                              {advClaim.amount}
                            </div>
                          </div>
                          <div className="md:col-span-2 col-span-2 space-y-2 md:text-xs text-[10px]">
                            <button
                              className="text-blue-500 font-medium text-base flex"
                              onClick={() => {
                                handleToggle();
                                handleViewDetailsAdv(advClaim);
                              }}
                            >
                              View Details{" "}
                              <BsPrinter className="ml-3 text-sm mt-1" />
                            </button>
                            {toggle && <AddAdvance onClose={closeAdvance} />}
                            <div className="mt-8 md:ml-0 -ml-2 text-gray-400 font-semibold">
                              Status
                            </div>
                            <div>
                              {overallStatusList[advClaim.claimNum] ? (
                                <div
                                  style={{
                                    backgroundColor: getTypeBackgroundColor(
                                      overallStatusList[advClaim.claimNum]
                                    ),
                                  }}
                                  className="md:w-[150px] w-[48px] text-center md:p-[2.5px] p-[1.5px] rounded-md md:ml-0 -ml-3"
                                >
                                  {overallStatusList[advClaim.claimNum]}
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor:
                                      getTypeBackgroundColor("default"),
                                  }}
                                  className="md:w-[150px] w-[48px] text-center md:p-[2.5px] p-[1.5px] rounded-md md:ml-0 -ml-3"
                                >
                                  No Status
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                {isPopupVisible && (
                  <div className="popup fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 py-36 px-56">
                    <div className="popup-content bg-white md:p-24 p-3 h-full md:w-full w-[412px] flex flex-col">
                      <div>
                      Are you sure you want to delete the submitted advance claim request?
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id="agree"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="agree">I agree</label>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleConfirmWithdrawAdv}
                          className="bg-red-500 text-white p-2 rounded mr-2"
                          disabled={!isChecked}
                        >
                          Delete
                        </button>
                        <button
                          onClick={handleClosePopup}
                          className="bg-gray-500 text-white p-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isDeleteDraftVisible && (
                  <div className="popup fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 py-36 px-56">
                    <div className="popup-content bg-white md:p-24 p-3 h-full md:w-full w-[412px] flex flex-col">
                      <div>
                        Do you want to delete the advance claim request permanently
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id="agree"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="agree">I agree</label>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleConfirmAdvDelete}
                          className="bg-red-500 text-white p-2 rounded mr-2"
                          disabled={!isChecked}
                        >
                          Delete
                        </button>
                        <button
                          onClick={handleClosePopup}
                          className="bg-gray-500 text-white p-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
    </div>
    // </div>
  );
};

export default ClaimsDashBoard;
