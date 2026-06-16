import React, { useEffect, useState } from "react";
import { HeaderNav } from "./HeaderNav";
import { BASE_URL } from "../config/Config";

export const ShowUserResponse = () => {
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user responses from the JSON file
    fetchUserResponses();
  }, []);

  const fetchUserResponses = async () => {
    try {
      // Fetch data from the JSON file
      const response = await fetch(`${BASE_URL}:8089/data`);
      if (!response.ok) {
        throw new Error("Failed to fetch user responses");
      }
      const data = await response.json();
      // Update state with the fetched data
      setResponses(data);
    } catch (error) {
      // Handle error if fetch fails
      setError("Failed to fetch user responses");
    }
  };

  // Static details
  const quizName = "History Quiz";
  const totalQuestions = 10; // Update with the actual number of questions
  const totalUsers = 5; // Update with the actual number of users
  const totalDuration = "1 hour"; // Update with the total duration
  const category = "History";
  const topic = "State History";

  return (
    <div>
      <HeaderNav />
      <div className="container mx-auto px-4 py-6">
     
        <h4 className="mt-2 mb-3 text-blue-500">Quiz Result</h4>
        <div className=" mx-auto bg-white rounded-lg overflow-hidden shadow-md mb-4">
        <div className="p-4">
  <div className="grid grid-cols-3 gap-2">
    <div className="border rounded p-2">
      <p className="font-bold text-purple-500">Quiz Name:</p>
      <p>{quizName}</p>
    </div>
    <div className="border rounded p-2">
      <p className="font-bold text-purple-500">Total Questions:</p>
      <p>{totalQuestions}</p>
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
      <p>{category}</p>
    </div>
    <div className="border rounded p-2">
      <p className="font-bold text-purple-500">Topic:</p>
      <p>{topic}</p>
    </div>
  </div>
</div>

        

        {responses.length > 0 ? (
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
         <tr key={response.id}>
           <td className="px-4 py-2 border-b">{response.userId}</td>
           <td className="px-4 py-2 border-b">{response.fullName}</td>
           <td className="px-4 py-2 border-b">{response.correctAns}</td>
           <td className="px-4 py-2 border-b">{response.wrongAns}</td>
           <td className="px-4 py-2 border-b">{response.score}</td>
           <td className="px-4 py-2 border-b">{response.startTime}</td>
           <td className="px-4 py-2 border-b">{response.endTime}</td>
           <td className="px-4 py-2 border-b">{response.duration}</td>
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
    </div>
  );
};

export default ShowUserResponse;
