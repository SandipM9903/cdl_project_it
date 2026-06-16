import { simpleEncrypt } from "../simpleEncrypt";
import Axios from "./Axios";
import { adminConfig, config } from "./Config";

// Use the imported configurations
console.log(config.ITDeclarationUrl); 
console.log(adminConfig.ITDeclarationAdminUrl);

const apiClient = Axios(`${config.ITDeclarationUrl}`);
const apiAdminClient = Axios(`${adminConfig.ITDeclarationAdminUrl}`);

const postSection80Data = (data) => {
  const response = apiClient.post("/it-declaration-info/add", data);
  return response;
};

const fetchAllSectionName = () => {
  const response = apiClient.get("/it-declaration-master/get-all");
  return response;
};

const fetchITDeclarationInfoBasedOnempCodeAndFinancialYear = (
  empCode,
  financialYear
) => {
  const response = apiClient.get(
    `/it-declaration-info/get/${simpleEncrypt(empCode)}/${financialYear}`
  );
  return response;
};

const fetchITDeclarationSaveStatusInfoBasedOnempCodeAndFinancialYear = (
  empCode,
  financialYear
) => {
  const response = apiClient.get(
    `/it-declaration-info/get-save-status/${simpleEncrypt(empCode)}/${financialYear}`
  );
  return response;
};

const fetchITDeclarationSaveStatusForSection80dInfoBasedOnempCodeAndFinancialYear = (
  empCode,
  financialYear
) => {
  const response = apiClient.get(
    `/it-declaration-info/get-save-status-80d/${simpleEncrypt(empCode)}/${financialYear}`
  );
  return response;
};

const postTotalAmountForSection80c = (empCode, financialYear, data) => {
  const response = apiClient.post(
    `/it-declaration-info/total-amount-80c/${simpleEncrypt(empCode)}/${financialYear}`,
    data
  );
  return response;
};

const postTotalAmountForSection80d = (empCode, financialYear, data) => {
  const response = apiClient.post(
    `/it-declaration-info/total-amount-80d/${simpleEncrypt(empCode)}/${financialYear}`,
    data
  );
  return response;
};

const fetchTotalAmountForSection80c = (empCode, financialYear) => {
  const response = apiClient.get(
    `/it-declaration-info/get-total-amount-80c/${simpleEncrypt(empCode)}/${financialYear}`
  );
  return response;
};

const fetchTotalAmountForSection80d = (empCode, financialYear) => {
  const response = apiClient.get(
    `/it-declaration-info/get-total-amount-80d/${simpleEncrypt(empCode)}/${financialYear}`
  );
  return response;
};

const postITDeclarationSaveStatusInfoBasedOnempCodeAndFinancialYear = (
  empCode,
  financialYear
) => {
  const response = apiClient.post(
    `/it-declaration-info/save-status/${simpleEncrypt(empCode)}/${financialYear}`
  );
  return response;
};

const postITDeclarationSaveStatusForSection80dInfoBasedOnempCodeAndFinancialYear = (
  empCode,
  financialYear
) => {
  const response = apiClient.post(
    `/it-declaration-info/save-status-80d/${simpleEncrypt(empCode)}/${financialYear}`
  );
  return response;
};

const updateBulkProofInvestment = (payload) => {
  return apiClient.put(
    "/proof-of-investment/update-bulk",
    payload
  );
};

// ================================ proof of investment ==========================================

const fetchProofOfInvestmentBasedOnempCodeAndFinancialYear = (
  empCode,
  financialYear
) => {
  const response = apiClient.get(
    `/proof-of-investment/get-all-proof/${simpleEncrypt(empCode)}/${financialYear}`
  );
  return response;
};

const apiClient2 = Axios("http://localhost:9026");

const fetchNewProofOfInvestmentBasedOnempCodeAndFinancialYear = (
  empCode,
  financialYear
) => {
  const response = apiClient.get(
    `/it-declaration-file/getAllFile/${simpleEncrypt(empCode)}/${financialYear}`
  );
  return response;
};

const postProofOfInvestment = (data) => {
  const response = apiClient2.post("/proof-of-investment/add", data);
  return response;
};

const setStatusForProofOfInvestment = (empCode, submitFinancialYear, state) => {
  const response = apiClient.get(
    `/proof-of-investment/set-status-proof/${simpleEncrypt(empCode)}/${submitFinancialYear}/${state}`
  );
  return response;
};

const getStatusForProofOfInvestmentFunction = (
  empCode,
  submitFinancialYear
) => {
  const response = apiClient.get(
    `/proof-of-investment/get-status-proof/${simpleEncrypt(empCode)}/${submitFinancialYear}`
  );
  return response;
};

const setSubmitStatusForProofOfInvestment = (
  empCode,
  submitFinancialYear,
  state
) => {
  const response = apiClient.get(
    `/proof-of-investment/set-submit-status-proof/${simpleEncrypt(empCode)}/${submitFinancialYear}/${state}`
  );
  return response;
};

const getSubmitStatusForProofOfInvestmentFunction = (
  empCode,
  submitFinancialYear
) => {
  const response = apiClient.get(
    `/proof-of-investment/get-submit-status-proof/${simpleEncrypt(empCode)}/${submitFinancialYear}`
  );
  return response;
};

