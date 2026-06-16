import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import cmslogo from '../assets/cmslogo.png';
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

const moods = [
  { label: "Sad", emoji: "😞" },
  { label: "Neutral", emoji: "🙂" },
  { label: "Happy", emoji: "😁" },
];

export default function MoodSelector() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [eCode, setEcode] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    // Fetches name and ecode from localStorage
    const storedName = localStorage.getItem("firstName") || "";
    const storedEcode = localStorage.getItem("empId") || "";
    setEcode(storedEcode);
    setName(storedName);

    // Optional: Add a check here to handle cases where ecode is missing
    if (!storedEcode) {
      console.warn("Employee code not found in localStorage. Please log in again.");
      // You could redirect to a login page or show an error message
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async () => {
    // Check if both mood and ecode are present before making the API call
    if (selectedMood && eCode) {
      try {
        const payload = {
          name: name,
          eCode: eCode,
          mood: selectedMood,
        };
        const response = await axios.post("http://43.205.24.208:9050/api/moods/save", payload);
        console.log("Mood saved successfully:", response.data);
        // You can add a success message or redirect here
        navigate("/Dashboard");
      } catch (error) {
        console.error("Error saving mood:", error);
        // Handle error (e.g., show an error message to the user)
      }
    } else {
      // Alert the user if ecode or mood is missing
      alert("Please select a mood and ensure your employee code is available.");
      console.error("Cannot submit: Either mood or ecode is missing.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 md:px-12">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center md:items-start justify-between">
        {/* Text Section */}
        <div className="text-left md:w-1/2 mb-12 md:mb-0">
          <a href="https://www.cms.co.in/" target="_blank" rel="noopener noreferrer">
            <img src={cmslogo} alt="CMS Logo" className="h-14 mb-6" />
          </a>
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900">
            Hello {name},
          </h1>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mt-1">
            how are you feeling <span className="font-bold">today?</span>
          </h2>
        </div>

        {/* Mood Selector Section */}
        <div className="md:w-1/2 flex flex-col items-center">
          {/* Meter Container */}
          <div className="relative w-[420px] h-[240px]">
            {/* Background Semi Circle */}
            <div className="w-full h-full rounded-t-full bg-gradient-to-r from-purple-900 via-pink-600 to-red-400 relative flex justify-center items-end pt-10">
              {/* Mood Icons */}
              <div className="absolute top-8 left-0 right-0 z-20">
                <div className="relative w-full h-full">
                  {/* Sad */}
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMood("Sad")}
                    className={`absolute left-10 top-24 cursor-pointer flex flex-col items-center transition-transform duration-300 ${selectedMood === "Sad" ? "scale-125" : "scale-100"}`}
                  >
                    <div className={`text-4xl ${selectedMood === "Sad" ? "ring-2 ring-white rounded-full" : ""}`}>
                      😞
                    </div>
                  </motion.div>

                  {/* Neutral */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-4 flex flex-col items-center">
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedMood("Neutral")}
                      className={`w-14 h-14 flex items-center justify-center text-4xl cursor-pointer transition-transform duration-300 ${selectedMood === "Neutral" ? "scale-125 ring-2 ring-white rounded-full" : ""}`}
                    >
                      🙂
                    </motion.div>
                  </div>

                  {/* Happy */}
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMood("Happy")}
                    className={`absolute right-10 top-24 cursor-pointer flex flex-col items-center transition-transform duration-300 ${selectedMood === "Happy" ? "scale-125" : "scale-100"}`}
                  >
                    <div className={`text-4xl ${selectedMood === "Happy" ? "ring-2 ring-white rounded-full" : ""}`}>
                      😁
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Center Cut Circle */}
              <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-white rounded-full z-10"></div>

              {/* Mood Display */}
              {selectedMood && (
                <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[180px] h-[180px] flex flex-col justify-center items-center z-20">
                  <div className="text-6xl">
                    {moods.find((m) => m.label === selectedMood)?.emoji}
                  </div>
                  <p className="text-4xl font-medium mt-2 text-black">
                    {selectedMood}
                  </p>
                </div>
              )}

              {/* Top Arrow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[18px] border-l-transparent border-r-transparent border-b-red-500 z-30"></div>
            </div>
          </div>

          {/* Button */}
          <button
            // Button is now disabled if selectedMood is null OR ecode is an empty string
            onClick={handleSubmit}
            disabled={!selectedMood || !eCode}
            className={`mt-24 px-20 py-3 text-white text-lg font-semibold rounded-full transition-all duration-300 ${selectedMood && eCode ? "bg-red-600 hover:bg-red-700 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
          >
            SET MOOD
          </button>
        </div>
      </div>
    </div>
  );
}