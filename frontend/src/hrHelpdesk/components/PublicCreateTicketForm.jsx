import axios from 'axios';
import { Paperclip } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import { BASE_URL } from '../../config/Config';

function PublicCreateTicketForm() {
  const baseURL = `${BASE_URL}:9035/tickets`;
    const [loading, setLoading] = useState(false);
    const [filed, setFiled] = useState([]);

    const defaultTicketData = {
        ticketClassification: "",
        title: "",
        description: "",
        severity: "",
        remarks: "",
        category: "IT & Technical Support",
        subCategory: "Password Reset",
        anyDeskId: "",
        userLocation: "",
        department: "",
        userCellNo: "",
        empCode: ""
    };

    const [createTicket, setCreateTicket] = useState(defaultTicketData);

    const updateInput = (event) => {
        setCreateTicket({
            ...createTicket,
            [event.target.name]: event.target.value
        })
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        let formData = new FormData();
        formData.append('ticketData', JSON.stringify(createTicket));
        if (filed.length > 0) {
            console.log("files are there");
            console.log(filed.length);
            for (let i = 0; i < filed.length; i++) {
                formData.append('document', filed[i]);
            }
        }
        else {
            console.log("NO FILE")
            formData.append('document', null);
        }
        axios.post(`${baseURL}/public/${createTicket.empCode}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            toast.success("Ticket created successfully");
            setFiled([]);
            setCreateTicket(defaultTicketData);
        })
            .catch((error) => {
                toast.error("Failed to create ticket.");
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
            <p className="text-sm text-black mb-6 font-content">Raise a ticket to get support from the IT team</p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <input
                    type="text"
                    placeholder="Category"
                    name="category"
                    readOnly
                    value={createTicket.category}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="text"
                    placeholder="subCategory"
                    name="subCategory"
                    readOnly
                    value={createTicket.subCategory}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="text"
                    placeholder="Employee Code"
                    name="empCode"
                    onChange={(event) => { updateInput(event) }}
                    value={createTicket.empCode}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <input
                    type="text"
                    placeholder="Anydesk/Remote Session ID"
                    name="anyDeskId"
                    onChange={(event) => { updateInput(event) }}
                    value={createTicket.anyDeskId}
                    className="border font-content rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

                <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 bg-red-600 font-content text-white font-medium py-2 rounded-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
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

export default PublicCreateTicketForm;