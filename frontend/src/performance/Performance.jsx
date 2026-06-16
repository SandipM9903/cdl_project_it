import React from "react";
import Header from "../components/Header";
import HrCycleConfig from "./pages/hr/HrCycleConfig";

const PerformanceAppraisalReport = () => {
  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />

      <div className="mt-24 px-6">
        <HrCycleConfig/>
      </div>
    </div>
  );
};

export default PerformanceAppraisalReport;