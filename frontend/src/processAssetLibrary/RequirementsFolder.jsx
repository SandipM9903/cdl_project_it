import React, { useState } from 'react';
import { Folder } from 'lucide-react';

const requirementSubFolders = [
  { name: 'Checklist', itemCount: 3 },
  { name: 'Forms and Templates', itemCount: 10 },
  { name: 'Guidelines', itemCount: 3 },
  { name: 'Process', itemCount: 2 },
];

export default function RequirementsFolder() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📁 1.0 Requirements</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requirementSubFolders.map((folder, index) => (
          <div
            key={index}
            onClick={() => setSelected(folder.name)}
            className="cursor-pointer bg-gray-50 hover:bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                <Folder size={20} />
              </div>
              <div>
                <div className="font-semibold text-lg">{folder.name}</div>
                <div className="text-sm text-gray-500">{folder.itemCount} items</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-8 text-gray-600 italic text-sm">
          🔍 You selected: <span className="font-medium text-gray-800">{selected}</span>
        </div>
      )}
    </div>
  );
}
