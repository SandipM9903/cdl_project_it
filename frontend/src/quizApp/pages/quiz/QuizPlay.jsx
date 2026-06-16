import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserHeaderNav from "../../UserHeaderNav";
import * as _servQueBank from "./../../services/quizApp/questionBank";
import { createPlayQuiz, submitPlayQuiz } from "./../../services/quizApp/playQuiz";
import axios from "axios";
import { useLocation } from "react-router-dom";

const QuizPlay = (props) => {
  const [curQuiz, setCurQuiz] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [queIndex, setQueIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [data, setData] = useState({})
  const employeeCode = localStorage.getItem("encodedEmpCode") || 0;
  let decodedEmployeeCode = employeeCode !== 0 ? atob(employeeCode) : 0;
  console.log(employeeCode, "employeeCodeemployeeCode");
  const location = useLocation();
  const req = location.state?.curQuiz;
  const [id, setId] = useState();  

  useEffect(()=>{
    axios.get(`http://43.205.24.208:9020/employee/eCode/${decodedEmployeeCode}`)
    .then((res)=>{
      setData(res.data);
    }).catch((err)=>{
      console.log(err);
    })
  },[])
  // useEffect(() => {
  //   setCurQuiz(JSON.parse(localStorage.getItem("curQuiz")));
  //   fetchQuizQuestions(JSON.parse(localStorage.getItem("curQuiz")));
  // }, []);

  // const fetchQuizQuestions = async (input) => {
  //   console.log(input);
  //   try {
  //     let res = await _servQueBank.getQuizQuestionsList(input["id"]);
  //     if (res.data.success && res.data.success === true) {
  //       setQuizQuestions(res.data.data.questionDTO);
  //       toast.success("Successfully Fetched Quizzes Questions!");
  //     } else {
  //       toast.warn("Failed Feching Quizzes Questions!");
  //     }
  //   } catch (e) {
  //     toast.error("Error Fetching Quizzes Questions!");
  //   }
  // };

  const resetQuiz = () => {
  setCurrentQuestionIndex(0);
  setQueIndex(0);
  setSelectedOption(null);
  setCorrectAnswers(0);
  setWrongAnswers(0);
  setShowResult(false);

  debugger;

  if (req) {
    createPlayQuiz(req)
      .then((res) => {
        console.log("Play restarted successfully", res.data);
        setId(res?.data?.data?.id); // Safely store ID from response
      })
      .catch((err) => {
        console.error("Error restarting quiz", err);
      });
  } else {
    console.warn("No curQuiz data available to restart quiz.");
  }
};

  useEffect(() => {
    try {
      const storedQuiz = localStorage.getItem("curQuiz");
      console.log(storedQuiz,"storedQuizstoredQuiz")
  
      if (storedQuiz) {
        const parsedQuiz = JSON.parse(storedQuiz);
        console.log(parsedQuiz, "parsedQuiz")
        console.log(!parsedQuiz.__reactFiber$, "typeof parsedQuiz")
        // Ensure it's a plain object and not a React element or event
        if (parsedQuiz && typeof parsedQuiz === "object" && !parsedQuiz.__reactFiber$) {
          setCurQuiz(parsedQuiz);
  
          if (parsedQuiz.id) {
            fetchQuizQuestions(parsedQuiz);
          }
        } else {
          console.warn("Invalid quiz data detected in localStorage");
        }
      }
    } catch (error) {
      console.error("Error parsing curQuiz from localStorage:", error);
    }
  }, []);
  
  const fetchQuizQuestions = async (input) => {
    // Ensure input is a plain object
    if (!input || typeof input !== "object" || !input.id) {
      console.warn("Invalid quiz input received:", input);
      return;
    }
  
    console.log("Fetching questions for:", input);
    try {
      let res = await _servQueBank.getQuizQuestionsList(input.id);
      if (res?.data?.success) {
        setQuizQuestions(res.data.data.questionDTO);
        toast.success("Successfully Fetched Quiz Questions!");
      } else {
        toast.warn("Failed Fetching Quiz Questions!");
      }
    } catch (e) {
      console.error("API Error:", e);
      toast.error("Error Fetching Quiz Questions!");
    }
  };
  
  

  // const handleNextQuestion = () => {
  //   console.log(currentQuestionIndex);
  //   console.log(selectedOption);
  //   console.log(quizQuestions[currentQuestionIndex].optionCorrect);

  //   if (
  //     selectedOption[currentQuestionIndex] ===
  //     quizQuestions[currentQuestionIndex].optionCorrect
  //   ) {
  //     setCorrectAnswers((prev) => prev + 1);
  //   } else {
  //     setWrongAnswers((prev) => prev + 1);
  //   }

  //   if (currentQuestionIndex < quizQuestions.length - 1) {
  //     setCurrentQuestionIndex((prev) => prev + 1);
  //     setQueIndex((prev) => prev + 1);
  //     setSelectedOption(null);
  //   } else {
  //     setShowResult(true);
  //   }
  // };

  const handleNextQuestion = async () => {
    if (
      selectedOption[currentQuestionIndex] ===
      quizQuestions[currentQuestionIndex].optionCorrect
    ) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }
  

    if (currentQuestionIndex < quizQuestions.length - 1) {
      console.log("Enter into if")
      setCurrentQuestionIndex((prev) => prev + 1);
      setQueIndex((prev) => prev + 1);
      setSelectedOption({ ...selectedOption });
    } else {
      try {
        console.log("Enter into else", curQuiz);
        // const quizId = curQuiz?.generatedId?.data?.id || 2;
        const quizId = id !== undefined && id !== null ? id : curQuiz?.generatedId?.data?.id || 2;
        console.log(quizId, "quizId")
        const startTime = new Date().toISOString();
        const endTime = new Date().toISOString();
        console.log(quizId, "Enter into if")
        const payload = {
          playQuizId: quizId,
          noOfQueAnswered: quizQuestions.length,
          noOfQueCorrect: correctAnswers
            + (selectedOption[currentQuestionIndex] === quizQuestions[currentQuestionIndex].optionCorrect ? 1 : 0)
          ,
          noOfQueIncorrect: wrongAnswers
            + (selectedOption[currentQuestionIndex] !== quizQuestions[currentQuestionIndex].optionCorrect ? 1 : 0)
          ,
          startTime,
          endTime,
          durationMins: Math.floor((new Date(endTime) - new Date(startTime)) / 60000),
          response: Object.keys(selectedOption).map((index) => ({
            queId: quizQuestions[index].id,
            answer: selectedOption[index],
          })),
        };
  
        console.log("Submitting quiz with payload:", payload);
        await submitPlayQuiz(payload, quizId);
        console.log("Quiz submitted successfully");
  
        setShowResult(true);
      } catch (error) {
        console.error("Error submitting quiz:", error);
      }
    }
  };
  
  const handleOnOptionSelect = (index, option) => {
    const selOptions = { ...selectedOption };
    selOptions[index] = option;
    setSelectedOption(selOptions);
  };

  return (
    <>
      <UserHeaderNav />
      {!showResult || (currentQuestionIndex < quizQuestions.length - 1)? (
        <div className="container">
          <div className="flex items-center">
            <h5 className="text-gray-600 mt-4 ml-2 flex-grow">
              {curQuiz["quizName"]}
            </h5>
            <span className="text-gray-500 text-sm mt-6 mr-2">
              {curQuiz["cat"]} | {curQuiz["subCat"]}
            </span>
          </div>
          <div className="card mt-1">
            <div className="card-body">
              <h6 className="text-stone-500 text-right">
                Question {currentQuestionIndex + 1} / {quizQuestions.length}
              </h6>
              <h5 className="text-purple-500 ">
                {quizQuestions[queIndex]?.question}
              </h5>
              <div className="mt-4">
                <div key="option1" className="form-check mb-3">
                  <input
                    type="radio"
                    name={`${queIndex}_option1`}
                    id={`${queIndex}_option1`}
                    value={"option1"}
                    onChange={() => handleOnOptionSelect(queIndex, "option1")}
                    checked={
                      selectedOption && selectedOption[queIndex] === "option1"
                    }
                    className="form-check-input"
                  />
                  <label
                    htmlFor={`${queIndex}_option1`}
                    className="form-check-label"
                  >
                    {quizQuestions[queIndex]?.option1}
                  </label>
                </div>
                <div key="option2" className="form-check mb-3">
                  <input
                    type="radio"
                    name={`${queIndex}_option`}
                    id={`${queIndex}_option2`}
                    value={"option2"}
                    onChange={() => handleOnOptionSelect(queIndex, "option2")}
                    checked={
                      selectedOption && selectedOption[queIndex] === "option2"
                    }
                    className="form-check-input"
                  />
                  <label
                    htmlFor={`${queIndex}_option2`}
                    className="form-check-label"
                  >
                    {quizQuestions[queIndex]?.option2}
                  </label>
                </div>
                <div key="option3" className="form-check mb-3">
                  <input
                    type="radio"
                    name={`${queIndex}_option`}
                    id={`${queIndex}_option3`}
                    value={"option3"}
                    onChange={() => handleOnOptionSelect(queIndex, "option3")}
                    checked={
                      selectedOption && selectedOption[queIndex] === "option3"
                    }
                    className="form-check-input"
                  />
                  <label
                    htmlFor={`${queIndex}_option3`}
                    className="form-check-label"
                  >
                    {quizQuestions[queIndex]?.option3}
                  </label>
                </div>
                <div key="option4" className="form-check mb-3">
                  <input
                    type="radio"
                    name={`${queIndex}_option`}
                    id={`${queIndex}_option4`}
                    value={"option4"}
                    onChange={() => handleOnOptionSelect(queIndex, "option4")}
                    checked={
                      selectedOption && selectedOption[queIndex] === "option4"
                    }
                    className="form-check-input"
                  />
                  <label
                    htmlFor={`${queIndex}_option4`}
                    className="form-check-label"
                  >
                    {quizQuestions[queIndex]?.option4}
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-right">
            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={!(selectedOption && selectedOption[queIndex])}
                className="btn btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={!(selectedOption && selectedOption[queIndex])}
                className="btn btn-success"
              >
                Submit
              </button>
            )}
          </div>

          <p></p>
        </div>
      ) : (
        <div className="container ">
          <div
            className="card mt-0"
            style={{
              backgroundImage: `url('https://i.gifer.com/6k2.gif')`,
              backgroundSize: "",
              backgroundPosition: "center",
            }}
          >
            <div className="card-body">
              <div className="row">
                <h4 className="text-purple-700 text-center">{data?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || decodedEmployeeCode}</h4>
                <h3 className="text-blue-600 text-center">Quiz Result</h3>
                <div>
                  <div className="grid grid-cols-1 gap-4 px-4 mt-8 mb-8 sm:grid-cols-2 sm:px-8">
                    <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
                      <div className="p-4 bg-green-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                          ></path>
                        </svg>
                      </div>
                      <div className="px-4 text-gray-700">
                        <h3 className="text-sm tracking-wider">
                          Correct Answers
                        </h3>
                        <p className="text-3xl">{correctAnswers}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
                      <div className="p-4 bg-red-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                          ></path>
                        </svg>
                      </div>
                      <div className="px-4 text-gray-700">
                        <h3 className="text-sm tracking-wider">
                          Wrong Answers
                        </h3>
                        <p className="text-3xl">{wrongAnswers}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-24 bg-white border rounded-sm overflow-hidden shadow">
                      <div className="p-4 bg-blue-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="px-4 text-gray-700">
                        <h3 className="text-sm tracking-wider">
                          Total Questions
                        </h3>
                        <p className="text-3xl">{quizQuestions.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-24  bg-white border rounded-sm overflow-hidden shadow">
                      <div className="p-4 bg-indigo-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                          ></path>
                        </svg>
                      </div>
                      <div className="px-4 text-gray-700">
                        <h3 className="text-sm tracking-wider">Score</h3>
                        <p className="text-3xl">
                          {(
                            (correctAnswers / quizQuestions.length) *
                            100
                          ).toFixed(2)}{" "}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 text-right">
            <button
              onClick={resetQuiz}
              className="btn btn-default btn-sm  text-sm"
            >
              Restart Quiz
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default QuizPlay;

