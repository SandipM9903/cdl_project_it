import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EMPLOYEE_EMAILS } from "./api";

const BASE_URL = `${BASE_URL_EPMS}/api/cycles`;

// Named exports (for existing components)
export const createCycle = (data) => {
  return axios.post(BASE_URL, data);
};

export const createAnnualCycle = (data) => {
  return axios.post(`${BASE_URL}/annual`, data);
};

export const getCyclesByYear = (yearOrFinancialYear) => {
  // Check if the parameter is a financial year string (contains '-')
  if (typeof yearOrFinancialYear === 'string' && yearOrFinancialYear.includes('-')) {
    // It's a financial year string, use the new endpoint
    return axios.get(`${BASE_URL}/financial-year/${yearOrFinancialYear}`);
  } else {
    // It's a numeric year, use the old endpoint for backward compatibility
    return axios.get(BASE_URL, { params: { year: yearOrFinancialYear } });
  }
};

export const getCyclesByFinancialYear = (financialYear) => {
  return axios.get(`${BASE_URL}/financial-year/${financialYear}`);
};

export const publishCycle = (cycleId, emailData) => {
  return axios.post(`${BASE_URL}/${cycleId}/publish`, emailData);
};

export const closeCycle = (cycleId) => {
  return axios.put(`${BASE_URL}/${cycleId}/close`);
};

export const extendExpiryDate = (cycleId, newEndDate) => {
  return axios.put(`${BASE_URL}/${cycleId}/extend-expiry`, { endDate: newEndDate });
};

export const reopenQuarter = (cycleId, newEndDate) => {
  return axios.put(`${BASE_URL}/${cycleId}/reopen`, { endDate: newEndDate });
};

export const sendReminder = (cycleId) => {
  return axios.post(`${BASE_URL}/${cycleId}/send-reminder`);
};

export const getActiveCycle = () => {
  return axios.get(`${BASE_URL}/active`);
};

// ✅ ADD NEW FUNCTION: Get all employee emails
export const getAllEmployeeEmails = () => {
  return axios.get(BASE_URL_EMPLOYEE_EMAILS, {
    data: { request: "email" }
  });
};

// ✅ ADD NEW FUNCTION: Send unified emails for any action
export const sendUnifiedEmails = (actionType, cycleId, emailData, additionalData = {}) => {
  // actionType can be: 'LAUNCH', 'CLOSE', 'EXTEND', 'REMINDER', 'REOPEN'
  const payload = {
    actionType: actionType,
    cycleId: cycleId,
    customSubject: emailData.subject,
    customBody: emailData.body,
    ...additionalData  // For EXTEND/REOPEN, this will contain { newExpiryDate: '2024-12-31' }
  };
  
  return axios.post(`${BASE_URL_EPMS}/api/email/unified/send`, payload);
};

// Also export as a single object for those who prefer that pattern
export const cycleApi = {
  createCycle,
  createAnnualCycle,
  getCyclesByYear,
  getCyclesByFinancialYear,
  publishCycle,
  closeCycle,
  extendExpiryDate,
  reopenQuarter,
  sendReminder,
  getActiveCycle,
  getAllEmployeeEmails,
  sendUnifiedEmails,
};