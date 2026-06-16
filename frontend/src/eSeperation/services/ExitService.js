import axios from 'axios'
import { BASE_URL } from '../../config/Config';

const get_all_Emp_url=`${BASE_URL}:9028/api/workflow`

class ExitService{

    getExitFormData(userId) {
        return axios.get(`${get_all_Emp_url}/getexitemployeelist/${userId}`);
    }

    addEmployee(employee,workflowName){
        const add_employee=`${get_all_Emp_url}/saveEmployeeData/${workflowName}`
        return axios.post(add_employee,employee)
        
    }
    addMediClaimDetailsOfEmployee(formData,workflowName){
        const add_mediClaimDetais=`${get_all_Emp_url}/saveMediClaimDataOfEmployee/${workflowName}`
        return axios.post(add_mediClaimDetais,formData)
        
    }
    addTravelClaimDetailsOfEmployee(formData,workflowName){
        const add_mediClaimDetais=`${get_all_Emp_url}/saveTravelClaimDataOfEmployee/${workflowName}`
        return axios.post(add_mediClaimDetais,formData)
        
    }
    getWfLevelActions(wfSeqId,userId) {
       
        return axios.get(`${get_all_Emp_url}/getWfLevelActions/${wfSeqId}/${userId}`);
    }
    getActions(selectedOption,wfSeqId,userId,actorRemark){
        return axios.get(`${get_all_Emp_url}/getActions/${wfSeqId}/${userId}/${actorRemark}?selectedOption=${selectedOption}`);
    }
    getMainStatusToCheckUserExistsOrNot(userId,workFLowName){
        return axios.get(`${get_all_Emp_url}/getMainStatusToCheckUserExistsOrNot/${userId}/${workFLowName}`);
    }
    
    loadData(workflowName,userId) {
        const add_employee = `${get_all_Emp_url}/loadData/${workflowName}/${userId}`;
        return axios.get(add_employee);
    }
    loadDataForClaim(workflowName,userId,wfSeqId) {
        const add_employee = `${get_all_Emp_url}/loadDataForClaim/${workflowName}/${userId}/${wfSeqId}`;
        return axios.get(add_employee);
    }
    getMediClaimEmployeelist(userId) {
        return axios.get(`${get_all_Emp_url}/getMediClaimEmployeelist/${userId}`);
    }
    getallClaimEmployeelist(userId) {
        return axios.get(`${get_all_Emp_url}/getallClaimEmployeelist/${userId}`);
    }
    getallTravelClaimEmployeelist(userId) {
        return axios.get(`${get_all_Emp_url}/getallTravelClaimEmployeelist/${userId}`);
    }
    getTravelClaimEmployeelist(userId) {
        return axios.get(`${get_all_Emp_url}/getTravelClaimEmployeelist/${userId}`);
    }
    getOverallMainStatus(userId, workflowName){
    return axios.get(`${get_all_Emp_url}/getOverallMainStatus/${userId}/${workflowName}`);
    }

}

export default new ExitService()