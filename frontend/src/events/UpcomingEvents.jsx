import React, { useState } from "react";
import womenDay from "../assets/womenDay.png";
import vl from "../assets/vl.jpg";
import cycling from "../assets/thumbnail_Cycling Event 25_ Nominations (1).jpg";
import independence from "../assets/Independence day -Post 3.jpg";
import christmas from "../assets/christmas.jpg";
const upcomingEvents = [
  {
    date: "04",
    month: "JUNE",
    year: "2025",
    title: "Celebrate Fitness with Ride",
    description: "Embrace a healthy lifestyle and join us for a fun and energizing cycling experience, build camaraderie, and celebrate fitness together.",
    image: cycling,
  },
   {
    date: "15",
    month: "AUG",
    year: "2025",
    title: "Independence Day Celebrations",
    description: "Join us in honoring our nation's journey to freedom with a day of patriotic spirit, cultural performances, and flag hoisting.",
    image: independence,
  },
 {
  date: "20",
  month: "DEC",
  year: "2025",
  title: "Christmas Celebrations",
  description: "Experience the joy of the season with festive decorations, fun games, Secret Santa, and a warm holiday gathering full of cheer and togetherness.",
  image: christmas,
}
];

const UpcomingEvents = () => {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const selectedEvent = upcomingEvents[selectedEventIndex];

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6 min-h-[400px] px-4">
      {/* Left side: fixed width on md+ screens, full width on small screens */}
      <div className="flex flex-col gap-4 w-full md:w-[350px] md:min-w-[350px]">
        {upcomingEvents.map((event, index) => (
          <div
            key={index}
            onClick={() => setSelectedEventIndex(index)}
            className={`flex items-center p-4 rounded-xl shadow-md cursor-pointer bg-white ${
              index === selectedEventIndex ? "border-2 border-grey-900" : ""
            }`}
          >
            <div className="text-center text-grey-900 font-bold mr-4">
              <div className="text-3xl">{event.date}</div>
              <div className="uppercase">{event.month}</div>
              <div className="text-sm text-gray-500">{event.year}</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right side: image fills remaining space */}
 <div className="flex-grow w-full flex items-center justify-center">
  {selectedEvent && (
    <img
      src={selectedEvent.image}
      alt={selectedEvent.title}
      className="rounded-2xl max-h-[500px] w-auto object-contain shadow-lg"
    />
  )}
</div>

    </div>
  );
};

export default UpcomingEvents;
