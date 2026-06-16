// // import { useMemo } from "react";

// // export default function FilterPanel({ filters, setFilters, opportunities, onClose }) {
// //   // 🔹 Collect unique dynamic values from opportunities
// //   const businessUnits = useMemo(
// //     () => [...new Set(opportunities.map(o => o.rfpBusinessUnit?.businessUnit).filter(Boolean))],
// //     [opportunities]
// //   );

// //   const leadPracticeUnits = useMemo(
// //     () => [...new Set(opportunities.map(o => o.rfpLeadPracticeUnit?.leadPracticeUnit).filter(Boolean))],
// //     [opportunities]
// //   );

// //   // ✅ FIXED: Use rfpProjectType instead of projectTypeId
// //   const projectTypes = useMemo(
// //     () => [...new Set(opportunities.map(o => o.rfpProjectType?.projectType).filter(Boolean))],
// //     [opportunities]
// //   );

// //   const rfpProcesses = useMemo(
// //     () => [...new Set(opportunities.map(o => o.rfpProcess?.rfpProcess).filter(Boolean))],
// //     [opportunities]
// //   );

// //   // ✅ FIXED: Use custType instead of customerTypeId
// //   const customerTypes = useMemo(
// //     () => [...new Set(opportunities.map(o => o.custType?.custType).filter(Boolean))],
// //     [opportunities]
// //   );

// //   return (
// //     <div className="absolute z-50 bg-white shadow-lg rounded-r-md p-3 top-0 left-60 w-[800px] h-1/3 border">
// //       {/* Header */}
// //       <div className="flex justify-between items-center border-b pb-1 mb-2">
// //         <span className="font-semibold text-gray-700 text-sm">Filters</span>
// //         <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xs">✕</button>
// //       </div>
// //       <div className="grid grid-cols-2 md:grid-cols-8 gap-6">

// //         {/* Status */}
// //         <label className="block mb-2 text-xs text-gray-600">Status</label>
// //         <select
// //           className="w-full border rounded p-1 mb-3 text-sm"
// //           value={filters.status || ""}
// //           onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || null }))}
// //         >
// //           <option value="">All</option>
// //           <option value="Open">Open</option>
// //           <option value="Closed">Closed</option>
// //         </select>

// //         {/* Business Unit */}
// //         <label className="block mb-2 text-xs text-gray-600">Business Unit</label>
// //         <select
// //           className="w-full border rounded p-1 mb-3 text-sm"
// //           value={filters.businessUnit || ""}
// //           onChange={(e) => setFilters(prev => ({ ...prev, businessUnit: e.target.value || null }))}
// //         >
// //           <option value="">All</option>
// //           {businessUnits.map((bu) => <option key={bu} value={bu}>{bu}</option>)}
// //         </select>

// //         {/* Lead Practice Unit */}
// //         <label className="block mb-2 text-xs text-gray-600">Lead Practice Unit</label>
// //         <select
// //           className="w-full border rounded p-1 mb-3 text-sm"
// //           value={filters.leadPracticeUnit || ""}
// //           onChange={(e) => setFilters(prev => ({ ...prev, leadPracticeUnit: e.target.value || null }))}
// //         >
// //           <option value="">All</option>
// //           {leadPracticeUnits.map((lpu) => <option key={lpu} value={lpu}>{lpu}</option>)}
// //         </select>

// //         {/* Quarter */}
// //         <label className="block mb-2 text-xs text-gray-600">Quarter</label>
// //         <select
// //           className="w-full border rounded p-1 mb-3 text-sm"
// //           value={filters.quarter || ""}
// //           onChange={(e) => setFilters(prev => ({ ...prev, quarter: e.target.value || null }))}
// //         >
// //           <option value="">All</option>
// //           <option value="Q1">Q1</option>
// //           <option value="Q2">Q2</option>
// //           <option value="Q3">Q3</option>
// //           <option value="Q4">Q4</option>
// //         </select>

// //         {/* ✅ Project Type */}
// //         <label className="block mb-2 text-xs text-gray-600">Project Type</label>
// //         <select
// //           className="w-full border rounded p-1 mb-3 text-sm"
// //           value={filters.projectType || ""}
// //           onChange={(e) => setFilters(prev => ({ ...prev, projectType: e.target.value || null }))}
// //         >
// //           <option value="">All</option>
// //           {projectTypes.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
// //         </select>

