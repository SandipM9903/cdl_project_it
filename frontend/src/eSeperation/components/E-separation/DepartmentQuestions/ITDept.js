import React, { useEffect, useState, useRef } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { BASE_URL } from '../../../../config/Config';
function ITDept({ selectedEmployee, onClose, itemStatusInfo }) {

    const [wfLevelActions, setWfLevelActions] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    //const [selectedOptions, setSelectedOptions] = useState({});
    const [actorRemark, setActorRemark] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const statusDropdown = ['Yes', 'No'];
    const [itQuestions, setITQuestions] = useState([]);



    const [itData, setITData] = useState({
        wsSeqId: '',
        mailDeletion: '',
        mailIDForwarding: '',
        mailsForwardTo: '',
        dataBackup: '',
        dataCard: '',
        itInCharge: '',
        itRemarks: '',
        laptopOrDesktop: '',
        charger: '',
        mouse: '',
        backPack: '',
        penDrive: '',
        simCard: '',
        otherAssets: '',
        otherAssetsRemarks: '',
        lapTopSeriesNumber: '',
        damagesAndRecovery: '',
        damagesAndRecoveryAmount: '',
        damagesAndRecoveryRemarks: ''


    })

    const handleOthersDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setITData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : {
                [`${name}Remarks`]: ''  // Clear remarks if "No"
            })
        }));
    };
    const handledamagesAndRecoveryDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setITData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Remarks`]: '' }) // Clear amount if No
        }));
    };
    const renderStatusCheckboxes = (fieldName) => {
        const options = ["Submitted", "Not Submitted", "Not Alloted"];

        return (
            <div className="mb-4">

                <div className="flex items-center gap-14 ml-2">
                    {options.map((option) => (
                        <label key={option} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={itData[fieldName] === option}
                                onChange={() =>
                                    setITData((prev) => ({
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

    const showForwardMailInfo =
        // itData.mailIDForwarding === true &&
        (!selectedEmployee?.forwardEmailsTo || selectedEmployee.forwardEmailsTo.trim() === "");



    const handleChange = (e) => {
        const { name, value } = e.target;
        setITData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDropdownChange = (name) => (selectedOptions) => {
        setITData(prevData => ({
            ...prevData,
            [name]: selectedOptions.value === 'Yes' ? true : false
        }));
    };

    const [errors, setErrors] = useState({});

    const validate = () => {
        let errors = {};
        let isValid = true;

        if (itData.mailDeletion === "") {
            errors.mailDeletion = 'Field is required';
            isValid = false;
        }
        if (itData.mailIDForwarding === "") {
            errors.mailIDForwarding = 'Field is required';
            isValid = false;
        }
        if (itData.mailsForwardTo === "") {
            errors.mailsForwardTo = 'Field is required';
            isValid = false;
        }
        if (itData.dataBackup === "") {
            errors.dataBackup = 'Field is required';
            isValid = false;
        }
        if (itData.dataCard === "") {
            errors.dataCard = 'Field is required';
            isValid = false;
        }
        if (itData.itInCharge.trim() === "") {
            errors.itInCharge = 'Field is required';
            isValid = false;
        }
        if (itData.itRemarks.trim() === "") {
            errors.itRemarks = 'Field is required';
            isValid = false;
        }
        if (itData.laptopOrDesktop.trim() === "") {
            errors.laptopOrDesktop = 'Field is required';
            isValid = false;
        }
        if (itData.charger === "") {
            errors.charger = 'Field is required';
            isValid = false;
        }
        if (itData.mouse.trim() === "") {
            errors.mouse = 'Field is required';
            isValid = false;
        }
        if (itData.backPack.trim() === "") {
            errors.backPack = 'Field is required';
            isValid = false;
        }
        if (itData.penDrive.trim() === "") {
            errors.penDrive = 'Field is required';
            isValid = false;
        }
        if (itData.simCard.trim() === "") {
            errors.simCard = 'Field is required';
            isValid = false;
        }
        if (itData.lapTopSeriesNumber.trim() === "") {
            errors.lapTopSeriesNumber = 'Field is required';
            isValid = false;
        }
        if (itData.damagesAndRecovery === "") {
            errors.damagesAndRecovery = 'Field is required';
            isValid = false;
        }
        if (itData.otherAssets === "") {
            errors.otherAssets = 'Field is required';
            isValid = false;
        }



        setErrors(errors);
        return isValid;
    };

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestionsByDept/IT`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptName === "IT");
                if (department) {
                    setITQuestions(department.questions);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }, []);
    useEffect(() => {
        if (!selectedEmployee) return;

        const forwardEmail = selectedEmployee.forwardEmailsTo;


        if (forwardEmail) {
            setITData(prev => ({
                ...prev,
                mailsForwardTo: forwardEmail,
            }));
        } else {


            setITData(prev => ({
                ...prev,
                mailsForwardTo: ""
            }));
        }
    }, [selectedEmployee]);

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
            ...itData,
            wfSeqId: selectedEmployee.wfSeqId,
            mailsForwardTo: itData.mailIDForwarding
                ? itData.mailsForwardTo || ""   // keep actual email or empty string
                : "N/A",                        // avoid null
        })
        axios.post(`${BASE_URL}:9029/api/eSeparation/fillITForm/${selectedAction}`, data)
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
                <h1 className='text-gray-800 font-semibold mx-5 mt-3'>To be filled by IT Department</h1>
                <h1 className='text-red-500 text-xl' onClick={onClose}><FaRegCircleXmark /></h1>
            </div>
            <p className="text-red-500 font-bold text-[11px] mt-1 ml-2">
                Note: Please note that the email IDs of exited employees must be deactivated on the same day before the close of working hours. </p>

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
                   
                    {itQuestions
                        .filter((q) => q.questionText !== "IT Remarks" &&
                            q.questionText !== "IT In Charge")
                        .sort((a, b) => {
                            if (a.questionText === "Mail ID Deactivation") return -1;
                            if (b.questionText === "Mail ID Deactivation") return 1;
                            return 0;
                        })
                        .map((question) => (
                            <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                                <h1>
                                    {question.questionText} <span className='text-red-500'> *</span>
                                </h1>
                                {/* // .map((question, index) => (
                    //     <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                    //         <h1 className=''>{question.questionText}
                    //             {index !== 2 && <span className='text-red-500'> *</span>}</h1> */}
                                <div className='FormDropdown'>
                                    {question.questionText === "Mail ID Deactivation" && (
                                        <>
                                            <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} onChange={handleDropdownChange('mailDeletion')} />
                                            {errors.mailDeletion && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.mailDeletion}</p>}
                                        </>
                                    )}

                                    {question.questionText === "Mail ID Forwarding" && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-4 my-2">
                                                <Dropdown
                                                    className="w-60"
                                                    placeholder="Select"
                                                    options={statusDropdown}

                                                    onChange={(selected) => {
                                                        handleDropdownChange("mailIDForwarding")(selected);

                                                        if (selected.value === "Yes") {
                                                            const forwardEmail = selectedEmployee?.forwardEmailsTo;

                                                            if (!forwardEmail) {
                                                                // If R1 didn't provide mail id
                                                                //  alert("R1 didn't provide Forward Mail ID. If you have one, please enter it manually, otherwise select Mail ID Forwarding as No.");

                                                                setITData(prevData => ({
                                                                    ...prevData,
                                                                    mailIDForwarding: true,
                                                                    mailsForwardTo: ""
                                                                }));
                                                            } else {
                                                                // R1 provided email → auto-fill
                                                                setITData(prevData => ({
                                                                    ...prevData,
                                                                    mailIDForwarding: true,
                                                                    mailsForwardTo: forwardEmail
                                                                }));
                                                            }
                                                        } else {
                                                            // If No → disable & empty
                                                            setITData(prevData => ({
                                                                ...prevData,
                                                                mailIDForwarding: false,
                                                                mailsForwardTo: null
                                                            }));
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {<p className="text-blue-500 font-bold text-[10px] mt-1 ml-2">
                                                Note: Select "Yes" if you want to add forwarding email IDs; otherwise select "No".</p>

                                            }
                                            {errors.mailIDForwarding && (
                                                <p className="text-red-500 font-bold text-[10px] mt-1 ml-2">
                                                    {errors.mailIDForwarding}
                                                </p>
                                            )}
                                        </>
                                    )}

                                    {question.questionText === "Forward Mails To" && (
                                        <>
                                            <input
                                                type="text"
                                                name="mailsForwardTo"
                                                //   placeholder="Enter email to forward mails"
                                                className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                value={itData.mailsForwardTo || ""}
                                                onChange={(e) => {
                                                    // Allow editing only when "Yes"
                                                    if (itData.mailIDForwarding === true) {
                                                        handleChange(e);
                                                    }
                                                }}
                                                disabled={itData.mailIDForwarding !== true} // 🔒 Editable only when Yes


                                            />

                                            {showForwardMailInfo && (
                                                <p className="text-blue-500 font-semibold text-[10px] mt-1 ml-2">
                                                    Note: The forwarding email has not been added by the manager. Kindly coordinate with the manager and update it manually. </p>
                                            )}
                                        </>
                                    )}

                                    {question.questionText === "Data Backup" && (
                                        <>
                                            <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} onChange={handleDropdownChange('dataBackup')} />
                                            {errors.dataBackup && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.dataBackup}</p>}
                                        </>
                                    )}
                                    {question.questionText === "Data Card" && (
                                        <>
                                            <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} onChange={handleDropdownChange('dataCard')} />
                                            {errors.dataCard && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.dataCard}</p>}
                                        </>
                                    )}



                                    {question.questionText === "Laptop or Desktop" &&
                                        renderStatusCheckboxes("laptopOrDesktop")
                                    }
                                    {question.questionText === "Charger" &&
                                        renderStatusCheckboxes("charger")
                                    }
                                    {question.questionText === "Mouse / Mouse Pad" &&
                                        renderStatusCheckboxes("mouse")
                                    }
                                    {question.questionText === "Backpack" &&
                                        renderStatusCheckboxes("backPack")
                                    }
                                    {question.questionText === "Pen Drive" &&
                                        renderStatusCheckboxes("penDrive")
                                    }
                                    {question.questionText === "SIM Card" &&
                                        renderStatusCheckboxes("simCard")
                                    }


                                    {question.questionText === "Others" && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-4 my-2">
                                                <Dropdown
                                                    className='w-60'
                                                    placeholder={"Select"}
                                                    options={statusDropdown}
                                                    onChange={handleOthersDropdownChange('otherAssets')}
                                                />
                                                {errors.otherAssets && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.otherAssets}</p>}

                                                {itData.otherAssets && (
                                                    <input
                                                        type="text"
                                                        name="otherAssetsRemarks"
                                                        placeholder="Enter other assets remarks"
                                                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                        value={itData.otherAssetsRemarks}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>

                                        </>
                                    )}
                                    {question.questionText === "Laptop or Desktop Series Number" && (
                                        <>
                                            <input type="text" name="lapTopSeriesNumber" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm' onChange={handleChange} />
                                            {errors.lapTopSeriesNumber && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.lapTopSeriesNumber}</p>}

                                        </>
                                    )}
                                    {question.questionText === "Damages & Recovery (If any)" && (
                                        <>

                                            <div className="flex flex-wrap items-center gap-4 my-2">
                                                <Dropdown
                                                    className="w-60"
                                                    placeholder="Select"
                                                    options={statusDropdown}
                                                    onChange={handledamagesAndRecoveryDropdownChange("damagesAndRecovery")}
                                                    value={
                                                        itData.damagesAndRecovery === true
                                                            ? "Yes"
                                                            : itData.damagesAndRecovery === false
                                                                ? "No"
                                                                : undefined
                                                    }

                                                />
                                                {errors.damagesAndRecovery && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.damagesAndRecovery}</p>}

                                                {itData.damagesAndRecovery === true && (
                                                    <input
                                                        type="number"
                                                        name="damagesAndRecoveryAmount"
                                                        placeholder="Enter Amount"
                                                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                        value={itData.damagesAndRecoveryAmount || ""}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                                {itData.damagesAndRecovery === true && (
                                                    <input
                                                        type="text"
                                                        name="damagesAndRecoveryRemarks"
                                                        placeholder="Enter Remarks"
                                                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                        value={itData.damagesAndRecoveryRemarks || ""}
                                                        onChange={handleChange}
                                                    />
                                                )}

                                            </div>
                                        </>
                                    )}
                                    {question.questionText === "IT In Charge" && (
                                        <>
                                            <input type="text" name="itInCharge" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm' onChange={handleChange} />
                                            {errors.itInCharge && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.itInCharge}</p>}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    {itQuestions
                        .filter((q) => q.questionText === "IT In Charge")
                        .map((question) => (
                            <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                                <h1>
                                    {question.questionText} <span className='text-red-500'> *</span>
                                </h1>
                                <div className='FormDropdown'>
                                    <input type="text" name="itInCharge" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm' onChange={handleChange} />

                                    {errors.itInCharge && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.itInCharge}</p>}

                                </div>
                            </div>
                        ))}
                    {/* {question.questionText === "IT Remarks" && (
                                        <>
                                            <textarea name="itRemarks" rows={3} className={`FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm ${errors.itRemarks ? '' : 'mb-6'}`} onChange={handleChange} />
                                            {errors.itRemarks && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.itRemarks}</p>}
                                        </>
                                    )} */}
                    {itQuestions
                        .filter((q) => q.questionText === "IT Remarks")
                        .map((question) => (
                            <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                                <h1>
                                    {question.questionText} <span className='text-red-500'> *</span>
                                </h1>
                                <div className='FormDropdown'>
                                    <textarea
                                        name="itRemarks"
                                        rows={3}
                                        className={`FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm ${errors.itRemarks ? '' : 'mb-6'
                                            }`}
                                        onChange={handleChange}
                                    />
                                    {errors.itRemarks && (
                                        <p className='text-red-500 ml-2 font-semibold text-[10px] mt-1'>
                                            {errors.itRemarks}
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

export default ITDept;

