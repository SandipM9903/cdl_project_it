import { Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { FaArrowRightLong } from "react-icons/fa6";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

import Header from "../components/Header";
import search from "./animation/Search.json";
import "./IT_Declaration.css";
import Proof_Of_Investment from "./Proof_Of_Investment";
import { useStoreFinancialYear, useStoreTabStatus } from "./useFileStore";

import { simpleEncrypt } from "../simpleEncrypt";
import { BASE_URL,BASE_URL_EMP } from "./api/api";

function IT_Declaration() {
  const empCode = localStorage.getItem("empId");
  const {
    submitFinancialYear,
    setSubmitFinancialYear,
  } = useStoreFinancialYear();
  const navigate = useNavigate();
  const { tabStatus, setTabStatus } = useStoreTabStatus();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const [hasRegime, setHasRegime] = useState(false);
  const [regimeType, setRegimeType] = useState(null); // New state for regime type

  let fyStartYear;

  if (currentMonth >= 3) {
    fyStartYear = currentYear;
  } else {
    fyStartYear = currentYear - 1;
  }

  const currentFinancialYear = `${fyStartYear}-${(fyStartYear + 1)
    .toString()
    .slice(-2)}`;

  const previousYear2 = `${fyStartYear - 1}-${fyStartYear
    .toString()
    .slice(-2)}`;

  const previousYear1 = `${fyStartYear - 2}-${(fyStartYear - 1)
    .toString()
    .slice(-2)}`;

  const getFinancialYearOptions = () => {
    return ["Select Year", previousYear1, previousYear2, currentFinancialYear];
  };

  useEffect(() => {
  if (!empCode) return;

  axios
    .get(`${BASE_URL}:9026/api/regimes/emp/${simpleEncrypt(empCode)}`)
    .then((res) => {
      const payload = res?.data?.data ?? res?.data;

      const hasData =
        payload &&
        (Array.isArray(payload)
          ? payload.length > 0
          : Object.keys(payload).length > 0);

      setHasRegime(hasData);

      if (hasData) {
        if (Array.isArray(payload)) {
          setRegimeType(payload[0]?.regime ?? null);
        } else {
          setRegimeType(payload.regime ?? null);
        }
      } else {
        setRegimeType(null);
      }
    })
    .catch((err) => {
      // ✅ SILENTLY ignore 404
      if (err?.response?.status === 404) {
        setHasRegime(false);
        setRegimeType(null);
        return;
      }

      // ❌ only real errors reach here
      console.error("Regime API failed:", err);
    });
}, [empCode]);


  const options1 = getFinancialYearOptions();
  const [selectedYear, setSelectedYear] = useState(currentFinancialYear); // Set current financial year as default
  const [declarationInfoList, setDeclarationInfoList] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultOption1 = currentFinancialYear;

  const handleSelect = (selectedOption) => {
    setSelectedYear(selectedOption.value);

    if (selectedOption.value !== "Select Year") {
      setSubmitFinancialYear(selectedOption.value);
      setIsLoading(true);

      axios
        .get(
          `${BASE_URL}:9026/it-declaration-info/get/${simpleEncrypt(
            empCode
          )}/${selectedOption.value}`
        )
        .then((res) => {
          const data = res?.data?.data || [];
          setDeclarationInfoList(data);
          const submitted = data.some((item) => item.is_submitted === true);
          setIsSubmitted(submitted);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching declaration info:", err);
          toast.error("Failed to fetch declaration data");
          setDeclarationInfoList([]);
          setIsSubmitted(false);
          setIsLoading(false);
        });
    } else {
      setSubmitFinancialYear("");
      setDeclarationInfoList([]);
      setIsSubmitted(false);
    }
  };

  useEffect(() => {
    // Set current financial year as default on component mount
    setSubmitFinancialYear(currentFinancialYear);
    setSelectedYear(currentFinancialYear);

    // Fetch data for current financial year on component mount
    setIsLoading(true);
    axios
      .get(
        `${BASE_URL}:9026/it-declaration-info/get/${simpleEncrypt(
          empCode
        )}/${currentFinancialYear}`
      )
      .then((res) => {
        const data = res?.data?.data || [];
        setDeclarationInfoList(data);
        const submitted = data.some((item) => item.is_submitted === true);
        setIsSubmitted(submitted);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching declaration info:", err);
        toast.error("Failed to fetch declaration data");
        setDeclarationInfoList([]);
        setIsSubmitted(false);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setTabStatus(newValue);
  };

  const itDecWindow = () => {
    if (
      submitFinancialYear.length !== 0 &&
      !isNaN(submitFinancialYear?.split("-")?.[0])
    ) {
      navigate("/declaration-dashboard");
    } else {
      Swal.fire({
        text: "Please choose a financial year",
        width: "350px",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleSubmitButton = () => {
    navigate("/declaration-summary");
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = useMediaQuery("(max-width:480px)");
  const isTablet = useMediaQuery("(max-width:768px)");

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: search,
    rendererSettings: {
      preserveAspectRatio: isSmallScreen ? "xMidYMid meet" : "xMidYMid slice",
    },
  };

  const lottieSize = isSmallScreen
    ? { height: 120, width: 120 }
    : isTablet
    ? { height: 150, width: 150 }
    : { height: 250, width: 250 };

  const [particularEmployeeDetails, setParticularEmployeeDetails] = useState(
    ""
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth" if you want animation
    });
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL_EMP}:9020/employee/eCode/${empCode}`)
      .then((res) => {
        setParticularEmployeeDetails(res?.data);
      })
      .catch(() => {
        toast.error("Employee code not found");
      });
  }, [empCode]);

  const goToPreview = () => {
    navigate("/preview");
  };

  const goToEdit = () => {
    navigate("/select-regime");
  };

  const goToDeclarationInvestments = () => {
    if (
      submitFinancialYear.length !== 0 &&
      !isNaN(submitFinancialYear?.split("-")?.[0])
    ) {
      navigate("/select-regime");
    } else {
      Swal.fire({
        text: "Please choose a financial year",
        width: "350px",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  
  const isCurrentFinancialYear = selectedYear === currentFinancialYear;
  const isPreviousFinancialYear =
    selectedYear === previousYear2 || selectedYear === previousYear1;

  const isDeclarationOpen = isCurrentFinancialYear;
  const isDeclarationClosed =
    isPreviousFinancialYear || (isCurrentFinancialYear && isSubmitted);

  // Combined check for isSubmitted OR hasRegime
  const hasSubmittedOrHasRegime = isSubmitted || hasRegime;

  // Check if regime is NEW
  const isNewRegime = regimeType === "NEW";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-grow bg-white ">
        <div className="mt-20">
          <div className="p-4 ">
            <div className="mb-4">
              <div className="flex items-center">
                {/* Left: Breadcrumb */}
                <div className="flex-1">
                  <div className="flex items-center text-sm">
                    <span
                      onClick={() => navigate("/dashboard")}
                      className="
                                  cursor-pointer
                                  text-gray-700
                                  font-medium
                                  transition-all
                                  duration-200
                                  hover:text-[#dc2626]
                                  hover:underline
                                  hover:underline-offset-4
                                "
                    >
                      Home
                    </span>

                    <span className="mx-2 text-gray-400">/</span>

                    <span
                      className="
                                  font-semibold
                                  text-[#dc2626]
                                  cursor-default
                                  transition-all
                                  duration-200
                                  hover:underline
                                  hover:underline-offset-4
                                "
                    >
                      Tax Management
                    </span>
                  </div>
                </div>

                {/* Center: Tabs */}
                <div className="flex justify-center flex-1">
                  <Box>
                    <Tabs
                      value={tabStatus}
                      onChange={handleChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                    >
                      <Tab
                        value="one"
                        label={
                          <Typography
                            sx={{
                              fontWeight: 600,
                              textTransform: "none",
                              fontSize: "16px",
                            }}
                          >
                            IT Declaration
                          </Typography>
                        }
                      />
                      <Tab
                        value="two"
                        label={
                          <Typography
                            sx={{
                              fontWeight: 600,
                              textTransform: "none",
                              fontSize: "16px",
                            }}
                          >
                            Proof of Investments
                          </Typography>
                        }
                      />
                    </Tabs>
                  </Box>
                </div>

                {/* Right: Empty spacer (keeps center truly centered) */}
                <div className="flex-1" />
              </div>

              <div className="border-b border-gray-300 mt-3" />
            </div>

            {tabStatus === "one" ? (
              <div>
                <div className="grid lg:grid-cols-2 mt-20 ">
                  <div className="col-span-1">
                    <div className="flex justify-center">
                      <img
                        className="h-64 w-[340px] rounded-xl mt-20"
                        src={require("./assets/IT Savings.jpg")}
                        alt="IT Savings"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="grid lg:grid-cols-5">
                      <div className="col-span-4 pt-4">
                        <div className="lg:-mt-20 mb-20">
                          <div className="flex justify-center lg:justify-start">
                            <div className="flex space-x-1 items-center mt-5">
                              <div className="custom-dropdown-wrapper">
                                <label className="custom-dropdown-label font-header">
                                  Financial Year:
                                </label>
                                <Dropdown
                                  className="custom-dropdown font-content"
                                  controlClassName="Dropdown-control"
                                  menuClassName="Dropdown-menu"
                                  arrowClassName="Dropdown-arrow"
                                  options={options1}
                                  onChange={handleSelect}
                                  value={defaultOption1}
                                  disabled={isLoading}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center">
                          <h1 className="text-sm lg:text-sm font-bold text-center lg:text-start p-2">
                            {isDeclarationOpen
                              ? "IT Declaration is open now!"
                              : "IT Declaration is closed now!"}
                          </h1>

                          {isLoading && (
                            <div className="flex justify-center mt-4">
                              <Lottie
                                options={lottieOptions}
                                height={lottieSize.height}
                                width={lottieSize.width}
                              />
                            </div>
                          )}

                          {(isSubmitted || hasRegime) && !isLoading && (
                            <div className="text-red-600 text-sm font-semibold text-center lg:text-start p-2">
                              {isNewRegime
                                ? "Your declaration under the New Tax Regime for this financial year has already been submitted."
                                : "You have already submitted the declaration for this financial year."}
                            </div>
                          )}

                          {!isLoading && (
                            <>
                              {(isSubmitted || hasRegime) ? (
                                isCurrentFinancialYear ? (
                                  <h6 className="text-sm font-semibold mt-3 text-center lg:text-start p-2">
                                    {isNewRegime
                                      ? "No further action required. You can edit your declaration if needed."
                                      : "You can preview and edit your submitted declaration."}
                                  </h6>
                                ) : (
                                  <h6 className="text-sm font-semibold mt-3 text-center lg:text-start p-2">
                                    You can preview your submitted declaration.
                                    Editing is not available for previous
                                    financial years.
                                  </h6>
                                )
                              ) : isCurrentFinancialYear ? (
                                <h6 className="text-sm font-semibold mt-3 text-center lg:text-start p-2">
                                  Hurry! Declare your Investment to reduce the
                                  Taxable income and thereby decrease your
                                  income tax.
                                </h6>
                              ) : (
                                <h6 className="text-sm font-semibold mt-3 text-center lg:text-start p-2">
                                  Declaration is closed for previous financial
                                  years.
                                </h6>
                              )}

                              <div className="flex space-x-4 mt-8">
                                {(isSubmitted || hasRegime) ? (
                                  <>
                                    {/* Preview Button - Always enabled for submitted declarations, except for NEW regime */}
                                    {!isNewRegime && (
                                      <div
                                        className="border-2 border-[#dc2626] items-center flex space-x-3 p-2 cursor-pointer rounded-md hover:shadow-md"
                                        style={{
                                          maxWidth: "220px",
                                          fontSize: "0.85rem",
                                        }}
                                        onClick={goToPreview}
                                      >
                                        <div className="ml-2 text-xs text-[#dc2626]">
                                          Preview
                                        </div>
                                        <div className="text-xs text-[#dc2626]">
                                          <FaArrowRightLong />
                                        </div>
                                      </div>
                                    )}

                                    {/* Edit Button - Disabled if not current financial year */}
                                    <div
                                      className={`border-2 border-[#dc2626] items-center flex space-x-3 p-2 rounded-md ${
                                        isCurrentFinancialYear
                                          ? "cursor-pointer hover:shadow-md"
                                          : "opacity-50 pointer-events-none"
                                      }`}
                                      style={{
                                        maxWidth: "220px",
                                        fontSize: "0.85rem",
                                      }}
                                      onClick={
                                        isCurrentFinancialYear
                                          ? goToEdit
                                          : undefined
                                      }
                                    >
                                      <div className="ml-2 text-xs text-[#dc2626]">
                                        Edit
                                      </div>
                                      <div className="text-xs text-[#dc2626]">
                                        <FaArrowRightLong />
                                      </div>
                                      {!isCurrentFinancialYear && (
                                        <div className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap"></div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  // Declarative Investments Button - Disabled for previous financial years
                                  <div
                                    className={`border-2 border-[#dc2626] items-center flex space-x-3 p-2 rounded-md ${
                                      isPreviousFinancialYear
                                        ? "opacity-50 pointer-events-none"
                                        : "cursor-pointer hover:shadow-md"
                                    }`}
                                    style={{
                                      maxWidth: "220px",
                                      fontSize: "0.85rem",
                                    }}
                                    onClick={
                                      !isPreviousFinancialYear
                                        ? goToDeclarationInvestments
                                        : undefined
                                    }
                                  >
                                    <div className="ml-2 text-xs text-[#dc2626]">
                                      Declarative Investments
                                    </div>
                                    <div className="text-xs text-[#dc2626]">
                                      <FaArrowRightLong />
                                    </div>
                                    {isPreviousFinancialYear && (
                                      <div className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap">
                                        Not available for previous financial
                                        years
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Proof_Of_Investment />
            )}
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IT_Declaration;