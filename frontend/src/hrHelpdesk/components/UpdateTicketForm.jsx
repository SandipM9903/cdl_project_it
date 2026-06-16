import { FaRegCircleXmark } from "react-icons/fa6";
import { FaEye, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import { MdOutlineFileDownload } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import { LuArrowDownUp } from 'react-icons/lu';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import emp_default_img from "../../assets/emp_default_img.jpg";
import pdf_symbol from "../../assets/pdf_symbol.png"
import { useEffect, useState } from 'react';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { BASE_URL } from "../../config/Config";
import { read } from "xlsx";



function UpdateTicketForm({ modalOpen, handleCloseModal, currentRow, setCurrentRow, activeTab, empCode, selectedRole, readOnly }) {
    const baseURL = `${BASE_URL}:9035/tickets`;

    const [categories, setCategories] = useState([]);
    const [availableHelpMemmbers, setAvailableHelpMemmbers] = useState([]);
    const [historyData, setHistoryData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [assignedEmployee, setAssignedEmployee] = useState("");
    const [comment, setComment] = useState("");
    const [commentInfo, setCommentInfo] = useState({});
    const [filed, setFiled] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ticketId, setTicketId] = useState(0);
    const [value, setValue] = useState(0);
    const [ticketIds, setTicketIds] = useState([]);

    const combinedData = commentData.concat(historyData);

    useEffect(() => {
        fetchCategories();
        showFormData();
        fetchReferenceTicketIds();
    }, []);

    const fetchReferenceTicketIds = () => {
        axios.get(`${baseURL}/active/${currentRow.raisedByEmpCode}`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setTicketIds(res.data);
                } else {
                    setTicketIds([]);
                }
            })
            .catch(err => {
                console.error("Error fetching active tickets", err);
                setTicketIds([]);
            });
    }

    const fetchCategories = () => {
        axios.get(`${baseURL}/all/categories`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                alert(error);
            });
    }

    const showFormData = () => {
        setAssignedEmployee(currentRow.assignedToEmpCodeData);
        axios.get(`${baseURL}/view-ticket-history/${empCode}/${currentRow.id}`)
            .then((res) => {
                const sortedHistory = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setHistoryData(sortedHistory);
            })
            .catch((error) => {
                setHistoryData([]);
                alert(error);
            });

        axios.get(`${baseURL}/view-comments/${empCode}/${currentRow.id}`)
            .then((response) => {
                const sortedComment = response.data.map(item => ({ ...item, source: 'sortedComment' })).sort((a, b) => new Date(b.date) - new Date(a.date));
                setCommentData(sortedComment);
            })
            .catch((error) => {
                setCommentData([]);
                console.log("Axios error", error);
            });


        let formData = new FormData();
        formData.append('file', null);


        axios.post(`${baseURL}/available-help-team-members/${empCode}/${selectedRole}`, formData)
            .then((response) => {
                setAvailableHelpMemmbers(response.data);
            })
            .catch((error) => {
                alert(error);
            });
        setTicketId(currentRow.id);
    };

    const handleComment = (event) => {
        setComment(event.target.value);
        setCommentInfo({ ...commentInfo, ticketIdNum: ticketId, empCode: empCode });
    }

    const handleAddComment = () => {
        axios.post(`${baseURL}/create-comment/${comment}`, commentInfo).then((response) => {
            if (!response.error) {
                toast.success("Successfully Comment Added");
                setComment("");
                axios.get(`${baseURL}/view-comments/${empCode}/${currentRow.id}`)
                    .then((response) => {
                        const sortedComment = response.data.map(item => ({ ...item, source: 'sortedComment' })).sort((a, b) => new Date(b.date) - new Date(a.date));
                        setCommentData(sortedComment);
                    })
                    .catch((error) => {
                        setCommentData([]);
                        console.log("Axios error", error);
                    });
            }
        }).catch(error => {
            alert(error);
        })
    }

    const handleRemoveComment = () => {
        setComment('');
    }

    const viewFile = (docId) => {
        axios.get(`${baseURL}/get-document/${docId}`, { responseType: 'arraybuffer' })
            .then((res) => {
                const contentType = res.headers['content-type'];
                const blob = new Blob([res.data], { type: contentType });
                const url = URL.createObjectURL(blob);
                const newWindow = window.open();
                newWindow.document.write(`
              <div style={{ textAlign: 'center' }}>
                    <embed className='docs' src="${url}" width="1300" height="700" />
              </div>
   `);
            })
            .catch((err) => {
                alert(err);
            });
    }

    const downloadAllFiles = async (docsList) => {
        try {
            const response = await fetch(`${baseURL}/get-all-documents/${docsList.map(doc => doc.docId)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(docsList.map(doc => doc.docId))

            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const contentType = response.headers.get('Content-Type');
            alert(contentType);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'download.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        }
        catch (error) {
            console.error('There was an error!', error);
        }
    }


    const downloadFile = (docId) => {
        axios.get(`${baseURL}/get-document/${docId}`, { responseType: 'arraybuffer' })
            .then((res) => {
                const contentType = res.headers['content-type'];
                const blob = new Blob([res.data], { type: contentType });
                const url = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                const randomFilename = `file_${Math.random().toString(36).substring(2, 15)}.pdf`;
                downloadLink.download = randomFilename; // Specify the desired filename
                downloadLink.click();
            }).catch((err) => {
                alert(err);
            });
    }

    const deleteFile = (docId, ticketId) => {
        axios.delete(`${baseURL}/delete-document/${ticketId}/${docId}/${empCode}`)
            .then((response) => {
                if (!response.error) {
                    toast.success("Deleted Successfully");
                    setTimeout(() => {
                        handleCloseModal();
                    }, 3000);
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    const onChangeFile = (event) => {
        const files = event.target.files;
        if (files.length > 3) {
            alert('You can only upload a maximum of 3 files.');
            event.target.value = null;
            return;
        }
        let valid = true;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB > 300) {
                valid = false;
                alert(`File ${file.name} is greater than 1 MB.`);
                event.target.value = null;
                break;
            }
        }
        setFiled(event.target.files);
    }

    const handleUpdate = () => {
        setLoading(true);
        let formData = new FormData();
        formData.append('ticketData', JSON.stringify(currentRow));
        if (filed.length > 0) {
            if (currentRow.ticketDocumentsResponse === null) {
                console.log("Ticket Document Response: NULL");
                for (let i = 0; i < filed.length; i++) {
                    formData.append('files', filed[i]);
                }
            }
            else {
                if (filed.length + currentRow.ticketDocumentsResponse.length <= 3) {
                    for (let i = 0; i < filed.length; i++) {
                        formData.append('files', filed[i]);
                    }
                }
                else {
                    alert("You are uploading more than permitted range");
                }
            }
        }
        axios.put(`${baseURL}/update/ticket/${empCode}/${currentRow.id}/${activeTab}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        ).then((response) => {
            toast.success("Updated Successfully");
            setFiled([]);
            setTimeout(() => {
                handleCloseModal();
                setLoading(false);
            }, 3000);
        })
            .catch((error) => {
                toast.error(error.response.data.message);
                setLoading(false);
            })
    }

    const handleChange = (event, newValue) => {
        console.log(newValue, "newValuenewValue");
        setValue(newValue);
    };

    const handleDescriptionPopUp = (event) => {
        setCurrentRow({
            ...currentRow,
            [event.target.name]: event.target.value
        });
    };

    const handleStatusPopUp = (event) => {
        setCurrentRow({
            ...currentRow,
            [event.target.name]: event.target.value
        });
    };

    const handleTitlePopUp = (event) => {
        setCurrentRow({
            ...currentRow,
            [event.target.name]: event.target.value
        });
    };

    const handleAssignedToPopUp = (event) => {
        setCurrentRow({
            ...currentRow,
            [event.target.name]: event.target.value
        });
    };

    const handleSeverityPopUp = (event) => {
        setCurrentRow({
            ...currentRow,
            [event.target.name]: event.target.value
        });
    };

    const handleTypePopUp = (event) => {
        setCurrentRow({
            ...currentRow,
            [event.target.name]: event.target.value
        });
    };

    const handleMainDepartmentPopUp = (event) => {
        setCurrentRow({
            ...currentRow,
            [event.target.name]: event.target.value
        });
    };

    const handleSubDepartmentPopUp = (event) => {
        setCurrentRow({
            ...currentRow,
            [event.target.name]: event.target.value
        });
    };

    if (!modalOpen) return null;

    return (
        <div>
            <ToastContainer position="top-right" autoClose={1000} newestOnTop style={{ zIndex: 9999 }} />
            {modalOpen && <div>
                <div className='absolute top-[5%] left-[20%] z-50 w-[930px] p-10'>
                    {modalOpen && (
                        <div className='border border-gray-400 bg-white h-[88vh] overflow-auto shadow-2xl shadow-gray-900 rounded-md'>
                            <div className='flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shadow-sm rounded-t-md'>
                                <h1 className='text-gray-800 text-xl font-semibold font-header'>Details</h1>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-red-500 hover:text-red-600 transition-colors duration-200 text-2xl"
                                    aria-label="Close"
                                ><FaRegCircleXmark />
                                </button>
                            </div>
                            <div className='overflow-x-auto rounded-lg border border-gray-200'>
                                <table className="w-full text-sm text-left text-gray-700 bg-white">
                                    <tbody>
                                        <tr className="even:bg-white">
                                            <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap font-content">
                                                Ticket Id
                                            </th>
                                            <td className="px-6 py-2 font-content">
                                                {currentRow.id}
                                            </td>
                                        </tr>
                                        {empCode == currentRow.raisedByEmpCode || empCode == currentRow.assignedToAdminId || empCode == currentRow.assignedToEmpCode ? <>
                                            <tr className="even:bg-white">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap font-content">
                                                    Category
                                                </th>
                                                <td className="px-6 py-1 font-content">
                                                    <select disabled={readOnly || ((activeTab === 'assigned' || activeTab === 'team-tickets') && !(empCode == currentRow.assignedToAdminId))} name={"category"} onChange={(event) => { handleMainDepartmentPopUp(event) }} className="w-full border border-gray-300 p-2 rounded-md cursor-pointer" value={currentRow.category}>
                                                        <option>---select---</option>
                                                        {
                                                            categories.map
                                                                ((m, index) => {
                                                                    return (
                                                                        <option key={m.id} value={m.category}>{m.category}</option>
                                                                    )
                                                                })
                                                        }
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    SubCategory
                                                </th>
                                                <td className="px-6 py-1">
                                                    <select disabled={readOnly || ((activeTab === 'assigned' || activeTab === 'team-tickets') && !(empCode == currentRow.assignedToAdminId))} name={"subCategory"} className="w-full border border-gray-300 p-2 rounded-md cursor-pointer" onChange={(event) => { handleSubDepartmentPopUp(event) }} value={currentRow.subCategory}>
                                                        <option value="">---select---</option>
                                                        {categories
                                                            .filter(category => category.category === currentRow.category)
                                                            .map(catg => (
                                                                catg.subCategory.split(";").map(subCatg => (
                                                                    <option key={subCatg} value={subCatg}>{subCatg}</option>
                                                                ))
                                                            ))}
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="font-content">
                                                <th cope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">Type</th>
                                                <td className="px-6 py-1">
                                                    <select disabled={readOnly || (activeTab === 'assigned' || activeTab === 'team-tickets')} name={"ticketClassification"} className="w-full border border-gray-300 p-2 rounded-md cursor-pointer" onChange={(event) => { handleTypePopUp(event) }} value={currentRow.ticketClassification}>
                                                        <option value="">---select---</option>
                                                        <option value="request">Request</option>
                                                        <option value="support">Support</option>
                                                        <option value="incident">Incident</option>
                                                        <option value="maintenance">Maintenance</option>
                                                        <option value="feedback/suggestion">Feedback / Suggestion</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    Severity
                                                </th>
                                                <td className="px-6 py-1">
                                                    <select disabled={readOnly} className='w-full border border-gray-300 p-2 rounded-md cursor-pointer' name={"severity"} onChange={(event) => { handleSeverityPopUp(event) }} value={currentRow.severity}>
                                                        <option value="CRITICAL">CRITICAL</option>
                                                        <option value="HIGH">HIGH</option>
                                                        <option value="MEDIUM">MEDIUM</option>
                                                        <option value="LOW">LOW</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    AnyDesk ID
                                                </th>
                                                <td className="px-6 py-2">
                                                    <textarea disabled={readOnly || (activeTab === 'assigned' || activeTab === 'team-tickets')} rows={1} name="anyDeskId" className='w-full bg-gray-50 border border-gray-300 p-2 rounded-md focus:outline-none' onChange={handleTitlePopUp} value={currentRow.anyDeskId}></textarea>
                                                </td>
                                            </tr>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    User Cell No.
                                                </th>
                                                <td className="px-6 py-2">
                                                    <textarea disabled={readOnly || (activeTab === 'assigned' || activeTab === 'team-tickets')} rows={1} name="userCellNo" className='w-full bg-gray-50 border border-gray-300 p-2 rounded-md focus:outline-none' onChange={handleTitlePopUp} value={currentRow.userCellNo}></textarea>
                                                </td>
                                            </tr>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    User Location
                                                </th>
                                                <td className="px-6 py-2">
                                                    <textarea disabled={readOnly || (activeTab === 'assigned' || activeTab === 'team-tickets')} rows={1} name="userLocation" className='w-full bg-gray-50 border border-gray-300 p-2 rounded-md focus:outline-none' onChange={handleTitlePopUp} value={currentRow.userLocation}></textarea>
                                                </td>
                                            </tr>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    Department
                                                </th>
                                                <td className="px-6 py-2">
                                                    <textarea disabled={readOnly || (activeTab === 'assigned' || activeTab === 'team-tickets')} rows={1} name="department" className='w-full bg-gray-50 border border-gray-300 p-2 rounded-md focus:outline-none' onChange={handleTitlePopUp} value={currentRow.department}></textarea>
                                                </td>
                                            </tr>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    Reference Ticket Id
                                                </th>
                                                <td className="px-6 py-1">
                                                    <select disabled={readOnly || ((activeTab === 'assigned' || activeTab === 'team-tickets') && !(empCode == currentRow.assignedToAdminId))} name={"refTktId"} onChange={(event) => { handleMainDepartmentPopUp(event) }} className="w-full border border-gray-300 p-2 rounded-md cursor-pointer" value={currentRow.refTktId || ""}>
                                                        {ticketIds.filter((id) => id !== currentRow.id).length > 0 ? (
                                                            <>
                                                                <option value="">-- Select Ref Ticket ID --</option>
                                                                {ticketIds.filter((id) => id !== currentRow.id).map((id) => (
                                                                    <option key={id} value={id}>
                                                                        {id}
                                                                    </option>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <option value="">No active tickets</option>
                                                        )}
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    Remarks
                                                </th>
                                                <td className="px-6 py-2">
                                                    <textarea disabled={readOnly || (activeTab === 'assigned' || activeTab === 'team-tickets')} rows={1} name="remarks" className='w-full bg-gray-50 border border-gray-300 p-2 rounded-md focus:outline-none' onChange={handleTitlePopUp} value={currentRow.remarks}></textarea>
                                                </td>
                                            </tr>
                                        </> : <></>
                                        }
                                        <tr className="even:bg-white font-content">
                                            <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                Raised Date
                                            </th>
                                            <td className="px-6 py-2">
                                                {currentRow.createdDateFormat}
                                            </td>
                                        </tr>
                                        {empCode == currentRow.assignedToEmpCode || empCode == currentRow.assignedToAdminId ?
                                            <>
                                                <tr className="even:bg-white font-content">
                                                    <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                        Status
                                                    </th>
                                                    <td className="px-6 py-1">
                                                        <select disabled={readOnly} name={"status"} onChange={(event) => { handleStatusPopUp(event) }} value={currentRow.status}>
                                                            <option value="CREATED">CREATED</option>
                                                            <option value="OPEN">OPEN</option>
                                                            <option value="CLOSED">CLOSED</option>
                                                            <option value="CANCELLED">CANCELLED</option> : <></>
                                                            <option value="RESOLVED">RESOLVED</option>
                                                            <option value="INPROGRESS">IN PROGRESS</option>
                                                            {currentRow.category === "IT & Technical Support" &&
                                                                currentRow.subCategory === "Hardware Issue" && (
                                                                    <option value="ONHOLD">ONHOLD</option>
                                                                )}
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr className="text-black font-content">
                                                    <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                        Assigned To
                                                    </th>
                                                    <td className="px-6 py-1 assigned">
                                                        <select disabled={readOnly} name={"assignedToEmpCodeData"} className="w-full border border-gray-300 p-2 rounded-md" onChange={handleAssignedToPopUp} value={currentRow.assignedToEmpCodeData}>
                                                            {<option value={"assignedToEmpCodeData"}>{assignedEmployee}</option>}
                                                            {availableHelpMemmbers
                                                                .filter(emp => emp !== assignedEmployee)
                                                                .map((assignedToEmpCodeData) => {
                                                                    return (
                                                                        <option key={assignedToEmpCodeData} value={assignedToEmpCodeData}>{assignedToEmpCodeData}</option>
                                                                    )
                                                                })}
                                                        </select>
                                                    </td>
                                                </tr>
                                            </> : <></>}
                                        {((empCode == currentRow.raisedByEmpCode) || (empCode == currentRow.assignedToAdminId) || (empCode == currentRow.assignedToEmpCode)) ? <>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    Title
                                                </th>
                                                <td className="px-6 py-2">
                                                    <textarea disabled={readOnly || (activeTab === 'assigned' || activeTab === 'team-tickets')} rows={1} name={"title"} className='w-full border border-gray-300 p-2 rounded-md' onChange={handleTitlePopUp} value={currentRow.title}></textarea>
                                                </td>
                                            </tr>
                                            <tr className="even:bg-white font-content">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                    Description
                                                </th>
                                                <td className="px-6 py-2">
                                                    <textarea disabled={readOnly || (activeTab === 'assigned' || activeTab === 'team-tickets')} rows={1} name={"description"} className='w-full border border-gray-300 p-2 rounded-md' onChange={handleDescriptionPopUp} value={currentRow.description}></textarea>
                                                </td>
                                            </tr></> : <></>
                                        }
                                        {empCode == currentRow.raisedByEmpCode || empCode == currentRow.assignedToAdminId || empCode == currentRow.assignedToEmpCode ? <>
                                            <tr className="bg-gray-50 border-b font-content">
                                                <td>
                                                    {(currentRow.ticketDocumentsResponse === null && (activeTab !== 'assigned' && activeTab !== 'team-tickets') && !readOnly) ?
                                                        <label htmlFor="pdfInput"
                                                            className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition">
                                                            <FaCloudUploadAlt className="text-3xl text-gray-600" />
                                                            <span className="text-xs text-gray-500 mt-1">Upload Files</span>
                                                            <input
                                                                id="pdfInput"
                                                                type="file"
                                                                multiple
                                                                name="files"
                                                                className="hidden"
                                                                onChange={onChangeFile}
                                                            />
                                                        </label> : null
                                                    }
                                                </td>
                                            </tr>
                                        </> : <></>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {currentRow.id ? (
                                <div>
                                    <div className='p-4 border border-gray-200 rounded-md bg-white shadow-sm'>
                                        {currentRow.ticketDocumentsResponse?.length > 0 && (
                                            <div className="flex items-center gap-3 mb-4">
                                                <h1 className="text-gray-700 text-lg font-medium">Attachments</h1>
                                                <button
                                                    onClick={() => downloadAllFiles(currentRow.ticketDocumentsResponse)}
                                                    title="Download All"
                                                    className="text-gray-600 hover:text-gray-800 text-xl transition"
                                                >
                                                    <BsThreeDots />
                                                </button>
                                            </div>
                                        )}
                                        {currentRow.ticketDocumentsResponse &&
                                            activeTab !== 'assigned' &&
                                            currentRow.ticketDocumentsResponse.length < 3 && (
                                                <label
                                                    htmlFor="pdfInput"
                                                    className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                                                >
                                                    <FaCloudUploadAlt className="text-2xl text-gray-600 mr-2" />
                                                    <span className="text-sm text-gray-600">Upload More Files</span>
                                                    <input
                                                        id="pdfInput"
                                                        type="file"
                                                        multiple
                                                        name="files"
                                                        className="hidden"
                                                        onChange={onChangeFile}
                                                    />
                                                </label>
                                            )}
                                    </div>
                                    <div className='flex flex-wrap gap-4 items-start'>
                                        {currentRow.ticketDocumentsResponse?.map((doc, index) => (
                                            <div key={index} className="flex flex-col items-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 w-[110px]">
                                                <img
                                                    src={pdf_symbol}
                                                    alt="Document"
                                                    className="h-[80px] w-[100px] object-cover rounded"
                                                />
                                                <div className="flex justify-center items-center mt-2 gap-3 text-gray-600">
                                                    <button
                                                        onClick={() => downloadFile(doc.docId)}
                                                        title="Download"
                                                        className="hover:text-blue-600 transition text-xl"
                                                    >
                                                        <MdOutlineFileDownload />
                                                    </button>

                                                    {activeTab !== 'assigned' && (
                                                        <button
                                                            onClick={() => deleteFile(doc.docId, currentRow.id)}
                                                            title="Delete"
                                                            className="hover:text-red-600 transition text-lg"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => viewFile(doc.docId)}
                                                        title="View"
                                                        className="hover:text-green-600 transition text-lg"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                            <div className="mt-8 mb-6 flex justify-center gap-6 items-start">
                                <button
                                    disabled={loading || readOnly}
                                    onClick={() => handleUpdate(activeTab)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-base font-medium py-2 px-6 rounded-md shadow-sm transition
                                    disabled:bg-blue-400 disabled:cursor-not-allowed disabled:hover:bg-blue-400"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2 font-content">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                    stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                                            </svg>
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        'Update'
                                    )}
                                </button>

                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-500 font-content hover:bg-gray-600 text-white text-base font-medium py-2 px-6 rounded-md shadow-sm transition"
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="px-6">
                                <h1 className="text-[#424242] font-extrabold text-lg mb-4 font-header">Activity</h1>

                                <div className="border-b border-gray-200 pb-3">
                                    <Box className="flex flex-wrap justify-between items-center">
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            textColor="secondary"
                                            selectionFollowsFocus
                                            TabIndicatorProps={{ style: { backgroundColor: 'blue' } }}
                                        >
                                            <Tab label="All" sx={{ '&.Mui-selected': { color: 'blue', fontWeight: 'bold' } }} />
                                            <Tab label="Comments" sx={{ '&.Mui-selected': { color: 'blue', fontWeight: 'bold' } }} />
                                            <Tab label="History" sx={{ '&.Mui-selected': { color: 'blue', fontWeight: 'bold' } }} />
                                        </Tabs>

                                        <div className="flex items-center gap-2 text-gray-700 text-sm pr-4 mt-3 sm:mt-0 font-content">
                                            <span className="font-medium">Newest First</span>
                                            <LuArrowDownUp />
                                        </div>
                                    </Box>
                                </div>
                            </div>
                            {value === 0 ?
                                (combinedData.map((combined, index) => (
                                    <div key={index} className='mt-4 grid grid-cols-12' >
                                        <div className='col-span-2'>
                                            <img src={emp_default_img} className='rounded-[9999px] h-[7vh] ml-10 mt-2 w-[7vh]' />
                                        </div>
                                        <div className='col-span-4 mt-3 font-content'>
                                            <h5 className='text-[#424242]'>{combined.comment}</h5>
                                            <p className='text-gray-600 ml-1'>{combined.createdDate}</p>
                                        </div>
                                        <div className='col-span-2 mt-[15px] text-gray-600 text-sm font-header'>
                                            <h6>{combined.historyInfo}</h6>
                                        </div>
                                        <div className='col-span-4 mt-[15px] text-gray-600 text-sm'>
                                            <h1 className={`w-16 px-2 font-header text-black text-sm  ${combined.source === 'sortedComment' ? 'bg-yellow-600' : 'bg-green-200'}`}>{combined.source === 'sortedComment' ? 'Comment' : 'History'}</h1>
                                        </div>
                                    </div>)))
                                : value === 1 ?
                                    <div>
                                        <div className='flex items-center space-x-7 mt-4'>
                                            <div className='col-span-2'>
                                                <img src={emp_default_img} className='rounded-[9999px] h-[7vh] ml-10 w-[7vh]' />
                                            </div>
                                            <div className='flex justify-between items-center w-[500px] space-x-3'>
                                                <textarea disabled={readOnly} rows={1} name="comment" placeholder='Add a Comment...' className='w-[400px] p-1 rounded-none outline-none border border-gray-400' onChange={handleComment} value={comment}></textarea>
                                                <div className='flex space-x-2 font-content'>
                                                    <button onClick={handleAddComment} className="bg-blue-500 hover:bg-blue-700 text-lg rounded-none text-white py-1 px-3">Add</button>
                                                    <button onClick={handleRemoveComment} className="bg-gray-500 hover:bg-gray-700 text-lg rounded-none text-white py-1 px-3">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                        {commentData.length > 0 ? commentData.map((comment, index) => (
                                            <div className='mt-4 grid grid-cols-12' key={index}>
                                                <div className='col-span-2'>
                                                    <img src={emp_default_img} className='rounded-[9999px] h-[7vh] ml-10 mt-2 w-[7vh]' />
                                                </div>
                                                <div className='col-span-4 mt-3'>
                                                    <h5 className='text-[#424242] font-header'>{comment.comment}</h5>
                                                    <p className='text-base text-gray-600 ml-1 font-content'>{comment.createdDate}</p>
                                                </div>
                                            </div>
                                        )) : <></>}
                                    </div>
                                    : historyData.length > 0 ? (historyData.map((historyData, index) => (
                                        <div key={index} className='mt-4 grid grid-cols-12'>
                                            <div className='col-span-2'>
                                                <img src={emp_default_img} className='rounded-[9999px] h-[7vh] ml-10 mt-2 w-[7vh]' />
                                            </div>
                                            <div className='col-span-4 mt-3'>
                                                <p className='text-gray-600 ml-1 font-content'>{historyData.historyInfo}</p>
                                            </div>
                                            <div className='col-span-6 mt-[15px] text-gray-600 text-sm font-header'>
                                                <h5>{historyData.createdDate}</h5>
                                            </div>
                                        </div>
                                    ))) : <></>}
                        </div>
                    )}

                </div>
            </div>}
        </div>
    );
}

export default UpdateTicketForm;