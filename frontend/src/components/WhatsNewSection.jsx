import React, { useState } from "react";
import Carousel from "react-multi-carousel"; // This import is not used in the provided code snippet, but kept
import "react-multi-carousel/lib/styles.css"; // This import is not used in the provided code snippet, but kept
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './WhatsNewSection.css'; // Assuming this CSS file exists and contains relevant styles
import blIcon from "../assets/1 (1).png";
import cIcon from "../assets/2.png";
import sIcon from "../assets/3 (3).png";
import { useNavigate } from "react-router-dom";
import TestimonialPopup from "./TestimonialPopup"; // Assuming TestimonialPopup is a valid React component

const whatsNewData = [
  {
    title: "Employee Testimonials",
    desc: "People-powered stories that inspire and connect.",
    img: sIcon,
  },
  {
    title: "Blogs",
    desc: "Voices from within — read, reflect, and contribute.",
    img: blIcon,
    isNew: true, // Added a flag to indicate this item should have the 'New!' badge
  },
  {
    title: "Social Corner",
    desc: "A look into our culture, beyond the desk.",
    img: cIcon,
  },
];

const showComingSoon = () => {
  toast.info("🚧 Coming Soon!", {
    position: "top-right",
    autoClose: 3000,
    style: {
      background: "#f5f3ff",
      color: "#7c3aed",
      fontWeight: "500",
      borderRadius: "10px",
    },
  });
};

const WhatsNewSection = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (title) => {
    if (title === "Employee Testimonials") {
      setShowPopup(true);
    } else if (title === "Blogs") {
      navigate('/blogs');
    } else if (title === "Social Corner") {
      navigate('/social-corner');
    } else {
      showComingSoon();
    }
  };

  return (
    <>
      {/* Custom CSS for the flashing animation */}
      <style>
        {`
          @keyframes flash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-flash {
            animation: flash 1.5s infinite;
          }
        `}
      </style>

      <section id="whatsNewSection" className="w-full mx-auto mt-12 max-w-7xl px-4">
        <h1 className="text-5xl font-header font-semibold text-[#7b2c2c] mb-10">
          What's New
        </h1>

        {/* Cards in a grid without scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatsNewData.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(item.title)}
              className="h-[420px] bg-gray-100 rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer border border-red-600 p-4 flex flex-col relative" // Added 'relative' for absolute positioning of the badge
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-[250px] object-cover rounded-md"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="font-semibold font-header text-xl mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm font-header">{item.desc}</p>
              </div>
              {item.isNew && ( // Conditionally render the 'New!' badge
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-flash">
                  New!
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40">
          <TestimonialPopup onClose={() => setShowPopup(false)} />
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default WhatsNewSection;
