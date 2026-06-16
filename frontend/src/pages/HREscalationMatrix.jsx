import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
// Removed FaDownload as download option is not needed

const HREscalationMatrix = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const hrEscalationMatrix = [
    // Level 1: Process Owners - (24 hrs)
    {
      level: 'Level 1',
      function: 'HR Escalation Matrix',
      name: 'Abhay Meshram',
      designation: 'Hiring Support',
      location: 'Mumbai',
      email: 'abhay_meshram@cms.co.in',
      extension: '022 4125 9018',
      timeline: '24 hrs'
    },
    {
      level: 'Level 1',
      function: 'HR Escalation Matrix',
      name: 'Supriya Chavan',
      designation: 'Payroll related Support',
      location: 'Mumbai',
      email: 'payroll_wecare@cms.co.in',
      extension: '022 4125 9086',
      timeline: '24 hrs'
    },
    {
      level: 'Level 1',
      function: 'HR Escalation Matrix',
      name: 'Anita Panchal',
      designation: 'Statutory Support, Reimbursement, LTA',
      location: 'Mumbai',
      email: 'anita_panchal@cms.co.in',
      extension: '022 4125 9041',
      timeline: '24 hrs'
    },
    {
      level: 'Level 1',
      function: 'HR Escalation Matrix',
      name: 'Diwakar Sahau',
      designation: 'Enrollment in SAP, Appointment Letters, Confirmations Letters, SPOC for Operators and Freelancers',
      location: 'Mumbai',
      email: 'diwakar_sahu@cms.co.in',
      extension: '022 4125 9016',
      timeline: '24 hrs'
    },
    {
      level: 'Level 1',
      function: 'HR Escalation Matrix',
      name: 'Vidhi Shinde',
      designation: 'Onboarding & Employee Joining formalities',
      location: 'Mumbai',
      email: 'vidhi_shinde@cms.co.in',
      extension: '022 4125 9016',
      timeline: '24 hrs'
    },
    {
      level: 'Level 1',
      function: 'HR Escalation Matrix',
      name: 'Ankita Bhosle',
      designation: 'Induction & Training Support',
      location: 'Mumbai',
      email: 'ankita_bhosle@cms.co.in',
      extension: '022 4125 9027',
      timeline: '24 hrs'
    },
    {
      level: 'Level 1',
      function: 'HR Escalation Matrix',
      name: 'Manali Tupe',
      designation: 'F&F, settlements and Exit process',
      location: 'Mumbai',
      email: 'manali_tupe@cms.co.in',
      extension: '022 4125 9085',
      timeline: '24 hrs'
    },
    {
      level: 'Level 1',
      function: 'HR Escalation Matrix',
      name: 'Akshay Shigvan',
      designation: 'Attendance & Leave Management, Employee Mediclaim Benefits & 3rd Party payroll vendor support',
      location: 'Mumbai',
      email: 'akshay_shigvan@cms.co.in',
      extension: '022 4125 9089',
      timeline: '24 hrs'
    },
    // Level 2: Escalation to Departmental Managers (48 hrs)
    {
      level: 'Level 2',
      function: 'HR Escalation Matrix',
      name: 'TBH',
      designation: 'Talent Management',
      location: 'Mumbai',
      email: '',
      extension: '',
      timeline: '48 hrs'
    },
    {
      level: 'Level 2',
      function: 'HR Escalation Matrix',
      name: 'Naina Khade',
      designation: 'Talent Acquisition',
      location: 'Mumbai',
      email: 'naina_khade@cms.co.in',
      extension: '022 4125 9003',
      timeline: '48 hrs'
    },
    {
      level: 'Level 2',
      function: 'HR Escalation Matrix',
      name: 'Jitendra Shitire',
      designation: 'Talent Acquisition',
      location: 'Mumbai',
      email: 'jitendra_shitire@cms.co.in',
      extension: '022 4125 9164',
      timeline: '48 hrs'
    },
    {
      level: 'Level 2',
      function: 'HR Escalation Matrix',
      name: 'Minal Patne',
      designation: 'Shared Services,Appraisals & Variables support',
      location: 'Mumbai',
      email: 'minal_patne@cms.co.in',
      extension: '022 4125 9093',
      timeline: '48 hrs'
    },
    {
      level: 'Level 2',
      function: 'HR Escalation Matrix',
      name: 'Mrudul Mangoli',
      designation: 'Policies, Processes, CDL Support & MIS',
      location: 'Mumbai',
      email: 'mrudul_mangoli@cms.co.in',
      extension: '022 4125 9013',
      timeline: '48 hrs'
    },
    {
      level: 'Level 2',
      function: 'HR Escalation Matrix',
      name: 'Varada Rotti',
      designation: 'L&D and Trainings Support',
      location: 'Bengaluru',
      email: 'varada_rotti@cms.co.in',
      extension: '9359538144',
      timeline: '48 hrs'
    },
    {
      level: 'Level 2',
      function: 'HR Escalation Matrix',
      name: 'Shabnam Kulkarni',
      designation: 'HRBP',
      location: 'Mumbai',
      email: 'kulkarni_shabnam@cms.co.in',
      extension: '022 4125 9153',
      timeline: '48 hrs'
    },
    // Level 3: Escalation to Head of the Department (72hrs)
    {
      level: 'Level 3',
      function: 'HR Escalation Matrix',
      name: 'Manisha Patil',
      designation: 'HOD',
      location: '',
      email: 'manisha_vagal@cms.co.in',
      extension: '022 4125 9005',
      timeline: '72 hrs'
    },
  ];

