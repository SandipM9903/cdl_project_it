import React from "react";

const Tab = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-8 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 font-medium text-sm transition ${
            activeTab === tab
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-500 hover:text-red-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tab;