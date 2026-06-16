import React, { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import PendingRequestForDepartmentMembers from "./PendingRequestForDepartmentMembers";
import ExitDepartmentsHistory from "./ExitDepartmentsHistory";
// import DepartmentHistory from "./DepartmentHistory";

export default function ExitDepartmentFNFLists() {
//   const { deptId } = useParams();

  const [activeTab, setActiveTab] = useState("pending");
useEffect(() => {
  window.scrollTo(0, 0); // Ensures the page scrolls to the top when loaded
}, []);
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Department </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          className={`px-4 py-2 ${activeTab === "pending" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "history" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "pending" && <PendingRequestForDepartmentMembers  />}
        {activeTab === "history" && <ExitDepartmentsHistory  />}
      </div>
    </div>
  );
}
