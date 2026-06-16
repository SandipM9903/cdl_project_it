// src/pages/DocViewerPage.js
import React, { useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate, Link } from 'react-router-dom';

const DocViewerPage = () => {
  const navigate = useNavigate();

  const documentPath = '/files/User_Manual - New CDL.pdf';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-6 md:px-20 py-20 mt-14 font-sans">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link
            to="/dashboard"
            className="text-black hover:underline cursor-pointer"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/infohub"
            className="text-black hover:underline cursor-pointer"
          >
            Info Hub
          </Link>
          <span>/</span>
          <span className="text-gray-500 font-semibold">CDL User Guide</span>
        </nav>

        <h1 className="text-4xl font-bold text-[#222] mb-8">CDL User Guide</h1>

        {/* Increased height of the viewer container */}
        <div className="relative w-full h-[calc(100vh-150px)] bg-gray-200 rounded-lg shadow-xl overflow-hidden">
        {/* You can experiment with different values like h-[calc(100vh-200px)] or h-[calc(100vh-100px)] */}
        {/* Or, if you want it to take almost full height, you might use 'h-screen' and adjust top/bottom margins on parent */}

          <iframe
            src={documentPath}
            className="w-full h-full border-0"
            title="CDL User Guide Document"
            allowFullScreen
            loading="lazy"
          >
            Your browser does not support iframes or PDF viewing.
            Please download the document to view it.
            <a href={documentPath} download>
              Download CDL User Guide
            </a>
          </iframe>

          <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors">
            <a
              href={documentPath}
              download="User_Manual - New CDL.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Document Directly
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocViewerPage;