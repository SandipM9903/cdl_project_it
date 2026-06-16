import config from "./Config";
import { createAxiosInstance } from "./common-utility-components/http-form";

const appClientEmployeeRequisition = createAxiosInstance(
  `${config.empolyeeRequisitionUrl}`
);

const getAllEmployeerequisition = async () => {
  try {
    const response = await appClientEmployeeRequisition.get(
      "/getAllEmployeeRequisition"
    );
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getAllRequisitionType = async () => {
  try {
    const response = await appClientEmployeeRequisition.get(
      "/getAllRequisitionType"
    );
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getAllEmploymentType = async () => {
  try {
    const response = await appClientEmployeeRequisition.get(
      "/getAllEmploymentType"
    );
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getAllBillingType = async () => {
  try {
    const response = await appClientEmployeeRequisition.get(
      "/getAllBillingType"
    );
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const getAllJobDescription = async () => {
  try {
    const response = await appClientEmployeeRequisition.get(
      "/getAllJobDescription"
    );
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const createNewEmployeeRequisition = async (data) => {
  try {
    const response = await appClientEmployeeRequisition.post(
      "/newEmployeeReuisition",
      data
    );
    return response;
  } catch (error) {
    console.error("Error during posting :", error);
    throw error;
  }
};

const getSearchData = async (search) => {
  try {
    const response = await appClientEmployeeRequisition.get(
      `/getValue/${search}`
    );
    return response;
  } catch (error) {
    console.error("Error during fetching :", error);
    throw error;
  }
};

const Service = {
  getAllEmployeerequisition,
  getAllRequisitionType,
  getAllEmploymentType,
  getAllBillingType,
  getAllJobDescription,
  createNewEmployeeRequisition,
  getSearchData,
};

export default Service;
