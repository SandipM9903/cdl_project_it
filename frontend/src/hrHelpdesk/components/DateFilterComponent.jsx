import { BASE_URL } from '../../config/Config';
import { useDateFilter } from '../context/DateFilterContext';
import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('hide-calendar-icon-style')) {
    const style = document.createElement('style');
    style.id = 'hide-calendar-icon-style';
    style.innerHTML = `
    .hide-calendar-icon::-webkit-calendar-picker-indicator {
      opacity: 0;
      display: none;
    }
    .hide-calendar-icon::-ms-input-placeholder { color: #9ca3af; font-style: italic; }
    .hide-calendar-icon::placeholder { color: #9ca3af; font-style: italic; }
  `;
    document.head.appendChild(style);
}

const DateFilterComponent = () => {
    const { fromDate, toDate, setFromDate, setToDate } = useDateFilter();
    const [searchResult, setSearchResult] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const API_URL = `${BASE_URL}:9035/tickets/search`;

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (fromDate) params.append("fromDate", fromDate);
            if (toDate) params.append("toDate", toDate);
            const response = await fetch(`${API_URL}?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            setSearchResult(data);
        } catch (err) {
            setError(err.message);
            setSearchResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-3 items-center p-0 justify-end mr-4">
                {/* From Date */}
                <label className="text-xs font-semibold text-gray-700 mr-2 self-center">From</label>
                <div className="relative flex items-center">
                    <input
                        id="fromDateInput"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="hide-calendar-icon border border-blue-300 rounded-md px-2 py-1 w-[122px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-200 placeholder:italic placeholder:text-gray-400 pr-7"
                    />
                    <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-blue-400"
                        onClick={() => document.getElementById('fromDateInput').showPicker && document.getElementById('fromDateInput').showPicker()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </span>
                </div>
                {/* To Date */}
                <label className="text-xs font-semibold text-gray-700 mr-2 self-center">To</label>
                <div className="relative flex items-center">
                    <input
                        id="toDateInput"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="hide-calendar-icon border border-blue-300 rounded-md px-2 py-1 w-[122px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-200 placeholder:italic placeholder:text-gray-400 pr-7"
                    />
                    <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-blue-400"
                        onClick={() => document.getElementById('toDateInput').showPicker && document.getElementById('toDateInput').showPicker()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </span>
                </div>
                {/* Reset Button */}
                <button
                    type="button"
                    className="ml-3 flex font-content items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    title="Reset Dates"
                    onClick={() => { setFromDate(""); setToDate(""); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-xs font-semibold">Reset</span>
                </button>
            </div>
            {/* Error Display */}
            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
        </div>
    );
};

export default DateFilterComponent;