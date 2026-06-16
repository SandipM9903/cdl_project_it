import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { deleteQuestionBank } from "./../../services/quizApp/questionBank";
import { HeaderNav } from "../../HeaderNav";
import EditQuestionModal from "../../EditQuestionModal";
import QuestionBankAdd from "./QuestionBankAdd";

import * as _servCat from "./../../services/quizApp/masterCategory";
import * as _servTopic from "./../../services/quizApp/masterSubCategory";
import * as _servQueBank from "./../../services/quizApp/questionBank";

import { _difficulty, _questionType } from "../../configs/constants";

export const QuestionBank = () => {
  const [category, setCategory] = useState([]);
  const [topics, setTopic] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [curQuestion, setCurQuestion] = useState({});
  const [curAction, setCurAction] = useState("");

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const handleModalOnClose = () => setShowModal(false);

  useEffect(() => {
    fetchCategory();
    // fetchQuestion({});
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
  // ==========QuizAPI======================= //End

  // const handleOnChangeCategory = (e) => {
  //   fetchTopic(e.target.value);
  // };

  // const handleOnQuestionAction = (question, action) => {
  //   setCurQuestion(question);
  //   setCurAction(action);
  //   setShowModal(true);
  // }
  const handleOnQuestionAction = (selectedValues, mode) => {
    setCurQuestion(selectedValues);
    setShowModal(true); // Ensure the modal opens
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    fetchQuestion(data);
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteQuestionBank(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id)); // UI update
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  // {
  //   "catId" : [""],
  //   "subCatId" : [""],
  //   "queType":"",
  //   "difficulty":""
  // }

  const [selectedCategory, setSelectedCategory] = useState({
    catId: "",
    subCatId: "",
  });

  const handleOnChangeCategory = (e) => {
    const selectedCatId = e.target.value;

    // Fetch subcategories based on the selected category
    fetchTopic(selectedCatId);

    // Find the selected category object
    const selectedCategoryObj = category.find(
      (cat) => cat.id === selectedCatId
    );

    // Get the first subcategory (if available)
    const firstSubCategory = selectedCategoryObj?.subcategories?.[0]?.id || "";

    // Store category & subcategory IDs
    setSelectedCategory((prev) => ({
      ...prev,
      catId: selectedCatId,
      subCatId: firstSubCategory,
    }));

    setValue("catId", selectedCatId); // Update category ID in form
    setValue("subCatId", firstSubCategory); // Update subcategory ID in form
  };

  // Handle subcategory change
  const handleOnChangeSubCategory = (e) => {
    const selectedSubCatId = e.target.value;

    setSelectedCategory((prev) => ({
      ...prev,
      subCatId: selectedSubCatId,
    }));

    setValue("subCatId", selectedSubCatId); // Update subcategory ID in form
  };

  return (
    <div>
      <HeaderNav />
      <div className="container relative">
        <h4 className="mt-2 mb-3 text-blue-500">Question Bank</h4>
        {/* <button
          className="absolute top-0 right-0 bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full shadow"
          onClick={() => handleOnQuestionAction({}, "")}
        >
          +
        </button> */}
        <button
          className="absolute top-0 right-0 bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow"
          onClick={() =>
            handleOnQuestionAction(
              {
                catId: watch("catId"),
                subCatId: watch("subCatId"),
                difficulty: watch("difficulty"),
                queType: watch("queType"),
              },
              ""
            )
          }
        >
          +
        </button>

        <form className="w-full " onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap -mx-3 mb-2">
            
            {/* Category Dropdown */}
            <div className="w-full md:w-1/5 px-3 mb-6 md:mb-0">
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
                  value={selectedCategory.catId}
                  onChange={handleOnChangeCategory}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="">Select</option>
                  {category.map((r) => (
                    <option value={r.id} key={"cat_" + r.id}>
                      {r.cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subcategory Dropdown */}
            <div className="w-full md:w-1/5 px-3 mb-6 md:mb-0">
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
                  value={selectedCategory.subCatId}
                  onChange={handleOnChangeSubCategory}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="">Select</option>
                  {topics.map((r) => (
                    <option value={r.id} key={"topic_" + r.id}>
                      {r.subCat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full md:w-1/5 px-3 mb-6 md:mb-0">
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

            <div className="w-full md:w-1/5 px-3 mb-6 md:mb-0">
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
            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0 mt-4">
              <div className="relative">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
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
            </div>
          </div>
        </form>

        {questions.length > 0 && (
          <table className="mt-5  w-full table-auto  shadow-md rounded  ">
            <thead>
              <tr className="p-4 border-t border-b border-blue-gray-100">
                <th className="p-3">#</th>
                <th>Question</th>
                <th>Type</th>
                <th>Difficulty</th>
                {/* <th>Category</th>
                <th>Topic</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((r) => (
                <tr
                  className="p-4 border-b border-blue-gray-50"
                  key={"que_" + r.id}
                >
                  <td className="p-3">{r.id}</td>
                  <td>{r.question}</td>
                  <td>{r.queType}</td>
                  <td>{r.difficulty}</td>
                  {/* <td>{r.cat}</td>
                  <td>{r.subCat}</td> */}
                  <td>
                    <button
                      onClick={() => handleOnQuestionAction(r, "edit")}
                      className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-blue-500 hover:bg-blue-500/10 active:bg-blue-500/30"
                      type="button"
                    >
                      <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-3 w-4"
                        >
                          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                        </svg>
                      </span>
                    </button>
                    <button
                      // onClick={() => handleOnQuestionAction(r, "del")}
                      onClick={() => handleDeleteQuestion(r.id)}
                      className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-red-500 hover:bg-red-500/10 active:bg-red-500/30"
                      type="button"
                    >
                      <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 5.293a1 1 0 011.414 0L12 10.586l5.293-5.293a1 1 0 111.414 1.414L13.414 12l5.293 5.293a1 1 0 01-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 01-1.414-1.414L10.586 12 5.293 6.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {questions.length === 0 && (
          <div className="py-4 ">
            <h6 className="px-2  text-purple-600">Apply the Filter</h6>
            <blockquote className="px-4 py-24 mt-0 my-4 border-s-4 border-purple-300 bg-purple-50 dark:border-purple-500 dark:bg-purple-800">
              <p className="text-xl italic font-medium leading-relaxed text-purple-400 dark:text-white">
                "Select the required Category, Topic, Difficult & Question Type
                in above filter & click Show button to load relative Questions"
              </p>
            </blockquote>
          </div>
        )}

        {error && <div className="text-danger mt-2">{error}</div>}
        <QuestionBankAdd
          onClose={handleModalOnClose}
          setShowModal={setShowModal}
          visible={showModal}
          curAction={curAction}
          curQuestion={curQuestion}
          onSubmitChange={handleSubmit(onSubmit)}
          // selectedQuestion={curQuestion}
          key={curAction + "_" + curQuestion["id"]}
        />
      </div>
    </div>
  );
};

export default QuestionBank;
