import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaDownload, FaEye } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config/Config';

function Education_Info() {
    const [empEducationInfo, setEmpEducationInfo] = useState([]);
    const [updateData, setUpdateData] = useState({});
    const [fileUrl, setFileUrl] = useState('');
    const [editRowId, setEditRowId] = useState(null);

    const navigate = useNavigate('');
    const email = localStorage.getItem('email');
    const empId = localStorage.getItem('empId');
  
    useEffect(() => {
        axios
        // .get(`${BASE_URL}:9020/employee/by/email/${email}`)
        .get(`${BASE_URL}:9020/employee/eCode/${empId}`)
        .then((response) => {
            setEmpEducationInfo(response.data.userDTO.educationResDTOS);
        })
        .catch((error) => {
            alert(error);
        });
    }, []);

    const handleEditClick = (row) => {
        setEditRowId(row.educationId);
        setUpdateData(row);
    };

    const handleInputChange = (index, field, value) => {
        // Update the selected dependent row and prepare the updateData object
        const updatedEduInfo = [...empEducationInfo];
        updatedEduInfo[index] = { ...updatedEduInfo[index], [field]: value };
        setEmpEducationInfo(updatedEduInfo);

        // Set the object to be updated
        setUpdateData(updatedEduInfo[index]);
    };

    const handleSave = () => {
        axios.put(`${BASE_URL}:9021/user/education/update/${updateData.educationId}`, updateData).then(res=>{
          alert("updated");
          setUpdateData({});
          setEditRowId(null);
        }).catch(err=>{
          alert(err);
        })
    }

    const column = [
        {
            name: "Institute Name",
            selector: row => row.educationId === editRowId ? (
                <input 
                    type="text" 
                    value={row.instituteName} 
                    onChange={(e) => handleInputChange(empEducationInfo.indexOf(row), 'instituteName', e.target.value)}
                />
            ) : row.instituteName,
        },
        {
            name: "Field of Study",
            selector: row => row.educationId === editRowId ? (
                <input 
                    type="text" 
                    value={row.fieldOfStudy} 
                    onChange={(e) => handleInputChange(empEducationInfo.indexOf(row), 'fieldOfStudy', e.target.value)}
                />
            ) : row.fieldOfStudy,
        },
        {
            name: "Qualification",
            selector: row => row.educationId === editRowId ? (
                <input 
                    type="text" 
                    value={row.qualification} 
                    onChange={(e) => handleInputChange(empEducationInfo.indexOf(row), 'qualification', e.target.value)}
                />
            ) : row.qualification,
        },
        {
            name: "Certificate",
            selector: row => row.educationId === editRowId ? (
                <input 
                    type="text" 
                    value={row.certificate} 
                    onChange={(e) => handleInputChange(empEducationInfo.indexOf(row), 'certificate', e.target.value)}
                />
            ) : row.certificate,
        },
        {
            name: "Document Name",
            selector: row => row.educationId === editRowId ? (
                <input 
                    type="text" 
                    value={row.docName} 
                    onChange={(e) => handleInputChange(empEducationInfo.indexOf(row), 'docName', e.target.value)}
                />
            ) : row.docName,
        },
        {
            name: "Actions",
            cell: row => (
                row.educationId === editRowId ? (
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
                fontSize: "13px",
                height: "36px",
                paddingRight: "8px",
                maxWidth: '100%',
                zIndex: 100,
            },
        },
        cells: {
            style: {
                fontWeight: "normal",
                fontSize: "13px",
                paddingRight: "8px",
                color: "#55565B",
                maxWidth: '100%',
                zIndex: 100
            },
        },
    };

    const handleDownload = (documentId, empId, documentName) => {
        axios.get(`${BASE_URL}:8080/employee/download/education/document/${documentId}`, { responseType: 'arraybuffer' })
        .then(res => {
            const contentType = res.headers['content-type'];
            const blob = new Blob([res.data], { type: contentType });
            saveAs(blob, empId + "-" + documentName);
        }).catch(err => {
            alert(err);
        });
    };

    const openDocument = (docId) => {
        navigate(`doc-viewer/${docId}`);
    };

    return (
        <div>
            <div className='bg-white border-[2px] border-gray-200 shadow-lg w-[1220px] rounded-lg py-3 px-4'>
                <div className="flex justify-between items-center">
                    <h4 className='font-semibold mb-1.5 text-sm'>Education</h4>
                    {/* <button 
                        className="text-blue-500 underline" 
                        onClick={handleEditClick}
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button> */}
                </div>
                <DataTable 
                    columns={column} 
                    data={empEducationInfo}
                    customStyles={newStyle}
                />
            </div>
        </div>
    );
}

export default Education_Info;





