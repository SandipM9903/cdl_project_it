import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { BASE_URL } from '../../../../config/Config';

function StoreDept({ selectedEmployee, onClose }) {

    const [wfLevelActions, setWfLevelActions] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    //const [selectedOptions, setSelectedOptions] = useState({});
    const [actorRemark, setActorRemark] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const statusDropdown = ['Yes', 'No'];
    const [storeQuestions, setStoreQuestions] = useState([]);
    const [storeData, setStoreData] = useState({
        wfSeqId: '',
        manuals: '',
        spareMaterials: '',
        tools: '',
        storeInCharge: '',
        storeRemarks: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStoreData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDropdownChange = (name) => (selectedOptions) => {
        setStoreData(prevData => ({
            ...prevData,
            [name]: selectedOptions.value === 'Yes' ? true : false
        }));
    };

    const [errors, setErrors] = useState({});

    const validate = () => {
        let errors = {};
        let isValid = true;

        if (storeData.manuals === "") {
            errors.manuals = 'Field is required';
            isValid = false;
        }

        if (storeData.spareMaterials === "") {
            errors.spareMaterials = 'Field is required';
            isValid = false;
        }

        if (storeData.tools === "") {
            errors.tools = 'Field is required';
            isValid = false;
        }
        if (storeData.storeInCharge.trim() === "") {
            errors.storeInCharge = 'Field is required';
            isValid = false;
        }
        if (storeData.storeRemarks.trim() === "") {
            errors.storeRemarks = 'Field is required';
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestionsByDept/Store`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptName === 'Store');
                if (department) {
                    setStoreQuestions(department.questions);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            const fetchActions = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}:9028/api/workflow/getWfLevelActions/${selectedEmployee.wfSeqId}/${deptUserId}/${selectedEmployee.wfItemSeqNum}`);
                    // setActions(response.data);
                    console.log("level actions====", response.data);
                    setWfLevelActions(response.data);
                } catch (error) {
                    console.error("Error fetching workflow level actions", error);
                }
            };
            fetchActions();
        }
    }, [selectedEmployee]);

    // Handle action click
    const handleActionClick = (action) => {
        setSelectedAction(action);

        // Run validation only for "Approve"
        if (action.includes("Approve")) {
            const isValid = validate();
            if (!isValid) return; // Stop here if not valid

            setPopupVisible(true); // show remarks popup if valid
        } else {
            // For Hold (or others), skip validation and show popup
            setPopupVisible(true);
        }
    };

    const deptUserId = localStorage.getItem("empId");
    // Handle confirmation
    const handleActionConfirmation = async () => {
        try {
            const url = `${BASE_URL}:9028/api/workflow/getActions/${selectedEmployee.wfSeqId}/${deptUserId}/${actorRemark}/${selectedEmployee.wfItemSeqNum}?selectedOption=${selectedAction}`;
            const response = await axios.get(url);
            // alert(`Action ${selectedAction} was ${response.data}`);

            await handleApprove();


            setPopupVisible(false);
            window.location.reload();
        } catch (error) {
            console.error("Error confirming action", error);
            alert("An error occurred while processing your request.");
        }
    };

    // Handle popup close
    const handleClosePopup = () => {
        setPopupVisible(false);
    };

    const handleApprove = () => {
        const data = ({
            ...storeData,
            wfSeqId: selectedEmployee.wfSeqId
        })
        axios.post(`${BASE_URL}:9029/api/eSeparation/fillStoreForm/${selectedAction}`, data)
            .then(() => {
                console.log("Posted");
                window.location.reload();
            })
            .catch((err) => {
                console.log("error", err);
            });
    }

    return (
        <>
            <div className='justify-between flex item-start'>
                <h1 className='text-gray-800 font-semibold mx-5 mt-3'>To be filled by Store Department</h1>
                <h1 className='text-red-500 text-xl' onClick={onClose}><FaRegCircleXmark /></h1>
            </div>
            <div className='mx-5 text-left mt-4 mb-4' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className='mx-10 mt-3 text-gray-500 text-xs'>
                    {/* Employee Name Field */}
                    <div className='grid grid-cols-3 mt-3'>
                        <h1>
                            Employee Name
                        </h1>
                        <div>
                            <input
                                type="text"
                                name="employeeName"
                                value={selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || '-'}
                                disabled
                                className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm bg-gray-100 text-gray-700'
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-3 mt-3'>
                        <h1>
                            Employee Code
                        </h1>
                        <div>
                            <input
                                type="text"
                                name="employeeCode"
                                value={selectedEmployee?.empCode || '-'}
                                disabled
                                className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm bg-gray-100 text-gray-700'
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-3 mt-3'>
                        <h1>
                            Project Name
                        </h1>
                        <div>
                            <input
                                type="text"
                                name="projectCode"
                                value={selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.projectResDTO?.projectName || '-'}
                                disabled
                                className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm bg-gray-100 text-gray-700'
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-3 mt-3'>
                        <h1>
                            Reporting Manager
                        </h1>
                        <div>
                            <input
                                type="text"
                                name="reportingManager"
                                value={selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.reportingManager || '-'}
                                disabled
                                className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm bg-gray-100 text-gray-700'
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-3 mt-3'>
                        <h1>
                            Location
                        </h1>
                        <div>
                            <input
                                type="text"
                                name="location"
                                value={selectedEmployee?.userDTO?.locationResDTO?.locationName || '-'}
                                disabled
                                className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm bg-gray-100 text-gray-700'
                            />
                        </div>
                    </div>
                    {storeQuestions.map((question, index) => (
                        <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                            <h1 className=''>{question.questionText} <span className='text-red-500'> *</span></h1>
                            <div className='FormDropdown'>
                                {index === 0 && (
                                    <>
                                        <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} onChange={handleDropdownChange('manuals')} />
                                        {errors.manuals && <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>{errors.manuals}</p>}
                                    </>
                                )}
                                {index === 1 && (
                                    <>
                                        <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} onChange={handleDropdownChange('spareMaterials')} />
                                        {errors.spareMaterials && <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>{errors.spareMaterials}</p>}
                                    </>
                                )}
                                {index === 2 && (
                                    <>
                                        <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} onChange={handleDropdownChange('tools')} />
                                        {errors.tools && <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>{errors.tools}</p>}
                                    </>
                                )}
                                {index === 3 && (
                                    <>
                                        <input type="text" name="storeInCharge" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm' onChange={handleChange} />
                                        {errors.storeInCharge && <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>{errors.storeInCharge}</p>}
                                    </>
                                )}
                                {index === 4 && (
                                    <>
                                        <textarea name="storeRemarks" rows={3} className={`FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm ${errors.storeRemarks ? '' : 'mb-6'}`} onChange={handleChange} />
                                        {errors.storeRemarks && <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>{errors.storeRemarks}</p>}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='space-x-6 justify-center'>
                {wfLevelActions && wfLevelActions.map((action, index) => {
                    const filteredAction = action.replace(/[^a-zA-Z-]/g, '');
                    if (filteredAction === 'Approve' || filteredAction === 'Hold') {
                        return (
                            <button
                                key={index}
                                className={`py-2 px-4 rounded-md ${filteredAction === 'Approve' ? 'bg-lime-500 hover:bg-lime-600' : filteredAction === 'Hold' ? 'bg-gray-400 hover:bg-gray-500' : filteredAction === 'Re-Submit' ? 'bg-blue-400 hover:bg-blue-500' : 'bg-red-500 hover:bg-red-600'} text-white`}
                                onClick={() => handleActionClick(action)}
                            >
                                {filteredAction}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>
            {popupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
                    <div className="bg-white p-4 rounded-lg w-full md:w-1/3">
                        <h2 className="text-xl font-semibold">Add Remark</h2>
                        <textarea
                            value={actorRemark}
                            onChange={(e) => setActorRemark(e.target.value)}
                            className="w-full h-24 border border-gray-300 mt-2 p-2"
                            placeholder="Add your remarks here"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                                onClick={handleActionConfirmation}
                            >
                                Confirm
                            </button>
                            <button
                                className="bg-gray-500 text-white py-2 px-4 rounded-md ml-2"
                                onClick={handleClosePopup}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default StoreDept;