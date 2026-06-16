import React, { useState, useEffect } from 'react';
import ExitService from '../../services/ExitService';
import axios from 'axios';
import StoreDept from './DepartmentQuestions/StoreDept';
import AdminDept from './DepartmentQuestions/AdminDept';
import SalesDept from './DepartmentQuestions/SalesDept';
import FinanceDept from './DepartmentQuestions/FinanceDept';
import ITDept from './DepartmentQuestions/ITDept';
import HRDept from './DepartmentQuestions/HRDept';
import BUDept from './DepartmentQuestions/BUDept';
import KTDept from './DepartmentQuestions/KTDept';
import DetailedView from './DetailedView';
import { BASE_URL } from '../../../../config/Config';


export const RequestPending = () => {
    const [data, setData] = useState([]);
    const [wfLevelActions, setWfLevelActions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [selectedSeqId, setSelectedSeqId] = useState(null);
    //const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
    const [actorRemark, setActorRemark] = useState('');
    // const userId_item_value = sessionStorage.getItem("UserId");
    // const userId_item_value = 8;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState({});
    console.log(data, "+++++++++++++++++")
    const userId_actor = localStorage.getItem("empId");
    const [itemStatusInfo, setItemStatusInfo] = useState([]);
    console.log(itemStatusInfo.actorId, "{{{{{{{{{{")

    useEffect(() => {
        // First, fetch the resignation details
        axios.get(`${BASE_URL}:9028/api/workflow/getexitemployeelist/${userId_actor}`)
            .then((res) => {
                const resignData = res.data;
                console.log(resignData + "Resign Data########################")
                // Create an array of promises to fetch employee details for each resignation
                const employeeDetailPromises = resignData.map(resignDetail =>

                    axios.get(`${BASE_URL}:9029/api/eSeparation/getEmployee/${resignDetail.empCode}`)

                );
                // Wait for all promises to resolve
                Promise.all(employeeDetailPromises)
                    .then((responses) => {
                        // Extract the employee details from each response
                        const empDetails = responses.map(response => response.data);

                        // Merge the resignation details with the corresponding employee details
                        const mergedData = empDetails.map(empDetail => {
                            const matchingResignDetail = resignData.find(resignDetail => empDetail.fileAndObjectTypeBean.empResDTO.empCode === resignDetail.empCode);
                            return { ...empDetail, ...matchingResignDetail };
                        });

                        setData(mergedData);

                        // Call getImage for each empCode in mergedData
                        //  mergedData.forEach(empDetail => getImage(empDetail.empCode));
                    })
                    .catch((error) => {
                        console.log("Error fetching employee details", error);
                    });
            })
            .catch((error) => {
                console.log("No Resignation Details Fetched", error);
            });
    }, [userId_actor]);

    // useEffect(() => {
    //     if (data.length > 0) {
    //         const firstWfSeqId = data[0]?.wfSeqId;

    //         if (firstWfSeqId) {
    //             axios.get(`${BASE_URL}:9001/api/workflow/itemStatus/${firstWfSeqId}/${userId_actor}`)
    //                 .then((res) => {
    //                     setItemStatusInfo(res.data);
    //                     console.log(res.data, "Item Status Data");
    //                 })
    //                 .catch((error) => {
    //                     console.log("Error fetching item status details", error);
    //                 });
    //         }
    //     }
    // }, [data, userId_actor]);

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

    // useEffect(() => {
    //     axios.get(`${BASE_URL}:9001/api/workflow/getexitemployeelist/${userId_item_value}`)
    //         .then(res => {
    //             setData(res.data);
    //             console.log("response data =======", res.data);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //             alert("Error fetching data");
    //         });
    // }, [userId_item_value]);


    const selectOption = (seqId, userId_actor) => {
        ExitService.getWfLevelActions(seqId, userId_actor)
            .then((response) => {
                setWfLevelActions(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
                alert("Error occurred while fetching actions.");
            });
    };

    const handleOptionChange = (event, seqId) => {
        const selectedValue = event.target.value;
        setSelectedSeqId(seqId);
        //setIsRemarkModalOpen(true);

        setSelectedOptions(prevSelectedOptions => ({
            ...prevSelectedOptions,
            [seqId]: selectedValue
        }));
    };

    const openPopup = (employee) => {
        setSelectedEmployee(employee);
        setIsPopupOpen(true);
        if (employee?.wfSeqId) {
            axios.get(`${BASE_URL}:9028/api/workflow/itemStatus/${employee?.wfSeqId}/${userId_actor}`)
                .then((res) => {
                    setItemStatusInfo(res.data);
                })
                .catch((error) => {
                    console.error("Error fetching item status details", error);
                });
        }
    };

    const closePopup = () => {
        setItemStatusInfo([]);
        setSelectedEmployee(null);
        setIsPopupOpen(false);
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-xl text-gray-900 font-semibold mx-16 mt-6">Pending Exit List</h1>
                </div>
            </div>
            {data.length === 0 ? (
                <div className="mt-10 text-center text-gray-700">
                    <h2 className="text-xl font-semibold">There are no pending requests for this user.</h2>
                </div>
            ) : (
                <>
                    {data.map((employee) => (
                        <div key={employee?.id} className="grid grid-cols-5 mx-16 mt-6 border rounded-lg border-gray-500 p-2 shadow-bottom">
                            <div className="col-span-1 w-40 text-center">
                                <h1 className="text-gray-600 font-semibold">Employee Name</h1>
                                {employee?.fileAndObjectTypeBean?.fileAndContentTypeBean && employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file ? (
                                    <img
                                        src={`data:${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file}`}
                                        className="h-[12vh] w-[14vh] rounded-full mt-7 mx-auto"
                                        alt="Profile"
                                    />
                                ) : (
                                    <img
                                        src="/profile.webp"
                                        className="rounded-full h-12 w-12"
                                        alt="Default Profile"
                                    />
                                )}
                                {/* <img src="logo512.png" alt="ProfilePicture" className="h-[12vh] w-[14vh] rounded-full mt-7 mx-auto" /> */}
                                <h1 className="text-2xl text-blue-700 font-semibold">{employee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar}</h1>
                                <h1 className='text-sm -mt-1 text-gray-600'>{employee?.fileAndObjectTypeBean?.empResDTO?.designation}</h1>
                                <h1 className="text-gray-800 text-sm">{employee?.fileAndObjectTypeBean?.empResDTO?.empCode}</h1>
                            </div>
                            <div className='col-span-1 w-[270px]'>
                                <h1 className='mx-4 text-gray-600 font-semibold'>Exit Info</h1>
                                <div className='flex'>
                                    <div className='text-sm p-2'>
                                        <h1 className='mt-2'>Joining Date</h1>
                                        <h1 className='my-3'>Date of Resignation</h1>
                                        <h1 className='my-3'>Last Working Date</h1>
                                        <h1 className=''>Expected Last <br /> Working Date</h1>
                                    </div>
                                    <div className='text-sm text-[#00007D] p-2 ml-4'>
                                        <h1 className='mt-2'>{formatDate(employee?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining) || "-"}</h1>
                                        <h1 className='my-3'>{formatDate(employee?.dateOfResignation) || "-"}</h1>
                                        <h1 className='my-3'>{formatDate(employee?.lastWorkingDay) || "-"}</h1>
                                        <h1>{formatDate(employee?.expectedLastWorkingDay) || "NA"}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 ml-4 w-56">
                                <h1 className="text-gray-600 font-semibold mx-4">Exit Reason</h1>
                                <h1 className="text-gray-800 font-semibold text-sm mt-3 mx-6">{employee?.reason || '-'}</h1>
                                <h1 className="text-gray-600 text-sm ml-6">{employee?.remarks || '-'}</h1>
                            </div>
                            <div className='text-center space-x-4 mt-5 mb-10'>
                                <button className='hover:bg-[#1B5CAD] bg-[#2970c7] text-white py-2 px-6' onClick={() => openPopup(employee)}> Click Here</button>
                                {isPopupOpen && selectedEmployee && (
                                    <div className='fixed top-0 -left-4 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                                        <div className='w-[80%] pb-10 bg-white relative overflow-y-auto'>
                                            {/* <DetailedView selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} /> */}
                                            {itemStatusInfo && itemStatusInfo.deptId === 2 && (
                                                <KTDept selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} />
                                            )}
                                            {itemStatusInfo && itemStatusInfo.deptId === 3 && (
                                                <SalesDept selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} />
                                            )}
                                            {itemStatusInfo && itemStatusInfo.deptId === 4 && (
                                                <StoreDept selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} />
                                            )}
                                            {itemStatusInfo && itemStatusInfo.deptId === 5 && (
                                                <AdminDept selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} />
                                            )}
                                            {itemStatusInfo && itemStatusInfo.deptId === 6 && (
                                                <FinanceDept selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} />
                                            )}
                                            {itemStatusInfo?.actorId === userId_actor && itemStatusInfo?.deptId === 0 && (
                                                <FinanceDept selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} />
                                            )}
                                            {itemStatusInfo && itemStatusInfo.deptId === 7 && (
                                                <ITDept selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} />
                                            )}
                                            {itemStatusInfo && itemStatusInfo.deptId === 8 && (
                                                <HRDept selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} />
                                            )}
                                            {itemStatusInfo && itemStatusInfo.deptId === 9 && (
                                                <BUDept selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default RequestPending;