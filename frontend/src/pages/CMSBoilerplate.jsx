import React from 'react';
import Header from '../components/Header';
import { Download } from 'lucide-react'; // Only need Download icon for this page
import { useNavigate, Link } from 'react-router-dom'; // Import Link for breadcrumbs

const downloads = [
  {
    title: 'Boilerplate Documentation',
    format: 'PDF Document',
    file: '/files/CMS Boilerplate 2025.docx', // **IMPORTANT: Update this path to your actual PDF file**
  },
];

const CMSBoilerplate = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gray-50 px-6 md:px-20 py-20 mt-4 font-sans">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link
            to="/Dashboard"
            className="text-black hover:underline cursor-pointer"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/cms-branding"
            className="text-black hover:underline cursor-pointer"
          >
            CMS Branding
          </Link>
          <span>/</span>
          <span className="text-gray-500">CMS Boilerplate</span>
        </nav>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2c3e50] mb-6 text-center">
            CMS Boilerplate Resources
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg mb-12">
            Download essential documentation for CMS Boilerplate.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {downloads.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.format}</p>
                </div>
                <a
                  href={item.file}
                  download // This attribute prompts the browser to download the file
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
                >
                  <Download size={18} />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CMSBoilerplate;