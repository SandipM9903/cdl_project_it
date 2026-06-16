
import React, { useEffect, useState } from 'react';
import { Folder, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// Import your images

const folders = [
  {
    id: 1,
    name: 'MY TEAM',
    color: 'from-red-400 to-red-900',
    images: [
    
    ]
  },
  {
    id: 3,
    name: 'GOAL SETTING & PERFORMANCE',
    color: 'from-red-400 to-red-900',
    images: [
   
    ]
  },
  {
    id: 4,
    name: 'ATTENDANCE & LEAVE REQUESTS',
    color: 'from-red-400 to-red-900',
    images: []
  },
  {
    id: 5,
    name: 'REIMBURSEMENT REQUEST',
    color: 'from-red-400 to-red-900',
    images: []
  },
  {
    id: 6,
    name: 'ADVANCE REIMBURSEMENT REQUEST',
    color: 'from-red-400 to-red-900',
    images: []
  },
   {
    id: 7,
name: 'EXIT REQUEST',
    color: 'from-red-400 to-red-900',
    images: []
  } ,  

];

export default function MyApprovals() {
  const [activeFolder, setActiveFolder] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
 useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);
  const handleFolderClick = (folder) => {
if (folder.name === 'MY TEAM') {
      navigate('/team');
    } else if (folder.name === 'GOAL SETTING & PERFORMANCE') {
  window.open('https://cdl.cms.co.in/group/cms/e-pms', '_blank');


    } else if (folder.name === 'ATTENDANCE & LEAVE REQUESTS') {
      navigate('/attendanceapproval');
   } else if (folder.name === 'REIMBURSEMENT REQUEST') {
      navigate('/reimburementReq');
    }
    else if (folder.name === 'ADVANCE REIMBURSEMENT REQUEST') { // Added condition for CDL User Guide
      navigate('/advreimburementReq'); // Navigate to the new document viewer page
    }else if (folder.name === 'EXIT REQUEST') { // Added condition for HR Escalation Matrix
      sessionStorage.setItem('workflowName', 'E-Separation');
      navigate('/mgrExitPendingRequest'); // Navigate to the new component
    }
     else {
      setActiveFolder(folder);
    }
  };

  const sortedImages = activeFolder?.images?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fa] py-16 px-6 md:px-20 font-sans mt-14">
        <div className="text-sm text-gray-500 mb-4 space-x-1">
  <span
    onClick={() => navigate('/dashboard')}
    className="hover:underline cursor-pointer text-black"
  >
    Home
  </span>
  <span>/</span>
  <span
    onClick={() => setActiveFolder(null)}
    className={`hover:underline cursor-pointer text-black ${!activeFolder ? 'font-semibold text-black' : ''}`}
  >
    My Approvals
  </span>
  {activeFolder && (
    <>
      <span>/</span>
      <span className="text-black font-semibold">{activeFolder.name}</span>
    </>
  )}
</div>

        <h1 className="text-4xl font-bold text-[#222] mb-12">My Approvals</h1>

        {!activeFolder ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => handleFolderClick(folder)}
                className={`bg-white rounded-2xl shadow-lg group transition duration-300 p-6 border cursor-pointer hover:shadow-2xl hover:border-gray-200`}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${folder.color} rounded-full flex items-center justify-center text-white shadow-md mb-5`}
                >
                  <Folder size={28} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#4a4a4a]">
                  {folder.name}
                </h2>
                <div className="flex justify-between mt-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">View</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">{activeFolder.name}</h2>
              <button
                onClick={() => setActiveFolder(null)}
                className="text-blue-600 hover:underline text-sm"
              >
                &larr; Back
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {sortedImages.map((img, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.src}
                    alt={`Folder Image ${index}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 border-t text-sm text-gray-600">
                    Created:{' '}
                    {new Date(img.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-red-400 z-50"
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage.src}
            alt="Selected"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </>
  );
}

