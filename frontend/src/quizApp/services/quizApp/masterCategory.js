import _http from "../_httpService";
import config from "../../../config.json";

const apiURL = config[config.build].apiURLQuiz;


export function createMasterCat(req) {
    const param = { ...req };
    delete param.id;
    return _http.post(`${apiURL}/api/master/cat`, param);
}

export function editMasterCat(req) {
    const param = { ...req };
    return _http.put(`${apiURL}/api/master/cat/${param.id}`, param);
}

export function getMasterCat(id) {
    return _http.get(`${apiURL}/api/master/cat/${id}`);
}

export function getMasterCatAll() {
    return _http.get(`${apiURL}/api/master/cat`);
}

export function deleteMasterCat(id) {
    return _http.delete(`${apiURL}/api/master/cat/${id}`);
}

// post	/api/master/cat
// put	/api/master/cat/{id}
// delete	/api/master/cat/{id}
// get	/api/master/cat
// get	/api/master/cat/{id}
