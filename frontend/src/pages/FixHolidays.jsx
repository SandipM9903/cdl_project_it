

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/Config";

// States to display as tabs
const states = [
  "Maharashtra",
  "Tamil Nadu",
  "Delhi",
  "Andhra Pradesh",
  "West Bengal",
  "Kerala",
  "Karnataka",
  "Uttar Pradesh",
  "Punjab",
  "Gujarat",
  "Rajasthan",
];

const FixHolidays = () => {
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [holidayDataByState, setHolidayDataByState] = useState({});
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/holidays/get/all-holidays`);
        const data = res.data;

        const stateWiseData = {};

        // Initialize each state's array
        states.forEach(state => {
          stateWiseData[state] = [];
        });

        // Process each holiday
        data.forEach(item => {
          if (item.optional === false) {
            const dateObj = new Date(item.year);
            const date = String(dateObj.getDate()).padStart(2, "0");
            const month = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();

            const holiday = {
              date,
              month,
              title: item.holidays,
              icon: "🎉",
            };

            // If state is "All", add to every state's tab
            if (item.state.trim() === "All") {
              states.forEach(state => {
                stateWiseData[state].push(holiday);
              });
            } else {
              // Otherwise, split and assign to listed states
              const stateList = item.state.split(",").map(s => s.trim());
              stateList.forEach(state => {
                if (states.includes(state)) {
                  stateWiseData[state].push(holiday);
                }
              });
            }
          }
        });

        setHolidayDataByState(stateWiseData);
      } catch (err) {
        console.error("Error fetching holidays:", err);
      }
    };

    fetchHolidays();
  }, []);

  const holidays = holidayDataByState[selectedState] || [];

  return (
    <div className="flex flex-col " >
      {/* Navbar */}
      <div
        className="w-full h-[54px] rounded-[16px] bg-[#F5F5F5] flex items-center px-2 sm:px-4 gap-x-2 sm:gap-x-3 overflow-x-auto whitespace-nowrap mb-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
        {states.map((state, index) => (
          <button
            key={index}
            onClick={() => setSelectedState(state)}
            className={`min-w-[120px] sm:min-w-[145px] h-[37px] rounded-[25px] text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              selectedState === state
                ? "bg-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.16)]"
                : "bg-transparent"
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      {/* Holiday Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {holidays.map((holiday, index) => (
          <div
            key={index}
            className="max-w-[360px] w-full h-[238px] bg-[#FAFAFA] border border-[#E5E9EB] rounded-[28px] p-6 flex flex-col justify-between mx-auto"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[36px] font-bold text-[#923A39] leading-none">
                  {holiday.date}
                </div>
                <div className="uppercase text-sm text-[#333] font-medium mt-1">
                  {holiday.month}
                </div>
              </div>
              <div className="text-4xl">{holiday.icon}</div>
            </div>
            <div className="mt-6 text-base text-[#1A1A1A] font-semibold">
              {holiday.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixHolidays;
