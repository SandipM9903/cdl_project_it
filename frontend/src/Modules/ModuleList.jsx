import React from "react";
import { FaCheck } from "react-icons/fa";

const ModuleList = ({ modules, currentModuleIndex, completedModules }) => {
  return (
    <div className="w-[300px] bg-red-600 text-white rounded-tr-[50px] rounded-br-[50px] z-10 relative">
      <div className="flex flex-col justify-center items-start px-6 py-8 space-y-6">
        {modules.map((mod, index) => {
          const isCompleted = completedModules.includes(index);
          const isActive = index === currentModuleIndex;
          return (
            <div
              key={mod.moduleNumber}
              className={`relative flex items-start space-x-4 opacity-${
                isCompleted || isActive ? "100" : "50"
              }`}
            >
              <div className="absolute -right-5 top-0 z-30">
                <div className="flex items-center justify-center w-10 h-10 rounded-full text-black bg-white text-lg font-semibold shadow">
                  {isCompleted ? (
                    <div className="bg-green-400 rounded-full w-10 h-10 flex items-center justify-center text-white">
                      <FaCheck />
                    </div>
                  ) : (
                    mod.moduleNumber
                  )}
                </div>
              </div>
              <div className="ml-8">
                <h3 className="font-semibold">{mod.title}</h3>
                <p className="text-sm">{mod.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleList;
