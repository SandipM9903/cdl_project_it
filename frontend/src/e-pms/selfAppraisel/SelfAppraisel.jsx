// **Objects Related to API Interactions:**

// 1. **`selfAssm`**: This object stores the self-assessment data fetched from the API. It likely contains information about the employee's self-assessment for the current appraisal period.
// 2. **`devGoals`**: This object stores the development goals data fetched from the API. It likely contains information about the employee's development goals for the current appraisal period.
// 3. **`profileInfo`**: This object stores the employee's profile information fetched from the API. It likely contains information like the employee's name, designation, department, and other relevant details.
// 4. **`draftRatingComments`**: This object stores the draft rating and comment data fetched from the API. It likely contains the employee's draft self-assessment for the current appraisal period.

// **Objects Related to Form Input and State Management:**

// 1. **`localGoals`**: This object stores the goals and development goals data received from the previous page as props.
// 2. **`addDevGoals`**: This object stores the additional development goals entered by the user.
// 3. **`submitRatings`**: This object stores the user's ratings for different criteria.
// 4. **`submitComments`**: This object stores the user's comments for different criteria.
// 5. **`devAssessment`**: This object stores the user's self-assessment for development goals.

// **Objects Related to API Error Handling and Null Values:**

// - The code includes error handling mechanisms using `catch` blocks. If API requests fail, error messages might be logged to the console.
// - Null values might be encountered if the API responses are empty or if there are issues with data fetching. In such cases, the component might display appropriate messages or default values.

// **Objects Related to `onChange` and `handle` Functions:**

// - `handleChangeAddDevelopmentGoals`: Updates the `addDevGoals` object with the user's input for development goals.
// - `handleRatingsChange`: Updates the `submitRatings` object with the user's input for ratings.
// - `handleCommentsChange`: Updates the `submitComments` object with the user's input for comments.
// - `handleChangeFeedback`: Updates the `draftRatingComments` object with the user's input for overall rating and comments.
// - `handleChangeAssessment`: Updates the `devAssessment` object with the user's input for self-assessment of development goals.

import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import { useLocalStorage } from "react-use";
import Swal from "sweetalert2";
import Service from "../Service";
import { BASE_URL } from "../../config/Config";
// import { useDevGoals } from "../GlobalStorage/ZustandStore";

// imports necessary modules for creating a React component,
// making HTTP requests with Axios, navigating in a React application,

