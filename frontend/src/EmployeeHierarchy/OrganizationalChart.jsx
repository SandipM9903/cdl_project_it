import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Your organization data
const orgData = {
  name: "Chairperson",
  person: "Aarti Grover",
  type: "top",
  children: [
    {
      name: "Chief Executive Officer",
      person: "Anil Menon",
      type: "level1",
      children: [
        {
          name: "BUSINESS",
          person: null,
          type: "heading",
          children: [
            {
              name: "1 GSD - Govt. Solution Division",
              person: "Satihs Jorapur",
              type: "division",
              children: [
                { name: "Sales", person: "Dhanya", type: "department" },
                { name: "Pre Sales", person: "Ravi Sinha", type: "department" },
                { name: "Solutions", person: "Pranesh Deshpande", type: "department" },
                { name: "Strategic Initiatives", person: null, type: "department" },
                { name: "Delivery & Support", person: null, type: "department" },
                { name: "Strategic Support", person: null, type: "department" },
                { name: "Operations", person: null, type: "department" },
              ],
            },
            {
              name: "2 BSD - Business Solution Division",
              person: "Amarnath Chattopadhyay",
              type: "division",
              children: [
                { name: "Sales", person: "Satish Shetty", type: "department" },
                { name: "Delivery & Support", person: "Mahesh Nair", type: "department" },
                { name: "Product & Development", person: null, type: "department" },
                { name: "Smart Cities & Ports", person: "Vaibhav Chauhan", type: "department" },
                { name: "Industry Solutions", person: "Anup Desai", type: "department" },
                { name: "Operations", person: null, type: "department" },
              ],
            },
            {
              name: "3 ESD - Enterprise Sales Division",
              person: "Sudhir Shetty",
              type: "division",
              children: [
                { name: "Sales", person: null, type: "department" },
              ],
            },
          ],
        },
        {
          name: "D - CMS TRAFFIC LTD.",
          person: "Vaibhav Chauhan",
          type: "heading",
          children: [],
        },
        {
          name: "C - BUSINESS FUNCTIONS",
          person: null,
          type: "heading",
          children: [
            { name: "Finance & Accounts", person: "Ganesh Pillutla", type: "department" },
            { name: "Human Resource & Administration", person: "Manisha Patil", type: "department" },
            { name: "Commercial", person: "Ravindrakumar Jha", type: "department" },
            { name: "Marketing & Communication", person: "Damini Singh", type: "department" },
            { name: "Alliance & Eco System", person: "Sudhir Shetty", type: "department" },
            { name: "PMO", person: "Jayanta Chakraborty", type: "department" },
            { name: "Purchase", person: "Santosh Dhende", type: "department" },
            { name: "OEG & Stores", person: "Nitesh Rane", type: "department" },
            { name: "CS & Legal", person: "Somnath Shah", type: "department" },
            { name: "Quality", person: "Rajashree Mohite", type: "department" },
            { name: "Internal IT", person: "Rahul Lad", type: "department" },
            { name: "Internal Audit", person: null, type: "department" },
          ],
        },
        {
          name: "B - PRACTICES",
          person: null,
          type: "heading",
          children: [
            { name: "Digital", person: "Balwinder Singh Cheema", type: "department" },
            { name: "SSD - Software Solution Division", person: "Mathimaran P", type: "department" },
            { name: "IT Infra Services", person: "Rajendra Nikumbh", type: "department" },
          ],
        },
      ],
    },
  ],
};

// Type-based styling configuration
const nodeStyles = {
  top: {
    container: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl border-0",
    name: "text-xl font-bold",
    person: "text-purple-100 text-lg"
  },
  level1: {
    container: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg border-0",
    name: "text-lg font-semibold",
    person: "text-blue-100"
  },
  heading: {
    container: "bg-gray-100 border-2 border-dashed border-gray-300 text-gray-700",
    name: "text-md font-bold uppercase tracking-wide",
    person: "text-gray-500 text-sm"
  },
  division: {
    container: "bg-green-50 border-2 border-green-300 text-green-800 shadow-sm",
    name: "text-md font-semibold",
    person: "text-green-600"
  },
  department: {
    container: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    name: "text-sm font-medium",
    person: "text-gray-500 text-xs"
  }
};

