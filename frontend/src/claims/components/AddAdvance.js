///////////addadvance(after merging manpreet code)////////////

import React, { useEffect, useState } from "react";
import { CgCloseO } from "react-icons/cg";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { MdAddBox } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrAttachment } from "react-icons/gr";
import Service from "./Service";
import { useStore1, useStore2, useStore3 } from "./ClaimStore";
import axios from "axios";
import { TextArea } from "semantic-ui-react";
import { IoEnterOutline } from "react-icons/io5";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoEyeSharp } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { BASE_URL } from "../../config/Config";

const AddAdvance = ({ onClose }) => {
  const currentDate = new Date();
  const [expenseType, setExpenseType] = useState(""); // State to store selected expense type
  const [expenseTypeError, setExpenseTypeError] = useState(false);
  const [advData, setAdvData] = useState([]); // State for conveyance data
  const advanceTypeOptions = [
    { value: "RTA", label: "RTA", image: "./user.png" },
    { value: "IOU", label: "IOU", image: "./office-building.png" },
  ];
  const [info, setInfo] = useState([]);
  const [totalAmounts, setTotalAmounts] = useState({ rta: 0, iou: 0 });
  // const { editClaim} = useStore1();
  const [wbsId, setWbsId] = useState(null);
  //const [wbsError, setWbsError] = useState(false);
  // const {viewDetails, removeViewDetailsClaim} = useStore2();
  const [comment, setComment] = useState("");
  const [shouldPost, setShouldPost] = useState(false);
  const [fetchComments, setfetchComments] = useState([]);
  // const { withdrawClaim ,removeWithdrawClaim} = useStore1();
  const [isChecked, setIsChecked] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [readAdvData, setReadAdvData] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const { newEditClaim, tabIndex, claimStatus } = useStore3();
  const { editInfo, viewDetailsBtnInfo } = useStore1();
  const [expData, setExpData] = useState([
    {
      date: "",
      purpose: "",
      currency: "",
      amount: "",
      file: null,
      docId: null,
    },
  ]);
  //const empCode = sessionStorage.getItem("UserId");
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const [options, setDropOptions] = useState([]);
  const defaultOption = options[0];

  const empCode = localStorage.getItem("empId");

  // useEffect(() => {
  //   axios
  //     .get(`${BASE_URL}:9030/api/claims/getEmpClaimInfo/${empCode}`)
  //     .then((response) => {
  //       // Extract empResDTO from response data
  //       const empData = response.data.map((item) => item.empResDTO);
  //       setInfo(empData);
  //       console.log("employee info data==", empData);
  //       setReadAdvData(sessionStorage.getItem("viewDetailsBtnInfo"));
  //     })
  //     .catch((error) => console.error("Error fetching data:", error));
  // }, [empCode, viewDetailsBtnInfo]);

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
        setReadAdvData(viewDetailsBtnInfo);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [empCode, viewDetailsBtnInfo]);

  const handleDropdownWbs = (selectedOption) => {
    setWbsId(selectedOption.value); // Update wbsId when dropdown value changes
    console.log("selectedwbs...", selectedOption.value);
  };

  const handleAdvanceTypeChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setExpenseType(selectedValue);
  };

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
  const handleRtaClick = () => {
    setExpData([
      ...expData,
      { toDate: "", purpose: "", currency: "", amount: "", file: null },
    ]);
  };

  // Function to handle adding a new dynamic input row for conveyance
  const handleIouClick = () => {
    setExpData([
      ...expData,
      { toDate: "", purpose: "", currency: "", amount: "", file: null },
    ]);
  };

  // Function to handle deleting a dynamic input row for travel
  const handleRtaDelete = (index) => {
    const updatedRtaData = [...expData];
    updatedRtaData.splice(index, 1);
    setExpData(updatedRtaData);
  };

  // Function to handle deleting a dynamic input row for travel
  const handleIouDelete = (index) => {
    const updatedIouData = [...expData];
    updatedIouData.splice(index, 1);
    setExpData(updatedIouData);
  };

  // Update the input change handler functions to update the corresponding state object
  const handleRtaInputChange = (e, index) => {
    const { name, value, files } = e.target;
    const newData = [...expData];
    newData[index] = {
      ...newData[index],
      [name]: name === "file" && files ? files[0] : value,
    };
    setExpData(newData);
  };

  // Update the input change handler functions to update the corresponding state object
  const handleIouInputChange = (e, index) => {
    const { name, value, files } = e.target;
    const newData = [...expData];
    newData[index] = {
      ...newData[index],
      [name]: name === "file" && files ? files[0] : value,
    };
    setExpData(newData);
  };
  const [file, setFile] = useState([]);

  const uploadRtaFile = (e, index) => {
    const { files } = e.target;
    const newData = [...expData];
    newData[index]["file"] = files[0]; // Update file property
    setExpData(newData);
    setSelectedFile(files[0]);
    console.log("RTA Data after file upload:", newData); // Log the updated RTA data
  };

  const uploadIouFile = (e, index) => {
    const { files } = e.target;
    const newData = [...expData];
    newData[index]["file"] = files[0]; // Update file property
    setExpData(newData);
    setSelectedFile(files[0]);
    console.log("RTA Data after file upload:", newData); // Log the updated RTA data
  };

  const handleSubmit = async (e) => {
    try {
      const formData = new FormData();
      let response;

      const advanceTypeAll = Array.isArray(expData)
        ? expData.map((data) => ({
            ...data,
            empCode: info[0].empCode,
            wbsId: wbsId,
            description,
          }))
        : [];
      const expenseDataWithAdvanceType = advanceTypeAll.map((data) => ({
        ...data,
        expenseType,
      }));

      formData.append(
        "data",
        new Blob([JSON.stringify(expenseDataWithAdvanceType)], {
          type: "application/json",
        })
      );
      let fileAdded = false;

      advanceTypeAll.forEach((data) => {
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
          "Required fields are empty. Please fill in all required fields."
        );
      }

      if (!fileAdded) {
        throw new Error(
          "File not uploaded. Please upload a file before submitting."
        );
      }

      if (expenseType === "RTA") {
        // response = await Service.uploadRtaData(formData);
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/uploadRtaExpense/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "IOU") {
        //response = await Service.uploadIouData(formData);
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/uploadIouExpense/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      }
      setExpData([{ file: null, description: "" }]);
      // alert("Form data submitted successfully: " + response);
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
        title: "Successfully submitted advance claim!",
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

      const advanceTypeAll = Array.isArray(expData)
        ? expData.map((data) => ({
            ...data,
            empCode: info[0].empCode,
            wbsId: wbsId,
            description,
          }))
        : [];
      const expenseDataWithAdvanceType = advanceTypeAll.map((data) => ({
        ...data,
        expenseType,
      }));

      formData.append(
        "data",
        new Blob([JSON.stringify(expenseDataWithAdvanceType)], {
          type: "application/json",
        })
      );
      let fileAdded = false;

      advanceTypeAll.forEach((data) => {
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
          "Required fields are empty. Please fill in all required fields."
        );
      }

      if (!fileAdded) {
        throw new Error(
          "File not uploaded. Please upload a file before submitting."
        );
      }

      if (expenseType === "RTA") {
        // response = await Service.uploadRtaData(formData);
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/uploadRtaExpense/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      } else if (expenseType === "IOU") {
        //response = await Service.uploadIouData(formData);
        response = await axios.post(
          `${BASE_URL}:9030/api/claims/uploadIouExpense/${expenseType}/${empCode}/${wbsId}/${description}`,
          formData
        );
      }
      setExpData([{ file: null, description: "" }]);
      // alert("Form data submitted successfully: " + response);
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
        title: "Successfully submitted advance claim!",
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

 



  const handleUpdateAndSubmit = async () => {
    try {
      // Call the handleSubmit function first and wait for it to complete
      await handleSubmit();

      // Then perform the delete request and wait for it to complete
      const deleteResponse = await axios.delete(
        `${BASE_URL}:9030/api/claims/deleteAdvance/${newEditClaim.empCode}/${newEditClaim.claimType}/${newEditClaim.autoNum}`
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
      alert(
        "Error occurred while updating and submitting form data: " +
          error.message
      );
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

    const appendDataAndFiles = (advanceTypeAll, expenseType) => {
      const dataWithAdvanceType = advanceTypeAll.map((data) => ({
        ...data,
        expenseType,
      }));

      formData.append(
        "data",
        new Blob([JSON.stringify(dataWithAdvanceType)], {
          type: "application/json",
        })
      );

      advanceTypeAll.forEach((data) => {
        if (data.file) {
          formData.append("files", data.file);
        }
      });
    };

    if (["RTA", "IOU"].includes(expenseType)) {
      const advanceTypeAll = Array.isArray(expData)
        ? expData.map(addStatusAndWbsId)
        : [];

      appendDataAndFiles(advanceTypeAll, expenseType);
    }

    try {
      // const response = await Service.uploadAdvClaimsDrafts(formData);
      const response = await axios.post(
        `${BASE_URL}:9030/api/claims/saveAdvanceAllClaimsDrafts/${expenseType}/${empCode}/${wbsId}/${description}`,
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
        title: "Saved advance claims as draft!",
      });
      setExpData([]);

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error occurred while submitting form data:", error);
      alert("Error occurred while submitting form data: " + error.message);
    }
  };

  useEffect(() => {
    if (Array.isArray(expData)) {
      // Calculate total amounts only if expData is an array
      const totalRtaAmount = expData.reduce(
        (total, entry) => total + parseFloat(entry.amount || 0),
        0
      );
      const totalIouAmount = expData.reduce(
        (total, entry) => total + parseFloat(entry.amount || 0),
        0
      );

      // Update total amounts in state
      setTotalAmounts((prevState) => ({
        ...prevState,
        rta: totalRtaAmount,
        iou: totalIouAmount,
      }));
    } else {
      console.error("expData is not an array:", expData);
    }
  }, [expData]);

  // Function to handle cancel button click within Advance form
  const handleCancel = () => {
    // setExpenseType(""); // Reset advanceType to hide the RTA form
  };

  useEffect(() => {
    if (viewDetailsBtnInfo) {
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
  useEffect(() => {
    fetchComment();
  }, [newEditClaim]);
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
        // window.location.reload();
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
    setIsChecked(false);
  };

 

  const mgrComments = newEditClaim?.mgrComments
    ? newEditClaim.mgrComments.split(",")
    : [];
  const mgrCommentDates = newEditClaim?.mgrCommentDateTime
    ? newEditClaim.mgrCommentDateTime.split(",")
    : [];

  const handleOpenPendingDoc = (docId) => {
    navigate(`/doc-viewerClaim/${docId}`);
  };

  useEffect(() => {
    if (info && info.length > 0) {
      if (viewDetailsBtnInfo || newEditClaim) {
        // Display only the projectId if viewDetailsBtnInfo is true
        const projectId =
          info[0]?.projectResDTO?.projectId || "No Project ID Available";
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


  const [showMore, setShowMore] = useState(false);
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
          {/* <h2 className="text-sm font-semibold">
            {editInfo || (viewDetailsBtnInfo && tabIndex === 0) ? (
              <div className="text-sm">Request No: {newEditClaim.autoNum}</div>
            ) : viewDetailsBtnInfo && tabIndex > 0 ? (
              <div className="text-sm">
                {" "}
                Request No: {newEditClaim.claimNum}
              </div>
            ) : (
              <div className="text-sm">Create New Advance Request</div>
            )}
          </h2> */}
          <h2 className="text-sm font-semibold">
            {editInfo || (viewDetailsBtnInfo && tabIndex === 0) ? (
              <div className="text-sm">Request No: {newEditClaim.autoNum}</div>
            ) : viewDetailsBtnInfo && tabIndex > 0 ? (
              <div className="text-sm">
                {" "}
                Request No: {newEditClaim.claimNum}
              </div>
            ) : (
              <div className="text-sm">Create New Advance Request</div>
            )}
          </h2>
          <button onClick={onClose}>
            <CgCloseO className="text-red-600 size-6" />
          </button>
        </div>
        {/* Add your form content here */}
        {info.map((infoItem, index) => (
          // {Array.isArray(info) && info.map((infoItem, index) => (
          <div className="grid md:grid-cols-12 grid-cols-6">
            <div className="md:col-span-6 col-span-6 mt-4 border border-gray-300 shadow-xl p-3 md:text-base text-xs">
              <div key={index} className="">
                <div className=" grid grid-cols-6 border-b-[1px] border-gray-200 p-3 ">
                  <div className="col-span-2 text-gray-500 font-medium text-sm">
                    Employee Name
                  </div>
                  <div className="col-span-4 font-medium text-gray-700 text-sm">
                    {infoItem.fullNameAsAadhaar}
                  </div>
                </div>
                <div className="grid grid-cols-6 border-b-[1px] border-gray-200 p-3">
                  <div className="col-span-2 text-gray-500 font-medium text-sm">
                    Email
                  </div>
                  <div className="col-span-4 font-medium text-gray-700 text-sm">
                    {infoItem.emailId}
                  </div>
                </div>
                <div className=" grid grid-cols-6 border-b-[1px] border-gray-200 p-3">
                  <div className="col-span-2 text-gray-500 font-medium text-sm">
                    Employee Code
                  </div>
                  <div className="col-span-4 font-medium text-gray-700 text-sm">
                    {infoItem.empCode}
                  </div>
                </div>
                <div className=" grid grid-cols-6 border-b-[1px] border-gray-200 p-3">
                  <div className="col-span-2 text-gray-500 font-medium text-sm">
                    Reporting manager
                  </div>
                  <div className="col-span-4 font-medium text-gray-700 text-sm">
                    {infoItem.reportingManager}
                  </div>
                </div>
                <div className=" grid grid-cols-6 border-b-[1px] border-gray-200 p-3">
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
                  <h4 className="md:my-2 my-4 text-xs text-gray-500 font-medium">
                    Choose Advance Type to Continue
                  </h4>
                  <div className="flex md:space-x-20 space-x-2">
                    <h3 className="font-medium text-gray-700 text-sm">
                      Advance Type
                    </h3>
                    <Dropdown
                      disabled={viewDetailsBtnInfo}
                      className="md:w-[185px] w-40 text-sm"
                      options={advanceTypeOptions.map((option) => ({
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
                      onChange={handleAdvanceTypeChange}
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
                  <h3 className="text-sm">Description</h3>
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
                </div>
              </div>
            </div>
            <div className="md:col-span-6 col-span-6 p-5 md:ml-8 md:text-base text-xs">
              {!editInfo && !viewDetailsBtnInfo ? (
                <div>
                  <h3 className="font-medium text-gray-700">
                    Types of Advances you can claim
                  </h3>
                  <div className="grid grid-cols-6 mt-4">
                    <div className="col-span-2 space-y-2">
                      <img
                        src="./user.png"
                        alt="RTA"
                        className="w-[86px] shadow-xl px-5 py-1"
                      />
                      <p className="pb-3 text-xs px-8 text-blue-500 font-semibold">
                        RTA
                      </p>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <img
                        src="../office-building.png"
                        alt="IOU"
                        className="w-[86px] shadow-xl px-5 py-1"
                      />
                      <p className="pb-3 text-xs px-8 font-semibold text-blue-500">
                        IOU
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
                                Are you sure you want to delete the submitted advance claim request?
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
                    <div className="font-semibold text-2xl text-gray-600 mt-5 p-4">
                      Status : {claimStatus}
                    </div>
                  )}
                </div>
              )}
              {/* Conditionally render the div based on the selected expense type */}
              {viewDetailsBtnInfo ? (
                <div className="">
                {expenseType && (
                  <div className="border border-gray-300 shadow-lg w-60 h-42 text-center md:mt-20 mt-24 p-6 ml-24">
                    <h1 className="mt-4 font-medium">Total Claim Amount</h1>
                    <div className="text-red-500 text-xl">
                      INR{" "}
                      {expenseType === "RTA"
                        ? totalAmounts.rta
                        : totalAmounts.iou}
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
                        INR{" "}
                        {expenseType === "RTA"
                          ? totalAmounts.rta
                          : totalAmounts.iou}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {expenseType === "RTA" && (
          <div className="">
            <div className="flex justify-between mt-12 font-bold text-sm ">
              <h1 className="text-gray-600 mt-2">Advance Details</h1>
              <button onClick={handleRtaClick}>
                <MdAddBox className="text-blue-500 text-5xl" />
              </button>
            </div>
            <div className="border border-gray-300 shadow-xl">
              <div className="grid md:grid-cols-6 grid-cols-3 gap-4 mt-2 border-b border-gray-300 p-4">
                <div className="col-name font-semibold ">S.No</div>
                <div className="col-name font-semibold md:-ml-8">Date</div>
                <div className="col-name font-semibold">Purpose</div>
                <div className="col-name font-semibold">Currency</div>
                <div className="col-name font-semibold">Amount</div>
                <div className="col-name font-semibold">Documents</div>
              </div>
              <div className="grid md:grid-cols-6 grid-cols-3 gap-4 mt-2 p-4">
                {/* {advData.map((val, index) => ( */}
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
                        className="mr-40 w-[150px] border border-gray-300 h-9 px-2 outline-none"
                        name="date"
                        value={val.date}
                        onChange={(e) => handleRtaInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <input
                        className="border border-gray-300 p-2"
                        name="purpose"
                        value={val.purpose}
                        onChange={(e) => handleRtaInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <select
                        className="border border-gray-300 p-2"
                        name="currency"
                        value={val.currency}
                        onChange={(e) => handleRtaInputChange(e, index)}
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
                        onChange={(e) => handleRtaInputChange(e, index)}
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
                              onChange={(e) => uploadRtaFile(e, index)}
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
                          <div onClick={() => handleRtaDelete(index)}>
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
                  onClick={() => handleUpdateAndSubmit("Rta")}
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
                  onClick={() => handleEditSubmit("Rta")}
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
                  onClick={() => handleUpdateAndSubmit("Rta")}
                  className="bg-green-400 text-white px-6 py-2 border rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={handleCancel}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : viewDetailsBtnInfo &&
              (tabIndex === 1 || tabIndex === 2 || tabIndex === 3) ? (
              <></>
            ) : (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleSubmit("Rta")}
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
                  onClick={handleCancel}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
        {expenseType === "IOU" && (
          <div className="">
            <div className="flex justify-between mt-12 font-bold text-sm ">
              <h1 className="text-gray-600 mt-2">Advance Details</h1>
              <button onClick={handleIouClick}>
                <MdAddBox className="text-blue-500 text-5xl" />
              </button>
            </div>
            <div className="border border-gray-300 shadow-xl">
              <div className="grid md:grid-cols-6 grid-cols-3 gap-4 mt-2 border-b border-gray-300 p-4">
                <div className="col-name font-semibold ">S.No</div>
                <div className="col-name font-semibold md:-ml-8">Date</div>
                <div className="col-name font-semibold">Purpose</div>
                <div className="col-name font-semibold">Currency</div>
                <div className="col-name font-semibold">Amount</div>
                <div className="col-name font-semibold">Documents</div>
              </div>
              <div className="grid md:grid-cols-6 grid-cols-3 gap-4 mt-2 p-4">
                {/* {advData.map((val, index) => ( */}
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
                        className="mr-40 w-[200px] border border-gray-300 h-9 px-2 outline-none"
                        name="date"
                        value={val.date}
                        onChange={(e) => handleIouInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <input
                        className="border border-gray-300 p-2"
                        name="purpose"
                        value={val.purpose}
                        onChange={(e) => handleIouInputChange(e, index)}
                        readOnly={viewDetailsBtnInfo}
                      />
                      <select
                        className="border border-gray-300 p-2"
                        name="currency"
                        value={val.currency}
                        onChange={(e) => handleIouInputChange(e, index)}
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
                        onChange={(e) => handleIouInputChange(e, index)}
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
                              onChange={(e) => uploadIouFile(e, index)}
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
                          <div onClick={() => handleIouDelete(index)}>
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
                  onClick={() => handleUpdateAndSubmit("Iou")}
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
                  onClick={() => handleEditSubmit("Iou")}
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
                  onClick={() => handleSubmit("Iou")}
                  className="bg-green-400 text-white px-6 py-2 border rounded-lg"
                >
                  Submit
                </button>
                <button
                  onClick={handleCancel}
                  className="border border-gray-700 text-gray-700 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : viewDetailsBtnInfo &&
              (tabIndex === 1 || tabIndex === 2 || tabIndex === 3) ? (
              <></>
            ) : (
              <div className="text-center space-x-4 mt-24 ">
                <button
                  onClick={() => handleSubmit("Iou")}
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
                  onClick={handleCancel}
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

export default AddAdvance;
