// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   useStoreSelectedProofProject,
//   useStoreTotalFilteredProofProject,
// } from "./useFileStore";

// function ProofProject() {
//   const [projects, setProjects] = useState([]); // Store project data
//   const [selectedProjects, setSelectedProjects] = useState([]); // Store selected projects
//   const [searchQuery, setSearchQuery] = useState(""); // Search query state
//   const [filteredProjects, setFilteredProjects] = useState([]); // Filtered project options
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility state

//   const {
//     totalFilteredProofProjectNumber,
//     setTotalFilteredProofProjectNumber,
//   } = useStoreTotalFilteredProofProject();
//   const { setSelectedProofProject } = useStoreSelectedProofProject();

//   useEffect(() => {
//     setTotalFilteredProofProjectNumber(
//       selectedProjects?.length === projects?.length
//         ? selectedProjects?.length
//         : selectedProjects?.length
//     );
//   }, [selectedProjects]);

//   // Fetch project data on component mount
//   useEffect(() => {

//       .then((response) => {
//         const fetchedProjects = response.data.map(
//           (proj) => `${proj.projectId} - ${proj.projectName}`
//         );
//         setProjects(fetchedProjects);
//         setFilteredProjects(fetchedProjects); // Initialize filtered list
//         setSelectedProjects(fetchedProjects); // Select all projects by default
//       })
//       .catch((error) => console.error("Failed to fetch projects:", error));
//   }, []);

//   // Handle changes in selection
//   const handleChange = (event) => {
//     const value = event.target.value;

//     if (value === "All") {
//       // Toggle selection of all projects
//       if (selectedProjects.length === projects.length) {
//         setSelectedProjects([]); // Deselect all projects if already all are selected
//       } else {
//         setSelectedProjects(projects); // Select all projects
//       }
//     } else {
//       const newSelection = selectedProjects.includes(value)
//         ? selectedProjects.filter((item) => item !== value)
//         : [...selectedProjects, value];

//       setSelectedProjects(newSelection);
//     }
//   };

//   useEffect(() => {
//     setSelectedProofProject(selectedProjects);
//   }, [selectedProjects]);

//   // Handle search bar input
//   const handleSearch = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = projects.filter((project) =>
//       project.toLowerCase().includes(query)
//     );
//     setFilteredProjects(filtered);
//   };

//   // Check if "All" is selected
//   const isAllSelected = selectedProjects.length === projects.length;

//   // Format the selected projects list to show only names (without IDs)
//   const displayText = isAllSelected ? "All" : selectedProjects.join(", ");

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
//             {displayText || "Select Projects"}
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

//             {filteredProjects.map((project) => (
//               <div
//                 key={project}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   padding: "8px",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedProjects.includes(project)}
//                   onChange={() => handleChange({ target: { value: project } })}
//                 />
//                 <label style={{ marginLeft: "8px" }}>{project}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProofProject;
