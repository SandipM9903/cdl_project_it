import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from '../../config/Config';

function Statutory_Details() {
  const [empData, setEmpData] = useState({});
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const email = localStorage.getItem('email');

  const empId = localStorage.getItem("empId");

  useEffect(() => {
    axios
      // .get(`http://43.204.42.69:9020/employee/by/email/${email}`)
      .get(`${BASE_URL}:9020/employee/eCode/${empId}`)
      .then((response) => {
        setEmpData(response.data.fileAndObjectTypeBean.empResDTO);
        setUserData(response.data.userDTO);
        setEditedData(response.data.userDTO.statutoryDetailsResDTO); // initialize with original data
      })
      .catch((err) => alert(err));
  }, [email, isEditing]);

  const handleDownload = (documentId, documentName) => {
    axios
      .get(`${BASE_URL}:9023/documents/access/${documentId}`, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const contentType = res.headers['content-type'];
        const blob = new Blob([res.data], { type: contentType });
        saveAs(blob, empData.empId + '-' + documentName);
      })
      .catch((err) => {
        toast.error(`Error: ${err.message || 'Something went wrong!'}`, {
          position: "top-right",
          autoClose: 5000, // Auto close after 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    axios
      // .post(`http://43.204.42.69:9020/employee/updateStatutoryDetails`, {
      //   email: email,
      //   statutoryDetails: editedData,
      // })
      .put(`${BASE_URL}:9021/user/statutory/update/${userData.statutoryDetailsResDTO.statutoryDetailsId}`, editedData)
      .then((response) => {
        alert('Details updated successfully');  
        setEditedData(response.data);
        setIsEditing(false);
      })
      .catch((err) => {
        alert('Error updating details: ' + err);
      });
  };

  return (
    <div></div>
    // <div className='relative'>
    //   <div className='bg-white border-[2px] border-gray-200 shadow-lg w-[380px] rounded-lg py-3 px-4'>
    //     <div className='flex justify-between items-center mb-2'>
    //       <h1 className='text-sm font-semibold'>Statutory Details</h1>
    //       <button 
    //                 onClick={isEditing ? handleSave : handleEditToggle} 
    //                 className='absolute top-3 right-3 text-xs text-blue-500 underline'>
    //                 {isEditing ? 'Save' : 'Edit'}
    //             </button>
    //     </div>
    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>Pan Number</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='panNumber'
    //           value={editedData.panNumber || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>XXXXX-X{userData.statutoryDetailsResDTO?.panNumber}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>Pan Copy</div>
    //       <a href='#' className='ml-2 no-underline text-blue-700' onClick={(e) => {
    //         e.preventDefault();
    //         handleDownload(userData.statutoryDetailsResDTO?.panCopyDocumentId, "PAN CARD");
    //       }}>PAN Card.pdf</a>
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>Aadhar Number</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='aadhaarNumber'
    //           value={editedData.aadhaarNumber || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>XXXX-XXXX-{userData.statutoryDetailsResDTO?.aadhaarNumber}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>Aadhar Copy</div>
    //       <a href='#' className='ml-2 no-underline text-blue-700' onClick={(e) => {
    //         e.preventDefault();
    //         handleDownload(userData.statutoryDetailsResDTO?.aadhaarCopyDocumentId, "AADHAR CARD");
    //       }}>Aadhar Card.pdf</a>
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>Name as per Pan Card</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='nameAsPerPanCard'
    //           value={editedData.nameAsPerPanCard || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.nameAsPerPanCard}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>UAN</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='uan'
    //           value={editedData.uan || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.uan}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>Father / Husband Name</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='fatherOrHusbandName'
    //           value={editedData.fatherOrHusbandName || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.fatherOrHusbandName}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>Relationship with the person</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='relationshipWithPerson'
    //           value={editedData.relationshipWithPerson || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.relationshipWithPerson}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>Earlier a member of PF</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='earlierMemberOfPF'
    //           value={editedData.earlierMemberOfPF || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.earlierMemberOfPF}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>International Worker</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='internationalWorker'
    //           value={editedData.internationalWorker || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.internationalWorker}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>Presently specially abled</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='speciallyAbled'
    //           value={editedData.speciallyAbled || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.speciallyAbled}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>PF Linked Bank Name</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='pfLinkedBankName'
    //           value={editedData.pfLinkedBankName || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.pfLinkedBankName}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>PF Linked Bank Account</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='pfLinkedBankAccountNo'
    //           value={editedData.pfLinkedBankAccountNo || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.pfLinkedBankAccountNo}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>PF Linked Bank IFSC</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='pfLinkedBankIfsc'
    //           value={editedData.pfLinkedBankIfsc || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.pfLinkedBankIfsc}</div>
    //       )}
    //     </div>

    //     <div className='grid grid-cols-2 border-b-[1px] border-gray-200 py-1 text-xs'>
    //       <div className='text-gray-500'>LWD of previous company</div>
    //       {isEditing ? (
    //         <input
    //           type='text'
    //           name='lwdOfPreviousCompany'
    //           value={editedData.lwdOfPreviousCompany || ''}
    //           onChange={handleChange}
    //           className='ml-2 break-words border border-gray-300 rounded px-1'
    //         />
    //       ) : (
    //         <div className='ml-2 break-words'>{userData.statutoryDetailsResDTO?.lwdOfPreviousCompany}</div>
    //       )}
    //     </div>

        
    //   </div>
    // </div>
  );
}

export default Statutory_Details;
