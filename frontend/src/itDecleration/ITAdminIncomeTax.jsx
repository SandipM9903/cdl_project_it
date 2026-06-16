// import React, { useEffect, useState } from "react";
// import { BsArrowRightSquare } from "react-icons/bs";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ITCutOff from "./ITCutOff";
// import ITDepartment from "./ITDepartment";
// import ITEmployee from "./ITEmployee";
// import ITLocation from "./ITLocation";
// import ITPosition from "./ITPosition";
// import ITProject from "./ITProject";
// import ITReport from "./ITReport";

// import Swal from "sweetalert2";
// import Service from "./Service";
// import {
//   useStoreITDeclarationITCutOffDate,
//   useStoreITDeclarationStartFinancialYearStatus,
//   useStoreITDeclarationStartStatusStorage,
//   useStoreSelectedDepartment,
//   useStoreSelectedEmployee,
//   useStoreSelectedLocation,
//   useStoreSelectedPosition,
//   useStoreSelectedProject,
// } from "./useFileStore";

// function ITAdminIncomeTax() {
//   const {
//     itDeclarationStartStatusStorage,
//     setItDeclarationStartStatusStorage,
//   } = useStoreITDeclarationStartStatusStorage();

//   const { itDeclarationStartFinancialYearStatus } =
//     useStoreITDeclarationStartFinancialYearStatus();

//   const handleITDeclarationStatus = () => {
//     if (itDeclarationStartFinancialYearStatus?.length !== 0) {
//       sendDataToBackend();
//     } else {
//       Swal.fire({
//         title: "please select financial year",
//         icon: "warn",
//       });
//     }
//   };

//   const { selectedDepartment } = useStoreSelectedDepartment();
//   const { selectedLocation } = useStoreSelectedLocation();
//   const { selectedProject } = useStoreSelectedProject();
//   const { selectedPosition } = useStoreSelectedPosition();
//   const { selectedEmployee } = useStoreSelectedEmployee();
//   const { itDeclarationITCutOffStorage } = useStoreITDeclarationITCutOffDate();

//   const fetchStatus = () => {
//     Service.itAdminFetchStatus(itDeclarationStartFinancialYearStatus).then(
//       (res) => {
//         setItDeclarationStartStatusStorage(res?.data ? res?.data : true);
//       }
//     );
//   };

//   useEffect(() => {
//     fetchStatus();
//   }, [itDeclarationStartFinancialYearStatus]);

//   const sendDataToBackend = () => {
//     if (
//       selectedDepartment?.length !== 0 &&
//       selectedLocation?.length !== 0 &&
//       selectedProject?.length !== 0 &&
//       selectedPosition?.length !== 0 &&
//       selectedEmployee?.length !== 0 &&
//       itDeclarationITCutOffStorage?.length !== 0
//     ) {
//       Service.postITAdminData(itDeclarationStartFinancialYearStatus, {
//         department: selectedDepartment,
//         location: selectedLocation,
//         project: selectedProject,
//         position: selectedPosition,
//         employee: selectedEmployee,
//         cutOffDate: [itDeclarationITCutOffStorage],
//       }).then((res) => {
//         // alert("saved");
//         Swal.fire({
//           icon: "success",
//           title: "Opened",
//         });
//         fetchStatus();
//       });
//     } else {
//       toast.warn("Please fill all fields");
//     }
//   };

//   const [listOfFinancialYear, setListOfFinancialYear] = useState([]);

//   useEffect(() => {
//     Service.getAllITAdminFinanciaYear().then((res) =>
//       res?.status === 200 ? setListOfFinancialYear(res?.data) : []
//     );
//   }, [itDeclarationStartFinancialYearStatus]);

//   console.log(listOfFinancialYear, "listOfFinancialYea>>>>>>>>>>>>>>>>>>>r");

//   return (
//     <div className="">
//       <div className="grid grid-cols-12 items-center my-2 mt-5">
//         <div className="col-span-1"></div>
//         <div className="col-span-1 text-gray-500 font-semibold">1</div>
//         <div className="col-span-1"></div>
//         <div className="col-span-2 text-gray-500 font-semibold text-lg">
//           Choose Departments
//         </div>

//         <div className="cols-span-1"></div>
//         <div className="col-span-3">
//           <ITDepartment />
//         </div>
//       </div>

//       <div className="grid grid-cols-12 items-center">
//         <div className="col-span-1"></div>
//         <div className="col-span-1 text-gray-500 font-semibold">2</div>
//         <div className="col-span-1"></div>
//         <div className="col-span-2 text-gray-500 font-semibold text-lg">
//           Choose Locations
//         </div>

//         <div className="cols-span-1"></div>
//         <div className="col-span-3">
//           <ITLocation />
//         </div>
//       </div>

//       <div className="grid grid-cols-12 items-center my-2">
//         <div className="col-span-1"></div>
//         <div className="col-span-1 text-gray-500 font-semibold">3</div>
//         <div className="col-span-1"></div>
//         <div className="col-span-2 text-gray-500 font-semibold text-lg">
//           Choose Positions
//         </div>

//         <div className="cols-span-1"></div>
//         <div className="col-span-3">
//           <ITPosition />
//         </div>
//       </div>

//       <div className="grid grid-cols-12 items-center ">
//         <div className="col-span-1"></div>
//         <div className="col-span-1 text-gray-500 font-semibold">4</div>
//         <div className="col-span-1"></div>
//         <div className="col-span-2 text-gray-500 font-semibold text-lg">
//           Choose Projects
//         </div>

//         <div className="cols-span-1"></div>
//         <div className="col-span-3">
//           <ITProject />
//         </div>
//       </div>

//       <div className="grid grid-cols-12 items-center my-2">
//         <div className="col-span-1"></div>
//         <div className="col-span-1 text-gray-500 font-semibold">5</div>
//         <div className="col-span-1"></div>
//         <div className="col-span-2 text-gray-500 font-semibold text-lg">
//           Choose Employees
//         </div>

//         <div className="cols-span-1"></div>
//         <div className="col-span-3">
//           <ITEmployee />
//         </div>
//       </div>
//       <div className="grid grid-cols-12 items-center my-4">
//         <div className="col-span-1"></div>
//         <div className="col-span-1 text-gray-500 font-semibold">6</div>
//         <div className="col-span-1"></div>
//         <div className="col-span-2 text-gray-500 font-semibold text-lg">
//           Cut off Date
//         </div>

//         <div className="cols-span-1"></div>
//         <div className="col-span-3">
//           <ITCutOff />
//         </div>
//       </div>
//       <div className="mt-10">
//         <ITReport />
//       </div>

//       <div className="mb-10">
//         {itDeclarationStartStatusStorage !== true ? (
//           <div
//             className="bg-blue-600 float-end mr-5 p-3 cursor-pointer"
//             onClick={handleITDeclarationStatus}
//           >
//             <div className="flex items-center space-x-5">
//               <h1 className="text-white">Start IT Declaration</h1>
//               <BsArrowRightSquare className="text-white text-xl" />
//             </div>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

// export default ITAdminIncomeTax;
