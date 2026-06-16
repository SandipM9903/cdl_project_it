import React, { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { useNavigate } from "react-router-dom";
import { HeaderNav } from "../../HeaderNav";
import QuizGenerator from "./QuizGenerator";


import * as _servCat from "./../../services/quizApp/masterCategory";
import * as _servTopic from "./../../services/quizApp/masterSubCategory";
import * as _servQuiz from "./../../services/quizApp/quiz";
import { createPlayQuiz } from "./../../services/quizApp/playQuiz";
import axios from "axios";
import Header from "../../../components/Header";


const QuizManagement = () => {

  const [category, setCategory] = useState([]);
  const [topics, setTopic] = useState([]);
  const [quizzes, setQuizzess] = useState([]);
  const [curAction, setCurAction] = useState("");
  const [curQuiz, setCurQuiz] = useState("");
 
  const email = localStorage.getItem("email");
  const [userData, setUserData] = useState({});
 const empCode = localStorage.getItem("empId");
  const employeeCode = localStorage.getItem("encodedEmpCode") || 0;
  const decodedEmployeeCode = employeeCode !== 0 ? atob(employeeCode) : 0;

  console.log(decodedEmployeeCode, "Decoded employeeCode");

  const fetchUser = () => {
   
        const encodedEmpCode = btoa(empCode);
        localStorage.setItem("encodedEmpCode", encodedEmpCode);
    axios.get(` /${email}`)
      .then((res) => {
        setUserData(res.data);
        
      }).catch((err) => {
      console.log(err);
    })
  }

 localStorage.setItem('userData', JSON.stringify(userData));
  console.log("curQuiz", curQuiz);

  const [showModal, setShowModal] = useState(false);
  const handleModalOnClose = () => setShowModal(false);


  useEffect(() => {
    // fetchQuestions();
    fetchCategory();
    // fetchTopic({ id: 2 });
  }, []);



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
  }

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
  }
  const fetchQuiz = async (input) => {
    try {
      let res = await _servQuiz.getQuizList(input, 1);
      if (res.data.success && res.data.success === true) {
        setQuizzess(res.data.data);
        toast.success("Successfully Fetched Quizzes!");
      } else {
        toast.warn("Failed Feching Quizzes!");
      }
    } catch (e) {
      toast.error("Error Fetching Quizzes!");
    }
  }

 

  const navigate = useNavigate();

  

  const handleOnClickStartQuiz = (curQuiz) => {
    const req = {
      // id: curQuiz.id,
      
        quizId: curQuiz.id,      // assuming curQuiz has id = 14
        noOfQues: curQuiz.noOfQues,            // you can make this dynamic if needed
        empCode: decodedEmployeeCode,             // you can replace this with actual userId from auth or context
        takenOn: new Date().toISOString(),  // or use a specific timestamp
        // startTime: new Date().toISOString()
    };

    createPlayQuiz(req)
        .then((res) => {
          console.log("Play started successfully", res.data);
            // localStorage.setItem("curQuiz", JSON.stringify(curQuiz));
          // navigate("/quiz", { state: { curQuiz: curQuiz } });
          localStorage.setItem("curQuiz", JSON.stringify({ ...curQuiz, generatedId: res.data }));
            // navigate("/quiz", { state: { curQuiz: { ...curQuiz, generatedId: res.data.id } } });
            navigate("/quiz", { state: { curQuiz: req } });
        })
        .catch((err) => {
            console.error("Error starting play", err);
        });
};

  const handleOnClickQuizResult = (curQuiz) => {
    localStorage.setItem("curQuiz", JSON.stringify(curQuiz));
    navigate("/quiz/result", { state: { curQuiz: curQuiz } });
  };

  const handleOnChangeCategory = (e)=>{
    fetchTopic(e.target.value);
  }

  const handleOnQuizAction = (quiz, action) => {
    setCurAction(action);
    setCurQuiz(quiz);

    setShowModal(true);
  }
  const formDataRef = useRef(null);
  const handleDeleteQuiz = (r) => {
    axios.delete(`http://localhost:8082/api/master/quiz/${r?.id}`)
      .then(() => {
        console.log("Quiz deleted successfully");
        toast.success("Quiz deleted successfully!");
        if (formDataRef.current) {
          fetchQuiz(formDataRef.current);
        }
    }).catch((error) => {
        console.error("Error deleting quiz:", error);
        toast.error("Error deleting quiz!");
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    formDataRef.current = data;

    fetchQuiz(data);
  };

  return (
    <><Header /><div className="mt-20">
      <HeaderNav />
      <div className="container relative p-10">
        <h4 className="mt-2 mb-3 text-blue-500">Quizzes</h4>
        <button
          className="absolute top-0 right-0 bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow"
          onClick={() => setShowModal(true)}
        >
          +
        </button>

        <form className="w-full " onSubmit={handleSubmit(onSubmit)}>

          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/5 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="category">
                Category
              </label>
              <div className="relative">
                <select id="catId" name="catId" {...register('catId')} onChange={(e) => handleOnChangeCategory(e)}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option value="">Select</option>
                  {category.map((r) => (
                    <option value={r.id} key={"cat_" + r.id}>{r.cat}</option>
                  ))}

                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/5 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="topic">
                Topic
              </label>
              <div className="relative">
                <select id="subCatId" name="subCatId" {...register('subCatId')}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option value="">Select</option>
                  {topics.map((r) => (
                    <option value={r.id} key={"topic_" + r.id}>{r.subCat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>


            <div className="w-full md:w-1/5 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="grid-state">
                Status
              </label>
              <div className="relative">
                <select id="status" name="status" {...register('status')}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>


            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0 mt-4">
              <div className="relative">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                  <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                  <span>Show</span>
                </button>

              </div>
            </div>

          </div>



        </form>

        {quizzes.length === 0 && (
          <div className="py-4 ">
            <h6 className="px-2  text-purple-800 ">Apply the Filter & search Quizzes</h6>
            <blockquote className="px-4 py-24 mt-0 my-4 border-s-4 border-purple-300 bg-purple-50 dark:border-purple-500 dark:bg-purple-800">

              <p className="text-xl italic font-medium leading-relaxed text-purple-400 dark:text-white">
                "Select the required Category, Topic & Staus  in above filter & click Show button to load relative Quizzes"
              </p>
            </blockquote>
          </div>
        )}

        <div className=" -mx-8 ">
          <div className="flex flex-wrap -mx-1 mb-2">
            {quizzes.map((r) => (
              <div
                className="max-w-2xl mx-1 sm:max-w-sm md:max-w-sm lg:w-1/4 xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-8 bg-white shadow-xl rounded-lg text-gray-900">

                <div className="text-center mt-2 border-t pt-3">
                  <h5 className="text-gray-600">{r.quizName}</h5>
                  <p className="text-gray-500">{r.cat} | {r.subCat} </p>

                </div>
                <ul className="py-4 mt-2 text-gray-500 flex items-center justify-around">
                  <li className="flex flex-col items-center justify-around">
                    <svg className="w-4 fill-current text-purple-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path
                        d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
                    </svg>
                    <div>{r.noOfQues}</div>
                  </li>
                  <li className="flex flex-col items-center justify-around">

                    <svg className="w-4 fill-current text-purple-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M10 0c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm0-14.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm4.8 7.7h-4.7v-5.2h1.4v4.5h3.3v.7z" />
                    </svg>
                    <div>{r.durationMins} Mins</div>
                  </li>
                  <li className="flex flex-col items-center justify-between">
                    <svg className="w-4 fill-current text-purple-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path
                        d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
                    </svg>
                    <div>10k</div>
                  </li>

                </ul>

                <div className="p-2 pt-4 border-t mx-2 mt-2 flex justify-between items-center">
                  <button onClick={() => handleOnClickQuizResult(r)}
                    className="w-1/5 block rounded-full bg-blue-300 hover:shadow-lg font-semibold text-white px-2 py-1">
                    <svg className="w-6 h-6 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M15.5 2.5c-3.034 0-5.5 2.466-5.5 5.5s2.466 5.5 5.5 5.5 5.5-2.466 5.5-5.5-2.466-5.5-5.5-5.5zm-1.5 8h-4v-4h4v4z" />
                    </svg>
                  </button>
                  <button onClick={() => handleOnClickStartQuiz(r)}
                    className="w-1/6 block rounded-full bg-green-300 hover:shadow-lg font-semibold text-white px-2 py-1">
                    <svg className="w-6 h-6 fill-current text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9 6.82v6.36l5.45-3.18z" />
                      <path d="M0 0h20v20h-20z" fill="none" />
                    </svg>
                  </button>

                </div>

                <div className="border-t pl-3 text-left">
                  <button onClick={() => handleOnQuizAction(r, "edit")}
                    className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-blue-500 hover:bg-blue-500/10 active:bg-blue-500/30" type="button">
                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3 w-4">
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                      </svg>
                    </span>
                  </button>
                  <button onClick={() => handleDeleteQuiz(r)} className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-red-500 hover:bg-red-500/10 active:bg-red-500/30" type="button">
                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                        <path fillRule="evenodd" d="M5.293 5.293a1 1 0 011.414 0L12 10.586l5.293-5.293a1 1 0 111.414 1.414L13.414 12l5.293 5.293a1 1 0 01-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 01-1.414-1.414L10.586 12 5.293 6.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>


        <QuizGenerator onClose={handleModalOnClose} visible={showModal} curAction={curAction} curQuiz={curQuiz} />
      </div>










    </div></>
  );
};

export default QuizManagement;
