import React from 'react';
import Header from '../components/Header';
import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const templates = [
  {
    title: 'Company PPT',
    format: 'PowerPoint Template',
    file: '/CMS Branding/CMS TEMPLATE PPT 2025.pptx',
  },
  {
    title: 'Company Letterhead (Word)',
    format: 'Word Document',
    file: '/CMS Branding/CMS INDIA Letter Head (HO)_New.docx',
  },
  {
    title: 'Company Letterhead (PDF)',
    format: 'PDF Document',
    file: '/CMS Branding/CMS INDIA Letter Head (HO)_New.pdf',
  },
  {
    title: 'Company Letterhead (CDR)',
    format: 'CorelDRAW File',
    file: '/CMS Branding/CMS INDIA Letter Head (HO)_New.cdr',
  },
];

const CMSTemplates = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gray-50 px-6 md:px-20 py-20 mt-14 font-sans">
          <nav className="flex items-center space-x-2">
    <span
      className="text-black hover:underline cursor-pointer"
      onClick={() => navigate('/Dashboard')}
    >
      Home
    </span>
    <span>/</span>
    <span
      className="text-black hover:underline cursor-pointer"
      onClick={() => navigate('/cms-branding')}
    >
      CMS Branding
    </span>
    <span>/</span>
    <span className="text-gray-500">CMS Templates</span>
  </nav>
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
        

          <h1 className="text-4xl md:text-5xl font-bold text-[#2c3e50] mb-6 text-center">
            CMS Templates
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg mb-12">
            Download the official company letterhead in various editable formats. Use these templates to ensure branding consistency across all corporate communication.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.format}</p>
                </div>
                <a
                  href={item.file}
                  download
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

export default CMSTemplates;
