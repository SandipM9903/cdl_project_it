import _http from "../_httpService";
import config from "../../../config.json";

const apiURL = config[config.build].apiURLQuiz;


export function createQuestionBank(req) {
    const param = { ...req };
    delete param.id;
    param["subCatId"] = [param["subCatId"]];
    return _http.post(`${apiURL}/api/master/question`, param);
}

export function editQuestionBank(req) {
    const param = { ...req };
    const id = param.id;
    delete param.id;
    param["subCatId"] = [param["subCatId"]];
    return _http.put(`${apiURL}/api/master/question/${id}`, param);
}

export function getQuestionBank(id) {
    return _http.get(`${apiURL}/api/master/question/${id}`);
}

export function deleteQuestionBank(id) {
    return _http.del(`${apiURL}/api/master/question/${id}`);
}

export function editQuestionBankStatus(req) {
    const param = { ...req };
    return _http.put(`${apiURL}/api/master/question/status`, param);
}

export function getQuestionBankList(req,pageNo) {
    const param = { ...req };
    param["catId"] = [param["catId"]];
    param["subCatId"] = [param["subCatId"]];

    return _http.put(`${apiURL}/api/master/question/list/filter/200/${pageNo}`, param);
}

export function getQuizQuestionsList(id) {


    return _http.get(`${apiURL}/api/master/quiz/questions-by-quiz/${id}`);
}


// api/master/quiz/questions-by-quiz/77
// post	/api/master/question
// put	/api/master/question/{id}
// delete	/api/master/question/{id}
// put	/api/master/question/list/{pageSize}/{pageNo} 
// get	/api/master/question/{id}
// put	/api/master/question/status 
