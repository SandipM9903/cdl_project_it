import React, { useEffect, useState } from 'react';
import { Folder, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';

// Image URL (replace with your actual image path or import)
const leadershipImage = 'https://static.vecteezy.com/system/resources/thumbnails/066/399/521/small_2x/diverse-women-s-group-profile-a-graphic-featuring-five-stylized-women-in-profile-showcasing-diverse-ethnicities-and-hair-colors-symbolizing-female-diversity-unity-and-professional-representation-png.png';

const folders = [
  {
    id: 1,
    name: 'SELF NOMINATION',
    color: 'from-red-400 to-red-900',
    images: []
  },
  {
    id: 2,
    name: 'MANAGER NOMINATION',
    color: 'from-red-400 to-red-900',
    images: []
  },
];

const WomenLeadership = () => {
  const [activeFolder, setActiveFolder] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFolderClick = (folder) => {
    toast('Coming Soon!', { icon: '⏳' });
  };

  const sortedImages = activeFolder?.images?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-[#f8f9fa] py-16 px-6 md:px-20 font-sans mt-8">

        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-4 space-x-1">
          <span
            onClick={() => navigate('/dashboard')}
            className="hover:underline cursor-pointer text-black"
          >
            Home
          </span>
          <span>/</span>
          <span className="text-black font-semibold">
            Women Leadership
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-[#222] mb-6 font-header">Women Leadership</h1>

      
{/* Leadership Image */}
<div className="mb-6">
  <img
    src={leadershipImage}
    alt="Women Leadership"
    className="w-full rounded-lg h-[400px] object-contain shadow-md bg-gray-100"
  />
</div>



        {/* Tagline + Theme + Objectives */}
        <div className="bg-white rounded-2xl shadow-md border p-8 mb-12">
          <p className="text-lg italic text-red-600 font-semibold mb-4">
            Tagline: “Together, We Rise”
          </p>
          <p className="text-md text-gray-700 font-semibold mb-6">
            Theme: <span className="text-black">#BESIDEnotBEHIND</span>
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>ASPIRE/SHAKTI</strong> is a structured initiative aimed at developing women
            leaders within the organization. The program is designed to empower women employees
            to overcome barriers, embrace their strengths, and grow into key managerial and
            leadership roles.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            It integrates mentoring, skill development (through PRAVIIN – L&amp;D Team),
            wellbeing workshops, coaching, and networking opportunities to provide a holistic
            development journey.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            The program is customized to organizational needs and functions as a catalyst to build
            a ready pipeline of women leaders who can contribute strategically to business growth
            and organizational transformation.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Objectives of ASPIRE/SHAKTI</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>To create a career roadmap for women employees that develops their leadership potential.</li>
            <li>To nurture and prepare women employees for managerial and key roles across business units.</li>
            <li>To empower women with the skills, knowledge, and support system needed to succeed in leadership roles.</li>
            <li>To foster an inclusive workplace where women progress besides, not behind, building confidence and influence.</li>
            <li>To establish a strong talent pool of women leaders who can contribute to organization’s future growth and serve as role models for others.</li>
          </ul>
        </div>

        {/* Folder Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              className="bg-white rounded-2xl shadow-lg group transition duration-300 p-6 border cursor-pointer hover:shadow-2xl hover:border-gray-200"
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
      </div>
    </>
  );
};

export default WomenLeadership;
