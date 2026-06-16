// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   useStoreSelectedProofDepartment,
//   useStoreTotalFilteredProofDepartment,
// } from "./useFileStore";

// function ProofDepartment() {
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartments, setSelectedDepartments] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredDepartments, setFilteredDepartments] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const {
//     totalFilteredProofDepartmentNumber,
//     setTotalFilteredProofDepartmentNumber,
//   } = useStoreTotalFilteredProofDepartment();
//   const { setSelectedProofDepartment } = useStoreSelectedProofDepartment();

//   useEffect(() => {
//     setTotalFilteredProofDepartmentNumber(
//       selectedDepartments?.length === departments?.length
//         ? selectedDepartments?.length
//         : selectedDepartments?.length
//     );
//   }, [selectedDepartments]);

//   // Fetch department data on component mount
//   useEffect(() => {
//     axios

//       .then((response) => {
//         const fetchedDepartments = response.data.map(
//           (dept) => `${dept.mainDepartment}` // Rename posId to departmentId
//         );
//         setDepartments(fetchedDepartments);
//         setFilteredDepartments(fetchedDepartments); // Initialize filtered list
//         setSelectedDepartments(fetchedDepartments); // Select all departments by default
//       })
//       .catch((error) => console.error("Failed to fetch departments:", error));
//   }, []);

//   // Handle changes in selection
//   const handleChange = (event) => {
//     const value = event.target.value;

//     if (value === "All") {
//       // Toggle selection of all departments
//       if (selectedDepartments.length === departments.length) {
//         setSelectedDepartments([]); // Deselect all departments if already all are selected
//       } else {
//         setSelectedDepartments(departments); // Select all departments
//       }
//     } else {
//       const newSelection = selectedDepartments.includes(value)
//         ? selectedDepartments.filter((item) => item !== value)
//         : [...selectedDepartments, value];

//       setSelectedDepartments(newSelection);
//     }
//   };

//   useEffect(() => {
//     setSelectedProofDepartment(selectedDepartments);
//   }, [selectedDepartments]);

//   // Handle search bar input
//   const handleSearch = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = departments.filter((department) =>
//       department.toLowerCase().includes(query)
//     );
//     setFilteredDepartments(filtered);
//   };

//   // Check if "All" is selected
//   const isAllSelected = selectedDepartments.length === departments.length;

//   // Format the selected departments list to show only names (without department IDs)
//   const displayText = isAllSelected
//     ? "All"
//     : selectedDepartments.map((dept) => dept.split("-")[1]).join(", ");

//   return (
//     <div style={{ width: "300px" }}>
//       <div
//         style={{ position: "relative", marginTop: "0.5rem", width: "300px" }}
//       >
//         <div
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
//           style={{
//             padding: "8px",
//             border: "1px solid #ccc",
//             borderRadius: "4px",
//             backgroundColor: "#fff",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             width: "100%",
//             overflow: "hidden", // Hide overflowed text
//             textOverflow: "ellipsis", // Show ellipsis for overflowed text
//             whiteSpace: "nowrap", // Prevent wrapping of text
//           }}
//         >
//           <span
//             style={{
//               marginRight: "8px",
//               flex: 1,
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//             }}
//           >
//             {displayText || "Select Departments"}
//           </span>
//           <span
//             style={{
//               fontSize: "12px",
//               marginLeft: "8px",
//               color: "#888",
//             }}
//           >
//             &#9660; {/* Down arrow icon */}
//           </span>
//         </div>

//         {isDropdownOpen && (
//           <div
//             style={{
//               maxHeight: "200px", // Max height to enable scroll
//               overflowY: "auto", // Enable vertical scrolling
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//               backgroundColor: "#fff",
//               marginTop: "0.5rem",
//               position: "absolute", // Ensure dropdown is positioned relative to parent
//               zIndex: 9999, // Fixed z-index to ensure it stays on top
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 padding: "8px",
//                 borderBottom: "1px solid #eee",
//               }}
//             >
//               <input
//                 type="checkbox"
//                 checked={isAllSelected}
//                 onChange={() => handleChange({ target: { value: "All" } })}
//                 style={{ marginRight: "8px" }}
//               />
//               <label>All</label>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 padding: "8px",
//                 borderBottom: "1px solid #eee",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "16px",
//                   marginRight: "8px",
//                   color: "#888",
//                 }}
//               >
//                 &#128269; {/* Search icon */}
//               </span>
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   marginTop: "0.5rem",
//                   border: "1px solid #ccc",
//                   borderRadius: "4px",
//                 }}
//               />
//             </div>

//             {filteredDepartments.map((department) => (
//               <div
//                 key={department}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   padding: "8px",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedDepartments.includes(department)}
//                   onChange={() =>
//                     handleChange({ target: { value: department } })
//                   }
//                 />
//                 <label style={{ marginLeft: "8px" }}>{department}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProofDepartment;
