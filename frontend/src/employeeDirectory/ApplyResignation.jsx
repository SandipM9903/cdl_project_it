import React from 'react';


function ApplyResignation() {


    return (
        <div className='mx-[140px] '>
            <div className='flex items-center space-x-8'>
                <div>
                    <h1 className='text-[34px] text-[#282828] font-raleway'>Separation</h1>
                </div>
                <div className='font-raleway text-[13px]'>
                    <div className='flex items-center space-x-5'>
                        <button className='px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-[#9F9F9F]'>
                            Apply
                        </button>
                        <button className='px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-[#9F9F9F]'>
                            Pending
                        </button>
                        <button className='px-6 py-2 border rounded-[100px] text-[#000000] border-[#000000] hover:bg-[#9F9F9F]'>
                            History
                        </button>
                    </div>
                </div>
            </div>
            <div className='font-light mt-[35px]'>
                <h1 className='text-[40px]'>We're sorry to see you here. If you're sure about your decision,<br></br> please proceed with the form below to continue the process.</h1>
            </div>
            <div className='bg-[#FAFAFA] mx-20 rounded-[50px] mt-[40px] pb-6'>
                <div className='text-center'>
                    <h1 className='font-raleway text-[32px] text-[#060606]'>Apply for Resignation</h1>
                </div>
                <div className='mt-[30px] flex justify-center'>
                    <input type='text' placeholder='Your Name' className='w-[818px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[700px] lg:w-[818px]' />
                </div>
                <div className='mt-[30px] flex justify-center'>
                    <input type='text' placeholder='Email' className='w-[818px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[700px] lg:w-[818px]' />
                </div>
                <div className='mt-[30px] flex justify-center space-x-10'>
                    <input type='text' placeholder='Employee Code' className='w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[330px] lg:w-[389px]' />
                    <input type='text' placeholder='Location' className='w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[330px] lg:w-[389px]' />
                </div>
                <div className='mt-[30px] flex justify-center space-x-10'>
                    <input type='text' placeholder='Department' className='w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[330px] lg:w-[389px]' />
                    <input type='text' placeholder='Reporting Manager' className='w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[330px] lg:w-[389px]' />
                </div>
                <div className='mt-[30px] flex justify-center space-x-10'>
                    <input type='text' placeholder='Date of Joining' className='w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[330px] lg:w-[389px]' />
                    <div>
                        <input type='date' placeholder='Date of Resignation' className='w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[330px] lg:w-[389px]' />
                        <h1 className='mx-5 text-[14px]'>Notice Period <span className='text-red-500'>90 Days</span></h1>
                    </div>
                </div>
                <div className='mt-[30px] flex justify-center space-x-10'>
                    <input type='date' placeholder='Requested Last Working Date' className='w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[330px] lg:w-[389px]' />
                    <select
                        className='w-[389px] h-[65px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[330px] lg:w-[389px]'
                        defaultValue=""
                    >
                        <option value="" disabled hidden>Reason for Exit</option>
                        <option value="resignation">Resignation</option>
                        <option value="transfer">Transfer</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className='mt-[30px] flex justify-center'>
                    <textarea type='text' placeholder='Additional Remarks' className='w-[818px] py-4 h-[121px] rounded-[31.5px] px-6 text-[16px] border border-[#000000] shadow-sm max-w-full sm:w-[90%] md:w-[700px] lg:w-[818px]' />
                </div>
                <div className='mt-[30px] mx-10 space-x-5 text-right'>
                    <button className='px-6 py-2 border rounded-[56px] text-[#DC3545] border-[#DC3545]'>
                        Cancel
                    </button>
                    <button className='px-6 py-2 border rounded-[56px] bg-[#DC3545] text-white'>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApplyResignation;
