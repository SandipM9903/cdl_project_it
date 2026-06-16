// import config from "./Config";
import config from "./Config"
// import { createAxiosInstance } from "./common-utility-components/http-form";

import { createAxiosInstance }  from "./http-form"
 
const appClientLogin = createAxiosInstance(
    `${config.loginUrl}`
);

const appClientProfileCards = createAxiosInstance(
    `${config.profileCardsUrl}`
);

const appClientEmpSepartion = createAxiosInstance(
    `${config.empSeparationUrl}`
);

const appClientAnnouncement = createAxiosInstance(
    `${config.announcementUrl}`
);


const getAllDependentsById = async (empCode) => {
    try {
        const response = await appClientProfileCards.get(`/getDependents/${empCode}`);
        return response;
    } catch (error) {
        console.error("Error during fetching: ", error);
        throw error;
    };
}

const getAllEducationDetailsByEmp = async (empCode) => {
    try {
        const response = await appClientProfileCards.get(`/getQualificationDetails/${empCode}`);
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};

const getQualificationFile = async (rowId) => {
    try {
        const response = await appClientProfileCards.get(`/downloadEdu?id=${rowId}`, { responseType: 'arraybuffer' });
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};

const getAllExperienceDetailsByEmp = async (empCode) => {
    try {
        const response = await appClientProfileCards.get(`/getExperienceDetails/${empCode}`);
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};

const getExperienceFile = async (rowId) => {
    try {
        const response = await appClientProfileCards.get(`/downloadExp?id=${rowId}`, { responseType: 'arraybuffer' });
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};

const getSkillDetailsByEmpId = async (empCode) => {
    try {
        const response = await appClientProfileCards.get(`getSkills/${empCode}`);
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};

const getLoginDetailsByEmpIdandDate = async (emp_Id, currentDate) => {
    try {
        const response = await appClientLogin.get(`byempidanddate/${emp_Id}/${currentDate}`);
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};

const saveLogin = async (logInDetails) => {
    try {
        const response = await appClientLogin.post('/checkin', logInDetails);
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};

const saveLogOut = async (emp_Id, logInDetails) => {
    try {
        const response = await appClientLogin.put(`/checkout/${emp_Id}`, logInDetails);
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};
const getAllEmployeeDetails = async () => {
    try {
        const response = await appClientEmpSepartion.get('/getDetails');
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};

const getEmployeeImage = async (empCode) => {
    try {
        const response = await appClientEmpSepartion.get(`/download?empCode=${empCode}`, {
            responseType: 'arraybuffer',
        });
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

// const initiateExit = async (empId, resignData) => {
//     try {
//         const response = await appClientEmpSepartion.post(`/applyResign/${empCode}`, resignData);
//         return response;
//     } catch (error) {
//         console.error("Error during Posting", error);
//         throw error;
//     }
// };

const getSuccessfulMessage = async () => {
    try {
        const response = await appClientEmpSepartion.get('/getmess');
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    }
};

const getAllResignationDetails = async () => {
    try {
        const response = await appClientEmpSepartion.get('/getResignationDetails');
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const getEmployeeById = async (empCode) => {
    try {
        const response = await appClientEmpSepartion.get(`getEmployee/${empCode}`);
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const getReasonDropdown = async () => {
    try {
        const res = await appClientEmpSepartion.get('/getAllDropdown');
        return res;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const getResignationDetailsByEmpId = async (empCode) => {
    try {
        const res = await appClientEmpSepartion.get(`/getResignationData/${empCode}`);
        return res;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const getListOfDropdown = async () => {
    try {
        const res = await appClientAnnouncement.get('/listOfDropdown');
        return res;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const updateAnnouncement = async (id, newAnnouncement) => {
    try {
        const res = await appClientAnnouncement.put(`/updateAnnouncement/${id}`, newAnnouncement);
        return res;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const createAnnouncement = async (newAnnouncement) => {
    try {
        const res = await appClientAnnouncement.post('/addAnnouncement', newAnnouncement);
        return res;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const getListOfFilteredAnnouncements = async () => {
    try {
        const res = appClientAnnouncement.get('/listOfFilteredAnnouncements');
        return res;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const searchAnnouncement = async (search) => {
    try {
        const res = appClientAnnouncement.get(`/searchId/${search}`);
        return res;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const deleteAnnouncement = async (id) => {
    try {
        const res = appClientAnnouncement.delete(`/deleteAnnouncement/${id}`);
        return res;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const getAnnouncerImage = async (empCode) => {
    try {
        const response = await appClientAnnouncement.get(`/download?empCode=${empCode}`, {
            responseType: 'arraybuffer',
        });
        return response;
    } catch (error) {
        console.error("Error during fetching", error);
        throw error;
    };
};

const Service = {
    getAllDependentsById,
    getAllEducationDetailsByEmp,
    getQualificationFile,
    getAllExperienceDetailsByEmp,
    getExperienceFile,
    getSkillDetailsByEmpId,
    getLoginDetailsByEmpIdandDate,
    saveLogin,
    saveLogOut,
    getAllEmployeeDetails,
    getEmployeeImage,  
    getSuccessfulMessage,
    getAllResignationDetails,
    getEmployeeById,
    getReasonDropdown,
    getResignationDetailsByEmpId,
    getListOfDropdown,
    updateAnnouncement,
    createAnnouncement,
    getListOfFilteredAnnouncements,
    searchAnnouncement,
    deleteAnnouncement,
    getAnnouncerImage,

}

export default Service;