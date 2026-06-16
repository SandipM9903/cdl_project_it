import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import './MilestoneSection.css';
import p1Icon from '../assets/work-anniversary-card-occasions-corporate-260nw-1685382697.webp';
import p2Icon from '../assets/360_F_710062816_RdLiSVZLipf9zQa3lxKmwjJkVWvTptVY.jpg';
import p3Icon from '../assets/360_F_1193801445_co7gC7ieAbjse7UOb4g4E6KSAhfKpN4W.jpg';
import p4Icon from '../assets/21909-01-happy-work-anniversary-powerpoint-template-16x9-1.webp';
import p5Icon from '../assets/360_F_499739614_HUwRtzADeGK5zUi1hAcAlm2yer9q6tYi.jpg';
import p6Icon from '../assets/workanniversary5.jpg';
import { BASE_URL } from "../config/Config";

const MilestoneSection = () => {
  const [workAnniversary, setWorkAnniversary] = useState([]);
  const [birthdayData, setBirthdayData] = useState([]);
  const navigate = useNavigate();

  const birthdayImages = [
    { src: p1Icon, alt: "Birthday Image 1" },
    { src: p2Icon, alt: "Birthday Image 2" },
    { src: p3Icon, alt: "Birthday Image 3" },
    { src: p4Icon, alt: "Birthday Image 4" },
    { src: p5Icon, alt: "Birthday Image 5" },
  ];

  useEffect(() => {
    getWorkAnniversary();
    getBirthdayData();
  }, []);

  const getWorkAnniversary = () => {
    axios
      .get(`${BASE_URL}:9020/employee/work/anniversary`)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setWorkAnniversary(res.data);
          console.log("Work Anniversary Data Fetched", res.data);
        } else {
          setWorkAnniversary([]);
          console.log("No work anniversary data received");
        }
      })
      .catch((err) => console.error("Error fetching anniversaries", err));
  };

  const getBirthdayData = () => {
    axios.get(`${BASE_URL}:9020/employee/birthday/wishes/data`)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setBirthdayData(res.data);
          console.log("Birthday Data Fetched", res.data);
        } else {
          setBirthdayData([]);
          console.log("No birthday data received");
        }
      })
      .catch((err) => {
        console.error("Error fetching birthdays", err.message);
        alert("Error fetching birthday data: " + err.message);
      });
  };

  const handleBirthdayClick = (employee) => {
    navigate('/birthday', {
      state: { employee }
    });
  };

  const handleAnniversaryClick = (employee) => {
    const yearsCompleted = Math.floor(parseFloat(employee?.expWithCurrentCompany || 0));
    navigate('/work-anniversary', {
      state: { employee, yearsCompleted }
    });
  };

  return (
    <section className="w-full mx-auto mt-6">
      <h1 className="text-5xl font-header font-semibold text-[#7b2c2c] mb-10">Milestones</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Work Anniversaries Section */}
        <div className="bg-gray-100 rounded-xl shadow p-4">
          <h1 className="text-3xl font-header font-semibold text-black mb-4">Work Anniversaries</h1>
          {workAnniversary.length > 0 && workAnniversary.some(item => item?.empResDTO) ? (
            <Carousel
              showThumbs={false}
              autoPlay
              infiniteLoop
              showStatus={false}
              showArrows={true}
              showIndicators={false}
              interval={3000}
            >
              {workAnniversary.map((data, index) => {
                const { empResDTO } = data;
                if (!empResDTO) return null;
                
                const image = birthdayImages[index % birthdayImages.length];
                const yearsCompleted = Math.floor(parseFloat(empResDTO.expWithCurrentCompany || 0));

                return (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => handleAnniversaryClick(empResDTO)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-cover rounded-xl h-64 w-full"
                    />
                    <p className="text-gray-700 font-bold bg-white text-lg px-4 py-2">
                      <span className="text-black font-bold font-content">{empResDTO.fullNameAsAadhaar || `${empResDTO.firstName || ''} ${empResDTO.lastName || ''}`}</span> has completed <span className="text-[#d63b3b] font-content">{yearsCompleted}</span> year{yearsCompleted > 1 ? 's' : ''} with us!
                    </p>
                  </div>
                );
              }).filter(item => item !== null)}
            </Carousel>
          ) : (
            <div className="rounded-xl overflow-hidden">
              <img
                src={p4Icon}
                alt="Work Anniversary"
                className="object-cover rounded-xl h-64 w-full"
              />
              <p className="text-gray-600 font-semibold font-header text-center mt-2">
                No work anniversaries today!
              </p>
            </div>
          )}
        </div>

        {/* Birthday Wishes Section */}
        <div>
          <h1 className="text-3xl font-header font-semibold text-black mb-4">Birthday wishes</h1>
          <div className="space-y-6 max-h-[350px] overflow-y-auto hide-scrollbar">
            {birthdayData.length > 0 ? (
              birthdayData.map((data, index) => {
                const { empResDTO } = data;
                
                // Skip if empResDTO is undefined or null
                if (!empResDTO) {
                  console.warn(`Missing empResDTO for birthday entry at index ${index}`);
                  return null;
                }

                return (
                  <div
                    key={index}
                    style={{
                      backdropFilter: 'blur(7.5px)',
                      WebkitBackdropFilter: 'blur(7.5px)',
                    }}
                    className="flex items-start justify-between bg-white/70 p-4 border-b border-blue-100 rounded-xl"
                  >
                    <div className="flex gap-4">
                      {/* Employee Info */}
                      <div className="mt-3">
                        <div className="font-medium font-header text-gray-800">
                          {empResDTO.firstName || ''} {empResDTO.lastName || ''}
                        </div>
                        <div className="text-xs font-header text-gray-500">
                          {empResDTO?.subDeptResDTO?.description || 'Department not specified'}
                        </div>
                      </div>
                    </div>

                    {/* Send Wishes Button */}
                    <div>
                      <button
                        className="bg-[#d63b3b] text-white px-4 py-2 rounded-full text-sm hover:bg-red-600"
                        onClick={() => handleBirthdayClick(empResDTO)}
                      >
                        Send Wishes
                      </button>
                    </div>
                  </div>
                );
              }).filter(item => item !== null)
            ) : (
              <div className="text-center text-gray-500 py-8">
                No birthday wishes data available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilestoneSection;