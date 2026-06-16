// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   useStoreSelectedProofEmployee,
//   useStoreTotalFilteredProofEmployee,
// } from "./useFileStore";

// function ProofEmployee() {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const {
//     totalFilteredProofEmployeeNumber,
//     setTotalFilteredProofEmployeeNumber,
//   } = useStoreTotalFilteredProofEmployee();
//   const { setSelectedProofEmployee } = useStoreSelectedProofEmployee();

//   useEffect(() => {
//     setTotalFilteredProofEmployeeNumber(
//       selectedEmployees?.length === employees?.length
//         ? selectedEmployees?.length
//         : selectedEmployees?.length
//     );
//   }, [selectedEmployees]);

//   // Fetch employee data on component mount
//   useEffect(() => {
//     axios

//       .then((response) => {
//         const fetchedEmployees = response.data.map(
//           (emp) => `${emp.empCode} - ${emp.firstName}`
//         );
//         setEmployees(fetchedEmployees);
//         setFilteredEmployees(fetchedEmployees); // Initialize filtered list
//         setSelectedEmployees(fetchedEmployees); // Select all employees by default
//       })
//       .catch((error) => console.error("Failed to fetch employees:", error));
//   }, []);

//   // Handle changes in selection
//   const handleChange = (event) => {
//     const value = event.target.value;

//     if (value === "All") {
//       // Toggle selection of all employees
//       if (selectedEmployees.length === employees.length) {
//         setSelectedEmployees([]); // Deselect all employees if already all are selected
//       } else {
//         setSelectedEmployees(employees); // Select all employees
//       }
//     } else {
//       const newSelection = selectedEmployees.includes(value)
//         ? selectedEmployees.filter((item) => item !== value)
//         : [...selectedEmployees, value];

//       setSelectedEmployees(newSelection);
//     }
//   };

//   useEffect(() => {
//     setSelectedProofEmployee(selectedEmployees);
//   }, [selectedEmployees]);

//   // Handle search bar input
//   const handleSearch = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = employees.filter((employee) =>
//       employee.toLowerCase().includes(query)
//     );
//     setFilteredEmployees(filtered);
//   };

//   // Check if "All" is selected
//   const isAllSelected = selectedEmployees.length === employees.length;

//   // Format the selected employees list to show only names (without IDs)
//   const displayText = isAllSelected ? "All" : selectedEmployees.join(", ");

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
//             {displayText || "Select Employees"}
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

//             {filteredEmployees.map((employee) => (
//               <div
//                 key={employee}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   padding: "8px",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedEmployees.includes(employee)}
//                   onChange={() => handleChange({ target: { value: employee } })}
//                 />
//                 <label style={{ marginLeft: "8px" }}>{employee}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProofEmployee;
