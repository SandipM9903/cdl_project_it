import Axios from "./Axios";
import Config from "./Config";

const apiClient = Axios(`${Config.pmsUrl}`);

// // Manager Review

const getBySelfAsmAll = () => {
  const response = apiClient.get("/getBySelfAsmAll");
  return response;
};

const getByProfileById = (empCode) => {
  const response = apiClient.get(`/getByProfile/${empCode}`);
  return response;
};

const getByManagerAsmById = () => {
  const response = apiClient.get("/getByManagerAsm/10");
  return response;
};

const getBySelfAsmById = (empId) => {
  const response = apiClient.get(`/getBySelfAsm/${empId}`);
  return response;
};

const getByDevGoalsById = () => {
  const response = apiClient.get("/getByDevGoals/10");
  return response;
};

// //  Annual Review By Manager

// const postByAnnRevMgr=(data)=>{
//     const response = apiClient.post("/api/postByAnnRev",data);
//     return response;
// }

// const getByAnnualMgrById=()=>{
//     const response = apiClient.get("/api/getByAnnual/10");
//     return response;
// }

// // Annual Review  By Employee

const postByAnnRevEmp = (data) => {
  const response = apiClient.post("/postByAnnRev", data);
  return response;
};

const getByAnnualEmpById = () => {
  const response = apiClient.get("/getByAnnual/10");
  return response;
};

// // self Appraisal

const getSelfAssessmentGetAllUrl = () => {
  const response = apiClient.get("/getBySelfAsmAll");
  return response;
};

const getDevelopmentGoalsByEmpIdUrl = () => {
  const response = apiClient.get("/getByDevGoals/1");
  return response;
};

// const getProfileByEmpIdAllUrl = () => {
//   const response = apiClient.get("/getByProfile/10");
//   return response;
// };

const postDevlopmentGoalsUrl = (data) => {
  const response = apiClient.post("/postDevGoalByEmpId", data);
  return response;
};

const getSelfAssessmentDraftByEmpIdUrl = (empId) => {
  const response = apiClient.get(`/getBySelfAsmDraft/${empId}`);
  return response;
};

const getSelfAssessmentByEmpIdUrl = (empId) => {
  const response = apiClient.get(`/getBySelfAsm/${empId}`);
  return response;
};

const postSelfAssessmentDraft = (data) => {
  const response = apiClient.post("/postBySelfAsmDraft", data);
  return response;
};

const postSelfAssessmentUrl = (data) => {
  const response = apiClient.post("/postBySelfAsm", data);
  return response;
};

// const getDevGoalsByEmpId = () => {
//   const response = apiClient.get("/getByDevGoalByEmpId/1");
//   return response;
// };

// // Manager Screen

// const postByMng=(data)=>{
//     const response = apiClient.post("/api/postByManager",data);
//     return response;
// }

// // Manager Screen 2

// const getByMasterDummyUrl=()=>{
//     const response = apiClient.get("/api/getByMasterDummy/12");
//     return response;
// }

const getProfileByEmpIdAllUrl = () => {
  const response = apiClient.get("/getByProfile/10");
  return response;
};

