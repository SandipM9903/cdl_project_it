import React, { useState, useEffect } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export default function ViewDetails({ onClose }) {
    const { empCode } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedAction, setSelectedAction] = useState('');
    const [showProbationEvaluation, setShowProbationEvaluation] = useState(false);
    const [extendDate, setExtendDate] = useState('');
    const [extendDays, setExtendDays] = useState('');
    const [terminateDate, setTerminateDate] = useState('');
    const [comments, setComments] = useState('');
    const [probationHistory, setProbationHistory] = useState([]);
    const navigate = useNavigate();
    const [probationExists, setProbationExists] = useState(null);

    const [formData, setFormData] = useState({
        empCode: '',
        actualProbationEndDate: '',
        status: '',
        managerEmpCode: '',
        hrEmpCode: '',
        totalNumberExtended: 0,
        extendedDate: '',
        probationDays: null,
        currentProbationEndDate: '',
        r1ApprovalStatus: '',
        hrStatus: '',
        comments: '',
        extendedDate: "",
        currentProbationEndDate: "",
        probationEvaluationId: null,
        probationEvaluationSixMonthsId: null
    });

    const handleExtendDateChange = (e) => {
        const date = e.target.value;
        setExtendDate(date);
        console.log('Selected Extend Date:', date);

        const today = new Date();
        const selectedDate = new Date(date);
        const timeDiff = selectedDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        setExtendDays(daysDiff);
        setFormData((prev) => ({
            ...prev,
            extendedDate: date,
            currentProbationEndDate: date
        }));
    };

    const handleExtendDaysChange = (e) => {
        const days = parseInt(e.target.value, 10);
        setExtendDays(e.target.value);

        if (!isNaN(days)) {
            const today = new Date();
            const futureDate = new Date(today.setDate(today.getDate() + days));
            const isoDate = futureDate.toISOString().split("T")[0];
            setExtendDate(isoDate);

            setFormData((prev) => ({
                ...prev,
                extendedDate: isoDate,
                currentProbationEndDate: isoDate
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formatToISO = (dateStr) => {
            if (!dateStr || dateStr === 'N/A') return null;
            if (dateStr.includes('/')) {
                const parts = dateStr.split('/');
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
            return dateStr;
        };

        if (!employee?.empCode) {
            alert("⚠️ Employee code is missing.");
            return;
        }

        try {
            const evalResponse = await axios.get(`http://localhost:8080/api/probation/probation-evaluation/latest/${employee.empCode}`);
            const latestEvaluation = evalResponse.data;

            const evalSixResponse = await axios.get(`http://localhost:8080/api/probation/probation-evaluation-six/latest/${employee.empCode}`);
            const latestEvaluationSix = evalSixResponse.data;

            const latestEvaluationId = latestEvaluation?.id || null;
            const latestEvaluationSixId = latestEvaluationSix?.id || null;

            if (!latestEvaluationId) {
                alert("⚠️ Probation evaluation ID not available. Please make sure evaluations are filled.");
                return;
            }
            const payload = {
                ...formData,
                totalNumberExtended: Number(formData.totalNumberExtended),
                probationDays: formData.probationDays ? Number(formData.probationDays) : null,
                probationEvaluationId: latestEvaluationId,
                probationEvaluationSixMonthsId: latestEvaluationSixId,
                actualProbationEndDate: formatToISO(formData.actualProbationEndDate),
                currentProbationEndDate: formatToISO(formData.currentProbationEndDate),
                extendedDate: formatToISO(formData.extendedDate),
            };
            console.log('📋 Form Data:', payload.currentProbationEndDate);
            console.log('🚀 Sending Payload:', payload);
            const response = await axios.post('http://localhost:8080/api/probation/probation-record', payload);
            console.log('✅ Successfully submitted:', response.data);
            alert('Probation record created successfully!');
        } catch (error) {
            console.error('❌ Error submitting probation record:', error.response || error.message || error);
            alert('Something went wrong! See console for details.');
        }
    };
    useEffect(() => {
        const setupFormForTermination = async () => {
            if (selectedAction === 'terminate' && employee?.empCode && terminateDate) {
                try {
                    const res = await axios.get(`http://localhost:8080/api/probation/${employee.empCode}`);
                    const probationEvaluationId = res.data?.id || null;

                    setFormData((prev) => ({
                        ...prev,
                        empCode: employee.empCode,
                        actualProbationEndDate: employee.actualProbationEndDate,
                        status: 'Terminated',
                        managerEmpCode: 'EMP200',
                        hrEmpCode: null,
                        totalNumberExtended: parseInt(employee.probationExtendedNoOfTimes || 0),
                        probationDays: employee.probationDays ? parseInt(employee.probationDays) : null,
                        currentProbationEndDate: terminateDate,
                        r1ApprovalStatus: 'Approved',
                        hrStatus: 'Pending',
                        comments: comments,
                        probationEvaluationId: employee.probationEvaluationId || null,
                        probationEvaluationSixMonthsId: employee.probationEvaluationSixMonthsId || null
                    }));
                } catch (err) {
                    console.error('Error fetching probationEvaluationId for termination:', err);
                    alert('Failed to fetch evaluation ID for termination.');
                }
            }
        };

        setupFormForTermination();
    }, [selectedAction, employee, terminateDate, comments]);

    useEffect(() => {
        const setupFormForExtension = async () => {
            if (selectedAction === 'extend' && employee?.empCode) {
                try {
                    const res = await axios.get(`http://localhost:8080/api/probation/${employee.empCode}`);
                    const probationEvaluationId = res.data?.id || null;

                    setFormData((prev) => ({
                        ...prev,
                        empCode: employee.empCode,
                        actualProbationEndDate: employee.actualProbationEndDate,
                        status: 'Extended Probation',
                        managerEmpCode: 'EMP200',
                        hrEmpCode: null,
                        totalNumberExtended: parseInt(employee.probationExtendedNoOfTimes || 0),
                        probationDays: extendDays ? parseInt(extendDays) : null,
                        currentProbationEndDate: extendDate || '',
                        r1ApprovalStatus: 'Approved',
                        hrStatus: 'Pending',
                        probationEvaluationId: employee.probationEvaluationId || null,
                        probationEvaluationSixMonthsId: employee.probationEvaluationSixMonthsId || null
                    }));

                } catch (err) {
                    console.error('Error fetching probationEvaluationId for extension:', err);
                    alert('Failed to fetch evaluation ID for probation extension.');
                }
            }
        };

        setupFormForExtension();
    }, [selectedAction, employee, extendDate, extendDays]);

    useEffect(() => {
        if (!employee?.empCode) return;

        axios.get(`http://localhost:8080/api/probation/exists/${employee.empCode}`)
            .then(res => setProbationExists(res.data))
            .catch(err => {
                console.error(err);
                setProbationExists(false);
            });
    }, [employee?.empCode]);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                console.log('Fetching employee details for empCode:', empCode);
                const response = await fetch(`http://localhost:8080/api/probation/employees/${empCode}/details`);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                let data = await response.json();
                let actualProbationEndDate = 'N/A';
                if (data.dateOfJoining && typeof data.probationDay === 'number') {
                    const joinDate = new Date(data.dateOfJoining);
                    const probationEndDate = new Date(joinDate);
                    probationEndDate.setDate(joinDate.getDate() + data.probationDay);
                    actualProbationEndDate = formatDate(probationEndDate);
                }

                const currentProbationEndDate = actualProbationEndDate;
                let dueForConfirmationDays = '0';

                if (currentProbationEndDate !== 'N/A') {
                    const parts = currentProbationEndDate.split('/');
                    if (parts.length === 3) {
                        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                        const today = new Date();
                        const endDate = new Date(formattedDate);

                        today.setHours(0, 0, 0, 0);
                        endDate.setHours(0, 0, 0, 0);

                        const diffTime = today.getTime() - endDate.getTime();
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                        dueForConfirmationDays = diffDays > 0 ? diffDays.toString() : '0';
                    }
                }


                const transformedEmployee = {
                    id: data.empCode,
                    profilePic: data.profilePicUrl || 'https://placehold.co/48x48/aabbcc/ffffff?text=EMP',
                    name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
                    empCode: data.empCode,
                    email: data.emailId,
                    role: data.roles,
                    phoneNumber: data.primaryContactNo,
                    rsManager: data.reportingManager,
                    dateOfJoining: formatDate(data.dateOfJoining),
                    probationDays: data.probationDay ? `${data.probationDay} Days` : 'N/A',
                    department: data.department || 'N/A',
                    r1ApprovalStatus: data.r1ApprovalStatus || 'Pending',
                    hrStatus: data.hrStatus || 'Pending',
                    probationExtendedNoOfTimes: data.probationExtendedNoOfTimes !== undefined ? data.probationExtendedNoOfTimes : '0',
                    confirmationOverdueDays: data.confirmationOverdueDays !== undefined ? data.confirmationOverdueDays : '0',
                    actualProbationEndDate: actualProbationEndDate,
                    currentProbationEndDate: currentProbationEndDate,
                    dueForConfirmationDays: dueForConfirmationDays.toString(),
                    status: data.employeeStatus,
                    projectCostCenter: data.projectCostCenter || 'N/A',
                    location: data.location || 'N/A',
                };

                try {
                    const probationRecordResponse = await axios.get(`http://localhost:8080/api/probation/probation-record/${empCode}`);
                    const probationRecord = probationRecordResponse.data;

                    if (probationRecord?.probationEvaluationId) {
                        transformedEmployee.probationEvaluationId = probationRecord.probationEvaluationId;
                    }
                    if (probationRecord?.probationEvaluationSixMonthsId) {
                        transformedEmployee.probationEvaluationSixMonthsId = probationRecord.probationEvaluationSixMonthsId;
                    }

                    if (probationRecord?.status === 'Confirmed') {
                        transformedEmployee.status = 'Confirmed';
                    }

                    if (probationRecord?.status === 'Extended Probation') {
                        transformedEmployee.status = 'Extended Probation';
                        transformedEmployee.probationExtendedNoOfTimes = probationRecord.totalNumberExtended?.toString() || '0';
                        transformedEmployee.currentProbationEndDate = formatDate(probationRecord.currentProbationEndDate);
                        if (probationRecord?.probationDays) {
                            transformedEmployee.probationDays = probationRecord.probationDays;
                            transformedEmployee.probationDaysDisplay = `${probationRecord.probationDays} Days`;
                        }
                        if (probationRecord?.currentProbationEndDate) {
                            transformedEmployee.currentProbationEndDate = probationRecord.currentProbationEndDate;
                        }
                    }

                    let dueForConfirmationDays = '0';
                    const endDateRaw = probationRecord?.currentProbationEndDate;

                    if (endDateRaw) {
                        let formattedDate;

                        if (endDateRaw.includes('/')) {
                            const parts = endDateRaw.split('/');
                            if (parts.length === 3) {
                                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                            }
                        } else {
                            formattedDate = endDateRaw;
                        }

                        const today = new Date();
                        const endDate = new Date(formattedDate);
                        today.setHours(0, 0, 0, 0);
                        endDate.setHours(0, 0, 0, 0);

                        const diffTime = today.getTime() - endDate.getTime();
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        dueForConfirmationDays = diffDays > 0 ? diffDays.toString() : '0';
                    }

                    transformedEmployee.dueForConfirmationDays = dueForConfirmationDays;

                } catch (probationErr) {
                    if (probationErr.response?.status === 404) {
                        console.warn('No probation record found for this employee.');
                    } else {
                        console.warn('Failed to fetch probation record:', probationErr.message);
                    }
                }
                console.log('Transformed Employee Data (ready for state):', transformedEmployee);
                setEmployee(transformedEmployee);
            } catch (error) {
                console.error("Error fetching employee details:", error);
                setError(`Failed to load employee details. Please ensure your Spring Boot API is running. Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (empCode) {
            fetchEmployeeDetails();
        } else {
            console.warn("empCode is not available, skipping fetch.");
            setLoading(false);
            setError("Employee code not provided in URL.");
        }
    }, [empCode]);

    useEffect(() => {
        const fetchEvaluationIdAndSetForm = async () => {
            if (selectedAction === 'confirm' && employee?.empCode) {
                try {
                    const res = await axios.get(`http://localhost:8080/api/probation/${employee.empCode}`);
                    const probationEvaluationId = res.data?.id || null;

                    setFormData({
                        empCode: employee.empCode,
                        actualProbationEndDate: employee.actualProbationEndDate,
                        status: 'Confirmed',
                        managerEmpCode: 'EMP200',
                        hrEmpCode: null,
                        totalNumberExtended: 0,
                        probationDays: employee.probationDays ? parseInt(employee.probationDays) : null,
                        currentProbationEndDate: employee.currentProbationEndDate,
                        r1ApprovalStatus: 'Approved',
                        hrStatus: 'Pending',
                        probationEvaluationId: employee.probationEvaluationId || null,                 // ✅ 3-month
                        probationEvaluationSixMonthsId: employee.probationEvaluationSixMonthsId || null // ✅ 6-month
                    });

                } catch (err) {
                    console.error('Error fetching probationEvaluationId:', err);
                    alert('Failed to fetch evaluation ID for confirmation.');
                }
            }
        };

        fetchEvaluationIdAndSetForm();
    }, [selectedAction, employee]);

    useEffect(() => {
        if (employee?.empCode) {
            axios
                .get(`http://localhost:8080/api/probation/probation-record/history/${employee.empCode}`)
                .then((res) => {
                    setProbationHistory(res.data || []);
                })
                .catch((err) => {
                    console.error("❌ Failed to fetch probation history:", err);
                    setProbationHistory([]);
                });
        }
    }, [employee?.empCode]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="text-white text-xl">Loading employee details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl text-red-600">
                    {error}
                    <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Close</button>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl text-gray-800">
                    No employee data found for code: {empCode}.
                    <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Close</button>
                </div>
            </div>
        );
    }

    const profileInitial = employee.name ? employee.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'NA';

    const handleActionChange = (event) => {
        setSelectedAction(event.target.value);
        setExtendDate('');
        setExtendDays('');
        setTerminateDate('');
        setComments('');
    };

    const handleFill = () => {
        setShowProbationEvaluation(true);
        navigate(`/probation-evaluation/${employee.empCode}`);

    };

    return (
        <>
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-1 font-inter">
                <div className="bg-white shadow-xl max-w-8xl w-full max-h-[98vh] min-h-[90vh] overflow-y-auto relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-red-500 transition duration-200"
                        aria-label="Close"
                    >
                        <IoIosCloseCircleOutline className="w-6 h-6" />
                    </button>
                    <br />
                    <br />
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl mx-auto border border-[#978d8d]">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 text-sm">
                                        <div className="flex flex-col items-center sm:items-start lg:col-span-1">
                                            <div className="relative mb-4">
                                                <img
                                                    src={employee.profilePic || `https://placehold.co/100x100/E0F2F7/000000?text=${profileInitial}`}
                                                    alt={employee.name}
                                                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://placehold.co/100x100/E0F2F7/000000?text=${profileInitial}`;
                                                    }}
                                                />
                                                <span className="absolute bottom-1 right-1 block h-4 w-4 rounded-full ring-2 ring-white bg-green-400"></span>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800 text-center sm:text-left">{employee.name}</h2>
                                            <p className="text-sm text-gray-600 text-center sm:text-left">{employee.role}</p>
                                        </div>

                                        <div className="lg:col-span-1">
                                            <div>
                                                <p className="text-gray-500">Employee ID</p>
                                                <p className="font-medium text-gray-800">{employee.id}</p>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-gray-500">Department</p>
                                                <p className="font-medium text-blue-600">{employee.department}</p>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-gray-500">Joining Date</p>
                                                <p className="font-medium text-gray-800">{employee.dateOfJoining}</p>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-1">
                                            <div>
                                                <p className="text-gray-500">Contact No</p>
                                                <p className="font-medium text-gray-800">{employee.phoneNumber}</p>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-gray-500">R1 Manager</p>
                                                <p className="font-medium text-blue-600">{employee.rsManager}</p>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-gray-500">Project / Cost Centre</p>
                                                <p className="font-medium text-blue-600">{employee.projectCostCenter}</p>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-1">
                                            <div>
                                                <p className="text-gray-500">Email</p>
                                                <p className="font-medium text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis">{employee.email}</p>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-gray-500">Location</p>
                                                <p className="font-medium text-gray-800">{employee.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white  shadow-md p-6 border border-[#978d8d]">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Probation Days</span>
                                            <span className="font-medium text-gray-800">{employee.probationDays}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Status</span>
                                            <span className="font-medium text-gray-800">{employee.status}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Probation Extended (No of Times)</span>
                                            <span className="font-medium text-gray-800">{employee.probationExtendedNoOfTimes}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Actual Probation End Date</span>
                                            <span className="font-medium text-gray-800">{employee.actualProbationEndDate}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Current Probation End Date</span>
                                            <span className="font-medium text-gray-800">{employee.currentProbationEndDate}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">Due for confirmation (Days)</span>
                                            <span className="font-medium text-gray-800">{employee.dueForConfirmationDays}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white shadow-md p-6 flex flex-col md:flex-row items-center justify-between border border-[#978d8d]">
                                    <div className="flex items-center mb-4 md:mb-0">
                                        <span className="text-gray-800 font-medium mr-1">Probation Evaluation and confirmation form</span>
                                        <span className="text-red-500 text-lg">*</span>
                                    </div>
                                    <button className="px-6 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200" onClick={handleFill}>
                                        View & Fill
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="action"
                                                value="confirm"
                                                checked={selectedAction === 'confirm'}
                                                onChange={handleActionChange}
                                                className="form-radio h-4 w-4 text-blue-600 transition-colors duration-200"
                                            />
                                            <span className="ml-2 text-gray-700">Confirm</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="action"
                                                value="extend"
                                                checked={selectedAction === 'extend'}
                                                onChange={handleActionChange}
                                                className="form-radio h-4 w-4 text-blue-600 transition-colors duration-200"
                                            />
                                            <span className="ml-2 text-gray-700">Extend Probation</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="action"
                                                value="terminate"
                                                checked={selectedAction === 'terminate'}
                                                onChange={handleActionChange}
                                                className="form-radio h-4 w-4 text-blue-600 transition-colors duration-200"
                                            />
                                            <span className="ml-2 text-gray-700">Terminate Service</span>
                                        </label>
                                    </div>

                                    {selectedAction === 'extend' && (
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <div className="flex items-center justify-between w-full">
                                                <label
                                                    htmlFor="extendDate"
                                                    className="text-gray-700 mr-[100px] whitespace-nowrap"
                                                >
                                                    Extend Date upto
                                                </label>

                                                <div className="flex items-center space-x-2 ml-4">
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            id="extendDate"
                                                            value={extendDate}
                                                            onChange={handleExtendDateChange}
                                                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                                        />

                                                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                            <svg
                                                                className="h-5 w-5 text-gray-400"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </div>

                                                    <span className="text-gray-700">OR</span>

                                                    <input
                                                        type="number"
                                                        id="extendDays"
                                                        placeholder="Days"
                                                        value={extendDays}
                                                        onChange={handleExtendDaysChange}
                                                        className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="comments" className="text-gray-700 block mb-2">Comments</label>
                                                <textarea
                                                    id="comments"
                                                    value={comments}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setComments(value);
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            comments: value
                                                        }));
                                                    }}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                                    rows="3"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {selectedAction === 'terminate' && (
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <label htmlFor="terminateDate" className="text-gray-700 mr-2 whitespace-nowrap">Termination Date</label>
                                                <div className="relative flex-grow">
                                                    <input
                                                        type="date"
                                                        id="terminateDate"
                                                        value={terminateDate}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setTerminateDate(value);

                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                currentProbationEndDate: value
                                                            }));
                                                        }}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                                    />

                                                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="comments" className="text-gray-700 block mb-2">Comments</label>
                                                <textarea
                                                    id="comments"
                                                    value={comments}
                                                    onChange={(e) => setComments(e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                                    rows="3"
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md flex items-start mt-4">
                                        <svg className="h-5 w-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.542 2.503-1.542 3.268 0l7.556 15.113c.754 1.508-.242 3.237-1.806 3.237H2.492c-1.564 0-2.56-1.729-1.806-3.237L8.257 3.099zM10 11a1 1 0 100-2 1 1 0 000 2zm-1 4a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm">
                                            <span className="font-semibold">Note:</span> Fill the Probation Evaluation confirmation form to submit
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-center md:justify-end space-x-4 mt-6">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="px-8 py-3 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button onClick={handleSubmit} className="px-8 py-3 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-200">
                                        Submit
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 border border-[#978d8d]">
                                <h3 className="text-lg font-semibold text-gray-800 mb-6">Timeline</h3>

                                <div className="flex items-start mb-6">
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-700 font-bold rounded-full flex items-center justify-center text-sm mr-3">
                                        {"Anitha Singh".split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Accepted</p>
                                        <p className="text-sm text-gray-600">With Anitha Singh</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                        rows="3"
                                        placeholder="Add your comment here ......."
                                    ></textarea>
                                </div>

                                <div className="space-y-6">
                                    {probationHistory
                                        .sort((a, b) => b.totalNumberExtended - a.totalNumberExtended)
                                        .map((record, index) => {
                                            const probationEvaluationId = record.probationEvaluation?.id;
                                            const probationEvaluationSixId = record.probationEvaluationSixMonths?.id;

                                            return (
                                                <div key={index} className="flex items-start mb-6">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center text-sm mr-3">
                                                        {record.employee.reportingManager
                                                            ? record.employee.reportingManager
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .toUpperCase()
                                                            : "NA"}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-semibold text-gray-800">
                                                            Probation Extension {record.totalNumberExtended}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            With {record.employee.reportingManager}
                                                        </p>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-xs text-gray-500">
                                                                {formatDate(record.currentProbationEndDate)} {record.probationDays} Days
                                                            </span>

                                                            <button
                                                                className="px-3 py-1 text-blue-600 border border-blue-500 rounded-md text-xs hover:bg-blue-50 transition-colors duration-200"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/view-feedback/${record.employee.empCode}/${record.totalNumberExtended}/${probationEvaluationId}/${probationEvaluationSixId}`
                                                                    )
                                                                }
                                                            >
                                                                View Feedback {record.totalNumberExtended}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}