// //         {/* RFP Process */}
// //         <label className="block mb-2 text-xs text-gray-600">RFP Process</label>
// //         <select
// //           className="w-full border rounded p-1 mb-3 text-sm"
// //           value={filters.rfpProcess || ""}
// //           onChange={(e) => setFilters(prev => ({ ...prev, rfpProcess: e.target.value || null }))}
// //         >
// //           <option value="">All</option>
// //           {rfpProcesses.map((rp) => <option key={rp} value={rp}>{rp}</option>)}
// //         </select>

// //         {/* ✅ Customer Type */}
// //         <label className="block mb-2 text-xs text-gray-600">Customer Type</label>
// //         <select
// //           className="w-full border rounded p-1 mb-3 text-sm"
// //           value={filters.customerType || ""}
// //           onChange={(e) => setFilters(prev => ({ ...prev, customerType: e.target.value || null }))}
// //         >
// //           <option value="">All</option>
// //           {customerTypes.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
// //         </select>
// //       </div>
// //     </div>
// //   );
// // }
// import { useMemo, useState } from "react";

// export default function FilterPanel({ filters, setFilters,thresholds,setThresholds, opportunities, onClose }) {
//   // 🔹 Default thresholds (can be changed by sliders/inputs)


//   // 🔹 Collect unique dynamic values
//   const businessUnits = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpBusinessUnit?.businessUnit).filter(Boolean))],
//     [opportunities]
//   );

//   const leadPracticeUnits = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpLeadPracticeUnit?.leadPracticeUnit).filter(Boolean))],
//     [opportunities]
//   );

//   const projectTypes = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpProjectType?.projectType).filter(Boolean))],
//     [opportunities]
//   );

//   const rfpProcesses = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpProcess?.rfpProcess).filter(Boolean))],
//     [opportunities]
//   );

//   const customerTypes = useMemo(
//     () => [...new Set(opportunities.map(o => o.custType?.custType).filter(Boolean))],
//     [opportunities]
//   );

//   // 🔹 Categorize opportunities dynamically
//   const categories = useMemo(() => {
//     return opportunities.map(o => {
//       const budget = o.customerProjBudget || 0;
//       if (budget >= thresholds.platinum) return { ...o, category: "Platinum" };
//       if (budget >= thresholds.gold) return { ...o, category: "Gold" };
//       if (budget >= thresholds.silver) return { ...o, category: "Silver" };
//       return { ...o, category: "Bronze" };
//     });
//   }, [opportunities, thresholds]);

//   // 🔹 Extract unique category values
//   const budgetCategories = ["Platinum", "Gold", "Silver", "Bronze"];

//   // 🔹 Handle threshold change
//   const handleThresholdChange = (category, value) => {
//     setThresholds(prev => ({ ...prev, [category]: Number(value) }));
//   };

//   return (
//     <div className="absolute z-50 bg-white shadow-lg rounded-r-md p-3 top-0 left-60 w-[900px] h-2/3 border overflow-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center border-b pb-1 mb-2">
//         <span className="font-semibold text-gray-700 text-sm">Filters</span>
//         <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xs">✕</button>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-8 gap-6">
//         {/* Status */}
//         <label className="block mb-2 text-xs text-gray-600">Status</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.status || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           <option value="Open">Open</option>
//           <option value="Closed">Closed</option>
//         </select>

//         {/* Business Unit */}
//         <label className="block mb-2 text-xs text-gray-600">Business Unit</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.businessUnit || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, businessUnit: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {businessUnits.map((bu) => <option key={bu} value={bu}>{bu}</option>)}
//         </select>

//         {/* Lead Practice Unit */}
//         <label className="block mb-2 text-xs text-gray-600">Lead Practice Unit</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.leadPracticeUnit || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, leadPracticeUnit: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {leadPracticeUnits.map((lpu) => <option key={lpu} value={lpu}>{lpu}</option>)}
//         </select>

//         {/* Quarter */}
//         <label className="block mb-2 text-xs text-gray-600">Quarter</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.quarter || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, quarter: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           <option value="Q1">Q1</option>
//           <option value="Q2">Q2</option>
//           <option value="Q3">Q3</option>
//           <option value="Q4">Q4</option>
//         </select>

