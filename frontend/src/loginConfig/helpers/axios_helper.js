import axios from 'axios';
import { getUser } from './auth_helper';


export const callApi = (token) => { // Accept token parameter
    const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + token
    };

    return axios.get("http://43.205.24.208:8500/api/v1/keycloak/test/home", { headers });
}


// export const callApi = () => {
//     return getUser().then(user => {
//         if (user && user.access_token) {
//             return _callApi(user.access_token).catch(error => {
//                 throw error;
//             });
//         } else {
//             throw new Error('user is not logged in');
//         }
//     });
// }

