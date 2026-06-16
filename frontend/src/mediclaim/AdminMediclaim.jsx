import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { BASE_URL } from "../config/Config";

const AdminMediclaim = () => {
  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [windowData, setWindowData] = useState({
    startDate: "",
    endDate: "",
    active: false,
    extendable: false,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}:9051/api/admin/mediclaim/employees`
      );
      setEmployees(res.data);
    } catch (err) {
      alert("Failed to fetch employees");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadExcel = async () => {
    if (!file) {
      alert("Please select Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}:9051/api/admin/mediclaim/upload-employees`,
        formData
      );
      setUploadResult(res.data);
      fetchEmployees();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const sendMail = async () => {
    if (!window.confirm("Send enrollment email to all employees?")) return;

    try {
      await axios.post(
        `${BASE_URL}:9051/api/admin/mediclaim/send-mail`
      );
      alert("Emails sent successfully");
    } catch (err) {
      alert("Mail sending failed");
    }
  };

  const saveWindow = async () => {
    try {
      await axios.post(
        `${BASE_URL}:9051/api/admin/mediclaim/enrollment-window`,
        windowData
      );
      alert("Enrollment window saved");
    } catch (err) {
      alert("Failed to save window");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 px-6 max-w-7xl mx-auto space-y-10">

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Upload Employee Excel
          </h2>

          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={uploadExcel}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Upload
            </button>
          </div>

          {uploadResult && (
            <div className="mt-4 text-sm">
              <p>Total Rows: {uploadResult.totalRows}</p>
              <p className="text-green-600">
                Success: {uploadResult.successCount}
              </p>
              <p className="text-red-600">
                Failed: {uploadResult.failureCount}
              </p>
            </div>
          )}
        </div>

        {/* Enrollment Window */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Enrollment Window
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              className="border p-2 rounded"
              value={windowData.startDate}
              onChange={(e) =>
                setWindowData({ ...windowData, startDate: e.target.value })
              }
            />

            <input
              type="date"
              className="border p-2 rounded"
              value={windowData.endDate}
              onChange={(e) =>
                setWindowData({ ...windowData, endDate: e.target.value })
              }
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={windowData.active}
                onChange={(e) =>
                  setWindowData({ ...windowData, active: e.target.checked })
                }
              />
              Active
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={windowData.extendable}
                onChange={(e) =>
                  setWindowData({
                    ...windowData,
                    extendable: e.target.checked,
                  })
                }
              />
              Extendable
            </label>
          </div>

          <button
            onClick={saveWindow}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Window
          </button>
        </div>

        {/* Employee Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Employee List
            </h2>

            <button
              onClick={sendMail}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            >
              Send Enrollment Mail
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Emp Code</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Department</th>
                  <th className="border px-3 py-2">Designation</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.empCode} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{e.empCode}</td>
                    <td className="border px-3 py-2">{e.fullName}</td>
                    <td className="border px-3 py-2">{e.email}</td>
                    <td className="border px-3 py-2">{e.department}</td>
                    <td className="border px-3 py-2">{e.designation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminMediclaim;