//         {/* Project Type */}
//         <label className="block mb-2 text-xs text-gray-600">Project Type</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.projectType || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, projectType: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {projectTypes.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
//         </select>

//         {/* RFP Process */}
//         <label className="block mb-2 text-xs text-gray-600">RFP Process</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.rfpProcess || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, rfpProcess: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {rfpProcesses.map((rp) => <option key={rp} value={rp}>{rp}</option>)}
//         </select>

//         {/* Customer Type */}
//         <label className="block mb-2 text-xs text-gray-600">Customer Type</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.customerType || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, customerType: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {customerTypes.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
//         </select>

//         {/* Budget Category (Platinum / Gold / Silver / Bronze) */}
//         <label className="block mb-2 text-xs text-gray-600">Budget Category</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.budgetCategory || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, budgetCategory: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {budgetCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
//         </select>
//       </div>

//       {/* 🔹 Threshold Sliders */}
//       <div className="mt-4 p-3 border-t">
//         <h4 className="font-semibold text-sm mb-2">Adjust Budget Thresholds</h4>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {Object.keys(thresholds).map((cat) => (
//             <div key={cat} className="flex flex-col">
//               <label className="capitalize text-xs text-gray-600">{cat}</label>
//               <input
//                 type="number"
//                 value={thresholds[cat]}
//                 onChange={(e) => handleThresholdChange(cat, e.target.value)}
//                 className="border rounded p-1 text-sm"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



// export default function FilterPanel({ filters, setFilters, opportunities, onClose }) {
//   const [tiers, setTiers] = useState([]);

//   useEffect(() => {
//     TierService.getTiers()
//       .then((res) => setTiers(res.data))
//       .catch((err) => console.error("Failed to fetch tiers:", err));
//   }, []);

//   // 🔹 Collect unique dynamic values
//   const businessUnits = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpBusinessUnit?.businessUnit).filter(Boolean))],
//     [opportunities]
//   );
//   const leadPracticeUnits = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpLeadPracticeUnit?.leadPracticeUnit).filter(Boolean))],
//     [opportunities]
//   );
//   const projectTypes = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpProjectType?.projectType).filter(Boolean))],
//     [opportunities]
//   );
//   const rfpProcesses = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpProcess?.rfpProcess).filter(Boolean))],
//     [opportunities]
//   );
//   const customerTypes = useMemo(
//     () => [...new Set(opportunities.map(o => o.custType?.custType).filter(Boolean))],
//     [opportunities]
//   );

//   return (
//     <div className="absolute z-50 bg-white shadow-lg rounded-r-md p-3 top-0 left-60 w-[900px] h-2/3 border overflow-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center border-b pb-1 mb-2">
//         <span className="font-semibold text-gray-700 text-sm">Filters</span>
//         <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xs">✕</button>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-8 gap-6">
//         {/* Status */}
//         <label className="block mb-2 text-xs text-gray-600">Status</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.status || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           <option value="Open">Open</option>
//           <option value="Closed">Closed</option>
//         </select>

//         {/* Business Unit */}
//         <label className="block mb-2 text-xs text-gray-600">Business Unit</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.businessUnit || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, businessUnit: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {businessUnits.map((bu) => <option key={bu} value={bu}>{bu}</option>)}
//         </select>

//         {/* Lead Practice Unit */}
//         <label className="block mb-2 text-xs text-gray-600">Lead Practice Unit</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.leadPracticeUnit || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, leadPracticeUnit: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {leadPracticeUnits.map((lpu) => <option key={lpu} value={lpu}>{lpu}</option>)}
//         </select>

//         {/* Quarter */}
//         <label className="block mb-2 text-xs text-gray-600">Quarter</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.quarter || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, quarter: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           <option value="Q1">Q1</option>
//           <option value="Q2">Q2</option>
//           <option value="Q3">Q3</option>
//           <option value="Q4">Q4</option>
//         </select>

//         {/* Project Type */}
//         <label className="block mb-2 text-xs text-gray-600">Project Type</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.projectType || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, projectType: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {projectTypes.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
//         </select>

//         {/* RFP Process */}
//         <label className="block mb-2 text-xs text-gray-600">RFP Process</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.rfpProcess || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, rfpProcess: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {rfpProcesses.map((rp) => <option key={rp} value={rp}>{rp}</option>)}
//         </select>

