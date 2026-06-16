import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function InductionReport() {
  const [inductionEntries, setInductionEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState("");
  const [minScore, setMinScore] = useState("");
  const [minModules, setMinModules] = useState("");
  const [eCodeSearch, setECodeSearch] = useState("");

  const statuses = ["Pending", "Completed"];

  // Fetch data once (no backend filters)
  const fetchInductionEntries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:9038/api/training/allRecords"
      );
      setInductionEntries(response.data);
    } catch (err) {
      console.error("Error fetching induction data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInductionEntries();
  }, []);

  // Apply frontend filters
  const filteredEntries = inductionEntries.filter((entry) => {
    return (
      (selectedStatus ? entry.status === selectedStatus : true) &&
      (minScore ? entry.scored >= Number(minScore) : true) &&
      (minModules ? entry.lastWatchedModuleIndex >= Number(minModules) : true) &&
      (eCodeSearch
        ? entry.empCode.toLowerCase().includes(eCodeSearch.toLowerCase())
        : true)
    );
  });

  // Excel Export (filtered data only)
  const handleExport = () => {
    const dataToExport = filteredEntries.map(
      ({ empCode, name, lastWatchedModuleIndex, scored, status }) => ({
        empCode,
        name,
        "No. of Modules Watched": lastWatchedModuleIndex,
        Score: scored,
        Status: status,
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(dataBlob, `InductionReport_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center font-header">
            Induction Report
          </h1>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-wrap gap-4 justify-center items-center font-content">
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Min. Score"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
            />
            <input
              type="number"
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Min. Modules"
              value={minModules}
              onChange={(e) => setMinModules(e.target.value)}
            />
            <input
              type="text"
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Search eCode"
              value={eCodeSearch}
              onChange={(e) => setECodeSearch(e.target.value)}
            />
          </div>

          {/* Export Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleExport}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:bg-blue-600 font-content"
            >
              Export to Excel
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading && (
              <p className="text-center text-gray-500 font-content">
                Loading induction data...
              </p>
            )}
            {error && (
              <p className="text-center text-red-500 font-content">{error}</p>
            )}
            {!isLoading && !error && filteredEntries.length === 0 && (
              <p className="text-center text-gray-500 font-content">
                No data found for the selected filters.
              </p>
            )}

            {!isLoading && !error && filteredEntries.length > 0 && (
              <div className="overflow-x-auto font-content">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 font-header">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        eCode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No. of Modules Watched
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 font-content">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.empCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.lastWatchedModuleIndex}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.scored}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
