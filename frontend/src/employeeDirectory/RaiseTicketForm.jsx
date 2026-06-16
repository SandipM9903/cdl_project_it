import React, { useState } from "react";
import useFilePicker from "../hooks/useFilePicker";
import { IoIosMail } from "react-icons/io";
import { MdCall } from "react-icons/md";

const RaiseTicketForm = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const {
        triggerFileInput,
        handleDrop,
        handleDragOver,
        FileInput,
    } = useFilePicker((files) => {
        setSelectedFile(files[0]);
        console.log("Selected file:", files[0]);
    });

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
            <div className='flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-8'>
                <div>
                    <h1 className='text-[34px] text-[#282828] font-raleway whitespace-nowrap'>
                        Raise a Ticket
                    </h1>
                </div>
                <div className='font-raleway text-[13px] w-full'>
                    <div className='flex flex-wrap gap-3 sm:gap-5'>
                        <button className='px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-[#9F9F9F]'>
                            Admin
                        </button>
                        <button className='px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-[#9F9F9F]'>
                            HR
                        </button>
                        <button className='px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-[#9F9F9F]'>
                            IT
                        </button>
                        <button className='px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-[#9F9F9F]'>
                            CDL Support
                        </button>
                    </div>
                </div>
            </div>

            <div className="font-light mt-8">
                <h1 className="text-[28px] sm:text-[40px] leading-snug">
                    Simply create a ticket. IT team will respond promptly to your
                    <br className="hidden sm:block" />
                    issue. You may also send tickets directly via email.
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row mt-10 gap-10 lg:gap-20 items-start">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-10 w-full lg:w-1/4 justify-items-center">
                    <div className="w-[220px] sm:w-[236px] h-[185px] bg-[#F4F4F5] rounded-[20px] shadow-sm flex flex-col items-start justify-start px-6 pt-6 space-y-4">
                        <div className="w-[56px] h-[56px] bg-white rounded-full flex items-center justify-center">
                            <IoIosMail style={{ color: 'grey', backgroundColor: 'white', borderRadius: '50%', padding: '4px' }} className="text-5xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-[14px] font-bold text-[#282828]">Email</p>
                            <p className="text-[12px] text-[#C14343] font-semibold mt-1">
                                help@cmsitticket.cms.co.in
                            </p>
                        </div>
                    </div>

                    <div className="w-[220px] sm:w-[236px] h-[185px] bg-[#F4F4F5] rounded-[20px] shadow-sm flex flex-col items-start justify-start px-6 pt-6 space-y-4">
                        <div className="w-[56px] h-[56px] bg-white rounded-full flex items-center justify-center">
                            <MdCall style={{ color: 'grey', backgroundColor: 'white', borderRadius: '50%', padding: '4px' }} className="text-5xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-[14px] text-[#282828] font-bold">Contact No.</p>
                            <p className="text-[12px] text-[#C14343] font-semibold mt-1">
                                (+91) 22-41259000
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#FAFAFA] rounded-[50px] pb-6 w-full lg:w-3/4 px-4 sm:px-8 md:px-12 lg:px-16">
                    <div className="text-left pt-6">
                        <h1 className="font-raleway text-[28px] sm:text-[32px] text-[#060606] font-bold">
                            Submit a IT help desk ticket
                        </h1>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <input
                            type="text"
                            placeholder="Your Problem"
                            className="w-full max-w-[818px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm"
                        />
                    </div>

                    <div className="mt-8 flex justify-center">
                        <textarea
                            placeholder="Description"
                            className="w-full max-w-[818px] py-4 h-[121px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm"
                        />
                    </div>

                    <div className="mt-8 flex justify-center">
                        <div className="relative w-full max-w-[818px]">
                            <select
                                className="appearance-none w-full h-[65px] rounded-full px-6 text-[16px] border border-[#000000] text-gray-400 bg-white"
                                defaultValue=""
                            >
                                <option value="" disabled hidden>Category</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                            <div className="pointer-events-none absolute right-6 top-1/2 transform -translate-y-1/2">
                                <svg
                                    className="w-4 h-4 text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className='mt-[30px] flex flex-col sm:flex-row justify-center sm:space-x-10 space-y-6 sm:space-y-0'>
                        <input type='text' placeholder='Mobile No.' className='w-full sm:w-[330px] lg:w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm' />
                        <input type='text' placeholder='Location' className='w-full sm:w-[330px] lg:w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm' />
                    </div>

                    <div className="mt-8 flex justify-center">
                        <input
                            type="text"
                            placeholder="Project/Dept."
                            className="w-full max-w-[818px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm"
                        />
                    </div>

                    <div className="mt-8 flex justify-center">
                        <div
                            className="w-full max-w-[818px] border-2 border-dashed border-[#DC3545] rounded-[20px] p-10 text-center"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <button
                                className="bg-[#A44444] text-white font-bold px-4 py-2 rounded-full"
                                onClick={triggerFileInput}
                            >
                                Choose File
                            </button>
                            <p className="text-gray-400 mt-2">Or Drag file here</p>
                            {selectedFile && (
                                <p className="mt-2 text-sm text-gray-700">
                                    Selected File: {selectedFile.name}
                                </p>
                            )}
                            {FileInput}
                        </div>
                    </div>

                    <div className="mt-[30px] flex justify-center">
                        <div className="w-full max-w-[818px] flex justify-end space-x-5">
                            <button className="px-6 py-2 border rounded-[56px] text-[#DC3545] border-[#DC3545]">
                                Cancel
                            </button>
                            <button className="px-6 py-2 border rounded-[56px] bg-[#DC3545] text-white">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RaiseTicketForm;
