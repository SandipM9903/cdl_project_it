import React, { useState } from 'react';
import Header from '../components/Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ✅ Import all PNG images (1.png to 26.png)
import img1 from '../assets/BrandGuidelines/1.png';
import img2 from '../assets/BrandGuidelines/2.png';
import img3 from '../assets/BrandGuidelines/3.png';
import img4 from '../assets/BrandGuidelines/4.png';
import img5 from '../assets/BrandGuidelines/5.png';
import img6 from '../assets/BrandGuidelines/6.png';
import img7 from '../assets/BrandGuidelines/7.png';
import img8 from '../assets/BrandGuidelines/8.png';
import img9 from '../assets/BrandGuidelines/9.png';
import img10 from '../assets/BrandGuidelines/10.png';
import img11 from '../assets/BrandGuidelines/11.png';
import img12 from '../assets/BrandGuidelines/12.png';
import img13 from '../assets/BrandGuidelines/13.png';
import img14 from '../assets/BrandGuidelines/14.png';
import img15 from '../assets/BrandGuidelines/15.png';
import img16 from '../assets/BrandGuidelines/16.png';
import img17 from '../assets/BrandGuidelines/17.png';
import img18 from '../assets/BrandGuidelines/18.png';
import img19 from '../assets/BrandGuidelines/19.png';
import img20 from '../assets/BrandGuidelines/20.png';
import img21 from '../assets/BrandGuidelines/21.png';
import img22 from '../assets/BrandGuidelines/22.png';
import img23 from '../assets/BrandGuidelines/23.png';
import img24 from '../assets/BrandGuidelines/24.png';
import img25 from '../assets/BrandGuidelines/25.png';
import img26 from '../assets/BrandGuidelines/26.png';
import img27 from '../assets/BrandGuidelines/27.png';
import img28 from '../assets/BrandGuidelines/28.png';
import img29 from '../assets/BrandGuidelines/29.png';
import img30 from '../assets/BrandGuidelines/30.png';
import img31 from '../assets/BrandGuidelines/31.png';
import img32 from '../assets/BrandGuidelines/32.png';
import { useNavigate } from 'react-router-dom';

// ✅ Store images in array
const images = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30,
  img31, img32
];

export default function BrandGuidelines() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = images.length;
  const navigate = useNavigate();
  const goToPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goToNext = () => setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1));

  return (
    <>
      <Header />
        <nav className="flex items-center space-x-2 mt-24">
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
    <span className="text-gray-500">CMS Guidelines</span>
  </nav>
      <div className="min-h-screen bg-gray-100 py-20 px-4 md:px-20">
           
        {/* ✅ Heading left + Back button right */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Brand Guidelines</h1>
        </div>

        {/* ✅ Image Viewer */}
        <div className="bg-white shadow-md rounded-xl p-6 max-w-5xl mx-auto text-center">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="mx-auto max-h-[80vh] w-full object-contain rounded-md"
          />

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="p-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-700 font-medium">
              Slide {currentIndex + 1} of {totalSlides}
            </span>
            <button
              onClick={goToNext}
              disabled={currentIndex === totalSlides - 1}
              className="p-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
