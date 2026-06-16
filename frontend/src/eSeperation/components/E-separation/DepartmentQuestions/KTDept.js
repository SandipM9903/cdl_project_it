import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { BASE_URL } from '../../../../config/Config';

function KTDept({ selectedEmployee, onClose }) {

    const [wfLevelActions, setWfLevelActions] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    //const [selectedOptions, setSelectedOptions] = useState({});
    const [actorRemark, setActorRemark] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [ktQuestions, setKTQuestions] = useState([]);
    const statusDropdown = ['Yes', 'No'];
    const [fnfData, setFNFData] = useState([]);
    const [modeOfKt, setModeOfKt] = useState([]);
    const [projectKnowledge, setProjectKnowledge] = useState([]);
    const [systemKnowledge, setSystemknowledge] = useState([]);
    const [documentation, setDocumentation] = useState([]);
    const [accessAndCredentials, setAccessAndCredentials] = useState([]);
    const deptUserId = localStorage.getItem("empId")
    const [ktData, setKTData] = useState({
        wfSeqId: '',
        ktDoneByEmployee: false,
        ktRemarks: ''
    })

    const handleDropdownChange = (name) => (selectedOptions) => {
        setKTData(prevData => ({
            ...prevData,
            [name]: selectedOptions.value === 'Yes'
        }));
    };

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestions/2`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptId === 2);
                if (department) {
                    setKTQuestions(department.questions);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }, []);

    const [errors, setErrors] = useState({});

    const validate = () => {
        let errors = {};
        let isValid = true;

        if (ktData.ktRemarks.trim() === "") {
            errors.ktRemarks = 'Field is required';
            isValid = false;
        }
        if (!ktData.ktDoneByEmployee) {
            errors.ktDoneByEmployee = 'Field is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    useEffect(() => {

        if (selectedEmployee) {
            axios
                .get(
                    `${BASE_URL}:9029/api/eSeparation/getExitFormDetails/${selectedEmployee.wfSeqId}`
                )
                .then((res) => {
                    setFNFData(res.data);
                    console.log("Fnf Data fetched:::::", res.data);

                    // Initialize Mode of KT
                    if (res.data.modeOfKt) {
                        setModeOfKt(res.data.modeOfKt); // assuming it's an array
                    }

                    if (res.data.projectKnowledge) {
                        setProjectKnowledge(res.data.projectKnowledge);
                    }

                    if (res.data.systemKnowledge) {
                        setSystemknowledge(res.data.systemKnowledge);
                    }

                    if (res.data.documentation) {
                        setDocumentation(res.data.documentation);
                    }

                    if (res.data.accessAndCredentials) {
                        setAccessAndCredentials(res.data.accessAndCredentials);
                    }

                })
                .catch(() => {
                    console.log("No data filled yet");
                });
        } else {
            console.log("No resignation with approved HR status found");
        }
    }, [selectedEmployee]);
    const handleModeOfKtChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            setModeOfKt(prev => [...prev, name]);
        } else {
            setModeOfKt(prev => prev.filter(item => item !== name));
        }
    };
    const handleProjectKnowledgeChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            setProjectKnowledge(prev => [...prev, name]);
        } else {
            setProjectKnowledge(prev => prev.filter(item => item !== name));
        }
    };
    const handleSystemknowledgeChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            setSystemknowledge(prev => [...prev, name]);
        } else {
            setSystemknowledge(prev => prev.filter(item => item !== name));
        }
    };
    const handleDocumentationChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            setDocumentation(prev => [...prev, name]);
        } else {
            setDocumentation(prev => prev.filter(item => item !== name));
        }
    };
    const handleAccessAndCredentialsChange = (e) => {
        const { name, checked } = e.target;

        if (checked) {
            setAccessAndCredentials(prev => [...prev, name]);
        } else {
            setAccessAndCredentials(prev => prev.filter(item => item !== name));
        }
    };

    useEffect(() => {
        if (selectedEmployee) {
            const fetchActions = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}:9028/api/workflow/getWfLevelActions/${selectedEmployee.wfSeqId}/${deptUserId}/${selectedEmployee.wfItemSeqNum}`);
                    // http://localhost:9028/api/workflow/getWfLevelActions/${selectedEmployee.wfSeqId}/${deptUserId}/${selectedEmployee.wfItemSeqNum}

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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFNFData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

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
// console.log("Kt form data to be saved", ktData);
        const data = ({
            ...ktData,
            wfSeqId: selectedEmployee.wfSeqId
            
        })
        axios.post(`${BASE_URL}:9029/api/eSeparation/fillKTForm/${selectedAction}`, data)
            .then(() => {
                console.log("Posted"+ktData);
                // window.location.reload();
            })
            .catch((err) => {
                console.log("error", err);
            });
    }

    return (
        <>
            <div className='justify-between flex item-start'>
                <h1 className='text-gray-800 font-semibold mx-5 mt-3'>To be filled by KT Department</h1>
                <h1 className='text-red-500 text-xl' onClick={onClose}><FaRegCircleXmark /></h1>
            </div>
            <div className='mx-5 text-left mt-4 mb-4' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className='mx-6 mt-3 text-gray-500'>
                    {/* Employee Name Field */}
                    <div className='grid grid-cols-3 mt-3 text-xs'>
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
                    <div className='grid grid-cols-3 mt-3 text-xs'>
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
                    <div className='grid grid-cols-3 mt-3 text-xs'>
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
                    
                    <h1 className='text-gray-800 font-semibold  mt-3'>Filled by Employee</h1>

                    <div className='grid grid-cols-3 mt-3 text-xs items-center'>
                        <h1 className='text-gray-700 font-medium'>
                            Mode of KT
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {["In-person", "Online", "Hybrid / Virtual"].map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name={option}
                                        className="h-4 w-4"
                                        checked={modeOfKt.includes(option)}
                                        onChange={handleModeOfKtChange}
                                        disabled={fnfData?.exitFormStatus === 'Submitted'}
                                    />
                                    <span className="text-sm">{option}</span>
                                </label>
                            ))}
                        </div>
                        <div className="col-span-3 border-b border-gray-300 mt-3"></div>

                    </div>
                    <div className='grid grid-cols-3 mt-3 text-xs items-start items-center'>
                        <h1 className='text-gray-700 font-medium'>
                            Project Knowledge
                        </h1>

                        <div className="flex flex-row flex-wrap gap-6 mt-2 col-span-2">
                            {[
                                "Key stakeholders",
                                "Upcoming deliverables",
                                "Current project status",
                                "Pending tasks",
                                "NA"
                            ].map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name={option}
                                        className="h-4 w-4"
                                        checked={projectKnowledge.includes(option)}
                                        onChange={handleProjectKnowledgeChange}
                                        disabled={fnfData?.exitFormStatus === 'Submitted'}
                                    />
                                    <span className="text-sm whitespace-nowrap">{option}</span>
                                </label>
                            ))}
                        </div>
                        <div className="col-span-3 border-b border-gray-300 mt-3"></div>

                    </div>


                    <div className='grid grid-cols-3 mt-3 text-xs items-start items-center'>
                        <h1 className='text-gray-700 font-medium'>
                            System Knowledge
                        </h1>

                        <div className="flex flex-row flex-wrap gap-6 mt-2 col-span-2">
                            {[
                                "System accesses explained",
                                "Tool usage demonstrated",
                                "Login details shared",
                                "Critical workflows covered",
                                "NA"
                            ].map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name={option}
                                        className="h-4 w-4"
                                        checked={systemKnowledge.includes(option)}
                                        onChange={handleSystemknowledgeChange}
                                        disabled={fnfData?.exitFormStatus === 'Submitted'}
                                    />
                                    <span className="text-sm whitespace-nowrap">{option}</span>
                                </label>
                            ))}
                        </div>
                        <div className="col-span-3 border-b border-gray-300 mt-3"></div>
                    </div>

                    <div className='grid grid-cols-3 mt-3 text-xs items-start'>
                        <h1 className='text-gray-700 font-medium'>
                            Documentation
                        </h1>

                        <div className="flex flex-row flex-wrap gap-6 mt-2 col-span-2">
                            {[
                                "SOPs",
                                "Manuals / Guides",
                                "Physical files & Documents",
                                "NA"
                            ].map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name={option}
                                        className="h-4 w-4"
                                        checked={documentation.includes(option)}
                                        onChange={handleDocumentationChange}
                                        disabled={fnfData?.exitFormStatus === 'Submitted'}
                                    />
                                    <span className="text-sm whitespace-nowrap">{option}</span>
                                </label>
                            ))}
                        </div>

                        {/* 🔽 Full-width line below inputs + label */}
                        <div className="col-span-3 border-b border-gray-300 mt-3"></div>
                    </div>

                    <div className='grid grid-cols-3 mt-3 text-xs items-start'>
                        <h1 className='text-gray-700 font-medium'>
                            Access & Credentials
                        </h1>

                        <div className="flex flex-row flex-wrap gap-6 mt-2 col-span-2">
                            {[
                                "Shared mailbox access explained",
                                "Team drive access explained",
                                "NA"
                            ].map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name={option}
                                        className="h-4 w-4"
                                        checked={accessAndCredentials.includes(option)}
                                        onChange={handleAccessAndCredentialsChange}
                                        disabled={fnfData?.exitFormStatus === 'Submitted'}
                                    />
                                    <span className="text-sm whitespace-nowrap">{option}</span>
                                </label>
                            ))}
                        </div>

                        {/* 🔽 Full-width divider */}
                        <div className="col-span-3 border-b border-gray-300 mt-3"></div>
                    </div>
                    <div className='grid grid-cols-3 mt-3 text-xs items-start'>
                        <h1 className='text-gray-700 font-medium'>
                            Attendant / Replacement Members Name
                        </h1>

                        <input type="text" name="ktGivenToName" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8' onChange={handleChange} value={fnfData.ktGivenToName} disabled={fnfData.exitFormStatus === 'Submitted'} />
                        {/* 🔽 Full-width line below inputs + label */}
                        <div className="col-span-3 border-b border-gray-300 mt-3"></div>
                    </div>
                    <div className='grid grid-cols-3 mt-3 text-xs items-start'>
                        <h1 className='text-gray-700 font-medium'>
                            Attendant / Replacement Members ECode
                        </h1>

                        <input type="text" name="ktGivenToECode" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8' onChange={handleChange} value={fnfData.ktGivenToECode} disabled={fnfData.exitFormStatus === 'Submitted'} />
                        {/* 🔽 Full-width line below inputs + label */}
                        <div className="col-span-3 border-b border-gray-300 mt-3"></div>
                    </div>
                    <h1 className='text-gray-800 font-semibold  mt-3'>To be filled by Manager</h1>

                    {ktQuestions.map((question, index) => (
                        <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                            <h1 className='text-xs'>{question.questionText} <span className='text-red-500'> *</span></h1>
                            <div className='FormDropdown'>
                                {index === 0 && (
                                    <>
                                        <div className='FormDropdown'>
                                            <textarea
                                                name="ktRemarks"
                                                rows={3}
                                                className={`FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm ${errors.ktRemarks ? '' : 'mb-6'
                                                    }`}
                                                onChange={(e) =>
                                                    setKTData(prev => ({
                                                        ...prev,
                                                        ktRemarks: e.target.value
                                                    }))
                                                }
                                            />
                                            {errors.ktRemarks && (
                                                <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>
                                                    {errors.ktRemarks}
                                                </p>
                                            )}
                                        </div>
                                        {/* <Dropdown className='w-60' options={statusDropdown} onChange={handleDropdownChange('docsHandOver')} />
                                        {errors.docsHandOver && <p className='text-red-500 font-semibold ml-3 text-[8px] mt-1'>{errors.docsHandOver}</p>}
 */}
                                    </>
                                )}

                            </div>
                        </div>
                    ))}

                    {/* KT Completion Checkbox */}
                    <div className="mx-10 mt-6 mb-6 flex items-start gap-3">

                        {/* Checkbox */}
                        <input
                            type="checkbox"
                            className="mt-1 h-4 w-4"
                            checked={ktData.ktDoneByEmployee} // ✅ bind to state
                            onChange={(e) =>
                                setKTData(prev => ({ ...prev, ktDoneByEmployee: e.target.checked }))
                            }

                        />

                        {/* Text */}
                        <p className="text-gray-500 text-sm">
                            <span >
                                {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar} ({selectedEmployee?.empCode})
                            </span> has completed the KT process and can proceed with the exit process.
                        </p>
                        {errors.ktDoneByEmployee && <p className='text-red-500 ml-3 font-semibold text-[8px] mt-1'>{errors.ktDoneByEmployee}</p>}

                    </div>

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

export default KTDept;