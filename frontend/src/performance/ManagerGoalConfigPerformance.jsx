import React from "react";
import Header from "../components/Header";
import ManagerGoalConfig from "./pages/manager/ManagerGoalConfig";


const ManagerGoalConfigPerformance = () => {
  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />

      <div className="mt-24 px-6">
        <ManagerGoalConfig/>
      </div>
    </div>
  );
};

export default ManagerGoalConfigPerformance;