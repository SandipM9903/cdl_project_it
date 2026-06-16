import {
  Checkbox,
  Modal,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useEffect, useState } from "react";
import "react-dropdown/style.css";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { ImCancelCircle } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "../components/Header";
import Proof_Of_Investment from "./Proof_Of_Investment";
import Service from "./Service";
import { useFileStore, useStoreFinancialYear } from "./useFileStore";

function DeclarationSummary() {
  const {
    submitFinancialYear,
    setSubmitFinancialYear,
  } = useStoreFinancialYear();

  const empCode = localStorage.getItem("empId");
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  const handleChanges = (event) => {
    setChecked(event.target.checked);
  };

  const { regime } = useFileStore();

  const [value, setValue] = useState("one");

  const currentYear1 = new Date().getFullYear();

  const getFinancialYearOptions = () => {
    const fy1 = `${currentYear1 - 1}-${currentYear1.toString().slice(-2)}`;
    const fy2 = `${currentYear1}-${(currentYear1 + 1).toString().slice(-2)}`;
    return ["Select Year", fy2, fy1];
  };

  const options1 = getFinancialYearOptions();
  const index = options1.indexOf(submitFinancialYear);

  const defaultOption1 = options1[index];

  const handleSelect = (selectedOption) => {
    setSubmitFinancialYear(`${selectedOption.value}`);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const itDecWindow = () => {
    navigate("/disp");
  };

  const [open, setOpen] = useState(false);

  const handleITDecUpdate = () => {
    navigate("/select-regime", { state: { data: "oldvalue" } });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "white",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    p: 4,
    height: 320,
    "@media (max-width: 768px)": {
      width: "90%",
      height: 420,
    },
  };

  const [info, setInfo] = useState([]);
  const [landlordDetails, setLandlordDetails] = useState({ name: "", panNumber: "" });
  const [loading, setLoading] = useState(false);

  const fetchInfo = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    )
      .then((res) => {
        setInfo(res?.data?.data || []);
      })
      .catch(() => {
        toast.info("No declaration data found");
      });
  };

  // Fetch landlord details
  const fetchLandlordDetails = async () => {
    if (!empCode) return;
    setLoading(true);
    try {
      const response = await Service.getLandlordDetails(empCode);
      if (response?.data) {
        const data = response.data;
        setLandlordDetails({
          name: data.landlordName || "",
          panNumber: data.landlordPanNumber || ""
        });
      }
    } catch (error) {
      console.error("Error fetching landlord details:", error);
      setLandlordDetails({ name: "", panNumber: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
    fetchLandlordDetails();
  }, [submitFinancialYear]);

  const [master, setMaster] = useState([]);

  const fetchMaster = () => {
    Service.fetchAllSectionName().then((res) => {
      setMaster(res?.data?.data || []);
    });
  };

  useEffect(() => {
    fetchMaster();
  }, []);

  const allSectionName = master.map((masterItem) => {
    const userItem = Array.isArray(info) ? info.find(
      (item) => Number(item?.itDecId) === Number(masterItem?.itDecId),
    ) : null;

    return userItem
      ? { ...masterItem, declarationAmount: userItem.declarationAmount }
      : { ...masterItem, declarationAmount: null };
  });

  const [financialYearInfo, setFinancialYearInfo] = useState("");

  useEffect(() => {
    if (financialYearInfo.length > 0) return;
    const financialYearList = [];
    for (let i = 0; i < allSectionName.length; i++) {
      financialYearList.push(allSectionName[i]?.financialYear);
      break;
    }
    setFinancialYearInfo(financialYearList);
  }, [allSectionName, financialYearInfo]);

  const [quarter, setQuarter] = useState("");

  useEffect(() => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const getQuarter = (month) => {
      if (month >= 1 && month <= 3) {
        return "Quarter 4";
      } else if (month >= 4 && month <= 6) {
        return "Quarter 1";
      } else if (month >= 7 && month <= 9) {
        return "Quarter 2";
      } else if (month >= 10 && month <= 12) {
        return "Quarter 3";
      }
    };
    const currentQuarter = getQuarter(month);
    setQuarter(currentQuarter);
  }, []);

  const [currentYear, setCurrentYear] = useState(null);

  useEffect(() => {
    const date = new Date();
    setCurrentYear(date.getFullYear());
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // Accordion state
  const [expandedPanels, setExpandedPanels] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [panel]: isExpanded,
    }));
  };

  // Calculate total declared amount
  const totalDeclaredAmount = allSectionName.reduce((total, section) => {
    return total + (Number(section?.declarationAmount) || 0);
  }, 0);

  // Check if landlord details exist
  const hasLandlordDetails = landlordDetails.name || landlordDetails.panNumber;

  return (
    <div className="min-h-screen bg-gray-50 font-content">
      <Header />
      <div className="relative overflow-x-auto sm:rounded-lg w-full max-w-7xl mx-auto px-4 py-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Header Section - All in one line */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-6">
            {/* Left: Breadcrumbs */}
            <div className="flex items-center text-sm">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer text-gray-700 font-medium hover:text-[#dc2626] hover:underline hover:underline-offset-4"
              >
                Home
              </span>

              <span className="mx-2 text-gray-400">/</span>

              <span
                onClick={() => navigate("/tax")}
                className="cursor-pointer text-gray-700 font-medium hover:text-[#dc2626] hover:underline hover:underline-offset-4"
              >
                Tax Management
              </span>

              <span className="mx-2 text-gray-400">/</span>

              <span className="font-semibold text-[#dc2626] cursor-default">
                Declaration
              </span>
            </div>

            {/* Middle: Declaration window is open */}
            <div className="flex items-center bg-red-50 rounded-lg px-4 py-2 border border-red-100">
              <div className="text-red-500 mr-2 text-lg">
                <HiOutlineInformationCircle />
              </div>
              <div className="text-sm text-grey-600 font-medium font-content">
                Declaration window is open
              </div>
            </div>

            {/* Right: Financial Year */}
            <div className="flex items-center">
              <p className="text-sm text-gray-600 bg-gray-100 py-2 px-4 rounded-full">
                Financial Year:{" "}
                <span className="text-gray-900 font-medium ml-1">
                  {submitFinancialYear}
                </span>
              </p>
            </div>
          </div>

          {value === "one" ? (
            <div className="mt-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 font-header">
                  Declaration Summary
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-content">
                  Overview of your tax declarations for the selected financial
                  year
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-3 flex items-center">
                      <div className="w-[60%] font-semibold text-gray-800 font-header">
                        Particulars
                      </div>
                      <div className="w-[5%] flex justify-center"></div>
                      <div className="w-[30%] text-right font-semibold text-gray-800 font-header">
                        Declared Amount
                      </div>
                    </div>

                    {/* Section 80C Card */}
                    <Card className="shadow-none border-b border-gray-100 rounded-none">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between px-6 py-4">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 mr-4"
                              src={require("./assets/savings 2.png")}
                              alt="Section 80C"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 font-header">
                              Section 80 C
                            </h3>
                          </div>
                        </div>
                        <div className="border-b border-gray-200 mx-6" />
                        <div className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-600 mb-2 font-content">
                            Deduction under section 80 C
                          </div>
                          <div className="divide-y divide-gray-100">
                            {[...allSectionName]
                              .sort((a, b) => a.itDecId - b.itDecId)
                              ?.filter((section) =>
                                [
                                  1,
                                  2,
                                  4,
                                  5,
                                  9,
                                  18,
                                  19,
                                  20,
                                  21,
                                  22,
                                  23,
                                  24,
                                ].includes(section?.itDecId),
                              )
                              ?.map((section) => (
                                <div
                                  key={section?.itDecId}
                                  className="flex justify-between items-center py-3 text-sm"
                                >
                                  <div className="text-gray-800 w-[60%] font-content">
                                    <div className="font-medium">
                                      {section?.description}
                                    </div>
                                    {section?.additionalInformation && (
                                      <div className="text-gray-500 text-xs mt-1 font-content">
                                        {section.additionalInformation}
                                      </div>
                                    )}
                                  </div>
                                  <div className="w-[5%] flex justify-center text-gray-400 text-sm font-medium font-content">
                                    -
                                  </div>
                                  <div className="w-[30%] text-right text-gray-800 font-medium font-content">
                                    {section?.declarationAmount ||
                                    section?.declarationAmount === 0
                                      ? `₹ ${Number(
                                          section.declarationAmount,
                                        ).toLocaleString("en-IN")}`
                                      : "-"}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Section 80D/80DD/80DDB/80U Card */}
                    <Card className="shadow-none border-b border-gray-100 rounded-none">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between px-6 py-4">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 mr-4"
                              src={require("./assets/Medical.jpg")}
                              alt="Medical"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 font-header">
                              Section 80D/80DD/80DDB/80U
                            </h3>
                          </div>
                        </div>
                        <div className="border-b border-gray-200 mx-6" />
                        <div className="px-6 py-4">
                          <div className="divide-y divide-gray-100">
                            {[...allSectionName]
                              .sort((a, b) => a.itDecId - b.itDecId)
                              ?.filter((section) =>
                                [7, 8, 10, 11, 15, 16, 17].includes(
                                  section?.itDecId,
                                ),
                              )
                              ?.map((section) => (
                                <div
                                  key={section?.itDecId}
                                  className="flex justify-between items-center py-3 text-sm"
                                >
                                  <div className="text-gray-800 w-[60%] font-content">
                                    <div className="font-medium">
                                      {section?.description}
                                    </div>
                                    {section?.additionalInformation && (
                                      <div className="text-gray-500 text-xs mt-1 font-content">
                                        {section.additionalInformation}
                                      </div>
                                    )}
                                  </div>
                                  <div className="w-[5%] flex justify-center text-gray-400 font-medium font-content">
                                    -
                                  </div>
                                  <div className="w-[30%] text-right text-gray-800 font-medium font-content">
                                    {section?.declarationAmount ||
                                    section?.declarationAmount === 0
                                      ? `₹ ${Number(
                                          section.declarationAmount,
                                        ).toLocaleString("en-IN")}`
                                      : "-"}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Section 80E/10/Housing Loan Card */}
                    <Card className="shadow-none border-b border-gray-100 rounded-none">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between px-6 py-4">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 mr-4"
                              src={require("./assets/images icon.png")}
                              alt="Housing Loan"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 font-header">
                              Section 80E/10/Housing Loan
                            </h3>
                          </div>
                        </div>
                        <div className="border-b border-gray-200 mx-6" />
                        <div className="px-6 py-4">
                          <div className="divide-y divide-gray-100">
                            {[...allSectionName]
                              .sort((a, b) => a.itDecId - b.itDecId)
                              ?.filter((section) =>
                                [12, 13, 14].includes(section?.itDecId),
                              )
                              ?.map((section) => (
                                <div
                                  key={section?.itDecId}
                                  className="flex justify-between items-center py-3 text-sm"
                                >
                                  <div className="text-gray-800 w-[60%] font-content">
                                    <div className="font-medium">
                                      {section?.description}
                                    </div>
                                    {section?.additionalInformation && (
                                      <div className="text-gray-500 text-xs mt-1 font-content">
                                        {section.additionalInformation}
                                      </div>
                                    )}
                                  </div>
                                  <div className="w-[5%] flex justify-center text-gray-400 font-medium font-content">
                                    -
                                  </div>
                                  <div className="w-[30%] text-right text-gray-800 font-medium font-content">
                                    {section?.declarationAmount ||
                                    section?.declarationAmount === 0
                                      ? `₹ ${Number(
                                          section.declarationAmount,
                                        ).toLocaleString("en-IN")}`
                                      : "-"}
                                  </div>
                                </div>
                              ))}
                          </div>
                          
                          {/* Professional Landlord Details Section */}
                          {hasLandlordDetails && (
                            <Paper 
                              elevation={0} 
                              className="mt-6 bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                            >
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center">
                                  <HomeIcon className="text-blue-600 mr-2" fontSize="small" />
                                  <h4 className="text-sm font-semibold text-gray-700 font-header">
                                    Landlord Information
                                  </h4>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {landlordDetails.name && (
                                    <div className="flex items-start space-x-3">
                                      <div className="bg-blue-100 p-2 rounded-full">
                                        <PersonIcon className="text-blue-600" fontSize="small" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 font-content uppercase tracking-wider">
                                          LANDLORD NAME
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 font-content mt-1">
                                          {landlordDetails.name}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {landlordDetails.panNumber && (
                                    <div className="flex items-start space-x-3">
                                      <div className="bg-purple-100 p-2 rounded-full">
                                        <CreditCardIcon className="text-purple-600" fontSize="small" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 font-content uppercase tracking-wider">
                                          PAN NUMBER
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 font-content mt-1 font-mono">
                                          {landlordDetails.panNumber}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <Divider className="border-gray-200" />
                              
                              <div className="px-4 py-2 bg-gray-50/50">
                                <p className="text-xs text-gray-500 font-content flex items-center">
                                  <HiOutlineInformationCircle className="text-blue-500 mr-1" />
                                  These details are associated with your Housing Loan declaration
                                </p>
                              </div>
                            </Paper>
                          )}
                          
                          {/* Show message if housing loan exists but no landlord details */}
                          {!hasLandlordDetails && !loading && (
                            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                              <p className="text-xs text-amber-700 font-content flex items-center">
                                <HiOutlineInformationCircle className="text-amber-500 mr-2" size={16} />
                                Landlord details are required for Housing Loan but have not been provided.
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Total Summary */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
                      <div className="text-lg font-semibold text-gray-800 font-header">
                        Total Declared Amount
                      </div>
                      <div className="text-lg font-bold text-blue-600 font-header">
                        ₹ {totalDeclaredAmount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <Card className="shadow-md border border-gray-200 rounded-lg sticky top-24 mt-[70px]">
                    <CardContent className="p-5">
                      <h2 className="font-semibold text-lg text-gray-800 mb-4 font-header text-center">
                        Declaration Status
                      </h2>

                      <div className="flex justify-center mb-5">
                        <Chip
                          label="DECLARED"
                          color="success"
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            padding: "8px 16px",
                            fontFamily: "'font-header', sans-serif",
                          }}
                        />
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 mb-5">
                        <p className="text-sm text-blue-700 text-center font-content">
                          You have submitted IT Declaration as per the {regime}{" "}
                          regime
                        </p>
                      </div>

                      <div className="flex justify-center mb-5">
                        <button
                          className="bg-red-600 hover:bg-red-700 font-semibold text-center text-white text-sm py-2 px-4 rounded-md transition-colors duration-200 w-full font-content"
                          onClick={() => setOpen(true)}
                        >
                          Edit Declaration
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 text-center font-content">
                          You can still make changes and resubmit for review
                          while the window is still open
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <Proof_Of_Investment />
          )}
        </div>
      </div>

      {/* Edit Declaration Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 font-header">
              Revise Declaration
            </h2>
            <ImCancelCircle
              className="text-red-600 cursor-pointer transition-transform duration-200 hover:scale-110"
              style={{ fontSize: "20px" }}
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="my-6">
            <p className="text-gray-600 text-sm font-content">
              Are you sure you want to withdraw the already submitted IT
              Declaration? You can revise your declaration while the window is
              open.
            </p>
          </div>

          <div className="flex items-center mb-6">
            <Checkbox
              checked={checked}
              onChange={handleChanges}
              size="medium"
              sx={{
                color: "#9ca3af",
                "&.Mui-checked": {
                  color: "#dc2626",
                },
              }}
            />
            <span className="text-sm font-medium text-gray-700 font-content">
              I understand that I'm revising my submitted declaration
            </span>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors font-content"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded-md text-white font-medium text-sm transition-colors font-content ${
                checked
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-300 cursor-not-allowed"
              }`}
              disabled={!checked}
              onClick={handleITDecUpdate}
            >
              Revise Declaration
            </button>
          </div>
        </Box>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default DeclarationSummary;