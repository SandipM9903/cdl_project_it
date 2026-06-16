// import React, { useEffect, useState } from "react";
// import { BsArrowRightSquare } from "react-icons/bs";
// import ProofDepartment from "./ProofDepartment";
// import ProofEmployee from "./ProofEmployee";
// import ProofLocation from "./ProofLocation";
// import ProofPosition from "./ProofPosition";
// import ProofProject from "./ProofProject";
// import ProofReport from "./ProofReport";

// import Swal from "sweetalert2";
// import Service from "./Service";
// import {
//   useStoreITDeclarationStartFinancialYearStatus,
//   useStoreITDeclarationStartFinancialYearStatusStorage,
//   useStoreITDeclarationStartStatus,
//   useStoreITDeclarationStartStatusStorage,
//   useStoreProofOfInvestmentCutOffDate,
//   useStoreProofOfInvestmentStartFinancialYearStatus,
//   useStoreProofOfInvestmentStartStatusStorage,
//   useStoreSelectedProofDepartment,
//   useStoreSelectedProofEmployee,
//   useStoreSelectedProofLocation,
//   useStoreSelectedProofPosition,
//   useStoreSelectedProofProject,
// } from "./useFileStore";
// import ProofCutOff from "./ProofCutOff";

// function ITAdminProofOfInvestment() {
//   const { setItDeclarationStartFinancialYearStatusStorage } =
//     useStoreITDeclarationStartFinancialYearStatusStorage();
//   const { setItDeclarationStartStatusStorage } =
//     useStoreITDeclarationStartStatusStorage();

//   const { itDeclarationStartFinancialYearStatus } =
//     useStoreITDeclarationStartFinancialYearStatus();
//   const { itDeclarationStartStatus } = useStoreITDeclarationStartStatus();

//   const { itDeclarationStartFinancialYearStatusStorage } =
//     useStoreITDeclarationStartFinancialYearStatusStorage();
//   const { itDeclarationStartStatusStorage } =
//     useStoreITDeclarationStartStatusStorage();

//   console.log(
//     itDeclarationStartFinancialYearStatus,
//     "itDeclarationStartFinancialYearStatus"
//   );
//   console.log(itDeclarationStartStatus, "itDeclarationStartStatus");

//   const {
//     proofOfInvestmentStartFinancialYearStatus,
//     setProofOfInvestmentStartFinancialYearStatus,
//   } = useStoreProofOfInvestmentStartFinancialYearStatus();

//   console.warn(
//     proofOfInvestmentStartFinancialYearStatus,
//     "proofOfInvestmentStartFinancialYearStatus"
//   );

//   const handleProofOfinvestmentStatus = () => {
//     if (proofOfInvestmentStartFinancialYearStatus?.length !== 0) {
//       sendRequestForProofOfInvestment();
//     } else {
//       Swal.fire({
//         title: "please select financial year",
//         icon: "warn",
//       });
//     }
//   };

//   const { selectedProofDepartment } = useStoreSelectedProofDepartment();
//   const { selectedProofLocation } = useStoreSelectedProofLocation();
//   const { selectedProofProject } = useStoreSelectedProofProject();
//   const { selectedProofPosition } = useStoreSelectedProofPosition();
//   const { selectedProofEmployee } = useStoreSelectedProofEmployee();
//   const { proofDateCutOffStorage } = useStoreProofOfInvestmentCutOffDate();

//   const sendRequestForProofOfInvestment = () => {
//     Service.postProofOfInvestmentAdminData(
//       proofOfInvestmentStartFinancialYearStatus,
//       {
//         department: selectedProofDepartment,
//         location: selectedProofLocation,
//         project: selectedProofProject,
//         position: selectedProofPosition,
//         employee: selectedProofEmployee,
//         cutOffProofDate: [proofDateCutOffStorage],
//       }
//     ).then((res) => {
//       // alert("saved");
//       Swal.fire({
//         icon: "success",
//         title: "Opened",
//       });
//       fetchStatus();
//     });
//   };

//   const { setProofOfInvestmentStartStatusStorage } =
//     useStoreProofOfInvestmentStartStatusStorage();

//   const fetchStatus = () => {
//     Service.proofOfInvestmentFetchStatus(
//       proofOfInvestmentStartFinancialYearStatus
//     ).then((res) => {
//       setProofOfInvestmentStartStatusStorage(res?.data ? res?.data : true);
//     });
//   };

//   const [listOfFinancialYear, setListOfFinancialYear] = useState([]);

//   useEffect(() => {
//     Service.getAllProofAdminFinanciaYear().then((res) =>
//       res?.status === 200 ? setListOfFinancialYear(res?.data) : []
//     );
//   }, [proofOfInvestmentStartFinancialYearStatus]);

//   console.log(
//     listOfFinancialYear,
//     "listOfFinancialYea>>>>>>>>>>>>>>>>>>>rproof"
//   );

//   const { proofOfInvestmentStartStatusStorage } =
//     useStoreProofOfInvestmentStartStatusStorage();

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
//           <ProofDepartment />
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
//           <ProofLocation />
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
//           <ProofPosition />
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
//           <ProofProject />
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
//           <ProofEmployee />
//         </div>
//       </div>
//       <div className="grid grid-cols-12 items-center">
//         <div className="col-span-1"></div>
//         <div className="col-span-1 text-gray-500 font-semibold">6</div>
//         <div className="col-span-1"></div>
//         <div className="col-span-2 text-gray-500 font-semibold text-lg">
//           Cut off Date
//         </div>

//         <div className="cols-span-1"></div>
//         <div className="col-span-3">
//           <ProofCutOff />
//         </div>
//       </div>
//       <div className="mt-10">
//         <ProofReport />
//       </div>

//       <div className="mb-10">
//         {proofOfInvestmentStartStatusStorage !== true ? (
//           <div
//             className="bg-blue-600 float-end mr-5 p-3 cursor-pointer"
//             onClick={handleProofOfinvestmentStatus}
//           >
//             <div className="flex items-center space-x-5">
//               <h1 className="text-white">Start proof of investment</h1>
//               <BsArrowRightSquare className="text-white text-xl" /> 
//             </div>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>
//     </div>
//   );
// }

// export default ITAdminProofOfInvestment;
