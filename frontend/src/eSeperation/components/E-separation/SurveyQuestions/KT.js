
import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import { BASE_URL } from '../../../../config/Config';

function KT({ ktFormData }) {
    const [ktQuestions, setKTQuestions] = useState([]);
    const statusDropdown = ['Yes', 'No'];
    const [overAllRemarks, setOverAllRemarks] = useState("");

    const [empNames, setEmpNames] = useState("");

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
    useEffect(() => {
        if (ktFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getEmpCodeAndEmpName/${ktFormData.wfSeqId}/2`)
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
        if (ktFormData) {
            axios.get(`${BASE_URL}:9028/api/workflow/getRemarksFromWfItemTable/${ktFormData.wfSeqId}/2`)
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
        <>
            <div className='container mx-5 border border-gray-400 w-3/4 mb-4'>
                {/* <div className='mx-10 mt-6'>
                    <h1 className='text-gray-800 font-semibold'>To be filled by KT Department  {empNames && `(${empNames})`}</h1>
                </div> */}
                <div className='mx-10 mt-6 flex justify-between items-start'>
                    {/* Left side */}
                    <h1 className='text-gray-800 font-semibold'>
                        To be filled by KT Department
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
                <div className='mx-10 mt-10 text-gray-500 items-center text-sm'>
                    {ktQuestions.map((question, index) => (
                        <div key={question.questionId} className=' items-center grid grid-cols-5 mt-3'>
                            {/* <h1>{index + 1}</h1> */}
                            <h1 className="text-gray-800  text-sm col-span-2 items-center">{question.questionText}</h1>
                            <div className='FormDropdown'>
                                {index === 0 && (
                                  //  <Dropdown className=' w-60' options={statusDropdown} value={getDropdownValue(ktFormData.docsHandOver) || 'Select'} disabled />
                               <div className='FormDropdown'>
                            <textarea
                                name="ktRemarks"
                                rows={3}
                                className='FormTextArea outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm mb-6'
                                disabled
                                value={ktFormData.ktRemarks|| 'NA'}
                            />
                        </div>
                               )}
                                {/* {index === 1 && (
                                    <Dropdown className='w-60' options={statusDropdown} value={getDropdownValue(ktFormData.sourceCodeHandOver) || 'Select'} disabled />
                                )}
                                {index === 2 && (
                                    <Dropdown className='w-60 mb-6' options={statusDropdown} value={getDropdownValue(ktFormData.credentialsHandOver) || 'Select'} disabled />
                                )} */}
                            </div>
                        </div>
                    ))}
                </div>
                {overAllRemarks !== undefined && (
                    <div className="mx-10 mt-5 mb-6  items-center  grid grid-cols-5 gap-4">

                        {/* Label aligned same as other questions */}
                        <h1 className=" items-center col-span-2 text-gray-800  text-sm font-semibold">
                            Additional Remarks
                        </h1>

                        {/* Textarea exactly where dropdown appears */}
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

                <div className="mx-10 mt-6 mb-6 flex items-start gap-3">
                    <input
                        type="checkbox"
                        className="mt-1 h-4 w-4"
                        checked={ktFormData.ktDoneByEmployee || false} // ✅ use fetched value
                        disabled
                    />
                    <p className="text-gray-500 text-sm">
                        Employee has completed the KT process and can proceed with the exit process.
                    </p>
                </div>


            </div>
        </>
    );
}

export default KT;
