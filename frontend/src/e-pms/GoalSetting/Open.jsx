
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import { useEffect, useState } from "react";
import "react-dropdown/style.css";
import { GrAddCircle } from "react-icons/gr";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSessionStorage } from "react-use";
import Swal from "sweetalert2";
import AnnualReviewByEmp from "../annualReview/AnnualReviewByEmp";
import ManagerReview from "../managerReview/ManagerReview";
import SelfAppraisel from "../selfAppraisel/SelfAppraisel";
import Service from "../Service";

import { useStoreTabStatus } from "../GlobalStorage/ZustandStore";
import { BASE_URL } from "../../config/Config";

function Open() {
  const [loc, setLoc] = useState("");
  const location = useLocation();

  console.log(location, "location000000000");
  const empPerformance = location?.state?.data;

  console.log(empPerformance, "empPerformance++++++++12");

  const [sid, setSid] = useState(empPerformance?.employeeStatusId);
  console.log(sid, "sid%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

  const empCode = localStorage.getItem("empId");

  // const empCode = empPerformance?.empCode;
  console.warn(empCode, "empCode))))))))))(999now");

  useEffect(() => {
    setSid(empPerformance?.employeeStatusId);
  }, [sid]);
  // const empPerformance = location.state.data;
  // const [sid, setSid] = useState(location.state.data.employeeStatusId);
  const [kragoals, setKragoals] = useState(
    Array.from({ length: 1 }, () => ({
      kra: "",
      goals: "",
      measurementCriteria: "",
      measurement: "",
      target: "",
      weightage: "",
      subOverallStatusId: sid,
    }))
  );
  const [data, setData] = useState();
  const [selectedTraining, setSelectedTraining] = useState("");
  const [developmentGoals, setDevelopmentGoals] = useState([
    {
      training: "",
      goal: "",
      description: "",
      trainingOptionId: "",
      developmentSubId: "",
      empCode: 1,
      subOverallStatusId: sid,
    },
  ]);
  const [store, setStore] = useState([]);
  const [trainingOptions, setTrainingOptions] = useState([]);
  const trainingDropdown = trainingOptions.map(
    (training) => training.trainingName
  );
  const [developmentDrop, setDevelopmentDropdown] = useState([]);
  // const developmentDropdown = developmentDrop.map(training => training);
  const [developmentDropdowns, setDevelopmentDropdowns] = useState([]);
  const [session, setSession] = useSessionStorage(false);
  const [local, setLocal] = useSessionStorage(false);
  const [goalsandDevGoals, setGoalsandDevGoals] = useState(null);

  console.log(kragoals, "kragoals>>>>>>>>>>");
  console.log(developmentGoals, "developmentGoals>>>>>>");

  console.log(developmentDrop, "developmentDrop");
  const [targetOption, setTargetOption] = useState([]);
  const targets = targetOption.map((option) => option.targetOperator);
  useEffect(() => {
    axios
      .get(`${BASE_URL}:9031/api/getAllOperators`)
      .then((res) => {
        setTargetOption(res.data);
      })
      .catch((error) => {
        console.log("Error during fetching", error);
      });
  }, []);

  // function mapDevelopmentOption(index,selectedTraining) {
  //   if (selectedTraining) {
  //     console.log(selectedTraining,"selectedTraining............");
  //     return axios
  //       .get(`${BASE_URL}:9031/api/getTrainingOptionsByName/${selectedTraining}`)
  //       .then((res) => {
  //         console.log(res.data,"res.data");
  //         if (res.data) {
  //           const deepTechnicalOptions = res.data.map(develop => develop);
  //           console.warn(deepTechnicalOptions,"deepTechnicalOptions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //           setDevelopmentDropdown(trimOptions(deepTechnicalOptions));
  //         } else {
  //           return [];
  //         }
  //       }).catch(() => { return []; });
  //   }
  //   else {
  //     return [];
  //   }
  // }

  function mapDevelopmentOption(index, selectedTraining) {
    if (selectedTraining) {
      console.log(selectedTraining, "selectedTraining............");
      axios
        .get(
          `${BASE_URL}:9031/api/getTrainingOptionsByName/${selectedTraining}`
        )
        .then((res) => {
          console.log(res.data, "res.data");
          if (res.data) {
            // Store the dropdown options for the specific index (row)
            const deepTechnicalOptions = res.data.map((develop) => develop);
            console.warn(
              deepTechnicalOptions,
              "deepTechnicalOptions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
            );

            // Create a copy of the existing developmentDropdowns array
            const newDevelopmentDropdowns = [...developmentDropdowns];

            // Update the dropdown options for the specific index (row)
            newDevelopmentDropdowns[index] = deepTechnicalOptions;

            // Set the updated dropdown state
            setDevelopmentDropdowns(newDevelopmentDropdowns);
          } else {
            return [];
          }
        })
        .catch(() => {
          return [];
        });
    }
  }

  const [preventNavigation, setPreventNavigation] = useState();
  useEffect(() => {
    console.log(
      empCode,
      "empCode",
      sid,
      "empPerformance?.employeeStatusId ",
      empPerformance?.employeeStatusId || 0
    );

    if (sid !== undefined) {
      axios
        .get(
          `${BASE_URL}:9031/api/preventFromNavigationToKra/${empCode}/${sid}`
        )
        .then((res) => {
          if (res?.data) {
            setPreventNavigation(res?.data);
          } else {
            toast.warn("Quarter data not availaible");
          }
        })
        .catch(() => { });
    }
  }, [sid]);
  console.log(preventNavigation, "preventNavigation");

  function trimOptions(options) {
    if (!options || options.length === 0) {
      return [];
    }
    return options.filter((option) => option && option.trim() !== "");
  }

  console.log(selectedTraining, "selectedTraining...");

  // Axios to fetch data

  var handleWithDefault = () => {
    axios
      .get(`${BASE_URL}:9031/api/getdefaultgoals`, {
        params: {
          division: "SSD",
          role: "Trainee-Developer",
          empCode: empCode,
          overall_statusId: sid,
        },
      })
      .then((defaultResponse) => {
        console.log(defaultResponse.data, "+++++++++++");
        // debugger;
        console.log(defaultResponse.data, "test>>>>>>>>>>>");

        const goalsList = defaultResponse.data.goalsList || [];
        const devGoalsList = defaultResponse.data.devGoalsList || [];
        const goalsDraftList = defaultResponse.data.goalsDraftList || [];
        const devGoalsDraftList = defaultResponse.data.devGoalsDraftList || [];
        const defaultGoalsList = defaultResponse.data.defaultGoals || [];

        const savedAppraiseeGoal =
          goalsList.length > 0
            ? goalsList
            : goalsDraftList.length > 0
              ? goalsDraftList
              : defaultGoalsList.length > 0
                ? defaultGoalsList
                : [];

        console.log("nonEmptyGoals Goals for KRA:", savedAppraiseeGoal);
        setKragoals(savedAppraiseeGoal);

        const savedDevelopmentGoal =
          devGoalsList.length > 0
            ? devGoalsList
            : devGoalsDraftList.length > 0
              ? devGoalsDraftList
              : [];

        console.log("nonEmptyDevGoals Goals for KRA:", savedDevelopmentGoal);
        setDevelopmentGoals(savedDevelopmentGoal);

        setGoalsandDevGoals({
          savedAppraiseeGoals: savedAppraiseeGoal,
          savedDevelopmentGoals: savedDevelopmentGoal,
        });
      })
      .catch((error) => {
        console.error("Error fetching default goals:", error);
      });
  };
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

  const [trigger, setTrigger] = useState(false); //onclick functionality
  const handleKragoalChange = (e, i) => {
    let str = e.target.value;
    if (str.length != 0) {
      setTrigger(true);
    }

    const newKragoals = [...kragoals];
    newKragoals[i] = { ...newKragoals[i], [e.target.name]: e.target.value };
    setKragoals(newKragoals);
  };

  const MAX_KRAGOALS = 10;
  const handleAddKragoal = () => {
    // debugger
    if (kragoals.length < MAX_KRAGOALS) {
      setKragoals([...kragoals, { kra: "", goal: "", empCode: empCode }]);
    } else {
      toast.warning(`You can only add up to ${MAX_KRAGOALS} KRA & Goal items.`);
    }
  };
  const MAX_DEVELOPMENT_GOALS = 1;
  if (developmentGoals.length < MAX_DEVELOPMENT_GOALS) {
    setDevelopmentGoals((prevGoals) => [
      ...prevGoals,
      { training: "", goal: "", description: "", empCode: empCode },
    ]);
  }
  const handleAddDevelopmentGoal = () => {
    // debugger
    const MAX_DEVELOPMENT_GOALS = 10;
    if (developmentGoals.length < MAX_DEVELOPMENT_GOALS) {
      setDevelopmentGoals((prevGoals) => [
        ...prevGoals,
        { training: "", goal: "", description: "", empCode: empCode },
      ]);
    } else {
      toast.warning(
        `You can only add up to ${MAX_DEVELOPMENT_GOALS} development goals.`
      );
    }
  };
  const handleClick = () => {
    console.log("Button clicked!");
  };

  //Delete
  const confirmDelete = (index, dgDraftId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteDevelopmentGoal(index, dgDraftId);
      }
    });
  };
  const confirmKraDelete = (i, goalDraftId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteKragoal(i, goalDraftId);
      }
    });
  };
  const handleDeleteKragoal = (i, id) => {
    const newKragoals = [...kragoals];
    newKragoals.splice(i, 1);
    setKragoals(newKragoals);
    Service.deleteEmployeeKraOrDraft(id)
      .then((response) => {
        console.log("Successfully deleted data:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting development goal:", error);
      });
  };
  const handleDeleteDevelopmentGoal = (i, id) => {
    const newDevelopmentGoals = [...developmentGoals];
    newDevelopmentGoals.splice(i, 1);
    setDevelopmentGoals(newDevelopmentGoals);
    Service.deleteDevelopmentGoal(id)
      .then((response) => {
        console.log("Successfully deleted development goal:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting development goal:", error);
      });
  };
  console.log(kragoals, "kragoalskragoals");

  const handleSubmitClick = () => {
    // validation checks
    const totalWeightage = kragoals
      ? kragoals.reduce(
        (acc, kragoal) => acc + parseFloat(kragoal.weightage) || 0,
        0
      )
      : 0;
    if (totalWeightage !== 100) {
      toast.error("Total weightage should be 100%. Please check your input.");
      return;
    }

    const goals = developmentGoals.map((goal) => ({
      training: goal?.training,
      trainingOptionId: goal?.trainingOptionId,
      developmentSubId: goal?.developmentSubId,
      goal: goal.goal,
      description: goal.description,
      empCode: empCode,
      subOverallStatusId: sid,
      dg_id: goal?.dg_id,
    }));
    console.log(goals, "goalsgoalsgoals");
    setTimeout(() => {
      setDevelopmentGoals(goals);
      console.log("goals>>>>>>>>>>>>>>>>>>> 1111>>>>>", goals);
      console.log(
        "developmentGoals>>>>>>>>>>>>>>>>>>> 1111>>>>>",
        developmentGoals
      );
    }, 100);

    const kraGoalsUpdate = kragoals.map(({ defaultGoalsId, ...rest }) => ({
      ...rest,
      empCode: empCode,
      subOverallStatusId: sid, // add the new property
    }));

    console.log("DevelopmentGoals>>>>>>>>>>>>>>>>>>>", goals);
    console.log("kraGoalsUpdate>>>>>>>>>>>>>>>>>>>", kraGoalsUpdate);

    const combinedObject = {
      devGoalsList: goals,
      goalsList: kraGoalsUpdate,
    };
    console.log("combinedObject>>>>>>>>>>>>>>>>>>>", combinedObject);

    Service.postemployeeKra(empCode, combinedObject)
      .then((res) => {
        setGoalsandDevGoals(res.data.data);
        return Service.getmess();
      })

      .then((response) => {
        setData(response.data);
        return Service.deletedevelopmentdraftbyempCode(empCode);
      })
      .then(() => {
        console.log("Draft data deleted successfully.");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
    goals.forEach((goal) => postDraft(goal));
  };

  const postDraft = (selectedGoal) => {
    const { dgId, ...cleanedGoal } = selectedGoal; //To Remove Default Empty Goal
    if (Object.keys(cleanedGoal).length > 0) {
      console.log(cleanedGoal, "cleanedGoaly");
    } else {
      console.warn("No valid data to post.");
    }
  };

  //status update
  const postSubmit = () => {
    setLoc(location.state.data);
    Service.postemployeePerformance(empPerformance).then((res) => {
      console.log("submitted");
    });
  };
  console.warn(loc, "data");
  const navigate = useNavigate();

  const postDraftStatus = () => {
    axios
      .post(`${BASE_URL}:9031/api/postDraftSaved`, empPerformance)
      .then((res) => {
        console.log("submitted");
      })
      .catch((error) => {
        console.log("Not saved", error);
      });
  };

  //Save As Draft
  const handleSaveAsDraftClick = () => {
    const goals = developmentGoals.map((goal) => ({
      dgDraftId: goal.dgDraftId,
      training: goal.training,
      trainingOptionId: goal.trainingOptionId,
      developmentSubId: goal.developmentSubId,
      goal: goal.goal,
      description: goal.description,
      empCode: empCode,
      subOverallStatusId: sid,
    }));

    console.log(goals, "goalsgoalsgoals");
    // Initialize kraGoalsUpdate next
    const kraGoalsUpdate = kragoals.map(({ defaultGoalsId, ...rest }) => ({
      ...rest,
      empCode: empCode,
      subOverallStatusId: sid,
    }));

    const combinedDraftObject = {
      devGoalsDraftList: goals,
      goalsDraftList: kraGoalsUpdate,
    };
    console.log("combinedDraftObject>>>>>>>>>>>>>>>>>>>", combinedDraftObject);

    console.log(empCode, "empCode", combinedDraftObject, "combinedDraftObject");
    // Now post employee KRA drafts
    Service.postemployeeKraDrafts(empCode, combinedDraftObject)
      .then((postResponse) => {
        return postResponse.data;
      })
      .catch((error) => {
        console.error("Error saving draft data:", error);
        toast.error("Failed to save draft data.");
      });
    Swal.fire({
      icon: "info",
      title: "Form Saved As Draft",
      text: "Your form is saved as draft. It has not been submitted.",
    });
    navigate("/");
  };

  const [valueOnchange, setValueOnchange] = useState(0);

  const handleSaveAsDraftOnChange = (e) => {
    setValueOnchange((valueOnchange) => valueOnchange + 1);
  };

  const [value, setValue] = useState("one");
  console.log(value);

  const handleChange = (event, newValue) => {
    // setValue(newValue);
    setTabStatus(newValue);
  };

  const [appraisal, setAppraisal] = useState([]);
  const reviewCycle = empPerformance?.reviewCycle;

  console.log("store>>>>>>>>>", store);

  useEffect(() => {
    Service.getPendingAppraisal(reviewCycle)
      .then((response) => {
        const data = response?.data?.data;
        const matchedData = data.filter(
          (item) => item.appraisalQuarter === empPerformance?.appraisalCycle
        );
        setAppraisal(matchedData);
      })
      .catch((error) => {
        // console.error('Error fetching data:', error);
      });
  }, [reviewCycle]);

  const [approvedStatus, setApprovedStatus] = useState("");

  const getEmployeeStatus = () => {
    axios
      .get(`${BASE_URL}:9031/api/getUniqueEmployeeStatus/${empCode}`)
      .then((res) => {
        setApprovedStatus(res?.data?.approvedOn);
      })
      .catch((err) => {
        // Swal.fire("No Employee Status Available");
        // toast.warn("Employee Status Not Available");
      });
  };

  console.log(approvedStatus, "approvedStatus+++++++++++++++++++++++++++++");

  // useEffect(()=>{
  //   getEmployeeStatus();
  // },[])

  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem("role")) || [];
  } catch (e) {
    console.error("Error parsing roles from sessionStorage:", e);
  }

  // Function to check if the user has a specific role

  const { tabStatus, setTabStatus } = useStoreTabStatus();

  console.log(tabStatus, "tabStatus((((");

  const hasRole = (role) => roles.includes(role);

  console.log(
    empPerformance?.currentStatus,
    "empPerformance?.currentStatus********"
  );

  console.log(targetOption, "getAllOperatorsgetAllOperators")

  return (
    <div className="">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-full">
        <div className="bg-white">
          <Box sx={{ width: "100%" }}>
            <>
              <div className=" flex">
                <div>
                  <h1 className="text-xl font-normal text-black pl-4 pt-10">
                    {empPerformance?.appraisalCycle}
                  </h1>
                  {appraisal.map((item, index) => (
                    <div key={index}>
                      <h2 className="text-m text-gray-500 pl-5 mt-4">
                        {item.periodFrom} to{item.periodTo}
                      </h2>
                    </div>
                  ))}
                </div>

                <div>
                  {" "}
                  {data && (
                    <div className=" flex  items-center  text-green-500  ml-52  mt-12">
                      <IoMdCheckmarkCircleOutline className="  mr-2  ml" /> You
                      Have Successfully Submitted your Kra And Goals
                    </div>
                  )}
                </div>
              </div>
            </>

            <Tabs
              value={setTabStatus}
              onChange={handleChange}
              textColor="primary"
              indicatorColor="primary"
              aria-label="secondary tabs example"
            >
              <Tab
                className="text-xl"
                value="one"
                label={
                  <Typography
                    style={{
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    Goal Setting
                  </Typography>
                }
              />

              <Tab
                className="text-xl"
                value="two"
                disabled={approvedStatus != null ? false : true}
                label={
                  <Typography
                    style={{
                      fontWeight: "bolder",
                      textTransform: "none",
                    }}
                  >
                    Self Assessment
                  </Typography>
                }
              />

              <Tab
                className="text-xl"
                value="three"
                label={
                  <Typography
                    style={{
                      fontWeight: "bolder",
                      textTransform: "none",
                    }}
                  >
                    Manager Assessment
                  </Typography>
                }
              />

              <Tab
                className="text-xl"
                value="four"
                label={
                  <Typography
                    style={{
                      fontWeight: "bolder",
                      textTransform: "none",
                    }}
                  >
                    Annual Review
                  </Typography>
                }
              />
            </Tabs>

            {tabStatus === "one" && (
              <>
                <div style={{ padding: "10px" }}>
                  <div className="flex border-b-[1px] mt-6 text-md text-sm font-normal text-black">
                    <div className="KRA ml-2"> Object Area/KRA </div>
                    <div className="Target/Goals ml-32"> Goals/Objective</div>
                    <div className="Measurment critiria ml-36">
                      {" "}
                      Measurment Critiria/Target{" "}
                    </div>
                    <div className="ml-20">
                      Weightage(Total Should be 100%){" "}
                    </div>
                  </div>

                  {/* Kra Goal Setting */}
                  <form className=" break-words">
                    {kragoals?.map((kragoal, index) => (
                      <div
                        key={index}
                        className=" whitespace-normal  break-words"
                        style={{ display: "flex", marginBottom: "10px" }}
                      >
                        <textarea
                          disabled={
                            empPerformance?.currentStatus ===
                            "Submitted To Manager" ||
                            empPerformance?.currentStatus === "Disable" ||
                            empPerformance?.currentStatus === "Approved"
                          }
                          type="text"
                          placeholder="kra"
                          name="kra"
                          value={kragoal?.kra || ""}
                          className=" mt-7  ml-4  break-all  whitespace-normal"
                          onChange={(e) => {
                            handleKragoalChange(e, index);
                            handleSaveAsDraftOnChange();
                          }}
                          style={{
                            height: "100px",
                            marginRight: "3px",
                            border: "solid 1px #ccc",
                            borderWidth: "thin",
                            overflowWrap: "break-word",
                          }}
                        />{" "}
                        <br />
                        <textarea
                          disabled={
                            empPerformance?.currentStatus ===
                            "Submitted To Manager" ||
                            empPerformance?.currentStatus === "Disable" ||
                            empPerformance?.currentStatus === "Approved"
                          }
                          type="text"
                          placeholder="goals"
                          name="goals"
                          value={kragoal?.goals || ""}
                          className=" w-72   mt-7  ml-1  text-left   whitespace-normal"
                          onChange={(e) => {
                            handleKragoalChange(e, index);
                            handleSaveAsDraftOnChange();
                          }}
                          style={{
                            marginRight: "50px",
                            textIndent: "10px",
                            border: "solid 1px #ccc",
                            borderWidth: "thin",
                          }}
                        />
                        {/* <div className=" flex  items-center">
                          <select
                            value={
                              targetOption.find(
                                (option) =>
                                  option.targetOperatorId === kragoal?.target
                              )?.targetOperator || ""
                            }
                            disabled={
                              empPerformance?.currentStatus ===
                                "Submitted To Manager" ||
                              empPerformance?.currentStatus === "Disable" ||
                              empPerformance?.currentStatus === "Approved"
                            }
                            onChange={(e) => {
                              const selectedOperator = e.target.value;
                              const selectedOption =
                                targetOption.find(
                                  (option) =>
                                    option.targetOperator === selectedOperator
                                )?.targetOperatorId ?? "";
                              handleKragoalChange(
                                {
                                  target: {
                                    name: "target",
                                    value: selectedOption,
                                  },
                                },
                                index
                              );
                              handleSaveAsDraftOnChange();
                            }}
                            className="mt-8 h-8 w-12 border border-solid border-gray-300"
                          >
                            {targets.map((target, idx) => (
                              <option key={idx} value={target}>
                                {target}
                              </option>
                            ))}
                          </select>
                        </div> */}
                        <div className="flex items-center">
                          <select
                            value={
                              targetOption.find(
                                (option) =>
                                  option.targetOperatorId === parseInt(kragoal?.target)
                              )?.targetOperator || ""
                            }
                            disabled={
                              empPerformance?.currentStatus === "Submitted To Manager" ||
                              empPerformance?.currentStatus === "Disable" ||
                              empPerformance?.currentStatus === "Approved"
                            }
                            onChange={(e) => {
                              const selectedOperator = e.target.value;
                              const selectedOption =
                                targetOption.find(
                                  (option) => option.targetOperator === selectedOperator
                                )?.targetOperatorId ?? "";

                              handleKragoalChange(
                                {
                                  target: {
                                    name: "target",
                                    value: selectedOption,
                                  },
                                },
                                index
                              );

                              handleSaveAsDraftOnChange();
                            }}
                            className="mt-8 h-8 w-12 border border-solid border-gray-300"
                          >
                            {targetOption.map((option) => (
                              <option key={option.targetOperatorId} value={option.targetOperator}>
                                {option.targetOperator}
                              </option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          disabled={
                            empPerformance?.currentStatus ===
                            "Submitted To Manager" ||
                            empPerformance?.currentStatus === "Disable" ||
                            empPerformance?.currentStatus === "Approved"
                          }
                          type="text"
                          placeholder=""
                          name="measurement"
                          value={kragoal?.measurement || ""}
                          className="ml-2 mt-16 w-20 h-8 text-left whitespace-normal border border-solid border-gray-300 p-2"
                          onChange={(e) => {
                            handleKragoalChange(e, index);
                            handleSaveAsDraftOnChange();
                          }}
                          required
                          style={{ textIndent: "10px" }}
                        />
                        <textarea
                          disabled={
                            empPerformance?.currentStatus ===
                            "Submitted To Manager" ||
                            empPerformance?.currentStatus === "Disable" ||
                            empPerformance?.currentStatus === "Approved"
                          }
                          type="text"
                          placeholder="weightage"
                          name="weightage"
                          value={kragoal?.weightage || ""}
                          className=" mt-16  ml-28  w-32  h-8 break-all "
                          onChange={(e) => {
                            handleKragoalChange(e, index);
                            handleSaveAsDraftOnChange();
                          }}
                          style={{
                            border: "2px solid #ccc",
                            borderWidth: "thin",
                          }}
                        />
                        <h3 className=" ml-2  scale-110  mt-16  text-blue-400">
                          %
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            confirmKraDelete(index, kragoal?.goalDraftId)
                          }
                          disabled={
                            empPerformance?.currentStatus ===
                            "Submitted To Manager" ||
                            empPerformance?.currentStatus === "Disable" ||
                            empPerformance?.currentStatus === "Approved"
                          }
                          title="Delete"
                          className="ml-28 mt-6 scale-150 text-red-500"
                        >
                          {" "}
                          <RiDeleteBin5Fill />{" "}
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddKragoal}
                      disabled={
                        empPerformance?.currentStatus ===
                        "Submitted To Manager" ||
                        empPerformance?.currentStatus === "Disable" ||
                        empPerformance?.currentStatus === "Approved"
                      }
                      style={{ marginLeft: "28%" }}
                      className=" flex  items-center  font-bold  text-blue-400  text-md"
                    >
                      <GrAddCircle />
                      Add More{" "}
                    </button>
                    <div className=" flex  flex-row  border-b-2">
                      <button
                        type="submit"
                        style={{ marginLeft: "42%" }}
                        className="  flex  ml-96  mt-7  text-black  text-md"
                      >
                        Total out Of 100%{" "}
                      </button>
                      <textarea
                        disabled={
                          empPerformance?.currentStatus ===
                          "Submitted To Manager" ||
                          empPerformance?.currentStatus === "Disable" ||
                          empPerformance?.currentStatus === "Approved"
                        }
                        type="text"
                        placeholder="100"
                        value={"100"}
                        className=" ml-2  my-7  text-black  text-md"
                        style={{
                          border: "solid 1px #ccc",
                          borderWidth: "thin",
                          marginLeft: "100px",
                          width: "130px",
                          height: "35px",
                        }}
                        readOnly
                      />
                      <h3 className=" ml-1   p-2  scale-110  mt-7   text-blue-400 ">
                        %
                      </h3>
                    </div>

                    {/* Development Goals */}
                    <div className="">
                      <div className="text-lg font-medium mb-6 pt-12 ml-4">
                        Development Goals
                      </div>
                      <div className="flex mt-6 text-sm text-black">
                        <div className="ml-8 "> Trainings </div>
                        <div className="ml-64 "> Development Goals</div>
                        <div className="ml-44 "> self Assesment </div>
                        <div className="ml-44">Manager assesment </div>
                      </div>
                      {developmentGoals.map((goal, index) => (
                        <div
                          key={index}
                          className="whitespace-normal break-words"
                          style={{ display: "flex", marginBottom: "10px" }}
                        >
                          <select
                            disabled={
                              empPerformance?.currentStatus ===
                              "Submitted To Manager" ||
                              empPerformance?.currentStatus === "Disable" ||
                              empPerformance?.currentStatus === "Approved"
                            }
                            value={goal.training || "--SELECT--"}
                            onChange={(e) => {
                              const selectedOptionId =
                                e.target.selectedOptions[0].dataset.optionid;
                              const newGoals = [...developmentGoals];

                              // Update the training value for the specific row
                              newGoals[index].training = e.target.value;
                              newGoals[
                                index
                              ].trainingOptionId = selectedOptionId;
                              newGoals[index].goal = ""; // Clear goal when training changes
                              setDevelopmentGoals(newGoals);

                              // Trigger the row-specific training options update
                              mapDevelopmentOption(index, e.target.value);
                            }}
                            className="h-14 w-34 px-1 py-4 mt-3 ml-2 border rounded"
                          >
                            <option value="--SELECT--">--SELECT--</option>
                            {trainingDropdown.length === 0 && store.length > 0
                              ? store.map((item, idx) => (
                                <option
                                  key={`fetched-training-${idx}`}
                                  value={item.training}
                                  data-optionid={item.trainingOptionId}
                                >
                                  {item.training}
                                </option>
                              ))
                              : trainingOptions.map((option, optionIndex) => (
                                <option
                                  key={`training-option-${optionIndex}`}
                                  value={option.trainingName}
                                  data-optionid={option.trainingOptionId}
                                >
                                  {option.trainingName}
                                </option>
                              ))}
                          </select>

                          <select
                            disabled={
                              empPerformance?.currentStatus ===
                              "Submitted To Manager" ||
                              empPerformance?.currentStatus === "Disable" ||
                              empPerformance?.currentStatus === "Approved"
                            }
                            value={`${goal.developmentSubId} - ${goal.goal}`} // Format the value
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              const [id, name] = selectedValue.split(" - "); // Split into ID and goal name

                              const newGoals = [...developmentGoals];
                              newGoals[index] = {
                                ...newGoals[index],
                                goal: name.trim(),
                                developmentSubId: id.trim(),
                              };
                              setDevelopmentGoals(newGoals); // Update the state with the new goal for the row
                            }}
                            className="h-14 w-72 px-1 py-4 mt-3 ml-4 border rounded"
                          >
                            {Array.isArray(developmentDropdowns[index]) &&
                              developmentDropdowns[index].length > 0 ? (
                              developmentDropdowns[index].map(
                                (goalOption, goalIndex) => {
                                  const displayValue = goalOption.includes(
                                    " - "
                                  )
                                    ? goalOption.split(" - ")[1]
                                    : goalOption;
                                  return (
                                    <option key={goalIndex} value={goalOption}>
                                      {displayValue}
                                    </option>
                                  );
                                }
                              )
                            ) : (
                              <option
                                value={`${goal?.developmentSubId} - ${goal?.goal}`}
                              >
                                {goal?.goal}
                              </option>
                            )}
                          </select>

                          <textarea
                            placeholder="Self-assessment"
                            className="w-64 h-14 py-1 px-3 mt-3 ml-2 border rounded border-gray-300 cursor-not-allowed"
                            value={goal.selfAssessment || "NA"}
                            readOnly
                          ></textarea>

                          <textarea
                            placeholder="Manager assessment"
                            className="w-64 py-1 h-14 mt-3 px-3 ml-4 border rounded border-gray-300 cursor-not-allowed"
                            value={goal.managerAssessment || "NA"}
                            readOnly
                          ></textarea>

                          <button
                            type="button"
                            onClick={() => confirmDelete(index, goal.dgDraftId)}
                            title="Delete"
                            className="ml-4 scale-150 text-red-500"
                            style={{ marginTop: "-120px" }}
                          >
                            <RiDeleteBin5Fill />
                          </button>

                          <div className="mt-20 -ml-[750px] ">
                            <label
                              htmlFor="description"
                              className=" flex ml-[-40px] mt-4 text-sm text-black "
                            >
                              Description{" "}
                            </label>
                            <textarea
                              disabled={
                                empPerformance?.currentStatus ===
                                "Submitted To Manager" ||
                                empPerformance?.currentStatus === "Disable" ||
                                empPerformance?.currentStatus === "Approved"
                              }
                              placeholder=""
                              className="w-72 py-1 px-3 mt-4 h-14 ml-[-100px] border rounded border-gray-300"
                              value={
                                goal.description ||
                                (store[index]
                                  ? store[index].description || ""
                                  : "")
                              }
                              onChange={(e) => {
                                const newGoals = [...developmentGoals];
                                newGoals[index].description = e.target.value;
                                setTrigger(true);
                                setDevelopmentGoals(newGoals);
                              }}
                            ></textarea>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddDevelopmentGoal();
                        }}
                        disabled={
                          empPerformance?.currentStatus ===
                          "Submitted To Manager" ||
                          empPerformance?.currentStatus === "Disable" ||
                          empPerformance?.currentStatus === "Approved"
                        }
                        style={{ marginLeft: "32%" }}
                        className="flex items-center font-bold text-blue-400 text-md"
                      >
                        <GrAddCircle /> Add More
                      </button>{" "}
                    </div>

                    {/* Render form buttons conditionally for submission, saving as draft, and canceling actions*/}
                    {/* {empPerformance?.currentStatus !== "Submitted To Manager" && empPerformance?.currentStatus !== "Disable"  && ( */}
                    {empPerformance?.currentStatus !== "Submitted To Manager" &&
                      empPerformance?.currentStatus !== "Disable" &&
                      empPerformance?.currentStatus !== "Approved" && (
                        <>
                          {local == "true" ? (
                            ""
                          ) : (
                            <>
                              {session ? (
                                <button
                                  style={{
                                    marginLeft: "64%",
                                    marginBottom: "20%",
                                  }}
                                  className=" mt-7  ml-96  py-2  px-7   bg-blue-400  text-white"
                                  onClick={() => {
                                    handleSubmitClick();
                                    postSubmit();
                                    setLocal("true");
                                  }}
                                >
                                  Submit
                                </button>
                              ) : (
                                <>
                                  <button
                                    style={{
                                      marginLeft: "64%",
                                      marginBottom: "20%",
                                    }}
                                    className=" mt-7   ml-96  py-2  px-7   bg-blue-400  text-white"
                                    onClick={() => {
                                      handleSubmitClick();
                                      postSubmit();
                                      setLocal("true");
                                    }}
                                    title="Click Here To Submit"
                                  >
                                    Submit
                                  </button>
                                  <button
                                    style={{ marginLeft: "1%" }}
                                    className=" mt-7  ml-2  py-2  px-5  font-bold  bg-gray-400  text-white"
                                    onClick={() => {
                                      handleSaveAsDraftClick();
                                      setSession(true);
                                      postDraftStatus();
                                    }}
                                    title="Click Here To Save the data in draft"
                                  >
                                    Save as Draft{" "}
                                  </button>
                                  <button
                                    style={{ marginLeft: "1%" }}
                                    className=" mt-7  ml-2  py-2  px-7  font-bold  bg-gray-300  text-white"
                                    onClick={handleClick}
                                  >
                                    {" "}
                                    Cancel
                                  </button>
                                </>
                              )}
                            </>
                          )}

                          {!local && trigger && session && (
                            <>
                              <button
                                style={{ marginLeft: "1%" }}
                                className="mt-7 ml-2 py-2 px-5 font-bold bg-gray-400 text-white"
                                onClick={() => {
                                  handleSaveAsDraftClick();
                                  setSession(true);
                                  postDraftStatus();
                                }}
                                title="Click Here To Save the data in draft"
                              >
                                {" "}
                                Save as Draft{" "}
                              </button>
                              <button
                                style={{ marginLeft: "1%" }}
                                className="mt-7 ml-2 py-2 px-7 font-bold bg-gray-300 text-white"
                                onClick={handleClick}
                              >
                                {" "}
                                Cancel
                              </button>
                            </>
                          )}
                        </>
                      )}

                    <></>
                  </form>
                  <ToastContainer />
                </div>
              </>
            )}
            {tabStatus === "two" && (
              <>
                <SelfAppraisel
                  goalsandDevGoals={goalsandDevGoals}

                />
              </>
            )}

            {tabStatus === "three" && (
              <>
                <ManagerReview empCode={empCode} sid={sid} />
              </>
            )}

            {tabStatus === "four" && (
              <>
                <AnnualReviewByEmp />
              </>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}
export default Open;
