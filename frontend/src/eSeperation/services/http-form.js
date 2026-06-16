import axios from "axios";

export const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-type": "application/json"
      // "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
};