const postemployeeKraAndDevGoalsWithOverAllRatingAndComments = async (
  empId,
  kragoals
) => {
  try {
    const response = await apiClient.post(
      `/postemployeeKraAndDevGoalsRating/${empId}`,
      kragoals
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const getDefaultGoals = (data) => {
  const response = apiClient.get("/getdefaultgoals", { params: data });
  return response;
};

// //  amulya

const getAllTrainings = async () => {
  try {
    const response = await apiClient.get("/getTrainingOption");
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const getDevelopmentOption = async () => {
  try {
    const response = await apiClient.get("/getDevelopmentOption");
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};
const getdevelopmentGoals = async () => {
  try {
    const response = await apiClient.get("/getdevelopmentGoals");
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const getemployeeKraId = async (empId) => {
  try {
    const response = await apiClient.get(`/getemployeeKraId/${empId}`);
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

// const getDefaultGoals = (data) => {
//   const response = apiClient.get("/getdefaultgoals", { params: data });
//   return response;
// };

const getemployeeDevelopmentOrDraft = async (empId) => {
  try {
    const response = await apiClient.get(
      `/getemployeeDevelopmentOrDraft/${empId}`
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const getemployeeKraDraft = async (empId) => {
  try {
    const response = await apiClient.get(`/getemployeeKraDraft/${empId}`);
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};
const getemployeeKraOrDraft = async (empId) => {
  try {
    const response = await apiClient.get(`/getemployeeKraOrDraft/${empId}`);
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};
const getmess = async () => {
  try {
    const response = await apiClient.get("/getmess");
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};
const getemployeePerformance = async (empId) => {
  try {
    const response = await apiClient.get(`/getemployeePerformance/${empId}`);
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const getPendingAppraisal = async (reviewCycle) => {
  try {
    const response = await apiClient.get(
      `/getPendingAppraisalByReviewCycle/${reviewCycle}`
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

// const getPendingAppraisal = async (empId) => {
//   try {
//     const response = await apiClient.get(`/getPendingAppraisal/${empId}`);
//     return response;
//   } catch (error) {
//     console.error("Error during fetching", error);
//     throw error;
//   }
// };

const getByReviewCycle = async (empId, reviewCycle) => {
  try {
    const response = await apiClient.get(
      `/getByReviewCycle/${empId}/${reviewCycle}`
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const postemployeeKra = async (empId, kragoals) => {
  try {
    const response = await apiClient.post(
      `/postemployeeKra/${empId}`,
      kragoals
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};
// const postemployeeKraDrafts = async (kragoals) => {
//   try {
//     const response = await apiClient.post("/postemployeeKraDrafts", kragoals);
//     return response;
//   } catch (error) {
//     console.error("Error during fetching", error);
//     throw error;
//   }
// };


const postemployeeKraDrafts =async(empId,combinedDraftObject)=>{
  try {
      const response = await apiClient.post(`/postemployeeKraDrafts/${empId}`,combinedDraftObject);
      return response;
  } catch (error) {
      console.error("Error during fetching", error);
      throw error;
  }
}
const postemployeedevelopment = async (selectedGoal) => {
  try {
    const response = await apiClient.post(
      "/postemployeedevelopment",
      selectedGoal
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const postemployeedevelopmentDraft = async (developmentGoals) => {
  try {
    const response = await apiClient.post(
      "/postemployeedevelopmentDraft",
      developmentGoals
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const postemployeePerformance = async (empPerformance) => {
  try {
    const response = await apiClient.post(
      "/postemployeePerformance",
      empPerformance
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};
const postmanagerApproval = async (managerApproval) => {
  try {
    const response = await apiClient.post(
      "/postmanagerApproval",
      managerApproval
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const postmanagerrevertcomments = async (employeeStatusId,requestData) => {
  try {
    const response = await apiClient.post(
      `/postmanagerrevert/${employeeStatusId}`,
      requestData
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const deletedevelopmentdraftbyempid = async (empId) => {
  try {
    const response = await apiClient.delete(
      `/deletedevelopmentdraftbyempid/${empId}`
    );
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const deleteDevelopmentGoal = async (id) => {
  try {
    const response = await apiClient.delete(`/deleteDevelopmentGoal/${id}`);
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const deleteEmployeeKraOrDraft = async (id) => {
  try {
    const response = await apiClient.delete(`/deleteEmployeeKraOrDraft/${id}`);
    return response;
  } catch (error) {
    console.error("Error during fetching", error);
    throw error;
  }
};

const Service = {
  getBySelfAsmAll,
  getByProfileById,
  getByManagerAsmById,
  getBySelfAsmById,
  getByDevGoalsById,
  // postByAnnRevMgr,
  // getByAnnualMgrById,
  getDefaultGoals,
  // getDevGoalsByEmpId,

  postByAnnRevEmp,
  getByAnnualEmpById,
  getSelfAssessmentGetAllUrl,
  getDevelopmentGoalsByEmpIdUrl,
  getProfileByEmpIdAllUrl,
  postDevlopmentGoalsUrl,
  getSelfAssessmentDraftByEmpIdUrl,
  getSelfAssessmentByEmpIdUrl,
  postSelfAssessmentDraft,
  postSelfAssessmentUrl,
  postemployeeKraAndDevGoalsWithOverAllRatingAndComments,

  // postByMng,
  // getByMasterDummyUrl,

  // amulya

  getAllTrainings,
  getDevelopmentOption,
  getdevelopmentGoals,
  getemployeeKraId,
  getemployeeDevelopmentOrDraft,
  getemployeeKraDraft,
  getemployeeKraOrDraft,
  getmess,
  getemployeePerformance,
  getPendingAppraisal,
  postemployeeKra,
  postemployeeKraDrafts,
  postemployeedevelopment,
  postemployeedevelopmentDraft,
  postemployeePerformance,
  postmanagerApproval,
  postmanagerrevertcomments,
  deletedevelopmentdraftbyempid,
  deleteDevelopmentGoal,
  deleteEmployeeKraOrDraft,
  getByReviewCycle,
};

export default Service;





// const getAllTrainings = async()=>{
//   try {
//       const response = await apiClient.get('/getTrainingOption');
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const getmess =async()=>{
//   try {
//       const response = await apiClient.get('/getmess');
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const getemployeePerformance =async(empId)=>{
//   try {
//       const response = await apiClient.get(`/getemployeePerformance/${empId}`);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const getPendingAppraisal =async(reviewCycle)=>{
//   try {
//       const response = await apiClient.get(`/getPendingAppraisalByReviewCycle/${reviewCycle}`);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const getByYearAndReviewCycle = async(empId,year,reviewCycle)=>{
//   try {
//       const response = await apiClient.get(`/getByYearAndReviewCycle/${empId}/${year}/${reviewCycle}`);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const getemployeeKraOrDraftBySubId =async(empId,subId)=>{
//   try {
//       const response = await apiClient.get(`/getemployeeKraOrDraft/${empId}/${subId}`);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const postemployeeKra =async(empId,kragoals)=>{
//   try {
//       const response = await apiClient.post(`/postemployeeKra/${empId}`,kragoals);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const postemployeeKraDrafts =async(empId,combinedDraftObject)=>{
//   try {
//       const response = await apiClient.post(`/postemployeeKraDrafts/${empId}`,combinedDraftObject);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const postemployeePerformance =async(empPerformance)=>{
//   try {
//       const response = await apiClient.post('/postemployeePerformance',empPerformance);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const postmanagerApproval =async(approvedOn)=>{
//   try {
//       const response = await apiClient.post('/postmanagerApproval',approvedOn);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const postmanagerrevertcomments =async(requestData)=>{
//   try {
//       const response = await apiClient.post('/postmanagerrevertcomments',requestData);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const deletedevelopmentdraftbyempid =async(empId)=>{
//   try {
//       const response = await apiClient.delete(`/deletedevelopmentdraftbyempid/${empId}`);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const deleteDevelopmentGoal =async(id)=>{
//   try {
//       const response = await apiClient.delete(`/deleteDevelopmentGoal/${id}`);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const deleteEmployeeKraOrDraft =async(goalDraftId)=>{
//   try {
//       const response = await apiClient.delete(`deleteEmployeeKraOrDraft/${goalDraftId}`);
//       return response;
//   } catch (error) {
//       console.error("Error during fetching", error);
//       throw error;
//   }
// }
// const Service = {
//   getBySelfAsmAll,
//    getByProfileById,
//   getByManagerAsmById,
//   getBySelfAsmById,
//   getByDevGoalsById,
//   getDevGoalsByEmpId,
//   postByAnnRevEmp,
//   getByAnnualEmpById,
//   getSelfAssessmentGetAllUrl,
//   getDevelopmentGoalsByEmpIdUrl,
//   getProfileByEmpIdAllUrl,
//   postDevlopmentGoalsUrl,
//   getSelfAssessmentDraftByEmpIdUrl,
//   getSelfAssessmentByEmpIdUrl,
//   postSelfAssessmentDraft,
//   postSelfAssessmentUrl,
//   postByMng,
//   getByMasterDummyUrl,
//   // amulya
//   getAllTrainings,
//   getmess,
//   getemployeePerformance,
//   getPendingAppraisal,
//   postemployeeKra,
//   postemployeeKraDrafts,
//   postemployeePerformance,
//   postmanagerApproval,
//   postmanagerrevertcomments,
//   deletedevelopmentdraftbyempid,
//   deleteDevelopmentGoal,
//   deleteEmployeeKraOrDraft,
//   getByYearAndReviewCycle,
//   getemployeeKraOrDraftBySubId,
// };









// ccc











