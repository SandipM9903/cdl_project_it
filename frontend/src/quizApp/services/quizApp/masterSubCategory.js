import _http from "../_httpService";
import config from "../../../config.json";

const apiURL = config[config.build].apiURLQuiz;


export function createMasterSubCat(req) {
    const param = { ...req };
    delete param.id;
    return _http.post(`${apiURL}/api/master/sub-cat`, param);
}

export function editMasterSubCat(req) {
    const param = { ...req };
    return _http.put(`${apiURL}/api/master/sub-cat/${param.id}`, param);
}

export function getMasterSubCat(id) {
    return _http.get(`${apiURL}/api/master/sub-cat/${id}`);
}

export function getMasterSubCatAll() {
    return _http.get(`${apiURL}/api/master/sub-cat`);
}
export function getMasterSubCatByCat(id) {
    return _http.get(`${apiURL}/api/master/sub-cat/by-cat/${id}`);
}


export function deleteMasterSubCat(id) {
    return _http.delete(`${apiURL}/api/master/sub-cat/${id}`);
}


// post	/api/master/sub-cat
// put	/api/master/sub-cat/{id}
// delete	/api/master/sub-cat/{id}
// get	/api/master/suc-cat
// get	/api/master/sub-cat/{id}
