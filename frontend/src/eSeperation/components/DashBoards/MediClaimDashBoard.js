import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MediClaimDashBoard = () => {

    
   const navigate = useNavigate();

    const handleClickClaimForm = () => {
        navigate('/mediClaimForm');
    };

    const handleClickPendingRequests = () => {
        navigate('/mediClaimRequest');
    };
    
    const handleClickTotalClaimStatus = () =>{
        navigate('/totalclaimstatus');
    }


   
    const handleClickLogOut = () => {
        sessionStorage.setItem('UserId', "null");
        sessionStorage.setItem('workflowName', "null");
        navigate('/');
    };

    return (
        <div className="flex justify-center">
            <div className="flex space-x-4">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickClaimForm}>
                    Apply Claim
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickPendingRequests}>
                    MediClaim Pending Requests
                </button>
                             
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickTotalClaimStatus}>
                    My MediClaim Details
                </button>
                
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClickLogOut}>
                    Logout
                </button>
            </div>
        </div>
    );
};


export default MediClaimDashBoard