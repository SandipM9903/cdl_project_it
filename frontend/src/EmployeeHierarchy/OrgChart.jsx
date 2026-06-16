// OrgChart.jsx
import React from 'react';

import './Org.css'; // Import the CSS for lines
import { organizationData } from './organizationData';
import OrgChartNode from './OrgChartNode';
// You will need to add this CSS to your global stylesheet (e.g., index.css or a dedicated CSS file)
/* .org-tree-root > li::before, 
.org-tree-children > li::before, 
.org-tree-children > li::after {
    content: '';
    position: absolute;
    background-color: #A0AEC0; // Tailwind gray-400
}

.org-tree-root > li::before {
    top: 0;
    left: 50%;
    width: 2px;
    height: 20px;
    transform: translateX(-50%);
}

.org-tree-children > li::before {
    top: -20px;
    left: 50%;
    width: 2px;
    height: 20px;
    transform: translateX(-50%);
}

.org-tree-children > li:not(:first-child)::after {
    top: -20px;
    left: 0;
    height: 2px;
    width: 50%;
}

.org-tree-children > li:not(:last-child)::after {
    top: -20px;
    right: 0;
    height: 2px;
    width: 50%;
    transform: translateX(50%);
}

.org-tree-children {
    position: relative;
    padding-top: 30px; // Spacing for the vertical line to connect
}

.org-tree-children::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 30px;
    background-color: #A0AEC0; // Tailwind gray-400
    transform: translateX(-50%);
}

.org-tree-children::after {
    content: '';
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #A0AEC0; // Tailwind gray-400
}
*/


const OrgChart = () => {
  // Extracting the root node and its direct children for the top-level rendering
  const rootNode = {
    name: "Company", 
    color: "bg-gray-800", 
    children: [
        {
            name: "Chief Executive Officer", 
            color: "bg-gray-700",
            children: organizationData.children
        }
    ]
  };

  return (
    <div className="p-8 bg-white overflow-x-auto min-h-screen">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
        {rootNode.name} Hierarchy
      </h1>

      {/* The main container for the chart */}
      <div className="flex justify-center">
        {/* The outermost list item for the entire tree */}
        <ul className="org-tree-root">
          <OrgChartNode node={rootNode.children[0]} />
        </ul>
      </div>
      
      {/* Optional: Add a note on customization */}
      <div className="mt-16 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
        <p className="font-semibold">Customization Note:</p>
        <p className="text-sm">
          To display the lines correctly, you must copy the **CSS block** from the comment in this file into your **global CSS file** (e.g., `index.css` or `App.css`). This uses standard CSS for complex line drawing.
        </p>
      </div>
    </div>
  );
};

export default OrgChart;