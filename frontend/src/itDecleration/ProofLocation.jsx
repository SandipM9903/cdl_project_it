// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   useStoreSelectedProofLocation,
//   useStoreTotalFilteredProofLocation,
// } from "./useFileStore";

// function ProofLocation() {
//   const [locations, setLocations] = useState([]);
//   const [selectedLocations, setSelectedLocations] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredLocations, setFilteredLocations] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const {
//     totalFilteredProofLocationNumber,
//     setTotalFilteredProofLocationNumber,
//   } = useStoreTotalFilteredProofLocation();
//   const { setSelectedProofLocation } = useStoreSelectedProofLocation();

//   useEffect(() => {
//     setTotalFilteredProofLocationNumber(
//       selectedLocations?.length === locations?.length
//         ? selectedLocations?.length
//         : selectedLocations?.length
//     );
//   }, [selectedLocations]);

//   // Fetch location data on component mount
//   useEffect(() => {
//     axios

//       .then((response) => {
//         const fetchedLocations = response.data.map(
//           (loc) => `${loc.locationId} - ${loc.locationName}` // Rename posId to locationId
//         );
//         setLocations(fetchedLocations);
//         setFilteredLocations(fetchedLocations); // Initialize filtered list
//         setSelectedLocations(fetchedLocations); // Select all locations by default
//       })
//       .catch((error) => console.error("Failed to fetch locations:", error));
//   }, []);

//   // Handle changes in selection
//   const handleChange = (event) => {
//     const value = event.target.value;

//     if (value === "All") {
//       // Toggle selection of all locations
//       if (selectedLocations.length === locations.length) {
//         setSelectedLocations([]); // Deselect all locations if already all are selected
//       } else {
//         setSelectedLocations(locations); // Select all locations
//       }
//     } else {
//       const newSelection = selectedLocations.includes(value)
//         ? selectedLocations.filter((item) => item !== value)
//         : [...selectedLocations, value];

//       setSelectedLocations(newSelection);
//     }
//   };

//   useEffect(() => {
//     setSelectedProofLocation(selectedLocations);
//   }, [selectedLocations]);

//   // Handle search bar input
//   const handleSearch = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = locations.filter((location) =>
//       location.toLowerCase().includes(query)
//     );
//     setFilteredLocations(filtered);
//   };

//   // Check if "All" is selected
//   const isAllSelected = selectedLocations.length === locations.length;

//   // Format the selected locations list to show only names (without IDs)
//   const displayText = isAllSelected ? "All" : selectedLocations.join(", ");

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
//             {displayText || "Select Locations"}
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

//             {filteredLocations.map((location) => (
//               <div
//                 key={location}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   padding: "8px",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedLocations.includes(location)}
//                   onChange={() => handleChange({ target: { value: location } })}
//                 />
//                 <label style={{ marginLeft: "8px" }}>{location}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProofLocation;
