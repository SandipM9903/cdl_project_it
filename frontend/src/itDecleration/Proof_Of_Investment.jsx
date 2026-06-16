import { Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { FaArrowRightLong } from "react-icons/fa6";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import search from "./animation/Search.json";
import { useStoreFinancialYear } from "./useFileStore";
import { BASE_URL } from "../config/Config";
import { simpleEncrypt } from "../simpleEncrypt";

function Proof_Of_Investment() {
  const empCode = localStorage.getItem("empId");
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1

  // Function to determine current financial year based on March-April logic
  const getCurrentFinancialYear = () => {
    // If current month is January, February, or March (1-3), financial year is previous year-current year
    if (currentMonth >= 1 && currentMonth <= 3) {
      const startYear = currentYear - 1;
      const endYear = currentYear;
      return `${startYear}-${endYear.toString().slice(-2)}`;
    }
    // For April (4) to December (12), financial year is current year-next year
    else {
      const startYear = currentYear;
      const endYear = currentYear + 1;
      return `${startYear}-${endYear.toString().slice(-2)}`;
    }
  };

  // Financial year dropdown logic - past three years including current
  const getFinancialYearOptions = () => {
    const years = ["Select Year"];
    const currentFY = getCurrentFinancialYear();
    const currentStartYear = parseInt(currentFY.split("-")[0]);

    // Get last 3 financial years including current
    for (let i = 2; i >= 0; i--) {
      const startYear = currentStartYear - i;
      const endYear = startYear + 1;
      const financialYear = `${startYear}-${endYear.toString().slice(-2)}`;
      years.push(financialYear);
    }

    // Sort in descending order (most recent first)
    const sortedYears = years
      .filter((year) => year !== "Select Year")
      .sort((b, a) => {
        const aYear = parseInt(a.split("-")[0]);
        const bYear = parseInt(b.split("-")[0]);
        return bYear - aYear;
      });

    return ["Select Year", ...sortedYears];
  };

  const options1 = getFinancialYearOptions();
  const currentFinancialYear = getCurrentFinancialYear();
  const [selectedYear, setSelectedYear] = useState(currentFinancialYear); // Default to current financial year
  const [hasDocumentProof, setHasDocumentProof] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taxRegime, setTaxRegime] = useState(null); // Store tax regime information
  const [isRegimeLoading, setIsRegimeLoading] = useState(false);

  const {
    submitFinancialYear,
    setSubmitFinancialYear,
  } = useStoreFinancialYear();

  // Set default to current financial year
  const defaultOption1 =
    submitFinancialYear.length > 0
      ? options1[options1.indexOf(submitFinancialYear)]
      : currentFinancialYear;

  // Check if selected year is the current financial year
  const isCurrentFinancialYear = selectedYear === currentFinancialYear;

  // Check if current month is January (1) or February (2)
  const isProofSubmissionOpen = currentMonth === 1 || currentMonth === 3;

  // Fetch tax regime information
  const fetchTaxRegime = async () => {
    if (!empCode) return;

    setIsRegimeLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}:9026/api/regimes/emp/${simpleEncrypt(empCode)}`,
      );
      setTaxRegime(response.data);
    } catch (error) {
      console.error("Error fetching tax regime:", error);
      // If there's an error, assume old regime to allow proof submission
      setTaxRegime({ regime: "OLD" });
    } finally {
      setIsRegimeLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxRegime();
  }, [empCode]);

  const handleSelect = (selectedOption) => {
    setSelectedYear(selectedOption.value);
    if (selectedOption.value !== "Select Year") {
      setSubmitFinancialYear(selectedOption.value);
      checkProofExistence(selectedOption.value);
    } else {
      setSubmitFinancialYear("");
      setHasDocumentProof(false);
    }
  };

  useEffect(() => {
    // Initialize with current financial year
    setSubmitFinancialYear(currentFinancialYear);
    setSelectedYear(currentFinancialYear);
    checkProofExistence(currentFinancialYear);
  }, [setSubmitFinancialYear, currentFinancialYear]);

  // Check if proof data exists for the selected financial year
  const checkProofExistence = async (financialYear) => {
    if (financialYear === "Select Year") {
      setHasDocumentProof(false);
      return;
    }

    setIsLoading(true);
    try {
      const proofResponse = await axios.get(
        `${BASE_URL}:9026/proof-of-investment/get-all-proof/${simpleEncrypt(
          empCode,
        )}/${financialYear}`,
      );

      const proofData = proofResponse?.data?.data || [];

      // Check if we have any proof data with any proof ID
      const hasProof =
        proofData.length > 0 &&
        proofData.some((proof) => {
          return (
            (proof.documentProfId !== null &&
              proof.documentProfId !== undefined) ||
            (proof.documentProofId !== null &&
              proof.documentProofId !== undefined) ||
            (proof.proofId !== null && proof.proofId !== undefined) ||
            (proof.id !== null && proof.id !== undefined) ||
            (proof.documentId !== null && proof.documentId !== undefined) ||
            (proof.proofDocumentId !== null &&
              proof.proofDocumentId !== undefined)
          );
        });

      setHasDocumentProof(hasProof);
    } catch (error) {
      console.error("Error checking proof existence:", error);
      // If there's an error (like 404), assume no proof exists
      setHasDocumentProof(false);

      // Show error toast only if it's not a 404 (not found is expected)
      if (error.response?.status !== 404) {
        toast.error("Failed to check proof status");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (
      submitFinancialYear.length !== 0 &&
      !isNaN(submitFinancialYear?.split("-")?.[0])
    ) {
      navigate("/preview-proof-of-investment");
    } else {
      Swal.fire({
        text: "Please choose a financial year",
        width: "350px",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleEdit = () => {
    if (
      submitFinancialYear.length !== 0 &&
      !isNaN(submitFinancialYear?.split("-")?.[0])
    ) {
      navigate("/display-proof-of-investment");
    } else {
      Swal.fire({
        text: "Please choose a financial year",
        width: "350px",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleSubmitProofs = () => {
    if (
      submitFinancialYear.length !== 0 &&
      !isNaN(submitFinancialYear?.split("-")?.[0])
    ) {
      navigate("/display-proof-of-investment");
    } else {
      Swal.fire({
        text: "Please choose a financial year",
        width: "350px",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

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

  const isProofOpen = isProofSubmissionOpen && isCurrentFinancialYear;

  // Check if user has opted for New Tax Regime
  const isNewTaxRegime = taxRegime?.regime?.toUpperCase() === "NEW";

  // Determine if submit proofs should be disabled
  const isSubmitDisabled =
    isNewTaxRegime || !isCurrentFinancialYear || !isProofSubmissionOpen;

  return (
    <div>
      <div className="grid lg:grid-cols-2 mt-20">
        <div className="col-span-1">
          <div className="flex justify-center">
            <img
              className="h-64 w-[340px] rounded-xl mt-20"
              src={require("./assets/proof.png")}
              alt="Proof of Investment"
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
                        disabled={isLoading || isRegimeLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <h1 className="text-sm lg:text-sm font-bold text-center lg:text-start p-2">
                  {isProofOpen
                    ? "Proof of investment is open now!"
                    : "Proof of investment is closed now!"}
                </h1>

                {(isLoading || isRegimeLoading) && (
                  <div className="flex justify-center mt-4">
                    <Lottie
                      options={lottieOptions}
                      height={lottieSize.height}
                      width={lottieSize.width}
                    />
                  </div>
                )}

                {!isLoading && !isRegimeLoading && (
                  <>
                    {/* Display tax regime information */}
                    {taxRegime && (
                      <div
                        className={`text-sm font-semibold mt-1 text-center lg:text-start p-2 ${
                          isNewTaxRegime ? "text-red-600" : "text-green-600"
                        }`}
                      ></div>
                    )}

                    {hasDocumentProof && (
                      <div className="text-red-600 text-sm font-semibold text-center lg:text-start p-2">
                        You have already submitted proofs for this financial
                        year.
                      </div>
                    )}

                    {!isLoading && (
                      <>
                        {hasDocumentProof ? (
                          isCurrentFinancialYear ? (
                            <h6 className="text-sm font-semibold mt-3 text-center lg:text-start p-2">
                              You can preview and edit your submitted proofs.
                            </h6>
                          ) : (
                            <h6 className="text-sm font-semibold mt-3 text-center lg:text-start p-2">
                              You can preview your submitted proofs. Editing is
                              not available for previous financial years.
                            </h6>
                          )
                        ) : isCurrentFinancialYear &&
                          isProofSubmissionOpen &&
                          !isNewTaxRegime ? (
                          <h6 className="text-sm font-semibold mt-3 text-center lg:text-start p-2">
                            Submit the proofs for the Investment you had
                            declared in the IT declaration for the current
                            financial year
                          </h6>
                        ) : isNewTaxRegime ? (
                          <h6 className="text-sm font-semibold mt-3 text-center lg:text-start p-2 text-red-600">
                            Submission of investment proofs is not required as
                            you have opted for the New Tax Regime.
                          </h6>
                        ) : (
                          <h6 className="text-sm font-semibold mt-3 text-center lg:text-start p-2">
                            {isCurrentFinancialYear
                              ? "Proof submission is open only in January and February."
                              : "Proof submission is closed for previous financial years."}
                          </h6>
                        )}

                        <div className="flex space-x-4 mt-8 p-2">
                          {hasDocumentProof ? (
                            <>
                              {/* Preview Button - Always enabled for submitted proofs */}
                              <div
                                className="border-2 border-[#dc2626] items-center flex space-x-3 p-2 cursor-pointer rounded-md hover:shadow-md"
                                style={{
                                  maxWidth: "120px",
                                  fontSize: "0.85rem",
                                }}
                                onClick={handlePreview}
                              >
                                <div className="ml-2 text-xs text-[#dc2626]">
                                  Preview
                                </div>
                                <div className="text-xs text-[#dc2626]">
                                  <FaArrowRightLong />
                                </div>
                              </div>

                              {/* Edit Button - Disabled if not current financial year or not Jan-Feb or NEW regime */}
                              <div
                                className={`border-2 border-[#dc2626] items-center flex space-x-3 p-2 rounded-md ${
                                  isCurrentFinancialYear &&
                                  isProofSubmissionOpen &&
                                  !isNewTaxRegime
                                    ? "cursor-pointer hover:shadow-md"
                                    : "opacity-50 pointer-events-none"
                                }`}
                                style={{
                                  maxWidth: "100px",
                                  fontSize: "0.85rem",
                                }}
                                onClick={
                                  isCurrentFinancialYear &&
                                  isProofSubmissionOpen &&
                                  !isNewTaxRegime
                                    ? handleEdit
                                    : undefined
                                }
                              >
                                <div className="ml-2 text-xs text-[#dc2626]">
                                  Edit
                                </div>
                                <div className="text-xs text-[#dc2626]">
                                  <FaArrowRightLong />
                                </div>
                                {isNewTaxRegime && (
                                  <div className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap">
                                    Not required for New Tax Regime
                                  </div>
                                )}
                                {!isCurrentFinancialYear && !isNewTaxRegime && (
                                  <div className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap">
                                    Not available for previous financial years
                                  </div>
                                )}
                                {isCurrentFinancialYear &&
                                  !isProofSubmissionOpen &&
                                  !isNewTaxRegime && (
                                    <div className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap">
                                      Available only in Jan-Feb
                                    </div>
                                  )}
                              </div>
                            </>
                          ) : (
                            // Submit Proofs Button - Disabled for previous financial year or not Jan-Feb or NEW regime
                            <div
                              className={`border-2 border-[#dc2626] items-center flex space-x-3 p-2 rounded-md ${
                                isCurrentFinancialYear &&
                                isProofSubmissionOpen &&
                                !isNewTaxRegime
                                  ? "cursor-pointer hover:shadow-md"
                                  : "opacity-50 pointer-events-none"
                              }`}
                              style={{
                                maxWidth: "150px",
                                fontSize: "0.85rem",
                              }}
                              onClick={
                                isCurrentFinancialYear &&
                                isProofSubmissionOpen &&
                                !isNewTaxRegime
                                  ? handleSubmitProofs
                                  : undefined
                              }
                            >
                              <div className="ml-2 text-xs text-[#dc2626]">
                                Submit Proofs
                              </div>
                              <div className="text-xs text-[#dc2626]">
                                <FaArrowRightLong />
                              </div>
                              {isNewTaxRegime && (
                                <div className="absolute -bottom-6 text-xs text-red-500 whitespace-nowrap">
                                  Not required for New Tax Regime
                                </div>
                              )}
                              {!isCurrentFinancialYear && !isNewTaxRegime && (
                                <div className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap">
                                  Not available for previous financial years
                                </div>
                              )}
                              {isCurrentFinancialYear &&
                                !isProofSubmissionOpen &&
                                !isNewTaxRegime && (
                                  <div className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap">
                                    Available only in Jan-Feb
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container with proper configuration */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
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

export default Proof_Of_Investment;
