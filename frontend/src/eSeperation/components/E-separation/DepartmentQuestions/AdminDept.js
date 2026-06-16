import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { BASE_URL } from '../../../../config/Config';
function AdminDept({ selectedEmployee, onClose }) {

    const [wfLevelActions, setWfLevelActions] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    //const [selectedOptions, setSelectedOptions] = useState({});
    const [actorRemark, setActorRemark] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const statusDropdown = ['Yes', 'No'];
    const [adminQuestions, setAdminQuestions] = useState([]);

    const [adminData, setAdminData] = useState({
        wfSeqId: '',
        officeStationery: '',
        officeStationeryRemarks: '',
        lockerKeys: '',
        others: '',
        othersRemarks: '',
        adminInCharge: '',
        adminInChargeCode: '',
        adminRemarks: '',
        idCard: '',
        fileOrDocument: '',



    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const renderStatusCheckboxes = (fieldName) => {
        const options = ["Submitted", "Not Submitted", "Not Alloted"];

        return (
            <div className="mb-4">

                <div className="flex items-center gap-14 ml-2">
                    {options.map((option) => (
                        <label key={option} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={adminData[fieldName] === option}
                                onChange={() =>
                                    setAdminData((prev) => ({
                                        ...prev,
                                        [fieldName]: option
                                    }))
                                }
                            />
                            <span className="text-sm">{option}</span>
                        </label>
                    ))}
                </div>

                {errors[fieldName] && (
                    <p className="text-red-500 text-[10px] font-semibold ml-2 mt-1">
                        {errors[fieldName]}
                    </p>
                )}
            </div>
        );
    };

    const handlelockerDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setAdminData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : {
                [`${name}Remarks`]: ''  // Clear remarks if "No"
            })
        }));
    };
    const handleOfficeStationaryDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setAdminData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : {
                [`${name}Remarks`]: ''  // Clear remarks if "No"
            })
        }));
    };

    const handleOthersDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setAdminData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : {
                [`${name}Remarks`]: ''  // Clear remarks if "No"
            })
        }));
    };

    const [errors, setErrors] = useState({});

    const validate = () => {
        let errors = {};
        let isValid = true;

        if (adminData.officeStationery === "") {
            errors.officeStationery = 'Field is required';
            isValid = false;
        }

        if (adminData.lockerKeys === "") {
            errors.lockerKeys = 'Field is required';
            isValid = false;
        }
        if (adminData.idCard === "") {
            errors.idCard = 'Field is required';
            isValid = false;
        }
        if (adminData.fileOrDocument === "") {
            errors.fileOrDocument = 'Field is required';
            isValid = false;
        }

        if (adminData.others === "") {
            errors.others = 'Field is required';
            isValid = false;
        }
        if (adminData.adminInCharge.trim() === "") {
            errors.adminInCharge = 'Field is required';
            isValid = false;
        }
        if (adminData.adminInChargeCode.trim() === "") {
            errors.adminInChargeCode = 'Field is required';
            isValid = false;
        }
        if (adminData.adminRemarks.trim() === "") {
            errors.adminRemarks = 'Field is required';
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestionsByDept/Admin`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptName === "Admin");
                if (department) {
                    setAdminQuestions(department.questions);
                }
                console.log("Selected Employee log .....::::::::", selectedEmployee);
            })
            .catch((err) => {
                console.log("error", err);
            });
    }, []);
    // useEffect(() => {
    //     const fetchAdminFormData = async () => {
    //         if (selectedEmployee) {
    //             try {
    //                 const res = await axios.get(`http://localhost:9029/api/eSeparation/getAdminFormDataBasedOnSeqId/${selectedEmployee.wfSeqId}`);
    //                 // if (res.data) {
    //                 //     setExistingFormData(res.data); // Only if status is "Hold"
    //                 // }
    //             } catch (error) {
    //                 console.error("Error fetching admin form data", error);
    //             }
    //         }
    //     };

    //     fetchAdminFormData();
    // }, [selectedEmployee]);
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

    const deptUserId = localStorage.getItem("empId")


    // Handle confirmation
    const handleActionConfirmation = async () => {
        try {
            const url = `${BASE_URL}:9028/api/workflow/getActions/${selectedEmployee.wfSeqId}/${deptUserId}/${actorRemark}/${selectedEmployee.wfItemSeqNum}?selectedOption=${selectedAction}`;
            const response = await axios.get(url);
            // alert(`Action ${selectedAction} was ${response.data}`);

            await handleApprove(selectedAction);


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

    const handleApprove = (selectedAction) => {

        const data = ({
            ...adminData,
            wfSeqId: selectedEmployee.wfSeqId

        })
        console.log("Admin data::::" + JSON.stringify(data))

        axios.post(`${BASE_URL}:9029/api/eSeparation/fillAdminForm/${selectedAction}`, data)
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
                <h1 className='text-gray-800 font-semibold mx-5 mt-3'>To be filled by Admin::</h1>
                <h1 className='text-red-500 text-xl' onClick={onClose}><FaRegCircleXmark /></h1>
            </div>
            {/* <div className="mx-5 mt-2 text-sm text-gray-700 border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <h1 className="font-semibold text-gray-600">Employee Name</h1>
                        <p className="text-gray-800">{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || '-'}</p>
                    </div>
                    <div>
                        <h1 className="font-semibold text-gray-600">Employee Code</h1>
                        <p className="text-gray-800">{selectedEmployee?.empCode || '-'}</p>
                    </div>
                    <div>
                        <h1 className="font-semibold text-gray-600">Project Code</h1>
                        <p className="text-gray-800">{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.projectResDTO?.projectCode || '-'}</p>
                    </div>
                </div>
            </div> */}
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
                    {adminQuestions
                        .filter((q) =>
                            q.questionText !== "Others" &&
                            q.questionText !== "Admin In Charge" &&
                            q.questionText !== "Admin In Charge Empcode" &&
                            q.questionText !== "Admin Remarks"
                        )
                        .map((question) => (
                            <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                                <h1>
                                    {question.questionText} <span className='text-red-500'> *</span>
                                </h1>
                                <div className='FormDropdown'>

                                    {question.questionText === "Office Stationary" && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-4 my-2">
                                                <Dropdown
                                                    className='w-60'
                                                    placeholder={"Select"}
                                                    options={statusDropdown}
                                                    onChange={handleOfficeStationaryDropdownChange('officeStationery')}
                                                />

                                                {adminData.officeStationery && (
                                                    <input
                                                        type="text"
                                                        name="officeStationeryRemarks"
                                                        placeholder="Enter remarks"
                                                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                        value={adminData.officeStationeryRemarks}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>
                                            {errors.officeStationery && (
                                                <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>
                                                    {errors.officeStationery}
                                                </p>
                                            )}
                                        </>
                                    )}

                                    {question.questionText === "Access Cards / ID Card" &&
                                        renderStatusCheckboxes("idCard")
                                    }

                                    {question.questionText === "Any Company Files / Documents" &&
                                        renderStatusCheckboxes("fileOrDocument")
                                    }
                                    {question.questionText === "Drawer Keys / Cupboard Keys" &&
                                        renderStatusCheckboxes("lockerKeys")
                                    }


                                </div>
                            </div>
                        ))}

                    {adminQuestions
                        .filter((q) => q.questionText === "Others")
                        .map((question) => (
                            <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                                <h1>
                                    {question.questionText} <span className='text-red-500'> *</span>
                                </h1>

                                <div className='FormDropdown'>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <Dropdown
                                            className='w-60'
                                            placeholder="Select"
                                            options={statusDropdown}
                                            onChange={handleOthersDropdownChange('others')}
                                        />

                                        {adminData.others && (
                                            <input
                                                type="text"
                                                name="othersRemarks"
                                                placeholder="Enter remarks"
                                                className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm"
                                                value={adminData.othersRemarks}
                                                onChange={handleChange}
                                            />
                                        )}
                                    </div>

                                    {/* Error message */}
                                    {errors.others && (
                                        <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>
                                            {errors.others}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    }



                    {/* Admin In Charge */}
                    {adminQuestions
                        .filter((q) => q.questionText === "Admin In Charge")
                        .map((question) => (
                            <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                                <h1>
                                    {question.questionText} <span className='text-red-500'> *</span>
                                </h1>
                                <div className='FormDropdown'>
                                    <input
                                        type="text"
                                        name="adminInCharge"
                                        className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm'
                                        onChange={handleChange}
                                    />
                                    {errors.adminInCharge && (
                                        <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>
                                            {errors.adminInCharge}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    }

                    {/* Admin In Charge Emp Code */}
                    {adminQuestions
                        .filter((q) => q.questionText === "Admin In Charge Empcode")
                        .map((question) => (
                            <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                                <h1>
                                    {question.questionText} <span className='text-red-500'> *</span>
                                </h1>
                                <div className='FormDropdown'>
                                    <input
                                        type="text"
                                        name="adminInChargeCode"
                                        className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm'
                                        onChange={handleChange}
                                    />
                                    {errors.adminInChargeCode && (
                                        <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>
                                            {errors.adminInChargeCode}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    }


                    {/* Render Admin Remarks Last */}
                    {adminQuestions
                        .filter((q) => q.questionText === "Admin Remarks")
                        .map((question) => (
                            <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                                <h1>
                                    {question.questionText} <span className='text-red-500'> *</span>
                                </h1>
                                <div className='FormDropdown'>
                                    <textarea
                                        name="adminRemarks"
                                        rows={3}
                                        className={`FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm ${errors.adminRemarks ? '' : 'mb-6'
                                            }`}
                                        onChange={handleChange}
                                    />
                                    {errors.adminRemarks && (
                                        <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>
                                            {errors.adminRemarks}
                                        </p>
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

export default AdminDept;