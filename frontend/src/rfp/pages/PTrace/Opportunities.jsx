

import { FiPlusCircle, FiUnlock, FiSettings } from "react-icons/fi";
import { FaLock } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Box, Modal } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import FilterPanel from "./FilterPanel";
import Form from "./Form";
import Service from "../../services/Service";
import {
  removePersistence,
  useUpdateRfpDocs,
} from "../../store/RfpStore";
import ThreeDots from "./ThreeDots";
import TierSettings from "./TierSettings";

export default function Opportunities({ onDivClick, handleDeleteClicked, onFilterChange }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [activeOpp, setActiveOpp] = useState(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const listRef = useRef(null);
  const [activePanel, setActivePanel] = useState(null);

  const [filters, setFilters] = useState({
    status: null,
    businessUnit: null,
    leadPracticeUnit: null,
    quarter: null,
    projectType: null,
    rfpProcess: null,
    customerType: null,
    budgetCategory: null,
  });

  // const [isRfpAdmin, setIsRfpAdmin] = useState(false);
  const [isRfpAdmin, setIsRfpAdmin] = useState(null);
  const [thresholds, setThresholds] = useState({
    platinum: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
  });
  const [empData, setEmpData] = useState({});
  const [controlPlusIcon, setControlPlusIcon] = useState(false);

  const { docsUpdateStatus, opportunity, setDocsUpdateStatus } = useUpdateRfpDocs();
  const empId = localStorage.getItem("empId");
  // Fetch employee data and check for RFP Admin role
  useEffect(() => {

    axios
      .get(`http://43.205.24.208:9020/employee/eCode/${empId}`)
      .then((res) => {
        setEmpData(res.data);
        const roles = res.data?.userDTO?.userRoleResDTOS || [];
        const hasAdmin = roles.some(
          (r) => r?.roleResDTO?.name?.trim()?.toLowerCase() === "rfp admin"
        );
        setIsRfpAdmin(hasAdmin);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch employee data");
      });
  }, []);


  // Fetch thresholds
  const loadTiersToThresholds = () => {
    Service.getTiers()
      .then((res) => {
        const list = res.data?.data || [];
        const map = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
        list.forEach((t) => {
          const key = String(t.tierName).toLowerCase();
          if (key.includes("platinum")) map.platinum = Number(t.start);
          else if (key.includes("gold")) map.gold = Number(t.start);
          else if (key.includes("silver")) map.silver = Number(t.start);
          else if (key.includes("bronze")) map.bronze = Number(t.start);
        });
        setThresholds(map);
      })
      .catch((err) => {
        console.error("Failed to load tiers:", err);
      });
  };

  // Initial load: fetch employee opportunities and tiers
  // useEffect(() => {
  //   const empId = localStorage.getItem("empId");
  //   if (empId) fetchOpportunitiesByEmp(empId);
  //   loadTiersToThresholds();
  // }, []);

  //   useEffect(() => {
  //   const empId = localStorage.getItem("empId");

  //   // 👉 If role is identified as RFP Admin
  //   if (isRfpAdmin) {
  //     Service.getAllRFP()
  //       .then((response) => {
  //         setOpportunities(response.data.data);
  //       })
  //       .catch(() => {
  //         setOpportunities([]);
  //         toast.error("No Opportunities found");
  //       });

  //   } else if (isRfpAdmin === false) {
  //     // 👉 Non-admin: fetch only their opportunities
  //     if (empId) fetchOpportunitiesByEmp(empId);
  //   }

  //   loadTiersToThresholds();
  // }, [isRfpAdmin]);

  useEffect(() => {
    // const empId = localStorage.getItem("empId");

    // Only fetch if role has been determined (true or false)
    if (isRfpAdmin === null) return; // wait for role check

    if (isRfpAdmin) {
      // Admin: fetch all RFPs
      getAllRFP();
    } else {
      // Non-admin: fetch only employee-specific RFPs
      if (empId) fetchOpportunitiesByEmp(empId);
    }

    loadTiersToThresholds();
  }, [isRfpAdmin]);

  const getAllRFP = () => {
    Service.getAllRFP()
      .then((response) => {
        setOpportunities(response.data.data);
      })
      .catch(() => {
        setOpportunities([]);
        toast.error("No Opportunities found");
      });
  }


  //  const fetchOpportunitiesByEmp = async (empId) => {
  //     try {
  //       const response = await Service.getRfpsByEmpId(empId);
  //       setOpportunities(response.data);
  //       if (response.data.length === 0) {
  //         toast.info("No Opportunities found for this employee");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching employee opportunities:", error);
  //       setOpportunities([]);
  //       toast.error("Failed to fetch opportunities");
  //     }
  //   };

  const fetchOpportunitiesByEmp = async () => {
    try {
      const empId = localStorage.getItem("empId");

      if (!empId) {
        console.error("empId not found in localStorage");
        return;
      }

      const response = await Service.getRfpsByEmpId(empId);
      setOpportunities(response.data);

      if (response.data.length === 0) {
        toast.info("No Opportunities found for this employee");
      }
    } catch (error) {
      console.error("Error fetching employee opportunities:", error);
      setOpportunities([]);
      toast.error("Failed to fetch opportunities");
    }
  };

  // Refresh opportunity if docs update
  useEffect(() => {
    if (docsUpdateStatus) fetchOpp();
  }, [docsUpdateStatus]);

  useEffect(() => {
    if (activePanel === "filter") onFilterChange(true);
  }, [activePanel, onFilterChange]);

  const fetchOpp = () => {
    Service.getRfpByOppId(opportunity.oppId)
      .then((response) => {
        setSelectedOpportunityId(response.data.oppId);
        onDivClick(response.data);
        setDocsUpdateStatus(false);
      })
      .catch((error) => console.error(error));
  };

  const handleUpdate = (id) => {
    Service.getRfpByOppId(id)
      .then((response) => {
        setSelectedOpportunityId(id);
        setActivePanel(null);
        onDivClick(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleRemoveOppSession = () => removePersistence();
  const handleControlCreateAndEdit = () => setControlPlusIcon(true);

  // Filter logic
  const filteredOpportunities = opportunities.filter((opp) => {
    let matches = true;
    if (filters.status && opp.rfpStatus !== filters.status) matches = false;
    if (filters.businessUnit && opp.rfpBusinessUnit?.businessUnit !== filters.businessUnit) matches = false;
    if (filters.leadPracticeUnit && opp.rfpLeadPracticeUnit?.leadPracticeUnit !== filters.leadPracticeUnit) matches = false;
    if (filters.projectType && opp.rfpProjectType?.projectType !== filters.projectType) matches = false;
    if (filters.rfpProcess && opp.rfpProcess?.rfpProcess !== filters.rfpProcess) matches = false;
    if (filters.rfpCustType && opp.rfpCustType?.custType !== filters.custType) matches = false;
    if (filters.quarter) {
      const oppQuarter = `Q${Math.floor((new Date(opp.oppDate).getMonth() / 3) + 1)}`;
      if (oppQuarter !== filters.quarter) matches = false;
    }
    if (filters.budgetCategory) {
      const budget = opp.customerProjBudget || 0;
      const { platinum, gold, silver } = thresholds;
      let category = "Bronze";
      if (budget >= platinum) category = "Platinum";
      else if (budget >= gold) category = "Gold";
      else if (budget >= silver) category = "Silver";
      if (category !== filters.budgetCategory) matches = false;
    }
    return matches;
  });

  return (
    <div className="flex-none transition-all duration-300 bg-white shadow-md rounded-r-lg p-1 w-60 h-[563px] relative">
      {/* Header */}
      <div className="flex justify-between items-center pb-0.5 border-b">
        <div>
          <strong className="text-l font-bold bg-gradient-to-r from-sky-500 to-green-500 text-transparent bg-clip-text">
            Opportunities
          </strong>
          <button onClick={() => { setModalOpen(true); handleRemoveOppSession(); handleControlCreateAndEdit(); }}>
            <FiPlusCircle className="text-[#0ea5e9] ml-[3px] text-sm" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {isRfpAdmin && (
            <button
              onClick={() => setActivePanel(prev => (prev === "tier" ? null : "tier"))}
              className="p-1 rounded-md hover:bg-gray-200"
              title="Threshold settings"
            >
              <FiSettings className="text-gray-600" />
            </button>
          )}
          <button
            onClick={() => setActivePanel(prev => (prev === "filter" ? null : "filter"))}
            className="p-1 rounded-md hover:bg-gray-200"
          >
            <FaFilter className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Panels */}
      {activePanel === "filter" && (
        <FilterPanel filters={filters} setFilters={setFilters} opportunities={opportunities} onClose={() => setActivePanel(null)} />
      )}
      {activePanel === "tier" && (
        <TierSettings onClose={() => { setActivePanel(null); loadTiersToThresholds(); }} thresholds={thresholds} setThresholds={setThresholds} />
      )}

      {/* Opportunities List */}
      <div ref={listRef} className="relative block min-h-[200px] max-h-[500px] overflow-y-auto">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opp) => (
            <button
              key={opp.oppId}
              className={`relative flex flex-col justify-between w-full px-0.5 py-1 border-b transition-all hover:bg-sky-200 hover:text-sky-700 ${selectedOpportunityId === opp.oppId ? "bg-[#c4e7ff]" : "bg-white"}`}
              onClick={() => handleUpdate(opp.oppId)}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-sm text-sky-500 text-left break-words">
                  {opp.oppShortDesc}
                </span>
              </div>
              <div className="absolute top-1 right-0.5">
                {opp.rfpStatus === "Closed" ? (
                  <FaLock className="text-xs text-gray-400" />
                ) : (
                  <FiUnlock className="text-xs text-blue-400" />
                )}
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <button
                  onClick={(e) => {
                    const buttonRect = e.currentTarget.getBoundingClientRect();
                    setActiveOpp(opp);
                    setMenuAnchor({ top: buttonRect.top + buttonRect.height / 2, left: buttonRect.right + 4 });
                  }}
                  className="text-sm text-gray-400 hover:text-black"
                >
                  <BsThreeDots />
                </button>
                <div className="flex gap-1">
                  <span className={`px-1 py-0.5 rounded-full text-[7px] ${opp.rfpProcess.rfpProcess === "Won" ? "bg-green-50 text-green-300 tracking-wide" : opp.rfpProcess.rfpProcess === "Lost" ? "bg-red-50 text-red-300 tracking-wide" : "bg-yellow-50 text-yellow-300 tracking-wide"}`}>
                    {opp.rfpProcess.rfpProcess}
                  </span>
                  <span className="px-1 py-0.5 bg-sky-50 text-blue-300 rounded-full text-[7px]">
                    {opp?.rfpLeadPracticeUnit?.leadPracticeUnit ?? " "}
                  </span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <span className="text-center text-gray-400 py-2">No opportunities available</span>
        )}

        {menuAnchor && activeOpp && (
          <div className="fixed z-50" style={{ top: menuAnchor.top, left: menuAnchor.left }}>
            <ThreeDots
              onEdit={() => { setModalOpen(true); setControlPlusIcon(false); }}
              onDelete={() => {
                Service.deleteOpportunity(activeOpp.oppId)
                  .then(() => {
                    const empId = localStorage.getItem("empId");
                    if (isRfpAdmin) {
                      getAllRFP();
                    } else {
                      fetchOpportunitiesByEmp(empId);
                    }
                    setActiveOpp(null);
                    setMenuAnchor(null);
                    handleDeleteClicked?.(true);
                  })
                  .catch((err) => console.error(err));
              }}
              onClose={() => { setActiveOpp(null); setMenuAnchor(null); }}
            />
          </div>
        )}
      </div>

      {/* Modal for Form */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ width: "70%", maxHeight: "80vh", bgcolor: "white", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Form setModalOpen={setModalOpen} opportunity={activeOpp} handleRefresh={fetchOpportunitiesByEmp} controlPlusIcon={controlPlusIcon} />
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
}