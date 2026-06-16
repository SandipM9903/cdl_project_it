import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const AnnualGoal = () => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [additionalGoals, setAdditionalGoals] = useState([""]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  const handleAddRow = () => {
    if (additionalGoals.length < 5) {
      setAdditionalGoals([...additionalGoals, ""]);
    }
  };

  const handleRemoveRow = (index) => {
    const updated = [...additionalGoals];
    updated.splice(index, 1);
    setAdditionalGoals(updated);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="mt-24 px-6 max-w-6xl mx-auto w-full pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mr-4"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          >
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate("/AppraisalList")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          >
            Performance List
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Annual Goals</span>
        </nav>

        {/* HEADER */}
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold">Annual Cycle 2025</h2>
          <p className="text-sm">Full Year Review</p>
        </div>

        {/* QUARTERS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {quarters.map((q) => (
            <div
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`cursor-pointer p-4 rounded-lg text-center font-semibold ${selectedQuarter === q
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-200"
                }`}
            >
              {q}
            </div>
          ))}
        </div>

        {/* SELECTED QUARTER DATA */}
        {selectedQuarter && (
          <div className="bg-white p-4 rounded-lg mb-6 shadow">
            <h3 className="font-semibold mb-2">
              {selectedQuarter} Goals (Auto Fetched)
            </h3>
            <p className="text-sm text-gray-500">
              (Fetch from backend based on quarter)
            </p>
          </div>
        )}

        {/* KEY ACCOMPLISHMENTS */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-semibold mb-4">
            Key Accomplishments (FY 2025)
          </h3>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-2">Key Accomplishment</th>
                <th className="p-2">Produced From</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Example Goal</td>
                <td className="p-2">Q1</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ADDITIONAL ACCOMPLISHMENTS */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-semibold mb-4">
            Additional Accomplishments
          </h3>

          {additionalGoals.map((goal, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => {
                  const updated = [...additionalGoals];
                  updated[index] = e.target.value;
                  setAdditionalGoals(updated);
                }}
                className="flex-1 border p-2 rounded"
                placeholder="Enter accomplishment"
              />
              <button
                onClick={() => handleRemoveRow(index)}
                className="bg-red-500 text-white px-3 rounded"
              >
                -
              </button>
            </div>
          ))}

          <button
            onClick={handleAddRow}
            className="bg-green-500 text-white px-4 py-1 rounded mt-2"
          >
            +
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Save Draft
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Preview
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">
            Reset
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Submit to R1
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnualGoal;