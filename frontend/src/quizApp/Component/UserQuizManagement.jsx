import React, { useState } from "react";

import UserHeaderNav from "../UserHeaderNav";
import { useNavigate } from "react-router-dom";

const QuizInfoTab = ({ quizName }) => { 
const navigate = useNavigate();
  const totalQuestions = 5;
  const totalDuration = "30 minutes";
  const durationPerQuestion = "5 minutes";
  const handleStartQuiz = () => {
   navigate("/quiz");
  };
  return (
    <div className="w-full mt-4 p-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Window air conditioner</h5>
          <p>Total Questions: {totalQuestions}</p>
          <p>Total Duration: {totalDuration}</p>
          <p>Duration per Question: {durationPerQuestion}</p>
          <button className="align-bottom ml-[90%] bg-green-600text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={handleStartQuiz}>Start</button>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <h5 className="card-title">Water heaters</h5>
          <p>Total Questions: {totalQuestions}</p>
          <p>Total Duration: {totalDuration}</p>
          <p>Duration per Question: {durationPerQuestion}</p>
          <button className="align-bottom ml-[90%]  bg-green-600text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={handleStartQuiz}>Start</button>
        </div>
      </div>
    </div>
  );
};

const LastDateTab = ({ lastDate }) => {
  return (
    <div className="w-full mt-4 p-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Last Date</h5>
          <p>{lastDate}</p>
        </div>
      </div>
    </div>
  );
};

const NumberOfQuestionsTab = ({ numberOfQuestions }) => {
  return (
    <div className="w-full mt-4 p-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Number Of Questions</h5>
          <p>{numberOfQuestions}</p>
        </div>
      </div>
    </div>
  );
};

const UserQuizManagement = () => {
  const [activeTab, setActiveTab] = useState("quizInfo");

  return (
    <div>
      <UserHeaderNav />
      <div className="flex justify-center">
        <button
          className={`${
            activeTab === "quizInfo" ? "bg-blue-500" : "bg-gray-300"
          } py-2 px-4 rounded-l`}
          onClick={() => setActiveTab("quizInfo")}
        >
          Quiz Name
        </button>
   
      </div>
      <div className="flex items-center mb-3 ml-6">
          <span className="mr-3">
            <label htmlFor="dropdown1">Catagory:</label>
            <select id="dropdown1" className="form-select">
              <option value="">Mechanical</option>
              <option value="">Electrical</option>
              <option value="">Medical</option>
            </select>
          </span>
          <span className="mr-3">
            <label htmlFor="dropdown2">Sub Catagory:</label>
            <select id="dropdown2" className="form-select">
              <option value="">Window air conditioner</option>
              <option value="">Split air conditioner</option>
              <option value="">Electric iron</option>
            </select>
          </span>
          <span className="mr-3">
            <label htmlFor="dropdown1">Status:</label>
            <select id="dropdown1" className="form-select">
              <option value="">Active</option>
              <option value="">Inactive</option>
       
            </select>
          </span>
        </div>
      {/* Render tab content based on activeTab state */}
      {activeTab === "quizInfo" && <QuizInfoTab quizName="Java Quiz" />}
  
    </div>
  );
};

export default UserQuizManagement;
