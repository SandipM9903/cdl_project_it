import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { _difficulty, _questionType } from "../../configs/constants";

import * as _servCat from "./../../services/quizApp/masterCategory";
import * as _servTopic from "./../../services/quizApp/masterSubCategory";
import * as _servQueBank from "./../../services/quizApp/questionBank";
import * as _servQuiz from "./../../services/quizApp/quiz";

const QuizGenerator = ({ visible, onClose, curAction, curQuiz }) => {
  const [category, setCategory] = useState([]);
  const [topics, setTopic] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [defaultQuizLastDate, setDefaultQuizLastDate] = useState(
    new Date("2024-04-28")
  );
  console.log("setQuestions", questions);

  const [quiz, setQuiz] = useState([]);
  const [error, setError] = useState("");
  const [showCards, setShowCards] = useState(false);

  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // ==========QuizAPI======================= //Start
  const fetchCategory = async () => {
    try {
      let res = await _servCat.getMasterCatAll();
      if (res.data.success && res.data.success === true) {
        setCategory(res.data.data);
        // toast.success("Successfully Fetched Category!");
      } else {
        toast.warn("Failed Feching Category!");
      }
    } catch (e) {
      toast.error("Error Fetching Category!");
    }
  };

  const fetchTopic = async (id) => {
    try {
      let res = await _servTopic.getMasterSubCatByCat(id);
      if (res.data.success && res.data.success === true) {
        setTopic(res.data.data);
        toast.success("Successfully Fetched Topic!");
      } else {
        toast.warn("Failed Feching Topic!");
      }
    } catch (e) {
      toast.error("Error Fetching Topic!");
    }
  };

  const fetchQuestion = async (input) => {
    try {
      setQuestions([]);
      let res = await _servQueBank.getQuestionBankList(input, 1);
      if (res.data.success && res.data.success === true) {
        setQuestions(res.data.data);
        toast.success("Successfully Fetched Questions!");
      } else {
        toast.warn("Failed Feching Questions!");
      }
    } catch (e) {
      toast.error("Error Fetching Questions!");
    }
  };

  const addQuiz = async (input) => {
    try {
      let res = await _servQuiz.createQuiz(input);
      if (res.data.success && res.data.success === true) {
        // setQuizs(res.data.data);
        toast.success("Successfully Quiz Added ");
        reset();
      } else {
        toast.warn("Failed Adding Quizs");
      }
    } catch (e) {
      console.log(e.message);
      toast.error("Error Adding Quizs!");
    }
  };
  

  const saveQuiz = async (input) => {
    try {
      // Add the selected questions' count to input
      input.noOfQues = selectedQuestions.length;  // Set noOfQues based on selected questions
      input.id = curQuiz.id; // Ensure quiz ID is included

      // Ensure queId is an array of integers
      input.queId = selectedQuestions;  // This should already be an array of integers

      let res = await _servQuiz.editQuiz(input);

      if (res.data.success) {
        toast.success("Successfully Quiz Saved ");
        reset(); // Make sure reset() is defined
      } else {
        toast.warn("Failed Saving Quiz");
      }
    } catch (e) {
      toast.error("Error Saving Quiz!");
    }
  };





  const delQuiz = async (input) => {
    try {
      let res = await _servQuiz.deleteQuiz(input.id);
      if (res.data.success && res.data.success === true) {
        // setQuizs(res.data.data);
        toast.success("Successfully Quiz Deleted ");
        reset();
      } else {
        toast.warn("Failed Deleting Quiz");
      }
    } catch (e) {
      toast.error("Error Deleting Quiz!");
    }
  };

  // ==========QuizAPI======================= //End

  const handleOnChangeCategory = (e) => {
    fetchTopic(e.target.value);
  };

  
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // This function will be called when a checkbox is clicked
  const handleOnQueSelect = (question) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(question.id)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== question.id);
      } else {
        // Otherwise, add it to the selected questions
        return [...prevSelected, question.id];
      }
    });
  };



  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm();

  const selectedIsQuizTime = watch("isDuration");

  const onSubmit = (data, event) => {
    const buttonId = event.nativeEvent.submitter.id;
    
    if (buttonId === "btnLoadQues") {
      fetchQuestion(data);
    }

    if (buttonId === "btnAddQuiz") {
      switch (curAction) {
        case "":
          addQuiz(data);
          break;
        case "edit":
          saveQuiz(data);
          console.log(saveQuiz, "saveQuiz");
          break;
        case "del":
          delQuiz(data);
          break;
      }
      onClose();
    }
    console.log(JSON.stringify(data));
    console.log(buttonId);
  };

  if (!visible) return null;
  return (
    <div
      id="container"
      onClick={handleOnClose}
      tabindex="-1"
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed bg-black bg-opacity-25 backdrop-blur-sm   justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-full max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900">
              Quiz Generator
            </h3>
            <button
              onClick={() => onClose()}
              type="button"
              className="text-gray-400 bg-transparent hover:text-gray-800 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center"
              data-modal-toggle="crypto-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}

          {/* <HeaderNav usernameOrEmail={usernameOrEmail} /> */}
          <div className="container">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full  mt-3 ">
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="catId"
                      name="catId"
                      {...register("catId")}
                      onChange={(e) => handleOnChangeCategory(e)}
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Select</option>
                      {category.map((r) => (
                        <option value={r.id} key={"cat_" + r.id}>
                          {r.cat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="topic"
                  >
                    Topic
                  </label>
                  <div className="relative">
                    <select
                      id="subCatId"
                      name="subCatId"
                      {...register("subCatId")}
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Select</option>
                      {topics.map((r) => (
                        <option value={r.id} key={"topic_" + r.id}>
                          {r.subCat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="difficulty"
                  >
                    Difficulty
                  </label>
                  <div className="relative">
                    <select
                      id="difficulty"
                      name="difficulty"
                      {...register("difficulty")}
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Select</option>
                      {_difficulty.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="queType"
                  >
                    Question Type
                  </label>
                  <div className="relative">
                    <select
                      id="queType"
                      name="queType"
                      {...register("queType")}
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Select</option>
                      {_questionType.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full  md:w-1/6   px-3 mt-1 ">
                  <button
                    id="btnLoadQues"
                    className="bg-purple-400 hover:bg-purple-500 text-purple-900 font-bold py-2 px-3  mt-3  rounded inline-flex items-center"
                  >
                    <svg
                      className="fill-current w-4 h-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <span>Show</span>
                  </button>
                </div>

                <div className="w-full     px-3 mt-1 ">
                  {questions.length === 0 && (
                    <div className="py-4 ">
                      <h6 className="px-2  text-purple-600 mb-0 ">
                        Load Questions by Clicking Show Button
                      </h6>
                      <blockquote className="px-4 py-24 mt-0 my-4 border-s-4 border-purple-300 bg-purple-50 dark:border-purple-500 dark:bg-purple-800">
                        <p className="text-xl italic font-medium leading-relaxed text-purple-400 dark:text-white">
                          "Select the required Category, Topic, Difficult &
                          Question Type in above filter & click Show button to
                          load relative Questions"
                        </p>
                      </blockquote>
                    </div>
                  )}

                  
                  {questions.length !== 0 && (
                    <table className="mt-5 w-full table-auto shadow-md rounded mb-4">
                      <thead>
                        <tr className="p-4 border-t border-b border-blue-gray-100">
                          <th className="py-3 pl-3"></th>
                          <th>#</th>
                          <th>Question</th>
                          <th>Type</th>
                          <th>Difficulty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.map((r, queIndex) => (
                          <tr className="p-4 border-b border-blue-gray-50" key={"que_" + r.id}>
                            <td className="py-3 pl-3">
                              <input
                                type="checkbox"
                                name={`${queIndex}_option`}
                                id={`${queIndex}_option3`}
                                value={r["id"]}
                                onChange={() => handleOnQueSelect(r)}
                                className="form-check-input"
                                {...register("queId")}
                              //checked={selectedQuestions.includes(r.id)}  // Ensure checkbox reflects state
                              />
                            </td>
                            <td>{r.id}</td>
                            <td>{r.question}</td>
                            <td>{r.queType}</td>
                            <td>{r.difficulty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="w-full  md:w-1/2   px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="quizName"
                  >
                    Quiz Name
                  </label>
                  <input
                    id="quizName"
                    name="quizName"
                    {...register("quizName")}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    placeholder=""
                  />
                </div>

                <div className="w-full  md:w-1/5   px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="quizLastDate"
                  >
                    Quiz Last Date
                  </label>
                  {/* <input id="quizName" name="quizName"  {...register('quizName')}  
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="" /> */}
                  <Controller
                    control={control}
                    name="quizLastDate"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        dateFormat="dd/MM/yyyy"
                        selected={field.value || defaultQuizLastDate}
                        onChange={(date) => field.onChange(date)}
                        // onChange={(date) => setValue("quizLastDate", date)}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      />
                    )}
                    rules={{}}
                  />
                  {errors.dob && <span>{errors.dob.message}</span>}
                </div>

                <div className="w-full  md:w-1/6   px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs w-full  font-bold mb-2"
                    htmlFor="status"
                  >
                    status
                  </label>
                  <div className="flex w-full  px-1  mt-3 ">
                    <div className="flex items-center me-4">
                      <input
                        id="inline-radio"
                        type="radio"
                        value="true"
                        name="status"
                        {...register("status")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="inline-radio"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Active
                      </label>
                    </div>
                    <div className="flex items-center me-4">
                      <input
                        id="inline-2-radio"
                        type="radio"
                        value="false"
                        name="status"
                        {...register("status")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="inline-2-radio"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Inactive{" "}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-full  md:w-1/5  px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs w-full  font-bold mb-2"
                    htmlFor="isDuration"
                  >
                    Is Quiz Time Allotted
                  </label>
                  <div className="flex w-full  px-3  mt-3  ">
                    <div className="flex items-center me-4">
                      <input
                        type="radio"
                        value="true"
                        id="isDurationYes"
                        name="isDuration"
                        {...register("isDuration")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="isDurationYes"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center me-4">
                      <input
                        type="radio"
                        value="false"
                        id="isDurationNo"
                        name="isDuration"
                        {...register("isDuration")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="isDurationNo"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        No{" "}
                      </label>
                    </div>
                  </div>
                </div>

                {selectedIsQuizTime === "true" && (
                  <>
                    <div className="w-full md:w-1/4    px-3 mt-2">
                      <label
                        className="block uppercase tracking-wide text-gray-400 text-xs w-full  font-bold mb-2"
                        htmlFor="durationBy"
                      >
                        Duration
                      </label>
                      <div className="flex w-full  px-1 mt-3 ">
                        <div className="flex items-center me-3">
                          <input
                            id="durationByQuiz"
                            type="radio"
                            value="quiz"
                            name="durationBy"
                            {...register("durationBy")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="durationByQuiz"
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Quiz
                          </label>
                        </div>
                        <div className="flex items-center me-3">
                          <input
                            id="durationByQues"
                            type="radio"
                            value="que"
                            name="durationBy"
                            {...register("durationBy")}
                            className="w-4 h-4  text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="durationByQues"
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Question{" "}
                          </label>
                        </div>
                        <div className="flex items-start">
                          <input
                            type="text"
                            placeholder="Duration"
                            name="durationMins"
                            {...register("durationMins")}
                            className="appearance-none block py-2 px-2 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                  </>
                )}

                {selectedIsQuizTime !== "true" && (
                  <div className="w-full  md:w-1/4   px-3 mt-2">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs w-full  font-bold mb-2"
                      htmlFor="isBackAllowed"
                    >
                      Back Allowed
                    </label>
                    <div className="flex w-full  px-1  mt-3 ">
                      <div className="flex items-center me-4">
                        <input
                          id="isBackAllowedYes"
                          type="radio"
                          value="Yes"
                          name="isBackAllowed"
                          {...register("isBackAllowed")}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="isBackAllowedYes"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center me-4">
                        <input
                          id="isBackAllowedNo"
                          type="radio"
                          value="No"
                          name="isBackAllowed"
                          {...register("isBackAllowed")}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="isBackAllowedNo"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          No{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="w-full  md:w-1/6   px-3 mt-2"
                  style={{ display: "none" }}
                >
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="noOfQues"
                  >
                    No. Of Questions
                  </label>
                  <input
                    id="noOfQues"
                    name="noOfQues"
                    {...register("noOfQues")}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    placeholder=""
                  />
                </div>

                <div
                  className="w-full  md:w-1/4  px-3 mt-2"
                  style={{ display: "none" }}
                >
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs w-full  font-bold mb-2"
                    htmlFor="question"
                  >
                    Is Instant
                  </label>
                  <div className="flex w-full  px-3 ">
                    <div className="flex items-center me-4">
                      <input
                        id="inline-radio"
                        type="radio"
                        value=""
                        defaultChecked={false}
                        name="isInstant"
                        {...register("isInstant")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="inline-radio"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center me-4">
                      <input
                        id="inline-2-radio"
                        type="radio"
                        value=""
                        defaultChecked={true}
                        name="isInstant"
                        {...register("isInstant")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="inline-2-radio"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        No{" "}
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  className="w-full  md:w-1/4   px-3 mt-2"
                  style={{ display: "none" }}
                >
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs w-full  font-bold mb-2"
                    htmlFor="question"
                  >
                    Is Auto Select
                  </label>
                  <div className="flex w-full  px-3 ">
                    <div className="flex items-center me-4">
                      <input
                        id="inline-radio"
                        type="radio"
                        value="Yes"
                        defaultChecked={false}
                        name="isAutoSelect"
                        {...register("isAutoSelect")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="inline-radio"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center me-4">
                      <input
                        id="inline-2-radio"
                        type="radio"
                        value="No"
                        defaultChecked={true}
                        name="isAutoSelect"
                        {...register("isAutoSelect")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="inline-2-radio"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        No{" "}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex w-full  md:w-1/2   px-3 mt-2  justify-end">
                  <div className=" mt-3 ">
                    <button
                      id="btnAddQuiz"
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>

              {error && <div className="text-danger mt-2">{error}</div>}
            </form>
          </div>

          <div className="p-4 md:p-5">
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              &nbsp;
            </p>
          </div>
        </div>
      </div>
      {/* <HeaderNav /> */}
      <div className="container">
        <div></div>
        {showCards && (
          <div>
            {/* Map over quiz questions and render cards */}
            {quiz.map((question, index) => (
              <div key={index} className="card mb-2 my-2">
                <div className="card-body">
                  <h5 className="card-title">Question {index + 1}</h5>
                  <p className="card-text">{question.question}</p>
                  {/* Render options */}
                  <ul>
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex}>{option}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
