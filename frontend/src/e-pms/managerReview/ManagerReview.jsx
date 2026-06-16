import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Service from "../Service";
import { BASE_URL } from "../../config/Config";
//import { useDevGoals } from "../GlobalStorage/ZustandStore";

function MangerReview({ empCode, sid }) {
  // Defines a functional component named MangerReview.
  const [data, setData] = useState("");
  const [value, setValue] = useState([]);
  const [info, setInfo] = useState("");
  const [message, setDataMessage] = useState();
  const [store, setStore] = useState("");
  const [comments, setComments] = useState(" ");
  const [mgrAssm, setMgrAssm] = useState([]);
  const [selfAssm, setSelfAssm] = useState([]);
  const [mgrComm, setMgrComm] = useState([]);
  const [targetOption, setTargetOption] = useState([]);

  console.log(empCode, "empCode.....");
  console.log(
    mgrComm,
    "mgrComm**********************************************************************"
  );
  const [devGoals, setDevGoals] = useState([]);
  const [profileInfo, setProfileInfo] = useState([]);

  const [overAllRating, setOverAllRating] = useState([]);
  const [overAllComment, setOverAllComment] = useState([]);
  const [goals, setGoals] = useState([]);

  const [localGoals, setLocalGoals] = useState(null);
  const [trainingOptions, setTrainingOptions] = useState([]);

  const [kragoals, setKragoals] = useState(
    Array.from({ length: 1 }, () => ({
      kra: "",
      goals: "",
      measurementCriteria: "",
      measurement: "",
      target: "",
      weightage: "",
      // subOverallStatusId: sid,
    }))
  );

  const [developmentGoals, setDevelopmentGoals] = useState([
    {
      training: "",
      goal: "",
      description: "",
      empCode: empCode,
      // subOverallStatusId: sid,
    },
  ]);
  const [goalsandDevGoals, setGoalsandDevGoals] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  console.log(value, "value.........");
  console.warn(data, "data");
  // The console. warn() method is used to write a warning message in the console.
  console.log(store, "store");
  console.log(data);
  console.log(message);

  const handleChangeComments = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInfo({ ...info, [key]: value });
  };
  console.log(info);

  useEffect(() => {
    Service.getemployeeKraOrDraft(empCode)
      .then((response) => setMgrAssm(response.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    handleWithDefault();
    Service.getAllTrainings()
      .then((response) => {
        setTrainingOptions(response.data.data);
        console.log(response.data, "<<<<<<<<<<<<<<<<<");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  console.log(mgrAssm, "mgrAssm");

  console.warn(value, "value");

  useEffect(() => {
    Service.getByProfileById()
      .then((response) => setValue(response.data))
      .catch((err) => console.log(err));
  }, []);

  console.warn(value, "value");

  useEffect(() => {
    Service.getByManagerAsmById()
      .then((response) => setMgrComm(response.data))
      .catch((err) => console.log(err));
  }, []);

  console.warn(mgrComm, "mgrComm");
  // ------------------------------------------------------------------------------------------------------------------------------------------

  const [ratingMng, setRatingMng] = useState([]);
  const [commentsMng, setCommentsMng] = useState([]);

  useEffect(() => {
    Service.getBySelfAsmById()
      .then((response) => {
        setSelfAssm(response.data);
        setRatingMng(response.data.rating);
        setCommentsMng(response.data.comment);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(selfAssm, "selfAssm");

  console.log(ratingMng, "ratingMng");
  console.log(commentsMng, "commentsMng");

  const ratingArr = typeof ratingMng === "string" ? ratingMng.split(",") : [];
  const commentArr =
    typeof commentsMng === "string" && commentsMng !== ""
      ? commentsMng.split(",")
      : [];

  const [ratingMng1, setRatingMng1] = useState([]);
  const [commentsMng1, setCommentsMng1] = useState([]);

  useEffect(() => {
    Service.getByManagerAsmById()
      .then((response) => {
        setMgrComm(response.data);
        setRatingMng1(response.data.mgrRating);
        setCommentsMng1(response.data.mgrComment);
      })

      .catch((err) => console.log(err));
  }, []);

  console.log(mgrComm, "mgrComm");

  console.log(ratingMng1, "ratingMng1");
  console.log(commentsMng1, "commentsMng1");

  const ratingArr1 =
    typeof ratingMng1 === "string" ? ratingMng1.split(",") : [];
  const commentArr1 =
    typeof commentsMng1 === "string" && commentsMng1 !== ""
      ? commentsMng1.split(",")
      : [];

  console.warn(value, "value");
  console.log(value, "value");

  // useEffect(() => {
  //   Service.getByDevGoalsById()
  //     .then((response) => setDevGoals(response.data))
  //     .catch((err) => console.log(err));
  // }, []);

  console.warn(value, "value");


  useEffect(() => {
    Service.getByProfileById(empCode).then((response) =>
      setProfileInfo(response.data)
    );
  }, []);

  console.warn(profileInfo, "profileInfo");

  // var handleWithDefault = () => {
  //   let data = {
  //     division: "SSD",
  //     role: "Trainee-Developer",
  //     emp_id: empCode,
  //     overall_statusId: sid,
  //   };

  //   Service.getDefaultGoals(data)
  //     .then((defaultResponse) => {
  //       console.log(defaultResponse.data, "+++++++++++");
  //       // debugger;
  //       console.log(defaultResponse.data, "test>>>>>>>>>>>");
  //       const goalsList = defaultResponse.data.goalsList || [];
  //       const devGoalsList = defaultResponse.data.devGoalsList || [];
  //       const goalsDraftList = defaultResponse.data.goalsDraftList || [];
  //       const devGoalsDraftList = defaultResponse.data.devGoalsDraftList || [];
  //       const defaultGoalsList = defaultResponse.data.defaultGoals || [];
  //       const savedAppraiseeGoal =
  //         goalsList.length > 0
  //           ? goalsList
  //           : goalsDraftList.length > 0
  //           ? goalsDraftList
  //           : defaultGoalsList.length > 0
  //           ? defaultGoalsList
  //           : [];
  //       console.log("nonEmptyGoals Goals for KRA:", savedAppraiseeGoal);
  //       setKragoals(savedAppraiseeGoal);
  //       const savedDevelopmentGoal =
  //         devGoalsList.length > 0
  //           ? devGoalsList
  //           : devGoalsDraftList.length > 0
  //           ? devGoalsDraftList
  //           : [];
  //       console.log("nonEmptyDevGoals Goals for KRA:", savedDevelopmentGoal);
  //       setDevelopmentGoals(savedDevelopmentGoal);
  //       setGoalsandDevGoals({
  //         savedAppraiseeGoals: savedAppraiseeGoal,
  //         savedDevelopmentGoals: savedDevelopmentGoal,
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching default goals:", error);
  //     });
  // };

  // const handleSubmit = (e) => {
  //   const overAllRatingAndComments = {
  //     overallRating: overAllRating,
  //     overallComments: overAllComment,
  //   };
  //   // const [overAllRating, setOverAllRating] = useState([]);
  //   // const [overAllComment, setOverAllComment] = useState([]);
  //   const combinedObject = {
  //     overAllRatingAndComments: overAllRatingAndComments,
  //     devGoalsList: devGoals,
  //     goalsList: goals,
  //   };

  //   console.log(
  //     "overAllRatingAndComments>>>>>>>>>>>>>>>>>>>",
  //     overAllRatingAndComments
  //   );
  //   console.log("combinedObject>>>>>>>>>>>>>>>>>>>", combinedObject);

  //   Service.postemployeeKraAndDevGoalsWithOverAllRatingAndComments(
  //     empCode,
  //     combinedObject
  //   )
  //     .then((res) => {
  //       // setGoalsandDevGoals(res.data.data);
  //       // return Service.getemployeeKraId(empCode);
  //     })

  // ----------------------------------------------------------------THIS IS THE DISPLAY PART----------------------------------------------------------------------//

  const [employeeDetailsStatusInfo, setEmpDetailsStatusInfo] = useState("");
  // get employee status

  useEffect(() => {
    axios
      .get(`${BASE_URL}:9031/api/getUniqueEmployeeStatus/${empCode}`)
      .then((res) => {
        setEmpDetailsStatusInfo(res?.data);
      })
      .catch((err) => {
        toast.info("No Manager Review Found");
      });
  }, []);

  console.log(employeeDetailsStatusInfo, "*&&&&&&&&&&&&&&&&^^^++++++++++++++");

  // ------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    axios
      .get(`${BASE_URL}:9031/api/getAllOperators`)
      .then((res) => {
        setTargetOption(res.data);
      })
      .catch((err) => {
        Swal.fire("No No Manager Review Recorded");
      });
  }, []);

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
  }, []);

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
      empCode : empCode,
      overall_statusId: sid,
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


  console.warn(targetOption,"targetOption")

  // -----------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="w-full h-screen bg-gray-200 ">
      <div className="bg-white top-2 pb-24">
        {/* anything that is written under square bracket CSS property is a arbitrary value */}

        {/* Adding one seprating line according to the figma design */}

        <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4 mt-4"> </h1>

        {/* To make this we have to make a grid of 11 coloumns.4 for profile picture,role etc and 2 for "submitted on" and 5 for self rating */}

        <div className="grid grid-cols-11">
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
                    {profileInfo.fileAndObjectTypeBean?.empResDTO?.firstName}{" "}
                  </h2>
                  <p className=" font-medium text-m text-blue-900 -ml-0 pt-1">{`${profileInfo.fileAndObjectTypeBean?.empResDTO?.designationResDTO?.designationName} - 
                  ${profileInfo.fileAndObjectTypeBean?.empResDTO?.mainDeptResDTO.mainDepartment}`}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 border-l-[1px] border-gray-300 mt-2">
            <div className="ml-2 pl-6 mt-2">
              <div className="pb-1">
                <h2 className="text-sm font-thin text-black">Reviewed By</h2>
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
                <h2 className="text-sm font-thin text-black">Reviewed On</h2>
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
                <div className="text-m -mt-1">
                  {employeeDetailsStatusInfo?.reviewedOnn}
                </div>
              </div>
            </div>
          </div>

          {/* NOW THE SELF RATING PART is displayed AND ALSO ADDING ONE SEPRATING LINE ACCORDING TO THE FIGMA DESIGN*/}

          <div className="col-span-3 border-l-[1px] border-gray-300 mt-2">
            <div className="div ml-2 pl-6 mt-2">
              <div className="pb-1">
                <h2 className="text-sm font-thin text-black">Manager rating</h2>
              </div>
              {/* <div className="text-sm text-red-600 font-medium pl-6">
                {mgrComm.overallMgrRating}
              </div> */}
              <textarea
                name="OverallManagerRating"
                id=""
                className="text-sm text-red-600 font-medium pl-6"
                onChange={handleChangeComments}
                // value={overallValue.overallMgrRating}
                // value={
                //   mgrComm.overallRating ||
                //   overAllRating
                // }

                value={employeeDetailsStatusInfo?.managerOverallRating || ""}
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

          <div className="grid grid-cols-9 border-2 caret-red-100 mb-4">
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

            <div className="col-span-4 mt-3 ml-16 ">
              <div className="-ml-28 mb-12 space-y-6 pt-3">
                {/* <p className=" placeholder-gray-300 overflow-hidden resize-none w-[20%] h-[40px] font-extralight text-sm text-black -ml-0 pt-3 border-[1px] border-gray-300 p-1">
                  {mgrComm.overallMgrRating}
                </p> */}
                <textarea
                  type="text"
                  placeholder=""
                  className=" placeholder-gray-300 overflow-hidden resize-none w-[20%] h-[40px] font-extralight text-sm text-black -ml-0 pt-3 border-[1px] border-gray-300 p-1"
                  name="overallMgrRating"
                  onChange={handleChangeComments}
                  // value={overallValue.overallMgrRating}
                  // value={
                  //   mgrComm.overallRating ||
                  //   overAllRating ||
                  //   employeeDetailsStatusInfo?.managerOverallRating
                  // }
                  value={employeeDetailsStatusInfo?.managerOverallRating || ""}
                />
                <p className=" placeholder-gray-300 overflow-hidden resize-none w-[100%] h-[130px] font-extralight text-sm text-black -ml-0 pt-3 border-[1px] border-gray-300 p-1">
                  {employeeDetailsStatusInfo?.managerOverallComments || ""}
                </p>
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
            <h1 className="text-sm font-medium text-black  pt-4 pl-[115px] whitespace-nowrap ml-8">
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
                  {profileInfo.fileAndObjectTypeBean?.empResDTO?.firstName}{" "}
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
          <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4 mb-4"> </h1>

          <div className="grid grid-cols-12 mb-8">
            {kragoals?.length > 0 ? (
              <>
                {/* Goals Section */}
                <div className="col-span-12">
                  {kragoals.map((i, index) => (
                    <div
                      key={`${index}-${i}`}
                      className="grid grid-cols-12 mb-8 border-2 mt-2 "
                    >
                      {/* Weightage */}
                      <div className="col-span-1 mt-4">
                        <h2 className="font-extralight text-sm mx-8 pt-3 justify-center ml-10">
                          {i.weightage}
                        </h2>
                        <p className="font-extralight text-sm ml-4 mt-2 text-gray-500">
                          Weightage
                        </p>
                      </div>

                      {/* KRA and Goals */}
                      <div className="col-span-3 mt-4 -ml-8">
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
                      <div className="col-span-2 mt-10 flex -space-x-3 ml-4">
                        <div className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[45px] h-[35px] pl-4">
                            {targetOption.find(
                              (option) => option.targetOperatorId === parseInt(i?.target)
                            )?.targetOperator || "="}
                          </div>

                        
                        <h2 className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[60px] h-[35px] pl-2 pt-1">
                          {i.measurement}
                        </h2>
                      </div>
                      {/* <div className="col-span-3 -mt-4">
                        <h2 className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[45px] h-[35px] pl-4">
                          {i.managerRating}
                        </h2>
                        <h2 className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[60px] h-[35px] pl-2 pt-1">
                          {i.managerComment}
                        </h2>
                      </div> */}
                      <div className="col-span-3 ">
                        <h2 className="text-xs mt-1 ml-4">Rating</h2>
                        <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 mt-1 ml-4 pt-2 border-[1px] border-gray-300 p-1 ">
                          {i.selfRating}
                        </p>

                        <h2 className="text-xs ml-4">Comments</h2>
                        <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 ml-4 pt-2 border-[1px] border-gray-300 p-1 mt-1 mb-4">
                          {i.selfComment}
                        </p>
                      </div>
                      <div className="col-span-3">
                        <h2 className="text-xs">Rating</h2>
                        <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-1">
                          {i.managerRating}
                        </p>

                        <h2 className="text-xs">Comments</h2>
                        <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-1 mb-4">
                          {i.managerComment}
                        </p>
                      </div>

                      {/* <div className="col-span-3  w-full -mt-4">
                        <h3
                          className={`text-gray-500 text-xs ${
                            submitted ? "hidden" : ""
                          }`}
                        >
                          Rating
                        </h3>
                        <h2 className=" input input-bordered w-[15%] h-[30px] max-w-xs outline-none cursor-not-allowed font-medium text-sm bg-white">
                          {i.managerRating}
                        </h2>

                        <h3
                          className={`text-gray-500 text-xs ${
                            submitted ? "hidden" : ""
                          }`}
                        >
                          Comments
                        </h3>
                        <h2 className="input input-bordered w-[15%] h-[30px] max-w-xs outline-none cursor-not-allowed font-medium text-sm bg-white">
                          {i.managerComment}
                        </h2>
                      </div> */}

                      {/* <div className="col-span-3 mt-4 flex -spaManagerScreence-x-3 ml-4">
                        <h2 className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[45px] h-[35px] pl-4">
                          {i.managerRating}
                        </h2>
                        <h2 className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[60px] h-[35px] pl-2 pt-1">
                          {i.managerComment}
                        </h2>
                      </div> */}
                    </div>
                  ))}
                </div>
                {/* Ratings and Comments Section */}
                {/* <div className="col-span-5 ml-8">
                  <div
                    className={`col-span-3 -mt-1 ${
                      submitted ? "space-y-14" : "space-y-4"
                    }`}
                  >
                    <div className="space-y-2">
                      {kragoals.map((k, index) => (
                        <div key={`rating-comment-${index}`}>
                         
                          <div>
                            <h3
                              className={`text-gray-500 text-xs ${
                                submitted ? "hidden" : ""
                              }`}
                            >
                              Rating
                            </h3>
                            <h2 className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[45px] h-[35px] pl-4">
                              {k.managerRating}
                            </h2>
                          </div>

                       
                          <div>
                            <h3
                              className={`text-gray-500 text-xs ${
                                submitted ? "hidden" : ""
                              }`}
                            >
                              Comments
                            </h3>
                            <h2 className="font-extralight text-sm mx-8 justify-center ml-10 border-[1px] border-gray-300 w-[60px] h-[35px] pl-2 pt-1">
                              {k.managerComment}
                            </h2>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div> */}
              </>
            ) : (
              <div className="col-span-7 text-center mt-10">
                <h2 className="font-extralight text-sm text-red-500">
                  No goals submitted in the quarter.
                </h2>
              </div>
            )}
          </div>

          {/* -----------------------------------------------NOW THE DEVELOPMENT GOALS------------------------------------------------- */}

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

                      {developmentGoals?.map((j, index) => (
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

                          {/* Manager Assessment */}
                          <div>
                            <h2 className="text-sm">Self Assessment</h2>
                            <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                              {j.selfAssessment}
                            </p>
                          </div>
                          {/* Self Assessment */}
                          <div>
                            <h2 className="text-sm">Manager Assessment</h2>
                            <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                              {j.managerAssessment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NOW THE BUTTONS SECTION- "SUBMIT" "SAVE AS DRAFT" AND "CANCEL" BUTTON */}

          {/* <div className="grid grid-cols-12 mb-8">
            <div className="col-span-7">
              {mgrAssm.data?.map((i, index) => (
                <div key={`${index}-${i}`} className="grid grid-cols-7">
                  <div className="col-span-1 -mt-4">
                    <h2 className="font-extralight text-sm  mx-8 pt-3 justify-center ml-10">
                      {i.weightage}
                    </h2>
                    <p className=" font-extralight text-sm  ml-4 mt-2 text-gray-500">
                      Weightage
                    </p>
                  </div>

                  <div className="col-span-3 -mt-4 -ml-8">
                    <div className="ml-4 mb-12 ">
                      <h2 className="font-extralight text-sm  mx-8 pt-3  flex-col justify-center ml-10 ">
                        {i.kra}
                      </h2>
                      <div className="font-extralight text-m mt-2 flex-col justify-center ml-10 text-gray-500">
                       
                        {i.goals.split(/(?=\d+\.\s)/).map((line, lineIndex) => (
                          <p key={`${lineIndex}-${line.trim()}`}>
                            {line.trim()}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3  mt-4 flex -space-x-3 ml-4">
                    <h2 className="font-extralight text-sm  mx-8  justify-center ml-10 border-[1px] border-gray-300 w-[45px] h-[35px] pl-4">
                      {i.target}
                    </h2>

                    <h2 className="font-extralight text-sm  mx-8  justify-center ml-10 border-[1px] border-gray-300 w-[60px] h-[35px] pl-2 pt-1">
                      {i.measurement}
                    </h2>
                  </div>
                </div>
              ))}
            </div>

            <div className="-ml-[120px] -mr-14">
              <div className="col-span-3 -mt-1 space-y-11  ml-10 ">
                <div className="space-y-1">
                  <input
                    type="text"
                    className="input input-bordered w-[25%] h-[30px] max-w-xs  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frdRatings"
                    onChange={handleChangeComments}
                    value={ratingArr[0]}
                  ></input>
                  <input
                    type="text"
                    className="  overflow-hidden resize-none w-[100%] h-[72px] max-w-full  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frdComments"
                    onChange={handleChangeComments}
                    value={commentArr[0]}
                  ></input>
                </div>

                <div className="space-y-1 ">
                  <input
                    type="text"
                    className="input input-bordered w-[25%] h-[30px] max-w-xs  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frdRatings"
                    onChange={handleChangeComments}
                    value={ratingArr[1]}
                  ></input>
                  <input
                    type="text"
                    className="  overflow-hidden resize-none w-[100%] h-[72px] max-w-full  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frdComments"
                    onChange={handleChangeComments}
                    value={commentArr[1]}
                  ></input>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    className="input input-bordered w-[25%] h-[30px] max-w-xs  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frdRatings"
                    onChange={handleChangeComments}
                    value={ratingArr[2]}
                  ></input>
                  <input
                    type="text"
                    className="  overflow-hidden resize-none w-[100%] h-[72px] max-w-full  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frdComments"
                    onChange={handleChangeComments}
                    value={commentArr[2]}
                  ></input>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    className="input input-bordered w-[25%] h-[30px] max-w-xs  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frdRatings"
                    onChange={handleChangeComments}
                    value={ratingArr[3]}
                  ></input>
                  <input
                    type="text"
                    className="  overflow-hidden resize-none w-[100%] h-[72px] max-w-full  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frdComments"
                    onChange={handleChangeComments}
                    value={commentArr[2]}
                  ></input>
                </div>
              </div>
            </div>

            <div className="col-span-3 -mr-[20px]  ml-16">
              <div className="col-span-3 -mt-1 space-y-11 ml-12 ">
                <div className="space-y-1">
                  <input
                    type="text"
                    className="input input-bordered w-[25%] h-[30px] max-w-xs  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="firstRatings"
                    onChange={handleChangeComments}
                    value={ratingArr1[0]}
                  ></input>
                  <input
                    type="text"
                    className="  overflow-hidden resize-none w-[100%] h-[72px] max-w-full  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frstComments"
                    onChange={handleChangeComments}
                    value={commentArr1[0]}
                  ></input>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    className="input input-bordered w-[25%] h-[30px] max-w-xs  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="firstRatings"
                    onChange={handleChangeComments}
                    value={ratingArr1[1]}
                  ></input>
                  <input
                    type="text"
                    className="  overflow-hidden resize-none w-[100%] h-[72px] max-w-full  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frstComments"
                    onChange={handleChangeComments}
                    value={commentArr1[1]}
                  ></input>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    className="input input-bordered w-[25%] h-[30px] max-w-xs  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="firstRatings"
                    onChange={handleChangeComments}
                    value={ratingArr1[2]}
                  ></input>
                  <input
                    type="text"
                    className="  overflow-hidden resize-none w-[100%] h-[72px] max-w-full  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frstComments"
                    onChange={handleChangeComments}
                    value={commentArr1[2]}
                  ></input>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    className="input input-bordered w-[25%] h-[30px] max-w-xs  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="firstRatings"
                    onChange={handleChangeComments}
                    value={ratingArr1[3]}
                  ></input>
                  <input
                    type="text"
                    className="  overflow-hidden resize-none w-[100%] h-[72px] max-w-full  border-gray-200 outline-none text-gray-500 text-xs'"
                    name="frstComments"
                    onChange={handleChangeComments}
                    value={commentArr1[3]}
                  ></input>
                </div>
              </div>
              <div className="-ml-[920px] pb-8 pt-24">
                <h1 className="text-sm font-medium mb-6 pt-12">
                  Development Goals
                </h1>
                <div className="grid grid-cols-8 -space-x-10">
                  <div className="col-span-2">
                    <h2 className="text-sm">Trainings</h2>
                    <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                      {devGoals.training}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <h2 className="text-sm">Development goals & Plans</h2>
                    <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                      {devGoals.goal}
                    </p>
                    <p className="overflow-hidden resize-none w-[70%] h-[60px] font-extralight text-normal text-gray-500 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                      {devGoals.description}
                    </p>
                  </div>

                  <div className="col-span-2 ">
                    <h2 className="text-sm">Self Assessment</h2>
                    <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                      {devGoals.selfAssessment}
                    </p>
                  </div>

                  <div className="col-span-2 ">
                    <h2 className="text-sm">Manager Assessment</h2>
                    <p className="overflow-hidden resize-none w-[70%] h-[40px] font-extralight text-normal text-gray-500 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3">
                      {devGoals.managerAssessment}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
export default MangerReview;
