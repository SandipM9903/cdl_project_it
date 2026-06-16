// import React from "react";
// import {
//   useStoreTotalDepartment,
//   useStoreTotalEmployee,
//   useStoreTotalFilteredProofDepartment,
//   useStoreTotalFilteredProofEmployee,
//   useStoreTotalFilteredProofLocation,
//   useStoreTotalFilteredProofPosition,
//   useStoreTotalFilteredProofProject,
//   useStoreTotalLocation,
//   useStoreTotalPosition,
//   useStoreTotalProject,
// } from "./useFileStore";

// function ProofReport() {
//   // department
//   const { totalDepartmentNumber } = useStoreTotalDepartment();
//   const { totalFilteredProofDepartmentNumber } =
//     useStoreTotalFilteredProofDepartment();

//   // position
//   const { totalPositionNumber } = useStoreTotalPosition();
//   const { totalFilteredProofPositionNumber } =
//     useStoreTotalFilteredProofPosition();

//   // project
//   const { totalProjectNumber } = useStoreTotalProject();
//   const { totalFilteredProofProjectNumber } =
//     useStoreTotalFilteredProofProject();

//   // location
//   const { totalLocationNumber } = useStoreTotalLocation();
//   const { totalFilteredProofLocationNumber } =
//     useStoreTotalFilteredProofLocation();

//   // employee
//   const { totalEmployeeNumber } = useStoreTotalEmployee();
//   const { totalFilteredProofEmployeeNumber } =
//     useStoreTotalFilteredProofEmployee();

//   return (
//     <div>
//       <div className="div">
//         <div className="grid grid-cols-12 gap-5 p-5">
//           <div className="col-span-3">
//             <div
//               className="border-[1px] border-gray-400 rounded-md text-center p-2 font-semibold shadow-4xl"
//               style={{
//                 boxShadow:
//                   "0 4px 6px -1px rgba(107, 114, 128, 0.6), 0 2px 4px -1px rgba(107, 114, 128, 0.8)",
//               }}
//             >
//               <p className="text-xl text-gray-600">Departments Selected</p>
//               <div className="mt-2">
//                 <h1 className="text-3xl text-yellow-500 ">
//                   {totalFilteredProofDepartmentNumber}/{totalDepartmentNumber}
//                 </h1>
//               </div>
//             </div>
//           </div>
//           <div className="col-span-3">
//             <div
//               className="border-[1px] border-gray-400 rounded-md text-center p-2 font-semibold shadow-4xl"
//               style={{
//                 boxShadow:
//                   "0 4px 6px -1px rgba(107, 114, 128, 0.6), 0 2px 4px -1px rgba(107, 114, 128, 0.8)",
//               }}
//             >
//               <p className="text-xl text-gray-600">Locations Selected</p>
//               <div className="mt-2">
//                 <h1 className="text-3xl text-yellow-500 ">
//                   {totalFilteredProofLocationNumber}/{totalLocationNumber}
//                 </h1>
//               </div>
//             </div>
//           </div>
//           <div className="col-span-3">
//             <div
//               className="border-[1px] border-gray-400 rounded-md text-center p-2 font-semibold shadow-4xl"
//               style={{
//                 boxShadow:
//                   "0 4px 6px -1px rgba(107, 114, 128, 0.6), 0 2px 4px -1px rgba(107, 114, 128, 0.8)",
//               }}
//             >
//               <p className="text-xl text-gray-600">Positions Selected</p>

//               <div className="mt-2">
//                 <h1 className="text-3xl text-yellow-500 ">
//                   {" "}
//                   {totalFilteredProofPositionNumber}/{totalPositionNumber}
//                 </h1>
//               </div>
//             </div>
//           </div>
//           <div className="col-span-3">
//             <div
//               className="border-[1px] border-gray-400 rounded-md text-center p-2 font-semibold shadow-4xl"
//               style={{
//                 boxShadow:
//                   "0 4px 6px -1px rgba(107, 114, 128, 0.6), 0 2px 4px -1px rgba(107, 114, 128, 0.8)",
//               }}
//             >
//               <p className="text-xl text-gray-600">Projects Selected</p>
//               <div className="mt-2">
//                 <h1 className="text-3xl text-yellow-500 ">
//                   {totalFilteredProofProjectNumber}/{totalProjectNumber}
//                 </h1>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="grid grid-cols-12 gap-5 p-5">
//           <div className="col-span-3">
//             <div
//               className="border-[1px] border-gray-400 rounded-md text-center p-2 font-semibold shadow-4xl"
//               style={{
//                 boxShadow:
//                   "0 4px 6px -1px rgba(107, 114, 128, 0.6), 0 2px 4px -1px rgba(107, 114, 128, 0.8)",
//               }}
//             >
//               <p className="text-xl text-gray-600">Employees Selected</p>
//               <div className="mt-2">
//                 <h1 className="text-3xl text-yellow-500 ">
//                   {totalFilteredProofEmployeeNumber}/{totalEmployeeNumber}
//                 </h1>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProofReport;
