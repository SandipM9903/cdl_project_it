import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { X } from 'lucide-react';

// Import your assets
import rnrIcon from '../assets/rnr.jfif';
import trendingIcon from '../assets/trending.jfif';
import hrIcon from '../assets/hr.jfif';
import introImage1 from '../assets/HR Communication/Lanyard Communication A.jpg'; // Verify this path and image existence
import introImage2 from '../assets/HR Communication/Mandatory wearing ID Card.jpg'; // Verify this path and image existence

// Route for your main Announcements Dashboard
const COMMUNICATIONS_DASHBOARD_ROUTE = '/announcementDashboard';

const BulletinCard = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showCommunicationsIntroPopup, setShowCommunicationsIntroPopup] = useState(false);
  const [currentIntroImageIndex, setCurrentIntroImageIndex] = useState(0);

  const communicationsIntroImages = [
    { src: introImage1, caption: "Internal Communication: Our Colour-Coded Lanyards" },
    { src: introImage2, caption: "Mandatory ID Card" },
  ];

  const handleCommunicationsClick = () => {
    if (communicationsIntroImages.length > 0) {
      setCurrentIntroImageIndex(0);
      setShowCommunicationsIntroPopup(true);
    } else {
      toast.info("No introductory communications defined. Redirecting.", { autoClose: 2000 });
      navigate(COMMUNICATIONS_DASHBOARD_ROUTE);
    }
  };

  const handleNextIntroImage = () => {
    if (currentIntroImageIndex < communicationsIntroImages.length - 1) {
      setCurrentIntroImageIndex(prevIndex => prevIndex + 1);
    } else {
      setShowCommunicationsIntroPopup(false);
      navigate(COMMUNICATIONS_DASHBOARD_ROUTE);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showCommunicationsIntroPopup) {
        event.preventDefault();
        toast.info("This section is mandatory to view. Please click Next.", { autoClose: 2000 });
      }
    };

    if (showCommunicationsIntroPopup) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevents body scroll when modal is open
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showCommunicationsIntroPopup]);

  const announcementDashboard = () => {
    navigate(COMMUNICATIONS_DASHBOARD_ROUTE);
  };
  const onClickEvent = () => {
    navigate("/events");
  };
  const onClickTrending = () => {
    navigate("/trending");
  };

  const truncateWords = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + " ...";
  };

  const images = [
    "/HR_Communication-Provisional Investment Declaration form for FY 2025-26.jpg",
    "/Reminder-Provisional Investment Declaration form for FY 2025-26.jpg",
    "/IT helpdesk portal.jpg",
    "/We Care B_07-04-25.jpg",
    "/ERP 05-04-2025-Other.jpg"
  ];

  const handleClickLeadership = () => {
    navigate("/executive");
  };

  const handleClickExecutive = () => {
    navigate("/leadership");
  };

  const showComingSoon = () => {
    toast.info("🚧 Coming Soon!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      style: {
        background: "#f5f3ff",
        color: "#7c3aed",
        fontWeight: "500",
        borderRadius: "10px",
      },
    });
  };

  const fullText = `
    Imagineer the Future. With the physical and Digital world converging, offerings across industries are being enhanced with digital capabilities. As digital transformation and business automation accelerate, clients expect an immersive experience. This requires a slew of technologies including Web 3.0, Gen AI, Cloud, AI, ML, Blockchain, 5G/6G connectivity, LCAP, Quantum, Metaverse etc. Assembling this jigsaw of Software, Applications, Cloud and AI is complex and requires Innovation and deep Engineering expertise. We call it Imagineering.

    In 2025, we operate in a world where the global economy, while resilient as inflation and war fears subsides, continues to face uncertainty due to persistent geopolitical challenges. Against this backdrop, we are steadfastly positioning ourselves as a Top tier digital services and software company. We have been speaking of being a software business for few years now. Last year, we truly started getting a move on in Software. 2024 was a year where every solved problem mattered - for the business as well as the impact we created for several marquee clients. Increasingly, we engaged with clients at much larger scale and implemented complex technology solutions.

    The pivot to software and Digital makes us stronger than ever, though there are miles to go with strong engineering and innovation. As an organisation, our focus should be on building an adaptable operational foundation, one capable of thriving amidst rapid technology change. The way to go about is by overcoming challenges, pushing limits, and doing it alongside people who care deeply.

    This direction calls for a set of action:

    Get closer to clients and understand their business better.
    Build Deep expertise in software and digital technologies built around our domains – eGovernance, Crime Intelligence & Forensics, Financial Inclusion, Healthcare, Agriculture, Smart Cities, Ports, Energy and Climate Resilience.
    Change and Expertise accelerates through cross functional teams and Ecosystems of technology partners. We need to be agile and market responsive to grab opportunities with partners.
    Laser sharp focus backed by regular governance will instil disciplined execution. As a project driven organisation, getting “right first time” is extremely crucial.

    2025 is all about “what’s more” – as we build the future with Engineering and Imagination.
  `;

  const truncatedText = fullText.substring(0, 150) + " ...";
  const videos = [
    "/Green Geometric Blank A4 Document Landscape (1).mp4",
    "/CMS Corporate Video_ Short.mp4",
    "/Legacy video_Short.mp4",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full">
        <div className="flex flex-col lg:flex-row gap-6 w-full">

          {/* Leadership Bulletin */}
          <div className="flex-1 lg:flex-[0.25] min-w-0 pr-4 space-y-4 ">
            <h2 className="text-2xl font-header font-semibold text-gray-800 mb-2">Executive Insights</h2>

            <p className="text-gray-600 text-sm leading-relaxed font-content">
              {truncatedText}{" "}
              <span
                onClick={() => navigate("/executive-insights-page")}
                className="text-red-600 cursor-pointer font-semibold hover:underline"
              >
                Read More
              </span>
            </p>

            <button
              onClick={handleClickLeadership}
              className="bg-red-500 text-white px-8 py-2 rounded-full text-sm hover:bg-red-600"
            >
              Management Insights
            </button>
            <button
              onClick={handleClickExecutive}
              className="bg-white text-black border border-black px-10 py-2 rounded-full text-sm hover:bg-red-600 hover:text-white "
            >
              Leadership Forum
            </button>
          </div>

          <div className="flex-1 lg:flex-[0.5] min-w-0 mt-2">
            <Slider {...settings}>
              {videos.map((video, index) => (
                <div key={index} className="bg-gray-200 rounded-lg overflow-hidden h-[220px] md:h-[280px]">
                  <video
                    src={video}
                    controls
                    className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </Slider>
          </div>

          <div className="flex-1 lg:flex-[0.3] min-w-0 pl-4 space-y-4 text-sm">
            <h2 className="text-2xl font-header font-semibold text-gray-800 mb-2">Employee Bulletin</h2>
            <div className="space-y-3">
              <div
                className="flex items-start space-x-4 cursor-pointer hover:shadow-md rounded-md"
                onClick={handleCommunicationsClick}
              >
                <div className="relative w-24 h-16 flex-shrink-0">
                  <img
                    src={hrIcon}
                    alt="HR"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-black flex items-center">
                    Communication
                    <span className="ml-2 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.3 rounded z-10 shadow">
                      NEW
                    </span>
                  </h3>
                  <p className="text-gray-600 text-sm font-content">
                    {truncateWords("Key updates and announcements", 5)}
                  </p>
                </div>
              </div>

              <div
                className="flex items-start space-x-4 cursor-pointer hover:shadow-md rounded-md"
                onClick={onClickEvent}
              >
                <img src={rnrIcon} alt="Events" className="w-24 h-16 rounded-md object-cover mb-2" />
                <div>
                  <h3 className="font-semibold text-black">Events</h3>
                  <p className="text-gray-600 text-sm font-content">
                    {truncateWords("Your front-row seat to everything", 5)}
                  </p>
                </div>
              </div>
              <div
                className="flex items-start space-x-4 cursor-pointer hover:shadow-md rounded-md"
                onClick={onClickTrending}
              >
                <img src={trendingIcon} alt="Trending" className="w-28 h-16 rounded-md object-cover mb-2" />
                <div>
                  <h3 className="font-semibold text-black">What's Trending</h3>
                  <p className="text-gray-600 text-sm font-content">
                    {truncateWords("around the workplace!", 5)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />

      {/* Communications Intro Popup Modal */}
      {showCommunicationsIntroPopup && communicationsIntroImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main modal content area */}
          <div
            className="w-full max-w-2xl max-h-[95vh] bg-white rounded-lg shadow-2xl flex flex-col relative overflow-hidden" // Increased max-h, added overflow-hidden
            onClick={e => e.stopPropagation()}
          >
            {/* Top Overlay Bar for Title and Disabled Close Button */}
            <div className="flex-shrink-0 p-4 bg-gray-900 bg-opacity-90 text-white flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold truncate"> {/* Added truncate */}
                {communicationsIntroImages[currentIntroImageIndex].caption}
              </h2>
              <button
                className="text-gray-400 cursor-not-allowed"
                disabled
              >
                <X size={24} />
              </button>
            </div>

            {/* Image/Content Display Area - Now truly scrollable for content */}
            <div className="flex-grow flex items-start justify-center overflow-y-auto p-4"> {/* Changed items-center to items-start for top alignment */}
              <img
                src={communicationsIntroImages[currentIntroImageIndex].src}
                alt={communicationsIntroImages[currentIntroImageIndex].caption}
                className="w-full h-auto object-contain" // w-full and h-auto to respect aspect ratio
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available"; console.error("Error loading intro image:", communicationsIntroImages[currentIntroImageIndex].src); }}
              />
            </div>

            {/* Bottom Overlay Bar for Message and Next Button */}
            <div className="flex-shrink-0 p-4 bg-gray-900 bg-opacity-90 text-white flex flex-col items-center rounded-b-lg">
              <p className="text-center text-sm mb-4">
                Please review this important communication.
              </p>
              <button
                onClick={handleNextIntroImage}
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition duration-300"
              >
                {currentIntroImageIndex === communicationsIntroImages.length - 1 ? "Proceed to Dashboard" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulletinCard;