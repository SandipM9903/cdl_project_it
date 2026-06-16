import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { format, parseISO } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Header from "../components/Header"; // adjust path as needed

// Colors
const MOOD_COLORS = { Happy: "#10B981", Neutral: "#F59E0B", Sad: "#EF4444" };
const KPI_BG = "bg-white rounded-lg shadow p-4";

export default function ReportsDashboard() {
  // Data
  const [moods, setMoods] = useState([]);
  const [inductionStats, setInductionStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const moodsResp = await axios.get("https://mycdl.cms.co.in/api/moods");
      let inductionResp = { data: null };
      try {
        inductionResp = await axios.get("https://mycdl.cms.co.in/api/training/allRecords");
      } catch (e) {
        inductionResp.data = null;
      }

      setMoods(Array.isArray(moodsResp.data) ? moodsResp.data : []);
      setInductionStats(inductionResp.data ?? getMockInductionStats());
    } catch (err) {
      console.error(err);
      setError("Failed to load report data. Showing fallback data.");
      setMoods(getMockMoodEntries());
      setInductionStats(getMockInductionStats());
    } finally {
      setLoading(false);
    }
  }

  // Derived filtered data
  const filteredMoods = useMemo(() => {
    return moods.filter((m) => {
      if (selectedMood && m.mood !== selectedMood) return false;
      if (fromDate) {
        const d = new Date(m.timestamp);
        if (d < new Date(fromDate + "T00:00:00")) return false;
      }
      if (toDate) {
        const d = new Date(m.timestamp);
        if (d > new Date(toDate + "T23:59:59")) return false;
      }
      return true;
    });
  }, [moods, selectedMood, fromDate, toDate]);

  const moodTrendByDay = useMemo(() => {
    const map = {};
    filteredMoods.forEach((e) => {
      const day = format(new Date(e.timestamp), "yyyy-MM-dd");
      map[day] = map[day] || { date: day, Happy: 0, Neutral: 0, Sad: 0, total: 0 };
      map[day][e.mood] = (map[day][e.mood] || 0) + 1;
      map[day].total += 1;
    });
    return Object.values(map).sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [filteredMoods]);

  const moodDistribution = useMemo(() => {
    const counts = { Happy: 0, Neutral: 0, Sad: 0 };
    filteredMoods.forEach((m) => {
      counts[m.mood] = (counts[m.mood] || 0) + 1;
    });
    return Object.keys(counts).map((k) => ({ name: k, value: counts[k] }));
  }, [filteredMoods]);

  const totalMoodEntries = filteredMoods.length;
  const uniqueParticipants = useMemo(() => {
    return new Set(filteredMoods.map((m) => m.eCode || m.ecode || m.empCode)).size;
  }, [filteredMoods]);

  const completionRate = useMemo(() => {
    if (!inductionStats) return 0;
    const total = inductionStats.totalEmployees || 0;
    const completed = inductionStats.completedCount || 0;
    return total ? Math.round((completed / total) * 100) : 0;
  }, [inductionStats]);

  const modulesBar = useMemo(() => {
    if (!inductionStats?.modules) return [];
    return inductionStats.modules.map((m) => ({
      name: m.name,
      completed: m.completedCount,
      total: m.totalCount,
    }));
  }, [inductionStats]);

  function exportVisibleToExcel() {
    if (!filteredMoods.length) return;
    const worksheet = XLSX.utils.json_to_sheet(
      filteredMoods.map((r) => ({
        Name: r.name || r.fullName || "",
        EmployeeCode: r.eCode || r.ecode || r.empCode || "",
        Mood: r.mood,
        Timestamp: format(parseISO(r.timestamp), "yyyy-MM-dd HH:mm:ss"),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mood Report");
    const xbuf = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xbuf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `MoodReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fa] py-10 px-6 md:px-16 mt-14 font-content">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 mb-6 font-header">
            <a href="/Dashboard" className="text-black hover:underline">Home</a> /{" "}
            <span className="text-black font-semibold">Reports Dashboard</span>
          </div>

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800 font-header">Reports Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1 font-content">Induction & Mood Meter — dynamic, real-time view</p>
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setSelectedMood("");
                }}
                className="px-4 py-2 bg-white border rounded shadow hover:bg-gray-50 text-sm font-content"
              >
                Reset Filters
              </button>
              <button
                onClick={exportVisibleToExcel}
                className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 text-sm font-content"
              >
                Export Visible
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={KPI_BG}>
              <div className="text-sm text-gray-500 font-header">Total Mood Entries</div>
              <div className="text-2xl font-bold text-gray-800 font-content">{loading ? "..." : totalMoodEntries}</div>
              <div className="text-xs text-gray-400 mt-1 font-content">Filtered view</div>
            </div>

            <div className={KPI_BG}>
              <div className="text-sm text-gray-500 font-header">Unique Participants</div>
              <div className="text-2xl font-bold text-gray-800 font-content">{uniqueParticipants}</div>
              <div className="text-xs text-gray-400 mt-1 font-content">Different employee codes</div>
            </div>

            <div className={KPI_BG}>
              <div className="text-sm text-gray-500 font-header">Induction Completion</div>
              <div className="text-2xl font-bold text-gray-800 font-content">{completionRate}%</div>
              <div className="text-xs text-gray-400 mt-1 font-content">
                {inductionStats?.completedCount ?? 0}/{inductionStats?.totalEmployees ?? 0} completed
              </div>
            </div>

            <div className={KPI_BG}>
              <div className="text-sm text-gray-500 font-header">Latest Mood</div>
              <div className="text-2xl font-bold text-gray-800 font-content">
                {filteredMoods.length ? filteredMoods[filteredMoods.length - 1].mood : "—"}
              </div>
              <div className="text-xs text-gray-400 mt-1 font-content">
                {filteredMoods.length ? format(new Date(filteredMoods[filteredMoods.length - 1].timestamp), "dd MMM yyyy, HH:mm") : ""}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3 items-center">
            <label className="text-sm text-gray-600 font-header">From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border px-2 py-1 rounded font-content" />
            <label className="text-sm text-gray-600 font-header">To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border px-2 py-1 rounded font-content" />
            <label className="text-sm text-gray-600 font-header">Mood</label>
            <select className="border px-2 py-1 rounded font-content" value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)}>
              <option value="">All</option>
              <option value="Happy">Happy</option>
              <option value="Neutral">Neutral</option>
              <option value="Sad">Sad</option>
            </select>

            <div className="ml-auto text-sm text-gray-500 font-content">{error && <span className="text-red-600">{error}</span>}</div>
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend */}
            <div className="col-span-2 bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold font-header">Mood Trend</h3>
                <div className="text-sm text-gray-500 font-content">Daily aggregated counts</div>
              </div>

              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={moodTrendByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), "dd MMM")} />
                    <YAxis />
                    <Tooltip labelFormatter={(v) => format(new Date(v), "PPPP")} />
                    <Line type="monotone" dataKey="Happy" stroke={MOOD_COLORS.Happy} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Neutral" stroke={MOOD_COLORS.Neutral} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Sad" stroke={MOOD_COLORS.Sad} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribution */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 font-header">Mood Distribution</h3>
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={moodDistribution} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={80} label>
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name] || "#8884d8"} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Induction modules */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold font-header">Induction Modules — Completion</h3>
              <div className="text-sm text-gray-500 font-content">Per module completed vs total</div>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={modulesBar}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#3B82F6" />
                  <Bar dataKey="total" fill="#CBD5E1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent entries */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold font-header">Recent Mood Entries</h3>
              <div className="text-sm text-gray-500 font-content">{filteredMoods.length} entries</div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 font-content">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs text-gray-600 font-header">Timestamp</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-600 font-header">Employee</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-600 font-header">ECode</th>
                    <th className="px-4 py-2 text-left text-xs text-gray-600 font-header">Mood</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMoods
                    .slice()
                    .reverse()
                    .slice(0, 25)
                    .map((r) => (
                      <tr key={r.id ?? `${r.eCode}-${r.timestamp}`}>
                        <td className="px-4 py-2 text-sm font-content">{format(new Date(r.timestamp), "dd MMM yyyy, HH:mm")}</td>
                        <td className="px-4 py-2 text-sm font-content">{r.name}</td>
                        <td className="px-4 py-2 text-sm font-content">{r.eCode ?? r.ecode ?? ""}</td>
                        <td className="px-4 py-2 text-sm font-content font-medium" style={{ color: MOOD_COLORS[r.mood] }}>
                          {r.mood}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* Mock helpers */
function getMockMoodEntries() {
  const moods = ["Happy", "Neutral", "Sad"];
  const now = new Date();
  const arr = [];
  for (let i = 0; i < 120; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - Math.floor(i / 3));
    const mood = moods[i % 3];
    arr.push({
      id: i + 1,
      name: `Employee ${1000 + (i % 25)}`,
      eCode: `${9085000 + (i % 200)}`,
      mood,
      timestamp: d.toISOString(),
    });
  }
  return arr;
}

function getMockInductionStats() {
  return {
    totalEmployees: 500,
    completedCount: 382,
    modules: [
      { name: "Module 1 - Intro", completedCount: 480, totalCount: 500 },
      { name: "Module 2 - Safety", completedCount: 420, totalCount: 500 },
      { name: "Module 3 - Compliance", completedCount: 390, totalCount: 500 },
      { name: "Module 4 - Systems", completedCount: 382, totalCount: 500 },
    ],
  };
}
