import apiClient from "./ApiClient";
import config from "./Config";



// const empCode = 1023446;
//const empCode = sessionStorage.getItem("UserId");
const empCode = 2;
console.log("empCode of the user=="+empCode);
const getConveyanceData = () => {
  console.log(`${config.MyClaimsUrl}/getAllConveyanceItemData/${empCode}`);
  return apiClient.get(`${config.MyClaimsUrl}/getAllConveyanceItemData/${empCode}`)
  
    .then(response => response.data)
    .catch(error => {
      console.error("Data not fetched", error);
      throw error;
    });
    
};

const getMiscellaneousData = () => {
    return apiClient.get(`${config.MyClaimsUrl}/getAllmiscellaneousItemTableData/${empCode}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Data not fetched", error);
        throw error;
    });
};

const getFoodItemsData = () => {
    return apiClient.get(`${config.MyClaimsUrl}/getAllFoodItemsData/${empCode}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Data not fetched", error);
        throw error;
    });
};

const getMobileData = () => {
    return apiClient.get(`${config.MyClaimsUrl}/getAllMobileItemtableData/${empCode}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Data not fetched", error);
        throw error;
    });
};

const getTravelData = () => {
    return apiClient.get(`${config.MyClaimsUrl}/getAllTravelItemTabledata/${empCode}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Data not fetched", error);
        throw error;
    });
};



const getEmployeeData = () => {
    return apiClient.get(`${config.MyClaimsUrl}/getEmpClaimInfo/${empCode}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Data not fetched", error);
        throw error;
    });
};

const getExpenseData = (empCode, wbsId, expenseType) => {
    return apiClient.get(`${config.MyClaimsUrl}/getByExpTypeAndWbsIdAndEmpCode/${empCode}/${wbsId}/${expenseType}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error occurred while fetching data:", error);
        throw error;
      });
  };  

const getAdvanceData = (empCode, wbsId, advanceType) => {
    return apiClient.get(`${config.MyClaimsUrl}/getByExpTypeAndWbsIdAndEmpCode/${empCode}/${wbsId}/${advanceType}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error occurred while fetching data:", error);
        throw error;
      });
};

const uploadConveyanceData = async (formData,expenseType,empCode,selectedWbsId,description) => {
    try {
      const response = await apiClient.post(`${config.MyClaimsUrl}/saveConveyanceItemData/${expenseType}/${empCode}/${selectedWbsId}/${description}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while uploading conveyance data:", error);
      throw error;
    }
};

const uploadTravelData = async (formData,expenseType,empCode,selectedWbsId,description) => {
    try {
      const response = await apiClient.post(`${config.MyClaimsUrl}/saveTravelItemData/${expenseType}/${empCode}/${selectedWbsId}/${description}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while uploading travel data:", error);
      throw error;
    }
};

const uploadMiscellaneousData = async (formData,expenseType,empCode,selectedWbsId,description) => {
    try {
      const response = await apiClient.post(`${config.MyClaimsUrl}/saveMiscellaneousItemData/${expenseType}/${empCode}/${selectedWbsId}/${description}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while uploading miscellaneous data:", error);
      throw error;
    }
};

const uploadFoodData = async (formData,expenseType,empCode,selectedWbsId,description) => {
try {
    const response = await apiClient.post(`${config.MyClaimsUrl}/SaveFoodItemTableData/${expenseType}/${empCode}/${selectedWbsId}/${description}`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
    });
    return response.data;
} catch (error) {
    console.error("Error occurred while uploading food data:", error);
    throw error;
}
};

const uploadMobileData = async (formData,expenseType,empCode,selectedWbsId,description) => {
    try {
      const response = await apiClient.post(`${config.MyClaimsUrl}/saveMobileExpenseItemdata/${expenseType}/${empCode}/${selectedWbsId}/${description}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while uploading mobile data:", error);
      throw error;
    }
  };

  const uploadRtaData = async (formData) => {
    try {
      const response = await apiClient.post(`${config.MyClaimsUrl}/uploadRtaExpense`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while uploading mobile data:", error);
      throw error;
    }
  };

  const uploadIouData = async (formData) => {
    try {
      const response = await apiClient.post(`${config.MyClaimsUrl}/uploadIouExpense`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while uploading mobile data:", error);
      throw error;
    }
  };

  const uploadClaimsDrafts = async (formData) => {
    try {
      const response = await apiClient.post(`${config.MyClaimsUrl}/uploadClaimsDrafts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error occurred while uploading claim drafts:", error);
      throw error;
    }
  };

  const getOverallClaimMainStatus = (empCode, expenseType) => {
    return apiClient.get(`${config.WorkflowUrl}/getOverallClaimMainStatus/${empCode}/${expenseType}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching overall statuses", error);
        throw error;
      });
  };


const Service = {
    getConveyanceData,
    getMiscellaneousData,
    getFoodItemsData,
    getMobileData,
    getTravelData,
    // getRtaData,
    // getIouData,
    getEmployeeData,
    getExpenseData,
    getAdvanceData,
    uploadConveyanceData,
    uploadTravelData,
    uploadMiscellaneousData,
    uploadFoodData,
    uploadMobileData,
    uploadRtaData,
    uploadIouData,
    uploadClaimsDrafts,
    getOverallClaimMainStatus,
};

export default Service;






