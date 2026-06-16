import _http from "../_httpService";
import config from "../../../config.json";

const apiURL = config[config.build].apiURLQuiz;


export function createPlayQuiz(req) {
    const param = { ...req };
    delete param.id;
    return _http.post(`${apiURL}/api/master/play`, param);
}

export function submitPlayQuiz(req, id) {
    const param = { ...req };
    return _http.post(`${apiURL}/api/master/play/submit/${id}`, param);
}

export function getPlayQuiz(id) {
    return _http.get(`${apiURL}/api/master/play/${id}`);
}

export function getQuizList(req,pageNo) {
    const param = { ...req };
    return _http.put(`${apiURL}/api/master/play/list/100/${pageNo}`, param);
}

// export function getQuizListByQuiz(quizId,pageNo) {
//     const param = { ...req };
//     return _http.put(`${apiURL}/api/master/play/list-by-quiz/${quizId}/100/${pageNo}`, param);
// }


export const getQuizListByQuiz = async (quizId) => {
    const response = await fetch(`http://localhost:8082/api/master/play/list-by-quiz/${quizId}/0/1`);
    const data = await response.json();
    return data; // Assuming the response structure is like { status, message, data }
  };
  


// post	/api/master/play
// post	/api/master/play/submit
// get	/api/master/play/{id}

// put	/api/master/play/list/{pageSize}/{pageNo}
// get	/api/master/play/list-by-quiz/{quizId}/{pageSize}/{pageNo}
