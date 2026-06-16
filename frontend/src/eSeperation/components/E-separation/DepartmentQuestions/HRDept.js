import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { BASE_URL } from '../../../../config/Config';

function HRDept({ selectedEmployee, onClose }) {

    const [wfLevelActions, setWfLevelActions] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    //const [selectedOptions, setSelectedOptions] = useState({});
    const [actorRemark, setActorRemark] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const statusDropdown = ['Yes', 'No'];
    const [hrQuestions, setHRQuestions] = useState([]);
    const [hrData, setHRData] = useState({
        wfSeqId: '',

        idCard: null,
        idCardRemarks: '',

        attendance: null,
        attendanceRemarks: '',        

        fbrSupportings: null,
        fbrSupportingsRemarks: '',
        fbrSupportingsAmount: '',

        itrProofs: null,
        itrProofsRemarks: '',
        itrProofsAmount: '',

        loan: null,
        loanRemarks: '',
        loanAmount: '',

        salaryAdvance: null,
        salaryAdvanceRemarks: '',
        salaryAdvanceAmount: '',

        hrInChargeEcode: '',
        hrInCharge: '',
        hrRemarks: '',
        hrStatus: '',
        lockerKeys: '',
        fileOrDocument: '',

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHRData(prevData => ({
            ...prevData,
            [name]: value
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
                                checked={hrData[fieldName] === option}
                                onChange={() =>
                                    setHRData((prev) => ({
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
    const handleDropdownChange = (name) => (selectedOptions) => {
        setHRData(prevData => ({
            ...prevData,
            [name]: selectedOptions.value === 'Yes' ? true : false
        }));
    };

    const handleIdCardDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setHRData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Remarks`]: '' }) // Clear amount if No
        }));
    };
    const handleattendanceDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setHRData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Remarks`]: '' }) // Clear amount if No
        }));
    };

    const handlefbrSupportingsDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setHRData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Remarks`]: '' }) // Clear amount if No
        }));
    };
    const handleitrProofsDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setHRData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Remarks`]: '' }) // Clear amount if No
        }));
    };
    const handleloanDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setHRData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Remarks`]: '' }) // Clear amount if No
        }));
    };
    const handlesalaryAdvanceDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setHRData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Remarks`]: '' }) // Clear amount if No
        }));
    };

    const [errors, setErrors] = useState({});

    const validate = () => {
        let errors = {};
        let isValid = true;

        if (hrData.idCard === null || hrData.idCard === undefined) {
            errors.idCard = 'Field is required id ';
            isValid = false;
        }
        if (hrData.attendance === null || hrData.attendance === undefined) {
            errors.attendance = 'Field is required ';
            isValid = false;
        }
        if (hrData.salaryAdvance === null || hrData.salaryAdvance === undefined) {
            errors.salaryAdvance = 'Field is required ';
            isValid = false;
        }
        if (hrData.fbrSupportings === null || hrData.fbrSupportings === undefined) {
            errors.fbrSupportings = 'Field is required  ';
            isValid = false;
        }
        if (hrData.itrProofs === null || hrData.itrProofs === undefined) {
            errors.itrProofs = 'Field is required ';
            isValid = false;
        }
        if (hrData.loan === null || hrData.loan === undefined) {
            errors.loan = 'Field is required ';
            isValid = false;
        }

        if (hrData.hrInChargeEcode.trim() === "") {
            errors.hrInChargeEcode = 'Field is required ';
            isValid = false;
        }
        if (hrData.hrInCharge.trim() === "") {
            errors.hrInCharge = 'Field is required';
            isValid = false;
        }
        if (hrData.hrRemarks.trim() === "") {
            errors.hrRemarks = 'Field is required ';
            isValid = false;
        }
        if (hrData.lockerKeys.trim() === "") {
            errors.lockerKeys = 'Field is required ';
            isValid = false;
        }
        if (hrData.fileOrDocument.trim() === "") {
            errors.fileOrDocument = 'Field is required ';
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestionsByDept/HR`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptName === "HR");
                if (department) {
                    setHRQuestions(department.questions);
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
    // const handleActionClick = (action) => {
    //     if (validate()) {
    //         setSelectedAction(action);
    //         setPopupVisible(true);
    //     }
    // };

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
            // Always call getActions API
            const url = `${BASE_URL}:9028/api/workflow/getActions/${selectedEmployee.wfSeqId}/${deptUserId}/${actorRemark}/${selectedEmployee.wfItemSeqNum}?selectedOption=${selectedAction}`;
            await axios.get(url);

            // Only fill the  form if action is "Approve"

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
            ...hrData,
            wfSeqId: selectedEmployee.wfSeqId
        })
        axios.post(`${BASE_URL}:9029/api/eSeparation/fillHRForm/${selectedAction}`, data)
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
                <h1 className='text-gray-800 font-semibold mx-5 mt-3'>To be filled by HR Department</h1>
                <h1 className='text-red-500 text-xl' onClick={onClose}><FaRegCircleXmark /></h1>
            </div>
            <div className='mx-5 text-left mt-4 mb-4 ' style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
                                value={selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.reportingManager|| '-'}
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
                                value={selectedEmployee?.userDTO?.locationResDTO?.locationName|| '-'}
                                disabled
                                className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm bg-gray-100 text-gray-700'
                            />
                        </div>
                    </div>
                    {hrQuestions.filter(q => q.questionText !== "HR In Charge" &&
                            q.questionText !== "HR In Charge EmpCode" &&
                            q.questionText !== "Loan" &&
                            q.questionText !== "Salary Advance" &&
                            q.questionText !== "HR Remarks").map((question) => (
                        <div key={question.questionId} className='grid grid-cols-3 mt-3'>
                            <h1 className=''>{question.questionText} <span className='text-red-500'> *</span></h1>
                            <div className='FormDropdown'>
                                {question.questionText === "ID Card" && (
                                    <>
                                        <div className="flex flex-wrap items-center gap-4 my-2">
                                            <Dropdown
                                                className="w-60"
                                                placeholder="Select"
                                                options={statusDropdown}
                                                onChange={handleIdCardDropdownChange("idCard")}
                                                value={
                                                    hrData.idCard === true
                                                        ? "Yes"
                                                        : hrData.idCard === false
                                                            ? "No"
                                                            : undefined
                                                }
                                            />
                                            {hrData.idCard === false && (
                                                <input
                                                    type="text"
                                                    name="idCardRemarks"
                                                    placeholder="Enter Remarks"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.idCardRemarks || ""}
                                                    onChange={handleChange}
                                                />
                                            )}

                                        </div>

                                        {errors.idCard && <p className='text-red-500 font-semibold text-[10px] mt-1 ml-2'>{errors.idCard}</p>}
                                    </>
                                )}
                                {question.questionText === "Attendance" && (
                                    <>
                                        <div className="flex flex-wrap items-center gap-4 my-2">
                                            <Dropdown
                                                className="w-60"
                                                placeholder="Select"
                                                options={statusDropdown}
                                                onChange={handleattendanceDropdownChange("attendance")}
                                                value={
                                                    hrData.attendance === true
                                                        ? "Yes"
                                                        : hrData.attendance === false
                                                            ? "No"
                                                            : undefined
                                                }
                                            />
                                            {hrData.attendance === true && (
                                                <input
                                                    type="text"
                                                    name="attendanceRemarks"
                                                    placeholder="Enter Remarks"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.attendanceRemarks || ""}
                                                    onChange={handleChange}
                                                />
                                            )}

                                        </div>

                                        {errors.attendance && <p className='text-red-500 font-semibold text-[10px] ml-2 mt-1'>{errors.attendance}</p>}
                                    </>
                                )}
                                
                                {question.questionText === "FBR Supportings" && (
                                    <>
                                        <div className="flex flex-wrap items-center gap-4 my-2">
                                            <Dropdown
                                                className="w-60"
                                                placeholder="Select"
                                                options={statusDropdown}
                                                onChange={handlefbrSupportingsDropdownChange("fbrSupportings")}
                                                value={
                                                    hrData.fbrSupportings === true
                                                        ? "Yes"
                                                        : hrData.fbrSupportings === false
                                                            ? "No"
                                                            : undefined
                                                }
                                            />
                                            {hrData.fbrSupportings === true && (
                                                <input
                                                    type="number"
                                                    name="fbrSupportingsAmount"
                                                    placeholder="Enter Amount"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.fbrSupportingsAmount || ""}
                                                    onChange={handleChange}
                                                />
                                            )}
                                            {hrData.fbrSupportings === true && (
                                                <input
                                                    type="text"
                                                    name="fbrSupportingsRemarks"
                                                    placeholder="Enter Remarks"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.fbrSupportingsRemarks || ""}
                                                    onChange={handleChange}
                                                />
                                            )}

                                        </div>
                                        {errors.fbrSupportings && <p className='text-red-500 font-semibold text-[10px] ml-2 mt-1'>{errors.fbrSupportings}</p>}
                                    </>
                                )}
                                {question.questionText === "ITR Proofs" && (
                                    <>

                                        <div className="flex flex-wrap items-center gap-4 my-2">
                                            <Dropdown
                                                className="w-60"
                                                placeholder="Select"
                                                options={statusDropdown}
                                                onChange={handleitrProofsDropdownChange("itrProofs")}
                                                value={
                                                    hrData.itrProofs === true
                                                        ? "Yes"
                                                        : hrData.itrProofs === false
                                                            ? "No"
                                                            : undefined
                                                }
                                            />
                                            {hrData.itrProofs === true && (
                                                <input
                                                    type="number"
                                                    name="itrProofsAmount"
                                                    placeholder="Enter Amount"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.itrProofsAmount || ""}
                                                    onChange={handleChange}
                                                />
                                            )}
                                            {hrData.itrProofs === true && (
                                                <input
                                                    type="text"
                                                    name="itrProofsRemarks"
                                                    placeholder="Enter Remarks"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.itrProofsRemarks || ""}
                                                    onChange={handleChange}
                                                />
                                            )}

                                        </div>
                                        {errors.itrProofs && <p className='text-red-500 font-semibold text-[10px] ml-2 mt-1'>{errors.itrProofs}</p>}
                                    </>
                                )}
                                {question.questionText === "Any Company Documents / Files" &&
                                    renderStatusCheckboxes("fileOrDocument")
                                }
                                {question.questionText === "Drawer Keys / Locker Keys" &&
                                    renderStatusCheckboxes("lockerKeys")
                                }
                                {/* {question.questionText === "Loan" && (
                                    <>

                                        <div className="flex flex-wrap items-center gap-4 my-2">
                                            <Dropdown
                                                className="w-60"
                                                placeholder="Select"
                                                options={statusDropdown}
                                                onChange={handleloanDropdownChange("loan")}
                                                value={
                                                    hrData.loan === true
                                                        ? "Yes"
                                                        : hrData.loan === false
                                                            ? "No"
                                                            : undefined
                                                }
                                            />
                                            {hrData.loan === true && (
                                                <input
                                                    type="number"
                                                    name="loanAmount"
                                                    placeholder="Enter Amount"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.loanAmount || ""}
                                                    onChange={handleChange}
                                                />
                                            )}


                                            {hrData.loan === true && (
                                                <input
                                                    type="text"
                                                    name="loanRemarks"
                                                    placeholder="Enter Remarks"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.loanRemarks || ""}
                                                    onChange={handleChange}
                                                />
                                            )}

                                        </div>
                                        {errors.loan && <p className='text-red-500 font-semibold text-[10px] ml-2 mt-1'>{errors.loan}</p>}
                                    </>
                                )}
                                {question.questionText === "Salary Advance" && (
                                    <>

                                        <div className="flex flex-wrap items-center gap-4 my-2">
                                            <Dropdown
                                                className="w-60"
                                                placeholder="Select"
                                                options={statusDropdown}
                                                onChange={handlesalaryAdvanceDropdownChange("salaryAdvance")}
                                                value={
                                                    hrData.salaryAdvance === true
                                                        ? "Yes"
                                                        : hrData.salaryAdvance === false
                                                            ? "No"
                                                            : undefined
                                                }
                                            />
                                            {hrData.salaryAdvance === true && (
                                                <input
                                                    type="number"
                                                    name="salaryAdvanceAmount"
                                                    placeholder="Enter Amount"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.salaryAdvanceAmount || ""}
                                                    onChange={handleChange}
                                                />
                                            )}
                                            {hrData.salaryAdvance === true && (
                                                <input
                                                    type="text"
                                                    name="salaryAdvanceRemarks"
                                                    placeholder="Enter Remarks"
                                                    className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                    value={hrData.salaryAdvanceRemarks || ""}
                                                    onChange={handleChange}
                                                />
                                            )}

                                        </div>
                                        {errors.salaryAdvance && <p className='text-red-500 font-semibold text-[10px] ml-2 mt-1'>{errors.salaryAdvance}</p>}
                                    </>
                                )} */}
                                

                            </div>
                        </div>
                    ))}
                    {/* ---- LOAN SECTION ---- */}
<div className='grid grid-cols-3 mt-3'>
    <h1>Loan <span className='text-red-500'> *</span></h1>
    <div className='FormDropdown'>
        <div className="flex flex-wrap items-center gap-4 my-2">
            <Dropdown
                className="w-60"
                placeholder="Select"
                options={statusDropdown}
                onChange={handleloanDropdownChange("loan")}
                value={
                    hrData.loan === true
                        ? "Yes"
                        : hrData.loan === false
                            ? "No"
                            : undefined
                }
            />

            {hrData.loan === true && (
                <>
                    <input
                        type="number"
                        name="loanAmount"
                        placeholder="Enter Amount"
                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm"
                        value={hrData.loanAmount || ""}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="loanRemarks"
                        placeholder="Enter Remarks"
                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm"
                        value={hrData.loanRemarks || ""}
                        onChange={handleChange}
                    />
                </>
            )}
        </div>

        {errors.loan && (
            <p className='text-red-500 font-semibold text-[10px] ml-2 mt-1'>
                {errors.loan}
            </p>
        )}
    </div>
</div>

{/* ---- SALARY ADVANCE SECTION ---- */}
<div className='grid grid-cols-3 mt-3'>
    <h1>Salary Advance <span className='text-red-500'> *</span></h1>
    <div className='FormDropdown'>
        <div className="flex flex-wrap items-center gap-4 my-2">
            <Dropdown
                className="w-60"
                placeholder="Select"
                options={statusDropdown}
                onChange={handlesalaryAdvanceDropdownChange("salaryAdvance")}
                value={
                    hrData.salaryAdvance === true
                        ? "Yes"
                        : hrData.salaryAdvance === false
                            ? "No"
                            : undefined
                }
            />

            {hrData.salaryAdvance === true && (
                <>
                    <input
                        type="number"
                        name="salaryAdvanceAmount"
                        placeholder="Enter Amount"
                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm"
                        value={hrData.salaryAdvanceAmount || ""}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="salaryAdvanceRemarks"
                        placeholder="Enter Remarks"
                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm"
                        value={hrData.salaryAdvanceRemarks || ""}
                        onChange={handleChange}
                    />
                </>
            )}
        </div>

        {errors.salaryAdvance && (
            <p className='text-red-500 font-semibold text-[10px] ml-2 mt-1'>
                {errors.salaryAdvance}
            </p>
        )}
    </div>
</div>

                    {hrQuestions
                        .filter(q => q.questionText === "HR In Charge")
                        .map((question) => (
                            <div key={question.questionId} className="grid grid-cols-3 mt-3">
                                <h1>
                                    {question.questionText} <span className="text-red-500">*</span>
                                </h1>
                                <div className="FormDropdown">
                                    <input name="hrInCharge" rows={3} className={`FormTextArea outline-none rounded-md py-[1px] px-1 ml-2 border border-gray-400 w-56 text-sm ${errors.hrInCharge ? '' : 'mb-6'}`} onChange={handleChange} />
                                    {errors.hrInCharge && <p className='text-red-500 font-semibold ml-2 text-[10px] mt-1'>{errors.hrInCharge}</p>}

                                </div>
                            </div>
                        ))}
                    {hrQuestions
                        .filter(q => q.questionText === "HR In Charge EmpCode")
                        .map((question) => (
                            <div key={question.questionId} className="grid grid-cols-3 mt-3">
                                <h1>
                                    {question.questionText} <span className="text-red-500">*</span>
                                </h1>
                                <div className="FormDropdown">
                                    <input name="hrInChargeEcode" rows={3} className={`FormTextArea outline-none rounded-md py-[1px] px-1 ml-2 border border-gray-400 w-56 text-sm ${errors.hrInChargeEcode ? '' : 'mb-6'}`} onChange={handleChange} />
                                    {errors.hrInChargeEcode && <p className='text-red-500 font-semibold ml-2 text-[10px] mt-1'>{errors.hrInChargeEcode}</p>}

                                </div>
                            </div>
                        ))}
                    {hrQuestions
                        .filter(q => q.questionText === "HR Remarks")
                        .map((question) => (
                            <div key={question.questionId} className="grid grid-cols-3 mt-3">
                                <h1>
                                    {question.questionText} <span className="text-red-500">*</span>
                                </h1>
                                <div className="FormDropdown">
                                    <textarea name="hrRemarks" rows={3} className={`FormTextArea outline-none rounded-md py-[1px] px-1 ml-2 border border-gray-400 w-56 text-sm ${errors.hrRemarks ? '' : 'mb-6'}`} onChange={handleChange} />
                                    {errors.hrRemarks && <p className='text-red-500 font-semibold ml-2 text-[10px] mt-1'>{errors.hrRemarks}</p>}

                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className='space-x-6 justify-center'>
                {wfLevelActions && wfLevelActions.map((action, index) => {
                    const filteredAction = action.replace(/[^a-zA-Z-]/g, '');
                    if (filteredAction === 'Approve' || filteredAction === 'Hold'
                    ) {
                        return (
                            <button
                                key={index}
                                className={`py-2 px-4 mt-5 rounded-md ${filteredAction === 'Approve' ? 'bg-lime-500 hover:bg-lime-600' : filteredAction === 'Hold' ? 'bg-gray-400 hover:bg-gray-500' : filteredAction === 'Re-Submit' ? 'bg-blue-400 hover:bg-blue-500' : 'bg-red-500 hover:bg-red-600'} text-white`}
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

export default HRDept;