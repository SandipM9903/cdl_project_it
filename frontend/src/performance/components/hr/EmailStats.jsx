import React, { useState, useEffect } from 'react';
import { FiMail, FiUsers, FiUser, FiBarChart2 } from 'react-icons/fi';
import { emailService } from '../../services/emailService';

const EmailStats = ({ cycleType, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, [cycleType]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await emailService.getEmailStats(cycleType);
      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching email stats:', err);
      setError('Failed to load email statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FiBarChart2 className="h-5 w-5 text-red-500" />
          Email Distribution Statistics
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>

      {stats ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Employees</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.totalEmployees || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiUsers className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Managers</p>
                  <p className="text-2xl font-bold text-purple-700">{stats.totalManagers || 0}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FiUser className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Both Roles</p>
                  <p className="text-2xl font-bold text-green-700">{stats.employeesWithBothRoles || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FiMail className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Email Sent Statistics */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Emails Sent</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Employee Emails:</span>
                <span className="font-semibold text-gray-800">{stats.employeeEmailsSent || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Manager Emails:</span>
                <span className="font-semibold text-gray-800">{stats.managerEmailsSent || 0}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Emails Sent:</span>
                <span className="font-semibold text-lg text-green-600">{stats.totalEmailsSent || 0}</span>
              </div>
            </div>
          </div>

          {/* Failed Emails */}
          {stats.failedEmails > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-700">Failed Emails: {stats.failedEmails}</p>
                  <p className="text-xs text-red-600">Some emails could not be delivered. Please check the logs.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No statistics available</p>
      )}
    </div>
  );
};

export default EmailStats;