import { useState } from 'react';
import {
  FaPlus,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import Header from '../components/Header';

const managerData = [
  { name: 'Raj Arora', code: 'REG0001', type: 'OnDuty', count: 1 },
  { name: 'Raj Arora', code: 'REG0000', type: 'Timesheet Entry', count: 1 },
  { name: 'Raj Arora', code: 'REG0000', type: 'Travel', count: 1 },
  { name: 'Raj Arora', code: 'REG0000', type: 'Loan', count: 1 },
  { name: 'Kunal Bharti', code: 'REG004', type: 'Timesheet Entry', count: 1 },
  { name: 'Kunal Sharma', code: 'APP001', type: 'SelfService_PermissionFormTo', count: 1 },
  { name: 'Raj Arora', code: 'REG0000', type: 'Selfservice Separation', count: 1 },
  { name: 'Raj Arora', code: 'REG0000', type: 'Attendance Regularization', count: 1 },
];

const tabList = [
  'Profile',
  'Salary',
  'Payroll',
  'Income Tax',
  'Leave',
  'Attendance',
  'Approval Matrix',
  'Benefit',
];

export default function MyCMS() {
  const [activeTab, setActiveTab] = useState('Approval Matrix');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <div className="p-4 bg-white rounded shadow">Profile Information Content</div>;
      case 'Salary':
        return <div className="p-4 bg-white rounded shadow">Salary Structure Content</div>;
      case 'Payroll':
        return <div className="p-4 bg-white rounded shadow">Payroll History Content</div>;
      case 'Income Tax':
        return <div className="p-4 bg-white rounded shadow">Income Tax Declarations Content</div>;
      case 'Leave':
        return <div className="p-4 bg-white rounded shadow">Leave Balances and Requests</div>;
      case 'Attendance':
        return <div className="p-4 bg-white rounded shadow">Attendance Details</div>;
      case 'Approval Matrix':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-purple-700">Approval Matrix Manager</h3>
              <button className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700">
                <FaPlus />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {managerData.map((manager, index) => (
                <div key={index} className="bg-white shadow rounded p-4 border relative">
                  <div className="font-semibold text-gray-800">
                    {manager.name} ({manager.code})
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{manager.type}</div>
                  <div className="absolute top-2 right-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {manager.count}
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 'Benefit':
        return <div className="p-4 bg-white rounded shadow">Employee Benefits Details</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <Header />

      {/* Profile Header Section */}
      <div className="relative min-h-[200px] rounded-lg overflow-hidden mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1470&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-white opacity-50"></div>
        <div className="flex items-center gap-4 p-6 relative z-10">
          <img
            src="https://i.pravatar.cc/100"
            alt="User"
            className="w-22 h-22 rounded-full"
          />
          <div>
            <h2 className="text-lg font-bold">Sandip Raina</h2>
            <p className="text-sm text-gray-900">Managing Director</p>
          </div>
          <div className="ml-auto space-y-1 text-sm">
            <p className="flex items-center gap-1"><FaPhone /> +91 9230546980</p>
            <p className="flex items-center gap-1"><FaEnvelope /> support@pockethrms.com</p>
            <p className="flex items-center gap-1"><FaMapMarkerAlt /> NAGPUR</p>
            <p className="flex items-center gap-1"><FaCalendarAlt /> DOJ: 01/04/2019 | DOB: 12/02/1980</p>
            <p className="flex items-center gap-1"><FaCheckCircle /> Experience: 3 years 1 month</p>
          </div>
        </div>
      </div>

      {/* Tab List */}
      <div className="flex gap-4 border-b pb-2 mb-4 mt-10">
        {tabList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium ${
              tab === activeTab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render Selected Tab Content */}
      {renderTabContent()}
    </div>
  );
}