//         {/* Customer Type */}
//         <label className="block mb-2 text-xs text-gray-600">Customer Type</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.customerType || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, customerType: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {customerTypes.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
//         </select>

//         {/* 🔹 Budget Category (DB-driven tiers) */}
//         <label className="block mb-2 text-xs text-gray-600">Budget Category</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.budgetCategory || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, budgetCategory: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {tiers.map((tier) => (
//             <option key={tier.tierId} value={tier.tierName}>
//               {tier.tierName}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useMemo, useState } from "react";
// import Service from "../../services/Service";

// export default function FilterPanel({ filters, setFilters, opportunities, onClose }) {
//   const [tiers, setTiers] = useState([]);

//   useEffect(() => {
//     Service.getTiers()
//       .then((res) => {
//         const list = (res.data && res.data.data) ? res.data.data : [];
//         // ensure stable order (by start)
//         const cleaned = list
//           .map((t) => ({ id: t.id, tierName: t.tierName, start: Number(t.start || 0) }))
//           .sort((a, b) => a.start - b.start);
//         setTiers(cleaned);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch tiers:", err);
//         setTiers([]);
//       });
//   }, []);

//   const businessUnits = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpBusinessUnit?.businessUnit).filter(Boolean))],
//     [opportunities]
//   );

//   const leadPracticeUnits = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpLeadPracticeUnit?.leadPracticeUnit).filter(Boolean))],
//     [opportunities]
//   );

//   const projectTypes = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpProjectType?.projectType).filter(Boolean))],
//     [opportunities]
//   );

//   const rfpProcesses = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpProcess?.rfpProcess).filter(Boolean))],
//     [opportunities]
//   );

//   const customerTypes = useMemo(
//     () => [...new Set(opportunities.map(o => o.custType?.custType).filter(Boolean))],
//     [opportunities]
//   );

//   return (
//     <div className="absolute z-50 bg-white shadow-lg rounded-r-md p-3 top-0 left-60 w-[900px] h-1/3 border overflow-auto">
//       <div className="flex justify-between items-center border-b pb-1 mb-2">
//         <span className="font-semibold text-gray-700 text-sm">Filters</span>
//         <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xs">✕</button>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-8 gap-6">
//         {/* Status */}
//         <label className="block mb-2 text-xs text-gray-600">Status</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.status || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           <option value="Open">Open</option>
//           <option value="Closed">Closed</option>
//         </select>

//         {/* Business Unit */}
//         <label className="block mb-2 text-xs text-gray-600">Business Unit</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.businessUnit || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, businessUnit: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {businessUnits.map((bu) => <option key={bu} value={bu}>{bu}</option>)}
//         </select>

//         {/* Lead Practice Unit */}
//         <label className="block mb-2 text-xs text-gray-600">Lead Practice Unit</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.leadPracticeUnit || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, leadPracticeUnit: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {leadPracticeUnits.map((lpu) => <option key={lpu} value={lpu}>{lpu}</option>)}
//         </select>

//         {/* Quarter */}
//         <label className="block mb-2 text-xs text-gray-600">Quarter</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.quarter || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, quarter: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           <option value="Q1">Q1</option>
//           <option value="Q2">Q2</option>
//           <option value="Q3">Q3</option>
//           <option value="Q4">Q4</option>
//         </select>

//         {/* Project Type */}
//         <label className="block mb-2 text-xs text-gray-600">Project Type</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.projectType || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, projectType: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {projectTypes.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
//         </select>

//         {/* RFP Process */}
//         <label className="block mb-2 text-xs text-gray-600">RFP Process</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.rfpProcess || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, rfpProcess: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {rfpProcesses.map((rp) => <option key={rp} value={rp}>{rp}</option>)}
//         </select>

//         {/* Customer Type */}
//         <label className="block mb-2 text-xs text-gray-600">Customer Type</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.customerType || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, customerType: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {customerTypes.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
//         </select>

//         {/* Budget Category (DB-driven tiers) */}
//         <label className="block mb-2 text-xs text-gray-600">Budget Category</label>
//         <select
//           className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.budgetCategory || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, budgetCategory: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {tiers.map((tier) => (
//             <option key={tier.id} value={tier.tierName}>
//               {tier.tierName}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import Service from "../../services/Service";
import axios from "axios";

