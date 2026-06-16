import _http from "../_httpService";
import config from "../../../config.json";

const apiURL = config[config.build].apiURLQuiz;


export function createQuiz(req) {
    const param = { ...req };
    delete param.id;
    param["subCatId"] = [param["subCatId"]];
    param["queType"] = [param["queType"]];
    param["difficulty"] = [param["difficulty"]];
    param["noOfQues"] = (param["queId"]).length;
    

    
    return _http.post(`${apiURL}/api/master/quiz`, param);
}

// export function editQuiz(req) {
//     const param = { ...req };
//     param["subCatId"] = [param["subCatId"]];
//     param["queType"] = [param["queType"]];
//     param["difficulty"] = [param["difficulty"]];
//     return _http.put(`${apiURL}/api/master/quiz/${param.id}`, param);
// }
export function editQuiz(req) {
    const param = { ...req }; // Make sure you're working with the correct data
  
    // Ensure id is coming from req, not catId
    const id = param.id; // The correct id field should be passed
    if (!id) {
      throw new Error("Quiz ID is required"); // Handle missing id
    }
  
    // Ensure subCatId, queType, and difficulty are properly formatted as arrays
    if (param.subCatId && !Array.isArray(param.subCatId)) {
      param["subCatId"] = [param["subCatId"]];
    }
    if (param.queType && !Array.isArray(param.queType)) {
      param["queType"] = [param["queType"]];
    }
    if (param.difficulty && !Array.isArray(param.difficulty)) {
      param["difficulty"] = [param["difficulty"]];
    }
  
    // Perform the PUT request
    return _http.put(`${apiURL}/api/master/quiz/${id}`, param);
  }
export function getQuiz(id) {
    return _http.get(`${apiURL}/api/master/quiz/${id}`);
}

export function deleteQuiz(id) {
    return _http.delete(`${apiURL}/api/master/quiz/${id}`);
}

export function editQuizStatus(req) {
    const param = { ...req };
    return _http.put(`${apiURL}/api/master/quiz/status`, param);
}

export function getQuizList(req,pageNo) {
    const param = { ...req };
    param["catId"] = [param["catId"]];
    param["subCatId"] = [param["subCatId"]];
    param["status"] = param["status"]==="Active"?true:false;
    return _http.put(`${apiURL}/api/master/quiz/list/200/${pageNo}`, param);
    
}

export function getQuizListAll() {
    return _http.put(`${apiURL}/api/master/quiz/list-all`);
}

// post	/api/master/quiz
// put	/api/master/quiz/{id}
// delete	/api/master/quiz/{id}
// put	/api/master/quiz/list/{pageSize}/{pageNo} 
// put	/api/master/quiz/list-all //
// get	/api/master/quiz/{id} 
// put	/api/master/quiz/status 
