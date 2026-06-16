import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/Config";
import Header from "../components/Header";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function MoodReport() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // Filters
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const moods = ["Happy", "Neutral", "Sad"];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Fetch from backend
  const fetchMoodEntries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        mood: selectedMood || undefined,
        date: selectedDate || undefined,
        month: selectedMonth || undefined,
        year: selectedYear || undefined,
      };

      const response = await axios.get(`https://mycdl.cms.co.in/api/moods`, { params });
      setMoodEntries(response.data);
      setCurrentPage(1); // reset to page 1 after filters change
    } catch (err) {
      console.error("Error fetching mood data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodEntries();
  }, [selectedMood, selectedDate, selectedMonth, selectedYear]);

  // Excel Export
  const handleExport = () => {
    if (!moodEntries.length) return;

    const dataToExport = moodEntries.map(({ name, eCode, mood, timestamp }) => ({
      Name: name,
      "Employee Code": eCode,
      Mood: mood,
      Timestamp: new Date(timestamp).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mood Report");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(dataBlob, `MoodReport_${new Date().toLocaleDateString()}.xlsx`);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = moodEntries.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(moodEntries.length / recordsPerPage);

  return (
    <>
      <Header />
      <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Mood Report</h1>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-wrap gap-4 justify-center items-center">
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
            >
              <option value="">All Moods</option>
              {moods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="p-2 border border-gray-300 rounded-md"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <select
              className="p-2 border border-gray-300 rounded-md"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              className="p-2 border border-gray-300 rounded-md"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Export */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleExport}
              className="bg-green-500 font-content text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:bg-green-600"
            >
              Export to Excel
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading && <p className="text-center text-gray-500">Loading mood data...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!isLoading && !error && moodEntries.length === 0 && (
              <p className="text-center text-gray-500">No data found for the selected filters.</p>
            )}

            {!isLoading && !error && currentRecords.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-header">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-header">
                          Employee Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-header">
                          Mood
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-header">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 font-content">
                      {currentRecords.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{entry.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{entry.eCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{entry.mood}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(entry.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
