

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Header from '../components/Header';
// import { BASE_URL } from '../config/Config';

// const HolidayList = () => {
//   const [upcomingHolidays, setUpcomingHolidays] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState('Karnataka');
// useEffect(() => {
//   window.scrollTo(0, 0);
// }, []);
//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/holidays/get/all-holidays`)
//       .then((res) => setUpcomingHolidays(res.data))
//       .catch((err) => alert(err));
//   }, []);

//   const filteredHolidays = upcomingHolidays.filter(
//     (obj) =>
//       (obj.state?.includes(selectedLocation) || obj.state === 'All') &&
//       !(obj.state === 'All' && obj.optional)
//   );

//   const optionalHolidays = upcomingHolidays.filter((obj) => obj.optional);

//   const handleSelectChange = (e) => setSelectedLocation(e.target.value);

// return (
//   <div className="min-h-screen bg-gray-50">
//     <Header />

//     {/* Breadcrumbs */}
//     <div className="pt-[90px] px-6 md:px-20 text-sm text-gray-500 space-x-1">
//       <span
//         onClick={() => window.location.href = "/dashboard"}
//         className="hover:underline cursor-pointer text-black"
//       >
//         Home
//       </span>
//       <span>/</span>
//       <span
//         onClick={() => window.location.href = "/attendance"}
//         className="hover:underline cursor-pointer text-black"
//       >
//         Attendance
//       </span>
//       <span>/</span>
//       <span className="text-black font-semibold">Holiday</span>
//     </div>


//       <div className="flex justify-center px-4">
//         <div className="w-full max-w-[950px]">

//           {/* Location Selector */}
//           <div className="flex justify-center items-center mb-6">
//             <label className="mr-3 text-gray-700 font-medium">Location</label>
//             <select
//               className="cursor-pointer border border-gray-400 rounded px-3 py-1 shadow-sm"
//               value={selectedLocation}
//               onChange={handleSelectChange}
//             >
//               {[
//   'Andhra Pradesh',
//   'Delhi',
//   'Gujarat',
//   'Karnataka',
//   'Kerala',
//   'Maharashtra',
//   'Punjab',
//   'Rajasthan',
//   'Tamil Nadu',
//   'Telangana',
//   'Uttar Pradesh',
//   'West Bengal'
// ].map((state) => (
//                 <option key={state} value={state}>
//                   {state}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Fixed Holidays */}
//           <h2 className="text-center text-lg font-bold mb-2 text-blue-800">Fixed Holidays</h2>
//           <div className="overflow-x-auto shadow rounded-lg bg-white">
//             <table className="min-w-full text-sm text-left text-gray-700">
//               <thead className="text-xs uppercase bg-gray-100">
//                 <tr>
//                   <th className="px-6 py-3">S.N</th>
//                   <th className="px-6 py-3">Holidays</th>
//                   <th className="px-6 py-3">Year</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredHolidays.length > 0 ? (
//                   filteredHolidays.map((obj, index) => (
//                     <tr
//                       key={index}
//                       className="hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       <td className="px-6 py-4">{index + 1}</td>
//                       <td className="px-6 py-4">{obj.holidays}</td>
//                       <td className="px-6 py-4">{obj.year}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
//                       No holidays available for this location.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Optional Holidays */}
//           <h2 className="text-center text-lg font-bold mt-10 text-blue-800">
//             Optional Holidays
//           </h2>
//           <p className="text-center bg-yellow-200 mt-2 mb-4 py-2 rounded shadow text-sm">
//             You may avail 2 optional holidays from the list below
//           </p>

//           <div className="overflow-x-auto shadow rounded-lg bg-white">
//             <table className="min-w-full text-sm text-left text-gray-700">
//               <thead className="text-xs uppercase bg-gray-100">
//                 <tr>
//                   <th className="px-6 py-3">S.N</th>
//                   <th className="px-6 py-3">Holidays</th>
//                   <th className="px-6 py-3">Year</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {optionalHolidays.length > 0 ? (
//                   optionalHolidays.map((obj, index) => (
//                     <tr
//                       key={index}
//                       className="hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       <td className="px-6 py-4">{index + 1}</td>
//                       <td className="px-6 py-4">{obj.holidays}</td>
//                       <td className="px-6 py-4">{obj.year}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
//                       No optional holidays available.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default HolidayList;

import React, { useEffect } from 'react';
import Header from '../components/Header';

const HolidayList = () => {
  const images = [
    '/Holiday List 2026 A_page-0001.jpg',
    '/Holiday List 2026 A_page-0002.jpg',
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
<div className="pt-[90px] px-6  text-sm text-gray-500 space-x-1">
       <span
        onClick={() => window.location.href = "/dashboard"}
        className="hover:underline cursor-pointer text-black"
      >
        Home
      </span>
      <span>/</span>
      <span
        onClick={() => window.location.href = "/attendance"}
        className="hover:underline cursor-pointer text-black"
      >
        Attendance
      </span>
      <span>/</span>
      <span className="text-black font-semibold">Holiday</span>
    </div>
      {/* Scrollable PDF-like View */}
      <div className=" flex justify-center">
        <div className="w-full max-w-[900px] px-4">

          {images.map((img, index) => (
            <div
              key={index}
              className=" bg-white shadow-md"
            >
              <img
                src={img}
                alt={`Holiday Page ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default HolidayList;
