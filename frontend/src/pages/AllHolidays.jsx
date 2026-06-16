

import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const AllHolidays = () => {
  const [activeTab, setActiveTab] = useState("Fix Holidays");
  const [selectedState, setSelectedState] = useState("All");
  const [activeMonth, setActiveMonth] = useState("Jan");
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const states = ["All", "Maharashtra", "Kerala", "Karnataka", "Delhi"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const fixHolidays = [
    { date: "03", month: "Jan", title: "New Year", emoji: "🗓️", states: ["All"] },
    { date: "14", month: "Mar", title: "Holi", emoji: "😃", states: ["All"] },
    { date: "01", month: "May", title: "Labour’s Day", emoji: "👨‍💼", states: ["All"] },
    { date: "15", month: "Aug", title: "Independence Day", emoji: "🇮🇳", states: ["All"] },
    { date: "27", month: "Aug", title: "Ganesh Chaturthi", emoji: "🐘", states: ["Maharashtra", "Karnataka"] },
    { date: "02", month: "Oct", title: "Gandhi Jayanti & Dussehra", emoji: "🏹", states: ["All"] },
  ];

  const optionalHolidays = [
    { date: "07", month: "Mar", title: "Attukal Pongala" },
    { date: "08", month: "Mar", title: "Holi" },
    { date: "22", month: "Mar", title: "Gudhi Padava" },
    { date: "09", month: "Apr", title: "Ugadi" },
    { date: "30", month: "Apr", title: "Ram Navami" },
  ];

  const filteredFixHolidays = fixHolidays.filter(
    (holiday) =>
      holiday.states.includes("All") || holiday.states.includes(selectedState)
  );

  const filteredOptionalHolidays = optionalHolidays.filter(
    (holiday) =>
      holiday.month.toLowerCase() === activeMonth.toLowerCase()
  );

  return (
    <>
      <Header />
      <div className="p-8 mt-20">
        <div className="text-sm text-gray-500 mb-2">Home / Holidays</div>
        <h1 className="text-3xl font-semibold mb-4">Holidays</h1>

        {/* Toggle Tabs */}
        <div className="flex gap-4 mb-4">
          {["Fix Holidays", "Optional Holidays"].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full border ${
                activeTab === tab ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* State Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`px-4 py-2 rounded-full text-sm border ${
                selectedState === state
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Fix Holidays */}
        {activeTab === "Fix Holidays" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFixHolidays.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No holidays available for selected state.
              </div>
            ) : (
              filteredFixHolidays.map((holiday) => (
                <div
                  key={holiday.date + holiday.month}
                  className="bg-slate-100 rounded-2xl p-4 border shadow-sm hover:shadow-md transition"
                >
                  <div className="text-3xl font-bold text-red-800">
                    {holiday.date}
                  </div>
                  <div className="uppercase text-sm text-gray-500 mb-2">
                    {holiday.month}
                  </div>
                  <div className="text-lg font-semibold mb-2">
                    {holiday.title}
                  </div>
                  <div className="text-5xl text-center">{holiday.emoji}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Optional Holidays */}
        {activeTab === "Optional Holidays" && (
          <>
            <div className="flex gap-3 overflow-x-auto mb-6">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => setActiveMonth(month)}
                  className={`px-4 py-1 rounded-full ${
                    month === activeMonth
                      ? "bg-gray-200 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredOptionalHolidays.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  No optional holidays found for {activeMonth}.
                </div>
              ) : (
                filteredOptionalHolidays.map((holiday) => (
                  <div
                    key={holiday.date + holiday.month}
                    className="bg-slate-100 rounded-2xl p-4 border shadow-sm hover:shadow-md transition"
                  >
                    <div className="text-3xl font-bold text-red-800">
                      {holiday.date}
                    </div>
                    <div className="uppercase text-sm text-gray-500 mb-2">
                      {holiday.month}
                    </div>
                    <div className="text-lg font-semibold mb-2">
                      {holiday.title}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-10 bg-white border border-red-500 text-red-600 p-4 rounded-xl flex items-center gap-2">
              <span className="text-yellow-500 text-xl">⭐</span>
              <p className="text-sm font-medium">
                2 Optional holidays in the year to be availed from the above
                bucket list other than the fixed holidays.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AllHolidays;
