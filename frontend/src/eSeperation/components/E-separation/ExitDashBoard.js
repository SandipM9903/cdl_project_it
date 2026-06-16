import React from 'react';
import { useNavigate } from 'react-router-dom';


export const ExitDashBoard = () => {
    
    const navigate = useNavigate();

    const handleClickStatusDisplay = () => {
        navigate('/exitstatus');
        window.location.reload(); // Reload the page
    };

    const handleClickExitForm = () => {
        navigate('/ExitForm');
        window.location.reload(); // Reload the page
    };

    const handleClickPendingRequests = () => {
        navigate('/managerDashboard');
        window.location.reload(); // Reload the page
    };
    const handleClickHRPendingRequests = () => {
        navigate('/hrDashboard');
        window.location.reload(); // Reload the page
    };
    const handleClickAllEmpRequests = () => {
    
        navigate('/allpendingRequests');
        window.location.reload(); // Reload the page
    };
    
    const handleClickLogOut = () => {
        sessionStorage.setItem('UserId', "null");
        sessionStorage.setItem('workflowName', "null");
        navigate('/');
        window.location.reload(); // Reload the page
    };

    return (
        <div className="flex justify-center">
            <div className="flex space-x-4">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickExitForm}>
                    Apply Resignation
                </button>

                {/* <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickStatusDisplay}>
                    Resignation Status
                </button> */}
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickAllEmpRequests}>
                   All Employee Resignation Pending Requests
                </button>

                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickPendingRequests}>
                    Resignation Pending Requests From My Team
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickHRPendingRequests}>
                    ESeperation Requests for Hr
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickLogOut}>
                    Logout
                </button>
            </div>
        </div>
    );
};



export default ExitDashBoard