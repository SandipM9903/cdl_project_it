import React, { useState } from 'react';
import { BsCloudUpload, BsCloudDownload } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Bulkadd({ closeModal }) {
  const [fileName, setFileName] = useState('');
  const [customFields, setCustomFields] = useState(['', '', '', '']);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleCancel = () => {
    setFileName('');
  };

  const downloadExcel = () => {
    const baseHeaders = [
      'Emp name',
      'Emp id',
      'Contact Number',
      'Designation',
      'Department',
      'Location',
      'Reporting Manager',
      'Employee Status',
    ];

    // Filter and include non-empty custom fields
    const customHeaders = customFields.filter((field) => field.trim() !== '');

    const headers = [...baseHeaders, ...customHeaders];
    const data = [headers];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Details');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'EmployeeDetails.xlsx');
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
        <div className="bg-white w-full max-w-5xl h-[550px] p-6 shadow-lg rounded-md overflow-auto">
          <h2 className="text-xl font-semibold pb-4 border-b border-gray-300 flex justify-between">
            Bulk Upload
            <button onClick={closeModal} className="text-red-600">
              <MdOutlineCancel />
            </button>
          </h2>

          <div className="mt-6 flex flex-col md:flex-row md:justify-center md:items-center gap-4 pb-6 border-b border-gray-300">
            {!fileName ? (
              <>
                <label
                  htmlFor="excel-upload"
                  className="flex items-center gap-2 justify-center w-full md:w-auto px-6 py-2 bg-blue-400 text-white text-lg rounded-md hover:bg-blue-600 transition cursor-pointer"
                >
                  Upload your Excel Sheet <BsCloudUpload className="text-xl" />
                </label>
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </>
            ) : (
              <div className="flex items-center gap-4 text-gray-700">
                <span className="font-medium">Selected file: {fileName}</span>
                <button
                  onClick={handleCancel}
                  className="text-red-500 hover:text-red-700 text-2xl"
                  title="Cancel"
                >
                  <MdOutlineCancel />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Mandatory Fields</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                'Emp name',
                'Emp id',
                'Contact Number',
                'Designation',
                'Department',
                'Location',
              ].map((field, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={field}
                  readOnly
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 cursor-not-allowed"
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mt-6 pb-6 border-b border-gray-300">
              {['Reporting Manager', 'Employee Status'].map((field, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={field}
                  readOnly
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 cursor-not-allowed"
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
              Select the fields you require in excel
              <button className="text-sm text-blue-600 underline hover:text-blue-800 transition">
                Select All
              </button>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {customFields.map((field, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={field}
                  onChange={(e) => {
                    const updated = [...customFields];
                    updated[idx] = e.target.value;
                    setCustomFields(updated);
                  }}
                  placeholder={`Field ${idx + 1}`}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={downloadExcel}
                className="flex items-center gap-2 px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Download Excel Sheet Format <BsCloudDownload className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bulkadd;
