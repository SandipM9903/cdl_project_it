// OrgChartContainer.jsx
import React, { useState } from 'react';
import './Org.css'; // Import the CSS for lines
import { organizationData } from './organizationData';
import OrgChartNode from './OrgChartNode';
// You will still need the global CSS from the previous example,
// potentially with minor adjustments for new spacing/styles.
// I will provide an updated CSS block below.

const OrgChartContainer = () => {
  // We can manage a global state if needed, e.g., to expand/collapse all
  const [chartData, setChartData] = useState(organizationData);

  // Function to toggle all nodes (requires traversing the data structure)
  const toggleAll = (expand) => {
    const updateNodes = (nodes) => {
      return nodes.map(node => ({
        ...node,
        expanded: expand,
        children: node.children ? updateNodes(node.children) : undefined
      }));
    };
    setChartData(prevData => ({
      ...prevData,
      expanded: expand,
      children: prevData.children ? updateNodes(prevData.children) : undefined
    }));
  };

  // Function to handle "Export Chart" (placeholder)
  const handleExportChart = () => {
    alert("Export chart functionality would go here!");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Organizational Structure</h1>
        <p className="text-gray-600 mt-2">Dynamic organizational hierarchy showing reporting structure and departmental relationships</p>
      </div>

      {/* Chart Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-gray-700">
          <p className="font-semibold">Chart Controls</p>
          <p className="text-sm">Click on nodes to expand/collapse sections</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => toggleAll(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Expand All
          </button>
          <button 
            onClick={handleExportChart}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Export Chart
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex justify-center overflow-x-auto">
        <ul className="org-tree-root">
          <OrgChartNode node={chartData} />
        </ul>
      </div>

      {/* Info Section (bottom part of Image 1) */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">How To Use This Organizational Chart</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Click on any node to expand or collapse its children</li>
          <li>Hover over nodes to see enhanced visual effects</li>
          <li>Color coding indicates different organizational levels</li>
          <li>Badges show the type of each organizational unit</li>
          <li>Use controls to expand/collapse all sections or export the chart</li>
        </ul>
      </div>

      {/* Footer (from your image) */}
      <div className="text-center mt-12 text-gray-500 text-sm">
        Powered By <span className="font-semibold text-gray-700">CMS Computers India Pvt. Ltd.</span> Copyright 2023. All Rights Reserved.
      </div>
    </div>
  );
};

export default OrgChartContainer;