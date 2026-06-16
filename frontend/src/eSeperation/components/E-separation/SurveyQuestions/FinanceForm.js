
import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { BASE_URL } from '../../../../config/Config';

function FinanceForm({ financeFormData }) {

    const statusDropdown = ['Yes', 'No'];
    const [financeQuestions, setFinanceQuestions] = useState([]);
    const remarksQuestion = financeQuestions.find(q => q.questionText === "Finance Remarks");
    const otherQuestions = financeQuestions.filter(q => q.questionText !== "Finance Remarks");
    const [empNames, setEmpNames] = useState("");
    const [overAllRemarks, setOverAllRemarks] = useState("");
    // const companyRows = Array.isArray(financeFormData.companyCode)
    //     ? financeFormData.companyCode.map(item => {
    //         const parts = item.split("_");
    //         return {
    //             companyCode: parts[0] || "",
    //             companyName: parts[1] || "",
    //             payable: parts[2] || 0,
    //             receivable: parts[3] || 0,
    //         };
    //     })
    //     : [];

    // const companyRows = Array.isArray(financeFormData.companyCode)
    //     ? financeFormData.companyCode.map(parseCompany)
    //     : [parseCompany(financeFormData.companyCode)];

    function parseCompany(item) {
        const parts = item.split("_");
        return {
            companyCode: parts[0] || "",
            companyName: parts[1] || "",
            payable: parts[2] || 0,
            receivable: parts[3] || 0,
        };
    }


    const companyRows = (() => {
        try {
            const data = typeof financeFormData.companyCode === 'string'
                ? JSON.parse(financeFormData.companyCode)
                : financeFormData.companyCode;

            return Array.isArray(data) ? data.map(parseCompany) : [parseCompany(data)];
        } catch (e) {
            console.error("Error parsing companyCode:", e);
            return [];
        }
    })();


    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestions/6`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptId === 6);
                if (department) {
                    setFinanceQuestions(department.questions);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }, []);
    useEffect(() => {
        if (financeFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getEmpCodeAndEmpName/${financeFormData.wfSeqId}/6`)
                .then((res) => {
                    console.log("Admin Response::::::::", res.data);
                    // setEmpNames(res.data.join(" or "));
                    setEmpNames(res.data); // store array, not joined string
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }

    }, []);

    useEffect(() => {
        if (financeFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getRemarksFromWfItemTable/${financeFormData.wfSeqId}/6`)
                .then((res) => {
                    console.log("it remarks::::::::", res.data);
                    // setEmpNames(res.data.join(" or "));
                    setOverAllRemarks(res.data); // store array, not joined string
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }

    }, []);
    const getDropdownValue = (value) => {
        return value === true ? 'Yes' : value === false ? 'No' : 'Select';
    };



    return (
        <div className='container mx-5 border border-gray-400 w-full md:w-[90%] mb-4'>
            {/* <div className='mx-10 mt-6'>
                <h1 className='text-gray-800 font-semibold'>To be filled by Finance Department  {empNames && `(${empNames})`}</h1>
            </div> */}
            <div className='mx-10 mt-6 flex justify-between items-start'>
                {/* Left side */}
                <h1 className='text-gray-800 font-semibold'>
                    To be filled by Finance Department
                </h1>

                {/* Right side */}
                {empNames.length > 0 && (
                    <div className="flex flex-col items-end">
                        {empNames.map((name, idx) => (
                            <span key={idx} className="text-gray-700">
                                {name}
                            </span>
                        ))}
                    </div>
                )}
            </div> .
            <div className='mx-10 mt-10 text-gray-500 text-sm'>
                {otherQuestions.filter((q) =>
                            q.questionText !== "Finance In Charge" &&
                            q.questionText !== "Finance In Charge EmpCode" &&
                            q.questionText !== "Finance Remarks"
                        ).map((question) => (
                    <div key={question.questionId} className='flex flex-col md:flex-row items-start gap-4 mt-3'>

                        <h1 className='text-gray-800  text-sm items-center font-medium w-60 break-words'>
                            {question.questionText}
                        </h1>
                        <div className='FormDropdown'>

                            {question.questionText === "IOU / RTA / Unadjusted" && (
                                <div className="flex flex-col gap-2">
                                    <Dropdown
                                        className="w-60"
                                        placeholder={"Select"}
                                        options={statusDropdown}
                                        value={getDropdownValue(financeFormData.iouOrRta)}
                                        disabled
                                    />

                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex flex-col w-60">
                                            <label className="text-gray-700 text-sm mb-1">iouOrRta Amount</label>
                                            <input
                                                type="text"
                                                className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 text-sm"
                                                value={financeFormData.iouOrRtaAmount || "NA"}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                            )}
                            {question.questionText === "Expense / Reimbursement" && (

                                <div className="flex flex-col gap-2">
                                    <Dropdown
                                        className="w-60"
                                        placeholder={"Select"}
                                        options={statusDropdown}
                                        value={getDropdownValue(financeFormData.expenseOrReimbursement)}
                                        disabled
                                    />

                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex flex-col w-60">
                                            <label className="text-gray-700 text-sm mb-1">ExpenseOrReimbursement Amount</label>
                                            <input
                                                type="text"
                                                className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 text-sm"
                                                value={financeFormData.expenseOrReimbursementAmount || "NA"}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                            )}
                            {question.questionText === "Finance In Charge EmpCode" && (
                                <input type="text" name="financeInCharge" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={financeFormData.financeInChargeEcode || 'NA'} />
                            )}

                            {question.questionText === "Any Payable / Receivable?" &&
                                financeFormData.anyPayableReceivable === true &&
                                companyRows.length > 0 && (
                                    <div className=" ml-[120px] mt-2  items-center">
                                        {companyRows.map((row, index) => (
                                            <div key={index} className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 mb-3 items-start">
                                                <div>
                                                    <label className="font-medium text-gray-700 text-sm">Code:</label>
                                                    <input
                                                        type="text"
                                                        className="border border-gray-400 p-1 rounded w-full text-sm"
                                                        value={row.companyCode}
                                                        disabled
                                                    />
                                                </div>

                                                <div>
                                                    <label className="font-medium text-gray-700 text-sm">Company Name:</label>
                                                    <input
                                                        type="text"
                                                        className="border border-gray-400 p-1 rounded w-full text-sm"
                                                        value={row.companyName}
                                                        disabled
                                                    />
                                                </div>

                                                <div>
                                                    <label className="font-medium text-gray-700 text-sm">Payable:</label>
                                                    <input
                                                        type="text"
                                                        className="border border-gray-400 p-1 rounded w-full text-sm"
                                                        value={row.payable}
                                                        disabled
                                                    />
                                                </div>

                                                <div>
                                                    <label className="font-medium text-gray-700 text-sm">Receivable:</label>
                                                    <input
                                                        type="text"
                                                        className="border border-gray-400 p-1 rounded w-full text-sm"
                                                        value={row.receivable}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                )}

                            {question.questionText === "Any Payable / Receivable?" &&
                                financeFormData.anyPayableReceivable === false && (
                                    // <div className="ml-[120px] mt-2 text-gray-700 text-sm">
                                    //     No
                                    // </div>
                                    <div className="flex flex-col gap-2">
                                        <Dropdown
                                            className="w-60"
                                            placeholder={"Select"}
                                            options={statusDropdown}
                                            value={getDropdownValue(financeFormData.anyPayableReceivable)}
                                            disabled
                                        />
                                    </div>
                                )
                            }



                            {question.questionText === "Others" && (


                                <div className="flex flex-col gap-2">
                                    <Dropdown
                                        className="w-60"
                                        placeholder={"Select"}
                                        options={statusDropdown}
                                        value={getDropdownValue(financeFormData.financeOthers)}
                                        disabled
                                    />
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex flex-col w-60">
                                            <label className="text-gray-700 text-sm mb-1">Other Amount</label>
                                            <input
                                                type="text"
                                                className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 text-sm"
                                                value={financeFormData.financeOthersAmount || "NA"}
                                                disabled
                                            />
                                        </div>
                                        <div className="flex flex-col w-60">
                                            <label className="text-gray-700 text-sm mb-1">Other Remarks</label>
                                            <input
                                                type="text"
                                                className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 text-sm"
                                                value={financeFormData.financeOthersRemarks || "NA"}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                </div>

                            )}
                            {/* {question.questionText === "Finance In Charge" && (
                                <input type="text" name="financeInCharge" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={financeFormData.financeInCharge || 'NA'} />
                            )}
                            {question.questionText === "Finance In Charge EmpCode" && (
                                <input type="text" name="financeInCharge" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={financeFormData.financeInChargeEcode || 'NA'} />
                            )} */}

                        </div>
                    </div>
                ))}
                {/* Finance In Charge & EmpCode above Remarks */}
                <div className='flex flex-col md:flex-row items-start gap-4 mt-3'>
                    <h1 className='text-gray-800 text-sm font-medium w-60 break-words'>Finance In Charge</h1>
                    <input
                        type="text"
                        name="financeInCharge"
                        className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm'
                        disabled
                        value={financeFormData.financeInCharge || 'NA'}
                    />
                </div>

                <div className='flex flex-col md:flex-row items-start gap-4 mt-3'>
                    <h1 className='text-gray-800 text-sm font-medium w-60 break-words'>Finance In Charge EmpCode</h1>
                    <input
                        type="text"
                        name="financeInChargeEcode"
                        className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm'
                        disabled
                        value={financeFormData.financeInChargeEcode || 'NA'}
                    />
                </div>

                {/* Finance Remarks (or remarksQuestion) below */}
               

                {remarksQuestion && (
                    <div key={remarksQuestion.questionId} className='flex flex-col md:flex-row items-start gap-4 mt-3'>
                        <h1 className='text-gray-800  text-sm font-medium w-60 break-words'>
                            {remarksQuestion.questionText}
                        </h1>
                        <div className='FormDropdown'>
                            <textarea
                                name="financeRemarks"
                                rows={3}
                                className='FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm mb-6'
                                disabled
                                value={financeFormData.financeRemarks || 'NA'}
                            />
                        </div>
                    </div>
                )}
            </div>
            {overAllRemarks !== undefined && (
                <div className="mx-10 mt-5 mb-6 flex flex-col md:flex-row items-start gap-4">

                    {/* Label aligned exactly like other labels */}
                    <h1 className="text-gray-800  text-sm font-medium w-60 break-words text-sm">
                        Additional Remarks
                    </h1>

                    {/* Textarea aligned exactly like other input fields */}
                    <textarea
                        className="FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 text-gray-500 text-sm w-60"
                        rows={3}
                        disabled
                        value={
                            overAllRemarks && overAllRemarks.trim() !== ""
                                ? overAllRemarks
                                : "NA"
                        }
                    />
                </div>
            )}

        </div>
    );
}

export default FinanceForm;