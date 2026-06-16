import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";

const SelfReviewPreview = () => {
  const navigate = useNavigate();
  const { empId } = useParams(); // Get empId from URL path
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const quarter = searchParams.get('quarter'); // Get quarter from query param
  const year = searchParams.get('year'); // Get year from query param
  const employeeId = empId || localStorage.getItem('empId');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [previewData, setPreviewData] = useState({
    overallSelfAssessmentRating: 0,
    overallSelfReviewComments: "",
    submittedDate: null
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debug logging - check what parameters we're getting
  useEffect(() => {
    console.log("=== SELF REVIEW PREVIEW DEBUG ===");
    console.log("URL Params - empId:", empId);
    console.log("Query Params - quarter:", quarter);
    console.log("Query Params - year:", year);
    console.log("LocalStorage - empId:", localStorage.getItem('empId'));
    console.log("Final employeeId being used:", employeeId);
    console.log("View Mode:", empId ? "Manager viewing employee's preview" : "Employee viewing own preview");
    console.log("Full URL:", window.location.href);
    console.log("Pathname:", window.location.pathname);
    console.log("Search params string:", window.location.search);
    
    setDebugInfo({
      empIdFromUrl: empId,
      quarterFromQuery: quarter,
      yearFromQuery: year,
      empIdFromStorage: localStorage.getItem('empId'),
      finalEmployeeId: employeeId,
      viewMode: empId ? "Manager View" : "Self View",
      fullUrl: window.location.href,
      pathname: window.location.pathname,
      searchParams: window.location.search
    });
  }, [empId, quarter, year, employeeId]);

  useEffect(() => {
    const fetchGoals = async () => {
      // Check if we have all required parameters
      if (!employeeId) {
        setError("Employee ID not found. Please log in again or check the URL.");
        setLoading(false);
        return;
      }

      if (!quarter) {
        setError("Quarter parameter is missing from URL. Please add ?quarter=Q1 to the URL");
        setLoading(false);
        return;
      }

      if (!year) {
        setError("Year parameter is missing from URL. Please add &year=2025 to the URL");
        setLoading(false);
        return;
      }

      // Validate quarter format
      const validQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      if (!validQuarters.includes(quarter)) {
        setError(`Invalid quarter format: ${quarter}. Quarter must be Q1, Q2, Q3, or Q4`);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Use the determined employeeId (either from URL or localStorage)
        const url = `${BASE_URL_EPMS}/api/goals/predefined/employee/${employeeId}/${quarter}?year=${year}`;
        console.log("========================================");
        console.log("FETCHING GOALS FROM:", url);
        console.log("Using employee ID:", employeeId);
        console.log("Quarter:", quarter);
        console.log("Year:", year);
        console.log("View mode:", empId ? "Manager viewing employee's preview" : "Employee viewing own preview");
        console.log("========================================");
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch goals: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("API Response:", result);
        
        if (result.success && Array.isArray(result.data)) {
          setGoals(result.data);
          console.log("Goals fetched successfully. Count:", result.data.length);
          
          // Get overall assessment data from the first goal (all goals have same overall data)
          const firstGoal = result.data[0];
          
          // Get the most recent submission date
          const submissionDates = result.data
            .map(goal => goal.selfReviewSubmittedDate)
            .filter(date => date != null)
            .sort()
            .reverse();
          
          setPreviewData({
            overallSelfAssessmentRating: firstGoal?.overallSelfAssessmentRating || 0,
            overallSelfReviewComments: firstGoal?.overallSelfReviewComments || "",
            submittedDate: submissionDates.length > 0 ? submissionDates[0] : null
          });
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [employeeId, quarter, year, empId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('-');
  };

  const getQuarterDates = (quarter) => {
    const quarterDates = {
      'Q1': '01-Apr to 30-Jun',
      'Q2': '01-Jul to 30-Sep',
      'Q3': '01-Oct to 31-Dec',
      'Q4': '01-Jan to 31-Mar'
    };
    return quarterDates[quarter] || '';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'SELF_REVIEWED': { text: 'Self Review Completed', color: 'bg-green-100 text-green-800' },
      'SUBMITTED_TO_MANAGER': { text: 'Pending Manager Review', color: 'bg-yellow-100 text-yellow-800' },
      'MANAGER_REVIEWED': { text: 'Manager Reviewed', color: 'bg-blue-100 text-blue-800' },
      'SENT_TO_EMPLOYEE': { text: 'Sent to Employee', color: 'bg-purple-100 text-purple-800' },
      'ACCEPTED_BY_EMPLOYEE': { text: 'Accepted', color: 'bg-teal-100 text-teal-800' },
      'FINAL_SUBMITTED_TO_HR': { text: 'Final Submitted', color: 'bg-indigo-100 text-indigo-800' }
    };
    
    const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getRatingStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        <span className="text-lg font-semibold text-gray-900 mr-2">{rating}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    );
  };

  const handleGoBack = () => {
    // Determine where to go back based on view mode
    if (empId && quarter && year) {
      // Manager is viewing employee's preview - go back to appraisal list
      navigate('/AppraisalList');
    } else if (quarter && year) {
      // Employee is viewing their own preview - go back to their goals
      const loggedInEmpId = localStorage.getItem('empId');
      if (loggedInEmpId) {
        navigate(`/employee/goals/${loggedInEmpId}?year=${year}&quarter=${quarter}`);
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleCompleteAssessment = () => {
    // Only employee can complete assessment (when no empId in URL)
    if (!empId && quarter && year) {
      const loggedInEmpId = localStorage.getItem('empId');
      if (loggedInEmpId) {
        navigate(`/employee/self-assessment/${loggedInEmpId}?year=${year}&quarter=${quarter}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading self review preview..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24 px-6 max-w-7xl mx-auto w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-medium mb-4">Error: {error}</p>
            
            {/* Debug Information */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information:</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>View Mode: <span className="font-mono">{debugInfo.viewMode || 'undefined'}</span></li>
                <li>Employee ID from URL: <span className="font-mono">{debugInfo.empIdFromUrl || 'undefined'}</span></li>
                <li>Quarter from query: <span className="font-mono">{debugInfo.quarterFromQuery || 'undefined'}</span></li>
                <li>Year from query: <span className="font-mono">{debugInfo.yearFromQuery || 'undefined'}</span></li>
                <li>Employee ID from storage: <span className="font-mono">{debugInfo.empIdFromStorage || 'undefined'}</span></li>
                <li>Final Employee ID used: <span className="font-mono font-bold text-red-600">{debugInfo.finalEmployeeId || 'undefined'}</span></li>
                <li>Full URL: <span className="font-mono break-all">{debugInfo.fullUrl}</span></li>
                <li>Pathname: <span className="font-mono">{debugInfo.pathname}</span></li>
                <li>Search params: <span className="font-mono">{debugInfo.searchParams || 'none'}</span></li>
              </ul>
            </div>

            {/* Navigation Options */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Expected URL formats:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside ml-2">
                <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">/employee/appraisal/preview/9085499?year=2025&quarter=Q1</span> (Manager view)</li>
                <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">/employee/appraisal/preview?year=2025&quarter=Q1</span> (Employee self view)</li>
              </ul>
              
              <div className="flex space-x-4 mt-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  Retry
                </button>
                <button 
                  onClick={handleGoBack}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />

      <div className="mt-24 px-6 max-w-7xl mx-auto w-full pb-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors mr-4 font-medium"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <span className="text-gray-400">/</span>
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors ml-2"
          >
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate(empId ? "/AppraisalList" : "/EmployeeAppraisal")}
            className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
          >
            {empId ? "Appraisal List" : "My Appraisal"}
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Self Review Preview</span>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Quarter {quarter} · {year}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {getQuarterDates(quarter)}
          </p>
          {empId && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Manager View:</span> Viewing preview for Employee ID: <span className="font-mono font-bold">{empId}</span>
              </p>
            </div>
          )}
          {!empId && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                <span className="font-semibold">Employee Self View:</span> Viewing your own self assessment preview
              </p>
            </div>
          )}
        </div>

        {/* Status Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Status</h2>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on: {formatDate(previewData.submittedDate)}
              </p>
            </div>
            <div>
              {goals.length > 0 && getStatusBadge(goals[0].status)}
            </div>
          </div>
        </div>

        {/* Overall Self Assessment Section */}
        {(previewData.overallSelfAssessmentRating > 0 || previewData.overallSelfReviewComments) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Overall Self Assessment</h2>
            <div className="space-y-4">
              {previewData.overallSelfAssessmentRating > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Overall Rating</p>
                  {getRatingStars(previewData.overallSelfAssessmentRating)}
                </div>
              )}
              {previewData.overallSelfReviewComments && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Overall Comments</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{previewData.overallSelfReviewComments}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Goals Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Predefined Goals</h2>
            {goals.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">No goals found for this employee</p>
            )}
          </div>
          
          {goals.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Goal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weightage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target KPI
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Achievable Target
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {goals.map((goal) => (
                    <tr key={goal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {goal.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs">
                          {goal.goalDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {goal.weightage}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs">
                          {goal.targetKPI || 'Not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs">
                          {goal.achievableTarget || 'No self review provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs">
                          {goal.selfReviewComments || 'No comments provided'}
                        </div>
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
  );
};

export default SelfReviewPreview;