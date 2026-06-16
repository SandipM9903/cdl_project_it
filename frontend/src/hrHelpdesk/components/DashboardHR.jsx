import axios from 'axios';
import { useEffect, useState } from 'react';
import StatusCard from './StatusCard';
import 'react-dropdown/style.css';
import { FaPlusCircle, FaFolderOpen, FaSpinner, FaCheckCircle, FaTimesCircle, FaLock } from 'react-icons/fa';
import { useTicketRefresh } from '../context/TicketRefreshContext';
import { BASE_URL } from '../../config/Config';


function DashboardHR() {
    const baseURL = `${BASE_URL}:9035/tickets`;
    const helpTeamMemberURL = `${BASE_URL}:9035/help-team-member`;

    const pastDays = ['Last 30 Days', 'Last 60 Days', 'Last 90 Days'];
    const defaultDays = pastDays[0];

    const [raisedCounts, setRaisedCounts] = useState({});
    const [assignedCounts, setAssignedCounts] = useState({});
    const [raisedTicketDropdown, setRaisedTicketDropdown] = useState(defaultDays);
    const [assignedTicketDropdown, setAssignedTicketDropdown] = useState(defaultDays);
    const [raisedTicketsCount, setRaisedTicketsCount] = useState(0);
    const [assignedTicketsCount, setAssignedTicketsCount] = useState(0);
    const [isHelpTeamMember, setIsHelpTeamMember] = useState(false);

    const { refreshTrigger } = useTicketRefresh();

    const emp =
    {
        empCode: localStorage.getItem('empId'),
        emailId: localStorage.getItem('email'),
        roles: sessionStorage.getItem("role"),
    }
    const selectedRole = emp.roles.includes('CMS Manager') ? 'CMS Manager' : emp.roles.includes('CMS Employee') ? 'CMS Employee' : emp.roles[0];

    useEffect(() => {
        fetchDashboardData();
    }, [raisedTicketDropdown, assignedTicketDropdown, refreshTrigger]);

    useEffect(() => {
        if (emp.empCode) {
            fetchHelpTeamMember();
        }
    }, [emp.empCode]);

    const fetchHelpTeamMember = () => {
        axios.get(`${helpTeamMemberURL}/${emp.empCode}`).then((response) => {
            const result = response.data;
            setIsHelpTeamMember(result);
        }).catch((error) => {
            console.error("Error fetching help team member:", error);
        });
    }

    const fetchDashboardData = () => {
        axios.get(`${baseURL}/dashboard/${emp.empCode}/${selectedRole}`)
            .then((res) => {
                const tickets = res.data;

                const assignedCountsData = {
                    30: tickets[1],
                    60: tickets[2],
                    90: tickets[3],
                };
                const raisedCountsData = {
                    30: tickets[5],
                    60: tickets[6],
                    90: tickets[7],
                };

                const dayKeyR = raisedTicketDropdown.includes('30') ? 30 : raisedTicketDropdown.includes('60') ? 60 : 90;
                const dayKeyA = assignedTicketDropdown.includes('30') ? 30 : assignedTicketDropdown.includes('60') ? 60 : 90;

                setRaisedTicketsCount(tickets[4][`CreatedTickets${dayKeyR}`] || 0);
                setAssignedTicketsCount(tickets[0][`AssignedTickets${dayKeyA}`] || 0);

                setRaisedCounts({
                    Created: raisedCountsData[dayKeyR].CREATED || 0,
                    Open: raisedCountsData[dayKeyR].OPEN || 0,
                    InProgress: raisedCountsData[dayKeyR].INPROGRESS || 0,
                    OnHold: raisedCountsData[dayKeyR].ONHOLD || 0,
                    Resolved: raisedCountsData[dayKeyR].RESOLVED || 0,
                    Cancelled: raisedCountsData[dayKeyR].CANCELLED || 0,
                    Closed: raisedCountsData[dayKeyR].CLOSED || 0
                });

                setAssignedCounts({
                    Created: assignedCountsData[dayKeyA].CREATED || 0,
                    Open: assignedCountsData[dayKeyA].OPEN || 0,
                    InProgress: assignedCountsData[dayKeyA].INPROGRESS || 0,
                    OnHold: assignedCountsData[dayKeyR].ONHOLD || 0,
                    Resolved: assignedCountsData[dayKeyA].RESOLVED || 0,
                    Cancelled: assignedCountsData[dayKeyA].CANCELLED || 0,
                    Closed: assignedCountsData[dayKeyA].CLOSED || 0
                });
            })
            .catch((error) => {
                console.error('Fetching error', error);
            });
    }

    const statusIconMap = {
        Created: { icon: FaPlusCircle, colorClass: 'text-blue-500', countClass: 'text-blue-600' },
        Open: { icon: FaFolderOpen, colorClass: 'text-indigo-500', countClass: 'text-indigo-600' },
        InProgress: { icon: FaSpinner, colorClass: 'text-yellow-500', countClass: 'text-yellow-600' },
        Resolved: { icon: FaCheckCircle, colorClass: 'text-green-500', countClass: 'text-green-600' },
        Cancelled: { icon: FaTimesCircle, colorClass: 'text-red-500', countClass: 'text-red-600' },
        Closed: { icon: FaLock, colorClass: 'text-gray-500', countClass: 'text-gray-600' },
        OnHold: { icon: FaSpinner, colorClass: 'text-gray-500', countClass: 'text-gray-600' }
    };

    const handleRaisedTicketDropdown = (option) => setRaisedTicketDropdown(option.target.value);
    const handleAssignedTicketDropdown = (option) => setAssignedTicketDropdown(option.target.value);

    const sections = [
        {
            title: 'My Tickets',
            data: raisedCounts,
            count: raisedTicketsCount,
            dropdown: raisedTicketDropdown,
            onChange: handleRaisedTicketDropdown,
        },
    ];

    if (isHelpTeamMember) {
        sections.push({
            title: 'Assigned to me',
            data: assignedCounts,
            count: assignedTicketsCount,
            dropdown: assignedTicketDropdown,
            onChange: handleAssignedTicketDropdown,
        });
    }

    return (
        <div className='container mx-auto w-full mb-30'>
            {sections
                .map((section, idx) => {
                    const entries = Object.entries(section.data);
                    const firstRow = entries.slice(0, 4);
                    const secondRow = entries.slice(4, 7);

                    return (
                        <div key={idx} className='w-full mx-auto py-4'>
                            <div className='w-full h-auto shadow-lg rounded-lg bg-gray-0 p-4'>
                                <div className='flex items-center justify-between rounded-lg mb-4'>
                                    <div className='flex flex-col sm:flex-row justify-between w-full items-center'>
                                        <div className='flex items-center gap-4'>
                                            <h1 className='text-lg sm:text-xl text-gray-600 font-semibold tracking-wide font-sans font-header'>{section.title}</h1>
                                            <h3 className='text-indigo-600 font-semibold text-xl font-header'>{section.count}</h3>
                                        </div>
                                        <div className='mt-2 sm:mt-0 sm:ml-auto'>
                                            <div className="relative w-full sm:w-48">
                                                <select
                                                    value={section.dropdown}
                                                    onChange={section.onChange}
                                                    className="appearance-none font-content w-full bg-white border border-gray-300 text-gray-800 text-sm px-4 py-2 pr-8 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
                                                >
                                                    {pastDays.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>

                                                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 text-xs">
                                                    ▼
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 m-10 font-content'>
                                    {firstRow.map(([label, count], idx) => (
                                        <StatusCard
                                            key={idx}
                                            icon={statusIconMap[label].icon}
                                            label={label}
                                            count={count}
                                            colorClass={statusIconMap[label].colorClass}
                                            countClass={statusIconMap[label].countClass}
                                        />
                                    ))}
                                </div>


                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 m-10 font-content'>
                                    {secondRow.map(([label, count], idx) => (
                                        <StatusCard
                                            key={idx}
                                            icon={statusIconMap[label].icon}
                                            label={label}
                                            count={count}
                                            colorClass={statusIconMap[label].colorClass}
                                            countClass={statusIconMap[label].countClass}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

export default DashboardHR;