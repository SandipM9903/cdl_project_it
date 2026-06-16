import React, { useState, useEffect } from "react";
import { FaUserGraduate, FaFileAlt, FaCheckCircle, FaInfoCircle, FaWpforms, FaUserMinus } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import pzIcon from '../assets/pz.jfif';
import pz1Icon from '../assets/pz1.jfif';
import vlIcon from '../assets/vl.jpg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EssentialsSection.css'
import ind from '../assets/Icons/ind.png';
import infohub from '../assets/Icons/infohub.png';
import policies from '../assets/Icons/Policies.png';
import kyc from '../assets/Icons/kyc.png';
import forms from '../assets/Icons/forms.png';
import more from '../assets/Icons/more.png';
import reports from '../assets/reports.png';
import posh from '../assets/Icons/Posh.png';

const EssentialsSection = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);
  const [showCSRModal, setShowCSRModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [isCmsManager, setIsCmsManager] = useState(false);
  // New state for the specific employee ID
  const [isSpecificEmployee9083522, setIsSpecificEmployee9083522] = useState(false);
  const [showPoshDropdown, setShowPoshDropdown] = useState(false);

  const [showMore, setShowMore] = useState(false);

  const handleClickForms = () => {
    navigate("/forms")
  }

  const handleClick1 = () => {
    setShowMore(prev => !prev);
  };

  const handleKyc = () => {
    navigate("/kyc")
  }

  const handleFlip = (cardName) => {
    setFlippedCard(flippedCard === cardName ? null : cardName);
  };

  const handleClickInfoHub = () => {
    navigate("/infohub")
  }

  // Effect to parse and set user roles and access flags
  useEffect(() => {
    const roleListRaw = sessionStorage.getItem('role');
    const empId = localStorage.getItem("empId"); // Get empId from localStorage

    let roles = [];

    try {
      roles = JSON.parse(roleListRaw);
      if (!Array.isArray(roles)) {
        roles = roleListRaw?.split(',') || [];
      }
    } catch {
      roles = roleListRaw?.split(',') || [];
    }

    setUserRoles(roles);
    setIsCmsManager(roles.includes('CMS Manager'));
    // Set specific employee flag (9085176 or 9083522)
    setIsSpecificEmployee9083522(empId === '9085176' || empId === '9083522' || empId === '9083095' || empId === '9085119');

  }, []);


  const handleClickPolicies = () => {
    navigate('/Policies');
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

  const handleClick = (title) => {
    if (title === 'Separations') {
      sessionStorage.setItem("workflowName", "E-Separation");
      navigate('/ExitForm');
    } else {
      alert(`${title} clicked`);
    }
  };

  const handleClickApprovals = () => {
    navigate('/approvals/Exit%20Request');
  };

  const handleClickInduction = () => {
    navigate("/Induction")
  }

  const handleDropdownOption = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  const offers = [
    "./Eat Sure.jpg",
    "./Big Basket Banner2.jpg",
    "./Bodhi Spa_Header.jpg",
    "./Finch Banner.jpg",
    "./Panasonic_banner.jpg"
  ];
  const fullSizeOffers = [
    "./Eat Sure Mailer.jpg",
    "./Big Basket Creative2.jpg",
    "./Mailer_Bodhi Spa.jpg",
    "./1 Mailer_web.jpg",
    "./Panasonic CEPP Program.jpg"
  ];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Determine if Workspace should be clickable based on roles or specific employee ID
  const isWorkspaceClickable = isCmsManager || isSpecificEmployee9083522;

  // ✅ Combined flags
  const showEmployeeInfoApproval = isSpecificEmployee9083522;
  const showHrItems = isCmsManager || isSpecificEmployee9083522;

  return (
    <section className="w-full mx-auto mt-5">
      <h1 className="text-5xl font-header font-semibold text-[#7b2c2c] mb-10">Essentials</h1>
      <ToastContainer />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">

        {/* Induction */}
        <div
          onClick={handleClickInduction}
          className="cursor-pointer rounded-xl shadow p-4 flex flex-col justify-center items-center text-center bg-red-500 hover:shadow-lg"
        >
          <div className="bg-white rounded-full p-7 mb-5 shadow">
            <img src={ind} alt="ind" style={{ width: '45px', height: '45px' }} />
          </div>
          <h3 className="font-semibold text-white font-content">Induction</h3>
        </div>


        {/* POSH Dropdown */}
        <div
          className="relative bg-white rounded-xl shadow p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg"
          onClick={() => setShowPoshDropdown((prev) => !prev)}
        >
          <div className="bg-red-500 rounded-full p-7 mb-5 shadow">
            <img src={posh} alt="posh" style={{ width: '45px', height: '45px' }} />
          </div>

          <div className="flex items-center justify-center gap-1">
            <h3 className="font-semibold text-gray-700 font-content">POSH</h3>
            <IoMdArrowDropdown className="text-lg text-gray-700" />
          </div>

          {showPoshDropdown && (
            <div className="
      absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
      w-44 bg-white border border-gray-200 shadow-lg rounded-xl z-20
    ">
              {/* POSH Course FIRST */}
              <div
                onClick={() =>
                  window.open('https://cdl.cms.co.in/lms/course/view.php?id=432', '_blank')
                }
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 rounded-t-xl"
              >
                <span className="font-medium text-gray-700 font-content text-sm">
                  POSH Course
                </span>
              </div>

              {/* POSH Form SECOND */}
              <div
                onClick={() => window.open('/forms',)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 rounded-b-xl"
              >
                <span className="font-medium text-gray-700 font-content text-sm">
                  POSH Form
                </span>
              </div>
            </div>
          )}
        </div>



      {/* Workspace */}
<div
  className="relative bg-red-500 rounded-xl shadow p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg"
  onClick={() => setShowDropdown(prev => !prev)}    // Always clickable
>
  <div className="bg-white rounded-full p-7 mb-5 shadow">
    <img src={kyc} alt="workspace" style={{ width: '45px', height: '45px' }} />
  </div>
  <div className="flex items-center justify-center gap-1">
    <h3 className="font-semibold text-white font-content">Workspace</h3>
    <IoMdArrowDropdown className="text-lg text-white" />
  </div>

  {showDropdown && (
    <div className="absolute top-full mt-2 left-1/2 text-xs transform -translate-x-1/2 w-40 bg-white border border-gray-200 shadow-lg rounded-xl z-20">

      {/* Employee Info Approval → only for specific employees */}
      {showEmployeeInfoApproval && (
        <div
          onClick={() => handleDropdownOption('/employee-info-approval')}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 rounded-t-xl"
        >
          <span className="font-medium text-gray-700 font-content">
            Emp Info Update
          </span>
        </div>
      )}

      {/* HR Action Center → only for CMS Manager OR specific employee */}
      {(isSpecificEmployee9083522) && (
        <div
          onClick={() => {
            sessionStorage.setItem("workflowName", "E-Separation");
            handleDropdownOption('/hrdash');
          }}
          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 
            ${!showEmployeeInfoApproval ? 'rounded-t-xl' : ''}`}
        >
          <span className="font-medium text-gray-700 font-content">HR Action Center</span>
        </div>
      )}

      {/* Clearance & Approvals → ONLY for CMS Manager (not specific employee) */}
      {isCmsManager && (
        <div
          onClick={() => handleDropdownOption('/exitDepartmentFNFLists')}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 rounded-b-xl"
        >
          <span className="font-medium text-gray-700 font-content">Clearance & Approvals</span>
        </div>
      )}

    </div>
  )}
</div>


        {/* Deals & Offers */}
        <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg md:col-span-3">
          <h3 className="font-semibold mb-2 font-content">Deals & Offers</h3>
          <Slider {...settings}>
            {offers.map((offer, index) => (
              <div key={index} className="w-full h-20 flex justify-center items-center">
                <img
                  src={offer}
                  alt={`Offer ${index + 1}`}
                  className="w-full h-20 object-cover rounded"
                />
              </div>
            ))}
          </Slider>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm mt-2">Get the latest offers here</p>
            <button
              onClick={() => setShowOffersModal(true)}
              className="mt-2 bg-red-500 text-white px-2 py-2 rounded-full text-xs hover:bg-red-600 font-content"
            >
              Download & Order
            </button>
          </div>
        </div>

        {/* CSR */}
        <div
          onClick={() => setShowCSRModal(true)}
          className={`relative cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 md:col-span-3 ${showMore ? "md:row-span-2 h-[375px]" : "h-[176px]"}`}
        >
          <Slider
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={2500}
            arrows={false}
          >
            {["./CMMI Certification/new1.jpg", "./CMMI Certification/new2.jpg", "./CMMI Certification/new4.jpg", "./CMMI Certification/new5.jpg", "./CMMI Certification/new6.jpg", "./CMMI Certification/new7.jpg", "./CMMI Certification/new3.jpg", "./csr11.png", "./csr12.png", "./Group Photo.jpeg"].map((src, idx) => (
              <div key={idx} className="w-full h-full overflow-hidden relative">
                <img
                  src={src}
                  alt={`CSR ${idx + 1}`}
                  className="w-full h-[264px] object-cover object-bottom transform -translate-y-1/4"
                />
              </div>
            ))}
          </Slider>

          <span className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
            Did You Know?
          </span>
        </div>

        {/* InfoHub */}
        <div
          onClick={handleClickInfoHub}
          className="cursor-pointer bg-red-500 rounded-xl shadow p-4 flex flex-col justify-center items-center text-center hover:shadow-lg"
        >
          <div className="bg-white rounded-full p-7 mb-5 shadow">
            <img src={infohub} alt="infohub" style={{ width: '45px', height: '45px' }} />
          </div>
          <h3 className="font-semibold text-white font-content">InfoHub</h3>
        </div>

        {/* KYC */}
        <div className="cursor-pointer bg-white rounded-xl shadow p-4 flex flex-col justify-center items-center text-center hover:shadow-lg">
          <div className="bg-red-500 rounded-full p-7 mb-5 shadow" onClick={handleKyc}>
            <img src={forms} alt="kyc" style={{ width: '45px', height: '45px' }} />
          </div>
          <h3 className="font-semibold text-gray-700 font-content">KYC</h3>
        </div>

        {/* Reports (Now in place of More) */}
        <div className="cursor-pointer bg-red-500 rounded-xl shadow p-4 flex flex-col justify-center items-center text-center hover:shadow-lg">
          <div className="bg-white rounded-full p-7 mb-5 shadow" onClick={() => navigate('/reports')}>
            <img src={reports} alt="reports" style={{ width: '45px', height: '45px' }} />
          </div>
          <h3 className="font-semibold text-white font-content">Reports</h3>
        </div>
      </div>

      {/* Modals */}
      {showOffersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            className="absolute top-6 right-6 text-white text-3xl font-bold z-50 hover:text-red-400"
            onClick={() => setShowOffersModal(false)}
          >
            &times;
          </button>
          <div className="w-[90%] md:w-[60%] max-h-[90vh]">
            <Slider {...settings}>
              {fullSizeOffers.map((src, idx) => (
                <div key={idx} className="flex items-center justify-center w-full h-full">
                  <img src={src} alt={`Full Offer ${idx + 1}`} className="max-h-[90vh] max-w-full object-contain mx-auto" />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      {showCSRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-6 text-white text-3xl font-bold z-50 hover:text-red-400"
            onClick={() => setShowCSRModal(false)}
          >
            &times;
          </button>
          <div className="w-[80%] md:w-[60%] h-[60vh]">
            <Slider {...settings}>
              {["./CMMI Certification/new1.jpg", "./CMMI Certification/new2.jpg", "./CMMI Certification/new4.jpg", "./CMMI Certification/new5.jpg", "./CMMI Certification/new6.jpg", "./CMMI Certification/new7.jpg", "./CMMI Certification/new3.jpg", "./csr11.png", "./csr12.png", "./Group Photo.jpeg"].map((src, idx) => (
                <div key={idx} className="w-full h-[60vh] flex justify-center items-center">
                  <img src={src} alt={`CSR ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </section>
  );
};

export default EssentialsSection;
