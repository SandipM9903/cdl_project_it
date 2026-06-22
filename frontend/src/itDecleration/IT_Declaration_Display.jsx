import {
  Box,
  Modal,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { ImCancelCircle } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdOutlineModeEditOutline } from "react-icons/md";

import Service from "./Service";
import {
  useFileStore,
  useStoreFinancialYear,
  useStoreSaveStatus80c,
  useStoreSaveStatus80d,
  useStoreSaveStatus80e,
} from "./useFileStore";
import Header from "../components/Header";

function IT_Declaration_Display() {
  const [proofData, setProofData] = useState([]);
  const SECTION_80C_LIMIT = 150000;
  const SECTION_80C_IDS = [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23];
  const SECTION_80CCD_LIMIT = 50000;
  const SECTION_MEDICLAIM_LIMIT = 25000;
  const SECTION_80DDB_LIMIT = 40000;

  const SECTION_80CCD_ID = 7;
  const SECTION_MEDICLAIM_ID = 15;
  const SECTION_80DDB_ID = 10;
  const { regime } = useFileStore();
  const { submitFinancialYear } = useStoreFinancialYear();

  const { saveStatus80c, setSaveStatus80c } = useStoreSaveStatus80c();
  const { saveStatus80d, setSaveStatus80d } = useStoreSaveStatus80d();
  const { saveStatus80e, setSaveStatus80e } = useStoreSaveStatus80e();

  const empCode = localStorage.getItem("empId");
  const navigate = useNavigate();

  // Modal states for sections
  const [open80c, setOpen80c] = useState(false);
  const [open80d, setOpen80d] = useState(false);
  const [open80e, setOpen80e] = useState(false);

  // Confirmation modal state
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // Update states
  const [isUpdate80c, setIsUpdate80c] = useState(false);
  const [isUpdate80d, setIsUpdate80d] = useState(false);
  const [isUpdate80e, setIsUpdate80e] = useState(false);

  // Data states
  const [allSectionName, setAllSectionName] = useState([]);

  // Landlord details state for Section 80E
  const [landlordDetails, setLandlordDetails] = useState({
    name: "",
    panNumber: ""
  });

  // Store original landlord details for comparison
  const [savedLandlordDetails, setSavedLandlordDetails] = useState({
    name: "",
    panNumber: ""
  });

  // Loading state for landlord details
  const [loadingLandlord, setLoadingLandlord] = useState(false);

  // Total amounts
  const [totalAmountSection80c, setTotalAmountSection80c] = useState(0);
  const [totalAmountSection80d, setTotalAmountSection80d] = useState(0);
  const [totalAmountSection80e, setTotalAmountSection80e] = useState(0);

  // Store original saved data for comparison
  const [savedSectionData, setSavedSectionData] = useState([]);

  // Modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 1100,
    width: "95%",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  // Confirmation modal style
  const confirmModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 3,
  };

  const fetchProofData = () => {
    Service.fetchNewProofOfInvestmentBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    )
      .then((res) => {
        setProofData(res?.data?.data || []);
      })
      .catch(() => setProofData([]));
  };

  // Fetch landlord details
  const fetchLandlordDetails = async () => {
    if (!empCode) return;

    setLoadingLandlord(true);
    try {
      const response = await Service.getLandlordDetails(empCode);
      if (response?.data) {
        const data = response.data;
        setLandlordDetails({
          name: data.landlordName || "",
          panNumber: data.landlordPanNumber || ""
        });
        setSavedLandlordDetails({
          name: data.landlordName || "",
          panNumber: data.landlordPanNumber || ""
        });
      }
    } catch (error) {
      console.error("Error fetching landlord details:", error);
      // If error (like 404), set empty details
      setLandlordDetails({ name: "", panNumber: "" });
      setSavedLandlordDetails({ name: "", panNumber: "" });
    } finally {
      setLoadingLandlord(false);
    }
  };

  // Close modal effects
  useEffect(() => {
    if (saveStatus80c === "true") {
      setOpen80c(false);
      setIsUpdate80c(false);
    }
  }, [saveStatus80c]);

  useEffect(() => {
    if (saveStatus80d === "true") {
      setOpen80d(false);
      setIsUpdate80d(false);
    }
  }, [saveStatus80d]);

  useEffect(() => {
    if (saveStatus80e === "true") {
      setOpen80e(false);
      setIsUpdate80e(false);
    }
  }, [saveStatus80e]);

  // Function to check if section 12 (House Rent Exemption Section 10(13A)) has a value
  // const hasAnySectionValue = (sections) => {
  //   return sections.some(
  //     section => section.itDecId === 12 && 
  //     section.declarationAmount && 
  //     String(section.declarationAmount).trim() !== "" &&
  //     parseFloat(section.declarationAmount) > 0
  //   );
  // };
  const isRentFilled = (sections) => {
    return sections.some(
      section =>
        Number(section.itDecId) === 12 &&
        section.declarationAmount &&
        Number(section.declarationAmount) > 0
    );
  };

  // Function to clear landlord details in backend
  // const clearLandlordDetailsInBackend = async () => {
  //   try {
  //     const payload = {
  //       landlordName: null,
  //       landlordPanNumber: null
  //     };
  //     await Service.updateLandlordDetails(empCode, payload);
  //     console.log("Landlord details cleared in backend");
  //   } catch (error) {
  //     console.error("Error clearing landlord details:", error);
  //     // Don't throw the error, just log it
  //   }
  // };

  // Function to clear landlord details
  const clearLandlordDetails = () => {
    // only UI reset, backend controlled
    setLandlordDetails(prev => prev);
  };

  // Fetch initial data
  const fetchAllSectionNameInitially = () => {
    Service.fetchAllSectionName().then((res) => {
      const sectionList = res?.data?.data || [];
      Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
        empCode,
        submitFinancialYear,
      )
        .then((userRes) => {
          const userData = userRes?.data?.data || [];
          const merged = sectionList.map((section) => {
            const userSection = userData.find(
              (u) => u.itDecId === section.itDecId,
            );

            return userSection
              ? {
                ...section,
                itInfoId: userSection.itInfoId,
                declarationAmount: userSection.declarationAmount,
                empCode: userSection.empCode,
                financialYear: userSection.financialYear,
                taxRegime: userSection.taxRegime,
              }
              : section;
          });
          setAllSectionName(merged);
          setSavedSectionData(merged);

          // Fetch landlord details after section data is loaded
          fetchLandlordDetails();
        })
        .catch(() => {
          setAllSectionName(sectionList);
          setSavedSectionData(sectionList);
          fetchLandlordDetails();
        });
    });
  };

  useEffect(() => {
    fetchAllSectionNameInitially();
    fetchProofData();
  }, []);

  const syncProofWithDeclaration = (cleanedData) => {
    const proofMap = new Map(
      proofData.map(p => [Number(p.itDecId), p])
    );

    const proofUpdatePayload = cleanedData
      .filter(section => proofMap.has(Number(section.itDecId)))
      .map(section => {
        const proofRecord = proofMap.get(Number(section.itDecId));

        return {
          documentProfId: proofRecord.documentProfId,
          empCode,
          itDecId: section.itDecId,
          financialYear: submitFinancialYear,
          revisedAmount: Number(section.declarationAmount || 0),
        };
      });

    if (!proofUpdatePayload.length) return Promise.resolve();

    return Service.updateBulkProofInvestment(proofUpdatePayload);
  };

  // Fetch totals on mount
  useEffect(() => {
    getTotalSumBySummingAllDataOfSectionC();
    getTotalSumBySummingAllDataOfSectionD();
    getTotalSumBySummingAllDataOfSectionE();
  }, []);

  // Handle input changes
  const handleChangeIT_DeclarationSection80 = async (e, itDecId) => {
    const key = e.target.name;
    const value = e.target.value;

    const parseAmt = (amt) => {
      if (amt === null || amt === undefined || amt === "") return 0;
      const n = Number(String(amt).replace(/,/g, ""));
      return isNaN(n) ? 0 : n;
    };

    const savedValue =
      savedSectionData.find((s) => Number(s.itDecId) === Number(itDecId))
        ?.declarationAmount || 0;

    const oldSavedAmount = Number(savedValue);
    const newTypedAmount = Number(value);

    const oldTotal80C = (savedSectionData || [])
      .filter((s) => SECTION_80C_IDS.includes(Number(s.itDecId)))
      .reduce((total, s) => total + parseAmt(s.declarationAmount), 0);

    // ✅ Validation for 80CCD (Employee NPS) - Max 50,000
    if (Number(itDecId) === SECTION_80CCD_ID) {
      if (
        newTypedAmount > SECTION_80CCD_LIMIT &&
        newTypedAmount > oldSavedAmount
      ) {
        Swal.fire({
          icon: "warning",
          text: "Maximum deduction allowed is ₹50,000 under Section 80CCD.",
          width: "450px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "999999";
          },
        });
        return;
      }
    }

    // ✅ Validation for Mediclaim Premium (Self/Spouse/Child) - Max 25,000
    if (Number(itDecId) === SECTION_MEDICLAIM_ID) {
      if (
        newTypedAmount > SECTION_MEDICLAIM_LIMIT &&
        newTypedAmount > oldSavedAmount
      ) {
        Swal.fire({
          icon: "warning",
          text:
            "Maximum deduction allowed is ₹25,000 for Mediclaim Premium (Self, Spouse & Child).",
          width: "450px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "999999";
          },
        });
        return;
      }
    }

    // ✅ Validation for 80DDB - Max 40,000
    if (Number(itDecId) === SECTION_80DDB_ID) {
      if (
        newTypedAmount > SECTION_80DDB_LIMIT &&
        newTypedAmount > oldSavedAmount
      ) {
        Swal.fire({
          icon: "warning",
          text: "Maximum deduction allowed is ₹40,000 under Section 80DDB.",
          width: "450px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "999999";
          },
        });
        return;
      }
    }

    // 🔥 If section is 80C, check total instantly
    if (SECTION_80C_IDS.includes(Number(itDecId))) {
      const currentTotal = (allSectionName || [])
        .filter((s) => SECTION_80C_IDS.includes(Number(s.itDecId)))
        .reduce((total, s) => {
          if (Number(s.itDecId) === Number(itDecId)) {
            return total + parseAmt(value);
          }
          return total + parseAmt(s.declarationAmount);
        }, 0);

      if (currentTotal > SECTION_80C_LIMIT && currentTotal > oldTotal80C) {
        Swal.fire({
          icon: "warning",
          text: "Total Section 80C deduction cannot exceed ₹1,50,000",
          width: "450px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "999999";
          },
        });
        return;
      }
    }

    // ✅ Validation for Housing Loan Interest (itDecId = 14)
    if (Number(itDecId) === 14) {
      if (newTypedAmount > 200000 && newTypedAmount > oldSavedAmount) {
        Swal.fire({
          icon: "warning",
          text: "Interest paid on Housing Loan cannot exceed ₹2,00,000",
          width: "450px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "999999";
          },
        });
        return;
      }
    }

    const updatedSections = allSectionName.map((section) =>
      Number(section.itDecId) === Number(itDecId)
        ? {
          ...section,
          declarationAmount: value,
          empCode: empCode,
          financialYear: submitFinancialYear,
          taxRegime: regime === "Old Regime" ? 0 : 1,
        }
        : section,
    );

    setAllSectionName(updatedSections);

    // Check if we need to clear landlord details based on sections 12, 13, 14
    const rentFilled = isRentFilled(updatedSections);

    // ❌ DO NOTHING — let backend decide

  };

  // Handle landlord details change
  const handleLandlordChange = (e) => {
    const { name, value } = e.target;
    setLandlordDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate landlord details for Section 10(13A) - House Rent Exemption only
  // const validateLandlordDetails = () => {
  //   const hasAnySectionValue = allSectionName.some(
  //     section => section.itDecId === 12 && 
  //     section.declarationAmount && 
  //     String(section.declarationAmount).trim() !== "" &&
  //     parseFloat(section.declarationAmount) > 0
  //   );

  //   if (hasAnySectionValue) {
  //     if (!landlordDetails.name || !landlordDetails.name.trim()) {
  //       Swal.fire({
  //         icon: "warning",
  //         text: "Owner Name is mandatory when declaring an amount under House Rent Exemption [Section 10(13A)]",
  //         width: "450px",
  //         confirmButtonColor: "#dc2626",
  //         backdrop: true,
  //         didOpen: () => {
  //           const swalContainer = document.querySelector(".swal2-container");
  //           if (swalContainer) swalContainer.style.zIndex = "999999";
  //         },
  //       });
  //       return false;
  //     }
  //     if (!landlordDetails.panNumber || !landlordDetails.panNumber.trim()) {
  //       Swal.fire({
  //         icon: "warning",
  //         text: "Owner PAN Number is mandatory when declaring an amount under House Rent Exemption [Section 10(13A)]",
  //         width: "450px",
  //         confirmButtonColor: "#dc2626",
  //         backdrop: true,
  //         didOpen: () => {
  //           const swalContainer = document.querySelector(".swal2-container");
  //           if (swalContainer) swalContainer.style.zIndex = "999999";
  //         },
  //       });
  //       return false;
  //     }
  //     // Basic PAN validation
  //     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  //     if (!panRegex.test(landlordDetails.panNumber.toUpperCase())) {
  //       Swal.fire({
  //         icon: "warning",
  //         text: "Please enter a valid PAN Number (e.g., ABCDE1234F)",
  //         width: "450px",
  //         confirmButtonColor: "#dc2626",
  //         backdrop: true,
  //         didOpen: () => {
  //           const swalContainer = document.querySelector(".swal2-container");
  //           if (swalContainer) swalContainer.style.zIndex = "999999";
  //         },
  //       });
  //       return false;
  //     }
  //   }
  //   return true;
  // };
  const validateLandlordDetails = () => {
    const rentSection = allSectionName.find(
      (section) => Number(section.itDecId) === 12
    );

    const rentAmount = Number(rentSection?.declarationAmount || 0);

    const loanSection = allSectionName.find(
      (section) => Number(section.itDecId) === 14
    );

    const loanAmount = Number(loanSection?.declarationAmount || 0);

    // ✅ CASE 1: Loan filled → DO NOT validate landlord
    if (loanAmount > 0) {
      return true;
    }

    // ✅ CASE 2: Rent <= 8000 → NOT mandatory
    if (rentAmount <= 8000) {
      return true;
    }

    // ✅ CASE 3: Rent > 8000 → mandatory
    if (rentAmount > 8000) {
      if (!landlordDetails.name || !landlordDetails.name.trim()) {
        Swal.fire({
          icon: "warning",
          text: "Landlord Name is mandatory when rent exceeds ₹8000",
          confirmButtonColor: "#dc2626",
        });
        return false;
      }

      if (!landlordDetails.panNumber || !landlordDetails.panNumber.trim()) {
        Swal.fire({
          icon: "warning",
          text: "Landlord PAN is mandatory when rent exceeds ₹8000",
          confirmButtonColor: "#dc2626",
        });
        return false;
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(landlordDetails.panNumber.toUpperCase())) {
        Swal.fire({
          icon: "warning",
          text: "Enter valid PAN (ABCDE1234F)",
          confirmButtonColor: "#dc2626",
        });
        return false;
      }
    }

    return true;
  };

  const saveLandlordDetails = async () => {
    const rentSection = allSectionName.find(
      (section) => Number(section.itDecId) === 12
    );

    const rentAmount = Number(rentSection?.declarationAmount || 0);

    const loanSection = allSectionName.find(
      (section) => Number(section.itDecId) === 14
    );

    const loanAmount = Number(loanSection?.declarationAmount || 0);

    // ✅ CASE 1: Loan filled → skip landlord API completely
    if (loanAmount > 0) {
      return Promise.resolve();
    }

    // ✅ CASE 2: Rent <= 8000 → skip landlord API completely
    if (rentAmount <= 8000) {
      return Promise.resolve();
    }

    // ✅ CASE 3: Rent > 8000 → send landlord
    const payload = {
      landlordName: landlordDetails.name?.trim(),
      landlordPanNumber: landlordDetails.panNumber?.toUpperCase()?.trim()
    };

    return Service.updateLandlordDetails(empCode, payload);
  };

  // Section 80C functions
  const calculateSumCFunction = () => {
    setTotalAmountSection80c(
      allSectionName
        ?.filter((section) =>
          [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23].includes(section.itDecId),
        )
        ?.reduce(
          (total, section) =>
            total + (parseFloat(section.declarationAmount) || 0),
          0,
        ),
    );
  };

  const getTotalSumBySummingAllDataOfSectionC = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => {
      setTotalAmountSection80c(
        res?.data?.data
          ?.filter((section) =>
            [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23].includes(section.itDecId),
          )
          ?.reduce(
            (total, section) =>
              total + (parseFloat(section.declarationAmount) || 0),
            0,
          ),
      );
    });
  };

  const prepareDataForSave = () => {
    return allSectionName.map((section) => {
      const val = section.declarationAmount;

      const parsedAmount =
        val === null || val === undefined || String(val).trim() === ""
          ? null
          : Number(val);

      return {
        ...section,
        empCode: empCode,
        financialYear: submitFinancialYear,
        taxRegime: regime === "Old Regime" ? 0 : 1,
        declarationAmount: parsedAmount,
      };
    });
  };

  const handleSubmitSection80C = () => {
    const total80C = getTotalByIds([1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23]);

    const oldTotal80C = (savedSectionData || [])
      .filter((s) => SECTION_80C_IDS.includes(Number(s.itDecId)))
      .reduce((total, s) => total + Number(s.declarationAmount || 0), 0);

    if (total80C > SECTION_80C_LIMIT && total80C >= oldTotal80C) {
      Swal.fire({
        icon: "warning",
        text:
          "Amount exceeds ₹1,50,000. Maximum allowable deduction is ₹1,50,000.",
        width: "450px",
        confirmButtonColor: "#dc2626",
        backdrop: true,
        didOpen: () => {
          const swalContainer = document.querySelector(".swal2-container");
          if (swalContainer) swalContainer.style.zIndex = "999999";
        },
      });
      return;
    }

    const cleanedData = prepareDataForSave();
    Service.postSection80Data(cleanedData)
      .then(() => syncProofWithDeclaration(cleanedData))
      .then(() => fetchProofData())
      .then(() => {
        setOpen80c(false);
        Swal.fire({
          text: isUpdate80c
            ? "Section 80-C updated successfully"
            : "Section 80-C saved successfully",
          icon: "success",
          width: "350px",
          timer: 2000,
          showConfirmButton: false,
        });
        calculateSumCFunction();
        fetchAllSectionNameInitially();
        setSaveStatus80c("true");
        setIsUpdate80c(false);
      });
  };

  // Section 80D functions
  const calculateSumDFunction = () => {
    setTotalAmountSection80d(
      allSectionName
        ?.filter((section) =>
          [7, 8, 10, 11, 15, 16, 17].includes(section.itDecId),
        )
        ?.reduce(
          (total, section) =>
            total + (parseFloat(section.declarationAmount) || 0),
          0,
        ),
    );
  };

  const getTotalSumBySummingAllDataOfSectionD = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => {
      setTotalAmountSection80d(
        res?.data?.data
          ?.filter((section) =>
            [7, 8, 10, 11, 15, 16, 17].includes(section.itDecId),
          )
          ?.reduce(
            (total, section) =>
              total + (parseFloat(section.declarationAmount) || 0),
            0,
          ),
      );
    });
  };

  const handleSubmitSection80D = () => {
    const cleanedData = prepareDataForSave();
    Service.postSection80Data(cleanedData)
      .then(() => syncProofWithDeclaration(cleanedData))
      .then(() => fetchProofData())
      .then(() => {
        setOpen80d(false);
        Swal.fire({
          text: isUpdate80d
            ? "Section 80-D updated successfully"
            : "Section 80-D saved successfully",
          icon: "success",
          width: "350px",
          timer: 2000,
          showConfirmButton: false,
        });
        calculateSumDFunction();
        fetchAllSectionNameInitially();
        setSaveStatus80d("true");
        setIsUpdate80d(false);
      });
  };

  // Section 80E functions
  const calculateSumEFunction = () => {
    setTotalAmountSection80e(
      allSectionName
        ?.filter((section) => [12, 13, 14].includes(section?.itDecId))
        ?.reduce(
          (total, section) =>
            total + (parseFloat(section.declarationAmount) || 0),
          0,
        ),
    );
  };

  const getTotalSumBySummingAllDataOfSectionE = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => {
      setTotalAmountSection80e(
        res?.data?.data
          ?.filter((section) => [12, 13, 14].includes(section?.itDecId))
          ?.reduce(
            (total, section) =>
              total + (parseFloat(section.declarationAmount) || 0),
            0,
          ),
      );
    });
  };

  const handleSubmitSection80E = () => {
    // Validate landlord details first
    if (!validateLandlordDetails()) {
      return;
    }

    const cleanedData = prepareDataForSave();

    // First save the declaration data
    Service.postSection80Data(cleanedData)
      .then(() => syncProofWithDeclaration(cleanedData))
      .then(() => fetchProofData())
      // Then save landlord details if needed
      .then(() => saveLandlordDetails())
      .then(() => {
        Swal.fire({
          text: isUpdate80e
            ? "Section 80-E updated successfully"
            : "Section 80-E saved successfully",
          icon: "success",
          width: "350px",
          timer: 2000,
          showConfirmButton: false,
        });
        calculateSumEFunction();
        setSaveStatus80e("true");
        setIsUpdate80e(false);
        setOpen80e(false);
        // Update saved landlord details
        setSavedLandlordDetails({ ...landlordDetails });
      })
      .catch((error) => {
        console.error("Error saving section 80E:", error);
        Swal.fire({
          icon: "error",
          text: "Failed to save. Please try again.",
          width: "450px",
          confirmButtonColor: "#dc2626",
        });
      });
  };

  // Helper functions
  const handlePreview = () => {
    navigate("/preview", {
      state: { fromEdit: true },
    });
  };

  const clearSectionByIds = async (ids) => {
    setAllSectionName((prev) => {
      const updated = prev.map((section) => {
        if (ids.includes(section.itDecId)) {
          const savedSection = savedSectionData.find(
            (s) => s.itDecId === section.itDecId,
          );
          return {
            ...section,
            declarationAmount: savedSection?.declarationAmount || "",
          };
        }
        return section;
      });

      // Check if we need to clear landlord details
      const rentFilled = isRentFilled(updated);



      return updated;
    });
  };

  const getTotalByIds = (ids) => {
    const parseAmt = (amt) => {
      if (amt === null || amt === undefined || amt === "") return 0;
      const n = Number(String(amt).replace(/,/g, ""));
      return isNaN(n) ? 0 : n;
    };

    return (allSectionName || [])
      .filter((section) => ids.includes(Number(section.itDecId)))
      .reduce(
        (total, section) => total + parseAmt(section.declarationAmount),
        0,
      );
  };

  // Reload functions for edit mode
  const reloadSection80C = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => {
      const updated = allSectionName.map((section) => {
        const saved = res?.data?.data?.find(
          (s) => s.itDecId === section.itDecId,
        );
        return saved
          ? { ...section, declarationAmount: saved.declarationAmount }
          : section;
      });
      setAllSectionName(updated);
      setSavedSectionData(updated);
    });
  };

  const reloadSection80D = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => {
      const updated = allSectionName.map((section) => {
        const saved = res?.data?.data?.find(
          (s) => s.itDecId === section.itDecId,
        );
        return saved
          ? { ...section, declarationAmount: saved.declarationAmount }
          : section;
      });
      setAllSectionName(updated);
      setSavedSectionData(updated);
    });
  };

  const reloadSection80E = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => {
      const updated = allSectionName.map((section) => {
        const saved = res?.data?.data?.find(
          (s) => s.itDecId === section.itDecId,
        );
        return saved
          ? { ...section, declarationAmount: saved.declarationAmount }
          : section;
      });
      setAllSectionName(updated);
      setSavedSectionData(updated);

      // Fetch landlord details again
      fetchLandlordDetails();
    });
  };

  // Handle edit actions
  const handleEdit80c = () => {
    reloadSection80C();
    setOpen80c(true);
    setIsUpdate80c(true);
  };

  const handleEdit80d = () => {
    reloadSection80D();
    setOpen80d(true);
    setIsUpdate80d(true);
  };

  const handleEdit80e = () => {
    reloadSection80E();
    setOpen80e(true);
    setIsUpdate80e(true);
  };

  // Handle close actions
  const handleClose80c = () => {
    setOpen80c(false);
    setIsUpdate80c(false);
  };

  const handleClose80d = () => {
    setOpen80d(false);
    setIsUpdate80d(false);
  };

  const handleClose80e = () => {
    setOpen80e(false);
    setIsUpdate80e(false);
    // Reset to saved landlord details on close without saving
    setLandlordDetails({ ...savedLandlordDetails });
  };

  // Submit confirmation and navigation
  const handleSubmitConfirmation = () => {
    setOpenConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setOpenConfirmModal(false);
    navigate("/declaration-summary");
  };

  const handleCancelSubmit = () => {
    setOpenConfirmModal(false);
  };

  const clean80CDescription = (desc) => {
    if (!desc) return "";

    return desc
      .replace(/\(Max\.?Rs\.?150,?000\/-\)/gi, "")
      .replace(/\(Limit upto 150,?000\/-\)/gi, "")
      .replace(/maximum\s*Rs\.?\s*150,?000\/-/gi, "")
      .replace(/Rs\.?\s*150,?000\/-/gi, "")
      .trim();
  };

  // Check if landlord fields should be enabled
  const isLandlordEnabled = isRentFilled(allSectionName);

  return (
    <div className="flex flex-col min-h-screen font-content">
      <Header />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-full flex-grow bg-white">
        <div className="mt-20">
          {/* Breadcrumb and header section */}
          <div className="border-b-[2px] border-gray-300 mt-1 px-4"></div>
          <div className="mt-8">
            <div className="relative flex items-center mb-8 px-4">
              <div className="flex items-center text-sm">
                <span
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer text-gray-700 font-medium transition-all duration-200 hover:text-[#dc2626] hover:underline hover:underline-offset-4"
                >
                  Home
                </span>
                <span className="mx-2 text-gray-400">/</span>
                <span
                  onClick={() => navigate("/tax")}
                  className="cursor-pointer text-gray-700 font-medium transition-all duration-200 hover:text-[#dc2626] hover:underline hover:underline-offset-4"
                >
                  Tax Management
                </span>
                <span className="mx-2 text-gray-400">/</span>
                <span
                  onClick={() => navigate("/select-regime")}
                  className="cursor-pointer text-gray-700 font-medium transition-all duration-200 hover:text-[#dc2626] hover:underline hover:underline-offset-4"
                >
                  Select Regime
                </span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="font-semibold text-[#dc2626] cursor-default transition-all duration-200">
                  Declaration window
                </span>
              </div>

              {/* Info banner */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="bg-red-50 border border-red-100 rounded-lg shadow-sm px-6">
                  <div className="flex items-center space-x-3 py-2">
                    <HiOutlineInformationCircle className="text-xl text-red-600" />
                    <p className="text-gray-600 text-sm font-medium">
                      Declaration window is open
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-[42px]" />
            </div>

            <div className="text-center text-gray-500 lg:text-sm md:text-sm mt-3 font-normal">
              Enter your planned investment declarations here and choose the
              desired regime in the following page
            </div>

            {/* Section cards */}
            <div className="mt-12">
              <div className="grid grid-cols-3 gap-28 md:gap-8 lg:gap-28 px-32 lg:px-32 md:px-10">
                {/* Section 80C Card */}
                <div className="md:col-span-1 col-span-3 md:-ml-0 -ml-16">
                  <div className="border-[2px] border-gray-300 shadow-xl">
                    <h2 className="text-gray-700 text-sm md:text-sm lg:text-sm text-center font-medium py-1 md:py-[18px] lg:py-1 font-header">
                      Section 80 C
                    </h2>
                    <div className="border-b-[2px] border-gray-300"></div>
                    <div className="flex justify-center">
                      <img
                        className="h-32 w-32 lg:h-32 lg:w-32 md:h-52 md:w-52 mt-5 mb-8"
                        src={require("./assets/savings 2.png")}
                        alt="Savings"
                      />
                    </div>
                    {totalAmountSection80c != 0 &&
                      totalAmountSection80c != null ? (
                      <div className="flex flex-col items-center pb-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 group ml-10">
                          <span>Declared Amount</span>
                          <button
                            onClick={handleEdit80c}
                            className="p-[2px] rounded-full hover:bg-red-100 transition-all"
                            title="Edit"
                          >
                            <MdOutlineModeEditOutline className="text-[18px] text-[#b91c1c] group-hover:scale-110 transition-transform duration-150" />
                          </button>
                        </div>
                        <div className="text-gray-600 text-sm text-gray-400">
                          {totalAmountSection80c || 0}
                        </div>
                      </div>
                    ) : (
                      <h2
                        className="text-sm lg:text-sm md:text-sm text-center text-[#dc2626] hover:text-red-800 font-semibold mb-10 cursor-pointer transition-colors duration-200 font-header"
                        onClick={() => setOpen80c(true)}
                      >
                        Add to Declaration
                      </h2>
                    )}
                  </div>
                </div>

                {/* Section 80D Card */}
                <div className="md:col-span-1 col-span-3 md:-ml-0 -ml-16 -mt-20 md:-mt-0 lg:-mt-0">
                  <div className="border-[2px] border-gray-300 shadow-xl">
                    <h2 className="text-gray-700 text-sm md:text-sm lg:text-sm text-center font-medium py-1 font-header">
                      Section 80D/80DD/80DDB/80U
                    </h2>
                    <div className="border-b-[2px] border-gray-300"></div>
                    <div className="flex justify-center">
                      <img
                        className="h-32 w-32 lg:h-32 lg:w-32 md:h-52 md:w-52 mt-5 mb-8"
                        src={require("./assets/Medical.jpg")}
                        alt="Medical"
                      />
                    </div>
                    {totalAmountSection80d != 0 &&
                      totalAmountSection80d != null ? (
                      <div className="flex flex-col items-center pb-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-semibold group ml-10">
                          <span>Declared Amount</span>
                          <button
                            onClick={handleEdit80d}
                            className="p-[2px] rounded-full hover:bg-red-100 transition-all"
                            title="Edit"
                          >
                            <MdOutlineModeEditOutline className="text-[18px] text-[#b91c1c] group-hover:scale-110 transition-transform duration-150" />
                          </button>
                        </div>
                        <div className="text-gray-600 text-sm text-gray-400">
                          {totalAmountSection80d || 0}
                        </div>
                      </div>
                    ) : (
                      <h2
                        className="text-sm lg:text-sm md:text-sm text-center text-[#dc2626] hover:text-red-800 font-semibold mb-10 cursor-pointer transition-colors duration-200 font-header"
                        onClick={() => setOpen80d(true)}
                      >
                        Add to Declaration
                      </h2>
                    )}
                  </div>
                </div>

                {/* Section 80E Card */}
                <div className="md:col-span-1 col-span-3 md:-ml-0 -ml-16 -mt-20 md:-mt-0 lg:-mt-0">
                  <div className="border-[2px] border-gray-300 shadow-xl">
                    <h2 className="text-gray-700 text-sm md:text-sm lg:text-sm text-center font-medium py-1 font-header">
                      Section 80E/10/Housing Loan
                    </h2>
                    <div className="border-b-[2px] border-gray-300"></div>
                    <div className="flex justify-center">
                      <img
                        className="h-32 w-32 lg:h-32 lg:w-32 md:h-52 md:w-52 mt-5 mb-8"
                        src={require("./assets/images icon.png")}
                        alt="Housing Loan"
                      />
                    </div>
                    {totalAmountSection80e != 0 ? (
                      <div className="flex flex-col items-center pb-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-semibold group ml-10">
                          <span>Declared Amount</span>
                          <button
                            onClick={handleEdit80e}
                            className="p-[2px] rounded-full hover:bg-red-100 transition-all"
                            title="Edit"
                          >
                            <MdOutlineModeEditOutline className="text-[18px] text-[#b91c1c] group-hover:scale-110 transition-transform duration-150" />
                          </button>
                        </div>
                        <div className="text-gray-600 text-sm text-gray-400">
                          {totalAmountSection80e}
                        </div>
                      </div>
                    ) : (
                      <h2
                        className="text-sm lg:text-sm md:text-sm text-center text-[#dc2626] hover:text-red-800 font-semibold mb-10 cursor-pointer transition-colors duration-200 font-header"
                        onClick={() => setOpen80e(true)}
                      >
                        Add to Declaration
                      </h2>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-2 mt-[60px]">
              <div className="grid lg:grid-cols-12 lg:border-[1px] border-gray-500">
                <div className="lg:col-span-9 lg:border-r-[1px] border-gray-500">
                  <div
                    className="flex items-center float-end mr-5 mt-2 gap-2 ml-5"
                    style={{ padding: "12px 0" }}
                  >
                    <div className="text-xl text-gray-500 font-bold">
                      <HiOutlineInformationCircle />
                    </div>
                    <div className="text-sm text-gray-500 font-bold font-header">
                      Click Submit To Save
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex justify-center items-center h-full w-full">
                    <div className="flex items-center space-x-5">
                      {/* Preview Button */}
                      <div
                        className="cursor-pointer transition-colors rounded-md flex items-center justify-center"
                        style={{
                          backgroundColor: "#ef4444",
                          height: "32px",
                          minWidth: "90px",
                          padding: "0 16px",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#dc2626")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#ef4444")
                        }
                        onClick={handlePreview}
                      >
                        <span className="text-white text-sm font-medium font-header">
                          Preview
                        </span>
                      </div>

                      {/* Submit Button - Opens confirmation modal */}
                      <div
                        className="border-[1px] flex items-center justify-center space-x-1 text-sm text-[#dc2626] cursor-pointer transition-colors rounded-md"
                        style={{
                          borderColor: "#dc2626",
                          backgroundColor: "transparent",
                          height: "32px",
                          minWidth: "90px",
                          padding: "0 16px",
                          fontWeight: 500,
                          fontSize: "13px",
                          lineHeight: "1",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#dc2626";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#dc2626";
                        }}
                        onClick={handleSubmitConfirmation}
                      >
                        <span className="px-0 font-header">Submit</span>
                        <FaArrowRight
                          className="text-xs"
                          style={{ marginLeft: "2px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 80C Modal */}
          <Modal open={open80c} onClose={handleClose80c}>
            <Box sx={style} className="">
              <div className="flex justify-between items-center mb-2">
                <div className="text-md lg:text-sm text-gray-600 ml-2 font-header">
                  Section 80C
                </div>
                <div onClick={handleClose80c} style={{ cursor: "pointer" }}>
                  <ImCancelCircle
                    className="text-[#dc2626] cursor-pointer transition-transform duration-200"
                    style={{ fontSize: "16px" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>
              </div>

              <Card sx={{ mb: 4, boxShadow: 1 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                    py: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500 }}
                    className="font-header"
                  >
                    Total Declared Amount
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#dc2626" }}
                    className="font-header"
                  >
                    INR {getTotalByIds([1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23])}
                  </Typography>
                </CardContent>

                <div className="px-6 pb-3">
                  <span className="text-xs text-red-600 font-bold font-content">
                    Note: Maximum deduction allowed under Section 80C is
                    ₹1,50,000.
                  </span>
                </div>
              </Card>

              <div className="mt-2">
                <label className="text-sm ml-2 font-header">
                  Deduction under section 80C
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-3">
                  {[...allSectionName]
                    .sort((a, b) => a.itDecId - b.itDecId)
                    ?.filter((section) =>
                      [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23].includes(
                        section.itDecId,
                      ),
                    )
                    ?.map((section) => (
                      <div
                        key={section.itDecId}
                        className="flex flex-col justify-start h-full"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-800 text-[15px] leading-tight font-header">
                            {clean80CDescription(section.description)}
                          </span>
                          {section.additionalInformation && (
                            <span className="text-xs text-gray-500 leading-tight font-content">
                              {section.additionalInformation}
                            </span>
                          )}
                        </div>

                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          type="number"
                          value={section?.declarationAmount || ""}
                          name="declarationAmount"
                          inputProps={{ min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                className="font-content"
                              >
                                INR
                              </InputAdornment>
                            ),
                          }}
                          onChange={(e) =>
                            handleChangeIT_DeclarationSection80(
                              e,
                              section.itDecId,
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex mt-10 space-x-6 pb-6">
                  <div>
                    {isUpdate80c ? (
                      <div className="flex justify-center gap-3">
                        <div
                          className="border-[1px] flex items-center justify-center text-sm text-[#dc2626] cursor-pointer transition-colors rounded-md"
                          style={{
                            borderColor: "#dc2626",
                            backgroundColor: "transparent",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                            fontWeight: 500,
                            fontSize: "13px",
                            lineHeight: "1",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#dc2626";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#dc2626";
                          }}
                          onClick={() =>
                            clearSectionByIds([
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
                            ])
                          }
                        >
                          <span className="px-0 font-header">Clear</span>
                        </div>

                        <div
                          className="cursor-pointer transition-colors rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ef4444",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#dc2626")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ef4444")
                          }
                          onClick={handleSubmitSection80C}
                        >
                          <span className="text-white text-sm font-medium font-header">
                            Update
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div
                          className="cursor-pointer transition-colors rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ef4444",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#dc2626")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ef4444")
                          }
                          onClick={handleSubmitSection80C}
                        >
                          <span className="text-white text-sm font-medium font-header">
                            Save
                          </span>
                        </div>

                        <div
                          className="border-[1px] flex items-center justify-center text-sm text-[#dc2626] cursor-pointer transition-colors rounded-md"
                          style={{
                            borderColor: "#dc2626",
                            backgroundColor: "transparent",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                            fontWeight: 500,
                            fontSize: "13px",
                            lineHeight: "1",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#dc2626";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#dc2626";
                          }}
                          onClick={() =>
                            clearSectionByIds([
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
                            ])
                          }
                        >
                          <span className="px-0 font-header">Clear</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Box>
          </Modal>

          {/* Section 80D Modal */}
          <Modal open={open80d} onClose={handleClose80d}>
            <Box sx={style} className="">
              <div className="flex justify-between items-center mb-2">
                <div className="text-md lg:text-sm text-gray-600 ml-2 font-header">
                  Section 80D/80DD/80DDB/80U
                </div>
                <div onClick={handleClose80d} style={{ cursor: "pointer" }}>
                  <ImCancelCircle
                    className="text-[#dc2626] cursor-pointer transition-transform duration-200"
                    style={{ fontSize: "16px" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>
              </div>

              <Card sx={{ mb: 4, boxShadow: 1 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                    py: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500 }}
                    className="font-header"
                  >
                    Total Declared Amount
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#dc2626" }}
                    className="font-header"
                  >
                    INR {getTotalByIds([7, 8, 10, 11, 15, 16, 17])}
                  </Typography>
                </CardContent>
              </Card>

              <div className="mt-2">
                <label className="text-sm ml-2 font-header">
                  Deduction under section 80D/80DD/80DDB/80U
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-3">
                  {[...allSectionName]
                    .sort((a, b) => a.itDecId - b.itDecId)
                    ?.filter((section) =>
                      [7, 8, 10, 11, 15, 16, 17].includes(section.itDecId),
                    )
                    ?.map((section) => (
                      <div
                        key={section.itDecId}
                        className="flex flex-col justify-start h-full"
                      >
                        <span className="font-semibold text-gray-800 text-[15px] leading-tight font-header">
                          {section.description}
                        </span>
                        {section.additionalInformation && (
                          <span className="text-xs text-gray-500 leading-tight font-content">
                            {section.additionalInformation}
                          </span>
                        )}
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          type="number"
                          value={section?.declarationAmount || ""}
                          name="declarationAmount"
                          inputProps={{ min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                className="font-content"
                              >
                                INR
                              </InputAdornment>
                            ),
                          }}
                          onChange={(e) =>
                            handleChangeIT_DeclarationSection80(
                              e,
                              section.itDecId,
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex mt-10 space-x-6 pb-6">
                  <div>
                    {isUpdate80d ? (
                      <div className="flex justify-center gap-3">
                        <div
                          className="border-[1px] flex items-center justify-center text-sm text-[#dc2626] cursor-pointer transition-colors rounded-md"
                          style={{
                            borderColor: "#dc2626",
                            backgroundColor: "transparent",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                            fontWeight: 500,
                            fontSize: "13px",
                            lineHeight: "1",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#dc2626";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#dc2626";
                          }}
                          onClick={() =>
                            clearSectionByIds([7, 8, 10, 11, 15, 16, 17])
                          }
                        >
                          <span className="px-0 font-header">Clear</span>
                        </div>

                        <div
                          className="cursor-pointer transition-colors rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ef4444",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#dc2626")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ef4444")
                          }
                          onClick={handleSubmitSection80D}
                        >
                          <span className="text-white text-sm font-medium font-header">
                            Update
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div
                          className="cursor-pointer transition-colors rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ef4444",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#dc2626")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ef4444")
                          }
                          onClick={handleSubmitSection80D}
                        >
                          <span className="text-white text-sm font-medium font-header">
                            Save
                          </span>
                        </div>

                        <div
                          className="border-[1px] flex items-center justify-center text-sm text-[#dc2626] cursor-pointer transition-colors rounded-md"
                          style={{
                            borderColor: "#dc2626",
                            backgroundColor: "transparent",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                            fontWeight: 500,
                            fontSize: "13px",
                            lineHeight: "1",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#dc2626";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#dc2626";
                          }}
                          onClick={() =>
                            clearSectionByIds([7, 8, 10, 11, 15, 16, 17])
                          }
                        >
                          <span className="px-0 font-header">Clear</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Box>
          </Modal>

          {/* Section 80E Modal */}
          <Modal open={open80e} onClose={handleClose80e}>
            <Box sx={style} className="">
              <div className="flex justify-between items-center mb-2">
                <div className="text-md lg:text-sm text-gray-600 ml-2 font-header">
                  Section 80E/10/Housing Loan
                </div>
                <div onClick={handleClose80e} style={{ cursor: "pointer" }}>
                  <ImCancelCircle
                    className="text-[#dc2626] cursor-pointer transition-transform duration-200"
                    style={{ fontSize: "16px" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>
              </div>

              <Card sx={{ mb: 4, boxShadow: 1 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                    py: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500 }}
                    className="font-header"
                  >
                    Total Declared Amount
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#dc2626" }}
                    className="font-header"
                  >
                    INR {getTotalByIds([12, 13, 14])}
                  </Typography>
                </CardContent>
                <div className="px-6 pb-3">
                  <span className="text-xs text-red-600 font-bold font-content">
                    Note: Owner Name and PAN are mandatory when declaring an amount under House Rent Exemption [Section 10(13A)]
                  </span>
                </div>
              </Card>

              <div className="mt-2">
                <label className="text-sm ml-2 font-header">
                  Deduction under section 80E/10/Housing Loan
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-3">
                  {[...allSectionName]
                    .sort((a, b) => a.itDecId - b.itDecId)
                    ?.filter((section) =>
                      [12, 13, 14].includes(section.itDecId),
                    )
                    ?.map((section) => (
                      <div
                        key={section.itDecId}
                        className="flex flex-col justify-start h-full"
                      >
                        <span className="font-semibold text-gray-800 text-[15px] leading-tight font-header">
                          {section.description}
                        </span>
                        {section.additionalInformation && (
                          <span className="text-xs text-gray-500 leading-tight font-content">
                            {section.additionalInformation}
                          </span>
                        )}
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          type="number"
                          value={section?.declarationAmount || ""}
                          name="declarationAmount"
                          inputProps={{ min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                className="font-content"
                              >
                                INR
                              </InputAdornment>
                            ),
                          }}
                          onChange={(e) =>
                            handleChangeIT_DeclarationSection80(
                              e,
                              section.itDecId,
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Owner Details Section - Only applicable for House Rent Exemption [Section 10(13A)] */}
              <div className="mt-8 border-t pt-6">
                <label className="text-sm ml-2 font-header text-red-600 font-semibold">
                  Owner Details — House Rent Exemption [Section 10(13A)] {isLandlordEnabled ? '(Mandatory)' : '(Disabled)'}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-[15px] leading-tight font-header mb-2">
                      Owner Name {isLandlordEnabled && <span className="text-red-600">*</span>}
                    </span>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={landlordDetails.name}
                      name="name"
                      onChange={handleLandlordChange}
                      placeholder={isLandlordEnabled ? "Enter owner name" : "Enter amount in Section 10(13A) above to enable"}
                      disabled={!isLandlordEnabled || loadingLandlord}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-[15px] leading-tight font-header mb-2">
                      Owner PAN Number {isLandlordEnabled && <span className="text-red-600">*</span>}
                    </span>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={landlordDetails.panNumber}
                      name="panNumber"
                      onChange={handleLandlordChange}
                      placeholder={isLandlordEnabled ? "Enter PAN (e.g., ABCDE1234F)" : "Enter amount in Section 10(13A) above to enable"}
                      disabled={!isLandlordEnabled || loadingLandlord}
                      inputProps={{
                        maxLength: 10,
                        style: { textTransform: 'uppercase' }
                      }}
                      className="mt-2"
                    />
                  </div>
                </div>
                {!isLandlordEnabled && (
                  <p className="text-xs text-gray-500 mt-2 ml-2">
                    Owner details are only required under House Rent Exemption [Section 10(13A)]
                  </p>
                )}
                {loadingLandlord && (
                  <p className="text-xs text-blue-500 mt-2 ml-2">
                    Loading owner details...
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <div className="flex mt-10 space-x-6 pb-6">
                  <div>
                    {isUpdate80e ? (
                      <div className="flex justify-center gap-3">
                        <div
                          className="border-[1px] flex items-center justify-center text-sm text-[#dc2626] cursor-pointer transition-colors rounded-md"
                          style={{
                            borderColor: "#dc2626",
                            backgroundColor: "transparent",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                            fontWeight: 500,
                            fontSize: "13px",
                            lineHeight: "1",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#dc2626";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#dc2626";
                          }}
                          onClick={() => clearSectionByIds([12, 13, 14])}
                        >
                          <span className="px-0 font-header">Clear</span>
                        </div>

                        <div
                          className="cursor-pointer transition-colors rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ef4444",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#dc2626")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ef4444")
                          }
                          onClick={handleSubmitSection80E}
                        >
                          <span className="text-white text-sm font-medium font-header">
                            Update
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div
                          className="cursor-pointer transition-colors rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ef4444",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#dc2626")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ef4444")
                          }
                          onClick={handleSubmitSection80E}
                        >
                          <span className="text-white text-sm font-medium font-header">
                            Save
                          </span>
                        </div>

                        <div
                          className="border-[1px] flex items-center justify-center text-sm text-[#dc2626] cursor-pointer transition-colors rounded-md"
                          style={{
                            borderColor: "#dc2626",
                            backgroundColor: "transparent",
                            height: "32px",
                            minWidth: "90px",
                            padding: "0 16px",
                            fontWeight: 500,
                            fontSize: "13px",
                            lineHeight: "1",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#dc2626";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#dc2626";
                          }}
                          onClick={() => clearSectionByIds([12, 13, 14])}
                        >
                          <span className="px-0 font-header">Clear</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Box>
          </Modal>

          {/* Confirmation Modal for Submit */}
          <Modal open={openConfirmModal} onClose={handleCancelSubmit}>
            <Box sx={confirmModalStyle}>
              {/* Close Icon */}
              <div className="flex justify-end">
                <ImCancelCircle
                  className="text-[#dc2626] cursor-pointer transition-transform duration-200"
                  style={{ fontSize: "16px" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={handleCancelSubmit}
                />
              </div>

              {/* Message */}
              <div className="flex justify-center items-center mt-4 px-4 text-center">
                <h3 className="text-sm font-semibold text-gray-800 max-w-md">
                  Are you sure you want to submit your IT Declaration?
                </h3>
              </div>

              {/* Buttons */}
              <div className="flex justify-center items-center space-x-5 mt-6">
                {/* Submit Button */}
                <div
                  className="cursor-pointer transition-colors rounded-md flex items-center justify-center"
                  style={{
                    backgroundColor: "#ef4444",
                    height: "32px",
                    minWidth: "90px",
                    padding: "0 16px",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#dc2626")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#ef4444")
                  }
                  onClick={handleConfirmSubmit}
                >
                  <span className="text-white text-sm font-medium">Submit</span>
                </div>

                {/* Cancel Button */}
                <div
                  className="border-[1px] flex items-center justify-center space-x-1 text-sm text-[#dc2626] cursor-pointer transition-colors rounded-md"
                  style={{
                    borderColor: "#dc2626",
                    backgroundColor: "transparent",
                    height: "32px",
                    minWidth: "90px",
                    padding: "0 16px",
                    fontWeight: 500,
                    fontSize: "13px",
                    lineHeight: "1",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#dc2626";
                  }}
                  onClick={handleCancelSubmit}
                >
                  <span className="px-0">Cancel</span>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default IT_Declaration_Display;