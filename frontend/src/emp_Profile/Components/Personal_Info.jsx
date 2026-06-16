import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../config/Config';
function Personal_Info() {
  const [empData, setEmpData] = useState({});
  const [userData, setUserData] = useState({});
  const [personalUpdateRequest, setPersonalUpdateRequest] = useState({});
  const [isEditable, setIsEditable] = useState(false); // To toggle edit mode
  const email = localStorage.getItem('email');
  const empId = localStorage.getItem('empId');
  const showComingSoon = () => {
    toast.success("Updated", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      style: {
        background: "#F5F3FF",
        color: "#7C3AED",
        fontWeight: "500",
        borderRadius: "10px",
      },
    });
  };
  useEffect(() => {
    fetchEmployeeData();
  }, [email]);
  const fetchEmployeeData = () => {
    axios
      // .get(`${BASE_URL}:9020/employee/by/email/${email}`)
     .get(`${BASE_URL}:9020/employee/eCode/${empId}`)
     
      .then((response) => {
        console.log("empres", response.data.fileAndObjectTypeBean.empResDTO);
        setEmpData(response.data.fileAndObjectTypeBean?.empResDTO);
        setUserData(response.data.userDTO);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  // Function to handle the edit/save button click
  const handleEditClick = () => {
    setIsEditable(!isEditable);
    setPersonalUpdateRequest({});
  };
  const handleSave = () => {
    if (Object.keys(personalUpdateRequest).length === 0) {
      toast.info("No changes detected.");
      return;
    }
    // Create a shallow copy and remove dateOfBirth
    const updatedEmpData = {
      ...personalUpdateRequest,
      empCode: empData.empCode, // always needed
    };
    axios.put(`${BASE_URL}:9020/employee/update`, updatedEmpData)
      .then(res => {
        const msg = res.data;
        if (msg.includes("You Already Submitted Request, Wait For Approval!!")) {
          toast.error(msg);
        } else {
          toast.success(msg);
        }
        fetchEmployeeData();
        setPersonalUpdateRequest({});
      })
      .catch(err => {
        toast.error("Error updating employee data: " + err.message);
      });
    setIsEditable(false); // Exit edit mode
  };
  // Function to handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value !== empData[name]) {
      setPersonalUpdateRequest(prev => ({ ...prev, [name]: value }));
    } else {
      // If the value is same as original, remove from update request
      const updated = { ...personalUpdateRequest };
      delete updated[name];
      setPersonalUpdateRequest(updated);
    }
    // Also update the displayed value
    setEmpData(prev => ({ ...prev, [name]: value }));
  };
  return (
    <div className='bg-white border-[2px] border-gray-200 shadow-lg w-[380px] rounded-lg py-3 px-4'>
      <div className="flex justify-between items-center">
        <h4 className='font-semibold mb-1.5 text-sm'>Personal</h4>
        <button
          className='text-red-700 text-sm'
          onClick={isEditable ? handleSave : handleEditClick}
        >
          {isEditable ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Primary Contact Number</div>
        <div className='ml-4 overflow-hidden text-ellipsis'>
          {isEditable ? (
            <input
              type="text"
              name="primaryContactNo"
              value={empData.primaryContactNo || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            />
          ) : (
            empData.primaryContactNo
          )}
        </div>
      </div>
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Secondary Contact Number</div>
        <div className='ml-4 overflow-hidden text-ellipsis'>
          {isEditable ? (
            <input
              type="text"
              name="secondaryContactNo"
              value={empData.secondaryContactNo || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            />
          ) : (
            empData.secondaryContactNo
          )}
        </div>
      </div>
      {/* <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
  <div className='text-gray-500'>Date of Birth</div>
  <div className='ml-4'>
    {isEditable ? (
      <input
        type="date"
        name="dateOfBirth"
        value={empData.dateOfBirth || ''}
        onChange={handleInputChange}
        className="border-b-[1px] border-gray-300"
      />
    ) : (
      empData.dateOfBirth
    )}
  </div>
</div> */}
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Gender</div>
        <div className='ml-4'>
          {isEditable ? (
            <input
              type="text"
              name="gender"
              value={empData.gender || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            />
          ) : (
            empData.gender
          )}
        </div>
      </div>
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Blood Group</div>
        <div className='ml-4'>
          {isEditable ? (
            <input
              type="text"
              name="bloodGroup"
              value={empData.bloodGroup || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            />
          ) : (
            empData.bloodGroup
          )}
        </div>
      </div>
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Emergency Contact</div>
        <div className='ml-4 overflow-hidden text-ellipsis'>
          {isEditable ? (
            <input
              type="text"
              name="emergencyContactNo"
              value={empData.emergencyContactNo || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            />
          ) : (
            empData.emergencyContactNo
          )}
        </div>
      </div>
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Emergency Contact Name</div>
        <div className='ml-4 overflow-hidden text-ellipsis'>
          {isEditable ? (
            <input
              type="text"
              name="emergencyContactName"
              value={empData.emergencyContactName || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            />
          ) : (
            empData.emergencyContactName
          )}
        </div>
      </div>
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Relationship with Emergency Contact</div>
        <div className='ml-4 overflow-hidden text-ellipsis'>
          {isEditable ? (
            <input
              type="text"
              name="relationWithEmergencyContact"
              value={empData.relationWithEmergencyContact || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            />
          ) : (
            empData.relationWithEmergencyContact
          )}
        </div>
      </div>
      {/* <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
            <div className='text-gray-500'>Personal Email</div>
            <div className='ml-4 overflow-hidden text-ellipsis'>
              {isEditable ? (
                <input
                  type="text"
                  name="email"
                  value={userData.email || ''}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="border-b-[1px] border-gray-300"
                />
              ) : (
                userData.email
              )}
            </div>
          </div> */}
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Passport Number</div>
        <div className='ml-4 overflow-hidden text-ellipsis'>
          {isEditable ? (
            <input
              type="text"
              name="passportNumber"
              value={empData.passportNumber || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            />
          ) : (
            empData.passportNumber
          )}
        </div>
      </div>
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Age</div>
        <div className='ml-4'>
          {isEditable ? (
            <input
              type="text"
              name="age"
              value={empData.age || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            />
          ) : (
            empData.age
          )}
        </div>
      </div>
      <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs'>
        <div className='text-gray-500'>Marital Status</div>
        <div className='ml-4'>
          {isEditable ? (
            <select
              name="maritalStatus"
              value={empData.maritalStatus || ''}
              onChange={handleInputChange}
              className="border-b-[1px] border-gray-300"
            >
              <option value="Married">Married</option>
              <option value="Unmarried">Unmarried</option>
              <option value="Widowed">Widowed</option>
              <option value="Single">Single</option>
            </select>
          ) : (
            empData.maritalStatus
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default Personal_Info;