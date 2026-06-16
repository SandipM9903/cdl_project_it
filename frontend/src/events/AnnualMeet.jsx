import React, { useEffect, useState } from 'react';
import womenDay from '../assets/womenDay.png';
import annual2019 from '../assets/Annual 2019/fainal=2.jpg'
import annual2023 from '../assets/Annual 2023/Group.jpg'
import annual2025 from '../assets/Annual 2025/IMG_1070.jpg'
import Header from '../components/Header';

import annual20191 from '../assets/Annual 2019/DSC_0069.jpg'
import annual20192 from '../assets/Annual 2019/DSC_0076.jpg'
import annual20193 from '../assets/Annual 2019/DSC_0193.jpg'
import annual20194 from '../assets/Annual 2019/fainal=2.jpg'
import annual20195 from '../assets/Annual 2019/RDV_5914.jpg'
import annual20196 from '../assets/Annual 2019/RDV_5946.jpg'
import annual20197 from '../assets/Annual 2019/RDV_5958.jpg'
import annual20198 from '../assets/Annual 2019/RDV_5976.jpg'
import annual20199 from '../assets/Annual 2019/RDV_6038.jpg'
import annual201910 from '../assets/Annual 2019/RDV_6052.jpg'
import annual201911 from '../assets/Annual 2019/RDV_6111.jpg'
import annual201912 from '../assets/Annual 2019/RDV_6193.jpg'
import annual201913 from '../assets/Annual 2019/RDV_6221.jpg'
import annual201914 from '../assets/Annual 2019/RDV_6221.jpg'
import annual201915 from '../assets/Annual 2019/RDV_6222.jpg'
import annual201916 from '../assets/Annual 2019/RDV_6256.jpg'


import annual20231 from '../assets/Annual 2023/2B5A6545.jpg'
import annual20232 from '../assets/Annual 2023/2B5A6551.jpg'
import annual20233 from '../assets/Annual 2023/2B5A6604.jpg'
import annual20234 from '../assets/Annual 2023/2B5A6657.jpg'
import annual20235 from '../assets/Annual 2023/2B5A6666.jpg'
import annual20236 from '../assets/Annual 2023/2B5A6683.jpg'
import annual20237 from '../assets/Annual 2023/2B5A6720.jpg'
import annual20238 from '../assets/Annual 2023/2B5A6760.jpg'
import annual20239 from '../assets/Annual 2023/2B5A6794.jpg'
import annual202310 from '../assets/Annual 2023/2B5A6811.jpg'
import annual202311 from '../assets/Annual 2023/2B5A6904.jpg'
import annual202312 from '../assets/Annual 2023/2B5A6938.jpg'
import annual202313 from '../assets/Annual 2023/2B5A6961.jpg'
import annual202314 from '../assets/Annual 2023/2B5A6969.jpg'
import annual202315 from '../assets/Annual 2023/2B5A6979.jpg'
import annual202316 from '../assets/Annual 2023/2B5A7015.jpg'
import annual202317 from '../assets/Annual 2023/2B5A7063.jpg'
import annual202318 from '../assets/Annual 2023/2B5A66692.jpg'
import annual202319 from '../assets/Annual 2023/IMG_0735.jpg'
import annual202320 from '../assets/Annual 2023/IMG_1647.jpg'
import annual202321 from '../assets/Annual 2023/IMG_1650.jpg'
import annual202322 from '../assets/Annual 2023/Group.jpg'
import annual202323 from '../assets/Annual 2023/WhatsApp Image 2025-06-24 at 2.52.59 PM.jpeg'
import annual202324 from '../assets/Annual 2023/WhatsApp Image 2025-06-24 at 2.53.00 PM.jpeg'
import annual202325 from '../assets/Annual 2023/WhatsApp Image 2025-06-24 at 2.53.01 PM.jpeg'
import annual202326 from '../assets/Annual 2023/WhatsApp Image 2025-06-24 at 2.53.02 PM.jpeg'
import annual202327 from '../assets/Annual 2023/WhatsApp Image 2025-06-24 at 2.53.03 PM.jpeg'

