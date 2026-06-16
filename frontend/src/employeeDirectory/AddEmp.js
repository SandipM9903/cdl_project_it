import React, { useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";

function AddEmp({ closeEmployeepopup }) {

    const [currentStep, setCurrentStep] = useState(1);
    const [isProbationApplicable, setIsProbationApplicable] = useState(false);
    const steps = ["Basic Info", "Leave Details", "Payment Mode"];

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    };
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="p-4">
                        <div className="text-xl mt-2 font-semibold flex justify-between items-center">
                            Step 1:
                            <button onClick={closeEmployeepopup} className="text-red-600 text-2xl">
                                <MdOutlineCancel />
                            </button>
                        </div>

                        <div className="max-h-[80vh] overflow-y-auto mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    {/* Employee Onboarding Ref Number */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                        <label className="text-sm text-[#555758]">Employee Onboarding Ref Number<span className=' text-red-500 '>*</span></label>
                                        <input type="text" className="border rounded-md border-gray-300 px-2 py-1 w-full" />
                                    </div>

                                    {/* Employee Code */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                        <label className="text-sm text-[#555758]">Employee Code <span className=' text-red-500 '>*</span> </label>
                                        <input type="text" className="border rounded-md border-gray-300 px-2 py-1 w-full" />
                                    </div>

                                    {/* Employee First Name */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                        <label className="text-sm text-[#555758]">Employee First Name <span className=' text-red-500 '>*</span></label>
                                        <input type="text" className="border rounded-md border-gray-300 px-2 py-1 w-full" />
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                        <label className="text-sm text-[#555758]">Date of Birth <span className=' text-red-500 '>*</span></label>
                                        <input type="date" className="border rounded-md border-gray-300 px-2 py-1 w-full" />
                                    </div>

                                    {/* Gender */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                        <label className="text-sm text-[#555758]">Gender <span className=' text-red-500 '>*</span></label>
                                        <div className="flex flex-wrap gap-4">
                                            {["Male", "Female", "Other"].map((gender) => (
                                                <label key={gender} className="flex items-center gap-2">
                                                    <input type="radio" name="gender" value={gender.toLowerCase()} className="accent-blue-500" />
                                                    <span className="text-[#555758]">{gender}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Employee Email ID */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                        <label className="text-sm text-[#555758]">Employee Email ID <span className=' text-red-500 '>*</span></label>
                                        <input type="text" className="border rounded-md border-gray-300 px-2 py-1 w-full" />
                                    </div>

                                    {/* Primary Contact No */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                        <label className="text-sm text-[#555758]">Primary Contact No <span className=' text-red-500 '>*</span></label>
                                        <input type="text" className="border rounded-md border-gray-300 px-2 py-1 w-full" />
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className="space-y-4">
                                    {/* Date of Joining */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                        <label className="text-sm text-[#555758]">Date of Joining <span className=' text-red-500 '>*</span></label>
                                        <input type="date" className="border rounded-md border-gray-300 px-2 py-1 w-full" />
                                    </div>

                                    {/* Status */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                        <label className="text-sm text-[#555758]">Status <span className=' text-red-500 '>*</span></label>
                                        <input type="text" className="border rounded-md border-gray-300 px-2 py-1 w-full" />
                                    </div>

                                    {/* Probation Checkbox */}
                                    <div className="col-span-2 flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="accent-blue-500"
                                            checked={isProbationApplicable}
                                            onChange={(e) => setIsProbationApplicable(e.target.checked)}
                                        />
                                        <div className="text-sm text-[#555758]">Is Probation Applicable?</div>
                                    </div>

                                    {/* Conditional Probation Fields */}
                                    {isProbationApplicable && (
                                        <>
                                            {/* Probation Period */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                                <label className="text-sm text-[#555758]">Probation Period</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="number" className="border rounded-md border-gray-300 px-2 py-1 w-24" />
                                                    <span className="text-sm text-[#555758]">days</span>
                                                </div>
                                            </div>

                                            {/* Confirmation Date */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                                <label className="text-sm text-[#555758]">Confirmation Date</label>
                                                <input type="date" className="border rounded-md border-gray-300 px-2 py-1 w-40" />
                                            </div>

                                            {/* Probation Period Extension */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                                <label className="text-sm text-[#555758]">Probation Period Extension</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="number" className="border rounded-md border-gray-300 px-2 py-1 w-24" />
                                                    <span className="text-sm text-[#555758]">days</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Work & Personal Section */}
                            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                                <div className="flex-1">
                                    <h1 className="text-xl font-semibold mb-4">Work</h1>
                                    <div className="space-y-3">
                                        {[
                                            "Department",
                                            "Project Name",
                                            "Report to",
                                            "Designation",
                                            "Work phone",
                                            "Total Experience",
                                            "Location",
                                            "Project Manager",

                                        ].map((label, idx) => (
                                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                                <label className="text-sm text-[#555758]">{label}</label>
                                                <input
                                                    type="text"
                                                    className="border rounded-md border-gray-300 px-2 py-1 w-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Personal Section */}
                                <div className="flex-1">
                                    <h1 className="text-xl font-semibold mb-4">Personal</h1>
                                    <div className="space-y-3">
                                        {[
                                            "Secondary Contact no",
                                            "Blood Group",
                                            "Designation",
                                            "Work Phone",
                                            "Total Experience",
                                            "Location",
                                            "Project Manager",
                                        ].map((label, idx) => (
                                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                                <label className="text-sm text-[#555758]">{label}</label>
                                                <input
                                                    type="text"
                                                    className="border rounded-md border-gray-300 px-2 py-1 w-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                );

            case 2:
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Leave Details</h2>

                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Payment Mode</h2>

                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <div className="shadow-lg p-4  border">
            {/* Stepper */}
            <div className="flex items-center justify-between relative w-1/2">
                {steps.map((step, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center z-10">
                        <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-white font-bold
                ${currentStep === index + 1
                                    ? "bg-[#04EE00]"
                                    : currentStep > index + 1
                                        ? "bg-[#04EE00]"
                                        : "bg-gray-300"
                                }`}

                        >

                        </div>
                        <span className="text-sm mt-2 text-center">{step}</span>
                    </div>
                ))}
                {/* Horizontal line */}
                <div className="absolute top-2 left-0 w-full h-[1px] bg-gray-300">
                    <div
                        className="h-full bg-blue-500"
                        style={{
                            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                            transition: "width 0.3s ease",
                        }}
                    ></div>
                </div>
            </div>
            {/* Form Content */}
            {renderStep()}
            {/* Navigation Buttons */}
            <div className="flex float-right gap-3 mt-8">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-4 py-2 bg-gray-400 gap-2 flex items-center text-white rounded disabled:opacity-50 mb-6"> <FaArrowLeftLong />Previous</button>
                <button className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50 mb-6"> Cancel</button>
                <button className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50 mb-6">Save</button>
                {currentStep < steps.length ? (
                    <button
                        onClick={nextStep}
                        className="px-4 py-2 flex items-center gap-2 bg-blue-500 text-white rounded mb-6">  Save and Continue <FaArrowRight /> </button>
                ) : (
                    <button
                        onClick={() => alert("Form submitted successfully!")}
                        className="px-4 py-2 bg-green-500 text-white rounded mb-6"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
}

export default AddEmp;
