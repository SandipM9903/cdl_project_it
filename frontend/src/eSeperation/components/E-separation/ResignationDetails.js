
import { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FaArrowRightLong, FaRegCircleXmark } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router';
import './ResignationDetails.css';
import axios from 'axios';
// import Service from './Service';
// import Service from './Service';
import ExitService from '../../services/ExitService'
import Service from '../../services/Service';
import { BASE_URL } from '../../../../config/Config';

function ResignationDetails() {
    const [resignReason, setResignReason] = useState([]);
    const exitReasonDropdown = resignReason.map(reason => reason.reason);
    const location = useLocation();
    const navigate = useNavigate();
    // const employeeDetails = location.state?.data?.employeeDetails;
    // const empCode = employeeDetails.empCode;
    // const [employeeDetails, setEmployeeDetails] = useState({})
    // const employeeDetails
    const [employeeDetails, setEmployeeDetails] = useState({
        empCode : 1,
        empName : "sada",
        email : "sada@gamail.com",
        reportingManager : "temp",
        location : "bnglr",
        dateOfJoining : 2020-4-5,
        dateOfResignation :2024-7-12
    })

    const empCode = employeeDetails.empCode;
    useEffect(() => {
        if (employeeDetails) {
            const formattedDate = new Date(employeeDetails.dateOfJoining);
            const dd = String(formattedDate.getDate()).padStart(2, '0');
            const mm = String(formattedDate.getMonth() + 1).padStart(2, '0');
            const yyyy = formattedDate.getFullYear();
            employeeDetails.dateOfJoining = `${dd}-${mm}-${yyyy}`;

        }
        Service.getReasonDropdown()
            .then((res) => {
                setResignReason(res.data);
            })
            .catch((error) => {
                console.log("Error in fetching Data", error);
            });
    }, [employeeDetails]);

    const [dateOfResignation, setDateOfResignation] = useState('');
    const [lastWorkingDay, setLastWorkingDay] = useState('');

    useEffect(() => {
    if (dateOfResignation) {
        const resignationDate = new Date(dateOfResignation);
        const lastWorkingDate = new Date(resignationDate.setDate(resignationDate.getDate() + 90));

        // Format last working date
        const dd = String(lastWorkingDate.getDate()).padStart(2, '0');
        const mm = String(lastWorkingDate.getMonth() + 1).padStart(2, '0');
        const yyyy = lastWorkingDate.getFullYear();
        const formattedLastWorkingDate = `${dd}-${mm}-${yyyy}`;

        setLastWorkingDay(formattedLastWorkingDate);

        setResignData(prevState => ({
            ...prevState,
            lastWorkingDay: lastWorkingDate
        }));
    }
}, [dateOfResignation]);

    function initiate() {
        navigate("/exit", { state: { data: { employeeDetails } } });
    }

    function close() {
        navigate('/');
    }

    const [resignData, setResignData] = useState({
        empCode: employeeDetails.empCode,
        dateOfResignation: "",
        lastWorkingDay: "",
        lastWorkingDayRequest: "",
        reason: "",
        remarks: "",
        reportingmgrEmpCode: employeeDetails.reportingmgrEmpCode,
        reportingmgrEmailId: employeeDetails.reportingmgrEmailId
        
    });

    const applyResignation = () => {
        
        if (!validateFields()) {
            return;
        }

        
        console.log(resignData, "resignDataresignDataresignData");

        axios.post(`${BASE_URL}:9029/api/eSeparation/applyResign/${empCode}`, resignData)
            .then(() => {
                console.log("Posted");
                initiate();
            })
            .catch((error) => {
                console.log("Error during posting", error);
            });
    };

    const handleDateOfResign = (e) => {
        setResignData({
            ...resignData,
            dateOfResignation: e.target.value,
        });
        setDateOfResignation(e.target.value);
    };

    const handleRequest = (e) => {
        setResignData({
            ...resignData,
            lastWorkingDayRequest: e.target.value
        });
    };

    const handleReason = (selectedOptions) => {
        setResignData({
            ...resignData,
            reason: selectedOptions.value
        });
    };

    const handleRemarks = (e) => {
        setResignData({
            ...resignData,
            remarks: e.target.value
        });
    };

    const [validationErrors, setValidationErrors] = useState({
        dateOfResignation: "",
        reason: "",
    });

    const validateFields = () => {
        let isValid = true;
        const errors = {};

        if (!resignData.dateOfResignation) {
            errors.dateOfResignation = "Date of Resignation is required";
            isValid = false;
        } else {
            errors.dateOfResignation = "";
        }

        if (new Date(resignData.lastWorkingDayRequest) <= new Date(resignData.dateOfResignation)) {
            errors.lastWorkingDay = "Last working day Request must be greater than date of Resignation";
            isValid = false;
        }

        if (!resignData.reason) {
            errors.reason = "Reason is required";
            isValid = false;
        } else {
            errors.reason = "";
        }

        setValidationErrors(errors);
        return isValid;
    };

    if (!employeeDetails) {
        return <div>EmployeeId not exist</div>;
    }

    return (
        <div className='container mx-auto' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className='flex items-center justify-between mx-8 py-4 border-b-2 border-gray-300'>
                <h1 className='text-gray-700 font-semibold text-lg'>Employee Resignation Details</h1>
                <button className='text-xl text-red-500' onClick={close}><FaRegCircleXmark /></button>
            </div>
            <div className='grid grid-cols-2 mt-6 mx-8'>
                <div className='col-span-1 mt-8'>
                    <table className="w-[90%] text-base text-left rtl:text-right">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <th scope="row" className="py-3 font-medium text-gray-500">
                                    Employee Name
                                </th>
                                <td className="py-3 text-gray-600 font-semibold">
                                    {employeeDetails.fileAndObjectTypeBean.empResDTO.fullNameAsAadhaar}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <th scope="row" className="py-3 text-gray-500 font-medium">
                                    Email
                                </th>
                                <td className="py-3 text-gray-600 font-semibold">
                                    {employeeDetails.fileAndObjectTypeBean.empResDTO.emailId}
                                </td>
                            </tr>
                            <tr className=" border-gray-300  border-b">
                                <th scope="row" className="py-3 text-gray-500 font-medium">
                                    Employee Code
                                </th>
                                <td className="py-3 text-gray-600 font-semibold">
                                    {employeeDetails.empCode}
                                </td>
                            </tr>
                            <tr className="border-gray-300 border-b">
                                <th scope="row" className="py-3 text-gray-500 font-medium">
                                    Reporting Manager
                                </th>
                                <td className="py-3 text-gray-600 font-semibold">
                                    {employeeDetails.reportingManager}
                                </td>
                            </tr>
                            <tr className="border-gray-300  border-b">
                                <th scope="row" className="py-3 text-gray-500 font-medium">
                                    Location
                                </th>
                                <td className="py-3 text-gray-600 font-semibold">
                                    {employeeDetails.location}
                                </td>
                            </tr>
                            <tr className="border-gray-300  border-b">
                                <th scope="row" className="py-3 text-gray-500 font-medium">
                                    Date of Joining
                                </th>
                                <td className="py-3 text-gray-600 font-semibold">
                                    {employeeDetails.dateOfJoining}
                                </td>
                            </tr>
                            <tr className="border-gray-300 border-b">
                                <th scope="row" className="py-3 text-gray-500 font-medium align-top">
                                    Date of Resignation <span className='text-red-600'> *</span>
                                </th>
                                <td className="text-gray-500 font-semibold">
                                    <div className='align-top'>
                                        <form action="/action_page.php">
                                            <input type="date" className='w-[100px] h-8 border-none outline-none' onChangeCapture={handleDateOfResign} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDateOfResignation(e.target.value)} />
                                        </form>
                                    </div>
                                    <div className='align-bottom'>
                                        <h3 className="text-xs text-red-600">
                                            {validationErrors.dateOfResignation && (
                                                <span>{validationErrors.dateOfResignation}</span>
                                            )}
                                        </h3>
                                    </div>
                                </td>
                            </tr>
                            <tr className="border-gray-300 border-b">
                                <th scope="row" className="pt-6 text-gray-500 font-medium">
                                    Last Working Day
                                </th>
                                <div className='flex flex-col'>
                                    <td className="text-gray-600 font-semibold">
                                        Notice Period: <span className='text-red-500 text-lg'>90 day(s)</span>
                                    </td>
                                    <td className="py-3 text-gray-600 font-semibold">
                                        {lastWorkingDay}
                                    </td>
                                </div>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='col-span-1 p-10'>
                    <img src='resign.png' alt='ExitImage' className='w-full h-52' />
                </div>
            </div>
            <div className='w-[45%] mt-12 mx-8 flex items-center justify-between'>
                <h1 className='text-gray-500 font-medium'>Last Working Date Requested</h1>
                <form action="/action_page.php">
                    <input type="date" className='mr-28 w-[256px] border border-gray-300 h-9 px-2 outline-none' onChange={handleRequest} min={new Date().toISOString().split("T")[0]} />
                </form>
            </div>
            <div className=''>
                <div className='w-[45%] mt-12 mx-8 flex items-center justify-between'>
                    <h1 className='text-gray-500 font-medium'>Reason for Exit <span className='text-red-600'> *</span></h1>
                    <Dropdown placeholder={"Select"} options={exitReasonDropdown} onChange={handleReason} className='mr-28 w-[256px]' />
                </div>
                <div>
                    <h3 className="text-xs text-red-600 ml-[240px] mt-2">
                        {validationErrors.reason && (
                            <span>{validationErrors.reason}</span>
                        )}
                    </h3>
                </div>
            </div>
            <div className='w-[45%] mt-12 mx-8 flex items-start justify-between'>
                <h1 className='text-gray-500 font-medium'>Additional Remarks</h1>
                <textarea rows={4} onChange={handleRemarks} className=' mr-20 w-72 outline-none rounded-none border border-gray-300' />
            </div>
            <div className='w-[45%] space-x-10 my-20 flex ml-96'>
                <button className='bg-gray-500 px-5 py-[5px]  text-lg text-white rounded-lg hover:bg-gray-700' onClick={close}>Cancel</button>
                <button className='bg-blue-500 px-5 py-[5px]  text-lg text-white rounded-lg flex items-center gap-5  hover:bg-blue-700' onClick={applyResignation}>Initiate Exit <FaArrowRightLong /></button>
            </div>
        </div>
    );
}

export default ResignationDetails;


