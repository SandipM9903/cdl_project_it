import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { ImCancelCircle } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Service from "./Service";
import {
  useFileStore,
  useStoreFinancialYear,
  useStoreUpdateSaveStatus80c,
  useStoreUpdateSaveStatus80d,
  useStoreUpdateSaveStatus80e,
} from "./useFileStore";

function IT_Declaration_Update() {
  const { regime } = useFileStore();
  const empCode = localStorage.getItem("empId");
  const { submitFinancialYear } = useStoreFinancialYear();

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const { updateSaveStatus80c, setUpdateSaveStatus80c } =
    useStoreUpdateSaveStatus80c();
  const { updateSaveStatus80d, setUpdateSaveStatus80d } =
    useStoreUpdateSaveStatus80d();
  const { updateSaveStatus80e, setUpdateSaveStatus80e } =
    useStoreUpdateSaveStatus80e();

  const navigate = useNavigate();

  const handleITDecScreenBack = () => {
    window.history.back();

  };

  const handleSelectRegime = () => {
    navigate("/select-regime");
  };

  const [info, setInfo] = useState([]);
  const [master, setMaster] = useState([]);
  const [allSectionName, setAllSectionName] = useState([]);

  useEffect(() => {
    if (updateSaveStatus80c === "true") {
      setOpen(false);
    }
  }, [updateSaveStatus80c]);

  useEffect(() => {
    if (updateSaveStatus80d === "true") {
      setOpen1(false);
    }
  }, [updateSaveStatus80d]);

  useEffect(() => {
    if (updateSaveStatus80e === "true") {
      setOpen2(false);
    }
  }, [updateSaveStatus80e]);

  // Fetch info

  const fetchInfo = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear
    ).then((res) => {
      setInfo(res?.data?.data);
    });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Fetch master

  const fetchMaster = () => {
    Service.fetchAllSectionName().then((res) => {
      setMaster(res?.data?.data);
    });
  };

  useEffect(() => {
    fetchMaster();
  }, []);

  // Combine info and master initially
  useEffect(() => {
    const combinedSections = info.map((item1) => {
      const matchingItem = master.find(
        (item2) => Number(item2.itDecId) === Number(item1.itDecId)
      );
      return matchingItem ? { ...item1, ...matchingItem } : item1;
    });
    setAllSectionName(combinedSections);
  }, [info, master]);

  // Handle input change
  const handleChangeIT_DeclarationSection80 = (e, itDecId) => {
    const key = e.target.name;
    const value = e.target.value;
    // Update the specific section
    const updatedSections = allSectionName.map((section) =>
      section.itDecId === itDecId ? { ...section, [key]: value } : section
    );

    setAllSectionName(updatedSections); // Update the state
  };

  // Function to handle the Clear button click
  const handleClearFields = () => {
    const resetSections = allSectionName.map((section) => ({
      ...section,
      declarationAmount: "",
    }));
    setAllSectionName(resetSections);
  };

  // section 80 c

  const [totalAmountSection80c, setTotalAmountSection80c] = useState(0);
  const calculateSumCFunction = () => {
    setTotalAmountSection80c(
      allSectionName
        ?.filter((section) =>
          [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23].includes(section.itDecId)
        )
        ?.reduce(
          (total, section) =>
            total + (parseFloat(section.declarationAmount) || 0),
          0
        )
    );
  };

  const getTotalSumBySummingAllDataOfSectionC = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear
    ).then((res) => {
      {
        setTotalAmountSection80c(
          res?.data?.data
            ?.filter((section) =>
              [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23].includes(section.itDecId)
            )
            ?.reduce(
              (total, section) =>
                total + (parseFloat(section.declarationAmount) || 0),
              0
            )
        );
      }
    });
  };

  useEffect(() => {
    getTotalSumBySummingAllDataOfSectionC();
  }, []);

  const handleSubmitSection80C = () => {
    Service.postSection80Data(allSectionName).then((response) => {
      setOpen(false);
      Swal.fire({
        text: "Section 80-C updated successfully",
        icon: "success",
        width: "350px",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/declaration-dashboard");
      //setSaveStatus80cFunction();
    });
  };

  // section 80 d

  const [totalAmountSection80d, setTotalAmountSection80d] = useState(0);
  const calculateSumDFunction = () => {
    setTotalAmountSection80d(
      allSectionName
        ?.filter((section) =>
          [7, 8, 10, 11, 15, 16, 17].includes(section.itDecId)
        )
        ?.reduce(
          (total, section) =>
            total + (parseFloat(section.declarationAmount) || 0),
          0
        )
    );
  };

  const getTotalSumBySummingAllDataOfSectionD = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear
    ).then((res) => {
      {
        setTotalAmountSection80d(
          res?.data?.data
            ?.filter((section) =>
              [7, 8, 10, 11, 15, 16, 17].includes(section.itDecId)
            )
            ?.reduce(
              (total, section) =>
                total + (parseFloat(section.declarationAmount) || 0),
              0
            )
        );
      }
    });
  };

  useEffect(() => {
    getTotalSumBySummingAllDataOfSectionD();
  }, []);

  const handleSubmitSection80D = () => {
    Service.postSection80Data(allSectionName).then((response) => {
      setOpen(false);
      Swal.fire({
        text: "Section 80-D updated successfully",
        icon: "success",
        width: "350px",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/declaration-dashboard");
      //setSaveStatus80dFunction();
    });
  };

  // section 80 e

  const [totalAmountSection80e, setTotalAmountSection80e] = useState(0);
  const calculateSumEFunction = () => {
    setTotalAmountSection80e(
      allSectionName
        ?.filter((section) => [12, 13, 14].includes(section.itDecId))
        ?.reduce(
          (total, section) =>
            total + (parseFloat(section.declarationAmount) || 0),
          0
        )
    );
  };

  const getTotalSumBySummingAllDataOfSectionE = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear
    ).then((res) => {
      {
        setTotalAmountSection80e(
          res?.data?.data
            ?.filter((section) => [12, 13, 14].includes(section.itDecId))
            ?.reduce(
              (total, section) =>
                total + (parseFloat(section.declarationAmount) || 0),
              0
            )
        );
      }
    });
  };

  useEffect(() => {
    getTotalSumBySummingAllDataOfSectionE();
  }, []);

  const handleSubmitSection80E = () => {
    Service.postSection80Data(allSectionName).then((response) => {
      setOpen(false);
      Swal.fire({
        text: "Section 80-E updated successfully ",
        icon: "success",
        width: "350px",
        timer: 2000,
        showConfirmButton: false,
      });
      calculateSumEFunction();
      navigate("/declaration-dashboard");
    });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 25,
    maxHeight: "90vh", // Set the maximum height for the modal
    overflowY: "auto",
    "@media (max-width: 768px)": {
      width: "90%", // Adjusted width for screens below the 'md' breakpoint
    },
  };

  const handlePreview = () => {
    navigate("/preview");
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
    <div className="flex flex-col h-screen">
  
  <Header/>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-full flex-grow bg-white">
        <div className=" mt-20">
          <div className="flex space-x-10 items-center px-4">
            <div className="text-gray-400 text-sm ml-4 cursor-pointer">
              <FaArrowLeft onClick={handleITDecScreenBack} />
            </div>
            <div className="text-gray-700 font-semibold text-sm">
              IT Declaration
            </div>
          </div>

          <div className="border-b-[2px] border-gray-300 mt-1 px-4"></div>

          <div className="mt-8">
            <div className="flex justify-center">
              <div className="border-2 border-gray-500 flex items-center  space-x-5 py-1 w-[320px] ">
                <div className="ml-3 text-sm">
                  <HiOutlineInformationCircle />
                </div>
                <div className="font-medium text-gray-500 text-sm ">
                  Declaration window is open
                </div>
              </div>
            </div>
            <div className="text-center text-gray-500 lg:text-sm md:text-sm mt-3 font-normal ">
              Enter your planned investment declarations here and choose the
              desired regime in the following page
            </div>
            <div className="mt-12">
              <div className="grid grid-cols-3 gap-28 md:gap-8 lg:gap-28 px-32 lg:px-32 md:px-10">
                <div className="md:col-span-1 col-span-3 md:-ml-0 -ml-16">
                  <div className="border-[2px] border-gray-300 shadow-xl">
                    <h2 className="text-gray-700 text-sm md:text-sm lg:text-sm text-center font-medium py-1 md:py-[18px] lg:py-1">
                      Section 80 C
                    </h2>
                    <div className="border-b-[2px] border-gray-300"></div>
                    <div className="flex justify-center">
                      <img
                        className="h-32 w-32 lg:h-32 lg:w-32 md:h-52 md:w-52  mt-5 mb-8 "
                        src={require("./assets/savings 2.png")}
                      />
                    </div>
                    {totalAmountSection80c != 0 &&
                    totalAmountSection80c != null ? (
                      <div className="flex flex-col items-center pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="text-gray-400 text-sm font-semibold">
                            Declared Amount
                          </div>
                          <BsPencil
                            className="lg:text-sm md:text-sm text-sm  text-blue-600 cursor-pointer"
                            onClick={() => setOpen(true)}
                          />
                        </div>

                        <div className="text-gray-600 text-sm text-gray-400">
                          {totalAmountSection80c}
                        </div>
                      </div>
                    ) : (
                      <h2
                        className="text-sm lg:text-sm md:text-sm text-center text-blue-500 font-semibold  mb-10 cursor-pointer"
                        onClick={() => setOpen(true)}
                      >
                        Add to Declaration
                      </h2>
                    )}
                  </div>
                </div>

                <div className="md:col-span-1 col-span-3 md:-ml-0 -ml-16 -mt-20 md:-mt-0 lg:-mt-0 ">
                  <div className="border-[2px] border-gray-300 shadow-xl">
                    <h2 className="text-gray-700 text-sm md:text-sm lg:text-sm text-center font-medium py-1">
                      Section 80D/80DD/80DDB/80U
                    </h2>
                    <div className="border-b-[2px] border-gray-300"></div>
                    <div className="flex justify-center">
                      <img
                        className="h-32 w-32 lg:h-32 lg:w-32 md:h-52 md:w-52  mt-5 mb-8 "
                        src={require("./assets/Medical.jpg")}
                      />
                    </div>
                    {totalAmountSection80d != 0 &&
                    totalAmountSection80d != null ? (
                      <div className="flex flex-col items-center pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="text-gray-400 text-sm font-semibold">
                            Declared Amount
                          </div>
                          <BsPencil
                            className="lg:text-sm md:text-sm text-sm  text-blue-600 cursor-pointer"
                            onClick={() => setOpen1(true)}
                          />
                        </div>
                        <div className="text-gray-600 text-sm text-gray-400">
                          {totalAmountSection80d}
                        </div>
                      </div>
                    ) : (
                      <h2
                        className="text-sm lg:text-sm md:text-sm text-center text-blue-500 font-semibold  mb-10 cursor-pointer"
                        onClick={() => setOpen1(true)}
                      >
                        Add to Declaration
                      </h2>
                    )}
                  </div>
                </div>

                <div className="md:col-span-1 col-span-3 md:-ml-0 -ml-16 -mt-20 md:-mt-0 lg:-mt-0">
                  <div className="border-[2px] border-gray-300 shadow-xl">
                    <h2 className="text-gray-700 text-sm md:text-sm lg:text-sm text-center font-medium py-1">
                      Section 80E/10/Housing Loan
                    </h2>
                    <div className="border-b-[2px] border-gray-300"></div>
                    <div className="flex justify-center">
                      <img
                        className="h-32 w-32 lg:h-32 lg:w-32 md:h-52 md:w-52 mt-5 mb-8 "
                        src={require("./assets/images icon.png")}
                      />
                    </div>
                    {totalAmountSection80e != 0 &&
                    totalAmountSection80e != null ? (
                      <div className="flex flex-col items-center pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="text-gray-400 text-sm font-semibold">
                            Declared Amount
                          </div>
                          <BsPencil
                            className="lg:text-sm md:text-sm text-sm  text-blue-600 cursor-pointer"
                            onClick={() => setOpen2(true)}
                          />
                        </div>
                        <div className="text-gray-600 text-sm text-gray-400">
                          {totalAmountSection80e}
                        </div>
                      </div>
                    ) : (
                      <h2
                        className="text-sm lg:text-sm md:text-sm text-center text-blue-500 font-semibold  mb-10 cursor-pointer"
                        onClick={() => setOpen2(true)}
                      >
                        Add to Declaration
                      </h2>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 mt-[60px]">
              <div className="grid lg:grid-cols-12 lg:border-[1px] border-gray-500">
                <div className="lg:col-span-9 lg:border-r-[1px] border-gray-500">
                  <div className="flex items-center float-end mr-5 mt-2 gap-2 ml-5">
                    <div className="text-xl text-gray-500 font-bold ">
                      <HiOutlineInformationCircle />
                    </div>
                    <div className="text-sm text-gray-500 font-bold">
                      Click Next to choose Regime
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex justify-center">
                    <div className="flex items-center ml-2 space-x-5">
                      <div className="bg-blue-800 cursor-pointer">
                        <h2
                          className="text-white text-sm p-2"
                          onClick={handlePreview}
                        >
                          Preview
                        </h2>
                      </div>
                      <div
                        className="border-[1px] p-2 border-blue-700 flex items-center space-x-2 text-sm text-blue-700 cursor-pointer"
                        onClick={handleSelectRegime}
                      >
                        <p className="">Next</p>
                        <div className="ml-1">
                          <FaArrowRight className="mr-1 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <Modal open={open} onClose={() => setOpen(false)}>
              <Box sx={style} className="">
                <div className="flex justify-between">
                  <div className=" mt-4">
                    <div className="font-semibold text-md lg:text-sm font-gray-700 ml-12 text-gray-600">
                      Section 80C
                    </div>
                  </div>
                  <div className="mt-4 ">
                    <div
                      onClick={() => setOpen(false)}
                      style={{ cursor: "pointer", fontSize: "30px" }}
                    >
                      <ImCancelCircle className="mr-10 text-gray-600 md:text-sm text-sm" />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 120,
                        alignItems: "center",
                        marginTop: "80px",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="border-[1px] border-gray-400 flex space-x-7 -mt-10">
                  <div className="ml-32 my-2">
                    <h2 className="mb-2 font-medium font-gray-400">
                      Total Declared Amount in
                    </h2>
                    <h2 className="text-sm font-gray-700 font-medium">
                      INR {totalAmountSection80c || 0}
                    </h2>
                  </div>

                  <div className="md:border-r-[1px] md:border-gray-600 "></div>
                </div>

                <div className="mt-6">
                  <label className="font-semibold text-sm ml-8">
                    Deduction under section 80 C
                  </label>
                  <div className="grid grid-cols-2">
                    {allSectionName
                      ?.sort((a, b) => a.itDecId - b.itDecId) // Sort by itDecId in ascending order
                      ?.filter((section) =>
                        [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23].includes(
                          section.itDecId
                        )
                      ) // Filter the desired range
                      ?.map((section) => (
                        <div
                          className="md:col-span-1 col-span-2"
                          key={section.itDecId} // Use a unique identifier like itDecId
                        >
                          <div className="ml-12 mt-5">
                            <label className="font-medium text-gray-900">
                              {section.description} <br />
                              <span className="font-medium text-gray-500">
                                {section.additionalInformation}
                              </span>
                            </label>
                            <div className="mt-3 flex items-center border-[1px] border-gray-600 w-[250px] rounded-sm p-1 font-medium text-gray-600">
                              <div className="text-gray-600 border-r-[1px] border-gray-600 w-20 text-center px-2">
                                INR
                              </div>
                              <div className="bg-blue-700 ml-3">
                                <input
                                  type="number"
                                  className="w-[180px] outline-none"
                                  name="declarationAmount"
                                  value={section.declarationAmount || ""}
                                  onChange={(e) =>
                                    handleChangeIT_DeclarationSection80(
                                      e,
                                      section.itDecId
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="flex mt-16  space-x-10 pb-10">
                    <div>
                      <button
                        className="py-[10px] px-5 bg-blue-700 text-white  font-semibold"
                        onClick={() => {
                          handleSubmitSection80C();
                          setUpdateSaveStatus80c("true");
                        }}
                      >
                        update
                      </button>
                    </div>

                    <button
                      className="py-2 px-5 text-gray-700 font-semibold border-[1px] border-gray-700"
                      onClick={handleClearFields}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>

          <div className="">
            <Modal open={open1} onClose={() => setOpen1(false)}>
              <Box sx={style} className="">
                <div className="flex justify-between">
                  <div className=" mt-4 ">
                    <div className="font-semibold text-md lg:text-sm font-gray-700 ml-12 text-gray-600">
                      Section 80D/80DD/80DDB/80U
                    </div>
                  </div>

                  <div className=" mt-4 ">
                    <div
                      onClick={() => setOpen1(false)}
                      style={{ cursor: "pointer", fontSize: "30px" }}
                    >
                      <ImCancelCircle className="mr-10 text-gray-600 md:text-sm text-sm" />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 120,
                        alignItems: "center",
                        marginTop: "80px",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="border-[1px] border-gray-400 flex space-x-7 -mt-10 mb-5">
                  <div className="ml-32 my-2">
                    <h2 className="mb-2 font-medium font-gray-400">
                      Total Declared Amount in
                    </h2>
                    <h2 className="text-sm font-gray-700 font-medium font-bold">
                      INR {totalAmountSection80d || 0}
                    </h2>
                  </div>

                  <div className="md:border-r-[1px] md:border-gray-600 bg-blue-900"></div>
                </div>

                <div className="grid grid-cols-1">
                  {allSectionName
                    ?.sort((a, b) => a.itDecId - b.itDecId) // Sort by itDecId in ascending order
                    ?.filter((section) =>
                      [7, 8, 10, 11, 15, 16, 17].includes(section.itDecId)
                    ) // Filter the desired range
                    ?.map((section) => (
                      <div
                        className="md:col-span-1 col-span-2"
                        key={section.itDecId} // Use a unique identifier like itDecId
                      >
                        <div className="ml-12 mt-5">
                          <label className="font-medium text-gray-900">
                            {section?.description} <br />
                            <span className="font-medium text-gray-500">
                              {section.additionalInformation}
                            </span>
                          </label>
                          <div className="mt-3 flex items-center border-[1px] border-gray-600 w-[250px] rounded-sm p-1 font-medium text-gray-600">
                            <div className="text-gray-600 border-r-[1px] border-gray-600 w-20 text-center px-2">
                              INR
                            </div>
                            <div className="bg-blue-700 ml-3">
                              <input
                                type="number"
                                className="w-[180px] outline-none"
                                name="declarationAmount"
                                value={section.declarationAmount || ""}
                                onChange={(e) =>
                                  handleChangeIT_DeclarationSection80(
                                    e,
                                    section.itDecId
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex justify-center">
                  <div className="flex mt-16  space-x-10 pb-10">
                    <div>
                      <button
                        className="py-[10px] px-5 bg-blue-700 text-white  font-semibold"
                        onClick={() => {
                          handleSubmitSection80D();
                          setUpdateSaveStatus80d("true");
                        }}
                      >
                        update
                      </button>
                    </div>

                    <button
                      className="py-2 px-5 text-gray-700 font-semibold border-[1px] border-gray-700"
                      onClick={handleClearFields}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>

          <div className="">
            <Modal open={open2} onClose={() => setOpen2(false)}>
              <Box sx={style} className="">
                <div className="flex justify-between">
                  <div className="mt-4">
                    <div className="font-semibold text-md lg:text-sm font-gray-700 ml-12 text-gray-600">
                      Section 80E/10/HousingLoan
                    </div>
                  </div>

                  <div className=" mt-4 ">
                    <div
                      onClick={() => setOpen2(false)}
                      style={{ cursor: "pointer", fontSize: "30px" }}
                    >
                      <ImCancelCircle className="mr-10 text-gray-600 md:text-sm text-sm" />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 120,
                        alignItems: "center",
                        marginTop: "80px",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="border-[1px] border-gray-400 flex space-x-7 -mt-10 mb-5">
                  <div className="ml-32 my-2">
                    <h2 className="mb-2 font-medium font-gray-400">
                      Total Declared Amount in
                    </h2>
                    <h2 className="text-sm font-gray-700 font-medium">
                      INR {totalAmountSection80e || 0}
                    </h2>
                  </div>
                  <div className="md:border-r-[1px] md:border-gray-600 bg-blue-900"></div>
                </div>

                <div className="grid grid-cols-1">
                  {allSectionName
                    ?.sort((a, b) => a.itDecId - b.itDecId) // Sort by itDecId in ascending order
                    ?.filter((section) =>
                      [12, 13, 14].includes(section.itDecId)
                    ) // Filter the desired range
                    ?.map((section) => (
                      <div
                        className="md:col-span-1 col-span-2"
                        key={section.itDecId} // Use a unique identifier like itDecId
                      >
                        <div className="ml-12 mt-5">
                          <label className="font-medium text-gray-900">
                            {section?.description} <br />
                            <span className="font-medium text-gray-500">
                              {section.additionalInformation}
                            </span>
                          </label>
                          <div className="mt-3 flex items-center border-[1px] border-gray-600 w-[250px] rounded-sm p-1 font-medium text-gray-600">
                            <div className="text-gray-600 border-r-[1px] border-gray-600 w-20 text-center px-2">
                              INR
                            </div>
                            <div className="bg-blue-700 ml-3">
                              <input
                                type="number"
                                className="w-[180px] outline-none"
                                name="declarationAmount"
                                value={section.declarationAmount || ""}
                                onChange={(e) =>
                                  handleChangeIT_DeclarationSection80(
                                    e,
                                    section.itDecId
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex justify-center">
                  <div className="flex md:mt-16  space-x-10 pb-10">
                    <div>
                      <button
                        className="py-[10px] px-5 bg-blue-700 text-white  font-semibold"
                        onClick={() => {
                          handleSubmitSection80E();
                          setUpdateSaveStatus80e("true");
                        }}
                      >
                        update
                      </button>
                    </div>

                    <button
                      className="py-2 px-5 text-gray-700 font-semibold border-[1px] border-gray-700"
                      onClick={handleClearFields}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IT_Declaration_Update;
