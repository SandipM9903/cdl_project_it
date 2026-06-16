// src/pages/ProcessFolderView.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Folder } from 'lucide-react';

import Header from '../components/Header';
import processLibraryData from './processLibraryData.js';

export default function ProcessFolderView() {
  const { folderId } = useParams();
  const navigate = useNavigate();

  // Convert hyphenated route param back to normal title
  const folderKey = Object.keys(processLibraryData).find((key) =>
    folderId === key.replace(/\s+/g, '-').toLowerCase()
  );

  const folderData = processLibraryData[folderKey];

  if (!folderData) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Folder not found!
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fa] py-16 px-6 md:px-20 font-sans mt-14">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#222]">{folderData.name}</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            &larr; Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {folderData.subfolders.map((sub, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg flex items-center gap-4"
            >
              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                <Folder size={20} />
              </div>
              <div>
                <div className="text-gray-800 font-semibold">{sub.name}</div>
                <div className="text-sm text-gray-500">{sub.itemCount} items</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
