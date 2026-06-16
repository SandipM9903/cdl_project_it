import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink, Outlet } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { useSearch } from "../context/SearchContext";
import axios from "axios";
import Header from "../../components/Header";
import { BASE_URL } from "../../config/Config";
import { useSort } from "../context/SortContext";
import SortDropdown from "./SortDropdown";
import DateFilterComponent from "./DateFilterComponent";

function Helpdesk() {
    const helpTeamMemberURL = `${BASE_URL}:9035/help-team-member`;

    const [isHelpTeamMember, setIsHelpTeamMember] = useState(false);
    const [isHelpTeamManager, setIsHelpTeamManager] = useState(false);
    const [isPermittedMember, setIsPermittedMember] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { searchInput, setSearchInput } = useSearch();
    const { sortOrder, setSortOrder } = useSort();
    const emp =
    {
        empCode: localStorage.getItem('empId'),
        emailId: localStorage.getItem('email'),
        roles: sessionStorage.getItem("role"),
    }

    const showSearchBar = location.pathname.includes("assigned-tickets") || location.pathname.includes("my-tickets") || location.pathname.includes("team-tickets");
    const showDateFilter = location.pathname.includes("assigned-tickets") || location.pathname.includes("my-tickets") || location.pathname.includes("team-tickets");

    useEffect(() => {
        if (location.pathname === '/help-desk') {
            navigate('create-request');
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        if (emp.empCode) {
            fetchHelpTeamMember();
        }
    }, [emp.empCode]);

    const fetchHelpTeamMember = () => {
        axios.get(`${helpTeamMemberURL}/${emp.empCode}`).then((response) => {
            const result = response.data;
            setIsHelpTeamMember(result.isHelpTeamMember);
            setIsHelpTeamManager(result.isManagerOfHelpTeam);
            setIsPermittedMember(result.isPermittedMember);
        }).catch((error) => {
            console.error("Error fetching help team member:", error);
        });
    }

    return (
        <><Header />
            <div className="w-[90%] mx-auto min-h-[calc(100vh-64px)]  ">
                <nav className="bg-red-600 text-white px-6 h-14 rounded-lg shadow-lg flex justify-between items-center mt-20">
                    <h1 className="text-2xl font-extrabold tracking-wide font-header ">Help Desk</h1>
                    <div className="flex space-x-6 text-sm sm:text-base font-medium ">
                        <NavLink
                            to="create-request"
                            className={({ isActive }) =>
                                isActive ? 'underline text-yellow-300 font-header' : 'hover:underline font-header'
                            }
                        >
                            Create Ticket
                        </NavLink>
                        <NavLink
                            to="dashboard"
                            className={({ isActive }) =>
                                isActive ? 'underline text-yellow-300 font-header' : 'hover:underline font-header'
                            }
                        >
                            Dashboard
                        </NavLink>
                        {isHelpTeamMember &&
                            <NavLink
                                to="assigned-tickets"
                                className={({ isActive }) =>
                                    isActive ? 'underline text-yellow-300 font-header' : 'hover:underline font-header'
                                }
                            >
                                Assigned to Me
                            </NavLink>
                        }
                        {(isHelpTeamManager || isPermittedMember) &&
                            <NavLink
                                to="team-tickets"
                                className={({ isActive }) =>
                                    isActive ? 'underline text-yellow-300 font-header' : 'hover:underline font-header'
                                }
                            >
                                My Team Tickets
                            </NavLink>
                        }
                        <NavLink
                            to="my-tickets"
                            className={({ isActive }) =>
                                isActive ? 'underline text-yellow-300 font-header' : 'hover:underline font-header'
                            }
                        >
                            My Tickets
                        </NavLink>
                        {(isHelpTeamManager || isPermittedMember) &&
                            <NavLink
                                to="report"
                                className={({ isActive }) =>
                                    isActive ? 'underline text-yellow-300 font-header' : 'hover:underline font-header'
                                }
                            >
                                Helpdesk Report
                            </NavLink>
                        }
                    </div>
                </nav>

                <div className="mt-6">
                    <div className="flex justify-between items-center gap-4 w-full sm:w-auto">
                        {showSearchBar && (
                            <>
                                <div className="flex-1 flex items-center mr-auto">
                                    <div className="relative w-full sm:w-[300px] ml-4">
                                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                                            <FaSearch />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Search by Ticket ID"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 font-content"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-auto">
                                    {showDateFilter && <DateFilterComponent />}
                                    <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className={`p-6 ${showSearchBar ? 'pt-20' : 'pt-5'}`}>
                    <Outlet />
                </div>
            </div ></>
    );
}

export default Helpdesk;