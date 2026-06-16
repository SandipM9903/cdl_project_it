
import React, { useState } from 'react';
import { Folder, X } from 'lucide-react';
import HrComp0 from '../assets/HR Communication/HR comm-Mediclaim Enrollment A-24.jpg';
import HrComp1 from '../assets/HR Communication/epms creative A.jpg';
import HrComp2 from '../assets/HR Communication/Lanyard Communication A...jpg';
import HrComp3 from '../assets/HR Communication/POSH Training 09-06-25 B.jpg';
import HrComp4 from '../assets/HR Communication/We Care B_09-06-25.jpg';
import HrComp5 from '../assets/Praviin/L&D Creatives_ P.jpg';
import HrComp6 from '../assets/Praviin/MCSE -Windows Server_Coming Soon.jpg';
import HrComp7 from '../assets/Praviin/POSH Training 09-06-25 B.jpg';
import HrComp8 from '../assets/Praviin/We Care B_09-06-25.jpg';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const folders = [
  {
    id: 1,
    name: 'CMS Logo',
   color: 'from-red-400 to-red-900',
   
  },
  {
    id: 2,
    name: 'CMS Templates',
   color: 'from-red-400 to-red-900',
   
  },
  { id: 3, name: 'Brand Guidelines', color: 'from-red-400 to-red-900',
    
   },
  { id: 4, name: 'CMS Boilerplate', color: 'from-red-400 to-red-900',
    
   },
  { id: 5, name: 'Corporate Deck', color: 'from-red-400 to-red-900',
  
   },
];

export default function CMSbranding() {
  const [activeFolder, setActiveFolder] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
const navigate = useNavigate(); // Add this at the top inside your component

const handleFolderClick = (folder) => {
  if (folder.name === 'Corporate Deck') {
    navigate('/corporate-hub');
  } else if (folder.name === 'CMS Logo') {
    navigate('/cms-logo');
  } else if (folder.name === 'CMS Templates') {
    navigate('/cms-templates');
  } else if (folder.name === 'CMS Boilerplate') {
    navigate('/cms-boilerplate');
  }else if (folder.name === 'Brand Guidelines') { // Add this new condition
      navigate('/brand-guidelines'); // Navigate to the new component's route
    }
  // Do not open anything for disabled folders
};




  const sortedImages = activeFolder?.images?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <Header />
     <div className="mt-20 px-6 md:px-24 text-sm text-gray-600 font-content">
    <nav className="flex items-center space-x-2">
      <span
        className="text-black hover:underline cursor-pointer"
        onClick={() => navigate('/Dashboard')}
      >
        Home
      </span>
      <span>/</span>
      <span className="text-gray-500">CMS Branding</span>
    </nav>
  </div>

  <div className="min-h-screen bg-[#f8f9fa] py-16 px-6 md:px-20 font-sans mt-4">
    <h1 className="text-4xl font-bold text-[#222] mb-12 font-header">CMS Branding</h1>

        {!activeFolder ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
           {folders.map((folder) => {
  const isDisabled =
    folder.name !== 'CMS Logo' &&
    folder.name !== 'CMS Templates' &&
    folder.name !== 'Corporate Deck' &&
    folder.name !== 'CMS Boilerplate' &&
    folder.name !== 'Brand Guidelines';

  return (
    <div
      key={folder.id}
      onClick={() => !isDisabled && handleFolderClick(folder)}
      className={`bg-white rounded-2xl shadow-lg transition duration-300 p-6 cursor-pointer border border-transparent ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-2xl hover:border-gray-200 group'
      }`}
    >
      <div
        className={`w-14 h-14 bg-gradient-to-br ${folder.color} rounded-full flex items-center justify-center text-white shadow-md mb-5`}
      >
        <Folder size={28} />
      </div>
      <h2
        className={`text-xl font-semibold text-gray-800 ${
          !isDisabled ? 'group-hover:text-[#4a4a4a]' : 'text-gray-400'
        }`}
      >
        {folder.name}
      </h2>
      <div className="flex justify-between mt-6 text-sm text-gray-500">
        {isDisabled ? (
          <span className="italic text-gray-400">Coming Soon</span>
        ) : (
          <span className="hover:text-blue-600 flex items-center gap-1">
            View
          </span>
        )}
      </div>
    </div>
  );
})}

          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">{activeFolder.name}</h2>
              <button onClick={() => setActiveFolder(null)} className="text-blue-600 hover:underline">Back</button>
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
                    Created: {new Date(img.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-center mb-4 text-red-600">Please Read Carefully</h3>
            <img
              src={selectedImage.src}
              alt="Selected"
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