const hrSpocsData = [
  { name: 'Varsha Kulkarni', designation: 'SR EXECUTIVE-HR', location: 'Bengaluru', email: 'VARSHA_KULKARNI@CMS.CO.IN', extension: '9739977523' },
  { name: 'Anitha Singh', designation: 'SR EXECUTIVE-TA', location: 'Bengaluru', email: 'ANITHA_SINGH@CMS.CO.IN', extension: '9741631988' }, // Corrected based on image
  { name: 'S GOPINATH', designation: 'SR EXECUTIVE-HR OPS & ADM', location: 'Chennai', email: 'S_GOPINATH@CMS.CO.IN', extension: '9566164254' },
  { name: 'Rakesh Kumar', designation: 'SR OFFICER-ADMIN', location: 'Delhi', email: 'RAKESH_KUMAR@CMS.CO.IN', extension: '9868925034' },
  { name: 'UNNIKRISHNAN G', designation: 'SR EXECUTIVE-ADMIN', location: 'Thiruvananthapuram', email: 'UNNIKRISHNAN_G@CMS.CO.IN', extension: '9400107696' },
  { name: 'Sikha Raju', designation: 'EXECUTIVE-HR', location: 'Hyderabad', email: 'SIKHA_RAIJU@CMS.CO.IN', extension: '7989910917' },
  { name: 'Iti Sharma', designation: 'EXECUTIVE-CUSTOMER SERVICE', location: 'Lucknow', email: 'ITI_SHARMA@CMS.CO.IN', extension: '7738534161' },
  { name: 'Aradhana Shukla', designation: 'PROJECT HR', location: 'Lucknow', email: 'ARADHANA_SHUKLA@CMS.CO.IN', extension: '8726516318' }, // Corrected email case
  { name: 'Priyanka Das', designation: 'EXECUTIVE-HR', location: 'Kolkata', email: 'PRIYANKA_DAS@CMS.CO.IN', extension: '9038016509' },
];
  const level1Data = hrEscalationMatrix.filter(item => item.level === 'Level 1');
  const level2Data = hrEscalationMatrix.filter(item => item.level === 'Level 2');
  const level3Data = hrEscalationMatrix.filter(item => item.level === 'Level 3');

