import React, { useState, useEffect } from 'react';
import { FaRegCircleXmark } from 'react-icons/fa6';
import axios from 'axios';
import { BASE_URL } from '../../../config/Config';

function DetailedView({ selectedEmployee, onClose }) {

  const [wfLevelActions, setWfLevelActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  //const [selectedOptions, setSelectedOptions] = useState({});
  const [actorRemark, setActorRemark] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const deptUserId = 9;
  console.log(selectedEmployee, "selectedEmployeeselectedEmployee")

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return '-';
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch actions via API
  useEffect(() => {
    if (selectedEmployee) {
      const fetchActions = async () => {
        try {
          const response = await axios.get(`${BASE_URL}:9028/api/workflow/getWfLevelActions/${selectedEmployee?.wfSeqId}/${selectedEmployee?.empCode}`);
          // setActions(response.data);
          console.log("level actions====", response.data);
          setWfLevelActions(response.data);
        } catch (error) {
          console.error("Error fetching workflow level actions", error);
        }
      };
      fetchActions();
    }
  }, [selectedEmployee]);

  // Handle action click
  const handleActionClick = (action) => {
    setSelectedAction(action);
    setPopupVisible(true);
  };

  // Handle confirmation
  const handleActionConfirmation = async () => {
    try {
      const url = `${BASE_URL}:9028/api/workflow/getActions/${selectedEmployee?.wfSeqId}/${deptUserId}/${actorRemark}?selectedOption=${selectedAction}`;
      const response = await axios.get(url);
     // alert(`Action ${selectedAction} was ${response.data}`);
      setPopupVisible(false);
    } catch (error) {
      console.error("Error confirming action", error);
      alert("An error occurred while processing your request.");
    }
  };

  // Handle popup close
  const handleClosePopup = () => {
    setPopupVisible(false);
  };


  return (
    <div className='container mx-auto h-[650px]'>
      <div className='p-3 text-right'>
        <button className='text-red-500 text-xl' onClick={onClose}><FaRegCircleXmark /></button>
      </div>
      <div className='grid grid-cols-2 mx-3 p-4 shadow-bottom '>
        <div className='col-span-1 p-2  shadow-bottom'>
          <div className='py-3 text-center'>
            {selectedEmployee?.fileAndContentTypeBean && selectedEmployee?.fileAndContentTypeBean?.file ? (
              <img
                src={`data:${selectedEmployee?.fileAndContentTypeBean?.contentType};base64,${selectedEmployee?.fileAndContentTypeBean?.file}`}
                className="rounded-full h-12 w-12"
                alt="Profile"
              />
            ) : (
              <img
                src="/profile.jpg"
                className="rounded-full h-12 w-12"
                alt="Default Profile"
              />
            )}
            {/* <img src='profile.webp' alt='Profile' className='h-[13vh] w-[13vh] rounded-[9999px] mx-auto' /> */}
            <h1 className='text-2xl text-blue-500 font-bold'>{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || '-'}</h1>
            <h1 className='text-base text-gray-500'>{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.designation || '-'}</h1>
          </div>
          <div className='grid grid-cols-3 text-sm p-4'>
            <div className='col-span-1 mt-2'>
              <h1 className='text-gray-500'>Employee Id</h1>
              <h1 className='text-[#00007D]'>{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.empCode || '-'}</h1>
              <h1 className='text-gray-500 mt-8'>Department</h1>
              <h1 className='text-[#00007D]'>{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.mainDeptResDTO?.mainDepartment || '-'}</h1>
              <h1 className='text-gray-500 mt-8'>Location</h1>
              <h1 className='text-[#00007D]'>{selectedEmployee?.userDTO?.locationResDTO?.locationName || '-'}</h1>
              <h1 className='text-gray-500 mt-8'>Joining Date</h1>
              <h1 className='text-[#00007D]'>{formatDate(selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining) || '-'}</h1>
            </div>
            <div className='col-span-1 mt-2'>
              <h1 className='text-gray-500'>Contact No</h1>
              <h1 className='text-[#00007D]'>{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.primaryContactNo || '-'}</h1>
              <h1 className='text-gray-500 mt-8'>Reporting to</h1>
              <h1 className='text-[#00007D]'>{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.reportingManager || '-'}</h1>
              <h1 className='text-gray-500 mt-8'>Empo</h1>
              <h1 className='text-[#00007D]'>{selectedEmployee?.empo || '-'}</h1>
            </div>
            <div className='col-span-1 mt-2'>
              <h1 className='text-gray-500'>Email</h1>
              <h1 className='text-[#00007D] break-words'>{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.emailId || '-'}</h1>
              <h1 className='text-gray-500 mt-8'>Designation</h1>
              <h1 className='text-[#00007D]'>{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.designationResDTO?.designationName || '-'}</h1>
              <h1 className='text-gray-500 mt-8'>Project / Cost Centre</h1>
              <h1 className='text-[#00007D]'>{selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.projectResDTO?.projectId || '-'}</h1>
            </div>
          </div>
        </div>
        <div className='col-span-1'>
          <img src='exitMan.png' className='mt-10 h-[60vh] w-[50vh] mx-auto' alt='ResignationImage' />
        </div>
      </div>
      <div className='mx-3 mt-3 shadow-bottom'>
        <div>
          <h1 className='font-semibold mx-5 mt-4 pt-3 text-gray-700 text-left '>Employee Exit Details</h1>
        </div>
        <div className='grid grid-cols-2'>
          <div className='col-span-1 text-gray-500 text-base p-5 font-normal space-y-4'>
            <div className='flex gap-16'>
              <h1 className=''>Resignation Date</h1>
              <h1 className='border border-gray-400 py-1 px-4 w-[200px]'>{formatDate(selectedEmployee?.dateOfResignation) || '='}</h1>
            </div>
            <div className='flex gap-[76px]'>
              <h1>Last working Date</h1>
              <h1 className='border border-gray-400 py-1 px-4 w-[200px]'>{formatDate(selectedEmployee?.lastWorkingDay) || '-'}</h1>
            </div>
            <div className='flex gap-[66px]'>
              <h1 className='whitespace-nowrap'>Additional Remarks</h1>
              <h1 className='text-wrap border border-gray-400 py-1 px-4 w-[300px]'>{selectedEmployee?.remarks || '-'}</h1>
            </div>
          </div>
          <div className='col-span-1 text-gray-500 text-base p-5 font-normal space-y-5'>
            <div className='flex gap-16'>
              <h1 className=''>Last working Date Requested</h1>
              <h1 className='border border-gray-400 py-1 px-4 w-[186px]'>{formatDate(selectedEmployee?.lastWorkingDayRequest) || '-'}</h1>
            </div>
            <div className='flex gap-[165px]'>
              <h1>Reason for Exit</h1>
              <h1 className='border border-gray-400 py-1 px-2 w-[186px]'>{selectedEmployee?.reason || '-'}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='mx-3 mt-3 shadow-bottom pb-6'>
        <div>
          <h1 className='font-semibold text-left mx-5 mt-4 pt-3 text-gray-700'>To be filled</h1>
        </div>
        <div className='flex items-center gap-12'>
          <h1 className='whitespace-nowrap text-gray-500 text-base p-5 font-normal'>Remarks to Reviewer</h1>
          <textarea
            rows={1}
            className='outline-none rounded-none border border-gray-400 text-gray-700 w-1/2 p-2 my-6'
            placeholder='Enter your remarks here'
          />
        </div>
      </div>

      <div className='mx-3 mt-3 flex justify-center'>
        <div className='flex gap-2'>
          {wfLevelActions && wfLevelActions.map((action, index) => {
            const filteredAction = action.replace(/[^a-zA-Z]/g, '');
            if (filteredAction === 'Approve' || filteredAction === 'Reject') {
              return (
                <button
                  key={index}
                  className={`py-2 px-4 rounded-md ${filteredAction === 'Approve' ? 'bg-blue-500' : 'bg-red-500'} text-white`}
                  onClick={() => handleActionClick(action)}
                >
                  {filteredAction}
                </button>
              );
            }
            return null;
          })}
        </div>
      </div>



      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-white p-4 rounded-lg w-full md:w-1/3">
            <h2 className="text-xl font-semibold">Add Remark</h2>
            <textarea
              value={actorRemark}
              onChange={(e) => setActorRemark(e.target.value)}
              className="w-full h-24 border border-gray-300 mt-2 p-2"
              placeholder="Add your remarks here"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                onClick={handleActionConfirmation}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md ml-2"
                onClick={handleClosePopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailedView;
