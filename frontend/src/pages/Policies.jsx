import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { CiUser } from "react-icons/ci";
import { FaRegFilePdf } from "react-icons/fa";
import { HiBuildingOffice } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { BASE_URL } from '../config/Config';


function Policies() {
  const [value, setValue] = useState(0);
  const [companyPolicy, setCompanyPolicy] = useState([]);
  const [myDocData, setMyDocData] = useState([]);
  const [option, setOption] = useState();
 useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);
  const navigate = useNavigate();
  const view = 'pdfAll';

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const options1 = ['All', 'Folder'];
  const defaultOption1 = options1[0];

  const handleSelect = (selectedOption) => {
    setOption(`${selectedOption.value}`);
  };

  if (option === "Folder") {
    navigate("/folder", { state: { data: { option } } });
  }

  useEffect(() => {
    setCompanyPolicy([]);
    setMyDocData([]);
    if (value === 0) {
      getCompanyPolicies();
    } else {
      getMyDocData();
    }
  }, [value]);

  const getCompanyPolicies = () => {
    axios
      .get(`${BASE_URL}/documents/root-company_policies`)
      .then((response) => {
        setCompanyPolicy(response.data);
      })
      .catch((error) => console.log(error));
  };

  const getMyDocData = () => {
    axios
      .get(`${BASE_URL}/documents/my-documents/${localStorage.getItem('empId')}`)
      .then((response) => {
        setMyDocData(response.data);
      })
      .catch((error) => console.log(error));
  };

  const handleOpen = (fileName, docName) => {
    navigate(`/doc-viewer/${fileName}/${docName}/${view}`);
  };

  const monthMapping = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
    7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December',
  };

  const documentNameCell1 = (row) => (
    <div
      className='flex gap-5 font-semibold items-center cursor-pointer'
      onClick={() => handleOpen(row.docId, 'Company Policy')}
    >
      <FaRegFilePdf className='text-xl' />
      {row.itemName.split("-")[row.itemName.split("-").length - 1]}
    </div>
  );

  const documentNameCell2 = (row) => (
    <div
      className='flex gap-5 font-semibold items-center cursor-pointer'
      onClick={() => handleOpen(row.docId, 'my Documents')}
    >
      <FaRegFilePdf className='text-xl' />
      {row.itemName.split("-")[row.itemName.split("-").length - 1]}
    </div>
  );

  let columns = [
    {
      name: 'Shared To',
      selector: row =>
        value === 0 ? 'All Locations' : row.location.split(".")[row.location.split(".").length - 1],
    },
    {
      name: 'Folder',
      selector: row =>
        value === 0 ? 'Company Policies' : row.docPath.split("\\")[0],
    },
    {
      name: 'Modified On',
      selector: row => {
        if (!row.createdDate) return '';
        const date = new Date(row.createdDate);
        return `${date.getDate()}-${monthMapping[date.getMonth() + 1]}-${date.getFullYear()}`;
      }
    },
  ];

  columns.unshift({
    name: 'Document Name',
    cell: (row) => (value === 0 ? documentNameCell1(row) : documentNameCell2(row)),
  });

  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem('role')) || [];
  } catch (e) {
    console.error('Error parsing roles from sessionStorage:', e);
  }

  const hasRole = (role) => roles.includes(role);

  return (
    <div className="">

<Header/>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-full mt-20 p-6">
        <div className="bg-white-300">
          <div className='flex'>
            <div>
              <Box sx={{ width: '100%' }}>
                <Tabs onChange={handleChange} value={value} selectionFollowsFocus>
                  <Tab label="Company" icon={<HiBuildingOffice className='text-xl' />} iconPosition='start' />
                  {/* <Tab label="My Documents" icon={<CiUser className='text-xl font-bolder' />} iconPosition='start' /> */}
                </Tabs>
              </Box>
            </div>
            {/* <div className='flex items-center ml-28'>
              <h1 className='mx-4'>Select View</h1>
              <Dropdown options={options1} onChange={handleSelect} value={defaultOption1} placeholder="Select an option" />
            </div> */}
          </div>

          <h1 className='border-b-[1px] border-blue-900 w-96 table table-striped'></h1>

          <DataTable
            columns={columns}
            data={value === 0 ? companyPolicy : myDocData}
          />
        </div>
      </div>
    </div>
  );
}

export default Policies;