return (
  <>
    <Header />
    <div className="p-6 md:p-10 min-h-screen bg-[#f8f9fa] mt-14">
      <div className="text-gray-600 text-sm mb-4 font-content">
        <span
          onClick={() => navigate('/dashboard')}
          className="hover:underline cursor-pointer text-black"
        >
          Home
        </span>
        <span> / </span>
        <span
          onClick={() => navigate('/infohub')}
          className="hover:underline cursor-pointer text-black"
        >
          Info Hub
        </span>
        <span> / </span>
        <span className="text-black font-semibold font-content">HR Escalation Matrix</span>
      </div>

      <h1 className="text-4xl font-bold text-[#222] mb-8 font-header">HR Escalation Matrix</h1>

      {/* Level 1 Table: Process Owners (24 hrs) */}
      <h2 className="text-lg text-gray-800 mb-4 font-content">Level 1: Process Owners (24 hrs)</h2>
      <div className="bg-white rounded-md shadow-md overflow-x-auto mb-12">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold font-header">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Function</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">E-mail ID</th>
              {/* Increased width for Extension No. column */}
              <th className="px-6 py-3 whitespace-nowrap w-fit">Extension No.</th> 
              <th className="px-6 py-3">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {level1Data.map((data, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-content">{data.name}</td>
                <td className="px-6 py-4 font-content">{data.designation}</td>
                <td className="px-6 py-4 font-content">{data.location}</td>
                <td className="px-6 py-4 font-content">{data.email}</td>
                {/* Increased width for Extension No. column */}
                <td className="px-6 py-4 font-content whitespace-nowrap w-fit">{data.extension}</td>
                <td className="px-6 py-4 font-content">{data.timeline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Level 2 Table: Escalation to Departmental Managers (48 hrs) */}
      <h2 className="text-lg text-gray-800 mb-4 font-content">Level 2: Escalation to Departmental Managers (48 hrs)</h2>
      <div className="bg-white rounded-md shadow-md overflow-x-auto mb-12">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold font-header">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Function</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">E-mail ID</th>
              {/* Increased width for Extension No. column */}
              <th className="px-6 py-3 whitespace-nowrap w-fit">Extension No.</th>
              <th className="px-6 py-3">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {level2Data.map((data, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-content">{data.name}</td>
                <td className="px-6 py-4 font-content">{data.designation}</td>
                <td className="px-6 py-4 font-content">{data.location}</td>
                <td className="px-6 py-4 font-content">{data.email}</td>
                {/* Increased width for Extension No. column */}
                <td className="px-6 py-4 font-content whitespace-nowrap w-fit">{data.extension}</td>
                <td className="px-6 py-4 font-content">{data.timeline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Level 3 Table: Escalation to Head of the Department (72 hrs) */}
      <h2 className="text-lg text-gray-800 mb-4 font-content">Level 3: Escalation to Head of the Department (72 hrs)</h2>
      <div className="bg-white rounded-md shadow-md overflow-x-auto mb-12">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold font-header">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Function</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">E-mail ID</th>
              {/* Increased width for Extension No. column */}
              <th className="px-6 py-3 whitespace-nowrap w-fit">Extension No.</th>
              <th className="px-6 py-3">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {level3Data.map((data, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-content">{data.name}</td>
                <td className="px-6 py-4 font-content">{data.designation}</td>
                <td className="px-6 py-4 font-content">{data.location}</td>
                <td className="px-6 py-4 font-content">{data.email}</td>
                {/* Increased width for Extension No. column */}
                <td className="px-6 py-4 font-content whitespace-nowrap w-fit">{data.extension}</td>
                <td className="px-6 py-4 font-content">{data.timeline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HR LOCATION SPOCS Table */}
      <h2 className="text-3xl font-bold text-[#222] mb-6 font-header">HR Location SPOCS</h2>
      <div className="bg-white rounded-md shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold font-header">
            <tr>
              <th className="px-6 py-3">NAME</th>
              <th className="px-6 py-3">DESIGNATION</th>
              <th className="px-6 py-3">LOCATION OFFICE</th>
              <th className="px-6 py-3">E-MAIL ID</th>
              {/* Increased width for Extension No. column */}
              <th className="px-6 py-3 whitespace-nowrap w-fit">EXTENSION NO.</th> 
            </tr>
          </thead>
          <tbody>
            {hrSpocsData.map((spoc, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-content">{spoc.name}</td>
                <td className="px-6 py-4 font-content">{spoc.designation}</td>
                <td className="px-6 py-4 font-content">{spoc.location}</td>
                <td className="px-6 py-4 font-content">{spoc.email}</td>
                {/* Increased width for Extension No. column */}
                <td className="px-6 py-4 font-content whitespace-nowrap w-fit">{spoc.extension}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border border-[#923A39] text-[#923A39] bg-white rounded-xl px-4 py-3 flex items-start gap-2 text-sm font-content">
        <span className="text-xl">⭐</span>Please follow the escalation levels sequentially for efficient resolution of your concerns. Contact HR Location SPOCS for specific regional queries.
      </div>
    </div>
  </>
);
};

export default HREscalationMatrix;