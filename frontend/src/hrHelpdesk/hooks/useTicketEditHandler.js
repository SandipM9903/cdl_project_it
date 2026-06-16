import { useState } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:9092/tickets';

export function useTicketEditHandler(emp, selectedRole) {
    const [modalOpen, setModalOpen] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [availableHelpMemmbers, setAvailableHelpMemmbers] = useState([]);
    const [assignedEmployee, setAssignedEmployee] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [ticketId, setTicketId] = useState(null);

    const handleRowClick = (row) => {
        if (row.status === "CANCELLED" || row.status === "CLOSED" || row.status === "RESOLVED") {
            setModalOpen(false);
        } else {
            setModalOpen(true);
            setAssignedEmployee(row.assignedToEmpCodeData);
        }

        axios.get(`${baseURL}/view-ticket-history/${emp.empCode}/${row.id}`)
            .then((res) => {
                const sortedHistory = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setHistoryData(sortedHistory);
            }).catch(() => setHistoryData([]));

        axios.get(`${baseURL}/view-comments/${emp.empCode}/${row.id}`)
            .then((response) => {
                const sortedComment = response.data.map(item => ({ ...item, source: 'sortedComment' }))
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                setCommentData(sortedComment);
            }).catch(() => setCommentData([]));

        let formData = new FormData();
        formData.append('file', null);

        axios.post(`${baseURL}/available-help-team-members/${emp.empCode}/${selectedRole}`, formData)
            .then((response) => setAvailableHelpMemmbers(response.data))
            .catch(() => {});

        setSelectedRow(row);
        setTicketId(row.id);
    };

    return {
        modalOpen,
        historyData,
        commentData,
        availableHelpMemmbers,
        assignedEmployee,
        selectedRow,
        ticketId,
    };
}