import annual20251 from '../assets/Annual 2025/2B5A6902.jpg'
import annual20252 from '../assets/Annual 2025/DSC_8988.jpg'
import annual20253 from '../assets/Annual 2025/DSC_8991.jpg'
import annual20254 from '../assets/Annual 2025/DSC_8995.jpg'
import annual20255 from '../assets/Annual 2025/DSC_9000.jpg'
import annual20256 from '../assets/Annual 2025/DSC_9011.jpg'
import annual20257 from '../assets/Annual 2025/DSC_9031.jpg'
import annual20258 from '../assets/Annual 2025/DSC_9053.jpg'
import annual20259 from '../assets/Annual 2025/IMG_0516.jpg'
import annual202510 from '../assets/Annual 2025/IMG_0539.jpg'
import annual202511 from '../assets/Annual 2025/IMG_0544.jpg'
import annual202512 from '../assets/Annual 2025/IMG_0559.jpg'
import annual202513 from '../assets/Annual 2025/IMG_0581.jpg'
import annual202514 from '../assets/Annual 2025/IMG_0585.jpg'
import annual202515 from '../assets/Annual 2025/IMG_0591.jpg'
import annual202516 from '../assets/Annual 2025/IMG_0673.jpg'
import annual202517 from '../assets/Annual 2025/IMG_0738.jpg'
import annual202518 from '../assets/Annual 2025/IMG_0845.jpg'
import annual202519 from '../assets/Annual 2025/IMG_0846.jpg'
import annual202520 from '../assets/Annual 2025/IMG_0854.jpg'
import annual202521 from '../assets/Annual 2025/IMG_0888.jpg'
import annual202522 from '../assets/Annual 2025/IMG_1070.jpg'
import annual202523 from '../assets/Annual 2025/IMG_1697.jpg'
import annual202524 from '../assets/Annual 2025/IMG_1716.jpg'

import annual202530 from '../assets/Annual 2025/IMG_0846 12.jpg'
import annual202531 from '../assets/Annual 2025/IMG_0847 13.jpg'
import annual202532 from '../assets/Annual 2025/IMG_0848 14.jpg'
import annual202533 from '../assets/Annual 2025/IMG_0850 15.jpg'
import annual202534 from '../assets/Annual 2025/IMG_0861 17.jpg'
import annual202535 from '../assets/Annual 2025/IMG_1004 18.jpg'
import annual202536 from '../assets/Annual 2025/IMG_1006 19.jpg'
import annual202537 from '../assets/Annual 2025/IMG_1007 20.jpg'

import annual202538 from '../assets/Annual 2025/annual1.jpg'
import annual202539 from '../assets/Annual 2025/annual2.jpg'
import annual202540 from '../assets/Annual 2025/annual3.jpg'
import annual202541 from '../assets/Annual 2025/annual4.jpg'
import annual202542 from '../assets/Annual 2025/annual5.jpg'
import annual202543 from '../assets/Annual 2025/annual6.jpg'




const mockGallery = {
 'Annual Meet 2025': [annual202538,annual202539,annual20231,annual202540,annual202541,annual202542,annual202543,annual202530,annual202531,annual202532,annual202533,annual202534,annual202535,annual202536,annual202537,annual202520,annual20252,annual20253,annual20254,annual20255,annual20256,annual202522,annual20257,annual202518,annual202519,annual20258,
    annual20259,annual202510,annual202511,annual202512,annual202513,annual202514,annual202515,annual202516,annual202517,
    ,annual20251,annual202521,annual202523,annual202524
  ],
  'Annual Meet 2023': [ annual20232, annual20233, annual20234,annual20235,annual20236,annual20237,
    annual20238,annual20239,annual202310,annual202311,annual202312,annual202313,annual202314,annual202315,
    annual202316,annual202317,annual202318,annual202319,annual202320,annual202321,annual202322,annual202323,
    annual202324,annual202325,annual202326,annual202326,annual202327
  ],
 
    'Annual Meet 2019': [annual20191, annual20192, annual20193, annual20194, annual20195,
    annual20196, annual20197,annual20198,annual20199,annual201910,annual201911,annual201912,annual201912,annual201913,annual201914,annual201915,annual201916
  ],
};

const folderCovers = {
 
  'Annual Meet 2023': annual2023,
  'Annual Meet 2025': annual2025,
   'Annual Meet 2019': annual2019,
};

const AnnualMeet = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const openModal = (img) => setSelectedImage(img);
  const closeModal = () => setSelectedImage(null);

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <Header />
      <div className="">
        <h1 className="text-3xl font-bold text-[#003366] mb-6">Annual Meet</h1>

        {!selectedFolder ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-content">
            {Object.keys(mockGallery).map((folder, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFolder(folder)}
                className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all"
              >
                <img
                  src={folderCovers[folder]}
                  alt={folder}
                  className="w-full h-40 object-cover font-content"
                />
                <div className="p-4 text-center text-lg font-semibold text-gray-800 font-content">
                  {folder}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedFolder(null)}
              className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Back to Folders
            </button>

            <h2 className="text-2xl font-semibold text-[#003366] mb-4">
              {selectedFolder} Gallery
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mockGallery[selectedFolder].map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx}`}
                  className="rounded-lg cursor-pointer object-cover w-full h-40"
                  onClick={() => openModal(img)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 focus:outline-none"
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Popup"
                className="max-h-[90vh] max-w-[90vw] rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnualMeet;
