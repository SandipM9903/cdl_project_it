import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTicketRefresh } from '../context/TicketRefreshContext';
import { getTicketTableColumns } from './ticketTableColumns';
import DataTable from 'react-data-table-component';
import { useSearch } from '../context/SearchContext';
import { useDateFilter } from '../context/DateFilterContext';
import { toast, ToastContainer } from 'react-toastify';
import UpdateTicketForm from './UpdateTicketForm';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useSort } from '../context/SortContext';
import { BASE_URL } from '../../config/Config';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

function AssignedTickets() {
    const baseURL = `${BASE_URL}:9035/tickets`;

    const [assignedTickets, setAssignedTickets] = useState([]);
    const [filteredAssignedTickets, setFilteredAssignedTickets] = useState(assignedTickets);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState({});
    const [activeTab, setActiveTab] = useState('assigned');
    const { refreshTrigger } = useTicketRefresh();
    const { searchInput } = useSearch();
    const { fromDate, toDate } = useDateFilter();
    const [isReadOnly, setIsReadOnly] = useState(false);
    const { sortOrder } = useSort();

    const emp =
    {
        empCode: localStorage.getItem('empId'),
        emailId: localStorage.getItem('email'),
        roles: sessionStorage.getItem("role"),
    }
    const selectedRole = emp.roles.includes('CMS Manager') ? 'CMS Manager' : emp.roles.includes('CMS Employee') ? 'CMS Employee' : emp.roles[0];

    useEffect(() => {
        fetchLatestData();
    }, [refreshTrigger]);

    useEffect(() => {
        let filtered = assignedTickets;
        if (searchInput && searchInput.trim() !== "") {
            filtered = filtered.filter(row => row.id.toString().includes(searchInput.trim()));
        }
        if (fromDate) {
            filtered = filtered.filter(row => dayjs(row.createdDate, "DD-MM-YYYY").isSameOrAfter(dayjs(fromDate)));
        }
        if (toDate) {
            filtered = filtered.filter(row => dayjs(row.createdDate, "DD-MM-YYYY").isSameOrBefore(dayjs(toDate)));
        }
        filtered = [...filtered].sort((a, b) => {
            if (sortOrder === "asc") return a.id - b.id;
            else return b.id - a.id;
        });
        setFilteredAssignedTickets(filtered);
    }, [searchInput, assignedTickets, fromDate, toDate, sortOrder]);

    function fetchLatestData() {
        axios.get(`${baseURL}/assigned-tickets/${selectedRole}/${emp.empCode}`)
            .then((response) => {
                setAssignedTickets(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    const handleOpen = (row) => {
        handleRowClick(row);
        setIsReadOnly(true);
    };

    const editTicket = (row) => {
        handleRowClick(row);
    };

    const handleDelete = (ticketId) => {
        Swal.fire({
            icon: 'question',
            title: 'Delete',
            text: 'Are you sure?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${baseURL}/delete-ticket/${ticketId}/${selectedRole}/${emp.empCode}`)
                    .then((response) => {
                        toast.success("Ticket deleted successfully");
                        setTimeout(() => {
                            setAssignedTickets(prevData => prevData.filter(ticket => ticket.id !== ticketId));
                        })
                        axios.get(`${baseURL}/assigned-tickets/${emp.roles}/${emp.empCode}`)
                            .then((response) => {
                                setAssignedTickets(response.data);
                            })
                            .catch((error) => {
                                console.error('Error fetching data:', error);
                            });
                    })
                    .catch((error) => {
                        toast.error("You don't have Authority to do this operation");
                        console.error("Error deleting ticket:", error);
                    });
            }
        })
    };

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

    const handleRowClick = (row) => {
        setCurrentRow({});
        if (row.status === "CANCELLED" || row.status === "CLOSED" || row.status === "RESOLVED") {
            setModalOpen(false);
        }
        else {
            setCurrentRow(row);
            setModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentRow(null);
        fetchLatestData();
        setIsReadOnly(false);
    };

    const columns = getTicketTableColumns({ handleOpen, editTicket, handleDelete, showEditColumn: true, activeTab: activeTab });

    return (
        <div>
            <ToastContainer position="top-right" autoClose={1000} newestOnTop style={{ zIndex: 9999 }} />
            <DataTable columns={columns} data={filteredAssignedTickets} customStyles={newStyle} highlightOnHover pagination paginationPerPage={10} paginationRowsPerPageOptions={[10, 20, 30, 50]} />
            {modalOpen && <UpdateTicketForm
                modalOpen={modalOpen}
                handleCloseModal={handleCloseModal}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                activeTab={activeTab}
                empCode={emp.empCode}
                selectedRole={selectedRole}
                readOnly={isReadOnly}
            />}
        </div>
    )
}

export default AssignedTickets;