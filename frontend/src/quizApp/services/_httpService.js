import React from "react";
import axios from "axios";
import logger from "./_logService";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (expectedError) {
    logger.log(error);
    toast.warning(() => (
      <div>
        <b>Bad Request.</b>
        <br />
        {error.response.data.msg ? error.response.data.msg : error.message}
      </div>
    ));
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  // console.log("httService-setJWT");
  // axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
}

const headerJWT = () => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    return {
      headers: {
        Authorization: "Bearer " + token,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    };
  }
  return {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  };
};

const api =  (baseURL,path, subURL = "") => {
  path = path !== "" ? "/" + path : "";
  return `${baseURL}${subURL}${path}`;
};

const post =  (apiEndPoint,param) => {
  return axios.post(apiEndPoint, param, headerJWT());
};

const put =  (apiEndPoint,param) => {
  return axios.put(apiEndPoint, param, headerJWT());
};

const get =  (apiEndPoint) => {
  return axios.get(apiEndPoint, headerJWT());
};

const del =  (apiEndPoint) => {
  return axios.delete(apiEndPoint, headerJWT());
};

const httpActions = {
  api,
  post,
  put,
  get,
  del,
  apiGet: axios.get,
  apiPost: axios.post,
  apiPut: axios.put,
  apiDeelete: axios.delete,
  setJwt,
  headerJWT,
};

export default httpActions;
