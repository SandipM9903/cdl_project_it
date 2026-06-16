import axios from "axios";
import config from "./Config";
import { createAxiosInstance, createAxiosInstanceMultipart } from "./http-form";

const appClientRfp = createAxiosInstance(`${config.rfpUrl}`);

const appClientRfpFormData = createAxiosInstanceMultipart(`${config.rfpUrl}`);

const getRfpByStatus = async (status) => {
  try {
    const response = await appClientRfp.get(`statusReq/${status}`);

    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getRfpByOppId = async (id) => {
  try {
    const response = await appClientRfp.get(`${id}`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};
const getRfpsByEmpId = async (empId) => {
  try {
    const response = await appClientRfp.get(`/by-emp/${empId}`);
    // const response = await axios.get(`http://localhost:8090/api/by-emp/${empId}`);
    return response;
  } catch (error) {
    console.error("Error fetching RFPs by employee ID:", error);
    throw error;
  }
};


const getRfpProcess = async () => {
  try {
    const response = await appClientRfp.get(`rfpProcess`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const rfpProcessUpdate = async (oppId, selectedProcessId, reason) => {
  try {
    const response = await appClientRfp.put(
      `${oppId}/rfpProcess/reason?rfpProcessId=${selectedProcessId}&reason=${reason}`
    );
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const rfpStatusUpdate = async (oppId, status) => {
  try {
    const response = await appClientRfp.put(
      `${oppId}/rfpStatus?status=${status}`
    );
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getProjectTypes = async () => {
  try {
    const response = await appClientRfp.get(`projectTypes`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};



const getAllRFP = async () => {
  try {
    const response = await appClientRfp.get("getAllRFP");
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};


const getEvalTypes = async () => {
  try {
    const response = await appClientRfp.get(`evalTypes`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getBillingTypes = async () => {
  try {
    const response = await appClientRfp.get(`billingTypes`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getBusinessUnits = async () => {
  try {
    const response = await appClientRfp.get(`businessUnits`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getLeadPracticeUnits = async () => {
  try {
    const response = await appClientRfp.get(`leadPracticeUnits`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getCustTypes = async () => {
  try {
    const response = await appClientRfp.get(`custTypes`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const addOpportunity = async (data) => {
  try {
    const response = await appClientRfp.post(`post`, data);
        // const response = await axios.post(`http://localhost:8090/api/post`, data);

    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getRfpDates = async () => {
  try {
    const response = await appClientRfp.get(`rfpDatesName`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const addImpDate = async (opportunityDates) => {
  try {
    const response = await appClientRfp.post(`addImpDates`, opportunityDates);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const addRemarks = async (rfpRemarks) => {
  try {
    const response = await appClientRfp.post(`addRemarks`, rfpRemarks);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getSpocs = async () => {
  try {
    const response = await appClientRfp.get(`spocTypes`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const addSpoc = async (formData) => {
  try {
    const response = await appClientRfp.post(`postSpoc`, formData);
    // const response = await axios.post(`http://localhost:8090/api/postSpoc`, formData);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const downloadFile = async (id) => {
  try {
    const response = await appClientRfp.get(`getFilePath/${id}`, {
      responseType: "arraybuffer",
    });
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getDocsClientTrue = async () => {
  try {
    const response = await appClientRfp.get(`rfpDocsIsFromClientTrue`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getDocsClientFalse = async () => {
  try {
    const response = await appClientRfp.get(`rfpDocsIsFromClientFalse`);
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const deleteFile = async (id) => {
  try {
    const response = await appClientRfp.delete(`deleteFile/${id}`);
    return response;
  } catch (error) {
    console.error("Error during file deletion:", error);
    throw error;
  }
};



const deleteDate = async (id) => {
  try {
    const response = await appClientRfp.delete(`deleteDate/${id}`);
    return response;
  } catch (error) {
    console.error("Error during file deletion:", error);
    throw error;
  }
};
const deleteOpportunity = async (id) => {
  try {
    const response = await appClientRfp.delete(`deleteOpp/${id}`);
    return response;
  } catch (error) {
    console.error("Error during opportunity deletion:", error);
    throw error;
  }
};

const getTiers = async () => {
  try {
    const response = await appClientRfp.get("tiers");
    return response;
  } catch (error) {
    console.error("Error fetching tiers:", error);
    throw error;
  }
};

const saveTier = async (co) => {
  try {
    const response = await appClientRfp.post("tiers", co);
    return response;
  } catch (error) {
    console.error("Error saving tier:", error);
    throw error;
  }
};

const updateTier = async (id, co) => {
  try {
    const response = await appClientRfp.put(`tiers/${id}`, co);
    return response;
  } catch (error) {
    console.error(`Error updating tier ${id}:`, error);
    throw error;
  }
};





const addFormData = async (formData) => {
  try {
    const response = await appClientRfpFormData.post("upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error during fetching:", error);
    throw error;
  }
};




const Service = {
  getRfpByStatus,
  getRfpByOppId,
  getRfpProcess,
  getRfpsByEmpId,
  rfpProcessUpdate,
  rfpStatusUpdate,
  getProjectTypes,
  getEvalTypes,
  getBillingTypes,
  getBusinessUnits,
  getLeadPracticeUnits,
  getCustTypes,
  addOpportunity,
  getRfpDates,
  addImpDate,
  addRemarks,
  getSpocs,
  addSpoc,
  downloadFile,
  getDocsClientTrue,
  addFormData,
  getDocsClientFalse,
  deleteFile,
  getAllRFP,
  deleteDate,
  deleteOpportunity,
  saveTier,
  getTiers,
  updateTier
};

export default Service;
