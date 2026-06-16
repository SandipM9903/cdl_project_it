//////addclaims///////////16/07/2024(based on manpreet code)

import React, { useEffect, useState } from "react";
import { CgCloseO } from "react-icons/cg";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { MdAddBox } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrAttachment } from "react-icons/gr";

import { useStore1, useStore3 } from "./ClaimStore";
import { IoEyeSharp } from "react-icons/io5";
import { TextArea } from "semantic-ui-react";
import { IoEnterOutline } from "react-icons/io5";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaFileAlt } from "react-icons/fa";
import { BASE_URL } from "../../config/Config";

const AddClaims = ({ onClose }) => {
  const currentDate = new Date();
  const [expenseType, setExpenseType] = useState(""); // State to store selected expense type
  const [expenseTypeError, setExpenseTypeError] = useState(false);
  const expenseTypeOptions = [
    {
      value: "ConveyanceClaim",
      label: "Conveyance",
      image: "./fuel-pump.png",
    },
    { value: "TravelClaim", label: "Travel", image: "./airplane.png" },
    { value: "FoodClaim", label: "Food", image: "./burger.png" }, // Assuming you have a food image
    { value: "MobileClaim", label: "Mobile", image: "./smartphone.png" },
    {
      value: "MiscellaneousClaim",
      label: "Miscellaneous",
      image: "./belongings.png",
    },
  ];
  const [info, setInfo] = useState([]);
  const [totalAmounts, setTotalAmounts] = useState({
    conveyance: 0,
    travel: 0,
    food: 0,
    mobile: 0,
    miscellaneous: 0,
  });
  const [expData, setExpData] = useState([
    {
      date: "",
      fromLocation: "",
      toLocation: "",
      fromTime: "",
      toTime: "",
      purpose: "",
      modeOfTravel: "",
      distance: "",
      currency: "",
      amount: "",
      file: null,
      docId: null,
    },
  ]);
  // const [selectedWbsId, setSelectedWbsId] = useState("");
  // const { editClaim} = useStore1();
  // const {viewDetails, removeViewDetailsClaim} = useStore2();
  const [wbsId, setWbsId] = useState(null);
 // const [wbsError, setWbsError] = useState(false);
  const [comment, setComment] = useState("");
  const [shouldPost, setShouldPost] = useState(false);
  const [fetchComments, setfetchComments] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [readData, setReadData] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const { editInfo, viewDetailsBtnInfo } = useStore1();
  const { tabIndex, newEditClaim, claimStatus } = useStore3();
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const [options, setDropOptions] = useState([]);
  const defaultOption = options[0];

  console.log(newEditClaim, "newEditClaim)))))))))))))))))))");

  //const empCode = sessionStorage.getItem("UserId");
  const empCode = localStorage.getItem("empId");
  useEffect(() => {
    axios
      .get(`${BASE_URL}:9030/api/claims/getEmpClaimInfo/${empCode}`)
      .then((response) => {
        console.log("API response:", response.data); 
        
        const empData = response.data.fileAndObjectTypeBean?.empResDTO;
        if (empData) {
          setInfo([empData]); 
          console.log("Employee info data:", empData);
        } else {
          console.warn("empResDTO not found in the response:", response.data);
          setInfo([]); 
        }
        setReadData(viewDetailsBtnInfo);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [empCode, viewDetailsBtnInfo]);

  const handleDropdownWbs = (selectedOption) => {
    console.log("Selected Option:", selectedOption);
    setWbsId(selectedOption.value); // Update wbsId when dropdown value changes
  };

  const handleExpenseTypeChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setExpenseType(selectedValue);
    setExpenseTypeError(false);
    console.log(selectedValue, "selectedValue...");
  };

  console.log(newEditClaim, "<==newEditClaim");

  useEffect(() => {
    if (editInfo) {
      if (newEditClaim.autoNum !== undefined || newEditClaim.claimNum !== undefined) {
        const data = Array.isArray(newEditClaim)
          ? newEditClaim
          : [newEditClaim];
        setExpData(data);
        const { claimType, wbsId, description } = newEditClaim;
        setExpenseType(claimType);
        setDescription(description);
        setWbsId(wbsId);
      }
    }
  }, [newEditClaim]);

  useEffect(() => {
    if (viewDetailsBtnInfo) {
      if (newEditClaim.claimNum !== undefined) {
        const data = Array.isArray(newEditClaim)
          ? newEditClaim
          : [newEditClaim];
        setExpData(data);
        const { claimType, wbsId, description } = newEditClaim;
        setExpenseType(claimType);
        setDescription(description);
        setWbsId(wbsId);
      }
    }
  }, [newEditClaim]);

  // Function to handle adding a new dynamic input row for conveyance
  const handleConveyanceClick = () => {
    setExpData([
      ...expData,
      {
        date: "",
        fromLocation: "",
        toLocation: "",
        fromTime: "",
        toTime: "",
        purpose: "",
        modeOfTravel: "",
        distance: "",
        currency: "",
        amount: "",
        file: null,
      },
    ]);
  };

  // Function to handle adding a new dynamic input row for travel
  const handleTravelClick = () => {
    setExpData([
      ...expData,
      {
        date: "",
        expMode: "",
        fromLocation: "",
        toLocation: "",
        currency: "",
        amount: "",
        file: null,
      },
    ]);
  };

  // Function to handle adding a new dynamic input row for miscellaneous
  const handleMiscellaneousClick = () => {
    setExpData([
      ...expData,
      {
        date: "",
        expMode: "",
        purpose: "",
        currency: "",
        amount: "",
        file: null,
      },
    ]);
  };

  // Function to handle adding a new dynamic input row for food
  const handleFoodClick = () => {
    setExpData([
      ...expData,
      { date: "", purpose: "", currency: "", amount: "", file: null },
    ]);
  };

  // Function to handle adding a new dynamic input row for mobile
  const handleMobileClick = () => {
    setExpData([
      ...expData,
      { date: "", purpose: "", currency: "", amount: "", file: null },
    ]);
  };

  // Function to handle deleting a dynamic input row for conveyance
  const handleConveyanceDelete = (index) => {
    const updatedConveyanceData = [...expData];
    updatedConveyanceData.splice(index, 1);
    setExpData(updatedConveyanceData);
  };

  const handleMiscellaneousDelete = (index) => {
    const updatedMiscellaneousData = [...expData];
    updatedMiscellaneousData.splice(index, 1);
    setExpData(updatedMiscellaneousData);
  };

  // Function to handle deleting a dynamic input row for travel
  const handleTravelDelete = (index) => {
    const updatedTravelData = [...expData];
    updatedTravelData.splice(index, 1);
    setExpData(updatedTravelData);
  };

  // Function to handle deleting a dynamic input row for food
  const handleFoodDelete = (index) => {
    const updatedFoodData = [...expData];
    updatedFoodData.splice(index, 1);
    setExpData(updatedFoodData);
  };

  // Function to handle deleting a dynamic input row for mobile
  const handleMobileDelete = (index) => {
    const updatedMobileData = [...expData];
    updatedMobileData.splice(index, 1);
    setExpData(updatedMobileData);
  };

  // Update the input change handler functions to update the corresponding state object
  const handleConveyanceInputChange = (e, index) => {
    const { name, value, files } = e.target;
    const newData = [...expData];
    newData[index] = {
      ...newData[index],
      [name]: name === "file" && files ? files[0] : value,
    };
    setExpData(newData);
  };

  const handleTravelInputChange = (e, index) => {
    const { name, value, files } = e.target;
    const newData = [...expData];
    newData[index] = {
      ...newData[index],
      [name]: name === "file" && files ? files[0] : value,
    };
    setExpData(newData);
  };

  const handleMiscellaneousInputChange = (e, index) => {
    const { name, value, files } = e.target;
    const newData = [...expData];
    newData[index] = {
      ...newData[index],
      [name]: name === "file" && files ? files[0] : value,
    };
    setExpData(newData);
  };

  const handleFoodInputChange = (e, index) => {
    const { name, value, files } = e.target;
    const newData = [...expData];
    newData[index] = {
      ...newData[index],
      [name]: name === "file" && files ? files[0] : value,
    };
    setExpData(newData);
  };

  const handleMobileInputChange = (e, index) => {
    const { name, value, files } = e.target;
    const newData = [...expData];
    newData[index] = {
      ...newData[index],
      [name]: name === "file" && files ? files[0] : value,
    };
    setExpData(newData);
  };

  const uploadConveyanceFile = (e, index) => {
    const { files } = e.target;
    const newData = [...expData];
    newData[index]["file"] = files[0]; // Update file property
    setExpData(newData);
    setSelectedFile(files[0]);
    console.log("Conveyance Data after file upload:", newData); // Log the updated RTA data
  };

  const uploadTravelFile = (e, index) => {
    const { files } = e.target;
    const newData = [...expData];
    newData[index]["file"] = files[0]; // Update file property
    setExpData(newData);
    setSelectedFile(files[0]);
    console.log("Travel Data after file upload:", newData); // Log the updated RTA data
  };

  const uploadMiscellaneousFile = (e, index) => {
    const { files } = e.target;
    const newData = [...expData];
    newData[index]["file"] = files[0]; // Update file property
    setExpData(newData);
    setSelectedFile(files[0]);
    console.log("Miscellaneous Data after file upload:", newData); // Log the updated RTA data
  };

  const uploadFoodFile = (e, index) => {
    const { files } = e.target;
    const newData = [...expData];
    newData[index]["file"] = files[0]; // Update file property
    setExpData(newData);
    setSelectedFile(files[0]);
    console.log("Food Data after file upload:", newData); // Log the updated RTA data
  };

  const uploadMobileFile = (e, index) => {
    const { files } = e.target;
    const newData = [...expData];
    newData[index]["file"] = files[0]; // Update file property
    setExpData(newData);
    setSelectedFile(files[0]);
    console.log("Mobile Data after file upload:", newData); // Log the updated RTA data
  };

  const handleSubmit = async (e) => {
    try {
      const formData = new FormData();
      let response;

      const expenseTypeAll = Array.isArray(expData)
        ? expData.map((data) => ({
            ...data,
            empCode: empCode,
            wbsId: wbsId,
            description,
          }))
        : [];
      const expenseDataWithExpenseType = expenseTypeAll.map((data) => ({
        ...data,
        expenseType,
      }));

      formData.append(
        "data",
        new Blob([JSON.stringify(expenseDataWithExpenseType)], {
          type: "application/json",
        })
      );
      let fileAdded = false; // Track if any file is added

      expenseTypeAll.forEach((data) => {
        if (data.file) {
          formData.append("files", data.file);
          fileAdded = true;
        }
      });

      if (!expenseType || !description) {
        // Show the same error message if any required field is missing
        setExpenseTypeError(!expenseType);
       // setWbsError(!wbsId);
        setDescriptionError(!description);

        throw new Error(
          "Required feilds are empty. Please fill in all required feilds."
        );
      }
      

      // If no file was added, throw an error
      if (!fileAdded) {
        throw new Error(
          "File not uploaded. Please upload a file before submitting."
        );
      }

      if (expenseType === "ConveyanceClaim") {
        //response = await Service.uploadConveyanceData(formData);
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/saveConveyanceItemData/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "TravelClaim") {
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/saveTravelItemData/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "MiscellaneousClaim") {
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/saveMiscellaneousItemData/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "FoodClaim") {
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/SaveFoodItemTableData/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "MobileClaim") {
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/saveMobileExpenseItemdata/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      }

      setExpData([{ file: null, description: "" }]);

      onClose();

      // Toast notification for successful submission
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
        title: "Successfully submitted claims data!",
      });

      // Wait for the success popup to complete (3 seconds)
      setTimeout(async () => {
        // After the success popup, trigger the backend Feign call
        await axios.post(
          `${BASE_URL}:9028/api/workflow/savingMainStatus/${empCode}/${expenseType}/${wbsId}`
        );
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error occurred while submitting form data:", error);
      // alert("Error occurred while submitting form data: " + error.message);

      // SweetAlert for error notification
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message || "Submit document as proof!",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          title: "text-sm",
          popup: "text-xs",
        },
      });
    }
  };

  const handleEditSubmit = async (e) => {
    try {
      const formData = new FormData();
      let response;

      const expenseTypeAll = Array.isArray(expData)
        ? expData.map((data) => ({
            ...data,
            empCode: empCode,
            wbsId: wbsId,
            description,
          }))
        : [];
      const expenseDataWithExpenseType = expenseTypeAll.map((data) => ({
        ...data,
        expenseType,
      }));

      formData.append(
        "data",
        new Blob([JSON.stringify(expenseDataWithExpenseType)], {
          type: "application/json",
        })
      );
      let fileAdded = false; // Track if any file is added

      expenseTypeAll.forEach((data) => {
        if (data.file) {
          formData.append("files", data.file);
          fileAdded = true;
        }
      });

      if (!expenseType || !description) {
        // Show the same error message if any required field is missing
        setExpenseTypeError(!expenseType);
       // setWbsError(!wbsId);
        setDescriptionError(!description);

        throw new Error(
          "Required feilds are empty. Please fill in all required feilds."
        );
      }
      

      // If no file was added, throw an error
      if (!fileAdded) {
        throw new Error(
          "File not uploaded. Please upload a file before submitting."
        );
      }

      if (expenseType === "ConveyanceClaim") {
        //response = await Service.uploadConveyanceData(formData);
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/saveConveyanceItemData/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "TravelClaim") {
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/saveTravelItemData/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "MiscellaneousClaim") {
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/saveMiscellaneousItemData/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "FoodClaim") {
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/SaveFoodItemTableData/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "MobileClaim") {
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/saveMobileExpenseItemdata/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      }

      setExpData([{ file: null, description: "" }]);

      onClose();

      // Toast notification for successful submission
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
        title: "Successfully submitted claims data!",
      });

     // Wait for the success popup to complete (3 seconds)
      setTimeout(async () => {
        // After the success popup, trigger the backend Feign call
        await axios.post(
          `${BASE_URL}:9028/api/workflow/savingMainStatus/${empCode}/${expenseType}/${wbsId}`
        );
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error occurred while submitting form data:", error);
      // alert("Error occurred while submitting form data: " + error.message);

      // SweetAlert for error notification
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message || "Submit document as proof!",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          title: "text-sm",
          popup: "text-xs",
        },
      });
    }
  };


  const handleCancel = () => {
    //Cancel edit claim
  }


  const handleUpdateAndSubmit = async () => {
    try {
      // Call the handleSubmit function first and wait for it to complete
      await handleSubmit();

      // Then perform the delete request and wait for it to complete
      const deleteResponse = await axios.delete(
        `${BASE_URL}:9030/api/claims/deleteClaimsDraftTableData/${newEditClaim.empCode}/${newEditClaim.claimType}/${newEditClaim.autoNum}`
      );

      onClose();

      // alert("Draft deleted successfully: " + deleteResponse.data.message); // or any relevant data in the response
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
        title: "Successfully submitted the updated claims data!",
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(
        "Error occurred while updating and submitting form data:",
        error
      );
      // alert(
      //   "Error occurred while updating and submitting form data: " +
      //     error.message
      // );
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message || "Document not submitte! Try again.",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          title: "text-sm",
          popup: "text-xs",
        },
      });
    }
  };

  const handleDraftSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const addStatusAndWbsId = (data) => ({
      ...data,
      // empCode: info[0].empCode,
      wbsId: wbsId,
      description: description,
      claimType: expenseType,
      empCode: empCode,
      status: "Saved as Draft",
    });

    const appendDataAndFiles = (expenseTypeAll, expenseType) => {
      const dataWithExpenseType = expenseTypeAll.map((data) => ({
        ...data,
        expenseType,
      }));

      formData.append(
        "data",
        new Blob([JSON.stringify(dataWithExpenseType)], {
          type: "application/json",
        })
      );

      expenseTypeAll.forEach((data) => {
        if (data.file) {
          formData.append("files", data.file);
        }
      });
    };

    if (
      [
        "ConveyanceClaim",
        "TravelClaim",
        "MiscellaneousClaim",
        "FoodClaim",
        "MobileClaim",
      ].includes(expenseType)
    ) {
      const expenseTypeAll = Array.isArray(expData)
        ? expData.map(addStatusAndWbsId)
        : [];

      appendDataAndFiles(expenseTypeAll, expenseType);
    }

    try {
      const response = await axios.post(
        `${BASE_URL}:9030/api/claims/saveAllClaimsAsaDrafts/${expenseType}/${empCode}/${wbsId}/${description}`,
        formData
      );

      onClose();
      // alert("Form data submitted successfully: " + response);
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
        title: "Saved claims data as draft!",
      });
      setExpData([]);

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      // console.error("Error occurred while submitting form data:", error);
      // alert("Error occurred while submitting form data: " + error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message || "Data not saved in draft!",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          title: "text-sm",
          popup: "text-xs",
        },
      });
    }
  };

  useEffect(() => {
    if (Array.isArray(expData)) {
      // Calculate total amounts only if expData is an array
      const totalConveyanceAmount = expData.reduce(
        (total, entry) => total + parseFloat(entry.amount || 0),
        0
      );
      const totalTravelAmount = expData.reduce(
        (total, entry) => total + parseFloat(entry.amount || 0),
        0
      );
      const totalFoodAmount = expData.reduce(
        (total, entry) => total + parseFloat(entry.amount || 0),
        0
      );
      const totalMobileAmount = expData.reduce(
        (total, entry) => total + parseFloat(entry.amount || 0),
        0
      );
      const totalMiscellaneousAmount = expData.reduce(
        (total, entry) => total + parseFloat(entry.amount || 0),
        0
      );

      // Update total amounts in state
      setTotalAmounts((prevState) => ({
        ...prevState,
        conveyance: totalConveyanceAmount,
        travel: totalTravelAmount,
        food: totalFoodAmount,
        mobile: totalMobileAmount,
        miscellaneous: totalMiscellaneousAmount,
      }));
    } else {
      console.error("expData is not an array:", expData);
    }
  }, [expData]);

  useEffect(() => {
    if(viewDetailsBtnInfo){
    fetchComment();
    }
  }, [newEditClaim]);
  
  const [commentFetched, setCommentFetched] = useState([]);
  const fetchComment = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}:9028/api/workflow/getAllComments/${newEditClaim.claimNum}`
      );
      setCommentFetched(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  console.log("newEditClaim+++++++", newEditClaim);
  
  console.log("newEditClaim+++++++", newEditClaim);
  const postComment = () => {
    if (comment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }
    const wfSeqId = newEditClaim.claimNum;
    const url = `${BASE_URL}:9028/api/workflow/sendComments/${wfSeqId}/${empCode}`;
    axios
      .post(url, comment, { headers: { "Content-Type": "text/plain" } }) // Sending comment as plain text
      .then((response) => {
        console.log(`Comment posted successfully:`, response.data);
        // alert("Comment added successfully!");
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
          title: "Message sent successfully!",
        });
        setComment("");
        fetchComment();
      })
      .catch((error) => {
        console.error(`Error posting comment:`, error);
        alert("Failed to post comment. Please try again.");
      });
  };

  const handleOpenWithdraw = () => {
    setIsPopupVisible(true);
  };

  const handleWithdrawClaim = async () => {
    const url = `${BASE_URL}:9028/api/workflow/setOverallStatusOfMainAndItemTableForWithdrawButton/${newEditClaim.claimNum}`;

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

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    // setIsDeleteDraftVisible(false);
    //setClaimToWithdraw(null);
    // setDraftToDelete(null);
    setIsChecked(false);
  };

  // const toggleShowMore = () => {
  //   setShowMore(!showMore);
  // };

  //console.log(viewDetails.pendingClaim.status,"expenseType++++++!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log(readData, "readData...........................................");

  console.log(info, "info data");

  const mgrComments = newEditClaim?.mgrComments
    ? newEditClaim.mgrComments.split(",")
    : [];
  const mgrCommentDates = newEditClaim?.mgrCommentDateTime
    ? newEditClaim.mgrCommentDateTime.split(",")
    : [];

  // const handleOpenPendingDoc = (docId) => {
  //   navigate(`/doc-viewer/${docId}`);
  // };

  const handleOpenPendingDoc = (docId) => {
    navigate(`/doc-viewerClaim/${docId}`, {
      state: { fromInternalNavigation: true },
    });
  };


  useEffect(() => {
    if (info && info.length > 0) {
      if (viewDetailsBtnInfo || newEditClaim) {
        // Display only the projectId if viewDetailsBtnInfo is true
        const projectId = info[0]?.projectResDTO?.projectId || "No Project ID Available";
        setDropOptions([{ value: projectId, label: projectId }]);
      } else {
        // Populate the dropdown if viewDetailsBtnInfo is false
        const newOptions = info.map((infoItem) => ({
          value: infoItem.projectResDTO.projectId,
          label: infoItem.projectResDTO.projectId,
        }));
        const updatedOptions = [{ value: 0, label: "Select" }, ...newOptions];
        setDropOptions(updatedOptions);
      }
    }
  }, [info, viewDetailsBtnInfo]);


  
  // Show the first 3 comments by default
  const displayedComments = showMore ? commentFetched : commentFetched.slice(0, 3);
  // Function to toggle the visibility of more comments
  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };
  // Initials generation function
  const initial = (name) => {
    if (name === null) return '';
    const [firstName, lastName] = name.split(' ');
    const firstLetter = firstName.charAt(0);
    const secondLetter = lastName ? lastName.charAt(0) : firstName.charAt(1);
    return `${firstLetter}${secondLetter}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4 z-50">
      <div className="bg-white md:p-8 p-3 rounded-lg h-full md:w-full w-[412px] flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-base font-semibold ">
            {editInfo || (viewDetailsBtnInfo && tabIndex === 0) ? (
              <div className="text-sm">Request No: {newEditClaim.autoNum}</div>
            ) : viewDetailsBtnInfo && tabIndex > 0 ? (
              <div className="text-sm">
                {" "}
                Request No: {newEditClaim.claimNum}
              </div>
            ) : (
              <div className="text-sm">File your Claim</div>
            )}
          </h2>
          <button onClick={onClose} title="Close">
            <CgCloseO className="text-red-600 size-6" />
          </button>
        </div>
        {/* Add your form content here */}
        {/* {info.map((info) => ( */}

        {info.map((infoItem, index) => (
          <div className="grid md:grid-cols-12 grid-cols-6">
            <div className="md:col-span-6 col-span-6 mt-4 border border-gray-300 shadow-xl p-3 md:text-base text-xs">
              <div key={infoItem.id || index} className="">
                <div className=" grid grid-cols-6 border-b-[1px] border-gray-200 p-3 text-sm">
                  <div className="col-span-2 text-gray-500 font-medium ">
                    Employee Name
                  </div>
                  <div className="col-span-4 font-medium text-gray-700 text-sm">
                    {infoItem.fullNameAsAadhaar}
                  </div>
                </div>
                <div className="grid grid-cols-6 border-b-[1px] border-gray-200 p-3 text-sm">
                  <div className="col-span-2 text-gray-500 font-medium">
                    Email
                  </div>
                  <div className="col-span-4 font-medium text-gray-700 text-sm">
                    {infoItem.emailId}
                  </div>
                </div>
                <div className=" grid grid-cols-6 border-b-[1px] border-gray-200 p-3 text-sm">
                  <div className="col-span-2 text-gray-500 font-medium">
                    Employee Code
                  </div>
                  <div className="col-span-4 font-medium text-gray-700 text-sm">
                    {infoItem.empCode}
                  </div>
                </div>
                <div className=" grid grid-cols-6 border-b-[1px] border-gray-200 p-3 text-sm">
                  <div className="col-span-2 text-gray-500 font-medium">
                    Reporting manager
                  </div>
                  <div className="col-span-4 font-medium text-gray-700 text-sm">
                    {infoItem.reportingManager}
                  </div>
                </div>
                <div className=" grid grid-cols-6 border-b-[1px] border-gray-200 p-3 text-sm">
                  <div className="col-span-2 text-gray-500 font-medium text-sm">
                    Mobile Number
                  </div>
                  <div className="col-span-4 font-medium text-gray-700 text-sm">
                    {infoItem.primaryContactNo}
                  </div>
                </div>
                <div className="flex md:space-x-36 space-x-[70px] p-3 mt-3 md:text-base text-sm">
                  <div className="font-medium text-gray-700">
                    WBS
                    {/* <span className="text-red-500">*</span> */}
                  </div>
                  <div className="col-span-4">
                    <Dropdown
                      disabled={viewDetailsBtnInfo}
                      className=" md:w-[185px]  w-40"
                      placeholder="Select an option"
                      options={options}
                      onChange={handleDropdownWbs}
                      value={defaultOption}
                    />
                    {/* {wbsError && (
                      <p className="text-red-500 text-sm">
                        This field is required.
                      </p>
                    )} */}
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="md:my-2 my-4 md:text-sm text-xs">
                    Choose Expense Type to Continue
                  </h4>
                  <div className="flex md:space-x-20 space-x-2 md:text-base text-sm">
                    <h3 className="font-medium text-gray-700">
                      Expense Type<span className="text-red-500">*</span>
                    </h3>
                    {/* <Dropdown
                      disabled={viewDetailsBtnInfo}
                      className="md:w-[185px] w-40"
                      options={expenseTypeOptions.map((option) => ({
                        value: option.value,
                        label: (
                          <div className="flex items-center">
                            <img
                              src={option.image}
                              alt={option.label}
                              className="w-[46px] pr-3"
                            />
                            <span>{option.label}</span>
                          </div>
                        ),
                      }))}
                      onChange={handleExpenseTypeChange}
                      value={expenseType}
                    /> */}
                    <Dropdown
                      disabled={viewDetailsBtnInfo}
                      className="md:w-[185px] w-40"
                      options={expenseTypeOptions.map((option) => ({
                        value: option.value,
                        label: (
                          <div className="flex items-center">
                            <img
                              src={option.image}
                              alt={option.label}
                              className="w-[46px] pr-3"
                            />
                            <span>{option.label}</span>
                          </div>
                        ),
                      }))}
                      onChange={handleExpenseTypeChange}
                      value={expenseType}
                    />
                    {expenseTypeError && (
                      <p className="text-red-500 text-sm">
                        This field is required.
                      </p>
                    )}
                  </div>
                </div>





                <div className="flex md:space-x-24 space-x-6 p-3 md:text-base text-xs">
                  <h3>
                    Description<span className="text-red-500">*</span>
                      </h3>
                  <input
                    disabled={viewDetailsBtnInfo}
                    type="text"
                    id="desc"
                    className="h-[80px] w-[380px] border border-gray-300 text-sm"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setDescriptionError(false);
                    }}
                  />
                  {descriptionError && (
                    <p className= "text-red-500 text-sm flex">
                      Description required
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-6 col-span-6 p-5 md:ml-8 md:text-base text-xs">
              {!editInfo && !viewDetailsBtnInfo ? (
                <div>
                  <h3 className="font-medium text-gray-700">
                    Types of Expenses you can claim
                  </h3>
                  <div className="grid grid-cols-6 mt-4">
                    <div className="col-span-2 space-y-2">
                      <img
                        src="./burger.png"
                        alt="Food"
                        className="w-[86px] shadow-xl px-5 py-1"
                      />
                      <p className="pb-3 text-xs px-6 text-blue-500 font-semibold">
                        Food
                      </p>
                      <img
                        src="./fuel-pump.png"
                        alt="Conveyance"
                        className="w-[86px] shadow-xl px-5 py-1"
                      />
                      <p className="pb-3 text-xs px-1 font-semibold text-blue-500">
                        Conveyance
                      </p>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <img
                        src="./airplane.png"
                        alt="Travel"
                        className="w-[86px] shadow-xl px-5 py-1"
                      />
                      <p className="pb-3 text-xs px-6 font-semibold text-blue-500">
                        Travel
                      </p>
                      <img
                        src="./belongings.png"
                        alt="Miscellaneous"
                        className="w-[86px] shadow-xl px-5 py-1"
                      />
                      <p className="pb-3 text-xs font-semibold text-blue-500">
                        Miscellaneous
                      </p>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <img
                        src="./smartphone.png"
                        alt="Mobile"
                        className="w-[86px] shadow-xl px-5 py-1"
                      />
                      <p className="pb-3 text-xs px-6 font-semibold text-blue-500">
                        Mobile
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* {(tabIndex == 0 || editInfo) && (
                    <div className=" font-semibold text-sm text-gray-600 mt-5 p-4">
                      Status : Draft
                    </div>
                  )} */}
                  {editInfo && (
                    tabIndex === 0 ? (
                      <div className="font-semibold text-sm text-gray-600 mt-5 p-4">
                        Status : Draft
                      </div>
                    ) : tabIndex === 1 ? (
                      <div className="font-semibold text-sm text-gray-600 mt-5 p-4">
                        Status : Pending
                      </div>
                    ) : null
                  )}
                  {tabIndex == 1 && (
                    <div className="grid grid-cols-6 font-semibold text-2xl text-gray-600">
                      {/* <div className="col-span-2 -ml-6 -mt-10">
                                          Status : Pending
                                        </div> */}
                      <div className="col-span-4 ml-12 ">
                        <h2 className="text-center mb-20">
                          Application History
                        </h2>
                        <div className=" mt-4">
                          <div className="grid grid-cols-4">
                            <div className="col-span-2">
                              <p className="text-red-500 text-[22px]">
                                Pending
                              </p>
                              <div className="flex mb-4">
                                <p className="text-gray-400 text-[18px]">
                                  With
                                </p>
                                <p className="ml-2 text-[18px]">Manager</p>
                              </div>
                            </div>
                            <div className="col-span-2 mt-2 ml-24">
                              <button
                                className="bg-red-500 text-white w-[84px] rounded-md text-[15px]"
                                onClick={handleOpenWithdraw}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          {isPopupVisible && (
                            <div className="popup fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 py-36 px-56">
                              <div className="popup-content bg-white md:p-24 p-3 h-full md:w-full w-[412px] flex flex-col text-base">
                                <div>
                                Are you sure you want to delete the submitted claim request?
                                </div>
                                <div className="flex items-center mt-4">
                                  <input
                                    type="checkbox"
                                    id="agree"
                                    checked={isChecked}
                                    onChange={(e) =>
                                      setIsChecked(e.target.checked)
                                    }
                                    className="mr-2"
                                  />
                                  <label htmlFor="agree">I agree</label>
                                </div>
                                <div className="mt-4">
                                  <button
                                    className="bg-red-500 text-white p-2 rounded mr-2"
                                    disabled={!isChecked}
                                    onClick={handleWithdrawClaim}
                                  >
                                    Withdraw
                                  </button>
                                  <button
                                    className="bg-gray-500 text-white p-2 rounded"
                                    onClick={handleClosePopup}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* <div>{newEditClaim.mgrComments}</div>
                                            <div>{newEditClaim.mgrCommentDateTime}</div> */}
                          <div className="flex mb-8">
                            <input
                              className="border border-gray-300 w-full text-sm p-2"
                              placeholder="Enter your text..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                            <IoEnterOutline
                              className="-ml-9 mt-1 size-7 cursor-pointer"
                              onClick={postComment}
                            />
                          </div>
                          <div className="mt-3 text-base">
                            {commentFetched.length > 0 ? (
                              <ul>
                                {displayedComments.map((comment, index) => (
                                  <li key={index} className="text-xs">
                                    <div className="grid grid-cols-6 items-center">
                                      <div className="mr-2 col-span-1 border-r-2 border-gray-300 h-full">
                                        <h1
                                          className={`text-base ${index % 2 === 0
                                            ? "bg-blue-500"
                                            : "bg-orange-500"
                                            } rounded-full h-10 w-10 text-center text-white font-semibold pt-[8px]`}
                                        >
                                          {initial(comment.employeeName)}
                                        </h1>
                                      </div>
                                      <div className="col-span-5">
                                        <p className="text-gray-600 font-normal">
                                          <strong>{comment.employeeName}</strong> added a{" "}
                                          <strong>Comment</strong>
                                        </p>
                                        <p className="text-gray-500">{comment.comments}</p>
                                        <p className="text-gray-400 font-medium mb-4">{comment.commentDateTime}</p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No comments available.</p>
                            )}
                            {commentFetched.length > 3 && (
                              <div>
                                <button onClick={toggleShowMore} className="text-blue-500 mt-4">
                                  {showMore ? (
                                    <IoIosArrowDropup
                                      size={24}
                                      className="ml-36 mt-3 text-blue-600"
                                    />
                                  ) : (
                                    <IoIosArrowDropdown
                                      size={24}
                                      className="ml-36 mt-3 text-blue-600"
                                    />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {tabIndex == 2 && (
                    <div className="font-semibold text-sm text-gray-600 mt-5 p-4">
                      Status : Approved
                    </div>
                  )}
                  {tabIndex == 3 && (
                    <div className="font-semibold text-sm text-gray-600 mt-5 p-4">
                      Status : Rejected
                    </div>
                  )}
                  {tabIndex == 4 && (
                    <div className="font-semibold text-sm text-gray-600 mt-5 p-4">
                      Status : {claimStatus}
                    </div>
                  )}
                </div>
              )}
              {/* Conditionally render the div based on the selected expense type */}
              {viewDetailsBtnInfo ? (
                <div className="-mt-40">
                {expenseType && (
                  <div className="border border-gray-300 shadow-lg w-60 h-42 text-center md:mt-64 mt-8 p-8 ml-[100px]">
                    <h1 className="mt-4 font-medium">Total Claim Amount</h1>
                    <div className="text-red-500 text-xl">
                      {expenseType === "ConveyanceClaim" &&
                        `INR ${totalAmounts.conveyance}`}
                      {expenseType === "TravelClaim" &&
                        `INR ${totalAmounts.travel}`}
                      {expenseType === "FoodClaim" &&
                        `INR ${totalAmounts.food}`}
                      {expenseType === "MobileClaim" &&
                        `INR ${totalAmounts.mobile}`}
                      {expenseType === "MiscellaneousClaim" &&
                        `INR ${totalAmounts.miscellaneous}`}
                    </div>
                  </div>
                )}
              </div>
              ) : (
                <div>
                  {expenseType && (
                    <div className="border border-gray-300 shadow-lg w-60 h-42 text-center md:mt-28 mt-24 p-4 ml-32">
                      <h1 className="mt-5 font-medium">Total Claim Amount</h1>
                      <div className="text-red-500 mt-6 text-sm mb-4">
                        {expenseType === "ConveyanceClaim" &&
                          `INR ${totalAmounts.conveyance}`}
                        {expenseType === "TravelClaim" &&
                          `INR ${totalAmounts.travel}`}
                        {expenseType === "FoodClaim" &&
                          `INR ${totalAmounts.food}`}
                        {expenseType === "MobileClaim" &&
                          `INR ${totalAmounts.mobile}`}
                        {expenseType === "MiscellaneousClaim" &&
                          `INR ${totalAmounts.miscellaneous}`}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {/* Conditionally render dynamic input fields based on selected expense type */}
        {expenseType === "ConveyanceClaim" && (
          <div className="">
            <div className="flex justify-between mt-12 font-bold text-sm ">
              <h1 className="text-gray-600 mt-2">Claim Details</h1>
              {viewDetailsBtnInfo ? (
                " "
              ) : (
                <button onClick={handleConveyanceClick} title="Add More">
                  <MdAddBox className="text-blue-500 text-5xl" />
                </button>
              )}
            </div>
            <div className="border border-gray-300 shadow-xl overflow-x-auto md:text-base text-xs">
              <div className="grid md:grid-cols-12 grid-cols-4 gap-4 mt-2 border-b border-gray-300 md:p-4 p-1">
                <div className="col-name font-semibold ">S.No</div>
                <div className="col-name font-semibold md:-ml-8">Date</div>
                <div className="col-name font-semibold md:-ml-10">
                  From Location
                </div>
                <div className="col-name font-semibold md:-ml-4">
                  To Location
                </div>
                <div className="col-name font-semibold">From Time</div>
                <div className="col-name font-semibold">To Time</div>
                <div className="col-name font-semibold">Purpose</div>
                <div className="col-name font-semibold">Mode</div>
                <div className="col-name font-semibold">KM </div>
                <div className="col-name font-semibold">Currency</div>
                <div className="col-name font-semibold">Amount</div>
                <div className="col-name font-semibold">Documents</div>
              </div>
              <div className="grid md:grid-cols-12 grid-cols-4 gap-4 mt-2 p-4">
                {expData &&
                  expData.map((val, index) => (
                    <React.Fragment key={index}>
                      <input
                        className="p-2 mr-2 w-10"
                        name="sNo"
                        value={index + 1}
                        readOnly
                      />
                      <input
                        type="date"
                        className="mr-40 w-[100px] border border-gray-300 p-2 md:-ml-12"
                        name="date"
                        value={val.date}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <input
                        className="border border-gray-300 p-2 md:-ml-10 md:w-28"
                        name="fromLocation"
                        value={val.fromLocation}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <input
                        className="border border-gray-300 p-2 md:-ml-4 md:w-24"
                        name="toLocation"
                        value={val.toLocation}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <input
                        type="time"
                        className="border border-gray-300 p-2"
                        name="fromTime"
                        value={val.fromTime}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <input
                        type="time"
                        className="border border-gray-300 p-2"
                        name="toTime"
                        value={val.toTime}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <input
                        className="border border-gray-300 p-2"
                        name="purpose"
                        value={val.purpose}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <input
                        className="border border-gray-300 p-2"
                        name="modeOfTravel"
                        value={val.modeOfTravel}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <input
                        className="border border-gray-300 p-2"
                        name="distance"
                        value={val.distance}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <select
                        className="border border-gray-300 p-2"
                        name="currency"
                        value={val.currency}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        disabled={viewDetailsBtnInfo}
                      >
                        <option value="EUR">EUR</option>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                      <input
                        className="border border-gray-300 p-2"
                        type="number"
                        name="amount"
                        value={val.amount}
                        onChange={(e) => handleConveyanceInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <div className="flex ml-2 space-x-8 items-center">
                        {(val.docId && tabIndex>1)|| (viewDetailsBtnInfo && tabIndex > 0) ? (
                          // Display a clickable link to view the document if docId exists
                          <button
                            onClick={() => handleOpenPendingDoc(val.docId)}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
                            title=" View Document"
                          >
                            <IoEyeSharp />
                          </button>
                        ) : (
                          // Show file upload input if no docId
                          <div className="relative">
                            <input
                              type="file"
                              name="file"
                              onChange={(e) => uploadConveyanceFile(e, index)}
                              className="absolute opacity-0 cursor-pointer w-full h-full"
                            />
                            {/* <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" /> */}
                            {/* Conditionally render icons */}
                            {selectedFile ? (
                              <FaFileAlt className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            ) : (
                              <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            )}
                            {/* Tooltip */}
                            <span className="absolute left-0 top-full mt-1 text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {selectedFile
                                ? selectedFile.name
                                : "No file chosen"}
                            </span>
                          </div>
                        )}
                        {/* Delete icon only if not in view mode */}
                        {(tabIndex === 0 && viewDetailsBtnInfo) ||
                        newEditClaim ? (
                          <div onClick={() => handleConveyanceDelete(index)}>
                            <RiDeleteBin6Line className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
            {(editInfo && tabIndex === 0) ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={handleDraftSubmit}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)" }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleUpdateAndSubmit("ConveyanceClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Update & Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (editInfo && tabIndex === 1) ? (
              <div  className="text-center space-x-4 mt-24 ">
                <button 
                  onClick={() => handleEditSubmit("ConveyanceClaim")}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)"}}
                  >
                    Update
                    </button>
                    <button
                    onClick={handleCancel}
                     className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg">
                      Cancel
                      </button>
                      </div>
            ) : viewDetailsBtnInfo && tabIndex === 0 ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleUpdateAndSubmit("ConveyanceClaim")}
                  className="bg-green-400 text-white px-6 py-2 border rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : viewDetailsBtnInfo &&
              // (tabIndex === 1 || tabIndex === 2 || tabIndex === 3) ? (
              tabIndex >= 1 ? (
              <></>
            ) : (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleSubmit("ConveyanceClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={handleDraftSubmit}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Save as Draft
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
        {expenseType === "TravelClaim" && (
          <div className="">
            <div className="flex justify-between mt-12 font-bold text-sm ">
              <h1 className="text-gray-600 mt-2">Claim Details</h1>
              {viewDetailsBtnInfo ? (
                " "
              ) : (
                <button onClick={handleTravelClick} title="Add More">
                  <MdAddBox className="text-blue-500 text-5xl" />
                </button>
              )}
            </div>
            <div className="border border-gray-300 shadow-xl overflow-x-auto md:text-base text-xs">
              <div className="grid md:grid-cols-8 grid-cols-4 gap-4 mt-2 border-b border-gray-300 p-4">
                <div className="col-name font-semibold">S.No</div>
                <div className="col-name font-semibold">Date</div>
                <div className="col-name font-semibold">Exp Type</div>
                <div className="col-name font-semibold">From Location</div>
                <div className="col-name font-semibold">To Location</div>
                <div className="col-name font-semibold">Currency</div>
                <div className="col-name font-semibold">Amount</div>
                <div className="col-name font-semibold">Documents</div>
              </div>
              <div className="grid md:grid-cols-8 grid-cols-4 gap-4 mt-2 p-4">
                {expData &&
                  expData.map((val, index) => (
                    <React.Fragment key={index}>
                      <input
                        className="p-2"
                        name="sNo"
                        value={index + 1}
                        readOnly
                      />
                      <input
                        type="date"
                        className="mr-40 w-[150px] border border-gray-300 p-2 md:-ml-12"
                        name="date"
                        value={val.date}
                        onChange={(e) => handleTravelInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <select
                        className="border border-gray-300 p-2"
                        name="expMode"
                        value={val.expMode}
                        onChange={(e) => handleTravelInputChange(e, index)}
                        disabled={viewDetailsBtnInfo}
                      >
                        <option value="Flight Ticket">Flight Ticket</option>
                        <option value="BUS Ticket">BUS Ticket</option>
                        <option value="Lodging">Lodging</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Coolie & Cart">Coolie & Cart</option>
                        <option value="Cab">Cab</option>
                      </select>
                      <input
                        className="border border-gray-300 p-2"
                        name="fromLocation"
                        value={val.fromLocation}
                        onChange={(e) => handleTravelInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <input
                        className="border border-gray-300 p-2"
                        name="toLocation"
                        value={val.toLocation}
                        onChange={(e) => handleTravelInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <select
                        className="border border-gray-300 p-2"
                        name="currency"
                        value={val.currency}
                        onChange={(e) => handleTravelInputChange(e, index)}
                        disabled={viewDetailsBtnInfo}
                      >
                        <option value="EUR">EUR</option>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                      <input
                        className="border border-gray-300 p-2"
                        type="number"
                        name="amount"
                        value={val.amount}
                        onChange={(e) => handleTravelInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <div className="flex ml-2 space-x-8 items-center">
                        {(val.docId && tabIndex>1) || (viewDetailsBtnInfo && tabIndex > 0) ? (
                          // Display a clickable link to view the document if docId exists
                          <button
                            onClick={() => handleOpenPendingDoc(val.docId)}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
                            title=" View Document"
                          >
                            <IoEyeSharp />
                          </button>
                        ) : (
                          // Show file upload input if no docId
                          <div className="relative">
                            <input
                              type="file"
                              name="file"
                              onChange={(e) => uploadTravelFile(e, index)}
                              className="absolute opacity-0 cursor-pointer w-full h-full"
                            />
                            {/* <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" /> */}
                            {/* Conditionally render icons */}
                            {selectedFile ? (
                              <FaFileAlt className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            ) : (
                              <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            )}
                            {/* Tooltip */}
                            <span className="absolute left-0 top-full mt-1 text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {selectedFile
                                ? selectedFile.name
                                : "No file chosen"}
                            </span>
                          </div>
                        )}
                        {/* Delete icon only if not in view mode */}
                        {(tabIndex === 0 && viewDetailsBtnInfo) ||
                        newEditClaim ? (
                          <div onClick={() => handleTravelDelete(index)}>
                            <RiDeleteBin6Line className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
            {(editInfo && tabIndex === 0) ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={handleDraftSubmit}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)" }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleUpdateAndSubmit("TravelClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Update & Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (editInfo && tabIndex === 1) ? (
              <div  className="text-center space-x-4 mt-24 ">
                <button 
                  onClick={() => handleEditSubmit("TravelClaim")}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)"}}
                  >
                    Update
                    </button>
                    <button
                    onClick={handleCancel}
                     className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg">
                      Cancel
                      </button>
                      </div>
                      ) : viewDetailsBtnInfo && tabIndex === 0 ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleUpdateAndSubmit("TravelClaim")}
                  className="bg-green-400 text-white px-6 py-2 border rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : viewDetailsBtnInfo &&
              // (tabIndex === 1 || tabIndex === 2 || tabIndex === 3) ? (
              tabIndex >= 1 ? (
              <></>
            ) : (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleSubmit("TravelClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={handleDraftSubmit}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Save as Draft
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
        {expenseType === "FoodClaim" && (
          <div className="">
            <div className="flex justify-between mt-12 font-bold text-sm ">
              <h1 className="text-gray-600 mt-2">Claim Details</h1>
              {viewDetailsBtnInfo ? (
                " "
              ) : (
                <button onClick={handleFoodClick} title="Add More">
                  <MdAddBox className="text-blue-500 text-5xl" />
                </button>
              )}
            </div>
            <div className="border border-gray-300 shadow-xl">
              <div className="grid md:grid-cols-6 grid-cols-3 gap-4 mt-2 border-b border-gray-300 p-4">
                <div className="col-name font-semibold ml-8">S.No</div>
                <div className="col-name font-semibold">Date</div>
                <div className="col-name font-semibold">Purpose</div>
                <div className="col-name font-semibold">Currency</div>
                <div className="col-name font-semibold">Amount</div>
                <div className="col-name font-semibold">Documents</div>
              </div>
              <div className="grid md:grid-cols-6 grid-cols-3 gap-4 mt-2 p-4">
                {expData &&
                  expData.map((val, index) => (
                    <React.Fragment key={index}>
                      <input
                        className="ml-8"
                        name="sNo"
                        value={index + 1}
                        readOnly
                      />
                      <input
                        type="date"
                        className="mr-40 w-[150px] border border-gray-300 h-9 px-2 outline-none"
                        name="date"
                        value={val.date}
                        onChange={(e) => handleFoodInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <input
                        className="border border-gray-300 p-2 w-[150px]"
                        name="purpose"
                        value={val.purpose}
                        onChange={(e) => handleFoodInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <select
                        className="border border-gray-300 p-2 w-[150px]"
                        name="currency"
                        value={val.currency}
                        onChange={(e) => handleFoodInputChange(e, index)}
                        disabled={viewDetailsBtnInfo}
                      >
                        <option value="EUR">EUR</option>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                      <input
                        className="border border-gray-300 p-2 w-[150px]"
                        type="number"
                        name="amount"
                        value={val.amount}
                        onChange={(e) => handleFoodInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <div className="flex ml-2 space-x-8 items-center">
                        {(val.docId && tabIndex>1) && (viewDetailsBtnInfo && tabIndex > 0) ? (
                          // Display a clickable link to view the document if docId exists
                          <button
                            onClick={() => handleOpenPendingDoc(val.docId)}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
                            title=" View Document"
                          >
                            <IoEyeSharp />
                          </button>
                        ) : (
                          // Show file upload input if no docId
                          <div className="relative">
                            <input
                              type="file"
                              name="file"
                              onChange={(e) => uploadFoodFile(e, index)}
                              className="absolute opacity-0 cursor-pointer w-full h-full"
                            />
                            {/* <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" /> */}
                            {/* Conditionally render icons */}
                            {selectedFile ? (
                              <FaFileAlt className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            ) : (
                              <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            )}
                            {/* Tooltip */}
                            <span className="absolute left-0 top-full mt-1 text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {selectedFile
                                ? selectedFile.name
                                : "No file chosen"}
                            </span>
                          </div>
                        )}
                        {(tabIndex === 0 && viewDetailsBtnInfo) ||
                        newEditClaim ? (
                          <div onClick={() => handleFoodDelete(index)}>
                            <RiDeleteBin6Line className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
            {(editInfo && tabIndex === 0) ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={handleDraftSubmit}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)" }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleUpdateAndSubmit("FoodClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Update & Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (editInfo && tabIndex === 1) ? (
              <div  className="text-center space-x-4 mt-24 ">
                <button 
                  onClick={() => handleEditSubmit("FoodClaim")}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)"}}
                  >
                    Update
                    </button>
                    <button
                    onClick={handleCancel}
                     className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg">
                      Cancel
                      </button>
                      </div>
            ) : viewDetailsBtnInfo && tabIndex === 0 ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleUpdateAndSubmit("FoodClaim")}
                  className="bg-green-400 text-white px-6 py-2 border rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : viewDetailsBtnInfo &&
              //
              tabIndex >= 1 ? (
              <></>
            ) : (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleSubmit("FoodClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={handleDraftSubmit}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Save as Draft
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
        {expenseType === "MobileClaim" && (
          <div className="">
            <div className="flex justify-between mt-12 font-bold text-sm ">
              <h1 className="text-gray-600 mt-2">Claim Details</h1>
              {viewDetailsBtnInfo ? (
                " "
              ) : (
                <button onClick={handleMobileClick} title="Add More">
                  <MdAddBox className="text-blue-500 text-5xl" />
                </button>
              )}
            </div>
            <div className="border border-gray-300 shadow-xl">
              <div className="grid md:grid-cols-6 grid-cols-3 gap-4 mt-2 border-b border-gray-300 p-4">
                <div className="col-name font-semibold ml-8 ">S.No</div>
                <div className="col-name font-semibold">Date</div>
                <div className="col-name font-semibold">Purpose</div>
                <div className="col-name font-semibold">Currency</div>
                <div className="col-name font-semibold">Amount</div>
                <div className="col-name font-semibold">Documents</div>
              </div>
              <div className="grid md:grid-cols-6 grid-cols-3 gap-4 mt-2 p-4">
                {expData &&
                  expData.map((val, index) => (
                    <React.Fragment key={index}>
                      <input
                        className="p-2"
                        name="sNo"
                        value={index + 1}
                        readOnly
                      />
                      <input
                        type="date"
                        className="mr-40 w-[150px] border border-gray-300 h-9 px-2 outline-none"
                        name="date"
                        value={val.date}
                        onChange={(e) => handleMobileInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <input
                        className="border border-gray-300 p-2 w-[150px]"
                        name="purpose"
                        value={val.purpose}
                        onChange={(e) => handleMobileInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <select
                        className="border border-gray-300 p-2 w-[150px]"
                        name="currency"
                        value={val.currency}
                        onChange={(e) => handleMobileInputChange(e, index)}
                        disabled={viewDetailsBtnInfo}
                      >
                        <option value="EUR">EUR</option>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                      <input
                        className="border border-gray-300 p-2 w-[150px]"
                        type="number"
                        name="amount"
                        value={val.amount}
                        onChange={(e) => handleMobileInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <div className="flex ml-2 space-x-8 items-center">
                        {(val.docId && tabIndex>1) || (viewDetailsBtnInfo && tabIndex > 0) ? (
                          // Display a clickable link to view the document if docId exists
                          <button
                            onClick={() => handleOpenPendingDoc(val.docId)}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
                            title=" View Document"
                          >
                            <IoEyeSharp />
                          </button>
                        ) : (
                          // Show file upload input if no docId
                          <div className="relative">
                            <input
                              type="file"
                              name="file"
                              onChange={(e) => uploadMobileFile(e, index)}
                              className="absolute opacity-0 cursor-pointer w-full h-full"
                            />
                            {/* <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" /> */}
                            {/* Conditionally render icons */}
                            {selectedFile ? (
                              <FaFileAlt className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            ) : (
                              <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            )}
                            {/* Tooltip */}
                            <span className="absolute left-0 top-full mt-1 text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {selectedFile
                                ? selectedFile.name
                                : "No file chosen"}
                            </span>
                          </div>
                        )}
                        {/* Delete icon only if not in view mode */}
                        {(tabIndex === 0 && viewDetailsBtnInfo) ||
                        newEditClaim ? (
                          <div onClick={() => handleMobileDelete(index)}>
                            <RiDeleteBin6Line className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
            {(editInfo && tabIndex === 0) ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={handleDraftSubmit}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)" }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleUpdateAndSubmit("MobileClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Update & Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (editInfo && tabIndex === 1) ? (
              <div  className="text-center space-x-4 mt-24 ">
                <button 
                  onClick={() => handleEditSubmit("MobileClaim")}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)"}}
                  >
                    Update
                    </button>
                    <button
                    onClick={handleCancel}
                     className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg">
                      Cancel
                      </button>
                      </div>
            ) : viewDetailsBtnInfo && tabIndex === 0 ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleUpdateAndSubmit("MobileClaim")}
                  className="bg-green-400 text-white px-6 py-2 border rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : viewDetailsBtnInfo &&
              // (tabIndex === 1 || tabIndex === 2 || tabIndex === 3) ? (
              tabIndex >= 1 ? (
              <></>
            ) : (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleSubmit("MobileClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={handleDraftSubmit}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Save as Draft
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
        {expenseType === "MiscellaneousClaim" && (
          <div className="">
            <div className="flex justify-between mt-12 font-bold text-sm ">
              <h1 className="text-gray-600 mt-2">Claim Details</h1>
              {viewDetailsBtnInfo ? (
                " "
              ) : (
                <button onClick={handleMiscellaneousClick} title="Add More">
                  <MdAddBox className="text-blue-500 text-5xl" />
                </button>
              )}
            </div>
            <div className="border border-gray-300 shadow-xl">
              <div className="grid md:grid-cols-7 grid-cols-4 gap-4 mt-2 border-b border-gray-300 p-4">
                <div className="col-name font-semibold">S.No</div>
                <div className="col-name font-semibold">Date</div>
                <div className="col-name font-semibold">Exp Type</div>
                <div className="col-name font-semibold">Purpose</div>
                <div className="col-name font-semibold">Currency</div>
                <div className="col-name font-semibold">Amount</div>
                <div className="col-name md:col-span-1 col-span-2 font-semibold">
                  Documents
                </div>
              </div>
              <div className="grid md:grid-cols-7 grid-cols-4 gap-4 mt-2 p-4">
              {expData &&
                  expData.map((val, index) => (
                    <React.Fragment key={index}>
                      <input
                        className="p-2"
                        name="sNo"
                        value={index + 1}
                        readOnly
                      />
                      <input
                        type="date"
                        className="mr-40 w-[150px] border border-gray-300 h-9 px-2 outline-none"
                        name="date"
                        value={val.date}
                        onChange={(e) => handleMiscellaneousInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <select
                        className="border border-gray-300 p-2"
                        name="expMode"
                        value={val.expMode}
                        onChange={(e) =>
                          handleMiscellaneousInputChange(e, index)
                        }
                        disabled={viewDetailsBtnInfo}
                      >
                        <option value="Flight Ticket">Telephone</option>
                        <option value="BUS Ticket">
                          Printing & Stationery
                        </option>
                        <option value="Lodging">Spare parts</option>
                        <option value="Food & Beverage">Others</option>
                      </select>
                      <input
                        className="border border-gray-300 p-2"
                        name="purpose"
                        value={val.purpose}
                        onChange={(e) =>
                          handleMiscellaneousInputChange(e, index)
                        }
                        readOnly={viewDetailsBtnInfo}
                      />
                      <select
                        className="border border-gray-300 p-2"
                        name="currency"
                        value={val.currency}
                        onChange={(e) =>
                          handleMiscellaneousInputChange(e, index)
                        }
                        disabled={viewDetailsBtnInfo}
                      >
                        <option value="EUR">EUR</option>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                      <input
                        className="border border-gray-300 p-2"
                        type="number"
                        name="amount"
                        value={val.amount}
                        onChange={(e) =>
                          handleMiscellaneousInputChange(e, index)
                        }
                        readOnly={viewDetailsBtnInfo}
                      />
                      <div className="flex ml-2 space-x-8 items-center">
                        {(val.docId && tabIndex>1) && (viewDetailsBtnInfo && tabIndex > 0) ? (
                          // Display a clickable link to view the document if docId exists
                          <button
                            onClick={() => handleOpenPendingDoc(val.docId)}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
                            title=" View Document"
                          >
                            <IoEyeSharp />
                          </button>
                        ) : (
                          // Show file upload input if no docId
                          <div className="relative">
                            <input
                              type="file"
                              name="file"
                              onChange={(e) =>
                                uploadMiscellaneousFile(e, index)
                              }
                              className="absolute opacity-0 cursor-pointer w-full h-full"
                            />
                            {/* <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" /> */}
                            {/* Conditionally render icons */}
                            {selectedFile ? (
                              <FaFileAlt className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            ) : (
                              <GrAttachment className="cursor-pointer text-blue-500 hover:text-blue-700" />
                            )}
                            {/* Tooltip */}
                            <span className="absolute left-0 top-full mt-1 text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {selectedFile
                                ? selectedFile.name
                                : "No file chosen"}
                            </span>
                          </div>
                        )}
                        {/* Delete icon only if not in view mode */}
                        {(tabIndex === 0 && viewDetailsBtnInfo) ||
                        newEditClaim ? (
                          <div onClick={() => handleMiscellaneousDelete(index)}>
                            <RiDeleteBin6Line className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
            {(editInfo && tabIndex === 0) ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={handleDraftSubmit}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)" }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleUpdateAndSubmit("MiscellaneousClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Update & Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (editInfo && tabIndex === 1) ? (
              <div  className="text-center space-x-4 mt-24 ">
                <button 
                  onClick={() => handleEditSubmit("MiscellaneousClaim")}
                  className="border text-white px-6 py-2 rounded-lg"
                  style={{ backgroundColor: "rgb(62, 243, 65)"}}
                  >
                    Update
                    </button>
                    <button
                    onClick={handleCancel}
                     className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg">
                      Cancel
                      </button>
                      </div>
            ) : viewDetailsBtnInfo && tabIndex === 0 ? (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleUpdateAndSubmit("MiscellaneousClaim")}
                  className="bg-green-400 text-white px-6 py-2 border rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : viewDetailsBtnInfo &&
              // (tabIndex === 1 || tabIndex === 2 || tabIndex === 3) ? (
              tabIndex >= 1 ? (
              <></>
            ) : (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleSubmit("MiscellaneousClaim")}
                  className="bg-blue-500 text-white px-6 py-2 border border-blue-500 rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={handleDraftSubmit}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Save as Draft
                </button>
                <button
                  onClick={onClose}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddClaims;
