import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useLocalStorage } from "react-use";
import Swal from "sweetalert2";
import { useStoreManagerScreenSubmitStatus } from "../GlobalStorage/ZustandStore";
import Service from "../Service";
import { BASE_URL } from "../../config/Config";
// imports necessary modules for creating a React component,
// IoMdCheckmarkCircleOutline- this is the React Icon from the react-icons library.

function ManagerScreen() {
  const [data, setData] = useState("");
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [value, setValue] = useState([]);
  const [info, setInfo] = useState("");
  const [message, setMessage] = useState();
  const [store, setStore] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [icon, setIcon] = useState();
  const [popoverVisible1, setPopoverVisible1] = useState(false);
  const [mgrScr, setMgrScr] = useState([]);
  const [overallValue, setOverallValue] = useState("");
  const [devGoals, setDevGoals] = useState([]);
  const [addDevGoals, setAddDevGoals] = useState("");
  const [selfAssm, setSelfAssm] = useState([]);
  const [profileInfo, setProfileInfo] = useState("");
  const [goals, setGoals] = useState([]);
  const [dateLocal, setDateLocal] = useLocalStorage("date", "local");
  const [overAllRating, setOverAllRating] = useState("");
  const [overAllComment, setOverAllComment] = useState("");
  const [submitRatings, setSubmitRatings] = useState(0);
  const [submitComments, setSubmitComments] = useState("");
  const [targetOption, setTargetOption] = useState([]);
  const [managerAssessmentValue, setManagerAssessmentValue] = useState("");
  const { submitStatus, setSubmitStatus } = useStoreManagerScreenSubmitStatus();

  const location = useLocation();

  console.log(location, "location");

  // empCode

  const empCode = location?.state?.empCode?.employeeCode;

  // const  empCode = localStorage.getItem("empCode");

  console.log(
    empCode,
    "empCode*U*******************************************%%%^%%!!@@@@@@"
  );

  // // const [sid, setSid] = useState(13);
  // const { sid } = useStoreSID();

  // console.log(sid,"sid  ssssssssssssssssssssssssssss");

  const [currentSid, setCurrentSid] = useState();

  useEffect(() => {
    axios
      .get(`${BASE_URL}:9031/api/getUniqueEmployeeStatus/${empCode}`)
      .then((res) => {
        console.log(
          res?.data?.employeeStatusId,
          "res?.data?.employeeStatusId&77777777777"
        );
        setCurrentSid(res?.data?.employeeStatusId);
      })
      .catch(() => {
        // toast.warn("querter details is new");
      });
  }, [empCode]);

  console.log(currentSid, "currentSid 8888888888888888");

  const [localGoals, setLocalGoals] = useState({
    savedAppraiseeGoals: [],
    savedDevelopmentGoals: [],
  });

  useEffect(() => {
    if (empCode) {
      axios
        .get(`${BASE_URL}:9031/api/getemployeeKraId/${empCode}`)
        .then((res) => {
          const responseData = res?.data?.data || {}; // Fallback to an empty object

          console.log(responseData, "responseData?.............**********");
          setLocalGoals({
            savedAppraiseeGoals: responseData.savedAppraiseeGoals || [],
            savedDevelopmentGoals: responseData.savedDevelopmentGoals || [],
          });
        })
        .catch((error) => {
          console.error("Error fetching employee goals:", error);
        });
    }
  }, [empCode]);

  console.log(
    localGoals?.savedAppraiseeGoals,
    "localGoals.savedAppraiseeGoals"
  );
  console.log(
    localGoals?.savedDevelopmentGoals,
    "localGoals?.savedDevelopmentGoals"
  );

  // const savedAppraiseeGoal = null;

  // const savedDevelopmentGoal = null;

  // const [sid, setSid] = useState(location.state.data.employeeStatusId);

  // const [goalsandDevGoals, setGoalsandDevGoals] = useState(null);

  //const empCode = location?.state?.empCode;
  // console.log(location?.state?.empCode, "PPPPPPPPPPPPPPPPPPPPPP");

  //const empCode = location?.state?.empCode;

  console.log(empCode, "empCode^^^^^^^^^^^^^^^^^^^^^^^^^66");

  const [kragoals, setKragoals] = useState([
    {
      kra: "",
      goals: "",
      measurementCriteria: "",
      measurement: "",
      target: "",
      weightage: "",
      subOverallStatusId: currentSid || "",
    },
  ]);

  const [developmentGoals, setDevelopmentGoals] = useState([
    {
      training: "",
      goal: "",
      description: "",
      empCode: empCode,
      subOverallStatusId: currentSid || "",
    },
  ]);

  const [goalsandDevGoals, setGoalsandDevGoals] = useState({
    savedAppraiseeGoals: [],
    savedDevelopmentGoals: [],
  });

  useEffect(() => {
    handleWithDefault();
    Service.getAllTrainings()
      .then((response) => {
        // setTrainingOptions(response.data.data);
        console.log(response.data, "<<<<<<<<<<<<<<<<<");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [currentSid]);

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

  const handleWithDefault = () => {
    const requestData = {
      division: "SSD",
      role: "Trainee-Developer",
      empCode: empCode,
      overall_statusId: currentSid,
    };

    Service.getDefaultGoals(requestData)
      .then((defaultResponse) => {
        console.log(defaultResponse.data, "+++++++++++");
        const {
          goalsList = [],
          devGoalsList = [],
          goalsDraftList = [],
          devGoalsDraftList = [],
          defaultGoals = [],
        } = defaultResponse.data;

        // Determine saved appraisee goals
        const savedAppraiseeGoals =
          goalsList.length > 0
            ? goalsList
            : goalsDraftList.length > 0
            ? goalsDraftList
            : defaultGoals.length > 0
            ? defaultGoals
            : [];

        console.log("Non-empty Goals for KRA:", savedAppraiseeGoals);
        setKragoals(savedAppraiseeGoals);

        // Determine saved development goals
        const savedDevelopmentGoals =
          devGoalsList.length > 0
            ? devGoalsList
            : devGoalsDraftList.length > 0
            ? devGoalsDraftList
            : [];

        console.log("Non-empty Development Goals:", savedDevelopmentGoals);
        setDevelopmentGoals(savedDevelopmentGoals);

        // Combine goals and development goals
        setGoalsandDevGoals({
          savedAppraiseeGoals,
          savedDevelopmentGoals,
        });
      })
      .catch((error) => {
        console.error("Error fetching default goals:", error);
      });
  };

  // const { setDevGoalsStore } = useDevGoals();
  // useEffect(() => {
  //   setDevGoalsStore(developmentGoals);
  // }, [developmentGoals]);

  console.log("setDevelopmentGoals Goals for KRA:", developmentGoals);
  console.log("setKragoals Goals for KRA:", kragoals);
  console.log("setGoalsandDevGoals Goals for KRA:", goalsandDevGoals);

  const [
    masterSelfAppraisalResponse,
    setMasterSelfApprasialResponse,
  ] = useState("");

  console.log(overAllRating, "overAllRatingpk");
  console.log(overAllComment, "overAllCommentpk");

  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (status) {
      getEmployeeStatus();
    }
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form behavior
    const todayDate = new Date().toISOString().split("T")[0]; // For example: "2024-07-17"
    setDateLocal(todayDate);

    const overAllRatingAndComments = {
      managerOverallRating: overAllRating,
      managerOverallComments: overAllComment,
      // submittedOnn: todayDate,
      // reviewedOnn: todayDate,
      //reviewedOnn: dateLocal----------this thing has to be added in the manager screen.
    };

    // const [overAllRating, setOverAllRating] = useState([]);
    // const [overAllComment, setOverAllComment] = useState([]);
    const combinedObject = {
      overAllGoalsAndRatingComments: overAllRatingAndComments,
      devGoalsList: devGoals,
      goalsList: goals,
    };

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
        console.log("Draft data deleted successfully.");
        setSubmitStatus(true);
        toast.success("Manager Assesment Submitted");
      })
      .catch((error) => {
        toast.error("Manager Assesment Failed To Submit");
      });

    console.warn("devGoals   >>>>>>>>>>>>>>>  ", devGoals);
    console.warn("goals   >>>>>>>>", goals);
    console.warn("combinedObject >>>>>>>>>>>>>>", combinedObject);
  };

  console.log(
    masterSelfAppraisalResponse,
    "masterSelfAppraisalResponse^^^^^^^^^^^"
  );
  console.warn(masterSelfAppraisalResponse?.data?.reviewedOnn, "reviewedOnn");

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

  //logic for calculate average of ratings.

  useEffect(() => {
    const averageManagerRating = calculateAverage(goals);
    console.log("goals>>>>>>>>>>>>>>>>>>>>>>>", goals);
    console.log(
      "averageManagerRating>>>>>>>>>>>>>>>>>>>>>>>",
      averageManagerRating
    );

    setOverAllRating(averageManagerRating);
  }, [goals]);

  const calculateAverage = (arr) => {
    const validRatings = arr
      .map((item) => parseFloat(item.managerRating)) // Convert to number
      .filter((rating) => !isNaN(rating)); // Exclude invalid or null ratings

    if (validRatings.length === 0) {
      return 0; // Avoid division by zero
    }

    const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
    const average = sum / validRatings.length;

    return average.toFixed(2); // Return average with 2 decimal points
  };

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------

  console.log(popoverVisible1);

  console.log(overallValue, "overallValue......................");

  let ratingBreak = overallValue?.mgrRating?.split(",") || "";
  console.log(ratingBreak, "ratingBreak");

  let commentBreak = overallValue?.mgrComment?.split(",") || "";
  console.log(commentBreak, "ratingBreak");

  let mgr_id = 20;

  // useEffect(() => {
  //   Service.getByDevGoalsById()
  //     .then((response) => setDevGoals(response.data))
  //     .catch((err) => console.log(err));
  // }, []);

  // console.warn(value, "value");

  // useEffect(() => {
  //   Service.getBySelfAsmAll()
  //     .then((response) => setMgrScr(response.data))
  //     .catch((err) => console.log(err));
  // }, []);

  // console.warn(value, "value");

  // --------------------------------------------------------------------------------------------------------------------------------------------------

  const [rating1, setRating1] = useState({});

  const handleChangeRating1 = (e) => {
    const key = e.target.name;
    const newValue = e.target.value;
    setRating1((prevState) => ({ ...prevState, [key]: newValue })); // Update ratingComment state with the new value
  };

  console.log(rating1);

  const [comment1, setComment1] = useState({});

  const handleChangeComment1 = (e) => {
    const key = e.target.name;
    const newValue = e.target.value;
    setComment1((prevState) => ({ ...prevState, [key]: newValue })); // Update ratingComment state with the new value
  };

  console.log(comment1);

  let str = "";
  for (let i in rating1) {
    str += rating1[i] + ",";
  }

  let totalStr = str.slice(0, str.length - 1);
  console.log(str.slice(0, str.length - 1)); // This will log the current state of ratingComment

  let str1 = "";
  for (let i in comment1) {
    str1 += comment1[i] + ",";
  }

  let totalStr1 = str1.slice(0, str1.length - 1);
  console.log(str1.slice(0, str1.length - 1));

  // --------------------------------------------------------------------------------------------------------------------------------------------------

  console.log(overallValue, "overallValue");
  console.log(info);

  const overallRatingAndComment = () => {
    console.log(info);
    let infoAll = {
      ...info,
      mgrId: mgr_id,
      mgrRating: totalStr,
      mgrComment: totalStr1,
    };
    // the thing that is written in double quotes is the backend variable
    console.log(infoAll, "infoAll...........");

    Service.postByMng(infoAll).then((response) => {
      Service.getByManagerAsmById().then((res) => {
        // Check if submittedOn exists in the response
        if (response.data.submittedOn) {
          setDateLocal(response.data.submittedOn);
        }
        console.log(
          res.data,
          "response data **********************************"
        );
        setOverallValue(res.data);
      });
      setSubmitted("You have successfully reviewed");
      setIcon(<IoMdCheckmarkCircleOutline />);
      setButtonsVisible(false);
      setPopoverVisible1(false);
    });
  };

  useEffect(() => {
    Service.getByManagerAsmById().then((res) => {
      console.log(res.data, "response data **********************************");
      setOverallValue(res.data);
    });
  }, []);

  // console.log(value, "value.........");
  // console.warn(data, "data");
  // The console. warn() method is used to write a warning message in the console.
  console.log(store, "store");
  // useEffect hook to make an asynchronous API call to fetch self-appraisal data from the server when the component mounts.

  console.log(data);

  console.log(message);

  // THIS IS THE LOGIC FOR filling THE COMMENTS IN THE form type feilds THAT WE WRITE IN THE FRONT END and updation of the state input fields.

  const handleChangeComments = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInfo({ ...info, [key]: value });
    Swal.fire({
      icon: "info",
      title: "Form Saved As Draft",
      text: "Your form is saved as draft. It has not been submitted.",
    });
  };
  console.warn(
    info,
    "iiiiiiiiiiiiiiiiiiiiii nnnnnnnnnnnnnnnnnnnnnffffffffff00000000000"
  );

  const [count, setCount] = useState(0);
  console.log(count);

  // console.warn(value, "value");

  const handleAddDevelopmentGoals = () => {
    console.log(addDevGoals, "addDevGoals...");
    // Service.postDevlopmentGoalsUrl(addDevGoals).then((response) => {
    //   console.log(response.data);
    // });
  };

  console.log(addDevGoals, "addDevGoals");
  handleAddDevelopmentGoals();
  // const handleChangeAddDevelopmentGoals = (e) => {
  //   console.log("e>>>>>>>>>>>>", e);
  //   // setAddDevGoals({ ...addDevGoals, managerAssessment: e.target.value });
  // };
  const handleChangeAddDevelopmentGoals = (index, field, value) => {
    const updatedData = [...devGoals];
    updatedData[index][field] = value;
    // localGoals.savedDevelopmentGoals;
    setDevGoals(updatedData);
    setManagerAssessmentValue(value);

    console.log("devGoals>>>>>>>>>>>>>>>>", devGoals);
  };

  const [ratingMng, setRatingMng] = useState([]);
  const [commentsMng, setCommentsMng] = useState([]);
  // useEffect(() => {
  //   Service.getBySelfAsmById()
  //     .then((response) => {
  //       setSelfAssm(response.data);
  //       setRatingMng(response.data.rating);
  //       setCommentsMng(response.data.comment);
  //     })

  //     .catch((err) => console.log(err));
  // }, []);

  console.log(selfAssm, "selfAssm");

  console.log(ratingMng, "ratingMng");
  console.log(commentsMng, "commentsMng");

  const ratingArr = typeof ratingMng === "string" ? ratingMng.split(",") : [];
  const commentArr =
    typeof commentsMng === "string" && commentsMng !== ""
      ? commentsMng.split(",")
      : "";

  useEffect(() => {
    Service.getByProfileById(empCode).then((response) =>
      setProfileInfo(response.data)
    );
  }, [empCode]);

  const handleChangeRating = (e) => {
    setOverAllRating(e.target.value);
  };

  const handleChangeComment = (e) => {
    setOverAllComment(e.target.value);
  };

  // console.warn(profileInfo, "profileInfo");

  // The handleChangeComments function is an event handler for form input fields, extracting the name and value attributes from the target element
  // (typically an input field). It dynamically updates the info state with the latest user input and logs the updated state for debugging.

  // ----------------------------------------------------------------THIS IS THE DISPLAY PART----------------------------------------------------------------------//

  const [employeeDetailsStatusInfo, setEmpDetailsStatusInfo] = useState("");
  // get employee statu

  // useEffect(() => {
  //   axios
  //     .get(`${BASE_URL}:9031/api/getUniqueEmployeeStatus/${empCode}`)
  //     .then((res) => {
  //       setEmpDetailsStatusInfo(res?.data);
  //     });
  // }, []);

  // console.log(employeeDetailsStatusInfo, "*&&&&&&&&&&&&&&&&^^^++++++++++++++");

  useEffect(() => {
    getEmployeeStatus();
  }, []);

  // const [submitStatus, setSubmitStatus] = useState(false);

  const getEmployeeStatus = () => {
    axios
      .get(`${BASE_URL}:9031/api/getUniqueEmployeeStatus/${empCode}`)
      .then((res) => {
        setEmpDetailsStatusInfo(res?.data);
      })
      .catch((err) => {
        Swal.fire("No Employee Status Available");
      });
  };

  console.log(employeeDetailsStatusInfo, "*&&&&&&&&&&&&&&&&^^^++++++++++++++");

  useEffect(() => {
    axios
      .get(`${BASE_URL}:9031/api/getAllOperators`)
      .then((res) => {
        setTargetOption(res.data);
      })
      .catch((error) => {
        console.error("Error during fetching", error);
      });
  }, [currentSid]);
  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem("role")) || [];
  } catch (e) {
    console.error("Error parsing roles from sessionStorage:", e);
  }

  // Function to check if the user has a specific role
  const hasRole = (role) => roles.includes(role);

  return (
    <div className="h-full">
      <div className="bg-white mt-5">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-full">
          <div className="w-full h-screen bg-gray-200 ">
            <div className="bg-white rounded-md relative top-12 ml-4 mr-3 border-[1px] border-blue-400 pb-24">
              {/* anything that is written under square bracket CSS property is a arbitrary value */}

              {/* HERE THE COMPONENT STARTS (first part) */}
              <h1 className="text-sm font-normal text-black pl-4 pt-10">
                Quarter 4
              </h1>
              <div className="flex space-x-[500px]">
                <h3 className="text-m text-gray-500 pl-5 mt-2">
                  01-Apr 2023 to 30-Jun-2023
                </h3>
                <div className="flex space-x-2 text-green-500 items-center text-sm">
                  <h1 className="text-sm">{icon}</h1>
                  <h1 className="">{submitted} </h1>
                </div>
              </div>

              {/* MENU BAR */}
              <div className="text-gray-400 pl-2">
                <div className="relative">
                  <div className="toggle-bar absolute h-2  transition-transform duration-300"></div>
                  <ul className="flex space-x-4  p-4">
                    <li>
                      <button className="text-sm">Goal Setting</button>
                    </li>
                    <li>
                      <button className="text-sm">Self Assessment</button>
                    </li>
                    <li>
                      <button className="text-sm">Manager Assessment</button>
                    </li>
                    <li>
                      <button className="text-sm">Annual Review</button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Adding one seprating line according to the figma design */}

              <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4"> </h1>

              {/* To make this we have to make a grid of 11 coloumns.4 for profile picture,role etc and 2 for "submitted on" and 5 for self rating */}

              <div className="grid grid-cols-11 ">
                {/* ------------------------------------------------------------------------------------------------------------------------------------------------------ */}

                {/* PROFILE CARD IS displayed HERE */}

                <div className="col-span-4 ">
                  <div className="grid grid-cols-12">
                    <div className="col-span-2 ">
                      <img
                        src={require("../profille.jpg")}
                        className="rounded-full h-[34px] w-[36px] ml-6 mt-4"
                        alt="Profile"
                      />
                    </div>

                    <div className="col-span-10 ">
                      <div className="ml-2 mb-4">
                        <h2 className="font-thin text-sm  mx-8 pt-3 w-56 flex-col justify-center -ml-0 text-black">
                          {" "}
                          {
                            profileInfo.fileAndObjectTypeBean?.empResDTO
                              ?.firstName
                          }{" "}
                        </h2>
                        <p className=" font-medium text-m text-blue-900 -ml-0 pt-1">{`${profileInfo.fileAndObjectTypeBean?.empResDTO?.designationResDTO?.designationName} - 
                  ${profileInfo.fileAndObjectTypeBean?.empResDTO?.mainDeptResDTO.mainDepartment}`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 border-l-[1px] border-gray-300 mt-2">
                  <div className="ml-1 pl-6 mt-2">
                    <div className="pb-1">
                      <h2 className="text-sm font-thin text-black">
                        Reviewed By
                      </h2>
                    </div>
                    <div className="flex space-x-3 pt-1">
                      <img
                        src={require("../profille.jpg")}
                        className="rounded-full h-[34px] w-[36px] ml-6 mt-4"
                        alt="Profile"
                      />

                      <div className="text-sm -mt-[2px] text-blue-900">
                        {
                          profileInfo.fileAndObjectTypeBean?.empResDTO
                            ?.reportingManager
                        }{" "}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adding one seprating line according to the figma design */}

                <div className="col-span-2 border-l-[1px] border-gray-300 mt-2">
                  {/* NOW THE DATE/submitted ON PART IS DIPLAYED HERE */}

                  <div className="ml-2 pl-6 mt-2">
                    <div className="pb-1">
                      <h2 className="text-sm font-thin text-black">
                        Reviewed On
                      </h2>
                    </div>
                    <div className="flex space-x-3 pt-1">
                      <div className="calender-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          width="14"
                          viewBox="0 0 448 512"
                          fill="gray"
                        >
                          <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z" />
                        </svg>
                      </div>
                      <div className="text-sm -mt-1">
                        {employeeDetailsStatusInfo?.reviewedOnn}
                      </div>
                    </div>
                  </div>
                </div>

                {/* NOW THE SELF RATING PART is displayed AND ALSO ADDING ONE SEPRATING LINE ACCORDING TO THE FIGMA DESIGN*/}

                <div className="col-span-3 border-l-[1px] border-gray-300 mt-2">
                  <div className="div ml-2 pl-6 mt-2">
                    <div className="pb-1">
                      <h2 className="text-sm font-thin text-black">
                        Manager rating
                      </h2>
                    </div>
                    <textarea
                      name="overallManagerRating"
                      id=""
                      className="text-sm text-red-600 font-medium pl-6"
                      onChange={handleChangeComments}
                      // value={overallValue.overallMgrRating}
                      value={overallValue.overallRating || overAllRating}
                      // value={overAllRating}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* A SEPRATING LINE AS PER THE FIGMA DESIGN */}
              <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4"> </h1>

              {/* NOW THE SELF APPRAISAL-SECTION (second part) */}

              <div>
                <h1 className="text-sm font-normal text-gray-700 pl-4 pt-4">
                  Manager Feedback
                </h1>

                {/* we have to divide the grid in 9 parts and then give the devison of col span according */}

                <div className="grid grid-cols-9">
                  {/* -------------------------------------------------------------------------------------------------------------------------------------- */}

                  <div className="col-span-2 ml-4 mt-3 mb-6">
                    <div className="ml-4 mb-12 space-y-6 pt-3">
                      <h2 className="font-extralight text-sm  mx-8 pt-3 w-56 flex-col justify-center -ml-0 text-black">
                        Overall Rating
                      </h2>
                      <p className=" font-extralight text-sm text-black -ml-0 pt-2 flex-col  ">
                        Overall Comments
                      </p>
                    </div>
                  </div>

                  <div className="col-span-4 mt-3 ">
                    <div className="-ml-28 mb-12 space-y-6 pt-3">
                      <textarea
                        type="text"
                        placeholder="Add rating.."
                        className=" placeholder-gray-300 overflow-hidden resize-none w-[20%] h-[40px] font-extralight text-sm text-black -ml-0 pt-3 border-[1px] border-gray-300 p-1"
                        name="managerOverallRating"
                        onChange={handleChangeRating}
                        // value={overallValue.overallMgrRating}
                        value={overallValue.overallRating || overAllRating}
                        readOnly
                        // value={overallValue.overallRating || overAllRating}
                      />
                      <textarea
                        type="text"
                        placeholder="Add comment.."
                        className="  placeholder-gray-300 overflow-hidden resize-none w-[100%] h-[130px] font-extralight text-sm text-black -ml-0 pt-1 border-[1px] border-gray-300 p-1"
                        //name="managerOverallComments"
                        onChange={handleChangeComment}
                        value={
                          employeeDetailsStatusInfo?.managerOverallComments
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* NOW THE THIRD PART STARTS */}

              <div className="mt-4">
                <div className="flex pb-1 ">
                  <h1 className="text-sm font-medium text-black pl-5 pt-4 text-left">
                    Objective Area & KRA / Goals & Objective
                  </h1>
                  <h1 className="text-sm font-medium text-black  pt-4 pl-[115px] whitespace-nowrap ml-8 ">
                    Measurement criteria / Target
                  </h1>
                  <div className="flex">
                    <div className="flex space-x-3 ml-6 ">
                      <img
                        src={require("../profille.jpg")}
                        className="rounded-full h-[34px] w-[36px] ml-6 mt-4"
                        alt="Profile"
                      />
                      <h2 className="font-thin text-base  mx-8 pt-3 w-56 flex-col justify-center -ml-0 mt-2 text-blue-500">
                        {" "}
                        {
                          profileInfo.fileAndObjectTypeBean?.empResDTO
                            ?.firstName
                        }{" "}
                      </h2>
                    </div>

                    <div className="flex space-x-3 -ml-1">
                      <img
                        src={require("../profille.jpg")}
                        className="rounded-full h-[34px] w-[36px] ml-6 mt-4"
                        alt="Profile"
                      />
                      <h2 className="font-thin text-base  mx-8 pt-3 w-56 flex-col justify-center -ml-0 mt-2 text-blue-500">
                        {
                          profileInfo.fileAndObjectTypeBean?.empResDTO
                            ?.reportingManager
                        }{" "}
                      </h2>
                    </div>
                  </div>
                </div>
                {/* A SEPRATING LINE AS PER THE FIGMA DESIGN */}
                <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4 mb-4">
                  {" "}
                </h1>
                {/* we have to divide the grid in 7 parts and then give the devison of col span according */}
                {/* <div className="grid grid-cols-12 mb-8"> */}
                {/* --------------------------------------------------MAIN PART------------------------------------------------ */}

                <div className="grid grid-cols-12 mb-8">
                  {localGoals?.savedAppraiseeGoals?.length > 0 ? (
                    <>
                      {/* Goals Section */}
                      <div className="col-span-6">
                        {localGoals?.savedAppraiseeGoals?.map((i, index) => (
                          <div
                            key={`${index}-${i}`}
                            className="grid grid-cols-7"
                          >
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
                            <div className="col-span-2 mt-4 flex -space-x-3 ml-4 ">
                              <div className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[45px] h-[35px] pl-4">
                                {targetOption.find(
                                  (option) =>
                                    option.targetOperatorId === i?.target
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
                      {/* FETCHING SELF APPRASIAL COMMENTS AND RATINGS  */}
                      <div className="col-span-3">
                        <div className="space-y-6">
                          {" "}
                          {/* Added vertical spacing between blocks */}
                          {localGoals?.savedAppraiseeGoals?.map(
                            (goal, index) => (
                              <div key={`rating-comment-${index}`}>
                                {/* Rating */}
                                <div className="pb-3">
                                  <span className="w-[15%] h-[30px] inline-block max-w-xs outline-none border-[1px] border-gray-200">
                                    {goal.selfRating}
                                    {/* {submitRatings.selfRating || "0.0"} */}
                                  </span>
                                </div>

                                {/* Comments */}
                                <div>
                                  <p className="overflow-hidden resize-none w-[80%] h-[65px] outline-none border-[1px] border-gray-200">
                                    {goal.selfComment}
                                    {/* {submitComments.comment3 || "No comments"} */}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Manager Ratings and Comments FILLING Section */}
                      <div className="col-span-3 ml-8">
                        <div
                          className={`-mt-1 ${
                            submitted ? "space-y-14" : "space-y-4"
                          }`}
                        >
                          <div className="space-y-2">
                            {localGoals?.savedAppraiseeGoals?.map(
                              (i, index) => (
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
                                          ? "cursor-not-allowed font-medium text-sm bg-white" // Non-editable style
                                          : "border-[1px] border-gray-200"
                                      }`}
                                      name={`mgrRating-${index}`}
                                      value={i?.managerRating || ""}
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
                                          "managerRating",
                                          value
                                        );
                                      }}
                                      disabled={submitted} // Disable input when submitted
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
                                      className={`overflow-hidden resize-none w-[90%] h-[65px] outline-none ${
                                        submitted
                                          ? "cursor-not-allowed font-extralight text-gray-500" // Non-editable style
                                          : "border-[1px] border-gray-200"
                                      }`}
                                      name={`mgrComment-${index}`}
                                      value={i?.managerComment || ""}
                                      onChange={(e) =>
                                        handleRateingAndCommentsChange(
                                          index,
                                          "managerComment",
                                          e.target.value
                                        )
                                      }
                                      disabled={submitted} // Disable textarea when submitted
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center mt-10">
                      <h2 className="font-extralight text-sm text-red-500">
                        No goals submitted in the quarter.
                      </h2>
                    </div>
                  )}
                </div>

                <div className="ml-[800px] -mt-[275px]">
                  <div className="mt-64">
                    <div className="-ml-[780px] pb-8">
                      <h1 className="text-sm font-medium mb-6 pt-12">
                        Development Goals
                      </h1>
                      <div className="grid grid-cols-8 -space-x-10">
                        {/* Trainings */}

                        <div className="space-x-4 w-[1200px]">
                          <div className="col-span-2">
                            <h2 className="font-extralight text-sm mx-8 pt-3 ml-10">
                              Trainings
                            </h2>

                            {localGoals.savedDevelopmentGoals?.map(
                              (j, index) => (
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
                                    <h2 className="text-sm ml-10">
                                      Self Assessment
                                    </h2>
                                    <div className="placeholder-gray-400 overflow-hidden resize-none w-[90%] h-[40px] font-extralight text-normal text-gray-500 ml-10 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                                      {j.selfAssessment || "No data available"}
                                    </div>
                                  </div>

                                  {/* Manager Assessment */}
                                  <div>
                                    <h2 className="text-sm ml-10">
                                      Manager Assessment
                                    </h2>
                                    <textarea
                                      type="text"
                                      placeholder="Enter here"
                                      className="placeholder-gray-400 overflow-hidden resize-none w-[90%] h-[40px] font-extralight text-normal text-gray-500 ml-10 pt-2 border-[1px] border-gray-300 p-1 mt-3"
                                      name="managerAssessment"
                                      onChange={(e) =>
                                        handleChangeAddDevelopmentGoals(
                                          index,
                                          "managerAssessment",
                                          e.target.value
                                        )
                                      }
                                      defaultValue={j.managerAssessment}
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

                {submitStatus === false ? (
                  <div className="flex justify-end">
                    <div className="">
                      <div className="grid grid-cols-2 space-x-10 pt-2 ">
                        {/* {buttonsVisible} == disable */}

                        {/* {count >= 0 ? ( */}
                        <div className="col-span-1 ">
                          <div className="relative">
                            {/* relative is written just to maintain that position between the popover and the button */}
                            <button
                              className="border-2 border-white bg-blue-500 text-white  rounded-md hover:bg-gray-500 w-[80px] h-11 font-medium "
                              // onClick={handleSubmit}
                              onClick={(e) => {
                                // overallRatingAndComment();
                                // handleAddDevelopmentGoals();
                                // handleDateFromEmployeeStatus();
                                handleSubmit(e);
                                setSubmitted(true);
                              }}
                              onChange={handleChangeComments}
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
                              <div className="absolute  left-0 bg-gray-200 p-2 rounded-md shadow-md font-extralight">
                                {/* Your popover content goes here */}
                                <p className="space-x-4">
                                  Once submitted cannot edit
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* ) : ( */}
                        {/* "" */}
                        {/* )} */}

                        {/* {count == 1 ? ( */}
                        {/* "" */}
                        {/* ) : ( */}
                        <div className="col-span-1  ">
                          <button className="border-2 border-white bg-black text-white rounded-md w-[80px] h-11  font-medium">
                            Cancel
                          </button>
                        </div>
                        {/* // )} */}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {/* ------------------------------ */}
                {/* </div> */}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default ManagerScreen;
