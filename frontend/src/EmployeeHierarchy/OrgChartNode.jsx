// OrgChartNode.jsx
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'; // Requires @heroicons/react

// Helper to get badge styles
const getBadgeStyles = (type) => {
  switch (type) {
    case 'top': return 'bg-yellow-500 text-white';
    case 'executive': return 'bg-red-600 text-white';
    case 'heading': return 'bg-blue-600 text-white';
    case 'division': return 'bg-purple-600 text-white';
    case 'department': return 'bg-green-600 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

const OrgChartNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(node.expanded !== undefined ? node.expanded : true); // Default to expanded if not specified
  const { name, personName, children, type, color } = node;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const nodeBgColor = color || (type === 'executive' ? 'bg-red-600' : 'bg-gray-700');
  const badgeClasses = `absolute top-0 right-0 -mt-2 -mr-2 px-2 py-0.5 text-[0.6rem] font-semibold rounded-full ${getBadgeStyles(type)}`;

  // Conditional styling for specific nodes from Image 2
  const customNodeClasses = (nodeType) => {
    if (nodeType === 'executive') return 'border-2 border-red-500 shadow-xl';
    if (nodeType === 'top') return 'border-2 border-yellow-500 shadow-xl';
    return '';
  };

  return (
    <li className="relative flex flex-col items-center">
      <div 
        className={`
          ${nodeBgColor} 
          ${customNodeClasses(type)}
          text-white 
          font-medium 
          p-2 
          rounded-md 
          shadow-lg 
          w-52 md:w-60 
          h-auto 
          flex flex-col items-center justify-center 
          text-center 
          text-sm 
          transform 
          hover:scale-[1.03] 
          transition-transform 
          duration-200 
          cursor-pointer 
          relative
        `}
        onClick={children && children.length > 0 ? toggleExpand : undefined} // Only toggle if children exist
      >
        {type && type !== 'top' && ( // Don't show badge for the very top "Chairman" node if desired
          <span className={badgeClasses}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        )}
        <h3 className="font-semibold text-base">{name}</h3>
        {personName && <p className="text-xs text-gray-200">{personName}</p>}
        
        {children && children.length > 0 && (
          <button 
            onClick={(e) => { e.stopPropagation(); toggleExpand(); }} 
            className="absolute bottom-1 right-1 p-1 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all text-white text-xs"
          >
            {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        )}
        <button className="absolute bottom-1 left-1 p-1 px-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-all text-white text-xs">
          View
        </button>
      </div>

      {isExpanded && children && children.length > 0 && (
        <ul className="flex justify-center pt-8 space-x-8 org-tree-children">
          {children.map((child) => (
            <OrgChartNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default OrgChartNode;