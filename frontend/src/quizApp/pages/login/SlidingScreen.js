// SlidingScreen.js

import React from "react";

// const SlidingScreen = ({ isOpen, onClose }) => {
//     return (
//       <div className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
//         <div className="flex justify-between items-center h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
//           <div className="ml-8 text-white">Footer</div>
//           <button className="mr-8 text-white" onClick={onClose}>Close</button>
//         </div>
//         {/* Content of your sliding screen goes here */}
//       </div>
//     );
//   };

const SlidingScreen = ({ isOpen, onClose, slideNo }) => {
    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 transform transition-transform duration-300 ${isOpen ? "-translate-x-60" : "-translate-x-full"}`}>
            <div className="flex ml-60 justify-between items-center h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                <h3 className="ml-8 text-white">
             
                    {slideNo === 1 && ("Concurrent Users")}
                    {slideNo === 2 && ("Admin Functionality")}
                    {slideNo === 3 && ("User Experience")}
                    {slideNo === 4 && ("Enhancements & Customization")}
                </h3>
                <button className="mr-8 text-white" onClick={onClose}>Close</button>
            </div>
            {/* Content of your sliding screen goes here */}
            <div className="ml-60 mt-12  text-gray-300" >

                {slideNo === 1 && (<ul>
                    <li className="mb-3">&#9758; Large number of Concurrent Users.</li>
                    <li className="mb-3">&#9758; Vertical & Horizontal scalable microservice architecture.</li>
                    <li className="mb-3">&#9758; App remains Responsive & available in peak usage times.</li>
                </ul>)}
                
                {slideNo === 2 && (<ul>
                    <li className="mb-3">&#9758; Question Bank based on category & topic</li>
                    <li className="mb-3">&#9758; Quiz - Create, Manage & Publish to public</li>
                    <li className="mb-3">&#9758; Quiz Results (Automatic)</li>
                </ul>)}

                {slideNo === 3 && (<ul>
                    <li className="mb-3">&#9758; Access Quizzes</li>
                    <li className="mb-3">&#9758; Play Quiz & Complete it</li>
                    <li className="mb-3">&#9758; Instant quiz Results</li>
                </ul>)}

                {slideNo === 4 && (<ul>
                    <li className="mb-3">&#9758; Future Enhancements & Customizations</li>
                    <li className="mb-3">&#9758; Eg. Elastic / Redis Cluster</li>
              
                </ul>)}

            </div>
        </div>
    );
};

export default SlidingScreen;
