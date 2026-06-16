
import React, { useState } from 'react';
import { IoIosMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

function Happitude() {
    const tabs = ["Home", "Employee Forum", "Committee ", "Happitude"];
    const [activeTab, setActiveTab] = useState("Happitude");

    const people = [
        { src: "person1.jpg", name: "John Doe", role: "Wellness Coach" },
        { src: "person3.jpg", name: "John Doe", role: "Wellness Coach" },
        { src: "person4.jpg", name: "John Doe", role: "Wellness Coach" },
        { src: "person6.jpg", name: "John Doe", role: "Wellness Coach" },
    ];

    return (
        <div className='pt-28 px-4 sm:px-10 lg:px-[140px] mb-10'>
            <div className="flex flex-wrap gap-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 text-sm ${activeTab === tab ? "text-blue-400" : "text-gray-800"}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-[28px] md:text-[36px]">
                    <h1>{activeTab}</h1>
                    <div className="flex flex-wrap gap-2 text-sm">
                        <div className="px-4 py-2 border rounded-full">Happtitude</div>
                        <div className="px-4 py-2 border rounded-full">Sports</div>
                        <div className="px-4 py-2 border rounded-full">WellNest</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-8">
                {people.map((person, index) => (
                    <div key={index} className="relative w-32 h-32 sm:w-40 sm:h-40">
                        <img
                            src={person.src}
                            alt="Wellness Banner"
                            className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 w-[90%] bg-[#FFFFFFF5] text-center text-xs sm:text-sm font-medium rounded-[12px] p-1">
                            <div>{person.name}</div>
                            <div className="text-[10px] text-gray-600">{person.role}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 mt-12 gap-8'>
                <div>
                    <h1 className="text-[20px] md:text-[24px] lg:text-[34px] font-light">
                        <span className="block lg:hidden">
                            Happtitude Team are always ready to help you and answer your question
                        </span>
                        <span className="hidden lg:block">
                            Happtitude Team are <br />always ready to help<br /> you and answer your<br /> question
                        </span>
                    </h1>

                    <div className='flex flex-col sm:flex-row gap-4 mt-8'>
                        <div className="border rounded-[30px] bg-[#FAFAFA] p-4 flex items-center gap-4 w-full sm:w-[220px]">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                                <IoIosMail className="text-2xl text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm">Email</span>
                                <h1 className="text-xs text-[#923A39] break-all">support@example.com</h1>
                            </div>
                        </div>

                        <div className="border rounded-[30px] bg-[#FAFAFA] p-4 flex items-center gap-4 w-full sm:w-[220px]">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                                <FaPhoneAlt className="text-2xl text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm">Contact No</span>
                                <h1 className="text-xs text-[#923A39]">(+91) 46 -76764068</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="border rounded-[36px] bg-[#FAFAFA] px-6 py-4 w-full max-w-md mx-auto">
                        <h1 className='text-[20px] sm:text-[24px] font-semibold'>Send message</h1>
                        <textarea
                            rows={4}
                            placeholder="Message"
                            className="border border-gray-300 rounded-2xl mt-4 px-3 py-2 w-full resize-none"
                        />
                        <button className="mt-4 block px-4 py-2 rounded-[56px] bg-red-600 text-white">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Happitude;
