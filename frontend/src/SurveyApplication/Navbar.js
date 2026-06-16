import React from 'react';
import { PiDotsThreeOutlineVerticalLight } from 'react-icons/pi';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

function Navbar() {

    const empCode = 9085123;
    const empName = "Chaitanya Kiran"
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <div className='navbar w-auto h-16 bg-gradient-to-r from-blue-400 to-pink-600 grid grid-cols-2'>
                <div className=''>
                    <h1 className='text-2xl font-bold py-3 mx-10 text-white'>SURVEY APP</h1>
                </div>
                <div className=' flex items-start justify-between mx-5'>
                    {/* <button
                        className='font-bold py-5 mx-10 text-white'
                        onClick={() => navigate('/survey-list', {state: {empCode}})}
                    >
                        Survey
                    </button> */}
                    <h1 className='font-bold py-5 mx-10 text-white'>Report</h1>
                    <Popover>
                        <PopoverButton className='font-bold text-xl mt-6 mx-10 text-white'>
                            <PiDotsThreeOutlineVerticalLight />
                        </PopoverButton>
                        <PopoverPanel
                            transition
                            anchor="bottom"
                            className="bg-white shadow-xl px-1 py-1 rounded-md border border-gray-400 text-sm mt-5 transition duration-200 ease-in-out"
                        >
                            <div className="items-center">
                                <button className="text-left block py-2 px-3 w-full hover:bg-gray-200" onClick={() => navigate('/category', {state: {empCode}})}>Category & Sub Category</button>
                                <button className="text-left block py-2 px-3 w-full hover:bg-gray-200" onClick={() => navigate('/user-group', {state: {empCode}})}>Groups & Users</button>
                            </div>
                        </PopoverPanel>
                    </Popover>
                    <h1 className='font-bold py-5 text-white flex gap-2'>{empName}
                        <img src="h3.jpg" className='rounded-full h-[40px] w-[40px] -mt-2' alt="admin" />
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