export default function FilterPanel({ filters, setFilters, opportunities, onClose }) {
  const [tiers, setTiers] = useState([]);
  const [empData, setEmpData] = useState({});
  const [isRfpAdmin, setIsRfpAdmin] = useState(false);
  const [mainDepartment, setMainDepartment] = useState("");

  // Fetch employee data & extract role + main department
  useEffect(() => {
    const empCode = localStorage.getItem("empId");

    axios
      .get(`http://43.205.24.208:9020/employee/eCode/${empCode}`)
      .then((res) => {
        const data = res.data;
        setEmpData(data);

        // ✔ Extract Main Department
        const dept =
          data?.fileAndObjectTypeBean?.empResDTO?.mainDeptResDTO?.mainDepartment ||
          "";
        setMainDepartment(dept);

        // ✔ Extract roles & check for RFP Admin
        const roles = data?.userDTO?.userRoleResDTOS || [];
        const admin =
          roles.some(
            (r) => r?.roleResDTO?.name?.trim()?.toLowerCase() === "rfp admin"
          ) || false;

        setIsRfpAdmin(admin);
      })
      .catch((err) => alert(err));
  }, []);

  // Fetch tiers
  useEffect(() => {
    Service.getTiers()
      .then((res) => {
        const list = res.data?.data || [];
        const cleaned = list
          .map((t) => ({
            id: t.id,
            tierName: t.tierName,
            start: Number(t.start || 0),
          }))
          .sort((a, b) => a.start - b.start);

        setTiers(cleaned);
      })
      .catch(() => setTiers([]));
  }, []);

  // BUSINESS UNIT
  const businessUnits = useMemo(
    () =>
      [...new Set(opportunities.map((o) => o.rfpBusinessUnit?.businessUnit).filter(Boolean))],
    [opportunities]
  );

  // ✔ FIXED: LEAD PRACTICE UNIT (role-based: Admin sees all, user sees main department)
  const leadPracticeUnits = useMemo(() => {
    if (isRfpAdmin) {
      return [
        ...new Set(
          opportunities
            .map((o) => o.rfpLeadPracticeUnit?.leadPracticeUnit)
            .filter(Boolean)
        ),
      ];
    }

    // Normal user → only their own mainDepartment
    return mainDepartment ? [mainDepartment] : [];
  }, [opportunities, isRfpAdmin, mainDepartment]);

  const projectTypes = useMemo(
    () => [...new Set(opportunities.map((o) => o.rfpProjectType?.projectType).filter(Boolean))],
    [opportunities]
  );

  const rfpProcesses = useMemo(
    () => [...new Set(opportunities.map((o) => o.rfpProcess?.rfpProcess).filter(Boolean))],
    [opportunities]
  );

  const customerTypes = useMemo(
    () => [...new Set(opportunities.map((o) => o.custType?.custType).filter(Boolean))],
    [opportunities]
  );

  return (
    <div className="absolute z-50 bg-white shadow-lg rounded-r-md p-3 top-0 left-60 w-[900px] h-1/3 border overflow-auto">
      <div className="flex justify-between items-center border-b pb-1 mb-2">
        <span className="font-semibold text-gray-700 text-sm">Filters</span>
        <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xs">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-8 gap-6">
        {/* STATUS */}
        <label className="block mb-2 text-xs text-gray-600">Status</label>
        <select
          className="w-full border rounded p-1 mb-3 text-sm"
          value={filters.status || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value || null }))}
        >
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>

        {/* BUSINESS UNIT */}
        <label className="block mb-2 text-xs text-gray-600">Business Unit</label>
        <select
          className="w-full border rounded p-1 mb-3 text-sm"
          value={filters.businessUnit || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, businessUnit: e.target.value || null }))}
        >
          <option value="">All</option>
          {businessUnits.map((bu) => (
            <option key={bu} value={bu}>
              {bu}
            </option>
          ))}
        </select>

        {/* LEAD PRACTICE UNIT */}
        {/* <label className="block mb-2 text-xs text-gray-600">Lead Practice Unit</label>
        <select
          className="w-full border rounded p-1 mb-3 text-sm"
          value={filters.leadPracticeUnit || ""}
          onChange={(e) =>
            isRfpAdmin
              ? setFilters((prev) => ({
                ...prev,
                leadPracticeUnit: e.target.value || null,
              }))
              : null
          }
          disabled={!isRfpAdmin} 
        >
          {isRfpAdmin && <option value="">All</option>} 

          {leadPracticeUnits.map((lpu) => (
            <option key={lpu} value={lpu}>
              {lpu}
            </option>
          ))}
        </select> */}
{/* 
        <label className="block mb-2 text-xs text-gray-600">
  Lead Practice Unit
</label>

<select
  className="w-full border rounded p-1 mb-3 text-sm"
  value={filters.leadPracticeUnit || ""}
  onChange={(e) =>
    isRfpAdmin
      ? setFilters((prev) => ({
          ...prev,
          leadPracticeUnit: e.target.value || null,
        }))
      : null
  }
  disabled={!isRfpAdmin}
  title={filters.leadPracticeUnit || "Select Lead Practice Unit"} // 👈 shows tooltip
>
  {isRfpAdmin && <option value="">All</option>}

  {leadPracticeUnits.map((lpu) => (
    <option key={lpu} value={lpu}>
      {lpu}
    </option>
  ))}
</select> */}

