import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { BASE_URL } from '../../config/Config';

function Dependent_Details() {
    const [empDependentDetails, setEmpDependentDetails] = useState([]);
    const [updateData, setUpdateData] = useState({});
    const [editRowId, setEditRowId] = useState(null);

    const email = localStorage.getItem('email');
    const empId = localStorage.getItem('empId');
  
    useEffect(() => {
        axios
        // .get(``${BASE_URL}:9020/employee/by/email/${email}`)
        .get(`${BASE_URL}:9020/employee/eCode/${empId}`)
        .then((response) => {
            setEmpDependentDetails(response.data.fileAndObjectTypeBean.empResDTO.dependentDetailsResDTOS);
        })
        .catch((error) => {
            alert(error);
        });
    }, []);

    const handleEditClick = (row) => {
        setEditRowId(row.dependentDetailsId);
        setUpdateData(row);
    };

    const handleSave = () => {
        axios.put(`${BASE_URL}:9020/employee/dependent/update/${updateData.dependentDetailsId}`, updateData).then(res=>{
          alert("updated");
          console.log(res.data);
          setUpdateData({});
          setEditRowId(null);
        }).catch(err=>{
          alert(err);
        })
    }

    const handleInputChange = (index, field, value) => {
        // Update the selected dependent row and prepare the updateData object
        const updatedDependents = [...empDependentDetails];
        updatedDependents[index] = { ...updatedDependents[index], [field]: value };
        setEmpDependentDetails(updatedDependents);

        // Set the object to be updated
        setUpdateData(updatedDependents[index]);
    };

    const columns = [
        {
            name: "Name",
            selector: row => row.dependentDetailsId === editRowId ? (
                <input 
                    type="text" 
                    value={row.dependentName} 
                    onChange={(e) => handleInputChange(empDependentDetails.indexOf(row), 'dependentName', e.target.value)}
                />
            ) : row.dependentName,
        },
        {
            name: "Relationship",
            selector: row => row.dependentDetailsId === editRowId ? (
                <input 
                    type="text" 
                    value={row.dependentRelationship} 
                    onChange={(e) => handleInputChange(empDependentDetails.indexOf(row), 'dependentRelationship', e.target.value)}
                />
            ) : row.dependentRelationship,
        },
        {
            name: "Date of Birth",
            selector: row => row.dependentDetailsId === editRowId ? (
                <input 
                    type="date" 
                    value={row.dependentDateOfBirth} 
                    onChange={(e) => handleInputChange(empDependentDetails.indexOf(row), 'dependentDateOfBirth', e.target.value)}
                />
            ) : row.dependentDateOfBirth,
        },
        {
            name: "Actions",
            cell: row => (row.dependentDetailsId === editRowId ? (
                    <button onClick={handleSave}>Save</button>
                ) : (
                    <button onClick={() => handleEditClick(row)}>Edit</button>
                )
            ),
        }
    ];

    const newStyle = {
        headCells: {
            style: {
                fontWeight: "normal",
                fontSize: "12px",
                height: "36px",
                paddingLeft: "22px",
                color:"black"
            },
        },
        cells: {
            style: {
                fontWeight: "normal",
                fontSize: "12px",
                paddingLeft: "24px",
                color: "#A0A0A0",
            },
        },
    };

    return (
        <div>
            <div className='bg-white border-[2px] border-gray-200 shadow-lg w-[1220px] mt-3 rounded-lg py-3 px-4'>
                <div className="flex justify-between items-center">
                    <h3 className='font-semibold mb-1.5'>Dependent Details</h3>
                </div>
                <DataTable 
                    columns={columns} 
                    data={empDependentDetails} 
                    customStyles={newStyle}
                />
            </div>
        </div>
    )
}

export default Dependent_Details;


























// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import DataTable from 'react-data-table-component';

// function Dependent_Details() {
//     const [empDependentDetails, setEmpDependentDetails] = useState([]);
//     const [empData, setEmpData] = useState({});
//     const [userData, setUserData] = useState({});
//     const [fileUrl, setFileUrl] = useState('');
//     const [isEditing, setIsEditing] = useState(false); // State to manage edit mode

//     const email = localStorage.getItem('email');
  
//     useEffect(() => {
//         axios
//         .get(``${BASE_URL}:9020/employee/by/email/${email}`)
//         .then((response) => {
//             setEmpData(response.data.fileAndObjectTypeBean.empResDTO);
//             setUserData(response.data.userDTO);
//         })
//         .catch((error) => {
//             alert(error);
//         });
//     }, []);

//     const handleEditClick = () => {
//         setIsEditing(!isEditing); // Toggle between edit and view modes
//     };

//     const handleInputChange = (index, field, value) => {
//         const updatedData = [...empData.dependentDetailsResDTOS];
//         updatedData[index][field] = value; // Update the respective field of dependent details
//         setEmpData({ ...empData, dependentDetailsResDTOS: updatedData });
//     };

//     const columns = [
//         {
//             name: "Name",
//             selector: row => isEditing ? (
//                 <input 
//                     type="text" 
//                     value={row.dependentName} 
//                     onChange={(e) => handleInputChange(empData.dependentDetailsResDTOS.indexOf(row), 'dependentName', e.target.value)}
//                 />
//             ) : row.dependentName,
//         },
//         {
//             name: "Relationship",
//             selector: row => isEditing ? (
//                 <input 
//                     type="text" 
//                     value={row.dependentRelationship} 
//                     onChange={(e) => handleInputChange(empData.dependentDetailsResDTOS.indexOf(row), 'dependentRelationship', e.target.value)}
//                 />
//             ) : row.dependentRelationship,
//         },
//         {
//             name: "Date of Birth",
//             selector: row => isEditing ? (
//                 <input 
//                     type="date" 
//                     value={row.dependentDateOfBirth} 
//                     onChange={(e) => handleInputChange(empData.dependentDetailsResDTOS.indexOf(row), 'dependentDateOfBirth', e.target.value)}
//                 />
//             ) : row.dependentDateOfBirth,
//         }
//     ];

//     const newStyle = {
//         headCells: {
//             style: {
//                 fontWeight: "normal",
//                 fontSize: "12px",
//                 height: "36px",
//                 paddingLeft: "22px",
//                 color:"black"
//             },
//         },
//         cells: {
//             style: {
//                 fontWeight: "normal",
//                 fontSize: "12px",
//                 paddingLeft: "24px",
//                 color: "#A0A0A0",
//             },
//         },
//     };

//     return (
//         <div>
//             <div className='bg-white border-[2px] border-gray-200 shadow-lg w-[1220px] mt-3 rounded-lg py-3 px-4'>
//                 <div className="flex justify-between items-center">
//                     <h3 className='font-semibold mb-1.5'>Dependent Details</h3>
//                     <button 
//                         className="text-blue-500 underline" 
//                         onClick={handleEditClick}
//                     >
//                         {isEditing ? 'Save' : 'Edit'}
//                     </button>
//                 </div>
//                 <DataTable 
//                     columns={columns} 
//                     data={empData.dependentDetailsResDTOS} 
//                     customStyles={newStyle}
//                 />
//             </div>
//         </div>
//     )
// }

// export default Dependent_Details;
