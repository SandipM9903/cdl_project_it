import React, { useEffect, useState } from "react";
import { HeaderNav } from "./../../HeaderNav";
import { getQuizListByQuiz } from "../../services/quizApp/playQuiz";
import { useLocation } from "react-router-dom";
import Header from "../../../components/Header";

export const QuizResult = () => {
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const quizData = location?.state?.curQuiz||"";
  const quizId = location.state?.id || JSON.parse(localStorage.getItem("curQuiz"));
  
  useEffect(() => {
    // Fetch user responses from the JSON file
    fetchUserResponses();
  }, []);

  

  const fetchUserResponses = async () => {
    setLoading(true);
    try {
      const response = await getQuizListByQuiz(quizId.id); // Fetching the quiz data
       // Log the response to the console
      if (response && response.data) {
        setResponses(response.data);
      } else {
        setError("No data found");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
    
  };

  console.log(responses,"responses");
  
  const totalUsers = 5; // Update with the actual number of users
  const totalDuration = "1 hour"; // Update with the total duration
  const category = "History";
  const topic = "State History";

  return (
   <><Header /><div className="mt-20">
      <HeaderNav />
      <div className="container mx-auto px-4 py-6">
        <h4 className="mt-2 mb-3 text-blue-500">Quiz Result</h4>
        <div className=" mx-auto bg-white rounded-lg overflow-hidden shadow-md mb-4">
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded p-2">
                <p className="font-bold text-purple-500">Quiz Name:</p>
                <p>{quizData?.quizName}</p>
              </div>
              <div className="border rounded p-2">
                <p className="font-bold text-purple-500">Total Questions:</p>
                <p>{quizData?.noOfQues}</p>
              </div>
              <div className="border rounded p-2">
                <p className="font-bold text-purple-500">Total Users:</p>
                <p>{totalUsers}</p>
              </div>
              <div className="border rounded p-2">
                <p className="font-bold text-purple-500">Total Duration:</p>
                <p>{totalDuration}</p>
              </div>
              <div className="border rounded p-2">
                <p className="font-bold text-purple-500">Category:</p>
                <p>{quizData?.cat}</p>
              </div>
              <div className="border rounded p-2">
                <p className="font-bold text-purple-500">Topic:</p>
                <p>{quizData?.subCat}</p>
              </div>
            </div>
          </div>


          {loading ? (
            <p>Loading...</p>
          ) : responses.length > 0 ? (
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">User</th>
                  <th className="px-4 py-2 border-b">Full Name</th>
                  <th className="px-4 py-2 border-b">Correct Ans.</th>
                  <th className="px-4 py-2 border-b">Wrong Ans.</th>
                  <th className="px-4 py-2 border-b">Score (%)</th>
                  <th className="px-4 py-2 border-b">Start Time</th>
                  <th className="px-4 py-2 border-b">End Time</th>
                  <th className="px-4 py-2 border-b">Duration</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => (
                  <tr key={response.id} className="text-xs">
                    <td className="px-4 py-2 border-b">{response?.play?.empCode}</td>
                    <td className="px-4 py-2 border-b">
                      {response?.play?.firstName}
                    </td>{" "}
                    {/* Replace with fullName if available */}
                    <td className="px-4 py-2 border-b">{response?.result?.noOfQueCorrect}</td>{" "}
                    {/* No 'correctAns' field in the response */}
                    <td className="px-4 py-2 border-b">{response?.result?.noOfQueIncorrect}</td>{" "}
                    {/* No 'wrongAns' field in the response */}
                    <td className="px-4 py-2 border-b">{response?.result?.scorePercentage}%</td>{" "}
                    {/* No 'score' field in the response */}
                    <td className="px-4 py-2 border-b">{new Date(response?.play?.startTime).toLocaleTimeString("en-GB")}</td>
                    <td className="px-4 py-2 border-b">{new Date(response?.play?.endTime).toLocaleTimeString("en-GB")}</td>
                    <td className="px-4 py-2 border-b">
                      {response?.result?.durationMins}
                    </td>{" "}
                    {/* 'takenOn' could be the duration */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-red-500">No user responses found</p>
          )}

          {error && <div className="text-red-500">{error}</div>}
        </div>
      </div>
    </div></>
  );
};

export default QuizResult;