function SelfAppraisel({ goalsandDevGoals }) {
  console.dir(goalsandDevGoals, { depth: null });
  //goalsandDevGoals is passed as a prop here from the goal setting page.
  const [localGoals, setLocalGoals] = useState(goalsandDevGoals || null);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [value, setValue] = useState("");
  const [info, setInfo] = useState("");
  const [icon, setIcon] = useState();
  const [popoverVisible1, setPopoverVisible1] = useState(false);
  const [popoverVisible2, setPopoverVisible2] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draftInfo, setDraftInfo] = useState("");
  const [selfAssm, setSelfAssm] = useState([]);
  const [devGoals, setDevGoals] = useState([]);
  const [goals, setGoals] = useState([]);
  const [addDevGoals, setAddDevGoals] = useState({});
  const [SubmitRatingComments, setSubmitRatingComments] = useState([]);
  const [moveToggle, setmoveToggle] = useState(0);
  const [active, setActive] = useState(false);
  const [profileInfo, setProfileInfo] = useState([]);
  const [overAllRating, setOverAllRating] = useState([]);
  const [overAllComment, setOverAllComment] = useState("");
  const [targetOption, setTargetOption] = useState([]);
  const [managerSubmitted, setManagerSubmitted] = useState(false);
  const [managerAssessmentValue, setManagerAssessmentValue] = useState("");

  const empCode = localStorage.getItem("empId");

  // useEffect(() => {
  //   Service.getemployeeKraOrDraft(1)
  //     .then((response) => setSelfAssm(response.data))
  //     .catch((err) => console.log(err));
  // }, []);

  // useEffect(() => {
  //   Service.getemployeeKraOrDraft(empId)
  //     .then((response) => setSelfAssm(response.data))
  //     .catch((err) => {
  //       Swal.fire(" Employee Appraisel Found");
  //     });
  // }, []);

  useEffect(() => {
    if (goalsandDevGoals) {
      console.log(
        "goalsandDevGoals.savedAppraiseeGoals>>>>>>yes>>>>>>>>",
        goalsandDevGoals.savedAppraiseeGoals
      );
      setGoals(goalsandDevGoals.savedAppraiseeGoals);
      setLocalGoals(goalsandDevGoals);
      setDevGoals(goalsandDevGoals.savedDevelopmentGoals); // Ensure it's an array

      console.log("devGoals>>>>>>yes>>>>>>>>", devGoals);
      console.log("selfAssm>>>>>>yes>>>>>>>>", selfAssm);
      console.log("localGoals>>>>>>yes>>>>>>>>", localGoals);
    } else {
      setLocalGoals(null);
      console.log("localGoals>>>>>>>>>>null>>>>", localGoals);
    }
  }, [goalsandDevGoals]);

  useEffect(() => {
    if (goalsandDevGoals) {
      console.log(
        "goalsandDevGoals.savedAppraiseeGoals>>>>>>yes>>>>>>>>",
        goalsandDevGoals.savedAppraiseeGoals
      );
      setSelfAssm(goalsandDevGoals.savedAppraiseeGoals); // Ensure it's an array
      console.log("selfAssm>>>>>>yes>>>>>>>>", selfAssm);
    } else {
      setLocalGoals(null);
      console.log("localGoals>>>>>>>>>>null>>>>", localGoals);
    }
  }, [goalsandDevGoals]);

  useEffect(() => {
    Service.getProfileByEmpIdAllUrl().then((res) => setValue(res.data));
  }, []);

  console.warn(devGoals, "devGoals...");

  // useEffect(() => {
  //   Service.getDevGoalsByEmpId()
  //     .then((response) => setDevGoals(response.data))
  //     .catch((err) => {
  //       // Swal.fire("No dev goals found");
  //     });
  // }, []);

  //logic for calculate average of ratings.

  useEffect(() => {
    const averageSelfRating = calculateAverage(goals);
    console.log("goals>>>>>>>>>>>>>>>>>>>>>>>", goals);
    console.log("averageSelfRating>>>>>>>>>>>>>>>>>>>>>>>", averageSelfRating);

    setOverAllRating(averageSelfRating);
  }, [goals]);

  const calculateAverage = (arr) => {
    const validRatings = arr
      .map((item) => parseFloat(item.selfRating)) // Convert to number
      .filter((rating) => !isNaN(rating)); // Exclude invalid or null ratings

    if (validRatings.length === 0) {
      return 0; // Avoid division by zero
    }

    const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
    const average = sum / validRatings.length;

    return average.toFixed(2); // Return average with 2 decimal points
  };

  console.warn(value, "value");

  console.log(addDevGoals, "addDevGoals");
  console.log("localGoals>>>>>>>>>>>>>>", localGoals);
  console.log(
    "localGoals.savedAppraiseeGoals>>>>>>>>>>>>>>",
    localGoals?.savedAppraiseeGoals
  );
  console.log(
    "localGoals.savedDevelopmentGoals>>>>>>>>>>>>>>",
    localGoals?.savedDevelopmentGoals
  );

  const handleChangeAddDevelopmentGoals = (index, field, value) => {
    const updatedData = [...devGoals];
    updatedData[index][field] = value;
    // localGoals.savedDevelopmentGoals;
    setDevGoals(updatedData);

    console.log("devGoals>>>>>>>>>>>>>>>>", devGoals);
  };

  const handleRateingAndCommentsChange = (index, field, value) => {
    // Ensure `selfAssm` is an array
    if (!Array.isArray(goals)) {
      console.error("selfAssm is not an array:", goals);
      return;
    }
    const updatedData = [...goals];
    updatedData[index][field] = value;
    setGoals(updatedData);

    console.log("Updated selfAssm>>>>>>>>>>>>>>>>", goals);
  };

  console.log(goals, "goals");

  // const { devGoalsStore } = useDevGoals();
  // console.log(devGoalsStore, { depth: null });

  const handleSubmitDevGoals = () => {
    console.log("devGoals>>>>>>>>>>>>>>>>", addDevGoals);
    // Service.postDevlopmentGoalsUrl(addDevGoals).then((res) =>
    //   console.log("devGoals", res.data)
    // );
  };

  console.log(addDevGoals, "addDevGoals+++++++++++++++++++++++++++++");

  // --------------------------FOR FETCHING THE TODAYS DATE------------------------
  const [dateLocal, setDateLocal, remove] = useLocalStorage("date", "local");
  //remove is used to remove the local storage thing or value from the browser Once its value is stored locally there...

  const [draftRatingComments, setDraftRatingComments] = useState("");
  console.warn(draftRatingComments.overallRating, "draftRatingComments");

  const [submitRatings, setSubmitRatings] = useState([]);

  const [submitComments, setSubmitComments] = useState([]);

  // CONVERTING STRING TO OBJECT AND STORE IN DATABASE

  let submitRatingsString = "";
  for (let i in submitRatings) {
    submitRatingsString += submitRatings[i] + ",";
  }

  let totalSubmitRatingsString = submitRatingsString.slice(
    0,
    submitRatingsString.length - 1
  );
  console.log(submitRatingsString.slice(0, submitRatingsString.length - 1)); // This will log the current state of ratingComment

  let submitCommentsString = "";
  for (let i in submitComments) {
    submitCommentsString += submitComments[i] + ",";
  }

  let totalSubmitCommentsString = submitCommentsString.slice(
    0,
    submitCommentsString.length - 1
  );
  console.log(submitCommentsString.slice(0, submitCommentsString.length - 1)); // This will log the current state of ratingComment

  // // convert string to List

  // Draft Rating And Comments

  useEffect(() => {
    Service.getSelfAssessmentDraftByEmpIdUrl(empCode).then((response) => {
      setDraftRatingComments(response.data);
      // Check if submittedOn exists in the response
      if (response.data.submittedOn) {
        setDateLocal(response.data.submittedOn);
      }
      setSubmitRatings({
        rating: response?.data?.rating?.split(",")[0],
        rating1: response?.data?.rating?.split(",")[1],
        rating2: response?.data?.rating?.split(",")[1],
        rating3: response?.data?.rating?.split(",")[1],
      });

      setSubmitComments({
        comment: response?.data?.comment?.split(",")[0],
        comment1: response?.data?.comment?.split(",")[1],
        comment2: response?.data?.comment?.split(",")[1],
        comment3: response?.data?.comment?.split(",")[1],
      });
    });
  }, []);

  // HERE I TAKEN THE FLAG VALUE TO PERFORM THE FUNCTIONALITY OF SAVE AS DRAFT AND SUBMIT
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    Service.getSelfAssessmentByEmpIdUrl(empCode)
      .then((response) => {
        setDraftRatingComments(response.data);
        setFlag(false);

        // THIS MEANS THAT-----

        setSubmitRatings({
          rating: response?.data?.rating?.split(",")[0],
          rating1: response?.data?.rating?.split(",")[1],
          rating2: response?.data?.rating?.split(",")[1],
          rating3: response?.data?.rating?.split(",")[1],
        });

        setSubmitComments({
          comment: response?.data?.comment?.split(",")[0],
          comment1: response?.data?.comment?.split(",")[1],
          comment2: response?.data?.comment?.split(",")[1],
          comment3: response?.data?.comment?.split(",")[1],
        });
      })
      .catch((err) => {
        // Swal.fire("No rating comment found");
      });
  }, []);

  const handleChangeFeedback = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setOverAllComment(value);

    if (value.length >= 1) {
      setActive(true);
    }

    console.log("overAllComment   >>>>>>>>>>>>>>>  ", overAllComment);

    // setDraftRatingComments({ ...draftRatingComments, [key]: value });
  };

  console.log(draftRatingComments, "draftRatingComments");

  // -------------------So devAssessment is used for the self Assessment of the devlopment goals------------

  const [devAssessment, setDevAssessment] = useState(null);
  const handleChangeAssessment = (e) => {
    const value = e.target.value;
    if (value.length >= 1) {
      setActive(true);
    }
    setDevAssessment(value);

    // localGoals.savedDevelopmentGoals;
  };

  const handleDraftRatingComments = () => {
    let AllDraftRatingComments = {
      ...draftRatingComments,
      empCode: empCode,
      rating: totalSubmitRatingsString,
      comment: totalSubmitCommentsString,
    };
    console.log(AllDraftRatingComments, "AllDraftRatingComments");
    Service.postSelfAssessmentDraft(AllDraftRatingComments).then((response) => {
      Service.getSelfAssessmentDraftByEmpIdUrl(empCode).then((response) => {
        setDraftRatingComments(response.data);
        // setLocal("You have saved as draft");

        setIcon(<IoMdCheckmarkCircleOutline />);
        setButtonsVisible(false);
        setPopoverVisible1(false);
      });
    });
  };
  // THIS FUNCTION IS TO MANAGE MULTIPLE VALUES OR ENTRIES.
  //A var is declared that accepts the values from the draftRatingComments and returns it as a string.
  //then post and GET API are called and setSubmitted function is INVOKED.

  // submit

  // --------------------------------------------------------------------------------------



  //WE CANNOT EDIT THE ARRAYS DIRECTLY IN THE FRONT END UI AFTER SUBMITTING IT AS DRAFT.
  // TO EDIT THE ARRAY OF RATING AND COMMENTS WE HAVE TAKEN IT IN OBJECT WAY AND CONVERTED IT TO STRING AND SPLIT

  useEffect(() => {
    Service.getByProfileById(empCode).then((response) =>
      setProfileInfo(response.data)
    );
  }, []);

  console.warn(profileInfo, "profileInfo");
  // ---------------------------------------------------------------------------------------------------------------------

  const [
    masterSelfAppraisalResponse,
    setMasterSelfApprasialResponse,
  ] = useState("");

  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (status) {
      getEmployeeStatus();
    }
  }, [status]);

  const [submittedStatus, setSubmittedStatus] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form behavior
    const todayDate = new Date().toISOString().split("T")[0]; // For example: "2024-07-17"
    setDateLocal(todayDate);
    // -----------------------------------------------------------------------------------------------------------------------
    const overAllRatingAndComments = {
      overallRating: overAllRating,
      overallComments: overAllComment,
      submittedOnn: todayDate,
      //reviewedOnn: dateLocal----------this thing has to be added in the manager screen.
    };
    console.log(
      overAllRatingAndComments,
      "overAllRatingAndComments>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    );

    // const [overAllRating, setOverAllRating] = useState([]);
    // const [overAllComment, setOverAllComment] = useState([]);
    const combinedObject = {
      overAllGoalsAndRatingComments: overAllRatingAndComments,
      devGoalsList: devGoals,
      goalsList: goals,
    };

    console.log(combinedObject);

    console.log(combinedObject, "combinedObjectcccccccccccccccccccc");

    console.log(
      "overAllRatingAndComments>>>>>>>>>>>>>>>>>>>",
      overAllRatingAndComments
    );
    console.log("combinedObject>>>>>>>>>>>>>>>>>>>", combinedObject);

    Service.postemployeeKraAndDevGoalsWithOverAllRatingAndComments(
      empCode,
      combinedObject
    )
      .then((res) => {
        setMasterSelfApprasialResponse(res?.data);
        setStatus(true);
        getEmployeeStatus();
        setSubmittedStatus(false);
        Swal.fire({
          icon: "success",
          title: "Self Appraisal Submitted successfully!",
        });
        // toast.success("Self Appraisal Submitted successfully!");
      })
      .catch((err) => {
        Swal.fire("draft deleted");
      });

    console.warn("devGoals   >>>>>>>>>>>>>>>  ", devGoals);
    console.warn("goals   >>>>>>>>", goals);
    console.warn("combinedObject >>>>>>>>>>>>>>", combinedObject);
  };

  console.log(
    masterSelfAppraisalResponse,
    "masterSelfAppraisalResponse^^^^^^^^^^^"
  );
  console.warn(masterSelfAppraisalResponse?.data?.submittedOnn, "submittedOnn");

  // ----------------------------------------------------------------------------------------------

  const [employeeDetailsStatusInfo, setEmpDetailsStatusInfo] = useState("");
  // get employee status

  useEffect(() => {
    getEmployeeStatus();
  }, []);

  const [submitStatus, setSubmitStatus] = useState(false);

  const getEmployeeStatus = () => {
    axios
      .get(`${BASE_URL}:9031/api/getUniqueEmployeeStatus/${empCode}`)
      .then((res) => {
        setEmpDetailsStatusInfo(res?.data);
        setSubmitStatus(true);
        if (res?.data?.submittedOnn != null) {
          setSubmittedStatus(false);
        }
      })
      .catch((err) => {
        // Swal.fire("No Employee Status Available");
        // toast.warn("Employee Status Not Available");
      });
  };

  console.log(employeeDetailsStatusInfo, "*&&&&&&&&&&&&&&&&^^^++++++++++++++");

  // -----------------------------------------------------------------------------------------------

  useEffect(() => {
    axios
      .get(`${BASE_URL}:9031/api/getAllOperators`)
      .then((res) => {
        setTargetOption(res.data);
      })
      .catch((err) => {
        Swal.fire("No target option Found");
      });
  }, []);

  // ------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="w-full h-screen bg-gray-200 ">
      <div className="bg-white top-2 pb-24">
        {/* Adding one seprating line according to the figma design */}

        <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4 mt-4"> </h1>

        {/* To make this we have to make a grid of 11 coloumns.4 for profile picture,role etc and 2 for "submitted on" and 5 for self rating */}

        <div className="grid grid-cols-11 ">
          {/* ------------------------------------------------------------------------------------------------------------------------------------------------------ */}

          {/* PROFILE CARD IS displayed HERE */}

          <div className="col-span-4 ">
            <div className="grid grid-cols-12">
              <div className="col-span-2 ">
                <img
                  src={require("../profille.jpg")}
                  className="rounded-full h-[40px] w-[42px] ml-6 mt-4"
                  alt="Profile"
                />
              </div>

              <div className="col-span-10 ">
                <div className="ml-2 mb-4 mt-2">
                  <h2 className="font-thin text-sm  mx-8 pt-3 w-56 flex-col justify-center -ml-0 text-black">
                    {profileInfo.fileAndObjectTypeBean?.empResDTO?.firstName}{" "}
                  </h2>
                  <p className=" font-medium text-m text-blue-900 -ml-0 pt-1">{`${profileInfo.fileAndObjectTypeBean?.empResDTO?.designationResDTO?.designationName} - 
                  ${profileInfo.fileAndObjectTypeBean?.empResDTO?.mainDeptResDTO.mainDepartment}`}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Adding one seprating line according to the figma design */}
          <div className="col-span-2 border-l-[1px] border-gray-300 mt-2">
            <div className="ml-8 pl-6 mt-2">
              <div className="pb-1">
                <h2 className="text-sm font-thin text-black">Submitted On</h2>
              </div>
              <div className="flex space-x-3 pt-1">
                <div className="calender-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="44"
                    viewBox="0 0 448 512"
                    fill="gray"
                  >
                    <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z" />
                  </svg>
                </div>
                <div className="text-m -mt-1">
                  {/*  {draftRatingComments.submittedOn || "No date submitted yet"} */}
                  {/* {masterSelfAppraisalResponse?.data?.submittedOnn} */}
                  {employeeDetailsStatusInfo?.submittedOnn}
                </div>
              </div>
            </div>
          </div>

          {/* NOW THE SELF RATING PART is displayed AND ALSO ADDING ONE SEPRATING LINE ACCORDING TO THE FIGMA DESIGN*/}

          <div className="col-span-5 border-l-[1px] border-gray-300 mt-2">
            <div className="div ml-6 pl-6 mt-2">
              <div className="pb-1">
                <h2 className="text-sm font-thin text-black">
                  Self Assessment
                </h2>
              </div>
              {/* <div className="text-sm text-red-600 font-medium pl-6">
                {draftRatingComments.overallRating}
                BECAUSE THE  VALUE OF SELF ASSESSMENT IS SAME AS THE OVERALL RATING
              </div> */}
              <textarea
                name="overallSelfRating"
                id=""
                className="text-sm text-red-600 font-medium pl-6"
                onChange={handleChangeFeedback}
                // value={overallValue.overallMgrRating}
                value={draftRatingComments.overallRating || overAllRating}
              ></textarea>
            </div>
          </div>
        </div>

        {/* A SEPRATING LINE AS PER THE FIGMA DESIGN */}
        <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4"> </h1>

        {/* -------------------------------------------------------------------------------------------------------------------------------------- */}

        <div>
          <h1 className="text-sm font-medium text-black pl-4 pt-4">
            Self Assessment
          </h1>

          {/* we have to divide the grid in 9 parts and then give the divison of col span accordingly */}

          <div className="grid grid-cols-9">
            <div className="col-span-2  ml-4 mt-3 mb-6">
              <div className="ml-4 mb-12 space-y-6 pt-3">
                <h2 className="font-extralight text-sm  mx-8 pt-3 w-56 flex-col justify-center -ml-0 text-black">
                  Overall Rating
                </h2>
                <p className=" font-extralight text-sm text-black -ml-0 pt-2 flex-col">
                  Overall Comments
                </p>
              </div>
            </div>

            <div className="col-span-4 mt-3">
              <div className="-ml-28 mb-12 space-y-6 pt-3">
                <textarea
                  type="text"
                  placeholder="Add rating.."
                  className=" placeholder-gray-300 overflow-hidden resize-none w-[20%] h-[40px] font-extralight text-sm text-black -ml-0 pt-3 border-[1px] border-gray-300 p-1"
                  name="overallRating"
                  onChange={handleChangeFeedback}
                  value={draftRatingComments.overallRating || overAllRating}
                />
                <textarea
                  type="text"
                  placeholder="Add comment.."
                  className="  placeholder-gray-300 overflow-hidden resize-none w-[100%] h-[130px] font-extralight text-sm text-black -ml-0 pt-1 border-[1px] border-gray-300 p-1"
                  name="overallComments"
                  onChange={handleChangeFeedback}
                  value={
                    employeeDetailsStatusInfo?.selfOverallComments ||
                    draftRatingComments.overallComments ||
                    overAllComment
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* NOW THE THIRD PART STARTS */}

        <div className="">
          <div className="flex space-x-[130px] pb-1">
            <h1 className="text-sm font-medium text-black pl-5 pt-4 text-left">
              Objective Area & KRA / Goals & Objective
            </h1>
            <h1 className="text-sm font-medium text-black pl-5 pt-4 text-left ">
              Measurement criteria / Target
            </h1>
            <div className="flex space-x-3 pr-24">
              <img
                src={require("../profille.jpg")}
                className="rounded-full h-[34px] w-[36px] ml-6 mt-4"
                alt="Profile"
              />
              <h2 className="font-thin text-base  mx-8 pt-3 w-56 flex-col justify-center -ml-0 mt-2 text-blue-500">
                {profileInfo.fileAndObjectTypeBean?.empResDTO?.firstName}{" "}
              </h2>
            </div>
          </div>
          {/* A SEPRATING LINE AS PER THE FIGMA DESIGN */}
          <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4 mb-4"> </h1>
          {/* we have to divide the grid in 12 parts and then give the devison of col span according */}
          {/* THIS IS THE LOGIC OF DISPLAYING THE DATA FROM THE DATABASE FROM THE BACKEND AND THEN WRITING IN THE FRONT END */}
          {/* ----------------------------------------------------------------------------------------------------------- */}
          <div className="grid grid-cols-12 mb-8">
            {localGoals?.savedAppraiseeGoals?.length > 0 ? (
              <>
                {/* Goals Section */}
                <div className="col-span-7">
                  {localGoals?.savedAppraiseeGoals?.map((i, index) => (
                    <div key={`${index}-${i}`} className="grid grid-cols-7">
                      {/* Weightage */}
                      <div className="col-span-1 -mt-4">
                        <h2 className="font-extralight text-sm mx-8 pt-3 justify-center ml-10">
                          {i.weightage}
                        </h2>
                        <p className="font-extralight text-sm ml-4 mt-2 text-gray-500">
                          Weightage
                        </p>
                      </div>

                      {/* KRA and Goals */}
                      <div className="col-span-3 -mt-4 -ml-8">
                        <div className="ml-4 mb-12">
                          <h2 className="font-extralight text-sm mx-8 pt-3 flex-col justify-center ml-10">
                            {i.kra}
                          </h2>
                          <div className="font-extralight text-m mt-2 flex-col justify-center ml-10 text-gray-500">
                            {i.goals
                              .split(/(?=\d+\.\s)/)
                              .map((line, lineIndex) => (
                                <p key={`${lineIndex}-${line.trim()}`}>
                                  {line.trim()}
                                </p>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Measurement Criteria */}
                      <div className="col-span-3 mt-4 flex -space-x-3 ml-4">
                         <div className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[45px] h-[35px] pl-4">
                            {targetOption.find(
                              (option) => option.targetOperatorId === parseInt(i?.target)
                            )?.targetOperator || ""}
                          </div>


                        {/* <h2 className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[45px] h-[35px] pl-4">
                          {i.target}
                        </h2> */}
                        <h2 className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[60px] h-[35px] pl-2 pt-1">
                          {i.measurement}
                        </h2>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ratings and Comments Section */}
                <div className="col-span-5 ml-8">
                  <div
                    className={`col-span-3 -mt-1 ${
                      submitted ? "space-y-14" : "space-y-4"
                    }`}
                  >
                    <div className="space-y-2">
                      {localGoals?.savedAppraiseeGoals?.map((i, index) => (
                        <div key={`rating-comment-${index}`}>
                          {/* Rating */}
                          <div>
                            <h3
                              className={`text-gray-500 text-sm ${
                                submitted ? "hidden" : ""
                              }`}
                            >
                              Rating
                            </h3>
                            <input
                              type="text"
                              placeholder="0.0"
                              className={`input input-bordered w-[15%] h-[30px] max-w-xs outline-none ${
                                submitted
                                  ? "cursor-not-allowed font-medium text-sm" // Non-editable style
                                  : "border-[1px] border-gray-200"
                              }`}
                              name={`rating-${index}`}
                              value={submitRatings.selfRating}
                              onChange={(e) => {
                                const value = e.target.value;

                                // Validate the rating
                                if (
                                  value === "" ||
                                  isNaN(value) ||
                                  parseFloat(value) > 100 ||
                                  parseFloat(value) === 0
                                ) {
                                  alert(
                                    "The rating must be between 1 and 100. Please enter a valid value."
                                  );
                                  return; // Keep the input editable after the alert
                                }

                                handleRateingAndCommentsChange(
                                  index,
                                  "selfRating",
                                  value
                                );
                              }}
                              disabled={submitted} // Disable input when submitted
                              defaultValue={i.selfRating}
                            />
                          </div>

                          {/* Comments */}
                          <div>
                            <h3
                              className={`text-gray-500 text-sm ${
                                submitted ? "hidden" : ""
                              }`}
                            >
                              Comments
                            </h3>
                            <textarea
                              placeholder="Enter your comments"
                              className={`overflow-hidden resize-none w-[60%] h-[65px] outline-none ${
                                submitted
                                  ? "cursor-not-allowed font-extralight text-gray-500" // Non-editable style
                                  : "border-[1px] border-gray-200"
                              }`}
                              name={`comment-${index}`}
                              value={submitComments.comment3}
                              onChange={(e) =>
                                handleRateingAndCommentsChange(
                                  index,
                                  "selfComment",
                                  e.target.value
                                )
                              }
                              disabled={submitted} // Disable textarea when submitted
                              defaultValue={i.selfComment}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-7 text-center mt-10">
                <h2 className="font-extralight text-sm text-red-500">
                  No goals submitted in the quarter.
                </h2>
              </div>
            )}
          </div>
          {/* localGoals inside this map devGoalsStore its value */}
          {/* -----------------------------------------------NOW THE DEVELOPMENT GOALS------------------------------------------------- */}
          <div className="ml-[800px] -mt-[275px]">
            <div className="mt-64">
              <div className="-ml-[760px] pb-8">
                <h1 className="text-sm font-medium mb-6 pt-12">
                  Development Goals
                </h1>
                <div className="grid grid-cols-8 -space-x-10">
                  {/* Trainings */}

                  <div className="space-x-4 w-[1000px]">
                    <div className="col-span-2">
                      <h2 className="font-extralight text-sm mx-8 pt-3 ml-10">
                        Trainings
                      </h2>

                      {localGoals?.savedDevelopmentGoals?.map((j, index) => (
                        <div
                          key={`${index}-${j.training}`}
                          className="grid grid-cols-4 gap-4 items-start border-b-[1px] border-gray-300 pb-4 mb-4"
                        >
                          {/* Training */}
                          {/* <h2 className="font-extralight text-sm mx-8 pt-3 ml-10">
                              Trainings
                            </h2> */}
                          <div>
                            <p className="font-extralight text-normal text-gray-500 ml-10 mt-2 border-[1px] border-gray-300 w-[200px] h-[40px] p-1">
                              {j.training}
                            </p>
                          </div>

                          {/* Development Goals & Plans */}
                          <div>
                            <h2 className="font-extralight text-sm mx-8  ml-10">
                              Development Goals & Plans
                            </h2>
                            <p className="font-extralight text-normal text-gray-500 ml-10 mt-2 border-[1px] border-gray-300 w-[90%] h-[40px] p-1">
                              {j.goal}
                            </p>
                            {j.description
                              .split(/(?=\d+\.\s)/)
                              .map((line, lineIndex) => (
                                <textarea
                                  key={`${lineIndex}-${line.trim()}`}
                                  placeholder="Description"
                                  className="placeholder-gray-600 font-extralight text-normal text-gray-500 ml-10 mt-2 border-[1px] border-gray-300 w-[90%] h-[80px] p-1"
                                  defaultValue={line.trim()}
                                />
                              ))}
                          </div>

                          {/* Self Assessment */}
                          <div>
                            <h2 className="text-sm ml-10">Self Assessment</h2>
                            <textarea
                              type="text"
                              placeholder="Enter here"
                              className="placeholder-gray-400 overflow-hidden resize-none w-[90%] h-[40px] font-extralight text-normal text-gray-500 ml-10 pt-2 border-[1px] border-gray-300 p-1 mt-3"
                              name="selfAssessment"
                              // onChange={handleChangeAddDevelopmentGoals}
                              onChange={(e) =>
                                handleChangeAddDevelopmentGoals(
                                  index,
                                  "selfAssessment",
                                  e.target.value
                                )
                              }
                              defaultValue={j.selfAssessment}
                            />
                          </div>

                          <div>
                            {/* <h2 className="text-sm ml-10">
                              Manager Assessment
                            </h2> */}
                            {managerSubmitted ? (
                              <p className="overflow-hidden resize-none w-[90%] h-[40px] font-extralight text-normal text-gray-500 ml-10 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                                {managerAssessmentValue}
                              </p>
                            ) : (
                              <p className="overflow-hidden resize-none w-[90%] h-[40px] font-extralight text-normal text-gray-400 ml-10 pt-2 border-[1px] border-gray-300 p-1 mt-3 cursor-not-allowed">
                                NA
                              </p>
                            )}
                          </div>

                          {/* Manager Assessment */}
                          {/* <div>
                            <h2 className="text-sm ml-10">
                              Manager Assessment
                            </h2>
                            {devGoalsStore ? (
                              <p className="overflow-hidden resize-none w-[90%] h-[40px] font-extralight text-normal text-gray-500 ml-10 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                                {devGoalsStore.map((i) => i.managerAssessment)}
                              </p>
                            ) : (
                              <p className="overflow-hidden resize-none w-[90%] h-[40px] font-extralight text-normal text-gray-400 ml-10 pt-2 border-[1px] border-gray-300 p-1 mt-3 cursor-not-allowed">
                                NA
                              </p>
                            )}
                          </div> */}

                          {/* <div> */}
                          {/* <h2 className="text-sm ml-10">Manager Assessment</h2> */}
                          {/* {devGoalsStore.map((j) => (
                            <p
                              className="placeholder-gray-400 overflow-hidden resize-none w-[90%] h-[40px] font-extralight text-normal text-gray-500 ml-10 pt-2 border-[1px] border-gray-300 p-1 mt-3"
                              defaultValue={j.managerAssessment}
                            >
                              name="selfAssessment"  
                               // onChange= {handleChangeAddDevelopmentGoals}
                            </p>

                            // <textarea
                            //   type="text"
                            //   // placeholder="Enter here"
                            //   className="placeholder-gray-400 overflow-hidden resize-none w-[90%] h-[40px] font-extralight text-normal text-gray-500 ml-10 pt-2 border-[1px] border-gray-300 p-1 mt-3"
                            //   name="selfAssessment"
                            //   // onChange={handleChangeAddDevelopmentGoals}

                            //   defaultValue={j.managerAssessment}
                            // />
                          ))} */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {submittedStatus === false ? (
            ""
          ) : (
            <>
              {/* NOW THE BUTTONS SECTION- "SUBMIT" "SAVE AS DRAFT" AND "CANCEL" BUTTON */}
              <div className="ml-[725px]">
                <div className="grid grid-cols-3 w-[600px] -space-x-[75px]">
                  {/* {buttonsVisible} == disable */}

                  <div className="col-span-1">
                    <div className="relative">
                      <button
                        className="border-2 border-white bg-blue-500 text-white  rounded-md hover:bg-gray-500 w-[100px] h-11 font-medium"
                        onClick={(e) => {
                          // handleRateingAndCommentsChange();
                          // handleDateFromEmployeeStatus();
                          // handleSubmitDevGoals();
                          handleSubmit(e);
                          // setSubmitted(true);
                        }}
                        // onMouseMove={() => setPopoverVisible1(true)}
                        // onMouseOut={() => {
                        //   setPopoverVisible1(false);
                        // }}
                        // onBlur={() => {
                        //   setPopoverVisible1(false);
                        // }}
                      >
                        Submit
                      </button>
                      {popoverVisible1 && (
                        <div className="absolute top-[calc(100%+10px)] left-0 bg-gray-200 p-2 rounded-md shadow-md font-extralight">
                          {/* Your popover content goes here */}
                          <p className="space-x-4">
                            Once submitted cannot edit
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-1">
                    {
                      <div className="relative">
                        <button
                          className="border-2 border-white bg-gray-500 text-white w-[100px] h-11 rounded-md hover:bg-blue-500 font-medium"
                          onClick={() => {
                            handleDraftRatingComments();
                          }}
                          // onMouseMove={() => setPopoverVisible2(true)}
                          // onMouseOut={() => setPopoverVisible2(false)}
                          // onBlur={() => {
                          //   setPopoverVisible1(false);
                          // }}
                        >
                          Save as Draft
                        </button>
                        {popoverVisible2 && (
                          <div className="absolute top-[calc(100%+10px)] left-0 bg-gray-200 p-2 rounded-md shadow-md font-extralight">
                            {/* Your popover content goes here */}
                            <p>You can edit it later</p>
                          </div>
                        )}
                      </div>
                    }
                  </div>

                  <div className="col-span-1 ">
                    <button className="border-2 border-white bg-black text-white rounded-md w-[100px] h-11 font-medium -ml-[75px]">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default SelfAppraisel;