// ======================================= ADMIN ===================================================

const itAdminFetchStatus = (financialYear) => {
  const response = apiAdminClient.get(`/it-admin/getStatus/${financialYear}`);
  return response;
};

const itAdminChangeStatus = (financialYear) => {
  const response = apiAdminClient.get(
    `/it-admin/changeStatus/${financialYear}`
  );
  return response;
};

const postITAdminData = (financialYear, data) => {
  const response = apiAdminClient.post(`/it-admin/add/${financialYear}`, data);
  return response;
};

const getAllITAdminFinanciaYear = () => {
  const response = apiAdminClient.get("/it-admin/getAllFinancialYear");
  return response;
};

const proofOfInvestmentFetchStatus = (financialYear) => {
  const response = apiAdminClient.get(
    `/it-admin-proof/getStatus/${financialYear}`
  );
  return response;
};

const proofOfInvestmentChangeStatus = (financialYear) => {
  const response = apiAdminClient.get(
    `/it-admin-proof/changeStatus/${financialYear}`
  );
  return response;
};

const postProofOfInvestmentAdminData = (financialYear, data) => {
  const response = apiAdminClient.post(
    `/it-admin-proof/add/${financialYear}`,
    data
  );
  return response;
};

const getAllProofAdminFinanciaYear = () => {
  const response = apiAdminClient.get("/it-admin-proof/getAllFinancialYear");
  return response;
};

const apiClient1 = Axios("http://localhost:9026");

const getEmployeePanByEmpCode = (empCode) => {
  return apiClient1.get(`/api/employees/emp/${empCode}`);
};

const createEmployeePan = (payload) => {
  return apiClient1.post(`/api/employees`, payload);
};

const updateEmployeePan = (empCode, payload) => {
  return apiClient1.put(`/api/employees/emp/${empCode}`, payload);
};

// NEW: Get landlord details
const getLandlordDetails = (empCode) => {
  return apiClient1.get(`/api/employees/landlord/${empCode}`);
};

// NEW: Update landlord details
const updateLandlordDetails = (empCode, payload) => {
  return apiClient1.put(`/api/employees/landlord/${empCode}`, payload);
};

const getRegimeByEmpCode = async (empCode) => {
  try {
    return await apiClient.get(`api/regimes/emp/${simpleEncrypt(empCode)}`);
  } catch (error) {
    if (error.response?.status === 404) {
      // No regime exists yet for this empCode
      return null;
    }
    throw error; // real errors should still fail
  }
};

const createRegime = (payload) => {
  return apiClient.post("api/regimes", payload);
};

const updateRegimeByEmpCode = (empCode, payload) => {
  return apiClient.put(`api/regimes/emp/${simpleEncrypt(empCode)}`, payload);
};

const getFileCountForSection = (empCode, financialYear, itDecId) => {
  return apiClient.get(`/it-declaration-file/count/${simpleEncrypt(empCode)}/${financialYear}/${itDecId}`)
    .catch(error => {
      console.error(`API Error for section ${itDecId}:`, error);
      // Return a fallback response structure
      return { data: { data: 0 } };
    });
};

const Service = {
  // it-declaration =============================================
  getFileCountForSection,
  postSection80Data,
  fetchAllSectionName,
  fetchITDeclarationInfoBasedOnempCodeAndFinancialYear,
  fetchITDeclarationSaveStatusInfoBasedOnempCodeAndFinancialYear,
  fetchITDeclarationSaveStatusForSection80dInfoBasedOnempCodeAndFinancialYear,
  postITDeclarationSaveStatusInfoBasedOnempCodeAndFinancialYear,
  postITDeclarationSaveStatusForSection80dInfoBasedOnempCodeAndFinancialYear,
  postTotalAmountForSection80c,
  postTotalAmountForSection80d,
  fetchTotalAmountForSection80c,
  fetchTotalAmountForSection80d,

  // proof of investment =========================================
  fetchProofOfInvestmentBasedOnempCodeAndFinancialYear,
  postProofOfInvestment,
  setStatusForProofOfInvestment,
  getStatusForProofOfInvestmentFunction,
  setSubmitStatusForProofOfInvestment,
  getSubmitStatusForProofOfInvestmentFunction,
  fetchNewProofOfInvestmentBasedOnempCodeAndFinancialYear,

  // IT ADMIN ===================================================
  itAdminChangeStatus,
  itAdminFetchStatus,
  postITAdminData,
  getAllITAdminFinanciaYear,

  // ADMIN proof of investment
  proofOfInvestmentChangeStatus,
  proofOfInvestmentFetchStatus,
  postProofOfInvestmentAdminData,
  getAllProofAdminFinanciaYear,

  getRegimeByEmpCode,
  createRegime,
  updateRegimeByEmpCode,

  updateBulkProofInvestment,

  getEmployeePanByEmpCode,
  createEmployeePan,
  updateEmployeePan,
  
  // NEW: Landlord details methods
  getLandlordDetails,
  updateLandlordDetails,
};

export default Service;