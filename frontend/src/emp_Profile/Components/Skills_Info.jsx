import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BASE_URL } from '../../config/Config';

function Skills_Info() {
    const [empSkillsInfo, setEmpSkillsInfo] = useState([]);
    const [empData, setEmpData] = useState({});
    const [userData, setUserData] = useState({});
    const [isEditable, setIsEditable] = useState(false); // For toggling edit mode

    const email = localStorage.getItem('email');

    useEffect(() => {
        axios
            .get(`${BASE_URL}:9020/employee/by/email/${email}`)
            .then((response) => {
                setEmpData(response.data.fileAndObjectTypeBean.empResDTO);
                setUserData(response.data.userDTO);
                console.log(response.data);
            })
            .catch(error => {
                alert(error);
            });
    }, []);

    // Function to handle edit button click
    const handleEditClick = () => {
        setIsEditable(!isEditable);
    };

    const headers = [
        {
            name: "Skill",
            selector: row => isEditable ? (
                <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleInputChange(e, row, 'name')}
                    className="border-b border-gray-300"
                />
            ) : row.name,
            maxWidth: '380px',
            style: { fontSize: '12px' }
        },
        {
            name: "Level",
            selector: row => isEditable ? (
                <input
                    type="text"
                    value={row.level}
                    onChange={(e) => handleInputChange(e, row, 'level')}
                    className="border-b border-gray-300"
                />
            ) : row.level,
            style: { fontSize: '12px' }
        },
        {
            name: "Exp",
            selector: row => isEditable ? (
                <input
                    type="text"
                    value={row.experience}
                    onChange={(e) => handleInputChange(e, row, 'experience')}
                    className="border-b border-gray-300"
                />
            ) : row.experience,
            style: { fontSize: '12px' }
        }
    ];

    const newStyle = {
        header: {
            style: {
                fontSize: '15px',
                fontWeight: '100px',
                color: '#424242'
            },
        },
        headCells: {
            style: {
                color: 'black',
                fontSize: "12px"
            },
        },
        cells: {
            style: {
                color: "#424242",
                maxWidth: '100%',
            },
        },
    };

    const handleInputChange = (e, row, field) => {
        const updatedSkills = userData.skillResDTOS.map(skill => {
            if (skill.name === row.name) {
                return { ...skill, [field]: e.target.value };
            }
            return skill;
        });
        setUserData({ ...userData, skillResDTOS: updatedSkills });
    };

    return (
        <div>
            <div className='bg-white border-[2px] border-gray-200 shadow-lg w-[380px] rounded-lg py-3 px-4 text-sm relative'>
                <h3 className='font-semibold mb-1.5'>Skills</h3>
                
                {/* Edit Button in Top-Right Corner */}
                <button 
                    onClick={handleEditClick} 
                    className='absolute top-3 right-3 text-xs text-red-700 underline'>
                    {isEditable ? 'Save' : 'Edit'}
                </button>

                <DataTable columns={headers} data={userData.skillResDTOS} customStyles={newStyle} />
            </div>
        </div>
    );
}

export default Skills_Info;
