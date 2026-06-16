import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../FNFForm.css';
import axios from 'axios';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../../config/Config';
function FNFForm({ exitFormData, fetchData, closeFNF, resignationDetails }) {
    const experienceDropdown = ['Satisfied', 'Highly Satisfied', 'Not Satisfied'];
    const recommendDropdown = ['Most Likely', 'Likely', 'Not at All'];
    // const empId = sessionStorage.getItem("UserId");
    const workFlowName = sessionStorage.getItem('workflowName');
    // const [wfSeqId, setWfSeqId] = useState(null);
    const [fbrDropdownValue, setFbrDropdownValue] = useState(null);
    const [ItrDropdownValue, setItrDropdownValue] = useState(null);
    const [error, setError] = useState(null);
    const [employeeQP, setEmployeeQP] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const statusDropdown = ['Yes', 'No'];

    const handlefbrchange = (selected) => {
        setFbrDropdownValue(selected.value);
        setFNFData(prev => ({
            ...prev,
            fbr: selected.value
        }));
    };
    const handleItrchange = (selected) => {
        setItrDropdownValue(selected.value);
        setFNFData(prev => ({
            ...prev,
            itr: selected.value
        }));
    };

    const empCode = 4;
    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getQuestions/1`)
            .then((res) => {
                const department = res.data.find(dept => dept.deptId === 1);
                if (department) {
                    setEmployeeQP(department.questions);
                }
            })
            .catch((err) => {
                console.log("error", err);
            });

        // const fetchWfSeqId = async () => {
        //     try {
        //         const response = await axios.get(`http://localhost:9028/api/workflow/getWfSeqIdBasedOnFormNameAndEmpId/${workFlowName}/${empId}`);
        //         setWfSeqId(response.data);
        //     } catch (err) {
        //         setError(err.message);
        //     }
        // };
        // fetchWfSeqId();
    }, [workFlowName, empCode]);



    const [fnfData, setFNFData] = useState({
        wfSeqId: '',
        personalEmail: '',
        phoneNumber: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        // recommendCMS: '',
        fbr: 'No',
        itr: 'No',
        modeOfKt: [],
        systemKnowledge: [],
        projectKnowledge: [],
        documentation: [],
        accessAndCredentials: [],
        attendence: [],
        documentDownload: [],
        ktGivenToName: '',
        ktGivenToECode: '',
        fnfAcknowledgement: false

    });

    useEffect(() => {
        if (exitFormData) {
            setFNFData(prev => ({
                ...prev,

                modeOfKt: Array.isArray(exitFormData.modeOfKt) ? exitFormData.modeOfKt : [],
                projectKnowledge: Array.isArray(exitFormData.projectKnowledge) ? exitFormData.projectKnowledge : [],
                systemKnowledge: Array.isArray(exitFormData.systemKnowledge) ? exitFormData.systemKnowledge : [],
                documentation: Array.isArray(exitFormData.documentation) ? exitFormData.documentation : [],
                accessAndCredentials: Array.isArray(exitFormData.accessAndCredentials) ? exitFormData.accessAndCredentials : [],
                attendence: Array.isArray(exitFormData.attendence) ? exitFormData.attendence : [],
                documentDownload: Array.isArray(exitFormData.documentDownload) ? exitFormData.documentDownload : [],

            }));
        }
    }, [exitFormData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFNFData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleModeOfKtChange = (e) => {
        const { name, checked } = e.target;
        setFNFData(prev => {
            let updated = [...prev.modeOfKt];
            if (checked) {
                updated.push(name);
            } else {
                updated = updated.filter(item => item !== name);
            }
            return { ...prev, modeOfKt: updated };
        });
    };
    const handleProjectKnowledgeChange = (e) => {
        const { name, checked } = e.target;
        setFNFData(prev => {
            let updated = [...prev.projectKnowledge];
            if (checked) {
                updated.push(name);
            } else {
                updated = updated.filter(item => item !== name);
            }
            return { ...prev, projectKnowledge: updated };
        });
    };
    const handleSystemKnowledgeChange = (e) => {
        const { name, checked } = e.target;
        setFNFData(prev => {
            let updated = [...prev.systemKnowledge];
            if (checked) {
                updated.push(name);
            } else {
                updated = updated.filter(item => item !== name);
            }
            return { ...prev, systemKnowledge: updated };
        });
    };
    const handleDocumentationChange = (e) => {
        const { name, checked } = e.target;
        setFNFData(prev => {
            let updated = [...prev.documentation];
            if (checked) {
                updated.push(name);
            } else {
                updated = updated.filter(item => item !== name);
            }
            return { ...prev, documentation: updated };
        });
    };


    const handleAccessAndCredentialsChange = (e) => {
        const { name, checked } = e.target;
        setFNFData(prev => {
            let updated = [...prev.accessAndCredentials];
            if (checked) {
                updated.push(name);
            } else {
                updated = updated.filter(item => item !== name);
            }
            return { ...prev, accessAndCredentials: updated };
        });
    };
    const handleAttendenceChange = (e) => {
        const { name, checked } = e.target;
        setFNFData(prev => {
            let updated = [...prev.attendence];
            if (checked) {
                updated.push(name);
            } else {
                updated = updated.filter(item => item !== name);
            }
            return { ...prev, attendence: updated };
        });
    };
    const handledocumentDownloadChange = (e) => {
        const { name, checked } = e.target;
        setFNFData(prev => {
            let updated = [...prev.documentDownload];
            if (checked) {
                updated.push(name);
            } else {
                updated = updated.filter(item => item !== name);
            }
            return { ...prev, documentDownload: updated };
        });
    };

    const handleDropdownChange = (name) => (selectedOptions) => {
        setFNFData(prevData => ({
            ...prevData,
            [name]: selectedOptions.value
        }));
    };
    const handleFbrNavigate = () => {
        navigate(`/fbrForm`); // adjust path as per your route
    };

    const handleItrNavigate = () => {
        navigate(`/tax`); // adjust path as per your route
    };

    const [errors, setErrors] = useState({});

    const validate = () => {
        let errors = {};
        let isValid = true;

        if (!fnfData.personalEmail) {
            errors.personalEmail = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(fnfData.personalEmail)) {
            errors.personalEmail = 'Email is invalid';
            isValid = false;
        }

        if (!fnfData.phoneNumber) {
            errors.phoneNumber = 'Phone number must be 10 digits';
            isValid = false;
        } else if (!/^\d{10}$/.test(fnfData.phoneNumber)) {
            errors.phoneNumber = 'Invalid phone number';
            isValid = false;
        }

        if (!fnfData.bankName) {
            errors.bankName = 'Bank name is required';
            isValid = false;
        }

        if (!fnfData.accountNumber) {
            errors.accountNumber = 'Account number is required';
            isValid = false;
        }

        if (!fnfData.ifscCode) {
            errors.ifscCode = 'IFSC code is required';
            isValid = false;
        }

        // if (!fnfData.recommendCMS) {
        //     errors.recommendCMS = 'Field is required';
        //     isValid = false;
        // }
        if (fnfData.modeOfKt.length === 0) {
            errors.modeOfKt = 'Field is required';
            isValid = false;
        }
        if (fnfData.projectKnowledge.length === 0) {
            errors.projectKnowledge = 'Field is required';
            isValid = false;
        }
        if (fnfData.systemKnowledge.length === 0) {
            errors.systemKnowledge = 'Field is required';
            isValid = false;
        }
        if (fnfData.accessAndCredentials.length === 0) {
            errors.accessAndCredentials = 'Field is required';
            isValid = false;
        }
        if (fnfData.documentation.length === 0) {
            errors.documentation = 'Field is required';
            isValid = false;
        }
        if (fnfData.attendence.length === 0) {
            errors.attendence = 'Field is required';
            isValid = false;
        }
        if (fnfData.documentDownload.length === 0) {
            errors.documentDownload = 'Field is required';
            isValid = false;
        }
        // if (fnfData.ktGivenToECode === "") {
        //     errors.ktGivenToECode = 'Field is required';
        //     isValid = false;
        // }
        // if (fnfData.ktGivenToName === "") {
        //     errors.ktGivenToName = 'Field is required';
        //     isValid = false;
        // }
        if (!fnfData.fnfAcknowledgement) {
            errors.fnfAcknowledgement = "You must acknowledge before submitting";
            isValid = false;
        }



        setErrors(errors);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }
        const data = {
            ...fnfData,
            wfSeqId: resignationDetails.wfSeqId
        }
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want Submit FNF Form ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Accept",
        }).then((result) => {
            if (result.isConfirmed) {
                setIsSubmitting(true); // 🔒 Disable submit
                axios.post(`${BASE_URL}:9029/api/eSeparation/submitExitForm`, data)
                    .then(() => {
                        console.log("Posted", data);
                        Swal.fire({
                            title: "Submitted!",
                            text: "You have Successfully Submitted",
                            icon: "success",
                            timer: 1000
                        });
                        fetchData();

                    })
                    .catch((err) => {
                        console.log("Failed to post the data", err);
                    })
            }
        })
    };

    return (
        <>
            <div className='container mx-1 border border-gray-400 lg:w-full md:w-3/4 w-full mb-4'>
                <div className='mx-10 mt-6'>
                    <h1 className='text-gray-800 font-semibold'>To be filled by Employee</h1>
                </div>
                <div className='mx-10 mt-10 text-gray-500 text-sm'>
                    {employeeQP.filter((q) =>

                        q.questionText !== "Attendant / Replacement Members Name" &&
                        q.questionText !== "Attendant / Replacement Members ECode"
                    ).map((question) => (
                        <div key={question.questionId} className='flex flex-col md:flex-row items-center gap-4 mt-3 '>

                            <h1 className='text-gray-800 font-medium w-80 break-words'>{question.questionText} <span className='text-red-500'> *</span></h1>
                            <div className="col-span-3 border-b border-gray-300 mt-3"></div>

                            {/* {employeeQP.map((question, index) => (
                        <div key={question.questionId} className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 mt-3'>
                            <div className='flex '>
                                <h1>{index + 1}</h1>
                                <h1 className='md:ml-10 lg:ml-3 ml-5 lg:whitespace-nowrap'>{question.questionText} <span className='text-red-500'> *</span></h1>
                            </div> */}
                            <div className='FormDropdown lg:ml-40 md:ml-0 ml-5'>
                                {question.questionText === "Personal Email Id" && (
                                    <>
                                        <input type="email" name="personalEmail" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8 ml-[-160px]' onChange={handleChange} value={exitFormData.personalEmail} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                        {errors.personalEmail && <p className='text-red-500 font-semibold text-[10px] mt-1'>{errors.personalEmail}</p>}
                                    </>
                                )}
                                {question.questionText === "Bank Name" && (
                                    <>
                                        <input type="text" name="bankName" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8 ml-[-160px]' onChange={handleChange} value={exitFormData.bankName} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                        {errors.bankName && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.bankName}</p>}
                                    </>
                                )}
                                {question.questionText === "Account Number" && (
                                    <>
                                        <input type="text" name="accountNumber" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8 ml-[-160px]' onChange={handleChange} value={exitFormData.accountNumber} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                        {errors.accountNumber && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.accountNumber}</p>}
                                    </>
                                )}
                                {question.questionText === "IFSC Code" && (
                                    <>
                                        <input type="text" name="ifscCode" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8 ml-[-160px]' onChange={handleChange} value={exitFormData.ifscCode} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                        {errors.ifscCode && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.ifscCode}</p>}
                                    </>
                                )}
                                {question.questionText === "Personal Mobile Number" && (
                                    <>
                                        <input type="text" name="phoneNumber" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8 ml-[-160px]' onChange={handleChange} value={exitFormData.phoneNumber} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                        {errors.phoneNumber && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.phoneNumber}</p>}
                                    </>
                                )}
                                {/* {question.questionText === "Attendant / Replacement Members Name" && (
                                    <>
                                        <input type="text" name="ktGivenToName" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8' onChange={handleChange} value={exitFormData.ktGivenToName} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                        {errors.ktGivenToName && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.ktGivenToName}</p>}
                                    </>
                                )}
                                {question.questionText === "Attendant / Replacement Members ECode" && (
                                    <>
                                        <input type="text" name="ktGivenToECode" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8' onChange={handleChange} value={exitFormData.ktGivenToECode} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                        {errors.ktGivenToECode && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.ktGivenToECode}</p>}
                                    </>
                                )} */}
                                {question.questionText === "Mode of KT" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 ml-[-55px]">

                                        {["In-person", "Online", "Hybrid / Virtual"].map(option => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name={option}
                                                    className="h-4 w-4"
                                                    checked={fnfData.modeOfKt.includes(option)}
                                                    onChange={handleModeOfKtChange}
                                                    disabled={exitFormData.exitFormStatus === 'Submitted'}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                        {errors.modeOfKt && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.modeOfKt}</p>}

                                    </div>

                                )}
                                {question.questionText === "Project Knowledge" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm ml-[-25px]">

                                        {["Key stakeholders", "Upcoming deliverables", "Current project status", "Pending tasks", "NA"].map(option => (
                                            <label key={option} className="flex items-center gap-4 text-sm ">
                                                <input
                                                    type="checkbox"
                                                    name={option}
                                                    className="h-4 w-4"
                                                    checked={fnfData.projectKnowledge.includes(option)}
                                                    onChange={handleProjectKnowledgeChange}
                                                    disabled={exitFormData.exitFormStatus === 'Submitted'}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                        {errors.projectKnowledge && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.projectKnowledge}</p>}

                                    </div>
                                )}
                                {question.questionText === "System Knowledge" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ml-[-15px]">

                                        {["System accesses explained", "Tool usage demonstrated", "Login details shared", "Critical workflows covered", "NA"].map(option => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name={option}
                                                    className="h-4 w-4"
                                                    checked={fnfData.systemKnowledge.includes(option)}
                                                    onChange={handleSystemKnowledgeChange}
                                                    disabled={exitFormData.exitFormStatus === 'Submitted'}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                        {errors.systemKnowledge && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.systemKnowledge}</p>}

                                    </div>
                                )}
                                {question.questionText === "Documentation" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 ml-[10px]">

                                        {["SOPs", "Manuals / Guides", "Physical files & Documents", "NA"].map(option => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name={option}
                                                    className="h-4 w-4"
                                                    checked={fnfData.documentation.includes(option)}
                                                    onChange={handleDocumentationChange}
                                                    disabled={exitFormData.exitFormStatus === 'Submitted'}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                        {errors.documentation && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.documentation}</p>}

                                    </div>
                                )}
                                {question.questionText === "Access & Credentials" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 ml-[30px]">

                                        {["Shared mailbox access explained", "Team drive access explained", "NA"].map(option => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name={option}
                                                    className="h-4 w-4"
                                                    checked={fnfData.accessAndCredentials.includes(option)}
                                                    onChange={handleAccessAndCredentialsChange}
                                                    disabled={exitFormData.exitFormStatus === 'Submitted'}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                        {errors.accessAndCredentials && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.accessAndCredentials}</p>}

                                    </div>
                                )}
                                {question.questionText === "Attendence" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-[-165px]">

                                        {["Regularise Attendance", "Pending Leaves Applied"].map(option => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name={option}
                                                    className="h-4 w-4"
                                                    checked={fnfData.attendence.includes(option)}
                                                    onChange={handleAttendenceChange}
                                                    disabled={exitFormData.exitFormStatus === 'Submitted'}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                        {errors.attendence && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.attendence}</p>}

                                    </div>
                                )}
                                {question.questionText === "Documents Download" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ml-[35px]">

                                        {["Payslips Downloaded (as required)", "Form 16 ( Previous Years )", " Appointment Letters ", "Salary Revision / Promotion / Appraisal Letters ( If any) "].map(option => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name={option}
                                                    className="h-4 w-4"
                                                    checked={fnfData.documentDownload.includes(option)}
                                                    onChange={handledocumentDownloadChange}
                                                    disabled={exitFormData.exitFormStatus === 'Submitted'}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                        {errors.documentDownload && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.documentDownload}</p>}

                                    </div>
                                )}

                                {/* {question.questionText === "Will you recommend CMS for other?" && (
                                    <>
                                        <Dropdown className='w-60 ml-[-160px]' placeholder={"Select"} options={recommendDropdown} onChange={handleDropdownChange('recommendCMS')} value={exitFormData.recommendCMS} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                        {errors.recommendCMS && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.recommendCMS}</p>}
                                    </>
                                )} */}

                            </div>


                        </div>
                    ))}
                    {employeeQP
                        .filter((q) => q.questionText === "Attendant / Replacement Members Name")
                        .map((question) => (
                            <div key={question.questionId} className=' text-gray-500 grid grid-cols-3 mt-3'>
                                <h1 className=' text-gray-800'>
                                    {question.questionText}
                                </h1>
                                <div className="ml-[40px] ">
                                    <input type="text" name="ktGivenToName" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8' onChange={handleChange} value={exitFormData.ktGivenToName} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                    {/* {errors.ktGivenToName && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.ktGivenToName}</p>} */}

                                </div>
                            </div>
                        ))
                    }
                    {employeeQP
                        .filter((q) => q.questionText === "Attendant / Replacement Members ECode")
                        .map((question) => (
                            <div key={question.questionId} className='grid grid-cols-3 mt-3 '>
                                <h1 className=' text-gray-800'>
                                    {question.questionText}
                                </h1>
                                <div className="ml-[40px] ">
                                    <input type="text" name="ktGivenToECode" className='outline-none rounded-md py-[1px] px-1 border border-gray-400 w-60 text-sm h-8' onChange={handleChange} value={exitFormData.ktGivenToECode} disabled={exitFormData.exitFormStatus === 'Submitted'} />
                                    {/* {errors.ktGivenToECode && <p className='text-red-500 font-semibold mt-1 text-[10px]'>{errors.ktGivenToECode}</p>} */}

                                </div>

                            </div>
                        ))
                    }
                    {/* <div className="flex justify-start gap-4 mt-6 ml-10 FormDropdown lg:ml-40 md:ml-0 ml-5 ">
                        <th className="py-3 text-gray-800 font-medium text-xs ">FBR Proofs</th> */}

                    <div className="FormDropdown flex items-center gap-4 mt-3">
                        <label className="font-medium text-gray-700 w-40 text-sm">
                            FBR Proofs:
                        </label>
                        <Dropdown
                            className="w-60 ml-[160px]"
                            placeholder="Select"
                            options={statusDropdown}
                            onChange={handlefbrchange}
                            value={exitFormData.exitFormStatus === 'Submitted' ? exitFormData.fbr : fbrDropdownValue}
                            disabled={exitFormData.exitFormStatus === 'Submitted'}
                        />

                        {exitFormData.exitFormStatus !== 'Submitted' && fbrDropdownValue === 'Yes' && (
                            <button
                                onClick={handleFbrNavigate}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-1.5 rounded-sm"
                            >
                                Submit Here
                            </button>
                        )}
                    </div>

                    {/* <div className="flex justify-start gap-4 mt-6 ml-10 FormDropdown lg:ml-40 md:ml-0 ml-5">
                        <th className="py-3 text-gray-800 font-medium text-xs">ITR Proofs</th> */}
                    <div className="FormDropdown flex items-center gap-4 mt-3">
                        <label className="font-medium text-gray-700 w-40 text-sm">
                            ITR Proofs:
                        </label>
                        <Dropdown
                            className="w-60 ml-[160px]"
                            placeholder="Select"
                            options={statusDropdown}
                            onChange={handleItrchange}
                            value={exitFormData.exitFormStatus === 'Submitted' ? exitFormData.itr : ItrDropdownValue}
                            disabled={exitFormData.exitFormStatus === 'Submitted'}
                        />

                        {exitFormData.exitFormStatus !== 'Submitted' && ItrDropdownValue === 'Yes' && (
                            <button
                                onClick={handleItrNavigate}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-1.5 rounded-sm"
                            >
                                Submit Here
                            </button>
                        )}
                    </div>

                </div>

                {/* FNF Settlement Notice Checkbox */}
                <div className="mx-10 mt-6 flex items-center gap-2 ">
                    <input
                        type="checkbox"
                        name="fnfAcknowledgement"
                        className="h-4 w-4 ml-20"
                        checked={fnfData.fnfAcknowledgement || false}
                        onChange={(e) =>
                            setFNFData(prev => ({
                                ...prev,
                                fnfAcknowledgement: e.target.checked
                            }))
                        }
                        disabled={exitFormData.exitFormStatus === 'Submitted'}
                    />

                    <label className="text-sm text-gray-700 ">
                        I am aware that my FNF settlement will be processed within 90 days from my last working day.
                    </label>
                </div>

                {errors.fnfAcknowledgement && (
                    <p className="text-red-500 text-xs ml-80 mt-1">
                        Please acknowledge the FNF settlement clause.
                    </p>
                )}



                {/* {exitFormData.exitFormStatus !== 'Submitted' && (
                        <div className="flex justify-start gap-4 mt-6 ml-10 FormDropdown lg:ml-40 md:ml-0 ml-5">
                            <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                FBR Proofs
                            </th>
                            <Dropdown
                                className="w-60"
                                placeholder="Select"
                                options={statusDropdown}
                                onChange={handlefbrchange}
                                // value={fbrDropdownValue}
                                value={exitFormData.exitFormStatus === 'Submitted' ? exitFormData.fbr : fbrDropdownValue}
                                disabled={exitFormData.exitFormStatus === 'Submitted'}
                            />

                            {fbrDropdownValue === 'Yes' && (
                                <button
                                    onClick={handleFbrNavigate}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-1.5 rounded-sm"
                                >
                                    Submit Here
                                </button>
                            )}
                        </div>
                    )} */}
                {/* {exitFormData.exitFormStatus !== 'Submitted' && (
                        <div className="flex justify-start gap-4 mt-6 ml-10 FormDropdown lg:ml-40 md:ml-0 ml-5">
                            <th scope="row" className="py-3 text-gray-500 font-medium text-xs">
                                ITR Proofs
                            </th>
                            <Dropdown
                                className="w-60"
                                placeholder="Select"
                                options={statusDropdown}
                                onChange={handleItrchange}
                                value={ItrDropdownValue}
                            />
                            {ItrDropdownValue === 'Yes' && (
                                <button
                                    onClick={handleItrNavigate}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-1.5 rounded-sm"
                                >
                                    Submit Here
                                </button>
                            )}
                        </div>
                    )} */}




            </div>
            {exitFormData.exitFormStatus !== 'Submitted' && (

                <div className='flex items-center gap-10 justify-center mt-6 mb-10'>
                    <button className='bg-gray-600 hover:bg-gray-700 px-6 py-1.5 text-white rounded-sm' onClick={closeFNF}>Cancel</button>
                    {/* <button className='bg-blue-400 hover:bg-blue-500 px-6 py-1.5 text-white rounded-sm' onClick={handleSubmit}>Submit</button> */}
                    <button
                        className={`px-6 py-1.5 text-white rounded-sm 
        ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500'}
    `}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>

                </div>
            )}
        </>
    );
}

export default FNFForm;


