import React, { useState } from "react";
import "./BreadCrumb.css";
import PastEvents from "./PastEvents";
import UpcomingEvents from "./UpcomingEvents";
import Header from "../components/Header";
import womenDay from "../assets/womenDay.png";
import AnnualMeet from "./AnnualMeet";

import Event1 from "../assets/Events/eve1.jpeg";
import Event2 from "../assets/Events/eve2.jpeg";
import Event3 from "../assets/Events/eve3.jpeg";
import Event4 from "../assets/Events/eve4.jpeg";
import Event5 from "../assets/Events/eve5.jpeg";
import Event6 from "../assets/Events/eve6.jpeg";
import Event7 from "../assets/Events/eve7.jpeg";
import Event8 from "../assets/Events/eve8.jpeg";
import Event9 from "../assets/Events/eve9.jpeg";
import Event10 from "../assets/Events/eve10.jpeg";
import Event11 from "../assets/Events/eve11.jpeg";
import Event13 from "../assets/Events/eve12.jpeg";
import Event14 from "../assets/Events/eve13.jpeg";
import Event15 from "../assets/Events/eve14.jpeg";
import Event16 from "../assets/Events/eve15.jpeg";
import { Link } from "react-router-dom";

const defaultImages = [Event1, Event2, Event3, Event4, Event5, Event6, Event7, Event8, Event9, Event10, Event11, Event13, Event14, Event15, Event16, womenDay];

const Events = () => {
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (img) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="px-4 mt-24 sm:px-8 md:px-[18px] min-h-screen flex flex-col text-sm">
        {/* Breadcrumb */}
        <div className="breadcrumb mt-4 text-sm text-[#777] font-medium">
          <Link to="/dashboard" className="hover:underline text-[#777]">Home</Link> /{' '}
          <Link to="/events" className="hover:underline text-[#777]">Events</Link> /{' '}
          <span className="text-black">
            {selectedEventType === "past"
              ? "Past Events"
              : selectedEventType === "upcoming"
                ? "Upcoming Events"
                : selectedEventType === "annual"
                  ? "Annual Meet"
                  : ""}
          </span>
        </div>

        {/* Header and Buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-8 space-y-4 md:space-y-0 mt-6">
          <h1 className="text-[30px] md:text-[32px] text-[#282828] font-raleway font-bold">
            Events
          </h1>

          <div className="font-raleway flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-5">
            <button
              onClick={() => setSelectedEventType("upcoming")}
              className={`w-full sm:w-[180px] px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-gray-100 text-center ${selectedEventType === "upcoming"
                  ? "bg-[#f5f5f5] font-semibold"
                  : ""
                }`}
            >
              Upcoming Events
            </button>

            <button
              onClick={() => setSelectedEventType("past")}
              className={`w-full sm:w-[180px] px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-gray-100 text-center ${selectedEventType === "past"
                  ? "bg-[#f5f5f5] font-semibold"
                  : ""
                }`}
            >
              Past Events
            </button>

            <button
              onClick={() => setSelectedEventType("annual")}
              className={`w-full sm:w-[180px] px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-gray-100 text-center ${selectedEventType === "annual"
                  ? "bg-[#f5f5f5] font-semibold"
                  : ""
                }`}
            >
              Annual Meet
            </button>
          </div>
        </div>

        {/* Conditional Component Rendering */}
        <div className="mt-6 flex-grow">

          {selectedEventType === "past" && <PastEvents />}
          {selectedEventType === "upcoming" && <UpcomingEvents />}
          {selectedEventType === "annual" && <AnnualMeet />}
          {selectedEventType === null && <UpcomingEvents />}



          {/* {selectedEventType === null && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-[#7f2121]">
                Ayurvedic Health Camp 2023
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {defaultImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Event ${index + 1}`}
                    className="rounded cursor-pointer object-cover w-full h-40"
                    onClick={() => openModal(img)}
                  />
                ))}
              </div>
            </div>
          )} */}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 focus:outline-none"
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Enlarged"
                className="max-h-[90vh] max-w-[90vw] rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
