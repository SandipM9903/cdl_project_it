import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { FaRegCalendarAlt, FaSyncAlt, FaFileExcel } from 'react-icons/fa';
import { getTicketTableColumns } from './ticketTableColumns';
import { toast, ToastContainer } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { BASE_URL } from '../../config/Config';

const severityLevels = [
    { value: '', label: 'Select Severity', icon: '', color: '' },
    { value: 'CRITICAL', label: 'CRITICAL -🚨 Code Red', icon: '🚨', color: 'text-red-700' },
    { value: 'HIGH', label: 'HIGH -🌪️ High Stakes', icon: '🌪️', color: 'text-orange-600' },
    { value: 'MEDIUM', label: 'MEDIUM -🛶 Steady Paddle', icon: '�', color: 'text-yellow-600' },
    { value: 'LOW', label: 'LOW -💤 Chill Zone', icon: '�', color: 'text-blue-500' },
];

function HelpdeskReport() {
    const [filters, setFilters] = useState({
        fyYear: '',
        month: '',
        fromDate: '',
        toDate: '',
        ticketId: '',
        status: '',
        category: '',
        subCategory: '',
        type: '',
        severity: severityLevels[0].value,
        owner: '',
        assignedTo: '',
    });

    const emp =
    {
        empCode: localStorage.getItem('empId'),
        emailId: localStorage.getItem('email'),
        roles: sessionStorage.getItem("role"),
    }
    const selectedRole = emp.roles.includes('CMS Manager') ? 'CMS Manager' : emp.roles.includes('CMS Employee') ? 'CMS Employee' : emp.roles[0];

    const isAnyFilterSet = Object.entries(filters).some(([key, value]) => {
        if (key === 'severity') return value !== severityLevels[0].value && value !== '';
        return value !== '';
    });
    const handleExportExcel = () => {
        if (!reportRows.length) {
            toast.info('No data to export');
            return;
        }
        const getColHeader = (col) => {
            if (typeof col.name === 'string') return col.name;
            if (col.name && col.name.props && col.name.props.children) {
                if (Array.isArray(col.name.props.children)) {
                    return col.name.props.children.map(child => typeof child === 'string' ? child : '').join(' ').replace(/<br\s*\/>/gi, ' ');
                }
                return typeof col.name.props.children === 'string' ? col.name.props.children : '';
            }
            return '';
        };

        const data = reportRows.map(row => {
            const obj = {};
            columns.forEach(col => {
                if (typeof col.selector === 'function') {
                    obj[getColHeader(col)] = col.selector(row);
                }
            });
            return obj;
        });
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        // Export
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'HelpdeskReport.xlsx');
    };

    const handleOpen = (row) => {
        toast.info('View not allowed in report table');
    };
    const editTicket = (row) => {
        toast.info('Edit not allowed in report table');
    };
    const handleDelete = (ticketId) => {
        toast.info('Delete not allowed in report table');
    };

    const [activeTab, setActiveTab] = useState('report');

    const columns = getTicketTableColumns({ handleOpen, editTicket, handleDelete, showEditColumn: false, activeTab: activeTab });
    const newStyle = {
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "15px",
                color: "#424242",
                height: "40px",
                width: "100px",
            },
        },
        cells: {
            style: {
                fontWeight: "normal",
                fontSize: "14px",
                color: "#424242",
                alignItems: "center",
                width: '100px',
            },
        },
    };
    const baseURL = `${BASE_URL}:9035`;

    const handleReset = () => {
        setFilters({
            fyYear: '',
            month: '',
            fromDate: '',
            toDate: '',
            ticketId: '',
            status: '',
            category: '',
            subCategory: '',
            type: '',
            severity: severityLevels[0].value,
            owner: '',
            assignedTo: '',
        });
        setReportRows([]);
    };


    const [reportRows, setReportRows] = useState([]);


    const handleSearch = async () => {
        try {
            const response = await axios.post(
                `${baseURL}/tickets/generate/report/${emp.empCode}`,
                filters
            );

            if (response.data && response.data.length > 0) {
                const sortedData = response.data.sort((a, b) => a.id - b.id);
                setReportRows(sortedData);
            } else {

                toast.info(response.data?.message || "No records found.");
                setReportRows([]);
            }
        } catch (error) {
            console.error('Report API error:', error);


            const backendMsg = error.response?.data?.message;
            toast.error(backendMsg || "Something went wrong while fetching the report.");
        }
    };


    const isYearOrMonthSelected = filters.fyYear !== '' || filters.month !== '';
    const isDateRangeSelected = filters.fromDate !== '' || filters.toDate !== '';

    const isAnyOtherFilterSelected = Object.entries(filters)
        .filter(([key]) => key !== 'ticketId')
        .some(([, value]) => value !== '' && value !== severityLevels[0].value);
    const [categories, setCategories] = useState([]);
    const [assignTo, setAssignTo] = useState([]);
    const [ticketOwners, setTicketOwners] = useState([]);


    useEffect(() => {
        axios.get(`${baseURL}/help-team-member/catg/info/${emp.empCode}`)
            .then((response) => {
                const data = response.data;
                if (data) {
                    setAssignTo(data.assignTo || []);
                    setCategories((data.categories || []).map(item => item.categoryResDTO));
                    setTicketOwners(data.categories || []);
                } else {
                    setAssignTo([]);
                    setCategories([]);
                    setTicketOwners([]);
                }
            })
            .catch(() => {
                setAssignTo([]);
                setCategories([]);
                setTicketOwners([]);
            });
    }, [emp.empCode]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={1000} newestOnTop style={{ zIndex: 9999 }} />

            <div className="w-[100%] mx-auto mt-4" style={{ zIndex: 1 }}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-extrabold tracking-wider text-black drop-shadow-md font-serif uppercase letter-spacing-wider font-header">Helpdesk Report</h2>
                </div>
                <div className="flex flex-nowrap gap-4 items-end pb-2 mb-6">
                    <div className="flex flex-col min-w-0 flex-1 basis-0">
                        <label className="text-xs font-semibold mb-1 font-content">From Date</label>
                        <div className="relative flex items-center">
                            <input
                                id="fromDateInput"
                                name="fromDate"
                                type="date"
                                value={filters.fromDate}
                                onChange={handleChange}
                                className="hide-calendar-icon border border-gray-300 rounded-lg px-2 py-1 text-sm w-full pr-10 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black transition-all duration-200 cursor-pointer"
                                placeholder="dd-mm-yyyy"
                                style={{ color: '#111' }}
                                disabled={!!filters.ticketId || isYearOrMonthSelected}
                            />
                            <span
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                                onClick={() => {
                                    const input = document.getElementById('fromDateInput');
                                    if (input && !input.disabled && input.showPicker) input.showPicker();
                                }}
                            >
                                <FaRegCalendarAlt className="text-blue-600 text-base" />
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 basis-0">
                        <label className="text-xs font-semibold mb-1">To Date</label>
                        <div className="relative flex items-center">
                            <input
                                id="toDateInput"
                                name="toDate"
                                type="date"
                                value={filters.toDate}
                                onChange={handleChange}
                                className="hide-calendar-icon border rounded px-2 py-1 text-sm w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                                placeholder="dd-mm-yyyy"
                                style={{ color: '#111' }}
                                disabled={!!filters.ticketId || isYearOrMonthSelected}
                            />
                            <span
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                                onClick={() => {
                                    const input = document.getElementById('toDateInput');
                                    if (input && !input.disabled && input.showPicker) input.showPicker();
                                }}
                            >
                                <FaRegCalendarAlt className="text-blue-600 text-base" />
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 basis-0">
                        <label className="text-xs font-semibold mb-1">Search By ticket ID</label>
                        <input
                            name="ticketId"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={filters.ticketId}
                            onChange={e => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                handleChange({ target: { name: 'ticketId', value } });
                            }}
                            className="border font-content border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                            disabled={isAnyOtherFilterSelected}
                        />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 basis-0 font-content">
                        <label className="text-xs font-semibold mb-1">Ticket Status</label>
                        <select name="status" value={filters.status} onChange={handleChange} className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer" disabled={!!filters.ticketId}>
                            <option value="">Select Status</option>
                            <option value="CREATED">CREATED</option>
                            <option value="OPEN">OPEN</option>
                            <option value="CLOSED">CLOSED</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="INPROGRESS">IN PROGRESS</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 items-end mb-2">
                    <div className="flex flex-col min-w-0 flex-1 basis-[140px] font-content">
                        <label className="text-xs font-semibold mb-1">Select Category</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={e => {
                                handleChange(e);
                                setFilters(prev => ({ ...prev, subCategory: '', owner: '' }));
                            }}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer"
                            disabled={!!filters.ticketId}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.category}>{cat.category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 basis-[140px] font-content">
                        <label className="text-xs font-semibold mb-1">Select Sub-Category</label>
                        <select
                            name="subCategory"
                            value={filters.subCategory}
                            onChange={e => {
                                handleChange(e);
                                setFilters(prev => ({ ...prev, owner: '' }));
                            }}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer"
                            disabled={!filters.category || !!filters.ticketId}
                        >
                            <option value="">Select Sub-Category</option>
                            {filters.category && categories
                                .find(cat => cat.category === filters.category)?.subCategoryResDTOS?.map(sub => (
                                    <option key={sub.id} value={sub.subCategory}>{sub.subCategory}</option>
                                ))}
                        </select>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 basis-[120px] font-content">
                        <label className="text-xs font-semibold mb-1">Type</label>
                        <select name="type" value={filters.type} onChange={handleChange} className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer" disabled={!!filters.ticketId}>
                            <option value="">Select Type</option>
                            <option value="request">Request</option>
                            <option value="support">Support</option>
                            <option value="incident">Incident</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="feedback/suggestion">Feedback / Suggestion</option>
                        </select>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 basis-[140px] font-content">
                        <label className="text-xs font-semibold mb-1">Severity</label>
                        <select name="severity" value={filters.severity} onChange={handleChange} className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer" disabled={!!filters.ticketId}>
                            {severityLevels.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 basis-[140px] font-content">
                        <label className="text-xs font-semibold mb-1">Ticket Owner</label>
                        <select name="owner" value={filters.owner} onChange={handleChange} className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer" disabled={!(filters.category && filters.subCategory) || !!filters.ticketId}>
                            <option value="">Select Owner</option>
                            {filters.category && filters.subCategory && (() => {
                                const catObj = (ticketOwners.find(c => c.categoryResDTO.category === filters.category));
                                if (catObj && catObj.ticketOwner) {
                                    return catObj.ticketOwner
                                        .filter(owner => owner.handledSubCategories.some(subs => subs.includes(filters.subCategory)))
                                        .map(owner => (
                                            <option key={owner.empName} value={owner.empName}>{owner.empName}</option>
                                        ));
                                }
                                return null;
                            })()}
                        </select>
                    </div>
                    {/* Assigned To */}
                    {/* <div className="flex flex-col min-w-0 flex-1 basis-[140px] font-content">
            <label className="text-xs font-semibold mb-1">Assigned To</label>
            <select name="assignedTo" value={filters.assignedTo} onChange={handleChange} className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer" disabled={!!filters.ticketId}>
              <option value="">Select Assignee</option>
              {assignTo.map(member => <option key={member} value={member}>{member}</option>)}
            </select>
          </div> */}
                </div>
                <div className="flex justify-end gap-3 mt-10 font-content">
                    <button
                        className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                        type="button"
                        onClick={handleReset}
                    >
                        <span className="flex items-center gap-1"><FaSyncAlt /> Refresh</span>
                    </button>
                    <button
                        className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        type="button"
                        onClick={handleSearch}
                        disabled={!isAnyFilterSet}
                    >
                        Search
                    </button>
                    <button
                        className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        type="button"
                        onClick={handleExportExcel}
                        disabled={reportRows.length === 0}
                    >
                        <span className="flex items-center gap-1"><FaFileExcel /> Excel</span>
                    </button>
                </div>
            </div>
            <div style={{ marginTop: '40px' }}>
                <div className="mt-8">
                    <DataTable
                        columns={columns}
                        data={reportRows}
                        customStyles={newStyle}
                        highlightOnHover
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 30, 50]}
                    />
                </div>
            </div>
        </>
    );
}

export default HelpdeskReport;