<label className="block mb-2 text-xs text-gray-600">
  Lead Practice Unit
</label>

<select
  className="w-full border rounded p-1 mb-3 text-sm"
  value={
    filters.leadPracticeUnit || (!isRfpAdmin ? mainDepartment : "")
  }
  onChange={(e) =>
    isRfpAdmin
      ? setFilters((prev) => ({
          ...prev,
          leadPracticeUnit: e.target.value || null,
        }))
      : null
  }
  disabled={!isRfpAdmin} 
  title={
   
    filters.leadPracticeUnit ||
    (!isRfpAdmin ? mainDepartment : "Select Lead Practice Unit") ||
    "Select Lead Practice Unit"
  }
>
  {/* Admin sees All option */}
  {isRfpAdmin && <option value="">All</option>}

  {leadPracticeUnits.map((lpu) => (
    <option key={lpu} value={lpu}>
      {lpu}
    </option>
  ))}
</select>



        {/* OTHER DROPDOWNS */}
        <label className="block mb-2 text-xs text-gray-600">Quarter</label>
        <select
          className="w-full border rounded p-1 mb-3 text-sm"
          value={filters.quarter || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, quarter: e.target.value || null }))}
        >
          <option value="">All</option>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>

        {/* PROJECT TYPE */}
        <label className="block mb-2 text-xs text-gray-600">Project Type</label>
        <select
          className="w-full border rounded p-1 mb-3 text-sm"
          value={filters.projectType || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, projectType: e.target.value || null }))}
        >
          <option value="">All</option>
          {projectTypes.map((pt) => (
            <option key={pt} value={pt}>
              {pt}
            </option>
          ))}
        </select>

        {/* RFP PROCESS */}
        <label className="block mb-2 text-xs text-gray-600">RFP Process</label>
        <select
          className="w-full border rounded p-1 mb-3 text-sm"
          value={filters.rfpProcess || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, rfpProcess: e.target.value || null }))}
        >
          <option value="">All</option>
          {rfpProcesses.map((rp) => (
            <option key={rp} value={rp}>
              {rp}
            </option>
          ))}
        </select>

        {/* CUSTOMER TYPE */}
        <label className="block mb-2 text-xs text-gray-600">Customer Type</label>
        <select
          className="w-full border rounded p-1 mb-3 text-sm"
          value={filters.customerType || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              customerType: e.target.value || null,
            }))
          }
        >
          <option value="">All</option>
          {customerTypes.map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </select>

        {/* BUDGET CATEGORY */}
        <label className="block mb-2 text-xs text-gray-600">Budget Category</label>
        <select
          className="w-full border rounded p-1 mb-3 text-sm"
          value={filters.budgetCategory || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              budgetCategory: e.target.value || null,
            }))
          }
        >
          <option value="">All</option>
          {tiers.map((tier) => (
            <option key={tier.id} value={tier.tierName}>
              {tier.tierName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// import { useEffect, useMemo, useState } from "react";
// import Service from "../../services/Service";

// export default function FilterPanel({ filters, setFilters, opportunities, onClose }) {
//   const [tiers, setTiers] = useState([]);

//   const role = localStorage.getItem("role");
//   const userDepartment = localStorage.getItem("designation");

//   useEffect(() => {
//     Service.getTiers()
//       .then((res) => {
//         const list = (res.data && res.data.data) ? res.data.data : [];
//         const cleaned = list.map((t) => ({ id: t.id, tierName: t.tierName, start: Number(t.start || 0) }))
//           .sort((a, b) => a.start - b.start);
//         setTiers(cleaned);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch tiers:", err);
//         setTiers([]);
//       });
//   }, []);

//   const businessUnits = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpBusinessUnit?.businessUnit).filter(Boolean))],
//     [opportunities]
//   );

//   const leadPracticeUnits = useMemo(
//     () => role === "Admin"
//       ? [...new Set(opportunities.map(o => o.rfpLeadPracticeUnit?.leadPracticeUnit).filter(Boolean))]
//       : [userDepartment],
//     [opportunities, role, userDepartment]
//   );

//   const projectTypes = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpProjectType?.projectType).filter(Boolean))],
//     [opportunities]
//   );

//   const rfpProcesses = useMemo(
//     () => [...new Set(opportunities.map(o => o.rfpProcess?.rfpProcess).filter(Boolean))],
//     [opportunities]
//   );

//   const customerTypes = useMemo(
//     () => [...new Set(opportunities.map(o => o.custType?.custType).filter(Boolean))],
//     [opportunities]
//   );

//   return (
//     <div className="absolute z-50 bg-white shadow-lg rounded-r-md p-3 top-0 left-60 w-[900px] h-1/3 border overflow-auto">
//       <div className="flex justify-between items-center border-b pb-1 mb-2">
//         <span className="font-semibold text-gray-700 text-sm">Filters</span>
//         <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xs">✕</button>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-8 gap-6">
//         {/* Status */}
//         <label className="block mb-2 text-xs text-gray-600">Status</label>
//         <select className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.status || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           <option value="Open">Open</option>
//           <option value="Closed">Closed</option>
//         </select>

//         {/* Business Unit */}
//         <label className="block mb-2 text-xs text-gray-600">Business Unit</label>
//         <select className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.businessUnit || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, businessUnit: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {businessUnits.map(bu => <option key={bu} value={bu}>{bu}</option>)}
//         </select>

//         {/* Lead Practice Unit */}
//         <label className="block mb-2 text-xs text-gray-600">Lead Practice Unit</label>
//         <select className="w-full border rounded p-1 mb-3 text-sm"
//           value={role === "Admin" ? filters.leadPracticeUnit || "" : userDepartment}
//           onChange={(e) => {
//             if (role === "Admin") setFilters(prev => ({ ...prev, leadPracticeUnit: e.target.value || null }));
//           }}
//           disabled={role !== "Admin"}
//         >
//           {role === "Admin" && <option value="">All</option>}
//           {leadPracticeUnits.map(lpu => <option key={lpu} value={lpu}>{lpu}</option>)}
//         </select>

//         {/* Quarter */}
//         <label className="block mb-2 text-xs text-gray-600">Quarter</label>
//         <select className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.quarter || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, quarter: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           <option value="Q1">Q1</option>
//           <option value="Q2">Q2</option>
//           <option value="Q3">Q3</option>
//           <option value="Q4">Q4</option>
//         </select>

//         {/* Project Type */}
//         <label className="block mb-2 text-xs text-gray-600">Project Type</label>
//         <select className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.projectType || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, projectType: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {projectTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
//         </select>

//         {/* RFP Process */}
//         <label className="block mb-2 text-xs text-gray-600">RFP Process</label>
//         <select className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.rfpProcess || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, rfpProcess: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {rfpProcesses.map(rp => <option key={rp} value={rp}>{rp}</option>)}
//         </select>

//         {/* Customer Type */}
//         <label className="block mb-2 text-xs text-gray-600">Customer Type</label>
//         <select className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.customerType || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, customerType: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {customerTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
//         </select>

//         {/* Budget Category */}
//         <label className="block mb-2 text-xs text-gray-600">Budget Category</label>
//         <select className="w-full border rounded p-1 mb-3 text-sm"
//           value={filters.budgetCategory || ""}
//           onChange={(e) => setFilters(prev => ({ ...prev, budgetCategory: e.target.value || null }))}
//         >
//           <option value="">All</option>
//           {tiers.map(tier => <option key={tier.id} value={tier.tierName}>{tier.tierName}</option>)}
//         </select>
//       </div>
//     </div>
//   );
// }
