import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/Config';

function Work_Info() {
    // const [empWorkInfo, setEmpWorkInfo] = useState({});
    const [empData, setEmpData] = useState({});
    const [userData, setUserData] = useState({});
    const [fileUrl, setFileUrl] = useState('');
  
    const email = localStorage.getItem('email');
  
    useEffect(() => {
      axios
      .get(`${BASE_URL}:9020/employee/by/email/${email}`)
      .then((response) => {
          setEmpData(response.data.fileAndObjectTypeBean.empResDTO);
          setUserData(response.data.userDTO);
          
        })
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    return (
        <div>
            <div className='bg-white border-[2px] border-gray-200 shadow-lg w-[380px] rounded-lg py-3 px-4'>
                <h3 className='font-semibold mb-1.5'>Work</h3>
    
                <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
                    <div className='text-gray-500'>Department</div>
                    <div className='ml-2 truncate' title={empData.mainDeptResDTO?.mainDepartment}>
                        {empData.mainDeptResDTO?.mainDepartment}
                    </div>
                </div>
    
                <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
                    <div className='text-gray-500'>Project Name</div>
                    <div className='ml-2 truncate' title={empData.projectResDTO?.projectName}>
                        {empData.projectResDTO?.projectName}
                    </div>
                </div>
                <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
                    <div className='text-gray-500'>Designation</div>
                    <div className='ml-2 truncate' title={empData.designationResDTO?.designationName}>
                        {empData.designationResDTO?.designationName}
                    </div>
                </div>
                <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
                    <div className='text-gray-500'>Reporting Manager</div>
                    <div className='ml-2 truncate' title={empData.reportingManager}>
                        {empData.reportingManager}
                    </div>
                </div>
                <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
                    <div className='text-gray-500'>Report To</div>
                    <div className='ml-2 truncate' title={empData.reportTo}>
                        {empData.reportTo}
                    </div>
                </div>
    
               
    
                {/* <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
                    <div className='text-gray-500'>Work phone</div>
                    <div className='ml-2 truncate' title={empData.primaryContactNo}>
                        {empData.primaryContactNo}
                    </div>
                </div> */}
    
                {/* <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
                    <div className='text-gray-500'>Total Experience</div>
                    <div className='ml-2 truncate' title={userData.totalExperience}>
                        {userData.totalExperience}
                    </div>
                </div> */}
    
                <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
                    <div className='text-gray-500'>Location</div>
                    <div className='ml-2 truncate' title={userData.locationResDTO?.locationName}>
                        {userData.locationResDTO?.locationName}
                    </div>
                </div>
    
               
    
                <div className='grid grid-cols-2 py-1.5 text-xs'>
                    <div className='text-gray-500'>Exp with current company</div>
                    <div className='ml-2 truncate' title={empData.expWithCurrentCompany}>
                        {empData.expWithCurrentCompany}
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default Work_Info