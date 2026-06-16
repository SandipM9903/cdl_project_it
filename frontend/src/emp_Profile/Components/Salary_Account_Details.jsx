import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/Config';

function Salary_Account_Details() {
    const [empSalaryAccountDetails, setEmpSalaryAccountDetails] = useState({});
    const [isEditing, setIsEditing] = useState(false); // State to manage edit mode

    const email = localStorage.getItem('email');
    const empId = localStorage.getItem('empId');

    useEffect(() => {
        axios
            // .get(`${BASE_URL}:9020/employee/by/email/${email}`)
            .get(`${BASE_URL}:9020/employee/eCode/${empId}`)
            .then((response) => {
                setEmpSalaryAccountDetails(response.data.fileAndObjectTypeBean.empResDTO.salaryAccDetailsResDTO);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [email]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        setEmpSalaryAccountDetails({
            ...empSalaryAccountDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        axios.put(`${BASE_URL}:9020/employee/sal/update/${empSalaryAccountDetails.salaryAccDetailsId}`, empSalaryAccountDetails).then(res=>{
            alert("updated");
            console.log(res.data);
            setIsEditing(false);
          }).catch(err=>{
            alert(err);
          })
    };

    return (
        <div>
            {/* <div className='bg-white border-[2px] border-gray-200 shadow-lg w-[380px] rounded-lg py-3 px-4 relative'>
                <h4 className='font-semibold mb-1.5 text-sm'>Salary Account Details</h4>
                <button 
                    onClick={isEditing ? handleSave : handleEditToggle} 
                    className='absolute top-3 right-3 text-xs text-blue-500 underline'>
                    {isEditing ? 'Save' : 'Edit'}
                </button>

                <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
                    <div className='text-gray-500'>Salary Account Bank Name</div>
                    {isEditing ? (
                        <input
                            type='text'
                            name='bankName'
                            value={empSalaryAccountDetails.bankName}
                            onChange={handleChange}
                            className='ml-2 border border-gray-300 rounded px-1'
                        />
                    ) : (
                        <div className='ml-2'>{empSalaryAccountDetails.bankName}</div>
                    )}
                </div>

                <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
                    <div className='text-gray-500'>Salary Account Number</div>
                    {isEditing ? (
                        <input
                            type='text'
                            name='accountNumber'
                            value={empSalaryAccountDetails.accountNumber}
                            onChange={handleChange}
                            className='ml-2 border border-gray-300 rounded px-1'
                        />
                    ) : (
                        <div className='ml-2'>{empSalaryAccountDetails.accountNumber}</div>
                    )}
                </div>

                <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
                    <div className='text-gray-500'>Name as per salary account</div>
                    {isEditing ? (
                        <input
                            type='text'
                            name='nameOnAccount'
                            value={empSalaryAccountDetails.nameOnAccount}
                            onChange={handleChange}
                            className='ml-2 border border-gray-300 rounded px-1'
                        />
                    ) : (
                        <div className='ml-2'>{empSalaryAccountDetails.nameOnAccount}</div>
                    )}
                </div>

                <div className='grid grid-cols-2 py-1.5 text-xs'>
                    <div className='text-gray-500'>Salary Account IFSC</div>
                    {isEditing ? (
                        <input
                            type='text'
                            name='ifsc'
                            value={empSalaryAccountDetails.ifsc}
                            onChange={handleChange}
                            className='ml-2 border border-gray-300 rounded px-1'
                        />
                    ) : (
                        <div className='ml-2'>{empSalaryAccountDetails.ifsc}</div>
                    )}
                </div>
            </div> */}
        </div>
    );
}

export default Salary_Account_Details;