// Organizational Chart Node Component
const OrgNode = ({ node, level = 0, isLast = false, onNodeClick }) => {
  const [isExpanded, setIsExpanded] = useState(level < 3);
  const hasChildren = node.children && node.children.length > 0;
  const styles = nodeStyles[node.type] || nodeStyles.department;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Node Content */}
      <div 
        className={`
          relative group cursor-pointer transition-all duration-200
          ${styles.container}
          rounded-lg px-4 py-3 min-w-[200px] max-w-[280px] text-center
          transform hover:scale-105 hover:shadow-md
          ${hasChildren ? 'mb-4' : 'mb-2'}
        `}
        onClick={handleClick}
      >
        {/* Node Name */}
        <div 
          className={styles.name}
          style={{ 
            fontFamily: ['top', 'level1', 'heading'].includes(node.type) 
              ? "'Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'" 
              : "'Inter', 'Roboto', 'system-ui', 'sans-serif'" 
          }}
        >
          {node.name}
        </div>
        
        {/* Person Name */}
        {node.person && (
          <div 
            className={`mt-1 ${styles.person}`}
            style={{ fontFamily: "'Inter', 'Roboto', 'system-ui', 'sans-serif'" }}
          >
            {node.person}
          </div>
        )}
        
        {/* Type Badge */}
        <div 
          className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-full opacity-75"
          style={{ fontFamily: "'Inter', 'Roboto', 'system-ui', 'sans-serif'" }}
        >
          {node.type}
        </div>
        
        {/* Expand/Collapse Indicator */}
        {hasChildren && (
          <div className={`
            absolute -bottom-2 left-1/2 transform -translate-x-1/2
            bg-white border-2 border-gray-300 rounded-full w-6 h-6 
            flex items-center justify-center text-xs font-bold
            transition-colors duration-200
            ${isExpanded ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600'}
          `}>
            {isExpanded ? '−' : '+'}
          </div>
        )}
        
        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-lg bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
      </div>

      {/* Children Container */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 -translate-y-4"></div>
          
          {/* Children horizontal alignment */}
          <div className="flex relative pt-4">
            {/* Horizontal connector line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300"></div>
            
            {/* Children nodes */}
            <div className="flex flex-wrap justify-center gap-4">
              {node.children.map((child, index) => (
                <div key={child.name} className="flex flex-col items-center relative">
                  {/* Child vertical connector */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 -translate-y-4"></div>
                  <OrgNode 
                    node={child} 
                    level={level + 1}
                    isLast={index === node.children.length - 1}
                    onNodeClick={onNodeClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Organizational Chart Component
const OrganizationalChart = ({ 
  data = orgData, 
  className = "",
  onNodeClick = null,
  showControls = true 
}) => {
  const [expandedAll, setExpandedAll] = useState(true);
  const [exportFormat, setExportFormat] = useState('png');
  const chartRef = useRef(null);

  const handleNodeClick = (node) => {
    console.log('Node clicked:', node);
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  // Export functionality
  const exportChart = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      if (exportFormat === 'png') {
        // Export as PNG
        const link = document.createElement('a');
        link.download = 'organizational-chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (exportFormat === 'pdf') {
        // Export as PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('organizational-chart.pdf');
      }
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Error exporting chart. Please try again.');
    }
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 overflow-x-hidden ${className}`}
      style={{ fontFamily: "'Inter', 'Roboto', 'system-ui', 'sans-serif'" }}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'" }}
          >
            Organizational Structure
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Dynamic organizational hierarchy showing reporting structure and departmental relationships
          </p>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 
                  className="text-lg font-semibold text-gray-800 mb-2"
                  style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'" }}
                >
                  Chart Controls
                </h2>
                <p className="text-gray-600 text-sm">
                  Click on nodes to expand/collapse sections
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={() => setExpandedAll(!expandedAll)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium w-full sm:w-auto"
                >
                  {expandedAll ? 'Collapse All' : 'Expand All'}
                </button>
                
                {/* Export Format Radio Buttons */}
                <div className="flex items-center space-x-4 bg-gray-50 rounded-lg px-4 py-2 w-full sm:w-auto justify-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="png"
                      checked={exportFormat === 'png'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">PNG</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="pdf"
                      checked={exportFormat === 'pdf'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">PDF</span>
                  </label>
                </div>
                
                <button
                  onClick={exportChart}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium w-full sm:w-auto"
                >
                  Export Chart
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              {Object.entries(nodeStyles).map(([type, style]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${style.container.split(' ')[0]} border`}></div>
                  <span className="text-sm text-gray-600 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart Container with ref for export */}
        <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full overflow-x-auto">
          <div className="flex justify-center min-w-max mx-auto">
            <OrgNode 
              node={data} 
              onNodeClick={handleNodeClick}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
            <div 
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'" }}
            >
              1
            </div>
            <div className="text-gray-600 text-sm">Top Level</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
            <div 
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'" }}
            >
              3
            </div>
            <div className="text-gray-600 text-sm">Divisions</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
            <div 
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'" }}
            >
              4
            </div>
            <div className="text-gray-600 text-sm">Headings</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
            <div 
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'" }}
            >
              25+
            </div>
            <div className="text-gray-600 text-sm">Departments</div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 w-full">
          <h3 
            className="text-lg font-semibold text-blue-900 mb-3"
            style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'" }}
          >
            How to Use This Organizational Chart
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>Click on any node</strong> to expand or collapse its children</li>
            <li>• <strong>Hover over nodes</strong> to see enhanced visual effects</li>
            <li>• <strong>Color coding</strong> indicates different organizational levels</li>
            <li>• <strong>Badges</strong> show the type of each organizational unit</li>
            <li>• <strong>Select export format</strong> using radio buttons and click Export Chart</li>
            <li>• Use controls to expand/collapse all sections</li>
          </ul>
        </div>

  
      </div>
    </div>
  );
};

// Export both components for flexibility
export default OrganizationalChart;
export { OrgNode, orgData };