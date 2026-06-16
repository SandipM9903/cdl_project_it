import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { useLocation } from "react-router-dom";

import { _difficulty, _questionType } from "../../configs/constants";

import * as _servCat from "./../../services/quizApp/masterCategory";
import * as _servTopic from "./../../services/quizApp/masterSubCategory";
import * as _servQueBank from "./../../services/quizApp/questionBank";

const QuestionBankAdd = ({ visible, onClose, curAction, curQuestion , onSubmitChange , setShowModal}) => {
  const [category, setCategory] = useState([]);
  const [topics, setTopic] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [subCatId, setSubCatId] = useState(null);

  const location = useLocation();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const queType = watch("queType");
  console.log(queType, "queType");
  // const { watch } = useForm();
  // Watch the selected question type

  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  useEffect(() => {
    fetchCategory();
    if (curQuestion?.catId) {
      fetchTopic(curQuestion.catId);
    }
  }, [curQuestion?.catId]);

  useEffect(() => {
    if (curQuestion) {
      reset({
        id: curQuestion.id || "",
        catId: curQuestion.catId || "",
        subCatId: curQuestion.subCatId || "",
        queType: curQuestion.queType || "",
        question: curQuestion.question || "",
        option1: curQuestion.option1 || "",
        option2: curQuestion.option2 || "",
        option3: curQuestion.option3 || "",
        option4: curQuestion.option4 || "",
        correctAnswer: curQuestion.correctAnswer || "",
      });
    }
  }, [curQuestion, reset]);
  useEffect(() => {
    if (queType === "TrueFalse") {
      setValue("option1", "True"); // Set default value for True
      setValue("option2", "False"); // Set default value for False
    }
  }, [queType, setValue]);

  // ==========QuizAPI======================= //Start
  const fetchCategory = async () => {
    try {
      let res = await _servCat.getMasterCatAll();
      if (res.data.success && res.data.success === true) {
        setCategory(res.data.data);
        //  fetchTopic(curQuestion["catId"]);
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
        if (curQuestion?.subCatId) {
          setTimeout(() => {
            setValue("subCatId", curQuestion.subCatId);
          }, 0); // using setTimeout to defer until after render
        }
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

  const addQuestion = async (input) => {
    try {
      let res = await _servQueBank.createQuestionBank(input);
      if (res.data.success && res.data.success === true) {
        setQuestions(res.data.data);
        toast.success("Successfully Question Added ");
        onSubmitChange();
        setShowModal(false);
        // reset();
      } else {
        toast.warn("Failed Adding Questions");
      }
    } catch (e) {
      toast.error("Error Adding Questions!");
    }
  };
  const saveQuestion = async (input) => {
    try {
      let res = await _servQueBank.editQuestionBank(input);
      if (res.data.success && res.data.success === true) {
        setQuestions(res.data.data);
        toast.success("Successfully Question Saved ");
        // reset();
      } else {
        toast.warn("Failed Saving Question");
      }
    } catch (e) {
      toast.error("Error Saving Question!");
    }
  };
  const delQuestion = async (input) => {
    try {
      let res = await _servQueBank.deleteQuestionBank(input.id);
      if (res.data.success && res.data.success === true) {
        setQuestions(res.data.data);
        toast.success("Successfully Question Deleted ");
        reset();
        //Call the fetchQuestion Function
      } else {
        toast.warn("Failed Deleting Question");
      }
    } catch (e) {
      toast.error("Error Deleting Question!");
    }
  };

  // ==========QuizAPI======================= //End
  const onSubmit = (data) => {
    const payload = { ...data };
    console.log(payload, "edfghjk");
    switch (curAction) {
      case "":
        addQuestion(payload);
        break;
      case "edit":
        saveQuestion(payload);
        break;
      case "del":
        delQuestion(payload);
        break;
    }
  };

  const handleOnChangeCategory = (e) => {
    // fetchTopic(e.target.value);
    const selectedCatId = e.target.value;
    console.log(selectedCatId,"selectedCatIdselectedCatId")
    fetchTopic(selectedCatId);
    setValue("catId", selectedCatId);     // ✅ Update form state
    setValue("subCatId", "");             // ✅ Clear previously selected topic
    setSubCatId("");  
  };

  if (!visible) return null;
console.log(curQuestion,"6666666666")
console.log(category,"7777777777")
console.log(topics,"8888888888")
  return (
    // <div id="containerOut"
    //   className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center">

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
              Create Question
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
          <div className="container ">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full  mt-3 ">
              <div className="flex flex-wrap -mx-3 mb-2">
                <input
                  id="id"
                  name="id"
                  value={curQuestion["id"]}
                  {...register("id")}
                  type="text"
                  style={{ display: "none" }}
                />

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
                      onChange={handleOnChangeCategory}
                      // {...register("catId")}
                      // defaultValue={curQuestion?.catId || ""}
                      // onChange={(e) => handleOnChangeCategory(e)}
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
                      onChange={(e) => setValue("subCatId", e.target.value)}
                      // {...register("subCatId")}
                      // value={curQuestion?.subCatId || ""}
                      // onChange={(e) => setValue("subCatId", e.target.value)}
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

                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
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
                      defaultValue={curQuestion["difficulty"]}
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

                

                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
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
                      defaultValue={curQuestion["queType"]}
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

                <div className="w-full  px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="question"
                  >
                    Question
                  </label>
                  <input
                    id="question"
                    name="question"
                    {...register("question")}
                    defaultValue={curQuestion["question"]}
                    type="text"
                    placeholder="Question"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  />
                </div>

                {/* Option 1 */}
                <div className="w-full md:w-1/2  px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="option1"
                  >
                    <input
                      id="optionCorrect1"
                      type="radio"
                      value="option1"
                      name="optionCorrect"
                      {...register("optionCorrect")}
                      defaultChecked={
                        curQuestion["optionCorrect"] === "option1"
                      }
                      className="w-3 h-3 mr-2 -mb-2 text-blue-600 bg-gray-100 border-gray-200 focus:ring-blue-500"
                    />
                    Option 1
                  </label>
                  <input
                    id="option1"
                    name="option1"
                    {...register("option1")}
                    value={
                      queType === "TrueFalse" ? "True" : curQuestion["option1"]
                    }
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                  />
                </div>

                {/* Option 2 */}
                <div className="w-full md:w-1/2  px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="option2"
                  >
                    <input
                      id="optionCorrect2"
                      type="radio"
                      value="option2"
                      name="optionCorrect"
                      {...register("optionCorrect")}
                      defaultChecked={
                        curQuestion["optionCorrect"] === "option2"
                      }
                      className="w-3 h-3 mr-2 -mb-2 text-blue-600 bg-gray-100 border-gray-200 focus:ring-blue-500"
                    />
                    Option 2
                  </label>
                  <input
                    id="option2"
                    name="option2"
                    {...register("option2")}
                    value={
                      queType === "TrueFalse" ? "False" : curQuestion["option2"]
                    }
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                  />
                </div>

                {/* Option 3 */}
                <div className="w-full md:w-1/2 px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="option3"
                  >
                    <input
                      id="optionCorrect3"
                      type="radio"
                      value="option3"
                      name="optionCorrect"
                      {...register("optionCorrect")}
                      defaultChecked={
                        curQuestion["optionCorrect"] === "option3"
                      }
                      disabled={queType === "TrueFalse"}
                      className="w-3 h-3 mr-2 -mb-2 text-blue-600 bg-gray-100 border-gray-200 focus:ring-blue-500"
                    />
                    Option 3
                  </label>
                  <input
                    id="option3"
                    name="option3"
                    {...register("option3")}
                    defaultValue={curQuestion["option3"]}
                    disabled={queType === "TrueFalse"}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                  />
                </div>

                {/* Option 4 */}
                <div className="w-full md:w-1/2 px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="option4"
                  >
                    <input
                      id="optionCorrect4"
                      type="radio"
                      value="option4"
                      name="optionCorrect"
                      {...register("optionCorrect")}
                      defaultChecked={
                        curQuestion["optionCorrect"] === "option4"
                      }
                      disabled={queType === "TrueFalse"}
                      className="w-3 h-3 mr-2 -mb-2 text-blue-600 bg-gray-100 border-gray-200 focus:ring-blue-500"
                    />
                    Option 4
                  </label>
                  <input
                    id="option4"
                    name="option4"
                    {...register("option4")}
                    defaultValue={curQuestion["option4"]}
                    disabled={queType === "TrueFalse"}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                  />
                </div>

                <div className="w-full  px-3 mt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                    htmlFor="question"
                  >
                    More Info
                  </label>
                  <input
                    id="moreInfo"
                    name="moreInfo"
                    {...register("moreInfo")}
                    defaultValue={curQuestion["moreInfo"]}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="text-right">
                {curAction == "" && (
                  <button type="submit" className="btn btn-primary mt-4 ">
                    Add Question
                  </button>
                )}
                {curAction == "edit" && (
                  <button type="submit" className="btn btn-success mt-4 ">
                    Save Question
                  </button>
                )}
                {curAction == "del" && (
                  <button type="submit" className="btn btn-danger mt-4 ">
                    Delete Question
                  </button>
                )}
              </div>
              {error && <div className="text-danger mt-2">{error}</div>}
            </form>
          </div>
          <div className="p-2 md:p-5">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankAdd;
