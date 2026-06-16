import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import "react-dropdown/style.css";
import { GrAddCircle } from "react-icons/gr";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Service from "../Service";
//import useStore from "../GlobalStorage/ZustandStore";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/Config";

function ManagerView() {
  const location = useLocation();
  console.log(location, "location");
  const empCode = location?.state?.empCode?.employeeCode;

  // const {empStatusId,setEmpStatusId}=useStoreEmployeeStatusId();

  const [currentSid, setCurrentSid] = useState();

  useEffect(() => {
    console.log(empCode, "empCode ttttttttttttttt6677777777777777777");
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
  }, []);

  console.log(currentSid, "currentSid");

  // const empCode = localStorage.getItem("empCode");
  //const { empCode } = useStoreempCode();
  const [targetOption, setTargetOption] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState("");

  const [developmentDrop, setDevelopmentDropdown] = useState([]);

  const developmentDropdown = developmentDrop.map((training) => training);

  const [trainingOptions, setTrainingOptions] = useState([]);
  const targets = targetOption.map((option) => option.targetOperator);

  const trainingDropdown = trainingOptions.map(
    (training) => training.trainingName
  );

  // const { sid } = useStoreSID();
  // // const empCode = empCode;

  // console.log(empCode, "empCode");

  // // const empCode = location?.state?.empCode?.empCode || "";

  // const [empCode, setempCode] = useState(
  //   location?.state?.empCode?.empCode || ""
  // );

  const empPerformance = location?.state?.empCode;
  // console.log(sid, "???????????????????????????");
  console.log(empPerformance, "empPerformancettt");

  // const [sid, setSid] = useState(location.state.data.employeeStatusId);
  const [kragoals, setKragoals] = useState([
    {
      kra: "",
      goals: "",
      measurementCriteria: "",
      measurement: "",
      weightage: "",
    },
  ]);
  const [developmentGoals, setDevelopmentGoals] = useState([
    {
      training: "",
      goal: "",
      description: "",
      trainingOptionId: "",
      developmentSubId: "",
      empCode: empCode,
      subOverallStatusId: currentSid,
    },
  ]);

  const [selectedGoal, setSelectedGoal] = useState("");
  // const [developmentDrop, setDevelopmentDropdown] = useState([]);

  const [store, setStore] = useState([]);

  const [goalsandDevGoals, setGoalsandDevGoals] = useState(null);

  const [isManagerRivertCommentOpen, setIsManagerRivertCommentOpen] = useState(
    false
  );
  const [rivertcomment, setRivertcomment] = useState([]);

  const handleManagerRivertCommentSubmit = () => {
    const requestData = {
      empCode: empCode,
      mgrRevertComments: rivertcomment,
    };

    console.log(requestData, "requestData");
    Service.postmanagerrevertcomments(currentSid, requestData)
      .then((response) => {
        toast.success("KRA Reverted successfully!");

        console.log(
          "Manager's rivert comments submitted successfully:",
          response.data
        );
        closeModal();
      })
      .catch((error) => {
        // toast.warn("Employee Goals Not Found1");
        console.error("Error submitting manager's rivert comments:", error);
        // if (error.response) {
        //   console.error("Response data:", error.response.data);
        // }
      });
  };

  const closeModal = () => {
    setIsManagerRivertCommentOpen(false);
  };
  const developmentGoalOptions = {};
  const navigate = useNavigate();
  const handleApprove = () => {
    toast.success("KRA Approved successfully!");
    navigate("/e-pms");
  };

  // console.log(viewData, "hello000000000000000000000000000000000vvvvvv");
  const [globalData1, setGlobalData1] = useState(""); //Quarter and Financial Year
  const [globalData2, setGlobalData2] = useState("");

  const [approvedOn, setApprovedOn] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}:9031/api/getAllOperators`)
      .then((res) => {
        setTargetOption(res.data);
      })
      .catch((error) => {
        // toast.warn("Employee Goals Not Found2");
        //console.log("Error during fetching", error)
      });
  }, [currentSid]);

  function mapDevelopmentOption(selectedTraining) {
    if (selectedTraining) {
      return axios
        .get(
          `${BASE_URL}:8080/api/getTrainingOptionsByName/${selectedTraining}`
        )
        .then((res) => {
          if (res.data) {
            const deepTechnicalOptions = res.data.map((develop) => develop);
            setDevelopmentDropdown(trimOptions(deepTechnicalOptions));
          } else {
            return [];
          }
        })
        .catch(() => {
          // toast.warn("Employee Goals Not Found3");
        });
    } else {
      return [];
    }
  }
  function trimOptions(options) {
    if (!options || options.length === 0) {
      return [];
    }
    return options.filter((option) => option && option.trim() !== "");
  }

  const handleViewData = () => {
    axios
      .get(`${BASE_URL}:9031/api/setApprovedOn/${empCode}`)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Approved Successfully",
          timer: 1500,
        });
      })
      .catch((err) => {
        Swal.fire("No Employee Status Available");
      });
  };



  console.log(store, "++++++++++++++++++++++++++++");

  var handleWithDefault = () => {
    axios
      .get(`${BASE_URL}:9031/api/getdefaultgoals`, {
        params: {
          division: "SSD",
          role: "Trainee-Developer",
          empCode: empCode,
          overall_statusId: currentSid,
        },
      })
      .then((defaultResponse) => {
        console.log(defaultResponse.data, "+++++++++++");
        // debugger;
        console.log(defaultResponse.data, "test>>>>>>>>>>>");

        const goalsList = defaultResponse?.data?.goalsList || [];
        const devGoalsList = defaultResponse?.data?.devGoalsList || [];
        const goalsDraftList = defaultResponse?.data?.goalsDraftList || [];
        const devGoalsDraftList =
          defaultResponse?.data?.devGoalsDraftList || [];
        const defaultGoalsList = defaultResponse?.data?.defaultGoals || [];

        const savedAppraiseeGoal =
          goalsList?.length > 0
            ? goalsList
            : goalsDraftList?.length > 0
            ? goalsDraftList
            : defaultGoalsList?.length > 0
            ? defaultGoalsList
            : [];

        console.log("nonEmptyGoals Goals for KRA:", savedAppraiseeGoal);
        setKragoals(savedAppraiseeGoal);

        const savedDevelopmentGoal =
          devGoalsList?.length > 0
            ? devGoalsList
            : devGoalsDraftList?.length > 0
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
        // toast.warn("Employee Goals Not Found6");
        // console.error("Error fetching default goals:", error);
      });
  };
  useEffect(() => {
    handleWithDefault();
    Service.getAllTrainings()
      .then((response) => {
        setTrainingOptions(response?.data?.data);
        console.log(response.data, "<<<<<<<<<<<<<<<<<");
      })
      .catch((error) => {
        // toast.warn("Employee Goals Not Found7");
        // console.error('Error fetching data:', error);
      });
  }, [currentSid]);

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
  // const handleAddKragoal = () => {
  //   // debugger
  //   if (kragoals.length < MAX_KRAGOALS) {
  //     setKragoals([...kragoals, { kra: "", goal: "", empCode: empCode }]);
  //   } else {
  //     toast.warning(`You can only add up to ${MAX_KRAGOALS} KRA & Goal items.`);
  //   }
  // };
  const MAX_DEVELOPMENT_GOALS = 1;
  if (developmentGoals.length < MAX_DEVELOPMENT_GOALS) {
    setDevelopmentGoals((prevGoals) => [
      ...prevGoals,
      { training: "", goal: "", description: "", empCode: empCode },
    ]);
  }
  // const handleAddDevelopmentGoal = () => {
  //   // debugger
  //   const MAX_DEVELOPMENT_GOALS = 10;
  //   if (developmentGoals.length < MAX_DEVELOPMENT_GOALS) {
  //     setDevelopmentGoals(prevGoals => [
  //       ...prevGoals,
  //       { training: "", goal: "", description: "", empCode: empCode }
  //     ]);
  //   } else {
  //     toast.warning(`You can only add up to ${MAX_DEVELOPMENT_GOALS} development goals.`);
  //   }
  // };
  // const handleClick = () => {
  //   console.log('Button clicked!');
  // }

  // //Delete
  // const confirmDelete = (index, dgDraftId) => {
  //   Swal.fire({ title: 'Are you sure?', text: "Do you really want to delete the data?", icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, cancel!' })
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         handleDeleteDevelopmentGoal(index, dgDraftId);
  //       }
  //     });
  // };

  // const confirmKraDelete = (i, goalDraftId) => {
  //   Swal.fire({ title: 'Are you sure?', text: "Do you really want to delete the data?", icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, cancel!' })
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         handleDeleteKragoal(i, goalDraftId);
  //       }
  //     });
  // };

  // const handleDeleteKragoal = (i, id) => {
  //   const newKragoals = [...kragoals];
  //   newKragoals.splice(i, 1);
  //   setKragoals(newKragoals);
  //   Service.deleteEmployeeKraOrDraft(id)
  //     .then((response) => {
  //       console.log('Successfully deleted data:', response.data);
  //     })
  //     .catch((error) => {
  //       toast.warn("Employee Goals Not Found8");
  //       //console.error('Error deleting development goal:', error);
  //     });
  // };
  const handleDeleteDevelopmentGoal = (i, id) => {
    const newDevelopmentGoals = [...developmentGoals];
    newDevelopmentGoals.splice(i, 1);
    setDevelopmentGoals(newDevelopmentGoals);
    Service.deleteDevelopmentGoal(id)
      .then((response) => {
        console.log("Successfully deleted development goal:", response.data);
      })
      .catch((error) => {
        // toast.warn("Employee Goals Not Found9");
        // console.error('Error deleting development goal:', error);
      });
  };
  console.log(kragoals, "kragoalskragoals");

  console.log(trainingOptions, "trainingOptions@@@@@@@@@@@122");
  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem("role")) || [];
  } catch (e) {
    // toast.warn("Employee Goals Not Found 10");
    //console.error('Error parsing roles from sessionStorage:', e);
  }

  // Function to check if the user has a specific role
  const hasRole = (role) => roles.includes(role);

  return (
    <div className="">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-full">
        <div className="bg-white-300 mt-5">
          <div style={{ backgroundColor: "#DCDCDC", padding: "10px" }}>
            <Card sx={{ borderRadius: "20px" }}>
              <CardContent>
                <div className=" flex">
                  <div>
                    <h1 className=" font-bold  ml-5  mt-5  text-md  text-lg">
                      Quarter {empPerformance?.appraisalQuarter}
                    </h1>
                    <h2 className=" ml-5  mt-5   text-gray-500  text-md">
                      {empPerformance?.periodFrom} {empPerformance?.periodTo}
                    </h2>
                  </div>
                </div>
                {/* <div className=" text-lg  ml-5  p-2  border-b-[1px]  font-bold  text-md">
            <span className="  text-blue-500  underline  decoration-blue  underline-offset-8  decoration-4">
              Goal Setting
            </span>
            <span className=" px-6  text-gray-400">Self Appraisal</span>
            <span className="  text-gray-400">Manager Review</span>
          </div> */}

                <div className=" flex  border-b-[1px]  mt-6 text-md  text-gray-800  font-semibold">
                  <div className="KRA  ml-8"> Object Area/KRA </div>
                  <div className="Target/Goals  ml-32 "> Goals/Objective</div>
                  <div className="Measurment critiria  ml-44 ">
                    {" "}
                    Measurment Critiria{" "}
                  </div>
                  <div className=" ml-20">Weightage(Total Should be 100%) </div>
                </div>

                <form className=" break-words">
                  {kragoals?.map((kragoal, index) => (
                    <div
                      key={index}
                      className="whitespace-normal break-words"
                      style={{ display: "flex", marginBottom: "10px" }}
                    >
                      <textarea
                        type="text"
                        placeholder="kra"
                        name="kra"
                        value={kragoal?.kra || ""}
                        onChange={() => {}}
                        className="mt-7 ml-4 break-all whitespace-normal cursor-not-allowed"
                        style={{
                          height: "100px",
                          marginRight: "3px",
                          border: "solid 1px #ccc",
                          borderWidth: "thin",
                          overflowWrap: "break-word",
                        }}
                      />
                      <br />
                      <textarea
                        type="text"
                        placeholder="goals"
                        name="goals"
                        value={kragoal?.goals || ""}
                        onChange={() => {}}
                        className="w-72 mt-7 ml-1 text-left whitespace-normal cursor-not-allowed"
                        style={{
                          marginRight: "50px",
                          textIndent: "10px",
                          border: "solid 1px #ccc",
                          borderWidth: "thin",
                        }}
                      />

                      <div className=" flex  items-center">
                        {/* <select
                    value={kragoal?.target || ""}
                    onChange={() => {}}
                    className="mt-8 h-8 w-12 border border-solid border-gray-300 cursor-not-allowed"
                  >
                    <option value="<">{"<"}</option>
                    <option value="<=">{"<="}</option>
                    <option value="=">{"="}</option>
                    <option value=">">{">"}</option>
                    <option value=">=">{">="}</option>
                  </select> */}

                        <select
                          value={
                            targetOption.find(
                              (option) =>
                                option.targetOperatorId === kragoal?.target
                            )?.targetOperator || ""
                          }
                          disabled={
                            empPerformance?.currentStatus ===
                            "Submitted To Manager"
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
                            // handleSaveAsDraftOnChange();
                          }}
                          className="mt-8 h-8 w-12 border border-solid border-gray-300"
                        >
                          {targets.map((target, idx) => (
                            <option key={idx} value={target}>
                              {target}
                            </option>
                          ))}
                        </select>
                      </div>

                      <textarea
                        type="text"
                        placeholder="Measurement"
                        name="measurement"
                        value={kragoal?.measurement || ""}
                        onChange={() => {}}
                        className="ml-2 mt-16 w-20 h-8 text-left whitespace-normal border border-solid border-gray-300 p-2 cursor-not-allowed"
                        style={{ textIndent: "10px" }}
                      />

                      <textarea
                        type="text"
                        placeholder="weightage"
                        name="weightage"
                        value={kragoal?.weightage || ""}
                        onChange={() => {}}
                        className="mt-16 ml-20 w-32 h-8 break-all cursor-not-allowed "
                        style={{
                          border: "2px solid #ccc",
                          borderWidth: "thin",
                        }}
                      />

                      <h3 className="ml-2 scale-110 mt-16 text-blue-400 cursor-not-allowed">
                        %
                      </h3>
                      <button
                        type="button"
                        title="Delete"
                        className="ml-28 mt-6 scale-150 text-red-500 "
                      >
                        {" "}
                        <RiDeleteBin5Fill />
                      </button>
                    </div>
                  ))}

                  <button
                    style={{ marginLeft: "28%" }}
                    className=" flex  items-center  font-bold  text-blue-400  text-md"
                  >
                    {" "}
                    <GrAddCircle /> Add More{" "}
                  </button>
                  <div className=" flex  flex-row  border-b-2">
                    <button
                      type="submit"
                      style={{ marginLeft: "42%" }}
                      className="  flex  ml-96  mt-7  text-black  text-md cursor-not-allowed"
                    >
                      Total out Of 100%{" "}
                    </button>

                    <textarea
                      type="text"
                      placeholder="100"
                      value={"100"}
                      className="ml-2 my-7 text-black text-md"
                      style={{
                        border: "solid 1px #ccc",
                        borderWidth: "thin",
                        marginLeft: "70px",
                        width: "130px",
                        height: "35px",
                      }}
                      onChange={() => {}}
                    />
                    <h3 className=" ml-2   p-2  scale-110  mt-7   text-blue-400 cursor-not-allowed ">
                      %
                    </h3>
                  </div>

                  {/* Development Goals */}
                  <div className="">
                    <div className=" font-bold  ml-5  mt-5  text-md  text-lg">
                      Development Goals
                    </div>
                    <div className=" flex mt-6  text-md  text-gray-800 font-semibold">
                      <div className="  ml-8"> Trainings </div>
                      <div className="  ml-64 "> Development Goals</div>
                      <div className="  ml-44 "> self Assesment </div>
                      <div className=" ml-52">Manager assesment </div>
                    </div>
                    {/* {developmentGoals.map((goal, index) => (
                <div
                  key={index}
                  className="whitespace-normal break-words"
                  style={{ display: "flex", marginBottom: "10px" }}
                >
                  <select
                    value={trainingOptions?.trainingName || ""}
                    onChange={(e) => {}}
                    className="h-16 w-72 px-1 py-4 mt-3 ml-2 border rounded cursor-not-allowed"
                  >
                    {trainingOptions.length === 0 && store.length > 0
                      ? store.map((item, idx) => (
                          <option
                            key={"fetched-training-${idx}"}
                            value={item?.trainingName}
                          >
                            {item?.trainingName}
                          </option>
                        ))
                      : trainingOptions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}

                    {trainingOptions.length !== 0
                      ? trainingOptions.map((item, idx) => (
                          <option
                            key={"fetched-training-${idx}"}
                            value={item?.trainingName}
                          >
                            {item?.trainingName}
                          </option>
                        ))
                      : trainingOptions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                  </select>

                  <select
                    value={goal.goal}
                    onChange={(e) => {
                      const newGoals = [...store];
                      newGoals[index].goal = e.target.value;
                      setSelectedGoal(newGoals);
                    }}
                    className={`h-16 w-72 px-1 py-4 mt-3 ml-4 border rounded cursor-not-allowed`}
                  >
                    {developmentGoalOptions[goal.training]?.map(
                      (goalOption, goalIndex) => (
                        <option key={goalIndex} value={goalOption}>
                          {goalOption}
                        </option>
                      )
                    )}

                    {store.map((item, idx) => (
                      <option key={"fetched-goal-${idx}"} value={item.goal}>
                        {item.goal}
                      </option>
                    ))}
                  </select> */}
                    {developmentGoals?.map((goal, index) => (
                      <div
                        key={index}
                        className="whitespace-normal break-words"
                        style={{ display: "flex", marginBottom: "10px" }}
                      >
                        <select
                          disabled={
                            empPerformance?.currentStatus ===
                            "Submitted To Manager"
                          }
                          value={goal.training || "--SELECT--"}
                          onChange={(e) => {
                            const selectedOptionId =
                              e.target.selectedOptions[0].dataset.optionid; // Fetch trainingOptionId
                            const newGoals = [...developmentGoals];
                            newGoals[index].training = e.target.value; // Save training name
                            newGoals[index].trainingOptionId = selectedOptionId; // Save trainingOptionId
                            newGoals[index].goal = "";
                            setDevelopmentGoals(newGoals);
                            setSelectedTraining(e.target.value);
                            mapDevelopmentOption(e.target.value);
                          }}
                          className="h-16 w-72 px-1 py-4 mt-3 ml-2 border rounded"
                        >
                          <option value="--SELECT--">--SELECT--</option>
                          {trainingDropdown.length === 0 && store.length > 0
                            ? store.map((item, idx) => (
                                <option
                                  key={`fetched-training-${idx}`}
                                  value={item.training}
                                  data-optionid={item.trainingOptionId} // Attach trainingOptionId
                                >
                                  {item.training}
                                </option>
                              ))
                            : trainingOptions.map((option, index) => (
                                <option
                                  key={`training-option-${index}`}
                                  value={option.trainingName}
                                  data-optionid={option.trainingOptionId} // Attach trainingOptionId
                                >
                                  {option.trainingName}
                                </option>
                              ))}
                        </select>
                        <select
                          disabled={
                            empPerformance?.currentStatus ===
                            "Submitted To Manager"
                          }
                          value={`${developmentGoals[index].developmentSubId} - ${developmentGoals[index].goal}`} // Ensure the value matches the option's format
                          onChange={(e) => {
                            const selectedValue = e.target.value; // Full value, e.g., "1 - fvgbhnm"
                            const [id, name] = selectedValue.split(" - "); // Split into ID and name
                            const newGoals = [...developmentGoals];
                            newGoals[index] = {
                              ...newGoals[index],
                              goal: name.trim(), // Save only the name (e.g., fvgbhnm) to the state
                              developmentSubId: id.trim(), // Save the ID to the state
                            };
                            console.log("Updated Goals:", newGoals); // Debugging log
                            setDevelopmentGoals(newGoals); // Update state
                          }}
                          className="h-16 w-72 px-1 py-4 mt-3 ml-4 border rounded"
                        >
                          {Array.isArray(developmentDropdown) &&
                          developmentDropdown.length > 0
                            ? developmentDropdown.map(
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
                            : developmentGoals.map((item, idx) => (
                                <option
                                  key={`fetched-training-${idx}`}
                                  value={`${item.developmentSubId} - ${item.goal}`}
                                >
                                  {item.goal}
                                </option>
                              ))}
                        </select>

                        <textarea
                          placeholder="Self-assessment"
                          className="w-72 h-16 py-1 px-3 mt-3 ml-4 border rounded border-gray-300 cursor-not-allowed"
                          value={goal.selfAssessment || "NA"}
                          readOnly
                          onChange={() => {}}
                        ></textarea>
                        <textarea
                          placeholder="Manager assessment"
                          className="w-72 py-1 h-16 mt-3 px-3 ml-4 border rounded border-gray-300 cursor-not-allowed"
                          value={goal.managerAssessment || "NA"}
                          readOnly
                          onChange={() => {}}
                        ></textarea>

                        <button
                          type="button"
                          title="Delete"
                          className="ml-4 scale-150 text-red-500"
                          style={{ marginTop: "-120px" }}
                        >
                          <RiDeleteBin5Fill />
                        </button>

                        <div className="mt-20 -ml-[945px]">
                          <label className=" flex text-md ml-8 mt-8 text-gray-800  font-semibold ">
                            Description{" "}
                          </label>
                          <textarea
                            placeholder=""
                            className="w-72 py-1 px-3 mt-4 h-16 ml-4 border rounded border-gray-300"
                            value={
                              goal.description ||
                              (store[index]
                                ? store[index].description || ""
                                : "")
                            }
                            readOnly
                            onChange={() => {}}
                          ></textarea>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      style={{ marginLeft: "38%" }}
                      className="flex items-center font-bold text-blue-400 text-md"
                    >
                      <GrAddCircle /> Add More
                    </button>
                  </div>
                </form>

                <div className="mb-64" style={{ marginTop: "-150px" }}>
                  <button
                    style={{ marginLeft: "60%" }}
                    className="mt-32 ml-96 py-2 px-7  bg-green-400 text-white "
                    onClick={() => {
                      handleApprove();
                      handleViewData();
                    }}
                  >
                    Approve
                  </button>
                  <button
                    style={{ marginLeft: "1%" }}
                    className="mt-7 ml-2 py-2 px-5 font-bold bg-blue-400 text-white  "
                    onClick={() => {
                      setIsManagerRivertCommentOpen(true);
                      // handleReverted();
                    }}
                  >
                    Revert Back
                  </button>
                  <button
                    style={{ marginLeft: "1%" }}
                    className="mt-32 ml-2 py-2 px-7 font-bold bg-gray-300 text-white "
                  >
                    Cancel
                  </button>
                </div>

                {isManagerRivertCommentOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white rounded-lg border border-gray-300">
                      <h2 className="text-2xl font-bold mb-4 mt-4 text-center">
                        comment
                      </h2>
                      <div className="text-center">
                        <textarea
                          type="text"
                          placeholder=""
                          value={rivertcomment}
                          onChange={(e) => setRivertcomment(e.target.value)}
                          className="border p-3 mb-3 w-96 rounded"
                          style={{ minHeight: "150px" }}
                        />
                      </div>
                      <div className="flex justify-between p-4">
                        <div className="w-[500px] text-center">
                          <button
                            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                            onClick={handleManagerRivertCommentSubmit}
                          >
                            Submit
                          </button>

                          <button
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <ToastContainer />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManagerView;
