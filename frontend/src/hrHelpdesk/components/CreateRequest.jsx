import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Paperclip } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTicketRefresh } from '../context/TicketRefreshContext';
import { BASE_URL } from '../../config/Config';
import { MdDelete } from "react-icons/md";


function CreateRequest() {
    const baseURL = `${BASE_URL}:9035/tickets`;

    // const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filed, setFiled] = useState([]);
    const { triggerRefresh } = useTicketRefresh();
    const [ticketIds, setTicketIds] = useState([]);

    const navigate = useNavigate();

    // employee details
    const emp =
    {
        empCode: localStorage.getItem('empId'),
        emailId: localStorage.getItem('email'),
        roles: sessionStorage.getItem("role"),
    }

    //Fetch Departments Data
    useEffect(() => {
        axios.get(`${baseURL}/all/categories`)
            .then((response) => {
                if (!response.error) {
                    const { data } = response;
                    setCategories(data);
                }
            })
            .catch((error) => {
                console.error('Error fetching departments:', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`${baseURL}/active/${emp.empCode}`)
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
    }, [emp.empCode]);

    const defaultTicketData = {
        ticketClassification: "",
        title: "",
        description: "",
        severity: "",
        remarks: "",
        category: "",
        subCategory: " ",
        refTktId: "",
        anyDeskId: "",
        userLocation: "",
        department: "",
        userCellNo: ""
    };

    const [createTicket, setCreateTicket] = useState(defaultTicketData);

    const updateInput = (event) => {
        setCreateTicket({
            ...createTicket,
            [event.target.name]: event.target.value
        })
    };

    const onChangeFile = (event) => {
        const selected = event.target.files;

        if (selected.length > 3) {
            toast.error('You can only upload a maximum of 3 files.');
            event.target.value = null;
            setFiled([]);
            return;
        }

        for (let i = 0; i < selected.length; i++) {
            const file = selected[i];
            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB > 1) {
                toast.error(`File "${file.name}" exceeds 1 MB.`);
                event.target.value = null;
                setFiled([]);
                return;
            }
        }

        setFiled(Array.from(selected));
    };

    const removeFile = (indexToRemove) => {
        setFiled((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        let formData = new FormData();
        formData.append('ticketData', JSON.stringify(createTicket));
        if (filed.length > 0) {
            for (let i = 0; i < filed.length; i++) {
                formData.append('document', filed[i]);
            }
        }
        else {
            console.log("NO FILE")
            formData.append('document', null);
        }
        axios.post(`${baseURL}/${emp.empCode}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            toast.success("Ticket created successfully");
            setFiled([]);
            setCreateTicket(defaultTicketData);
            triggerRefresh();
            setTimeout(() => {
                navigate('/help-desk/my-tickets');
            }, 2000);
        })
            .catch((error) => {
                toast.error(error.response.data.message);
                console.error("Error while posting:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (<>
        <ToastContainer position="top-right" autoClose={1000} newestOnTop style={{ zIndex: 9999 }} />
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl mx-auto">
            <h1 className='text-2xl font-bold text-red-600 mb-1 font-header'>CREATE TICKET</h1>
            <p className="text-sm text-black mb-6 font-content">Raise a ticket to get support from the HR, IT, CDL, or Admin team.</p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                    name="category"
                    onChange={(event) => { updateInput(event) }}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
                    value={createTicket.category}
                    required>
                    <option value="">Select Category</option>
                    {
                        categories.map
                            ((m, index) => {
                                return (
                                    <option key={m.id} value={m.category}>{m.category}</option>
                                )
                            })
                    }
                </select>

                <select
                    name="subCategory"
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
                    onChange={(event) => { updateInput(event) }}
                    value={createTicket.subCategory}
                    required>
                    <option value="">Select Sub-Category</option>
                    {categories
                        .filter(categories => categories.category === createTicket.category)
                        .map(categ => (
                            categ.subCategory.split(";").map(subCategory => (
                                <option key={subCategory.trim()} value={subCategory.trim()}>{subCategory.trim()}</option>
                            ))
                        ))}
                </select>

                <select
                    name="ticketClassification"
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
                    onChange={(event) => { updateInput(event) }}
                    value={createTicket.ticketClassification}
                    required>
                    <option value="">Select Type</option>
                    <option value="request">Request</option>
                    <option value="support">Support</option>
                    <option value="incident">Incident</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="feedback/suggestion">Feedback / Suggestion</option>
                </select>

                <select
                    name="severity"
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
                    onChange={(event) => { updateInput(event) }}
                    value={createTicket.severity}
                    required>
                    <option value="">Select Severity</option>
                    <option value="CRITICAL">CRITICAL -🚨 Code Red</option>
                    <option value="HIGH">HIGH         -🌪️ High Stakes</option>
                    <option value="MEDIUM">MEDIUM     -🛶 Steady Paddle</option>
                    <option value="LOW">LOW           -💤 Chill Zone</option>
                </select>

                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={createTicket.title}
                    onChange={(event) => { updateInput(event) }}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <textarea
                    placeholder="Description"
                    name="description"
                    value={createTicket.description}
                    onChange={(event) => { updateInput(event) }}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-1"
                    required
                />

                <input
                    type="text"
                    placeholder="Anydesk/Remote Session ID"
                    name="anyDeskId"
                    onChange={(event) => { updateInput(event) }}
                    value={createTicket.anyDeskId}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <input
                    type="text"
                    placeholder="User Location"
                    name="userLocation"
                    onChange={(event) => { updateInput(event) }}
                    value={createTicket.userLocation}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <input
                    type="text"
                    placeholder="Department"
                    name="department"
                    onChange={(event) => { updateInput(event) }}
                    value={createTicket.department}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <input
                    type="text"
                    placeholder="User Cell No"
                    name="userCellNo"
                    onChange={(event) => { updateInput(event) }}
                    value={createTicket.userCellNo}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <input
                    type="text"
                    placeholder="Remarks"
                    name="remarks"
                    value={createTicket.remarks}
                    onChange={(event) => { updateInput(event) }}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-1"
                />
                <div>
                    <select
                        name="refTktId"
                        value={createTicket.refTktId}
                        onChange={updateInput}
                        className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full cursor-pointer"
                    >
                        {ticketIds.length > 0 ? (
                            <>
                                <option value="">-- Select Ref Ticket ID --</option>
                                {ticketIds.map((id) => (
                                    <option key={id} value={id}>
                                        {id}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option value="">No active tickets</option>
                        )}
                    </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label htmlFor='file-upload' className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-red-600 cursor-pointer hover:border-red-600">
                        <Paperclip className="w-5 h-5" />
                        <span>Choose a file</span>
                    </label>
                    <input
                        id='file-upload'
                        type="file"
                        name="files"
                        multiple
                        onChange={(event) => onChangeFile(event)}
                        className="hidden"
                    />

                    {filed.length > 0 && (
                        <div className="col-span-1 md:col-span-2 mt-2 text-sm text-gray-700">
                            <p className="font-semibold">Selected file{filed.length > 1 ? 's' : ''}:</p>
                            <ul className="space-y-1">
                                {filed.map((file, idx) => (
                                    <li key={idx} className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded-md">
                                        <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                                        <MdDelete
                                            className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                                            onClick={() => removeFile(idx)}
                                            title="Remove file"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>

                <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 bg-red-600 text-white font-medium py-2 rounded-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                                </svg>
                                <span>Processing...</span>
                            </div>
                        ) : (
                            'Submit Request'
                        )}
                    </button>
                </div>

            </form>
        </div>
    </>);
}

export default CreateRequest;