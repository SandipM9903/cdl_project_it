
import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { BASE_URL } from '../../../../config/Config';

function ITForm({ itFormData }) {

    const statusDropdown = ['Yes', 'No'];
    const [itQuestions, setITQuestions] = useState([]);
    const [empNames, setEmpNames] = useState("");
    const [overAllRemarks, setOverAllRemarks] = useState("");
    // const otherQuestions = itQuestions.filter(q => q.questionText !== "IT Remarks");
    const otherQuestions = itQuestions
    .filter(q => q.questionText !== "IT Remarks")
    .sort((a, b) => {
        if (a.questionText === "Mail ID Deactivation") return -1;
        if (b.questionText === "Mail ID Deactivation") return 1;
        return 0;
    });
    const remarksQuestion = itQuestions.find(q => q.questionText === "IT Remarks");

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestions/7`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptId === 7);
                if (department) {
                    setITQuestions(department.questions);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }, []);
    useEffect(() => {
        if (itFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getEmpCodeAndEmpName/${itFormData.wfSeqId}/7`)
                .then((res) => {
                    console.log("it members Response::::::::", res.data);
                    console.log("it form Result::::::::", itFormData);
                    // setEmpNames(res.data.join(" or "));
                    setEmpNames(res.data); // store array, not joined string
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }

    }, []);

    useEffect(() => {
        if (itFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getRemarksFromWfItemTable/${itFormData.wfSeqId}/7`)
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
        <div className='container mx-5 border border-gray-400 w-3/4 mb-4'>
            {/* <div className='mx-10 mt-6'>
                    <h1 className='text-gray-800 font-semibold'>To be filled by IT Department  {empNames && `(${empNames})`}</h1>
                </div> */}
            <div className='mx-10 mt-6 flex justify-between items-start'>
                {/* Left side */}
                <h1 className='text-gray-800 font-semibold'>
                    To be filled by IT Department
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
                            q.questionText !== "IT In Charge" &&
                          
                            q.questionText !== "IT Remarks"
                        ).map((question) => (
                    <div key={question.questionId} className='flex flex-col md:flex-row items-start gap-4 mt-3'>

                        <h1 className='text-gray-800  text-sm font-medium w-60 break-words '>{question.questionText}</h1>
                        <div className='FormDropdown '>
                            {question.questionText === "Mail ID Deactivation" && (
                                <div className="flex gap-4">
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} value={getDropdownValue(itFormData.mailDeletion)} disabled />

                                </div>)}
                            {question.questionText === "Mail ID Forwarding" && (
                                <div className="flex gap-4">
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} value={getDropdownValue(itFormData.mailIDForwarding)} disabled />

                                </div>)}
                            {question.questionText === "Forward Mails To" && (
                                <div className="flex gap-4">
                                    <input type="text" name="mailsForwardTo" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={itFormData.mailsForwardTo || 'NA'} />

                                </div>)}
                            {question.questionText === "Data Backup" && (
                                <div className="flex gap-4">
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} value={getDropdownValue(itFormData.dataBackup)} disabled />

                                </div>)}
                            {question.questionText === "Data Card" && (
                                <div className="flex gap-4">
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} value={getDropdownValue(itFormData.dataCard)} disabled />

                                </div>)}
                            {question.questionText === "Laptop or Desktop" && (
                                <div className="flex gap-4">
                                    <input type="text" name="laptopOrDesktop" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={itFormData.laptopOrDesktop || 'NA'} />

                                </div>)}
                            {question.questionText === "Charger" && (
                                <div className="flex gap-4">
                                    <input type="text" name="charger" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={itFormData.charger || 'NA'} />

                                </div>)}
                            {question.questionText === "Mouse / Mouse Pad" && (
                                <div className="flex gap-4">
                                    <input type="text" name="mouse" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={itFormData.mouse || 'NA'} />

                                </div>)}
                            {question.questionText === "Backpack" && (
                                <div className="flex gap-4">
                                    <input type="text" name="backPack" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={itFormData.backPack || 'NA'} />

                                </div>)}
                            {question.questionText === "Pen Drive" && (
                                <div className="flex gap-4">
                                    <input type="text" name="penDrive" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={itFormData.penDrive || 'NA'} />

                                </div>)}
                            {question.questionText === "SIM Card" && (
                                <div className="flex gap-4">
                                    <input type="text" name="simCard" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={itFormData.simCard || 'NA'} />

                                </div>)}
                            {question.questionText === "Others" && (
                                <div className="flex gap-4">
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown} value={getDropdownValue(itFormData.otherAssets)} disabled />
                                    <input
                                        type="text"
                                        name="othersRemarks"
                                        className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm"
                                        value={itFormData.otherAssetsRemarks || "NA"}
                                        disabled
                                    />
                                </div>
                            )}
                            {question.questionText === "Laptop or Desktop Series Number" && (
                                <div className="flex gap-4">
                                    <input type="text" name="lapTopSeriesNumber" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={itFormData.lapTopSeriesNumber || 'NA'} />

                                </div>)}
                            
                            {question.questionText === "Damages & Recovery (If any)" && (
                                <div className="flex flex-col md:flex-row items-start gap-3">
                                    {/* Label - same alignment as others */}
                                    {/* (Note: The label is already rendered above from question.questionText) */}

                                    {/* Right side fields */}
                                    <div className="flex flex-col gap-2 w-60">
                                        <Dropdown
                                            className="w-full"
                                            placeholder={"Select"}
                                            options={statusDropdown}
                                            value={getDropdownValue(itFormData.damagesAndRecovery)}
                                            disabled
                                        />

                                        {/* Amount + Remarks aligned in a perfect column (not stretched) */}
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-col">
                                                <label className="text-gray-500 text-sm mb-1">Recovery Amount</label>
                                                <input
                                                    type="text"
                                                    className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 text-sm"
                                                    value={itFormData.damagesAndRecoveryAmount || "NA"}
                                                    disabled
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label className="text-gray-500 text-sm mb-1">Recovery Remarks</label>
                                                <input
                                                    type="text"
                                                    className="h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 text-sm"
                                                    value={itFormData.damagesAndRecoveryRemarks || "NA"}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                           



                        </div>
                    </div>
                ))}

                {/* {question.questionText === "IT In Charge" && (
                                <input type="text" name="itInCharge" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={itFormData.itInCharge || 'NA'} />
                            )} */}
                            {/* IT In Charge & */}
                <div className='flex flex-col md:flex-row items-start gap-4 mt-3'>
                    <h1 className='text-gray-800 text-sm font-medium w-60 break-words'>IT In Charge</h1>
                    <input
                        type="text"
                        name="itInCharge"
                        className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm'
                        disabled
                        value={itFormData.itInCharge || 'NA'}
                    />
                </div>
                {remarksQuestion && (
                    <div key={remarksQuestion.questionId} className='flex flex-col md:flex-row items-start gap-4 mt-3'>
                        <h1 className='text-gray-800  text-sm font-medium w-60 break-words'>
                            {remarksQuestion.questionText}
                        </h1>
                        <div className='FormDropdown'>
                            <textarea
                                name="hrRemarks"
                                rows={3}
                                className='FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm mb-6'
                                disabled
                                value={itFormData.itRemarks || 'NA'}
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

export default ITForm;