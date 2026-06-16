import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import VideoPlayer from "./VideoPlayer";
import videoData from "./data/videoData";
import Header from "../components/Header";
import { Link } from 'react-router-dom';
const CDLModulePage = () => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
 useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);
  const handleVideoComplete = () => {
    if (!completedModules.includes(currentModuleIndex)) {
      setCompletedModules([...completedModules, currentModuleIndex]);
    }
    setVideoCompleted(true);
  };

  const handleNext = () => {
    if (currentModuleIndex < videoData.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setVideoCompleted(false);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setVideoCompleted(completedModules.includes(currentModuleIndex - 1));
      setProgress(0);
    }
  };

  const currentVideo = videoData[currentModuleIndex];

  return (
    <>
      <Header />
      <div className="p-6 md:px-10 md:py-0 min-h-[calc(100vh-64px)]">
      
<div className="text-gray-600 text-sm mb-4 mt-24">
  <Link to="/Dashboard" className="text-black hover:underline">Home</Link> / <span className="text-black font-semibold">Induction</span>
</div>

<h1 className="text-2xl font-semibold mb-6">Induction</h1>

        <div className="flex items-start">
          {/* Sidebar */}
          <div
            className="relative text-white py-14 px-4"
            style={{
              width: "380px",
              backgroundColor: "#DC3545",
              borderTopRightRadius: "38px",
              borderBottomRightRadius: "38px",
              minHeight: "100%",
              height: "auto",
            }}
          >
            <div className="pl-6 pr-6">
              {videoData.map((module, index) => (
                <div key={index} className="mb-4 flex items-start justify-between">
                  <div className="text-right text-white">
                    <div
                      className={`font-raleway font-bold text-base leading-[48px] tracking-normal ${index === currentModuleIndex ? "underline" : ""
                        }`}
                    >
                      Module {index + 1}
                    </div>
                  </div>

                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-md font-bold shadow-md mt-1 ml-6 z-40 ${completedModules.includes(index)
                        ? "bg-green-100 text-green-600"
                        : "bg-white text-gray-700"
                      }`}
                  >
                    {completedModules.includes(index) ? <FaCheck /> : index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Section */}
          <div
            className="flex-1 bg-white shadow-xl px-16 pt-8 pb-4 relative z-10"
            style={{
              marginLeft: "-58px",
              marginTop: "36px",
              marginBottom: "0px",
              minHeight: "950px", // Dynamic layout
              height: "auto",
            }}
          >
            <div className="flex space-x-6 pb-2 mb-4 font-semibold text-gray-700 mt-40">
              <span className="border-b-2 border-black pb-1">Video</span>
              <span className="opacity-50 cursor-not-allowed">Assessment</span>
            </div>

            <div className="h-[calc(100%+65px)]">
              <VideoPlayer
                videoUrl={currentVideo.videoUrl}
                onComplete={handleVideoComplete}
                isActive={true}
                onProgress={setProgress}
              />
            </div>


            <div className="mt-6 flex items-center justify-between space-x-4">
              <div className="flex-1 flex items-center space-x-4">
                <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{progress}% watched</span>
              </div>

              <div className="flex-shrink-0 flex space-x-2">
                <button
                  className="border border-red-500 text-red-500 px-6 py-2 rounded-full"
                  onClick={handlePrev}
                  disabled={currentModuleIndex === 0}
                >
                  Prev
                </button>
                <button
                  className={`bg-red-500 text-white px-6 py-2 rounded-full ${!videoCompleted ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={handleNext}
                  disabled={!videoCompleted}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CDLModulePage;
