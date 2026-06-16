import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";

const ManagerReviewPreview = () => {
  const navigate = useNavigate();
  const params = useParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log("All URL params:", params);
  
  // Try to get employee ID from various possible parameter names
  const employeeIdFromParams = params.empId || params.employeeId || params.id;
  
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const quarter = searchParams.get('quarter');
  const year = searchParams.get('year');
  
  // ALWAYS use employeeId from URL for manager view - never from localStorage
  const employeeId = employeeIdFromParams;
  
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [managerData, setManagerData] = useState({
    managerOverallSelfAssessmentRating: 0,
    managerOverallSelfReviewComments: "",
    reviewedAt: null,
    overallSelfAssessmentRating: 0,
    overallSelfReviewComments: ""
  });

  // Debug logging - check what parameters we're getting
  useEffect(() => {
    console.log("=== MANAGER REVIEW PREVIEW DEBUG ===");
    console.log("All URL Params:", params);
    console.log("URL Params - empId:", params.empId);
    console.log("URL Params - employeeId:", params.employeeId);
    console.log("URL Params - id:", params.id);
    console.log("Query Params - quarter:", quarter);
    console.log("Query Params - year:", year);
    console.log("LocalStorage - empId (Manager's ID):", localStorage.getItem('empId'));
    console.log("Final employeeId being used (Employee's ID):", employeeId);
    console.log("Full URL:", window.location.href);
    console.log("Pathname:", window.location.pathname);
    console.log("Search params string:", window.location.search);
    
    setDebugInfo({
      allParams: params,
      empIdFromUrl: params.empId,
      employeeIdFromUrl: params.employeeId,
      idFromUrl: params.id,
      quarterFromQuery: quarter,
      yearFromQuery: year,
      managerIdFromStorage: localStorage.getItem('empId'),
      finalEmployeeId: employeeId,
      fullUrl: window.location.href,
      pathname: window.location.pathname,
      searchParams: window.location.search
    });
  }, [params, quarter, year, employeeId]);

  useEffect(() => {
    const fetchGoals = async () => {
      // Check if we have all required parameters
      if (!employeeId) {
        setError(`Employee ID not found in URL. Please check the URL format. Found params: ${JSON.stringify(params)}`);
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
        // ALWAYS use employeeId from URL for manager view
        const url = `${BASE_URL_EPMS}/api/goals/predefined/employee/${employeeId}/${quarter}?year=${year}`;
        console.log("========================================");
        console.log("MANAGER REVIEW VIEW - FETCHING EMPLOYEE GOALS FROM:", url);
        console.log("Employee ID being used:", employeeId);
        console.log("Quarter:", quarter);
        console.log("Year:", year);
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
          
          // Get manager review data from the first goal
          const firstGoal = result.data[0];
          setManagerData({
            managerOverallSelfAssessmentRating: firstGoal?.managerOverallSelfAssessmentRating || 0,
            managerOverallSelfReviewComments: firstGoal?.managerOverallSelfReviewComments || "",
            reviewedAt: firstGoal?.reviewedAt || null,
            overallSelfAssessmentRating: firstGoal?.overallSelfAssessmentRating || 0,
            overallSelfReviewComments: firstGoal?.overallSelfReviewComments || ""
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
  }, [employeeId, quarter, year]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not reviewed";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      'MANAGER_REVIEWED': { text: 'Manager Review Completed', color: 'bg-green-100 text-green-800' },
      'SELF_REVIEWED': { text: 'Self Review Completed', color: 'bg-yellow-100 text-yellow-800' },
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
    if (!rating || rating === 0) return null;
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

  const getAchievementLevelBadge = (level) => {
    const colors = {
      'Exceeds': 'bg-green-100 text-green-800',
      'Meets': 'bg-red-100 text-red-800',
      'Below': 'bg-yellow-100 text-yellow-800',
      'Needs Improvement': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${colors[level] || 'bg-gray-100 text-gray-800'}`}>
        {level || 'Not Assessed'}
      </span>
    );
  };

  const getPerformanceBadge = (performance) => {
    const colors = {
      'Outstanding': 'bg-purple-100 text-purple-800',
      'Good': 'bg-green-100 text-green-800',
      'Average': 'bg-yellow-100 text-yellow-800',
      'Below Average': 'bg-orange-100 text-orange-800',
      'Low': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${colors[performance] || 'bg-gray-100 text-gray-800'}`}>
        {performance || 'Not Assessed'}
      </span>
    );
  };

  const getPotentialBadge = (potential) => {
    const colors = {
      'High': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${colors[potential] || 'bg-gray-100 text-gray-800'}`}>
        {potential || 'Not Assessed'}
      </span>
    );
  };

  const getResourceBadge = (resource) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-800',
      'Key': 'bg-yellow-100 text-yellow-800',
      'Standard': 'bg-red-100 text-red-800',
      'Talent': 'bg-purple-100 text-purple-800',
      'High': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${colors[resource] || 'bg-gray-100 text-gray-800'}`}>
        {resource || 'Not Specified'}
      </span>
    );
  };

  const getEmployeeCategoryBadge = (category) => {
    if (!category) return <span className="px-4 py-2 inline-flex text-sm font-semibold rounded-full bg-gray-100 text-gray-800">Not Specified</span>;
    
    const colors = {
      'High Performer - High Potential': 'bg-green-100 text-green-800',
      'High Performer - Medium Potential': 'bg-red-100 text-red-800',
      'Consistent Performer - High Potential': 'bg-teal-100 text-teal-800',
      'Consistent Performer - Medium Potential': 'bg-cyan-100 text-cyan-800',
      'Development Needed': 'bg-orange-100 text-orange-800',
      'Risk': 'bg-red-100 text-red-800',
      'Star': 'bg-purple-100 text-purple-800',
      'Question Mark': 'bg-yellow-100 text-yellow-800',
      'Problem Employee': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${colors[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  // Calculate overall metrics from all goals
  const calculateOverallMetrics = () => {
    if (!goals.length) return null;
    
    // Get the most common or most relevant values
    // For simplicity, we'll take the values from the first goal
    const firstGoal = goals[0];
    
    return {
      achievementLevel: firstGoal?.achievementLevel,
      performance: firstGoal?.performance,
      potential: firstGoal?.potential,
      resourceCategory: firstGoal?.talentOrCriticalResource,
      employeeCategory: firstGoal?.talentMatrixCategory
    };
  };

  const overallMetrics = calculateOverallMetrics();

  const handleGoBack = () => {
    navigate('/AppraisalList');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading performance appraisal report..." />
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
                <li>All URL Params: <span className="font-mono">{JSON.stringify(debugInfo.allParams)}</span></li>
                <li>Employee ID from URL (empId): <span className="font-mono font-bold text-red-600">{debugInfo.empIdFromUrl || 'undefined'}</span></li>
                <li>Employee ID from URL (employeeId): <span className="font-mono font-bold text-red-600">{debugInfo.employeeIdFromUrl || 'undefined'}</span></li>
                <li>Employee ID from URL (id): <span className="font-mono font-bold text-red-600">{debugInfo.idFromUrl || 'undefined'}</span></li>
                <li>Quarter from query: <span className="font-mono">{debugInfo.quarterFromQuery || 'undefined'}</span></li>
                <li>Year from query: <span className="font-mono">{debugInfo.yearFromQuery || 'undefined'}</span></li>
                <li>Manager ID from storage: <span className="font-mono">{debugInfo.managerIdFromStorage || 'undefined'}</span></li>
                <li>Final Employee ID used: <span className="font-mono font-bold text-red-600">{debugInfo.finalEmployeeId || 'undefined'}</span></li>
                <li>Full URL: <span className="font-mono break-all">{debugInfo.fullUrl}</span></li>
                <li>Pathname: <span className="font-mono">{debugInfo.pathname}</span></li>
                <li>Search params: <span className="font-mono">{debugInfo.searchParams || 'none'}</span></li>
              </ul>
            </div>

            {/* Navigation Options */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Expected URL format:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside ml-2">
                <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">/manager/review/preview/9085499?year=2025&quarter=Q1</span></li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">Check your route configuration in App.js or router file. The parameter name in the route should match what we're looking for.</p>
              <div className="flex space-x-4 pt-4">
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
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mr-4 font-medium"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <span className="text-gray-400">/</span>
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors ml-2 font-medium"
          >
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate("/AppraisalList")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors font-medium"
          >
            Appraisal List
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Performance Appraisal Report</span>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Manager View</h2>
            <p className="text-sm text-red-700">
              You are viewing the performance appraisal report for Employee ID: <span className="font-mono font-bold text-red-900">{employeeId}</span>
            </p>
          </div>
          
          <h1 className="text-3xl font-semibold text-gray-800">
            Quarter {quarter} · {year}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {getQuarterDates(quarter)}
          </p>
        </div>

        {/* Status Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Review Status</h2>
              <p className="text-sm text-gray-500 mt-1">
                Reviewed on: {formatDate(managerData.reviewedAt)}
              </p>
            </div>
            <div>
              {goals.length > 0 && getStatusBadge(goals[0].status)}
            </div>
          </div>
        </div>

        {/* Overall Metrics Section */}
        {overallMetrics && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Overall Performance Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-600 mb-3">Achievement Level</p>
                {getAchievementLevelBadge(overallMetrics.achievementLevel)}
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-600 mb-3">Performance</p>
                {getPerformanceBadge(overallMetrics.performance)}
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-600 mb-3">Potential</p>
                {getPotentialBadge(overallMetrics.potential)}
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-600 mb-3">Resource Category</p>
                {getResourceBadge(overallMetrics.resourceCategory)}
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-600 mb-3">Employee Category</p>
                {getEmployeeCategoryBadge(overallMetrics.employeeCategory)}
              </div>
            </div>
          </div>
        )}

        {/* Manager's Overall Assessment Section */}
        {(managerData.managerOverallSelfAssessmentRating > 0 || managerData.managerOverallSelfReviewComments) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Manager's Overall Assessment</h2>
            <div className="space-y-4">
              {managerData.managerOverallSelfAssessmentRating > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Overall Rating</p>
                  {getRatingStars(managerData.managerOverallSelfAssessmentRating)}
                </div>
              )}
              {managerData.managerOverallSelfReviewComments && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Overall Comments</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{managerData.managerOverallSelfReviewComments}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Employee's Self Assessment Section */}
        {(managerData.overallSelfAssessmentRating > 0 || managerData.overallSelfReviewComments) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Employee's Self Assessment</h2>
            <div className="space-y-4">
              {managerData.overallSelfAssessmentRating > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Overall Rating</p>
                  {getRatingStars(managerData.overallSelfAssessmentRating)}
                </div>
              )}
              {managerData.overallSelfReviewComments && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Overall Comments</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{managerData.overallSelfReviewComments}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Goals Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Goal-wise Review Details</h2>
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
                      Self Review
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {goals.map((goal) => (
                    <tr key={goal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {goal.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs">
                          {goal.description}
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
                        <div className="space-y-2">
                          {goal.selfAssessmentRating && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Rating: </span>
                              <span className="text-gray-900">{goal.selfAssessmentRating}/5</span>
                            </div>
                          )}
                          {goal.selfReview && (
                            <div className="text-sm text-gray-700">
                              <span className="font-medium text-gray-700">Review: </span>
                              {goal.selfReview}
                            </div>
                          )}
                          {goal.selfReviewComments && (
                            <div className="text-sm text-gray-700">
                              <span className="font-medium text-gray-700">Comments: </span>
                              {goal.selfReviewComments}
                            </div>
                          )}
                          {!goal.selfReview && !goal.selfAssessmentRating && (
                            <span className="text-sm text-gray-400">No self review provided</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Timeline Section */}
        {goals.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Review Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {goals[0].selfReviewSubmittedDate && (
                <div>
                  <p className="text-gray-500">Self Review Submitted</p>
                  <p className="font-medium text-gray-900">{formatDate(goals[0].selfReviewSubmittedDate)}</p>
                </div>
              )}
              {goals[0].reviewedAt && (
                <div>
                  <p className="text-gray-500">Manager Reviewed</p>
                  <p className="font-medium text-gray-900">{formatDate(goals[0].reviewedAt)}</p>
                </div>
              )}
              {goals[0].submittedToEmployeeAt && (
                <div>
                  <p className="text-gray-500">Submitted to Employee</p>
                  <p className="font-medium text-gray-900">{formatDate(goals[0].submittedToEmployeeAt)}</p>
                </div>
              )}
              {goals[0].selfAcceptedDate && (
                <div>
                  <p className="text-gray-500">Accepted by Employee</p>
                  <p className="font-medium text-gray-900">{formatDate(goals[0].selfAcceptedDate)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerReviewPreview;