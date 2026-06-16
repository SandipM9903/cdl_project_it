import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import videoData from "./data/videoData";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import CertificateGenerator from "./CertificateGenerator";

const TrainingModules = () => {
  const empCode = localStorage.getItem("empId");
  const [modules, setModules] = useState([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [assignmentEnabled, setAssignmentEnabled] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitTriggered, setSubmitTriggered] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizResult, setQuizResult] = useState("");
  const empName = sessionStorage.getItem("empName") || "John Doe";

  // New state variables for quiz score and retry logic
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestionsInQuiz, setTotalQuestionsInQuiz] = useState(0);
  const [showRetryQuizOption, setShowRetryQuizOption] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const totalModules = videoData.length;
        const progressRes = await axios.get(
          `http://localhost:9038/api/training/progress/${empCode}`
        );
        const lastIndexFromBackend = progressRes.data || 0;

        const modulesWithFullURL = videoData.map((module) => ({
          ...module,
          videoUrl: module.videoUrl,
        }));

        const isAllModulesCompleted = lastIndexFromBackend >= totalModules;
        const currentIndex = isAllModulesCompleted
          ? totalModules - 1
          : lastIndexFromBackend;

        setModules(modulesWithFullURL);
        setCurrentModuleIndex(currentIndex);

        setCompletedModules(
          Array.from({ length: lastIndexFromBackend }, (_, i) => i)
        );

        if (isAllModulesCompleted) {
          setAssignmentEnabled(true);
          setActiveTab("assignment");
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [empCode]);

  const handleVideoComplete = () => {
    setVideoCompleted(true);
  };

  const handleNext = async () => {
    const isLastModule = currentModuleIndex === modules.length - 1;
    if (!completedModules.includes(currentModuleIndex)) {
      try {
        await axios.post(
          `http://localhost:9038/api/training/progress/${empCode}?moduleIndex=${
            currentModuleIndex + 1
          }`
        );
        setCompletedModules((prev) => [...prev, currentModuleIndex]);
      } catch (err) {
        console.error("Failed to update progress", err);
      }
    }

    if (isLastModule) {
      setAssignmentEnabled(true);
      setActiveTab("assignment");
    } else {
      const nextIndex = currentModuleIndex + 1;
      setCurrentModuleIndex(nextIndex);
      setVideoCompleted(completedModules.includes(nextIndex));
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentModuleIndex > 0) {
      const prevIndex = currentModuleIndex - 1;
      setCurrentModuleIndex(prevIndex);
      setVideoCompleted(completedModules.includes(prevIndex));
      setProgress(0);
    }
  };

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const scoreRes = await axios.get(
          `http://localhost:9038/api/training/quizScore/${empCode}`
        );
        const { message, score, total } = scoreRes.data;
        if (score !== null && total !== null) {
          setQuizResult(`${message} Scored : ${score}/${total}`);
          setQuizScore(score);
          setTotalQuestionsInQuiz(total);
          setAssignmentEnabled(true);

          // Apply re-quiz logic (score < 27)
          if (score < 27) {
            setShowRetryQuizOption(true);
          } else {
            setShowRetryQuizOption(false);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz result:", error);
      }
    };

    fetchQuizResult();
  }, [empCode]);

  useEffect(() => {
    if (activeTab === "assignment" && !quizResult) {
      fetch("http://localhost:9038/questions")
        .then((res) => res.json())
        .then((data) => {
          setQuestions(data);
          setTotalQuestionsInQuiz(data.length);
        })
        .catch((err) => console.error("Error fetching questions:", err));
    }
  }, [activeTab, quizResult]);

  useEffect(() => {
    if (!submitTriggered) return;

    const submitQuiz = async () => {
      const formattedPayload = Object.entries(selectedOptions).map(
        ([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer,
        })
      );

      try {
        await axios.post(
          `http://localhost:9038/api/training/submitQuiz/${empCode}`,
          formattedPayload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const scoreRes = await axios.get(
          `http://localhost:9038/api/training/quizScore/${empCode}`
        );
        const { message, score, total } = scoreRes.data;
        setQuizResult(`${message} Scored : ${score}/${total}`);
        setQuizScore(score);
        setTotalQuestionsInQuiz(total);

        // Re-quiz logic (score < 27 → retry required)
        if (score < 27) {
          setShowRetryQuizOption(true);
        } else {
          setShowRetryQuizOption(false);
        }
      } catch (error) {
        console.error("Error submitting quiz:", error);
        setQuizResult("Failed to submit quiz.");
        setShowRetryQuizOption(true);
      } finally {
        setSubmitTriggered(false);
      }
    };

    submitQuiz();
  }, [submitTriggered, selectedOptions, empCode]);

  const handleRetryQuiz = () => {
    setQuizResult("");
    setQuizScore(0);
    setTotalQuestionsInQuiz(questions.length);
    setSelectedOptions({});
    setCurrentQuestionIndex(0);
    setShowRetryQuizOption(false);
  };

  const currentVideo = modules[currentModuleIndex];

  return (
    <div className="p-6 md:px-10 md:py-0">
      <Header />
      <div className="text-gray-600 text-sm mb-4 mt-24 font-content">
        <Link
          to="/Dashboard"
          className="text-black hover:underline font-content"
        >
          Home
        </Link>{" "}
        / <span className="text-black font-semibold font-content">Induction</span>
      </div>

      <h1 className="text-2xl font-semibold mb-6 font-header">Induction</h1>

      <div className="flex">
        {/* Sidebar */}
        <div
          className="relative text-white py-14 px-4 transition-all duration-300 ease-in-out"
          style={{
            width: "380px",
            height: "730px",
            backgroundColor: "#DC3545",
            borderTopRightRadius: "38px",
            borderBottomRightRadius: "38px",
            overflowY: showMore ? "scroll" : "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            className="pl-6 pr-6"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {modules.map((module, index) => {
              if (!showMore && index >= 6) return null;

              return (
                <div
                  key={index}
                  className="mb-7 flex items-start justify-between"
                >
                  <div className="text-right text-white">
                    <div
                      className={`font-raleway font-bold text-base leading-[18px] tracking-normal ${
                        index === currentModuleIndex ? "underline" : ""
                      } font-header`}
                    >
                      {module.title}
                    </div>
                    <p className="text-xs leading-tight mt-1 font-raleway font-content">
                      {module.description}
                    </p>
                  </div>

                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-md font-bold shadow-md mt-1 ml-6 z-40 ${
                      completedModules.includes(index)
                        ? "bg-green-100 text-green-600"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {completedModules.includes(index) ? <FaCheck /> : index + 1}
                  </div>
                </div>
              );
            })}

            {!showMore && videoData.length > 6 && (
              <div className="text-center mt-4 cursor-pointer">
                <div
                  className="inline-block p-2 rounded-full bg-white text-red-500 shadow-md"
                  onClick={() => setShowMore(true)}
                >
                  <FaChevronDown />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Section */}
        <div
          className="flex-1 bg-white shadow-xl px-16 pt-8 pb-4 relative z-10"
          style={{
            marginLeft: "-58px",
            marginTop: "36px",
            height: "550px",
          }}
        >
          <div className="flex space-x-6 pb-2 mb-4 font-semibold text-gray-700">
            <span
              className={`pb-1 cursor-pointer ${
                activeTab === "video" ? "border-b-2 border-black" : ""
              } font-header`}
              onClick={() => setActiveTab("video")}
            >
              Video
            </span>

            <span
              className={`pb-1 ${
                assignmentEnabled
                  ? "cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              } ${activeTab === "assignment" ? "border-b-2 border-black" : ""} font-header`}
              onClick={() => {
                if (assignmentEnabled) setActiveTab("assignment");
              }}
            >
              Assignment
            </span>
          </div>

          {activeTab === "video" && currentVideo && (
            <VideoPlayer
              key={currentModuleIndex}
              videoUrl={currentVideo.videoUrl}
              onComplete={handleVideoComplete}
              isActive={true}
              onProgress={setProgress}
            />
          )}

          {activeTab === "assignment" && questions.length > 0 && (
            <div className="px-6 mt-4 overflow-y-auto max-h-[420px] font-content">
              <h2 className="text-xl font-bold mb-6 text-center font-header">
                📝 Induction and Orientation Program Quiz Questions
              </h2>

              {quizResult ? (
                <div className="text-center">
                  <p className="text-center text-green-700 text-lg font-semibold font-header">
                    {quizResult}
                  </p>

                  {/* Certificate or Retry depending on score */}
                  {quizScore >= 27 ? (
                    <CertificateGenerator />
                  ) : (
                    showRetryQuizOption && (
                      <button
                        onClick={handleRetryQuiz}
                        className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        Retry Quiz
                      </button>
                    )
                  )}
                </div>
              ) : (
                <>
                  <div
                    key={questions[currentQuestionIndex].questionId}
                    className="mb-6"
                  >
                    <p className="font-semibold text-base mb-2 font-header">
                      {currentQuestionIndex + 1}){" "}
                      {questions[currentQuestionIndex].question}
                    </p>

                    {questions[currentQuestionIndex].options &&
                      Object.entries(
                        questions[currentQuestionIndex].options
                      ).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center mb-1 ml-4 font-content"
                        >
                          <input
                            type="checkbox"
                            name={`question-${questions[currentQuestionIndex].questionId}`}
                            value={key}
                            className="mr-2"
                            checked={
                              selectedOptions[
                                questions[currentQuestionIndex].questionId
                              ] === key
                            }
                            onChange={() =>
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [questions[currentQuestionIndex].questionId]:
                                  key,
                              }))
                            }
                          />
                          <span className="text-sm font-content">
                            {key}) {value}
                          </span>
                        </label>
                      ))}
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      className="border border-red-500 text-red-500 px-6 py-2 rounded-full disabled:opacity-50"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) => prev - 1)
                      }
                      disabled={currentQuestionIndex === 0}
                    >
                      Back
                    </button>

                    {currentQuestionIndex === questions.length - 1 ? (
                      <button
                        className="bg-green-600 text-white px-6 py-2 rounded-full"
                        onClick={() => setSubmitTriggered(true)}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 text-white px-6 py-2 rounded-full"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) => prev + 1)
                        }
                      >
                        Next
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "video" && (
            <div className="mt-6 flex items-center justify-between space-x-4">
              <div className="flex-1 flex items-center space-x-4">
                <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 font-content">
                  {progress}% watched
                </span>
              </div>

              <div className="flex-shrink-0 flex space-x-2">
                <button
                  className="border border-red-500 text-red-500 px-6 py-2 rounded-full"
                  onClick={handlePrev}
                  disabled={currentModuleIndex === 0}
                >
                  Prev
                </button>
                <button
                  className={`bg-red-500 text-white px-6 py-2 rounded-full ${
                    !videoCompleted ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleNext}
                  disabled={!videoCompleted}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingModules;
