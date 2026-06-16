import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../config/Config';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Header from '../components/Header';

function EmployeeInfoApproval() {
    const [pendingProfileUpdateRequests, setPendingProfileUpdateRequests] = useState([]);
    const [approvedProfileUpdateRequests, setApprovedProfileUpdateRequests] = useState([]);
    const [rejectedProfileUpdateRequests, setRejectedProfileUpdateRequests] = useState([]);
    const empCode = localStorage.getItem('empId');
    const [activeTab, setActiveTab] = useState('pending');
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);
    useEffect(() => {
        if (activeTab === 'pending') {
            fetchPendingUpdateRequests();
        } else if (activeTab === 'approved') {
            fetchApprovedUpdateRequests();
        } else if (activeTab === 'rejected') {
            fetchRejectedUpdateRequests();
        }
    }, [activeTab]);

    const fetchPendingUpdateRequests = () => {
        axios
            //   .get(`${BASE_URL}:9020/employee/pending-approval-request/${empCode}`)
            .get(`${BASE_URL}:9020/employee/pending-request/${empCode}`)
            .then((res) => setPendingProfileUpdateRequests(res.data))
            .catch((err) => toast.error("Failed to fetch requests."));
    }
    const fetchApprovedUpdateRequests = () => {
        axios
            //   .get(`${BASE_URL}:9020/employee/pending-approval-request/${empCode}`)
            .get(`${BASE_URL}:9020/employee/approved-request/${empCode}`)
            .then((res) => setApprovedProfileUpdateRequests(res.data))
            .catch((err) => toast.error("Failed to fetch requests."));
    }
    const fetchRejectedUpdateRequests = () => {
        axios
            //   .get(`${BASE_URL}:9020/employee/pending-approval-request/${empCode}`)
            .get(`${BASE_URL}:9020/employee/rejected-request/${empCode}`)
            .then((res) => setRejectedProfileUpdateRequests(res.data))
            .catch((err) => toast.error("Failed to fetch requests."));
    }

    // Approve handler
    const handleApproveReject = (id, status) => {
        axios.put(`${BASE_URL}:9020/employee/update/${id}/${status}`).then(res => {
            fetchPendingUpdateRequests(); 
            toast.success(res.data);
        }).catch(err => {
            toast.error(err);
        })
    };


  return (
        <div className='min-h-[calc(100vh-64px)] bg-white'>
            <Header />
            <div className="flex justify-center mt-24 mb-4 bg-white">
                <button
                    className={`px-4 py-2 mx-2 rounded-t-lg font-semibold border-b-2 ${activeTab === 'pending' ? 'border-blue-600 text-blue-800 bg-white' : 'border-transparent text-gray-600 bg-white'}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending
                </button>
                <button
                    className={`px-4 py-2 mx-2 rounded-t-lg font-semibold border-b-2 ${activeTab === 'approved' ? 'border-green-600 text-green-800 bg-white' : 'border-transparent text-gray-600 bg-white'}`}
                    onClick={() => setActiveTab('approved')}
                >
                    Approved
                </button>
                <button
                    className={`px-4 py-2 mx-2 rounded-t-lg font-semibold border-b-2 ${activeTab === 'rejected' ? 'border-red-600 text-red-800 bg-white' : 'border-transparent text-gray-600 bg-white'}`}
                    onClick={() => setActiveTab('rejected')}
                >
                    Rejected
                </button>
            </div>
            <div className="overflow-x-auto shadow rounded-lg bg-white">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-white">
                        <tr>
                            <th className="px-6 py-3">Employee Code</th>
                            <th className="px-6 py-3">Primary Contact No</th>
                            <th className="px-6 py-3">Secondary Contact No</th>
                            <th className="px-6 py-3">Gender</th>
                            <th className="px-6 py-3">Blood Group</th>
                            <th className="px-6 py-3">Emergency Contact No</th>
                            <th className="px-6 py-3">Relation With Emergency Contact</th>
                            <th className="px-6 py-3">Passport Number</th>
                            <th className="px-6 py-3">Age</th>
                            <th className="px-6 py-3">Maritial Status</th>
                            <th className="px-6 py-3">HR Employee Code</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Approve/Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeTab === 'pending' && (
                            pendingProfileUpdateRequests.length > 0 ? (
                                pendingProfileUpdateRequests.map((obj, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4">{obj.empCode}</td>
                                        <td className="px-6 py-4">{obj.primaryContactNo}</td>
                                        <td className="px-6 py-4">{obj.secondaryContactNo}</td>
                                        <td className="px-6 py-4">{obj.gender}</td>
                                        <td className="px-6 py-4">{obj.bloodGroup}</td>
                                        <td className="px-6 py-4">{obj.emergencyContactNo}</td>
                                        <td className="px-6 py-4">{obj.relationWithEmergencyContact}</td>
                                        <td className="px-6 py-4">{obj.passportNumber}</td>
                                        <td className="px-6 py-4">{obj.age}</td>
                                        <td className="px-6 py-4">{obj.maritialStatus}</td>
                                        <td className="px-6 py-4">{obj.hrEmpCode}</td>
                                        <td className="px-6 py-4">{obj.status}</td>
                                        {obj.status === 'PENDING' ? (
                                            <td className="px-6 py-4 flex gap-2">
                                                <button
                                                    onClick={() => handleApproveReject(obj.id, 'APPROVED')}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleApproveReject(obj.id, 'REJECTED')}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        ) : <td className={`px-6 py-4 font-semibold ${obj.status === 'APPROVED' ? 'text-green-600' :
                                            obj.status === 'REJECTED' ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                            {obj.status}
                                        </td>
                                        }
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" className="px-6 py-4 text-center text-gray-500">
                                        No pending profile update requests.
                                    </td>
                                </tr>
                            )
                        )}
                        {activeTab === 'approved' && (
                            approvedProfileUpdateRequests.length > 0 ? (
                                approvedProfileUpdateRequests.map((obj, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4">{obj.empCode}</td>
                                        <td className="px-6 py-4">{obj.primaryContactNo}</td>
                                        <td className="px-6 py-4">{obj.secondaryContactNo}</td>
                                        <td className="px-6 py-4">{obj.gender}</td>
                                        <td className="px-6 py-4">{obj.bloodGroup}</td>
                                        <td className="px-6 py-4">{obj.emergencyContactNo}</td>
                                        <td className="px-6 py-4">{obj.relationWithEmergencyContact}</td>
                                        <td className="px-6 py-4">{obj.passportNumber}</td>
                                        <td className="px-6 py-4">{obj.age}</td>
                                        <td className="px-6 py-4">{obj.maritialStatus}</td>
                                        <td className="px-6 py-4">{obj.hrEmpCode}</td>
                                        <td className="px-6 py-4">{obj.status}</td>
                                        <td className={`px-6 py-4 font-semibold text-green-600`}>Approved</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" className="px-6 py-4 text-center text-gray-500">
                                        No approved profile update requests.
                                    </td>
                                </tr>
                            )
                        )}
                        {activeTab === 'rejected' && (
                            rejectedProfileUpdateRequests.length > 0 ? (
                                rejectedProfileUpdateRequests.map((obj, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4">{obj.empCode}</td>
                                        <td className="px-6 py-4">{obj.primaryContactNo}</td>
                                        <td className="px-6 py-4">{obj.secondaryContactNo}</td>
                                        <td className="px-6 py-4">{obj.gender}</td>
                                        <td className="px-6 py-4">{obj.bloodGroup}</td>
                                        <td className="px-6 py-4">{obj.emergencyContactNo}</td>
                                        <td className="px-6 py-4">{obj.relationWithEmergencyContact}</td>
                                        <td className="px-6 py-4">{obj.passportNumber}</td>
                                        <td className="px-6 py-4">{obj.age}</td>
                                        <td className="px-6 py-4">{obj.maritialStatus}</td>
                                        <td className="px-6 py-4">{obj.hrEmpCode}</td>
                                        <td className="px-6 py-4">{obj.status}</td>
                                        <td className={`px-6 py-4 font-semibold text-red-600`}>Rejected</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" className="px-6 py-4 text-center text-gray-500">
                                        No rejected profile update requests.
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default EmployeeInfoApproval;