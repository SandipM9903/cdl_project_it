import React, { useEffect, useState } from 'react';
import { BsFillClipboardCheckFill, BsFillPersonCheckFill } from "react-icons/bs";
import { FaComputer, FaStore, FaUsersBetweenLines, FaRegCircleXmark } from 'react-icons/fa6';
import { RiAdminFill, RiFolderTransferLine } from "react-icons/ri";
import { GiReceiveMoney } from "react-icons/gi";
import { IoIosPerson } from "react-icons/io";
import FNFForm from './SurveyQuestions/FNFForm';
import SalesForm from './SurveyQuestions/SalesForm';
import StoreForm from './SurveyQuestions/StoreForm';
import AdminForm from './SurveyQuestions/AdminForm';
import FinanceForm from './SurveyQuestions/FinanceForm';
import ITForm from './SurveyQuestions/ITForm';
import HRForm from './SurveyQuestions/HRForm';
import KT from './SurveyQuestions/KT';
import BUForm from './SurveyQuestions/BUForm';
import axios from 'axios';
import { TiTick } from "react-icons/ti";
import { BiSolidUpArrow } from "react-icons/bi";
import { BASE_URL } from '../../../config/Config';


function ExitFormFNF({ closeFNF, resignationDetails, resignationData }) {

  console.log(resignationDetails, "resignationDetailsresignationDetails")

  const [exitFormData, setExitFormData] = useState({});
  const [ktFormData, setKTFormData] = useState({});
  const [salesFormData, setSalesFormData] = useState({});
  const [storeFormData, setStoreFormData] = useState({});
  const [adminFormData, setAdminFormData] = useState({});
  const [financeFormData, setFinanceFormData] = useState({});
  const [itFormData, setITFormData] = useState({});
  const [hrFormData, setHRFormData] = useState({});
  const [buFormData, setBUFormData] = useState({});
  const [status, setStatus] = useState({});

  // const empCode = sessionStorage.getItem("UserId");
  // const empCode = 4;

  const fetchData = () => {

    console.log("dsjvnsdjnvjdsnj" + resignationDetails.wfSeqId)
    axios.get(`${BASE_URL}:9029/api/eSeparation/getExitFormDetails/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setExitFormData(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })

    axios.get(`${BASE_URL}:9029/api/eSeparation/getKTFormDetails/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setKTFormData(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })
    axios.get(`${BASE_URL}:9029/api/eSeparation/getSalesFormDetails/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setSalesFormData(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })
    axios.get(`${BASE_URL}:9029/api/eSeparation/getStoreFormDetails/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setStoreFormData(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })
    axios.get(`${BASE_URL}:9029/api/eSeparation/getAdminFormDetails/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setAdminFormData(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })
    axios.get(`${BASE_URL}:9029/api/eSeparation/getFinanceFormDetails/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setFinanceFormData(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })
    axios.get(`${BASE_URL}:9029/api/eSeparation/getITFormDetails/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setITFormData(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })
    axios.get(`${BASE_URL}:9029/api/eSeparation/getHRFormDetails/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setHRFormData(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })
    console.log("resignation detailssssss" + resignationDetails.wfSeqId);
    axios.get(`${BASE_URL}:9029/api/eSeparation/getBUFormDetails/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setBUFormData(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })
    axios.get(`${BASE_URL}:9028/api/workflow/getStatus/${resignationDetails.wfSeqId}`)
      .then((res) => {
        setStatus(res.data);
      })
      .catch(() => {
        console.log("No data filled yet")
      })
  }

  useEffect(() => {
    fetchData();
  }, [])
  const [activeTab, setActiveTab] = useState('exitForm')

  useEffect(() => {
  }, [activeTab]);

  console.log(status, "+++++++++++++")

  // const completedTabs = [
  //   status["KT"],
  //   status["Sales"],
  //   status["Store"],
  //   status["Admin"],
  //   status["Finance"],
  //   status["IT"],
  //   status["HR"],
  //   status["BU"]
  // ].filter(status => status === 'Approved').length;
  // const progressWidth = `${completedTabs * 12.50.toFixed(2)}%`;
  const completedTabs = [
  status["KT"],
  // status["Sales"],
  status["Store"],
  status["Admin"],
  status["Finance"],
  status["IT"],
  status["HR"],
  resignationDetails.fnfEnableForBu ? status["BU"] : null,  // only include if true
  resignationDetails.fnfEnableForSales ? status["Sales"] : null  // only include if true
].filter(status => status === 'Approved').length;
// Calculate total applicable tabs
// const totalTabs = resignationDetails.fnfEnableForBu ? 8 : 7;

let totalTabs = 6;
if (resignationDetails.fnfEnableForBu) totalTabs++;
if (resignationDetails.fnfEnableForSales) totalTabs++;

const progressWidth = `${((completedTabs / totalTabs) * 100).toFixed(2)}%`;
console.log(totalTabs, completedTabs,"}}}}}}}}}}}}}}}}}")

  return (
    <div className='container mx-auto z-200'>
      <div className='flex items-center lg:gap-40 md:gap-12 gap-2 mx-4 mt-5'>
        <h1 className='text-base lg:w-auto md:w-72 w-40 font-semibold text-gray-800'>Full and Final Settlement Form & Departmental Clearance</h1>
        <div className="w-56 bg-gray-200 rounded-full h-3">
          <div className="bg-[#1FD127] h-3 rounded-full" style={{ width: progressWidth }}></div>
        </div>
        <h1 className=' lg:-ml-36'>{progressWidth} {progressWidth >= '100%' ? 'Completed' : 'Complete'}</h1>
        <button className='text-red-500 text-xl ml-10' onClick={closeFNF}><FaRegCircleXmark /></button>
      </div>
      <div className="text-[15px] font-bold text-center text-gray-700 mx-4 mt-12">
        <ul className="flex flex-wrap -mb-px gap-4"> 
          <li className="">
            {exitFormData.exitFormStatus === 'Submitted' && (
              <div >
                <h1 className='text-3xl text-[#1FD127] mx-10'><TiTick /></h1>
              </div>
            )}
            <button onClick={() => setActiveTab('exitForm')} className={`inline-block py-2 px-3 border font-medium text-white ${exitFormData.exitFormStatus === 'Submitted' ? 'bg-[#1FD127]' : 'bg-[#3EA2DB] mt-[30px]'}`}>
              <div className=' items-center'>
                <h1 className='px-7 text-2xl'><BsFillClipboardCheckFill /></h1>
                <h1 className='text-sm'>Exit Form</h1>
                <h1 className='text-xs'>Status: {exitFormData.exitFormStatus || 'Pending'}</h1>
              </div>
            </button>
            {(activeTab === 'exitForm') && (
              <div >
                <h1 className='text-xl text-gray-600 mx-10'><BiSolidUpArrow /></h1>
              </div>
            )}
          </li>
          {exitFormData.exitFormStatus === 'Submitted' && (
            <>
              <li className="">
                {status["KT"] === 'Approved' && (
                  <div >
                    <h1 className='text-3xl text-[#1FD127] mx-10'><TiTick /></h1>
                  </div>
                )}
                <button onClick={() => setActiveTab('kt')} className={`inline-block py-2 px-3 border font-medium ${status["KT"] === 'Approved' ? "bg-[#1FD127] text-white" : (status["KT"] === 'Rejected') ? 'bg-[#FF0000] text-white mt-[30px]' : (status["KT"] === 'Hold') ? "bg-[#FFF100] text-white mt-[30px]" : (activeTab === 'kt') ? 'bg-blue-400 text-white  mt-[30px]' : 'border-gray-400 hover:text-gray-900 mt-[30px]'}`}>
                  <div className=' items-center'>
                    <h1 className=' px-7 text-2xl'><RiFolderTransferLine /></h1>
                    <h1 className='text-sm'>KT</h1>
                    <h1 className='text-xs'>Status: {status["KT"] || "Not available"}</h1>
                  </div>
                </button>
                {(activeTab === 'kt') && (
                  <div >
                    <h1 className='text-xl text-gray-600 mx-10'><BiSolidUpArrow /></h1>
                  </div>
                )}
              </li>
              {resignationDetails.fnfEnableForSales === true && (
              <li className="mx-[1px]">
                {status["Sales"] === 'Approved' && (
                  <div >
                    <h1 className='text-3xl text-[#1FD127] mx-10'><TiTick /></h1>
                  </div>
                )}
                <button onClick={() => setActiveTab('sales')} className={`inline-block py-2 px-3 border font-medium ${status["Sales"] === 'Approved' ? "bg-[#1FD127] text-white" : (status["Sales"] === 'Rejected') ? 'bg-[#FF0000] text-white mt-[30px]' : (status["Sales"] === 'Hold') ? "bg-[#FFF100] text-white mt-[30px]" : (activeTab === 'sales') ? 'bg-blue-400 text-white mt-[30px]' : 'border-gray-400 hover:text-gray-900 mt-[30px]'}`}>
                  <div className='text-center'>
                    <h1 className=' px-7 text-2xl'><FaUsersBetweenLines /></h1>
                    <h1 className='text-sm font-semibold'>Sales</h1>
                    <h1 className='text-xs'>Status: {status["Sales"] || "Not available"}</h1>
                  </div>
                </button>
                {(activeTab === 'sales') && (
                  <div >
                    <h1 className='text-xl text-gray-600 mx-10'><BiSolidUpArrow /></h1>
                  </div>
                )}
              </li>
              )}
              <li className="">
                {status["Store"] === 'Approved' && (
                  <div >
                    <h1 className='text-3xl text-[#1FD127] mx-10'><TiTick /></h1>
                  </div>
                )}
                <button onClick={() => setActiveTab('store')} className={`inline-block py-2 px-3 border font-medium ${status["Store"] === 'Approved' ? "bg-[#1FD127] text-white" : (status["Store"] === 'Rejected') ? 'bg-[#FF0000] text-white mt-[30px]' : (status["Store"] === 'Hold') ? "bg-[#FFF100] text-white mt-[30px]" : (activeTab === 'store') ? 'bg-blue-400 text-white mt-[30px]' : 'border-gray-400 hover:text-gray-900 mt-[30px]'}`}>
                  <div className='text-center'>
                    <h1 className=' px-7 text-2xl'><FaStore /></h1>
                    <h1 className='text-sm'>Store</h1>
                    <h1 className='text-xs'>Status: {status["Store"] || "Not available"}</h1>
                  </div>
                </button>
                {(activeTab === 'store') && (
                  <div >
                    <h1 className='text-xl text-gray-600 mx-10'><BiSolidUpArrow /></h1>
                  </div>
                )}
              </li>
              <li className="mx-[1px]">
                {status["Admin"] === 'Approved' && (
                  <div >
                    <h1 className='text-3xl text-[#1FD127] mx-10'><TiTick /></h1>
                  </div>
                )}
                <button onClick={() => setActiveTab('admin')} className={`inline-block py-2 px-3 border font-medium ${status["Admin"] === 'Approved' ? "bg-[#1FD127] text-white" : (status["Admin"] === 'Rejected') ? 'bg-[#FF0000] text-white mt-[30px]' : (status["Admin"] === 'Hold') ? "bg-[#FFF100] text-white mt-[30px]" : (activeTab === 'admin') ? 'bg-blue-400 text-white mt-[30px]' : 'border-gray-400 hover:text-gray-900 mt-[30px]'}`}>
                  <div className='text-center'>
                    <h1 className=' px-7 text-2xl'><RiAdminFill /></h1>
                    <h1 className='text-sm'>Admin</h1>
                    <h1 className='text-xs'>Status: {status["Admin"] || "Not available"}</h1>
                  </div>
                </button>
                {(activeTab === 'admin') && (
                  <div >
                    <h1 className='text-xl text-gray-600 mx-10'><BiSolidUpArrow /></h1>
                  </div>
                )}
              </li>
              <li className="mx-[1px]">
                {status["Finance"] === 'Approved' && (
                  <div >
                    <h1 className='text-3xl text-[#1FD127] mx-10'><TiTick /></h1>
                  </div>
                )}
                <button onClick={() => setActiveTab('finance')} className={`inline-block py-2 px-3 border font-medium ${status["Finance"] === 'Approved' ? "bg-[#1FD127] text-white" : (status["Finance"] === 'Rejected') ? 'bg-[#FF0000] text-white mt-[30px]' : (status["Finance"] === 'Hold') ? "bg-[#FFF100] text-white mt-[30px]" : (activeTab === 'finance') ? 'bg-blue-400 text-white mt-[30px]' : 'border-gray-400 hover:text-gray-900 mt-[30px]'}`}>
                  <div className='text-center'>
                    <h1 className=' px-7 text-2xl'><GiReceiveMoney /></h1>
                    <h1 className='text-sm'>Finance</h1>
                    <h1 className='text-xs'>Status:{status["Finance"] || "Not available"}</h1>
                  </div>
                </button>
                {(activeTab === 'finance') && (
                  <div >
                    <h1 className='text-xl text-gray-600 mx-10'><BiSolidUpArrow /></h1>
                  </div>
                )}
              </li>
              <li className="mx-[1px]">
                {status["IT"] === 'Approved' && (
                  <div >
                    <h1 className='text-3xl text-[#1FD127] mx-10'><TiTick /></h1>
                  </div>
                )}
                <button onClick={() => setActiveTab('it')} className={`inline-block py-2 px-3 border font-medium ${status["IT"] === 'Approved' ? "bg-[#1FD127] text-white" : (status["IT"] === 'Rejected') ? 'bg-[#FF0000] text-white mt-[30px]' : (status["IT"] === 'Hold') ? "bg-[#FFF100] text-white mt-[30px]" : (activeTab === 'it') ? 'bg-blue-400 text-white mt-[30px]' : 'border-gray-400 hover:text-gray-900 mt-[30px]'}`}>
                  <div className='text-center'>
                    <h1 className=' px-7 text-2xl'><FaComputer /></h1>
                    <h1 className='text-sm'>IT</h1>
                    <h1 className='text-xs'>Status: {status["IT"] || "Not available"}</h1>
                  </div>
                </button>
                {(activeTab === 'it') && (
                  <div >
                    <h1 className='text-xl text-gray-600 mx-10'><BiSolidUpArrow /></h1>
                  </div>
                )}
              </li>
              <li className="mx-[1px]">
                {status["HR"] === 'Approved' && (
                  <div >
                    <h1 className='text-3xl text-[#1FD127] mx-10'><TiTick /></h1>
                  </div>
                )}
                <button onClick={() => setActiveTab('hr')} className={`inline-block py-2 px-3 border font-medium ${status["HR"] === 'Approved' ? "bg-[#1FD127] text-white" : (status["HR"] === 'Rejected') ? 'bg-[#FF0000] text-white mt-[30px]' : (status["HR"] === 'Hold') ? "bg-[#FFF100] text-white mt-[30px]" : (activeTab === 'hr') ? 'bg-blue-400 text-white mt-[30px]' : 'border-gray-400 hover:text-gray-900 mt-[30px]'}`}>
                  <div className='text-center'>
                    <h1 className=' px-7 text-2xl'><BsFillPersonCheckFill /></h1>
                    <h1 className='text-sm'>HR</h1>
                    <h1 className='text-xs'>Status: {status["HR"] || "Not available"}</h1>
                  </div>
                </button>
                {(activeTab === 'hr') && (
                  <div >
                    <h1 className='text-xl text-gray-600 mx-10'><BiSolidUpArrow /></h1>
                  </div>
                )}
              </li>
              {resignationDetails.fnfEnableForBu === true && (
                <li className="mx-[1px]">
                  {status["BU"] === 'Approved' && (
                    <div >
                      <h1 className='text-3xl text-[#1FD127] mx-10'><TiTick /></h1>
                    </div>
                  )}
                  <button onClick={() => setActiveTab('bu')} className={`inline-block py-2 px-3 border font-medium ${status["BU"] === 'Approved' ? "bg-[#1FD127] text-white" : (status["BU"] === 'Rejected') ? 'bg-[#FF0000] text-white mt-[30px]' : (status["BU"] === 'Hold') ? "bg-[#FFF100] text-white mt-[30px]" : (activeTab === 'bu') ? 'bg-blue-400 text-white mt-[30px]' : 'border-gray-400 hover:text-gray-900 mt-[30px]'}`}>
                    <div className='text-center'>
                      <h1 className=' px-7 text-2xl'><IoIosPerson /></h1>
                      <h1 className='text-sm'>BU</h1>
                      <h1 className='text-xs'>Status: {status["BU"] || "Not available"}</h1>
                    </div>
                  </button>
                  {(activeTab === 'bu') && (
                    <div >
                      <h1 className='text-xl text-gray-600 mx-10'><BiSolidUpArrow /></h1>
                    </div>
                  )}
                </li>
              )}
            </>
          )}
        </ul>
      </div>
      <div className="mt-4">
        {activeTab === 'exitForm' && <FNFForm exitFormData={exitFormData} fetchData={fetchData} resignationDetails={resignationDetails} closeFNF={closeFNF} />}
        {activeTab === 'kt' && <KT  ktFormData={ktFormData} wfSeqId={exitFormData.wfSeqId}  />}
        {activeTab === 'sales' && <SalesForm salesFormData={salesFormData} wfSeqId={exitFormData.wfSeqId}/>}
        {activeTab === 'store' && <StoreForm storeFormData={storeFormData} wfSeqId={exitFormData.wfSeqId} />}
        {activeTab === 'admin' && <AdminForm adminFormData={adminFormData} wfSeqId={exitFormData.wfSeqId}/>}
        {activeTab === 'finance' && <FinanceForm financeFormData={financeFormData} wfSeqId={exitFormData.wfSeqId}/>}
        {activeTab === 'it' && <ITForm itFormData={itFormData} wfSeqId={exitFormData.wfSeqId} />}
        {activeTab === 'hr' && <HRForm hrFormData={hrFormData} wfSeqId={exitFormData.wfSeqId}/>}
        {activeTab === 'bu' && <BUForm buFormData={buFormData} wfSeqId={exitFormData.wfSeqId} />}
      </div>
    </div>
  );
}


export default ExitFormFNF;