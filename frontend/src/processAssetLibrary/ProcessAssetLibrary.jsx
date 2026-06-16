import React, { useEffect, useState } from 'react';
import { Folder, FileDown } from 'lucide-react';
import Header from '../components/Header';
import processLibraryData from './processLibraryData.js';
import { useNavigate } from 'react-router-dom';

export default function ProcessAssetLibrary() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedSubfolder, setSelectedSubfolder] = useState(null);
  const navigate = useNavigate();
 useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);
  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setSelectedSubfolder(null);
  };

  const handleSubfolderClick = (subfolder) => {
    setSelectedSubfolder(subfolder);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fa] py-16 px-6 md:px-20 font-sans mt-14">

        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-2 space-x-1">
          <span
            onClick={() => navigate('/Dashboard')}
            className="hover:underline cursor-pointer text-black"
          >
            Home
          </span>
          <span>/</span>
          <span
            onClick={() => navigate('/infohub')}
            className="hover:underline cursor-pointer text-black"
          >
            Info Hub
          </span>
          <span>/</span>
          <span
            onClick={() => {
              setSelectedFolder(null);
              setSelectedSubfolder(null);
            }}
            className={`hover:underline cursor-pointer text-black ${!selectedFolder ? 'font-semibold text-black' : ''}`}
          >
            Process Asset Library
          </span>
          {selectedFolder && (
            <>
              <span>/</span>
              <span
                onClick={() => setSelectedSubfolder(null)}
                className={`hover:underline cursor-pointer text-black ${!selectedSubfolder ? 'font-semibold text-black' : ''}`}
              >
                {selectedFolder.name}
              </span>
            </>
          )}
          {selectedSubfolder && (
            <>
              <span>/</span>
              <span className="text-black font-semibold">{selectedSubfolder.name}</span>
            </>
          )}
        </div>

        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-[#222] mb-8">Process Asset Library</h1>

        {/* Top-Level Folders */}
        {!selectedFolder && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {processLibraryData.map((folder, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer flex items-center gap-4"
                onClick={() => handleFolderClick(folder)}
              >
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3 text-white">
                  <Folder size={28} />
                </div>
                <span className="text-gray-800 font-semibold">{folder.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Subfolders */}
        {selectedFolder && !selectedSubfolder && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedFolder.subfolders.map((sub, idx) => (
              <div
                key={idx}
                onClick={() => handleSubfolderClick(sub)}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer transition"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-blue-100 text-black rounded-full p-2">
                    <Folder size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{sub.name}</div>
                    <div className="text-sm text-gray-500">{sub.itemCount} items</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Files in Subfolder */}
        {selectedSubfolder && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{selectedSubfolder.name} Files</h2>
            <ul className="space-y-3">
              {selectedSubfolder.files?.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-white px-4 py-3 rounded shadow border"
                >
                  <span className="text-gray-800">{file.name}</span>
                  <a
                    href={file.url}
                    download
                    className="text-black hover:underline flex items-center gap-1"
                  >
                    <FileDown size={18} />
                    Download
                  </a>
                </li>
              ))}
              {!selectedSubfolder.files?.length && (
                <li className="text-gray-500 italic">No files available</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
