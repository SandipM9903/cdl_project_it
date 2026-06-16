import { useEffect, useState } from 'react';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router';
import './Exit.css';
// import Service from './Service';
import Service from '../../services/Service';

function Exit() {
    const location = useLocation();
    const { employeeDetails } = location.state.data;
    console.log(employeeDetails,"employeeDetailsemployeeDetails")
    const [resignData, setResignData] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();
    function close() {
        navigate('/');
    }

    function formatDate(dateString) {
        if (!dateString) {
            return null;
        }
        const formattedDate = new Date(dateString);
        const dd = String(formattedDate.getDate()).padStart(2, '0');
        const mm = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const yyyy = formattedDate.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    }

    useEffect(() => {
        Service.getResignationDetailsByEmpId(employeeDetails.empCode)
            .then((res) => {
                const formattedResignationDate = formatDate(res.data.dateOfResignation);
                const formattedLastWorkingDayRequest = formatDate(res.data.lastWorkingDayRequest);

                const updatedResignDetails = {
                    ...res.data,
                    dateOfResignation: formattedResignationDate,
                    lastWorkingDayRequest: formattedLastWorkingDayRequest,
                };
                setResignData(updatedResignDetails);
            })
            .catch((error) => {
                console.log("Axios Error", error);
            });

        const getImage = () => {

            Service.getEmployeeImage(employeeDetails.empId)
                .then(response => {
                    const imageBlob = new Blob([response.data], { type: 'image/png' });
                    const image = URL.createObjectURL(imageBlob);
                    setImageUrl(image);
                })
                .catch(error => console.error(error));
        };

        getImage();
    }, [employeeDetails.empCode]);

    return (
        <div className='container mx-auto'>
            <div className='flex items-center gap-6 text-xl mx-20 pt-10'>
                <button className='text-blue-500' onClick={()=>close()}><FaArrowLeftLong /></button>
                <h1 className='font-black'>E-Exit</h1>
            </div>
            <div className='grid grid-cols-6 border border-gray-500 mx-28 mt-12 rounded-lg shadow-bottom'>
                <div className='col-span-1 text-center my-6'>
                    <img src={imageUrl} alt='ProfilePic' className='w-[12vh] h-[12vh] rounded-[9999px] mx-auto' />
                    <h1 className='text-xl text-blue-700 font-black'>{employeeDetails.empName}</h1>
                    <h1 className='text-base text-gray-500 font-medium'>{employeeDetails.jobRole}</h1>
                </div>
                <div className='col-span-1 text-sm'>
                    <div className='mt-10'>
                        <h1 className='text-gray-400'>Employee Id</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.empId}</h1>
                    </div>
                    <div className='mt-4'>
                        <h1 className='text-gray-400'>Department</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.department}</h1>
                    </div>
                </div>
                <div className='col-span-1 text-sm'>
                    <div className='mt-10'>
                        <h1 className='text-gray-400'>Contact No</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.contactNo}</h1>
                    </div>
                    <div className='mt-4'>
                        <h1 className='text-gray-400'>Reporting to</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.reportingManager}</h1>
                    </div>
                </div>
                <div className='col-span-1 text-sm'>
                    <div className='mt-10'>
                        <h1 className='text-gray-400'>Email</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.email}</h1>
                    </div>
                    <div className='mt-4'>
                        <h1 className='text-gray-400'>Employee Type</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.empType}</h1>
                    </div>
                </div>
                <div className='col-span-1 text-sm'>
                    <div className='mt-10'>
                        <h1 className='text-gray-400'>Location</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.location}</h1>
                    </div>
                    <div className='mt-4'>
                        <h1 className='text-gray-400'>Joining Date</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.dateOfJoining}</h1>
                    </div>
                </div>
                <div className='col-span-1 text-sm'>
                    <div className='mt-10'>
                        <h1 className='text-gray-400'>Empo</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.empo}</h1>
                    </div>
                    <div className='mt-4'>
                        <h1 className='text-gray-400'>Project / Cost Center</h1>
                        <h1 className='text-[#00007D]'>{employeeDetails.project}</h1>
                    </div>
                </div>
            </div>
            <div className='mx-28 mt-12 shadow-bottom border border-gray-500'>
                <div className=''>
                    <div className="w-[75%] px-16 py-4">
                        <div className="relative flex items-center justify-between w-full">
                            <div className="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-300"></div>
                            <div
                                className="relative z-10 grid w-7 h-7 font-bold text-white transition-all duration-300 bg-[#66FF00] rounded-[9999px] place-items-center">
                                
                            </div>
                            <div
                                className="relative z-10 grid w-7 h-7 font-bold text-gray-900 transition-all duration-300 bg-gray-300 rounded-[9999px] place-items-center">
                                
                            </div>
                            <div
                                className="relative z-10 grid w-7 h-7 font-bold text-gray-900 transition-all duration-300 bg-gray-300 rounded-[9999px] place-items-center">       
                            </div>
                        </div>
                    </div>
                    <div className="flex content-center text-center text-lg font-semibold text-gray-500">
                        <div className='ml-6'>Submitted to Manager</div>
                        <div className="ml-44">Submitted to HR</div>
                        <div className="ml-56">Approved</div>
                    </div>

                </div>
                <div className='flex mt-5 mx-10 pb-6 font-medium'>
                    <div className='w-[25%]'>
                        <h1 className='text-gray-400 my-2'>Date of Resignation</h1>
                        <h1 className='text-gray-800'>{resignData.dateOfResignation}</h1>
                        <h1 className='text-gray-400 my-2 mt-16'>Last working Day Requested</h1>
                        <h1 className='text-gray-800'>{resignData.lastWorkingDayRequest ? resignData.lastWorkingDayRequest : "-"}</h1>
                    </div>
                    <div className='w-[25%]'>
                        <h1 className='text-gray-400 my-2'>Reason for Exit</h1>
                        <h1 className='text-gray-800'>{resignData.reason}</h1>
                        <h1 className='text-gray-400 my-2 mt-16 text-xs'>Notice Period</h1>
                        <h1 className='text-gray-800'>-</h1>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-between mx-28 my-12 shadow-bottom border border-gray-500 px-12'>
                <h1 className='text-gray-800 text-lg py-6 font-semibold'>F & F settlement form</h1>
                <button className='flex items-center gap-6 border border-blue-500 px-5 py-[4px] text-blue-500 mr-20'>Download<FaCloudDownloadAlt /></button>
            </div>
        </div >
    );
}

export default Exit;
