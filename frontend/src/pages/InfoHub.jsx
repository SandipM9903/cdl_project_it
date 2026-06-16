import React, { useEffect, useState } from 'react';
import { Folder, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// Import Images
import HrComp0 from '../assets/HR Communication/HR comm-Mediclaim Enrollment A-24.jpg';
import HrComp1 from '../assets/HR Communication/epms creative A.jpg';
import HrComp2 from '../assets/HR Communication/Lanyard Communication A...jpg';
import HrComp3 from '../assets/HR Communication/POSH Training 09-06-25 B.jpg';
import HrComp4 from '../assets/HR Communication/We Care B_09-06-25.jpg';

import Cert3 from '../assets/Certifications/cert3.png';
import Cert4 from '../assets/Certifications/cert4.png';
import Cert5 from '../assets/Certifications/cert5.png';
import Cert6 from '../assets/Certifications/cert6.png';
import Cert7 from '../assets/Certifications/cert7.png';
import Cert8 from '../assets/Certifications/cert8.png';
import Cert9 from '../assets/Certifications/cert9.png';
import Cert10 from '../assets/Certifications/CMS CMMI SVC L3 Certificate 2025_page-0001.jpg';
import Cert11 from '../assets/Certifications/CMS CMMI DEV L5 Certificate 2025_page-0001.jpg';

// =======================================================
// UPDATED FOLDER STRUCTURE WITH SUBFOLDERS FOR POLICIES
// =======================================================

const folders = [
  {
    id: 1,
    name: 'Corporate Hub',
    color: 'from-red-400 to-red-900',
    images: [
      { src: HrComp0, createdAt: '2025-06-24' },
      { src: HrComp1, createdAt: '2025-06-16' },
      { src: HrComp2, createdAt: '2025-06-14' },
      { src: HrComp3, createdAt: '2025-05-24' },
      { src: HrComp4, createdAt: '2025-06-01' },
    ]
  },

  {
    id: 3,
    name: 'Certificate Of Quality',
    color: 'from-red-400 to-red-900',
    images: [
      { src: Cert3, createdAt: '2025-06-03' },
      { src: Cert4, createdAt: '2025-06-04' },
      { src: Cert5, createdAt: '2025-06-05' },
      { src: Cert6, createdAt: '2025-06-06' },
      { src: Cert7, createdAt: '2025-06-07' },
      { src: Cert8, createdAt: '2025-06-08' },
      { src: Cert9, createdAt: '2025-06-09' },
      { src: Cert10, createdAt: '2025-09-22' },
      { src: Cert11, createdAt: '2025-09-22' },
    ]
  },

  // ===========================
  // NEW POLICY SUBFOLDERS
  // ===========================
  {
    id: 5,
    name: 'Policies',
    color: 'from-red-400 to-red-900',
    isParent: true,
    subfolders: [
      {
        id: 'p1',
        name: 'General HR Policies',
        isNew: true,
        images: []
      },
      {
        id: 'p2',
        name: 'Mandatory Policy',
        isNew: true,
        images: []
      }
    ],
    images: []
  },

  {
    id: 4,
    name: 'Process Asset Library',
    color: 'from-red-400 to-red-900',
    images: []
  },
  {
    id: 6,
    name: 'Forms',
    color: 'from-red-400 to-red-900',
    images: []
  },
  {
    id: 7,
    name: 'CDL User Guide',
    color: 'from-red-400 to-red-900',
    images: []
  },
  {
    id: 8,
    name: 'HR Escalation Matrix',
    color: 'from-red-400 to-red-900',
    images: []
  }
];

export default function InfoHub() {
  const [activeFolder, setActiveFolder] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ==========================================================
  // FOLDER CLICK HANDLER — UPDATED FOR POLICIES SUBFOLDERS
  // ==========================================================
  const handleFolderClick = (folder) => {
    if (folder.name === 'Corporate Hub') {
      navigate('/corporate-hub');
    } 
    else if (folder.name === 'Process Asset Library') {
      navigate('/process-asset-library');
    }
    else if (folder.name === 'Forms') {
      navigate('/forms');
    }
    else if (folder.name === 'CDL User Guide') {
      navigate('/cdl-user-guide');
    }
    else if (folder.name === 'HR Escalation Matrix') {
      navigate('/hr-escalation-matrix');
    }
    else if (folder.name === 'Policies') {
      setActiveFolder(folder); // OPEN SUBFOLDERS — NO NAVIGATION
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
        
        {/* Breadcrumb */}
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
            Info Hub
          </span>

          {activeFolder && (
            <>
              <span>/</span>
              <span className="text-black font-semibold">{activeFolder.name}</span>
            </>
          )}
        </div>

        <h1 className="text-4xl font-bold text-[#222] mb-12">Info Hub</h1>

        {/* ===========================
            FOLDER LIST VIEW
        ============================ */}
        {!activeFolder ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => handleFolderClick(folder)}
                className="bg-white rounded-2xl shadow-lg group transition duration-300 p-6 border cursor-pointer hover:shadow-2xl hover:border-gray-200"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${folder.color} rounded-full flex items-center justify-center text-white shadow-md mb-5`}>
                  <Folder size={28} />
                </div>

                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#4a4a4a]">
                  {folder.name}
                </h2>

          
              </div>
            ))}
          </div>
        ) : (

          // =====================================================
          // SUBFOLDER OR IMAGE VIEW
          // =====================================================
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">
                {activeFolder.name}
              </h2>

              <button
                onClick={() => setActiveFolder(null)}
                className="text-blue-600 hover:underline text-sm"
              >
                ← Back
              </button>
            </div>

            {/* ===========================
                SUBFOLDERS VIEW
            ============================ */}
            {activeFolder.subfolders ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
{activeFolder.subfolders.map((sub) => (
  <div
    key={sub.id}
    onClick={() => {
      if (sub.name === "General HR Policies") {
        navigate("/Policies");
      } else if (sub.name === "Mandatory Policy") {
        navigate("/mandatory-policy");
      } else {
        setActiveFolder(sub); // fallback for future subfolders
      }
    }}
    className="bg-white rounded-2xl shadow-lg p-6 border cursor-pointer relative hover:shadow-2xl"
  >

                    <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-900 rounded-full flex items-center justify-center text-white shadow-md mb-4">
                      <Folder size={28} />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">
                      {sub.name}
                    </h2>

                    {sub.isNew && (
                      <span className="absolute top-2 right-2 bg-red-700 text-white px-2 py-1 rounded-full text-xs">
                        NEW
                      </span>
                    )}
                  </div>
                ))}

              </div>
            ) : (

              /* ============================
                 IMAGES VIEW
              ============================ */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {sortedImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden cursor-pointer"
                  >
                    <img src={img.src} className="w-full h-64 object-cover" />

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
            )}

          </div>
        )}
      </div>

      {/* ===========================
          IMAGE FULLSCREEN MODAL
      ============================ */}
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
