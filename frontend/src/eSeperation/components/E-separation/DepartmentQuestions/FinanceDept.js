import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { BASE_URL } from '../../../../config/Config';
function FinanceDept({ selectedEmployee, onClose }) {

    const [wfLevelActions, setWfLevelActions] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    //const [selectedOptions, setSelectedOptions] = useState({});
    const [actorRemark, setActorRemark] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const statusDropdown = ['Yes', 'No'];
    const [financeQuestions, setFinanceQuestions] = useState([]);
    const [financeData, setFinanceData] = useState({
        wfSeqId: '',
        loans: '',
        loansAmount: '',
        advances: '',
        advancesAmount: '',
        iouOrRta: '',
        iouOrRtaAmount: '',
        financeOthers: '',
        financeOthersRemarks: '',
        financeOthersAmount: '',
        financeInChargeEcode: '',
        expenseOrReimbursement: '',
        expenseOrReimbursementAmount: '',
        financeInCharge: '',
        financeRemarks: '',
        companyCode: '',
        anyPayableReceivable: '',
    })
    const handlePRDropdownChange = (selectedOption) => {
        const isYes = selectedOption.value === "Yes";
        setFinanceData(prev => ({
            ...prev,
            anyPayableReceivable: isYes
        }));

        // If user selects NO → clear company rows
        if (!isYes) {
            setCompanyRows([]);
        } else {
            // default one row when Yes
            setCompanyRows([{ code: "", name: "", payable: "", receivable: "" }]);
        }
    };

    const companyOptions = [
        { code: "1000", name: "CMS Computers Ltd" },
        { code: "2000", name: "CMS Traffic Systems Ltd" },
        { code: "4000", name: "CMS Computers India Pvt Ltd" },
    ];
    const [companyRows, setCompanyRows] = useState([
        { code: "", name: "", payable: "", receivable: "" }
    ]);

    const handleCompanyChange = (index, field, value) => {
        const updated = [...companyRows];

        // update dropdown value
        if (field === "code") {
            updated[index].code = value;

            // auto-fill company name
            const selected = companyOptions.find((c) => c.code === value);
            updated[index].name = selected ? selected.name : "";
        } else {
            updated[index][field] = value;
        }

        setCompanyRows(updated);
    };

    const addCompanyRow = () => {
        setCompanyRows([
            ...companyRows,
            { code: "", name: "", payable: "", receivable: "" }
        ]);
    };

    const deleteCompanyRow = (index) => {
        const updated = [...companyRows];
        updated.splice(index, 1);
        setCompanyRows(updated);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFinanceData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDropdownChange = (name) => (selectedOptions) => {
        setFinanceData(prevData => ({
            ...prevData,
            [name]: selectedOptions.value === 'Yes'
        }));
    };

    const handleLoansDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setFinanceData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Amount`]: '' }) // Clear amount if No
        }));
    };
    const handleAdvancesDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setFinanceData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Amount`]: '' }) // Clear amount if No
        }));
    };
    const handleiouOrRtaDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setFinanceData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Amount`]: '' }) // Clear amount if No
        }));
    };
    const handleexpenseOrReimbursementDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setFinanceData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Amount`]: '' }) // Clear amount if No
        }));
    };
    const handlefinanceOthersDropdownChange = (name) => (selectedOption) => {
        const isYes = selectedOption.value === 'Yes';
        setFinanceData(prevData => ({
            ...prevData,
            [name]: isYes,
            ...(isYes ? {} : { [`${name}Amount`]: '' }) // Clear amount if No
        }));
    };



    const [errors, setErrors] = useState({});

    const validate = () => {
        let errors = {};
        let isValid = true;

       
        if (financeData.anyPayableReceivable === null || financeData.anyPayableReceivable === undefined) {
            errors.anyPayableReceivable = 'Field is required';
            isValid = false;
        }
        if (financeData.iouOrRta === null || financeData.iouOrRta === undefined) {
            errors.iouOrRta = 'Field is required';
            isValid = false;
        }
        if (financeData.financeOthers === null || financeData.financeOthers === undefined) {
            errors.financeOthers = 'Field is required';
            isValid = false;
        }

        if (financeData.expenseOrReimbursement === null || financeData.expenseOrReimbursement === undefined) {
            errors.expenseOrReimbursement = 'Field is required';
            isValid = false;
        }
        if (!financeData.financeInCharge || financeData.financeInCharge.trim() === "") {
            errors.financeInCharge = 'Field is required';
            isValid = false;
        }

        if (!financeData.financeRemarks || financeData.financeRemarks.trim() === "") {
            errors.financeRemarks = 'Field is required';
            isValid = false;
        }



        if (!financeData.financeInChargeEcode || financeData.financeInChargeEcode.trim() === "") {
            errors.financeInChargeEcode = 'Field is required';
            isValid = false;
        }
        // if (!financeData.companyCode || financeData.companyCode.trim() === "") {
        //     errors.companyCode = 'Field is required';
        //     isValid = false;
        // }
       if (financeData.anyPayableReceivable === true) {
            if (companyRows.length === 0 || companyRows.some(r => !r.code)) {
                errors.companyCode = "Company Code is required";
                isValid = false;
            }
        }

        setErrors(errors);
        return isValid;
    };

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestionsByDept/Finance`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptName === 'Finance');
                if (department) {
                    setFinanceQuestions(department.questions);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }, []);
    // const [financeAnswer, setFinanceAnswer] = useState([]);

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getFinanceFormDetails/${selectedEmployee.wfSeqId}`)
            .then((res) => {
                setFinanceData(res.data);
            })
            .catch((err) => {
                console.log("error", err);
            });

    }, [selectedEmployee.wfSeqId]);

    // useEffect(() => {
    //     if (financeAnswer) {
    //         setFinanceData(prevData => ({
    //             ...prevData,
    //             ...financeAnswer
    //         }));
    //     }
    // }, [financeAnswer]);

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
        //       const formattedCompanyRows = companyRows.map(r => ({
        //     companyCode: r.code,
        //     companyName: r.name,
        //     payable: r.payable ? Number(r.payable) : 0,
        //     receivable: r.receivable ? Number(r.receivable) : 0,
        // }));
        // Convert each row into a single string
        const formattedCompanyRows = companyRows.map(r =>
            `${r.code}_${r.name}_${r.payable || 0}_${r.receivable || 0}`
        );

        const companyCodeJson = JSON.stringify(formattedCompanyRows); // <-- convert rows to JSON string
        const data = ({
            ...financeData,
            wfSeqId: selectedEmployee.wfSeqId,
            companyCode: companyCodeJson
        })
        console.log("Submitting payload:", data);
        axios.post(`${BASE_URL}:9029/api/eSeparation/fillFinanceForm/${selectedAction}`, data)
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
                <h1 className='text-gray-800 font-semibold mx-5 mt-3'>To be filled by Finance Department</h1>
                <h1 className='text-red-500 text-xl' onClick={onClose}><FaRegCircleXmark /></h1>
            </div>
            <div className='mx-5 text-left mt-4 mb-4' style={{ maxHeight: '410px', overflowY: 'auto' }}>
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
                    {financeQuestions.filter(q => q.questionText !== "Finance Remarks").
                        map((question) => (
                            <div key={question.questionId} className="item-center grid grid-cols-3 mt-3">
                                <h1 className="item-center">
                                    {question.questionText} <span className="text-red-500">*</span>
                                </h1>
                                <div className="FormDropdown">


                                    {question.questionText === "IOU / RTA / Unadjusted" && (
                                        <>

                                            <div className="flex flex-wrap items-center gap-4 my-2">
                                                <Dropdown
                                                    className="w-60"
                                                    placeholder="Select"
                                                    options={statusDropdown}
                                                    onChange={handleiouOrRtaDropdownChange("iouOrRta")}
                                                    value={
                                                        financeData.iouOrRta === true
                                                            ? "Yes"
                                                            : financeData.iouOrRta === false
                                                                ? "No"
                                                                : undefined
                                                    }
                                                />
                                                {financeData.iouOrRta === true && (
                                                    <input
                                                        type="number"
                                                        name="iouOrRtaAmount"
                                                        placeholder="Enter iouOrRta amount"
                                                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                        value={financeData.iouOrRtaAmount || ""}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>
                                            {errors.iouOrRta && <p className="text-red-500 ml-2 font-semibold text-[10px] mt-1">{errors.iouOrRta}</p>}



                                        </>
                                    )}

                                    {question.questionText === "Expense / Reimbursement" && (
                                        <>

                                            <div className="flex flex-wrap items-center gap-4 my-2">
                                                <Dropdown
                                                    className="w-60"
                                                    placeholder="Select"
                                                    options={statusDropdown}
                                                    onChange={handleexpenseOrReimbursementDropdownChange("expenseOrReimbursement")}
                                                    value={
                                                        financeData.expenseOrReimbursement === true
                                                            ? "Yes"
                                                            : financeData.expenseOrReimbursement === false
                                                                ? "No"
                                                                : undefined
                                                    }
                                                />
                                                {financeData.expenseOrReimbursement === true && (
                                                    <input
                                                        type="number"
                                                        name="expenseOrReimbursementAmount"
                                                        placeholder="Enter expense or reimbursement amount"
                                                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                        value={financeData.expenseOrReimbursementAmount || ""}
                                                        onChange={handleChange}
                                                    />
                                                )}


                                            </div>

                                            {errors.expenseOrReimbursement && <p className="text-red-500 ml-2 font-semibold text-[10px] mt-1">{errors.expenseOrReimbursement}</p>}
                                        </>
                                    )}
                                    {/* Payable / Receivable overall dropdown */}
                                    {question.questionText === "Any Payable / Receivable?" && (
                                        <>
                                            {/* Dropdown */}
                                            <Dropdown
                                                className="w-60"
                                                options={statusDropdown}
                                                placeholder="Select"
                                                onChange={handlePRDropdownChange}
                                                value={
                                                    financeData.anyPayableReceivable === true
                                                        ? "Yes"
                                                        : financeData.anyPayableReceivable === false
                                                            ? "No"
                                                            : undefined
                                                }
                                            />

                                            {/* Error Message */}
                                            {errors.anyPayableReceivable && (
                                                <p className="text-red-500 ml-2 font-semibold text-[10px] mt-1">
                                                    {errors.anyPayableReceivable}
                                                </p>
                                            )}

                                            {/* Show company rows only if YES */}
                                            {financeData.anyPayableReceivable === true && (
                                                <div className="mt-4">
                                                    {companyRows.map((row, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex flex-wrap items-center gap-4 border p-3 rounded-lg mb-3 bg-gray-50"
                                                        >
                                                            {/* Dropdown */}
                                                            <select
                                                                className="border text-xs border-gray-400 p-1 rounded w-32"
                                                                value={row.code}
                                                                onChange={(e) =>
                                                                    handleCompanyChange(index, "code", e.target.value)
                                                                }
                                                            >
                                                                <option value="">Select Code</option>
                                                                {companyOptions.map((opt) => (
                                                                    <option key={opt.code} value={opt.code}>
                                                                        {opt.code}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            {/* Company Name */}
                                                            <input
                                                                type="text"
                                                                className="border text-xs border-gray-400 p-1 rounded w-56 bg-gray-200"
                                                                value={row.name}
                                                                placeholder="Company Name"
                                                                readOnly
                                                            />

                                                            {/* Payable */}
                                                            <input
                                                                type="number"
                                                                inputMode="numeric"
                                                                placeholder="Payable"
                                                                className="border text-xs border-gray-400 p-1 rounded w-28"
                                                                value={row.payable}
                                                                onChange={(e) =>
                                                                    handleCompanyChange(index, "payable", e.target.value)
                                                                }
                                                            />

                                                            {/* Receivable */}
                                                            <input
                                                                type="number"
                                                                inputMode="numeric"
                                                                placeholder="Receivable"
                                                                className="border text-xs border-gray-400 p-1 rounded w-28"
                                                                value={row.receivable}
                                                                onChange={(e) =>
                                                                    handleCompanyChange(index, "receivable", e.target.value)
                                                                }
                                                            />

                                                            {/* Delete Button */}
                                                            {companyRows.length > 1 && (
                                                                <button
                                                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                                                    onClick={() => deleteCompanyRow(index)}
                                                                >
                                                                    -
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Add Row Button */}
                                                    <button
                                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                                                        onClick={addCompanyRow}
                                                    >
                                                        + Add one more
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}




                                    {question.questionText === "Finance In Charge" && (
                                        <>
                                            <input
                                                type="text"
                                                name="financeInCharge"
                                                className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm"
                                                onChange={handleChange}
                                                value={financeData.financeInCharge || ""}
                                            />
                                            {errors.financeInCharge && <p className="text-red-500 ml-2 font-semibold text-[10px] mt-1">{errors.financeInCharge}</p>}
                                        </>
                                    )}



                                    {question.questionText === "Others" && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-4 my-2">
                                                <Dropdown
                                                    className="w-60"
                                                    placeholder="Select"
                                                    options={statusDropdown}
                                                    onChange={handlefinanceOthersDropdownChange("financeOthers")}
                                                    value={
                                                        financeData.financeOthers === true
                                                            ? "Yes"
                                                            : financeData.financeOthers === false
                                                                ? "No"
                                                                : undefined
                                                    }
                                                />




                                                {financeData.financeOthers === true && (
                                                    <input
                                                        type="number"
                                                        name="financeOthersAmount"
                                                        placeholder="Enter other amount"
                                                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                        value={financeData.financeOthersAmount || ""}
                                                        onChange={handleChange}
                                                    />
                                                )}

                                                {financeData.financeOthers === true && (
                                                    <input
                                                        type="text"
                                                        name="financeOthersRemarks"
                                                        placeholder="Enter Other Remarks"
                                                        className="h-8 outline-none rounded-md py-[1px] px-2 border border-gray-400 w-56 text-sm flex-shrink-0"
                                                        value={financeData.financeOthersRemarks || ""}
                                                        onChange={handleChange}
                                                    />
                                                )}


                                            </div>


                                            {errors.financeOthers && <p className="text-red-500 ml-2 font-semibold text-[10px] mt-1">{errors.financeOthers}</p>}
                                        </>
                                    )}

                                    {question.questionText === "Finance In Charge EmpCode" && (
                                        <>
                                            <input
                                                type="text"
                                                name="financeInChargeEcode"
                                                className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm"
                                                onChange={handleChange}
                                                value={financeData.financeInChargeEcode || ""}
                                            />
                                            {errors.financeInChargeEcode && <p className="text-red-500 ml-2 font-semibold text-[10px] mt-1">{errors.financeInChargeEcode}</p>}
                                        </>
                                    )}

                                </div>
                            </div>
                        ))}

                    {financeQuestions
                        .filter(q => q.questionText === "Finance Remarks")
                        .map((question) => (
                            <div key={question.questionId} className="grid grid-cols-3 mt-3">
                                <h1>
                                    {question.questionText} <span className="text-red-500">*</span>
                                </h1>
                                <div className="FormDropdown">
                                    <textarea
                                        name="financeRemarks"
                                        rows={3}
                                        className={`FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-56 ml-2 text-sm ${errors.financeRemarks ? "" : "mb-6"}`}
                                        onChange={handleChange}
                                        value={financeData.financeRemarks || ""}
                                    />
                                    {errors.financeRemarks && (
                                        <p className="text-red-500 ml-2 font-semibold text-[10px] mt-1">
                                            {errors.financeRemarks}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}

                </div>
            </div >

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
            {
                popupVisible && (
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
                )
            }
        </>
    );
}

export default FinanceDept;
