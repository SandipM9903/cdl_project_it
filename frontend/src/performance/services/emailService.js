import axios from "axios";
import { BASE_URL_EPMS } from "./api";

const BASE_URL = `${BASE_URL_EPMS}/api/notifications/emailer`;
const TEMPLATE_URL = `${BASE_URL_EPMS}/api/email`;

export const emailService = {

  createEmailer: (data) => {
    return axios.post(`${BASE_URL}/create`, data);
  },

  editEmailer: (id, data) => {
    return axios.put(`${BASE_URL}/edit/${id}`, data);
  },

  previewEmailer: (id) => {
    return axios.get(`${BASE_URL}/preview/${id}`);
  },

  previewTemplateById: (id) => {
    return axios.get(`${BASE_URL_EPMS}/api/email/template/${id}`);
  },

  publishLaunchEmail: (cycleId, payload) => {
    // Update this URL to match your CycleController endpoint
    return axios.post(`${BASE_URL_EPMS}/api/cycles/${cycleId}/publish`, payload);
  },

  sendEmailByTemplate: (cycleType, templateType) => {
    return axios.post(`${BASE_URL}/send/${cycleType}/${templateType}`);
  },

  sendRoleBasedEmails: (data) => {
    return axios.post(`${BASE_URL}/send-role-based`, data);
  },

  getEmailStats: (cycleType) => {
    return axios.get(`${BASE_URL}/stats/${cycleType}`);
  }
};