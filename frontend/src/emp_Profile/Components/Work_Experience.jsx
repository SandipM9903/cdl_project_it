import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaEye } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { BASE_URL } from '../../config/Config';

function Work_Experience() {
    const [empWorkExperience, setEmpWorkExperience] = useState([]);
    const [updateData, setUpdateData] = useState({});
    const navigate = useNavigate('');
    const [editRowId, setEditRowId] = useState(null);

    const email = localStorage.getItem('email');
    const empId = localStorage.getItem('empId');
  
    useEffect(() => {
        axios
        // .get(`${BASE_URL}:9020/employee/by/email/${email}`)
        .get(`${BASE_URL}:9020/employee/eCode/${empId}`)
        .then((response) => {
            // setEmpData(response.data.fileAndObjectTypeBean.empResDTO);
            // setUserData(response.data.userDTO);
            setEmpWorkExperience(response.data.userDTO.experienceResDTOS);
        })
        .catch((error) => {
            console.log("Error fetching data:", error);
        });
    }, []);

    const handleEditClick = (row) => {
        setEditRowId(row.experienceId);
        setUpdateData(row);
    }

    const handleInputChange = (index, field, value) => {
        // Update the selected dependent row and prepare the updateData object
        const updatedWorkExp = [...empWorkExperience];
        updatedWorkExp[index] = { ...empWorkExperience[index], [field]: value };
        setEmpWorkExperience(updatedWorkExp);

        // Set the object to be updated
        setUpdateData(updatedWorkExp[index]);
    };

    const handleSave = () => {
        axios.put(`${BASE_URL}:9021/user/exp/update/${updateData.experienceId}`, updateData).then(res=>{
          alert("updated");
          setUpdateData({});
          setEditRowId(null);
        }).catch(err=>{
          alert(err);
        })
    }

    const column = [
        {
            name: "Company Name",
            selector: row => row.experienceId === editRowId ? (
                <input 
                    type="text" 
                    value={row.companyName} 
                    onChange={(e) => handleInputChange(empWorkExperience.indexOf(row), 'companyName', e.target.value)}
                />
            ) : row.companyName,
            wrap: true,
        },
        {
            name: "Job Title",
            selector: row => row.experienceId === editRowId ? (
                <input 
                    type="text" 
                    value={row.jobTitle} 
                    onChange={(e) => handleInputChange(empWorkExperience.indexOf(row), 'jobTitle', e.target.value)}
                />
            ) : row.jobTitle,
            wrap: true,
        },
        {
            name: "Experience",
            selector: row => row.experienceId === editRowId ? (
                <input 
                    type="text" 
                    value={row.experience} 
                    onChange={(e) => handleInputChange(empWorkExperience.indexOf(row), 'experience', e.target.value)}
                />
            ) : row.experience,
            wrap: true,
        },
        {
            name: "From Date",
            selector: row => row.experienceId === editRowId ? (
                <input 
                    type="date" 
                    value={row.dateOfJoining} 
                    onChange={(e) => handleInputChange(empWorkExperience.indexOf(row), 'dateOfJoining', e.target.value)}
                />
            ) : row.dateOfJoining,
        },
        {
            name: "To Date",
            selector: row => row.experienceId === editRowId ? (
                <input 
                    type="date" 
                    value={row.dateOfReliving} 
                    onChange={(e) => handleInputChange(empWorkExperience.indexOf(row), 'dateOfReliving', e.target.value)}
                />
            ) : row.dateOfReliving,
        },
        {
            name: "Certification",
            selector: row => row.experienceId === editRowId ? (
                <input 
                    type="text" 
                    value={row.certification} 
                    onChange={(e) => handleInputChange(empWorkExperience.indexOf(row), 'certification', e.target.value)}
                />
            ) : row.certification,
            wrap: true,
        },
        {
            name: "Actions",
            cell: row => (
                row.experienceId === editRowId ? (
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
                paddingRight: "6px",
                maxWidth: "100%",
            },
        },
        cells: {
            style: {
                fontWeight: "normal",
                fontSize: "13px",
                paddingRight: "6px",
                color: "#55565B",
                maxWidth: "100%",
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
        <div className='bg-white border-[2px] border-gray-200 shadow-lg w-[1220px] rounded-lg py-3 px-4'>
            <div className="flex justify-between items-center">
                <h4 className='font-semibold mb-1.5 text-sm'>Work Experience</h4>
            </div>
            <DataTable 
                columns={column} 
                data={empWorkExperience}
                customStyles={newStyle}
            />
        </div>
    );
}

export default Work_Experience;
