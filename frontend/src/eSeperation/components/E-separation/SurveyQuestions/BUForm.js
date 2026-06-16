import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { BASE_URL } from '../../../../config/Config';
function BUForm({ buFormData }) {

    const statusDropdown = ['Yes', 'No'];
    const [buQuestions, setBUQuestions] = useState([]);
       const [empNames, setEmpNames] = useState("");
       const [overAllRemarks, setOverAllRemarks] = useState("");

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestions/9`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptId === 9);
                if (department) {
                    setBUQuestions(department.questions);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
    }, []);
    useEffect(() => {
        if (buFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getEmpCodeAndEmpName/${buFormData.wfSeqId}/9`)
                .then((res)  => {
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
        if (buFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getRemarksFromWfItemTable/${buFormData.wfSeqId}/9`)
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

    const getDropdownValue = (value) =>{
        return value===true? 'Yes' : value=== false ? 'No' : 'Select';
    }

    return (
            <div className='container mx-5 border border-gray-400 w-3/4 mb-4'>
                {/* <div className='mx-10 mt-6'>
                    <h1 className='text-gray-800 font-semibold'>To be filled by BU Department  {empNames && `(${empNames})`}</h1>
                </div> */}
                <div className='mx-10 mt-6 flex justify-between items-start'>
                {/* Left side */}
                <h1 className='text-gray-800 font-semibold'>
                    To be filled by BU Department
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
                    {buQuestions.map((question, index) => (
                        <div key={question.questionId} className='grid grid-cols-5 mt-3'>
                            {/* <h1>{index + 1}</h1> */}
                            <h1 className="col-span-2 items-center text-gray-800  text-sm">{question.questionText}</h1>
                            <div className='FormDropdown'>
                                {index === 0 && (
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown}  value={getDropdownValue(buFormData.allManuals)} disabled/>
                                )}
                                {index === 1 && (
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown}  value={getDropdownValue(buFormData.companyDocs)} disabled/>
                                )}
                                {index === 2 && (
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown}  value={getDropdownValue(buFormData.filesOrDrawing)} disabled/>
                                )}
                                {index === 3 && (
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown}  value={getDropdownValue(buFormData.hardCopyOrSoftCopy)} disabled/>
                                )}
                                {index === 4 && (
                                    <Dropdown className='w-60' placeholder={"Select"} options={statusDropdown}  value={getDropdownValue(buFormData.replacementERFNumber)} disabled/>
                                )}
                                {index === 5 && (
                                    <input type="text" name="buInCharge" className='h-8 outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm' disabled value={buFormData.buInCharge || 'NA'} />
                                )}
                                {index === 6 && (
                                    <textarea name="buRemarks" rows={3} className='FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm mb-6' disabled value={buFormData.buRemarks || 'NA'} />
                                )}
                            </div>
                        </div>
                    ))}
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

export default BUForm;