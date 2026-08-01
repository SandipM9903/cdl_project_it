import axios from "axios";
import { simpleEncrypt } from "../../simpleEncrypt";

export const BASE_URL_EPMS = "http://localhost:9009";
// export const BASE_URL_EPMS = "https://mycdl.cms.co.in";
// export const BASE_URL_EPMS = "http://43.205.24.208:9009";
// export const BASE_URL_EPMS_EMP = "http://localhost:9020/api/v1/employees";

// export const BASE_URL_EPMS_EMP = "http://localhost:9010/api/v1/employees";
export const BASE_URL_EPMS_EMP_LOCATION = "http://43.205.24.208:9020";


// export const BASE_URL_EPMS_EMP = "http://43.205.24.208:9009/api/v1/performance/employees";
// export const BASE_URL_EPMS_EMP = "https://mycdl.cms.co.in/api/v1/performance/employees";
export const BASE_URL_EPMS_EMP = "http://localhost:9009/api/v1/performance/employees";

// THIS NEW EXPORT - API endpoint that returns only emails
export const BASE_URL_EMPLOYEE_EMAILS = "http://43.205.24.208:9020/employee/getAll";
// export const BASE_URL_EMPLOYEE_EMAILS = "http://localhost:9020/employee/getAll";

export const DOC_URL = "https://mycdl.cms.co.in/documents/access";
// export const DOC_URL = "http://43.205.24.208:9023/documents/access"

//For fetching employee details
export const BASE_URL_CDL = "https://mycdl.cms.co.in";
// export const BASE_URL_CDL = "http://mycdl.cms.co.in";

// Synchronous local encryption function - 0ms, 0 HTTP network requests!
export const getEncryptedEmployeeCode = (empCode) => {
  if (!empCode) return empCode;
  const str = String(empCode).trim();
  // If already encrypted token, return as-is
  if (isNaN(str) && str.length > 10) {
    return str;
  }
  try {
    const token = simpleEncrypt(str);
    return token ? encodeURIComponent(token) : str;
  } catch (error) {
    console.warn("Could not encrypt employee code locally:", error);
    return str;
  }
};