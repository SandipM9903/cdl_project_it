// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   useStoreSelectedProofPosition,
//   useStoreTotalFilteredProofPosition,
// } from "./useFileStore";

// function ProofPosition() {
//   const [positions, setPositions] = useState([]);
//   const [selectedPositions, setSelectedPositions] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredPositions, setFilteredPositions] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const {
//     totalFilteredProofPositionNumber,
//     setTotalFilteredProofPositionNumber,
//   } = useStoreTotalFilteredProofPosition();
//   const { setSelectedProofPosition } = useStoreSelectedProofPosition();

//   useEffect(() => {
//     setTotalFilteredProofPositionNumber(
//       selectedPositions?.length === positions?.length
//         ? selectedPositions?.length
//         : selectedPositions?.length
//     );
//   }, [selectedPositions]);

//   // Fetch position data on component mount
//   useEffect(() => {
//     axios

//       .then((response) => {
//         const fetchedPositions = response.data.map(
//           (pos) => `${pos.designationId} - ${pos.designationName}`
//         );
//         setPositions(fetchedPositions);
//         setFilteredPositions(fetchedPositions); // Initialize filtered list
//         setSelectedPositions(fetchedPositions); // Select all positions by default
//       })
//       .catch((error) => console.error("Failed to fetch positions:", error));
//   }, []);

//   // Handle changes in selection
//   const handleChange = (event) => {
//     const value = event.target.value;

//     if (value === "All") {
//       // Toggle selection of all positions
//       if (selectedPositions.length === positions.length) {
//         setSelectedPositions([]); // Deselect all positions if already all are selected
//       } else {
//         setSelectedPositions(positions); // Select all positions
//       }
//     } else {
//       const newSelection = selectedPositions.includes(value)
//         ? selectedPositions.filter((item) => item !== value)
//         : [...selectedPositions, value];

//       setSelectedPositions(newSelection);
//     }
//   };

//   useEffect(() => {
//     setSelectedProofPosition(selectedPositions);
//   }, [selectedPositions]);

//   // Handle search bar input
//   const handleSearch = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = positions.filter((position) =>
//       position.toLowerCase().includes(query)
//     );
//     setFilteredPositions(filtered);
//   };

//   // Check if "All" is selected
//   const isAllSelected = selectedPositions.length === positions.length;

//   // Format the selected positions list to show only names (without IDs)
//   const displayText = isAllSelected ? "All" : selectedPositions.join(", ");

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
//             {displayText || "Select Positions"}
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

//             {filteredPositions.map((position) => (
//               <div
//                 key={position}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   padding: "8px",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedPositions.includes(position)}
//                   onChange={() => handleChange({ target: { value: position } })}
//                 />
//                 <label style={{ marginLeft: "8px" }}>{position}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProofPosition;
