import React, { useState, useEffect } from "react";
import { FaArrowRightLong, FaRegCircleXmark, FaArrowLeftLong } from 'react-icons/fa6';
import axios from "axios";
import { BASE_URL } from "../config/Config";

const FlexiBenefitForm = () => {

    const [employeeData, setEmployeeData] = useState({});
    const [componentList, setComponentList] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [errors, setErrors] = useState([]);
    const MAX_FILE_SIZE = 16 * 1024 * 1024;
    const [monthError, setMonthError] = useState("");
    const [fbrRows, setFbrRows] = useState([
        {
            componentId: "",
            eligibleAmountPm: "",
            amountPmSubmitted: "",
            currency: "INR",
            remarks: "",
            file: null,
        },
    ]);

    const close = () => {
        window.location.reload();
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const empCode = localStorage.getItem("empId");
    useEffect(() => {

        fetchEmployeeData(empCode);
    }, []);

    useEffect(() => {
        axios
            .get(`${BASE_URL}:9040/api/fbr/components`)
            .then((res) => {
                console.log("component response::::", res.data);
                setComponentList(res.data);
            })
            .catch((err) => {
                console.error("Error fetching components:", err);
            });
    }, []);

    const fetchEmployeeData = (code) => {
        axios
            .get(`${BASE_URL}:9040/api/fbr/getEmployeeInfo/${code}`)
            .then((res) => {
                console.log("response::::", res.data); // ✅ Now res is defined
                setEmployeeData(res.data);
            })
            .catch((err) => console.error("Error fetching employee data:", err));
    };

    const handleChange = (index, field, value) => {
        const updatedRows = [...fbrRows];
        updatedRows[index][field] = value;
        setFbrRows(updatedRows);
    };

    const handleFileChange = (index, file) => {
        const updatedRows = [...fbrRows];
        const updatedErrors = [...errors];

        if (file && file.size > MAX_FILE_SIZE) {
            updatedErrors[index] = {
                ...updatedErrors[index],
                file: "File size should not exceed 5 MB.",
            };
            updatedRows[index].file = null;
        } else {
            updatedErrors[index] = {
                ...updatedErrors[index],
                file: "",
            };
            updatedRows[index].file = file;
        }

        setErrors(updatedErrors);
        setFbrRows(updatedRows);
    };


    const addRow = () => {
        setFbrRows([
            ...fbrRows,
            {
                componentId: "",
                eligibleAmountPm: "",
                amountPmSubmitted: "",
                currency: "INR",
                remarks: "",
                file: null,
            },
        ]);
    };
    const validateMonth = () => {
        if (!selectedMonth) {
            setMonthError("Please select a month.");
            return false;
        } else {
            setMonthError("");
            return true;
        }
    };

    const handleSubmit = async () => {
        const isMonthValid = validateMonth();
        const isRowsValid = validateRows();

        if (!isMonthValid || !isRowsValid) {
            return;
        }

        try {
            const formData = new FormData();

            fbrRows.forEach((row) => {
                formData.append("files", row.file || new Blob());
            });

            const fbrPayload = fbrRows.map(row => ({
                component: { id: row.componentId },
                eligibleAmountPm: row.eligibleAmountPm,
                amountPmSubmitted: row.amountPmSubmitted,
                currency: row.currency,
                remarks: row.remarks,
                month: selectedMonth,
                empCode: empCode
            }));

            formData.append("data", new Blob([JSON.stringify(fbrPayload)], {
                type: "application/json"
            }));

            const response = await axios.post(
                `${BASE_URL}:9040/api/fbr/saveFbrForm/${empCode}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("FBR claim submitted successfully.");
            window.location.reload();
            // ✅ Reset form after successful submission
            setSelectedMonth("");
            setMonthError("");
            setErrors([]);
            setFbrRows(prevRows =>
                prevRows.map(() => ({
                    componentId: "",
                    eligibleAmountPm: "",
                    amountPmSubmitted: "",
                    currency: "INR",
                    remarks: "",
                    file: null,
                }))
            );
        } catch (error) {
            console.error("Error submitting FBR claim:", error);
            alert("Failed to submit FBR claim.");
        }
    };

    const validateRows = () => {
        let isValid = true;

        // Validate Month
        if (!selectedMonth) {
            setMonthError("Please select a month.");
            isValid = false;
        } else {
            setMonthError("");
        }

        const newErrors = [];

        fbrRows.forEach((row, index) => {
            const rowErrors = {};

            if (!row.componentId) {
                rowErrors.componentId = "Component is required.";
                isValid = false;
            }
            if (!row.eligibleAmountPm) {
                rowErrors.eligibleAmountPm = "Eligible amount is required.";
                isValid = false;
            }
            if (!row.amountPmSubmitted) {
                rowErrors.amountPmSubmitted = "Submitted amount is required.";
                isValid = false;
            }
            if (!row.remarks) {
                rowErrors.remarks = "Remarks are required.";
                isValid = false;
            }
            if (!row.file) {
                rowErrors.file = "File is required.";
                isValid = false;
            } else if (row.file.size > MAX_FILE_SIZE) {
                rowErrors.file = "File size should not exceed 5 MB.";
                isValid = false;
            }


            newErrors[index] = rowErrors;
        });

        setErrors(newErrors);
        return isValid;
    };


    return (


        <div className="bg-white mx-auto mt-6 w-[90%] rounded-lg shadow-md p-6 border border-gray-200">
            {/* Header with title and image */}
            {/* <div className="flex justify-between items-start mb-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Flexi Benefit Reimbursements Form (FBR)
      </h2>
      <img
        src="/fbr_illustration.png"
        alt="illustration"
        className="w-32 h-24 object-contain mr-2"
      />
    </div> */}


            <div className='container mx-auto' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <div className='flex items-center justify-between mx-8 py-4 border-b-2 border-gray-300'>
                    <h1 className='text-gray-700 font-semibold text-sm'>   Flexi Benefit Reimbursements Form (FBR)</h1>
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
                                        {employeeData?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar}
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                        Email
                                    </th>
                                    <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                        {employeeData?.fileAndObjectTypeBean?.empResDTO?.emailId || "-"}
                                    </td>
                                </tr>
                                <tr className=" border-gray-300  border-b">
                                    <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                        Employee Code
                                    </th>
                                    <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                        {employeeData?.fileAndObjectTypeBean?.empResDTO?.empCode || "-"}
                                    </td>
                                </tr>
                                <tr className="border-gray-300 border-b">
                                    <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                        Reporting Manager
                                    </th>
                                    <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                        {employeeData?.fileAndObjectTypeBean?.empResDTO?.reportingManager || "-"}
                                    </td>
                                </tr>
                                <tr className="border-gray-300  border-b">
                                    <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                        Location
                                    </th>
                                    <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                        {employeeData?.userDTO?.locationResDTO?.locationName || "-"}
                                    </td>
                                </tr>
                                <tr className="border-gray-300  border-b">
                                    <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                        Department
                                    </th>
                                    <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                        {employeeData?.fileAndObjectTypeBean?.empResDTO?.mainDeptResDTO?.mainDepartment || "-"}
                                    </td>
                                </tr>
                                <tr className="border-gray-300  border-b">
                                    <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                        Designation
                                    </th>
                                    <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                        {employeeData?.fileAndObjectTypeBean?.empResDTO?.designationResDTO?.designationName || "-"}
                                    </td>
                                </tr>
                                <tr className="border-gray-300  border-b">
                                    <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                        Date Of Joining
                                    </th>
                                    <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                        {employeeData?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining || "-"}
                                    </td>
                                </tr>
                                <tr className="border-gray-300 border-b">
                                    <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                        Period / Month
                                    </th>
                                    <td className="py-3 px-4 text-gray-600 font-semibold text-xs">
                                        <select
                                            className="border border-gray-300 px-2 py-1 rounded text-xs text-gray-700"
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {months.map((month) => (
                                                <option key={month} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                        {monthError && <p className="text-red-500 text-xs mt-1">{monthError}</p>}
                                    </td>
                                </tr>



                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {/* Flexi Components Table */}
            <div className="mt-4">
                <h3 className="font-semibold text-sm mb-2 text-gray-700">Flexi Components</h3>
                <table className="w-full border text-sm shadow-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-2 border">S.NO</th>
                            <th className="p-2 border">Component</th>
                            <th className="p-2 border">Amount Eligible P.M</th>
                            <th className="p-2 border">Amount Submitted P.M</th>
                            <th className="p-2 border">Currency</th>
                            <th className="p-2 border">Remarks</th>
                            <th className="p-2 border">Attachments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fbrRows.map((row, idx) => (
                            <tr key={idx}>
                                <td className="p-2 border text-center">{idx + 1}</td>
                                <td className="p-2 border">
                                    <select
                                        value={row.componentId}
                                        onChange={(e) => handleChange(idx, "componentId", e.target.value)}
                                        className="border border-gray-300 p-[6px] rounded w-full text-sm"
                                    >
                                        <option value="">Select</option>
                                        {componentList.map((comp) => (
                                            <option key={comp.id} value={comp.id}>
                                                {comp.componentName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors[idx]?.componentId && (
                                        <p className="text-red-500 text-xs">{errors[idx].componentId}</p>
                                    )}
                                </td>
                                <td className="p-2 border">
                                    <input
                                        type="number"
                                        className="border border-gray-300 p-[6px] rounded w-full text-sm"
                                        value={row.eligibleAmountPm}
                                        onChange={(e) => handleChange(idx, "eligibleAmountPm", e.target.value)} />
                                    {errors[idx]?.eligibleAmountPm && (
                                        <p className="text-red-500 text-xs">{errors[idx].eligibleAmountPm}</p>
                                    )}

                                </td>
                                <td className="p-2 border">
                                    <input
                                        type="number"
                                        className="border border-gray-300 p-[6px] rounded w-full text-sm"
                                        value={row.amountPmSubmitted}
                                        onChange={(e) =>
                                            handleChange(idx, "amountPmSubmitted", e.target.value)
                                        }
                                    />
                                    {errors[idx]?.amountPmSubmitted && (
                                        <p className="text-red-500 text-xs">{errors[idx].amountPmSubmitted}</p>
                                    )}
                                </td>
                                <td className="p-2 border">
                                    <select
                                        className="border border-gray-300 p-[6px] rounded w-full text-sm"
                                        value={row.currency}
                                        onChange={(e) => handleChange(idx, "currency", e.target.value)}
                                    >
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </td>
                                <td className="p-2 border">
                                    <input
                                        type="text"
                                        className="border border-gray-300 p-[6px] rounded w-full text-sm"
                                        value={row.remarks}
                                        onChange={(e) => handleChange(idx, "remarks", e.target.value)}
                                    />
                                    {errors[idx]?.remarks && (
                                        <p className="text-red-500 text-xs">{errors[idx].remarks}</p>
                                    )}
                                </td>
                                <td className="p-2 border">
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(idx, e.target.files[0])}
                                        className="text-sm"
                                    />
                                    {errors[idx]?.file && (
                                        <p className="text-red-500 text-xs mt-1">{errors[idx].file}</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add More Link */}
                <div className="flex justify-end mt-2">
                    <button
                        onClick={addRow}
                        className="text-blue-500 text-sm hover:underline"
                    >
                        Add More
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Submit FBR →
                </button>
            </div>
        </div>
    );

};

export default FlexiBenefitForm;
