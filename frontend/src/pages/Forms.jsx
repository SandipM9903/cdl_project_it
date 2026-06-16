import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';
import Header from '../components/Header';

const Forms = () => {
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
 useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);
  useEffect(() => {
    setPdfList([
      { name: 'Flexi Benefit Reimbursement (FBR) Form', file: '/Forms/Flexi Benifit Reimbursement (FBR) Form.pdf' },
      { name: 'PF - Form 11 Revised', file: '/Forms/Form11Revised.pdf' },
      { name: 'Gratuity Nomination Form', file: '/Forms/Gratuity_Act_Form-F-Nomination-Gratuity.pdf' },
      { name: 'POSH Harassment Complaint Form', file: '/Forms/POSH_Harrassment Complaint Form.pdf' },
    ]);
  }, []);

  const openPdf = (file) => {
    setSelectedPdf(file);
  };

  const closeViewer = () => {
    setSelectedPdf(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* PDF Viewer */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-white shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">📄 Viewing PDF</h2>
            <button
              onClick={closeViewer}
              className="text-red-500 hover:text-red-700 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
          <iframe
            src={selectedPdf}
            title="PDF Viewer"
            className="flex-grow w-full"
          />
        </div>
      )}

      {/* Forms Grid */}
      <div className="container mx-auto p-6 mt-24">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">📝 Company Forms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pdfList.map((form, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-tr from-red-100 to-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-5 flex flex-col items-center text-center"
            >
              <div className="relative w-20 h-20 mb-4">
                <FaFilePdf className="text-red-600 text-6xl drop-shadow-lg absolute top-0 left-0" />
              </div>
              <h4 className="font-semibold text-lg text-gray-800 mb-4 px-2">{form.name}</h4>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => openPdf(form.file)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
                >
                  <FaEye /> View
                </button>
                <a
                  href={form.file}
                  download
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                >
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forms;
