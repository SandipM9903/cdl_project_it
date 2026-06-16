import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FaArrowRightLong, FaRegCircleXmark, FaArrowLeftLong } from 'react-icons/fa6';
import './SelfExitForm.css';
import Swal from 'sweetalert2';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import PendingTab from './PendingTab';
import ExitFormHistory from './ExitFormHistory';
import Service from '../../services/Service';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import { BASE_URL } from '../../../config/Config';
import EmployeeExitPastHistory from './EmployeeExitPastHistory';


function SelfExitForm() {
    const [activeTab, setActiveTab] = useState('apply');
    // const [selectedRow, setSelectedRow] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState([]);
    const [resignReason, setResignReason] = useState([]);
    // const exitReasonDropdown = resignReason.map(reason => reason.reason);
    const [isResignationDetails, setIsResignationDetails] = useState(false);
    const [isResignationApplied, setIsResignationApplied] = useState(false);
    const [resignationDetails, setResignationDetails] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const empCode = localStorage.getItem("empId")
    const workFlowName = sessionStorage.getItem('workflowName');
    // const exitReasonDropdown = ['Better Opportunity', 'Career Advancement', 'Higher Studies']
    const [exitReasonDropdown, setExitReasonDropdown] = useState([]);
    const [exitTypeDropdown, setExitTypeDropdown] = useState([]);
    const resignationData = () => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/listOfResignationByEmpId/${empCode}`)
            .then((res) => {
                setResignationDetails(res.data);
                const resignations = res.data;
                const hasPendingResignation = resignations.some(resignation =>
                    resignation.overAllStatus !== 'Withdrawn' && resignation.overAllStatus !== 'Closed' && resignation.overAllStatus !== 'Rejected'
                );
                setIsResignationApplied(hasPendingResignation);
                console.log(hasPendingResignation);
                if (resignations && resignations.length > 0) {
                    setIsResignationDetails(true);
                }
            })
            .catch((error) => {
                console.log('Error during fetching', error)
            });
    }
    const employeeData = () => {
       
        Service.getEmployeeById(empCode)
            .then((res) => {
                setEmployeeDetails(res.data);
                console.log(res, "res")
            }).catch((error) => {
                console.log("Error during fetching", error);
            });
    }
    useEffect(() => {
        resignationData();
        employeeData();
    }, []);
    const wfSeqId = resignationDetails.find(details => details.wfSeqId !== null && details.overAllStatus !== 'Withdrawn' && details.overAllStatus !== 'Closed' && details.overAllStatus !== 'Rejected')?.wfSeqId || null;
    console.log(wfSeqId, "wfSeqId--------------------------------->")
    sessionStorage.setItem("wfSeqId",wfSeqId);


    useEffect(() => {
        if (wfSeqId) {
            axios.get(`${BASE_URL}:9029/api/eSeparation/getOverAllStatus/${wfSeqId}`)
                .then(() => {
                    console.log("ok");
                })
                .catch((error) => {
                    console.log("Error during Fetching", error);
                })
        }
    }, [wfSeqId])
    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/exitReasons`)
            .then(response => {
                setExitReasonDropdown(response.data);
            })
            .catch(error => {
                console.error("Error fetching exit reasons:", error);
            });
    }, []);
    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/exitTypeForEmployee`)
            .then(response => {
                setExitTypeDropdown(response.data);
            })
            .catch(error => {
                console.error("Error fetching exit reasons:", error);
            });
    }, []);



    const navigate = useNavigate();

    function handlePrevious() {
        navigate(-1);
    }

    const getDropdown = () => {
        Service.getReasonDropdown()
            .then((res) => {
                setResignReason(res.data);
            })
            .catch((error) => {
                console.log("Error in fetching Data", error);
            });
    }

    // useEffect(() => {
    //     setSelectedRow(null);
    // }, [activeTab]);

    const handleApplyResignation = () => {
        setIsPopupOpen(true);
    };

    const close = () => {
        setIsPopupOpen(false);
        window.location.reload();
    }

    const popupStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: "1000"
    };

    const popupContentStyles = {
        top: 0,
        width: "90%",
        height: "90%",
        background: 'white',
        position: 'relative',
        overflowY: 'auto',
        zIndex: "1000"

    };

    const formatDate = (dateString) => {
        if (!dateString || isNaN(new Date(dateString).getTime())) {
            return '-';
        }
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const [dateOfResignation, setDateOfResignation] = useState('');
    const [lastWorkingDay, setLastWorkingDay] = useState('');

    useEffect(() => {
        if (dateOfResignation) {
            const resignationDate = new Date(dateOfResignation);
            const lastWorkingDate = new Date(resignationDate.setDate(resignationDate.getDate() + 89));
            setLastWorkingDay(lastWorkingDate);

            setResignData(prevState => ({
                ...prevState,
                lastWorkingDay: lastWorkingDate
            }));
        }
    }, [dateOfResignation]);


    useEffect(() => {
        if (selectedFile) {
            console.log("Updating resignData with file:", selectedFile);
            setResignData(prevState => ({
                ...prevState,
                file: selectedFile
            }));
        }
    }, [selectedFile]);


    console.log("selectedFile >>", selectedFile)

    const [resignData, setResignData] = useState({
        empCode: employeeDetails.empCode,
        dateOfResignation: "",
        lastWorkingDay: "",
        lastWorkingDayRequest: "",
        exitType: "",
        reason: "",
        remarks: "",
        file: null,
        reportingmgrEmailId: employeeDetails.reportingmgrEmailId
    });
    console.log("resignData >>", resignData)
    const [count, setCount] = useState(0);
    const applyResignation = () => {
        if (!validateFields()) {
            return;
        }

        Swal.fire({
            title: 'Applying for Resignation',
            text: "Do you want to apply for resignation?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                const resignationBlob = new Blob([JSON.stringify(resignData)], { type: "application/json" });
                formData.append("resignationDetails", resignationBlob);
                if (selectedFile) {
                    formData.append("file", selectedFile);  // Ensure file is included
                    console.log("Appending file to formData:", selectedFile);
                } else {
                    console.log("No file found in selectedFile!");
                }
                setCount(count+1);

                axios.post(`${BASE_URL}:9029/api/eSeparation/applyResign/${empCode}/${workFlowName}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(() => {
                        console.log("Resignation request submitted");
                        setIsPopupOpen(false);
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error during submission:", error);
                    });
            }
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
    const handleType = (selectedOptions) => {
        setResignData({
            ...resignData,
            exitType: selectedOptions.value
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
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        console.log("Selected File:", file);
        if (file) {
            setSelectedFile(file);
            console.log("Selected File22:", file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null); // Reset the selected file
    };

    const [validationErrors, setValidationErrors] = useState({
        dateOfResignation: "",
        exitType: "",
        reason: "",
        // file:"",
        lastWorkingDayRequest: "",
        remarks:""
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
        if (!resignData.exitType) {
            errors.exitType = "Exit Type is required";
            isValid = false;
        }
        // if (!resignData.file) {
        //     errors.file = "Document is required";
        //     isValid = false;
        // }

        if (!resignData.reason) {
            errors.reason = "Reason is required";
            isValid = false;
        }
        if (!resignData.remarks) {
            errors.remarks = "Remarks is required";
            isValid = false;
        }  
        // } else {
        //     errors.reason = "";
        // }

        setValidationErrors(errors);
        return isValid;
    };
    console.log("Employee Details", employeeDetails);


    let roles = [];
    try {
        roles = JSON.parse(sessionStorage.getItem('role')) || [];
    } catch (e) {
        console.error('Error parsing roles from sessionStorage:', e);
    }

    // Function to check if the user has a specific role
    const hasRole = (role) => roles.includes(role);
    return (
        <div className="flex flex-col h-screen">
            {/* Conditionally render NavHead based on roles */}
<Header/>
            <div className="  mt-20 flex-grow bg-white ">
                <div className='container mx-auto bg-white'>
                    <div className='flex items-center gap-6 text-sm mx-20 pt-10'>
                        <button className='text-blue-500' onClick={handlePrevious}><FaArrowLeftLong /></button>
                        <h1 className='font-black'>E-Exit</h1>
                    </div>
                    <div className="text-[15px] font-bold text-center text-gray-700 mt-5">
                        <ul className="flex flex-wrap justify-center -mb-px">
                            <li className="">
                                <button onClick={() => setActiveTab('apply')} className={`inline-block py-2 px-8 border rounded-l-md font-medium ${activeTab === 'apply' ? 'bg-blue-400 text-white' : 'border-gray-400 hover:text-gray-900'}`}>Apply</button>
                            </li>
                            <li className="mx-[1px]">
                                <button onClick={() => setActiveTab('pending')} className={`inline-block py-2 px-6 border font-medium ${activeTab === 'pending' ? 'bg-blue-400 text-white' : 'border-gray-400 hover:text-gray-900'} ${!isResignationApplied ? 'cursor-not-allowed opacity-50' : ''}`} disabled={!isResignationApplied}>Pending</button>
                            </li>
                            <li className="">
                                <button onClick={() => setActiveTab('history')} className={`inline-block py-2 px-6 rounded-r-md border font-medium ${activeTab === 'history' ? 'bg-blue-400 text-white' : 'border-gray-400 hover:text-gray-900'} ${!isResignationDetails ? 'cursor-not-allowed opacity-50' : ''}`} disabled={!isResignationDetails}>History</button>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        {activeTab === 'apply' && (
                            !isResignationApplied ? (
                                <div className='text-center mt-8'>
                                    <div className='flex justify-center items-center mt-8'>
                                        {/* <img src='selfExit.png' className='w-[50vh] h-[30vh]' alt='SelfExitImage' /> */}

                                    </div>
                                    <h1 className='text-sm text-gray-800 font-semibold mt-2'>We are regretting to see you here.</h1>
                                    <h1 className='text-base text-gray-500 font-semibold mt-6'>If you really made a decision to Leave, You can continue by clicking the Button below.</h1>
                                    <button className='bg-blue-400 py-2 px-10 rounded-md text-white font-semibold mt-8' onClick={() => { handleApplyResignation(); getDropdown(); }}>Apply for Resignation</button>
                                </div>
                            ) : (
                                <div className='text-center'>
                                    <div className='flex justify-center'>
                                        <h1 className='bg-[#C9F4CB] flex items-center text-[#3ED745] py-1 px-6 gap-6 shadow-bottom'>
                                            <IoMdCheckmarkCircleOutline /> You have successfully applied for Resignation
                                        </h1>
                                    </div>
                                    <div className='flex justify-center items-center mt-3'>
                                        <img src='pendingApproval.png' className='w-[50vh] h-[20vh]' alt='PendingPic' />
                                    </div>
                                    <h1 className='text-sm text-gray-800 font-semibold mt-2'>Your Resignation approval is Pending</h1>
                                    <h1 className='text-base text-gray-500 font-semibold mt-3'>You have already applied for Resignation, Please check Pending Tab</h1>
                                </div>
                            )
                        )}
                        {isPopupOpen && (
                            <div style={popupStyles}>
                                <div style={popupContentStyles}>
                                    <div className='container mx-auto' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                                        <div className='flex items-center justify-between mx-8 py-4 border-b-2 border-gray-300'>
                                            <h1 className='text-gray-700 font-semibold text-sm'>Employee Resignation Details</h1>
                                            <button className='text-sm text-red-500' onClick={close}><FaRegCircleXmark /></button>
                                        </div>
                                        <div className='grid grid-cols-2 mt-6 mx-8'>
                                            <div className='col-span-1 mt-8 '>
                                                <table className="w-[90%] text-base text-left rtl:text-right">
                                                    <tbody>
                                                        <tr className="border-b border-gray-300">
                                                            <th scope="row" className="py-3 font-medium text-gray-500 text-xs">
                                                                Employee Name
                                                            </th>
                                                            <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                                                {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b border-gray-300">
                                                            <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                                                Email
                                                            </th>
                                                            <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                                                {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.emailId || "-"}
                                                            </td>
                                                        </tr>
                                                        <tr className=" border-gray-300  border-b">
                                                            <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                                                Employee Code
                                                            </th>
                                                            <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                                                {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.empCode || "-"}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-gray-300 border-b">
                                                            <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                                                Reporting Manager
                                                            </th>
                                                            <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                                                {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.reportingManager || "-"}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-gray-300  border-b">
                                                            <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                                                Location
                                                            </th>
                                                            <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                                                {employeeDetails?.userDTO?.locationResDTO?.locationName || "-"}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-gray-300  border-b">
                                                            <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                                                Date of Joining
                                                            </th>
                                                            <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                                                {formatDate(employeeDetails?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining) || "-"}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-gray-300 border-b">
                                                            <th scope="row" className="py-3 text-gray-500 font-medium align-top text-xs">
                                                                Date of Resignation <span className='text-red-600'> *</span>
                                                            </th>
                                                            <td className="text-gray-500 font-semibold">
                                                                <div className='align-top flex items-center'>
                                                                    <form action="/action_page.php">
                                                                        <input type="date" className=' w-[150px] h-8 border-none outline-none ml-3 text-xs' onChangeCapture={handleDateOfResign} onChange={(e) => setDateOfResignation(e.target.value)} max={new Date().toISOString().split("T")[0]}/>
                                                                    </form>
                                                                    {dateOfResignation && (
                                                                        <span className="ml-2 text-green-600 font-bold">&#10003;</span> // Tick mark
                                                                    )}
                                                                </div>
                                                                <div className='align-bottom'>
                                                                    <h3 className="text-xs text-red-600 ml-3 text-xs">
                                                                        {validationErrors.dateOfResignation && (
                                                                            <span>{validationErrors.dateOfResignation}</span>
                                                                        )}
                                                                    </h3>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr className="border-gray-300 border-b">
                                                            <th scope="row" className="pt-6 text-gray-500 font-medium text-xs">
                                                                Last Working Day
                                                            </th>
                                                            <div className='flex flex-col'>
                                                                <td className="text-gray-600 text-xs  px-3 font-semibold">
                                                                    Notice Period: <span className='text-red-500 text-xs'>90 day(s)</span>
                                                                </td>
                                                                <td className="py-3 px-3 text-gray-600 font-semibold text-xs">
                                                                    {formatDate(lastWorkingDay)}
                                                                </td>
                                                            </div>
                                                        </tr>
                                                        <tr className="border-gray-300 border-b">
                                                            <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                                                Upload Document
                                                            </th>
                                                            <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                                                {!selectedFile ? (
                                                                    <div>
                                                                        <input
                                                                            type="file"
                                                                            name="file"
                                                                            className="border border-gray-300 p-2 text-xs"
                                                                            onChange={handleFileUpload}

                                                                        />
                                                                        <p className="text-gray-400 text-xs mt-1">Attach your mail pdf here ( Max Limit: 100MB )</p>
                                                                    </div>

                                                                ) : (
                                                                    <div className="flex items-center">
                                                                        <span className="text-xs mr-2">{selectedFile.name}</span>
                                                                        <button
                                                                            className="text-red-500 text-lg ml-2"
                                                                            onClick={handleRemoveFile}>
                                                                            ✖
                                                                        </button>

                                                                    </div>

                                                                )}
                                                            </td>
                                                            {/* <h3 className="text-xs ml-[240px] text-red-600 mt-2">
                                                    {validationErrors.file && (
                                                        <span>{validationErrors.file}</span>
                                                    )}
                                                </h3> */}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className='col-span-1 p-10'>
                                                <img src='resign.png' alt='ExitImage' className='w-full h-52' />
                                            </div>
                                        </div>
                                        <div>
                                            <div className='w-[45%] mt-12 mx-8 flex items-center justify-between text-xs' >
                                                <h1 className='text-gray-500 font-medium'>Last Working Date Requested</h1>
                                                <form action="/action_page.php" className="flex flex-col md:flex-row gap-4">
                                                    <input type="date" className='border border-gray-300 h-7 px-2 outline-none text-xs w-full md:w-[180px] lg:w-[250px] mr-16' onChange={handleRequest}  />
                                                </form>
                                            </div>
                                            <div>
                                                <h3 className="text-xs ml-[240px] text-red-600 mt-2">
                                                    {validationErrors.lastWorkingDay && (
                                                        <span>{validationErrors.lastWorkingDay}</span>
                                                    )}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className='typeDropdown'>
                                            <div className='w-[45%] mt-12 mx-8 flex items-center justify-between'>
                                                <h1 className='text-gray-500 text-xs font-medium'>Exit Type <span className='text-red-600'> *</span></h1>
                                                <Dropdown placeholder={"Select"} options={exitTypeDropdown} onChange={handleType} className='mr-16 w-[300px]' />
                                            </div>
                                            <div>
                                                <h3 className="text-xs text-red-600 ml-[260px] mt-2">
                                                    {validationErrors.exitType && <span>{validationErrors.exitType}</span>}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className='reasonDropdown'>
                                            <div className='w-[45%] mt-12 mx-8 flex items-center justify-between'>
                                                <h1 className='text-gray-500 text-xs font-medium'>Reason for Exit <span className='text-red-600'> *</span></h1>
                                                <Dropdown placeholder={"Select"} options={exitReasonDropdown} onChange={handleReason} className='mr-16 w-[300px]' />
                                            </div>
                                            <div>
                                                <h3 className="text-xs text-red-600 ml-[260px] mt-2 ">
                                                {validationErrors.reason && <span>{validationErrors.reason}</span>}
                                                    
                                                </h3>
                                            </div>
                                        </div>


                                        <div className='addremarks'>
                                        <div className='w-[45%] mt-12 mx-8 flex items-start justify-between'>
                                            <h1 className='text-gray-500 text-xs font-medium'>Additional Remarks</h1>
                                            <textarea rows={4} onChange={handleRemarks} className=' mr-8 w-72 outline-none rounded-none border border-gray-300' />
                                        </div>

                                        <div>
                                                <h3 className="text-xs text-red-600 ml-[260px] mt-2 ">
                                                    {validationErrors.remarks && (
                                                        <span>{validationErrors.remarks}</span>
                                                    )}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className='w-[45%] space-x-10 my-20 flex lg:ml-96 md:ml-60 ml-40'>
                                            <button className='bg-gray-500 px-5 py-[5px]  text-sm text-white rounded-lg hover:bg-gray-700' onClick={close}>Cancel</button>
                                            <button className={`bg-blue-500 px-5 py-[5px]  text-sm text-white rounded-lg flex items-center gap-5  hover:bg-blue-700 ${count > 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700'}`} onClick={applyResignation} disabled={count > 0}>Initiate Exit <FaArrowRightLong /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* {activeTab === 'pending' && isResignationApplied ? (<PendingTab employeeDetails={employeeDetails} resignationDetails={resignationDetails} />) : activeTab === 'pending' ? (<div className='text-center'>No pending resignations</div>) : null}
                        {activeTab === 'history' && <ExitFormHistory resignationDetails={resignationDetails} employeeDetails={employeeDetails} resignationData={resignationData} />}
                     */}
                    
                      {activeTab === 'pending' && <ExitFormHistory resignationDetails={resignationDetails} employeeDetails={employeeDetails} resignationData={resignationData} />}
                         {activeTab === 'history' && <EmployeeExitPastHistory resignationDetails={resignationDetails} employeeDetails={employeeDetails} resignationData={resignationData} />}

                    
                    
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelfExitForm;

