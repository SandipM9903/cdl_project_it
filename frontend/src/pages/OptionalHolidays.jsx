

import { useState, useEffect } from "react";
import { BASE_URL } from "../config/Config";

export default function OptionalHoliday() {
  const [activeMonth, setActiveMonth] = useState("Jan");
  const [holidayData, setHolidayData] = useState({});
  const [loading, setLoading] = useState(true);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const response = await fetch(`${BASE_URL}/holidays/get/all-holidays`);
        const data = await response.json();

        const monthMap = {};

        data.forEach((holiday) => {
          if (holiday.optional) {
            const dateObj = new Date(holiday.year);
            const monthIndex = dateObj.getMonth(); // 0-based index
            const monthName = months[monthIndex];

            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const dayName = dayNames[dateObj.getDay()];
            const date = String(dateObj.getDate()).padStart(2, "0");

            if (!monthMap[monthName]) {
              monthMap[monthName] = [];
            }

            monthMap[monthName].push({
              day: dayName,
              date: date,
              title: holiday.holidays,
              icon: "📅",
            });
          }
        });

        setHolidayData(monthMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching holiday data:", error);
        setLoading(false);
      }
    }

    fetchHolidays();
  }, []);

  return (
    <section>
      {/* Month Tabs */}
      <div
        className="w-full h-[54px] rounded-[16px] bg-[#F5F5F5] flex items-center px-1 sm:px-2 gap-x-1 overflow-x-auto whitespace-nowrap mb-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {months.map((month, index) => (
          <button
            key={index}
            onClick={() => setActiveMonth(month)}
            className={`min-w-[70px] sm:min-w-[85px] h-[35px] rounded-[20px] text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeMonth === month
                ? "bg-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.16)]"
                : "bg-transparent"
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Holiday Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {loading ? (
          <p className="col-span-full text-sm text-gray-500">Loading holidays...</p>
        ) : holidayData[activeMonth]?.length ? (
          holidayData[activeMonth].map((holiday, index) => (
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
                    {activeMonth}
                  </div>
                </div>
                <div className="text-4xl">{holiday.icon}</div>
              </div>

              <div className="mt-6 text-base text-[#1A1A1A] font-semibold">
                {holiday.title}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-sm text-gray-500">
            No holidays in this month.
          </p>
        )}
      </div>

      {/* Footer Note */}
      <div className="mt-8 border border-[#923A39] text-[#923A39] bg-white rounded-xl px-4 py-3 flex items-start gap-2 text-sm">
        <span className="text-xl">⭐</span>2 optional holidays in the year to be
        availed from the above bucket list other than the fixed holidays.
      </div>
    </section>
  );
}
