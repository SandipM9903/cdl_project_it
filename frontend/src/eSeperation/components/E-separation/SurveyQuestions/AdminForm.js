import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { BASE_URL } from '../../../../config/Config';
function AdminForm({ adminFormData }) {

    const statusDropdown = ['Yes', 'No'];
    const [adminQuestions, setAdminQuestions] = useState([]);
    const remarksQuestion = adminQuestions.find(q => q.questionText === "Admin Remarks");
    const otherQuestions = adminQuestions.filter(q => q.questionText !== "Admin Remarks");
    const [empNames, setEmpNames] = useState("");
    const [overAllRemarks, setOverAllRemarks] = useState("");

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestions/5`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptId === 5);
                if (department) {
                    setAdminQuestions(department.questions);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }, []);
    useEffect(() => {
        if (adminFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getEmpCodeAndEmpName/${adminFormData.wfSeqId}/5`)
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
        if (adminFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getRemarksFromWfItemTable/${adminFormData.wfSeqId}/5`)
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
                <h1 className='text-gray-800 font-semibold'>To be filled by Admin  {empNames && `(${empNames})`}</h1>
            </div> */}
            <div className='mx-10 mt-6 flex justify-between items-start'>
                {/* Left side */}
                <h1 className='text-gray-800 font-semibold'>
                    To be filled by Admin Department
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
            </div>
            <div className='mx-10 mt-10 text-gray-500 text-sm'>
                {otherQuestions.filter((q) =>
                    q.questionText !== "Admin In Charge" &&
                    q.questionText !== "Admin In Charge Empcode"
                ).map((question) => (
                    <div key={question.questionId} className='flex flex-col md:flex-row items-start gap-4 mt-3'>

                        <h1 className='text-gray-800  text-sm font-medium w-60 break-words'>
                            {question.questionText}
                        </h1>
                        <div className='FormDropdown'>
                            {question.questionText === "Office Stationary" && (
                                <div className="flex gap-4">
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} value={getDropdownValue(adminFormData.officeStationery)} disabled />
                                    <input
                                        type="text"
                                        name="officeStationeryRemarks"
                                        className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm"
                                        value={adminFormData.officeStationeryRemarks || "NA"}
                                        disabled
                                    />
                                </div>)}
                            {question.questionText === "Locker Keys" && (
                                <div className="flex gap-4">
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} value={getDropdownValue(adminFormData.lockerKeys)} disabled />
                                    <input
                                        type="text"
                                        name="lockerKeysRemarks"
                                        className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm"
                                        value={adminFormData.lockerKeysRemarks || "NA"}
                                        disabled
                                    />
                                </div>
                            )}
                            {question.questionText === "Others" && (
                                <div className="flex gap-4 text-gray-500">
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} value={getDropdownValue(adminFormData.others)} disabled />
                                    <input
                                        type="text"
                                        name="othersRemarks"
                                        className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm"
                                        value={adminFormData.othersRemarks || "NA"}
                                        disabled
                                    />
                                </div>
                            )}
                            {question.questionText === "Access Cards / ID Card" && (
                                <input type="text" name="idCard" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={adminFormData.idCard || 'NA'} />
                            )}
                            {question.questionText === "Any Company Files / Documents" && (
                                <input type="text" name="fileOrDocument" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={adminFormData.fileOrDocument || 'NA'} />
                            )}
                            {question.questionText === "Drawer Keys / Cupboard Keys" && (
                                <input type="text" name="lockerKeys" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={adminFormData.lockerKeys || 'NA'} />
                            )}

                        </div>
                    </div>
                ))}
                {otherQuestions
                    .filter((q) => q.questionText === "Admin In Charge")
                    .map((question) => (
                        <div key={question.questionId} className="flex flex-col md:flex-row items-start gap-4 mt-3">
                            <h1 className='text-gray-800  text-sm font-medium w-60 break-words'>
                                {question.questionText}
                            </h1>

                            <div className="FormDropdown">
                                <input
                                    name="adminInCharge"
                                    className="FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm mb-6"
                                    disabled
                                    value={adminFormData.adminInCharge || 'NA'}
                                />
                            </div>
                        </div>
                    ))
                }
                {otherQuestions
                    .filter((q) => q.questionText === "Admin In Charge Empcode")
                    .map((question) => (
                        <div key={question.questionId} className="flex flex-col md:flex-row items-start gap-4 mt-3">
                            <h1 className='text-gray-800  text-sm font-medium w-60 break-words'>
                                {question.questionText}
                            </h1>

                            <div className="FormDropdown">
                                <input
                                    name="adminInChargeCode"
                                    className="FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm mb-6"
                                    disabled
                                    value={adminFormData.adminInChargeCode || 'NA'}
                                />
                            </div>
                        </div>
                    ))
                }



                {remarksQuestion && (
                    <div key={remarksQuestion.questionId} className='flex flex-col md:flex-row items-start gap-4 mt-3'>
                        <h1 className='text-gray-800  text-sm font-medium w-60 break-words'>
                            {remarksQuestion.questionText}
                        </h1>
                        <div className='FormDropdown'>
                            <textarea
                                name="adminRemarks"
                                rows={3}
                                className='FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm mb-6'
                                disabled
                                value={adminFormData.adminRemarks || 'NA'}
                            />
                        </div>
                    </div>
                )}
            </div>
            {overAllRemarks !== undefined && (
                <div className="mx-10 mt-5 mb-6 flex flex-col md:flex-row items-start gap-4">

                    {/* Label aligned exactly like other labels */}
                    <h1 className="text-gray-800 text-sm font-medium w-60 break-words">
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

export default AdminForm;