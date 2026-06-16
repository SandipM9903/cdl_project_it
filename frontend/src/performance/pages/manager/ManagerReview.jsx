import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import axios from "axios";
import {
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaUserTie,
  FaCheckCircle,
  FaPhone,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";

// Helper function to get employee full name with priority to fullNameAsAadhaar
const getEmployeeFullName = (employeeData) => {
  if (!employeeData) return "Employee";

  // Check localStorage first for EmployeeFullName
  const localStorageFullName = localStorage.getItem("EmployeeFullName");
  if (localStorageFullName && localStorageFullName.trim() !== "") {
    return localStorageFullName.trim();
  }

  // Check for fullNameAsAadhaar in employeeData
  if (employeeData.fullNameAsAadhaar && employeeData.fullNameAsAadhaar.trim() !== "") {
    return employeeData.fullNameAsAadhaar.trim();
  }

  // Fallback to firstName, middleName, lastName
  const firstName = employeeData.firstName || "";
  const middleName = employeeData.middleName || "";
  const lastName = employeeData.lastName || "";
  const fullName = `${firstName} ${middleName} ${lastName}`.trim();

  if (fullName && fullName !== "") {
    return fullName;
  }

  return "Employee";
};

const ManagerReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId } = useParams();

  // Get query parameters
  const [searchParams] = useState(new URLSearchParams(location.search));
  const year = searchParams.get("year") || "2025";
  const quarter = searchParams.get("quarter");

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [employeeData, setEmployeeData] = useState(null);
  const [employeeError, setEmployeeError] = useState(null);

  const [overallManagerRating, setOverallManagerRating] = useState("");
  const [overallManagerComment, setOverallManagerComment] = useState("");
  const [achievementLevel, setAchievementLevel] = useState("");
  const [potential, setPotential] = useState("");
  const [performance, setPerformance] = useState("");
  const [talentResource, setTalentResource] = useState("");
  const [category, setCategory] = useState("");
  const [managerId, setManagerId] = useState("");

  const fetchEmployeeDetails = async () => {
    setEmployeeLoading(true);
    setEmployeeError(null);

    try {
      const response = await axios.get(
        BASE_URL_EPMS_EMP,
      );
      const employees = response.data;
      const employee = employees.find(
        (emp) => emp.empCode.toString() === employeeId.toString(),
      );

      if (employee) {
        setEmployeeData(employee);
      } else {
        setEmployeeData(null);
        setEmployeeError("Employee not found in master data");
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setEmployeeError(err.message);
      setEmployeeData(null);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const calculateCategory = (potential, performance) => {
    const mapPotential = { High: 3, Medium: 2, Low: 1 };
    const mapPerformance = { High: 3, Average: 2, Low: 1 };
    const p = mapPotential[potential];
    const perf = mapPerformance[performance];

    if (p === 3 && perf === 3) return "⭐ Star";
    if (p === 3 && perf === 2) return "High Performer";
    if (p === 3 && perf === 1) return "High Potential";
    if (p === 2 && perf === 3) return "Potential Gem";
    if (p === 2 && perf === 2) return "Core Player";
    if (p === 2 && perf === 1) return "Solid Performer";
    if (p === 1 && perf === 3) return "Inconsistent Player";
    if (p === 1 && perf === 2) return "Average Performer";
    if (p === 1 && perf === 1) return "Risk";
    return "";
  };

  useEffect(() => {
    if (potential && performance) {
      setCategory(calculateCategory(potential, performance));
    } else {
      setCategory("");
    }
  }, [potential, performance]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch employee details when component mounts
    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!employeeId || !quarter) {
        setError(!employeeId ? "Employee ID is missing" : "Quarter is missing");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL_EPMS}/api/goals/predefined/employee/${employeeId}/${quarter}?year=${year}`);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setGoals(result.data);
          if (result.data.length > 0) {
            const firstGoal = result.data[0];
            setManagerId(firstGoal.managerId);
            setOverallManagerRating(firstGoal.managerRating || "");
            setOverallManagerComment(firstGoal.managerComment || "");
          }
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [quarter, year, employeeId]);

  const validateForm = () => {
    const errors = {};
    if (!overallManagerRating) errors.overallManagerRating = "Rating is required";
    if (!overallManagerComment?.trim()) errors.overallManagerComment = "Comment is required";
    if (!achievementLevel) errors.achievementLevel = "Achievement Level is required";
    if (!potential) errors.potential = "Potential is required";
    if (!performance) errors.performance = "Performance is required";
    if (!talentResource) errors.talentResource = "Talent status is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        managerId,
        employeeId,
        quarter,
        year: parseInt(year),
        managerOverallSelfAssessmentRating: parseInt(overallManagerRating),
        managerOverallSelfReviewComments: overallManagerComment?.trim(),
        achievementLevel,
        potential,
        performance,
        talentOrCriticalResource: talentResource,
        goals: goals.map((goal) => ({ id: goal.id })),
      };

      const response = await fetch(`${BASE_URL_EPMS}/api/goals/manager/review/submit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        // Trigger Email using employee data
        if (employeeData && employeeData.emailId) {
          const emailPayload = {
            templateId: 4,
            to: employeeData.emailId,
            variables: {
              employeeName: getEmployeeFullName(employeeData),
              quarter: quarter || "current quarter"
            },
          };
          fetch(`${BASE_URL_EPMS}/api/email/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
          }).catch(err => console.error("Email failed", err));
        }
        setShowSuccessModal(true);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate(`/AppraisalList`);
  };

  const ratingOptions = [
    { value: "1", label: "1 - Poor" },
    { value: "2", label: "2 - Fair" },
    { value: "3", label: "3 - Good" },
    { value: "4", label: "4 - Very Good" },
    { value: "5", label: "5 - Excellent" },
  ];

  const achievementLevelOptions = [
    { value: "Exceeds", label: "Exceeds Expectations" },
    { value: "Meets", label: "Meets Expectations" },
    { value: "Below", label: "Below Expectations" },
  ];

  // Show loading state while fetching employee details or goals
  if (loading || employeeLoading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading review form..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mr-4 animate-colors duration-200"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          >
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate("/AppraisalList")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          >
            Performance List
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600 cursor-default">
            Manager Review
          </span>
        </nav>

        {error ? (
          <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500 shadow-sm">
            <h3 className="text-red-800 font-bold">Error Loading Review</h3>
            <p className="text-red-700 mt-2">{error}</p>
            <button onClick={() => navigate(-1)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">Go Back</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Employee Info Card - Same as ManagerPredefinedGoals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {employeeLoading ? (
                <div className="flex justify-center items-center py-8">
                  <FaSpinner className="animate-spin text-red-500 text-2xl" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-red-500 text-2xl" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">
                        {getEmployeeFullName(employeeData)}
                      </h1>
                      <p className="text-gray-600">
                        {employeeData?.designationName ||
                          "Employee details not available in master data"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <FaBuilding className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Employee Code</p>
                        <p className="font-medium">{employeeId}</p>
                      </div>
                    </div>

                    {employeeData && (
                      <>
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{employeeData.emailId}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <FaBuilding className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">
                              {employeeData.mainDepartment}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <FaUserTie className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Reporting To</p>
                            <p className="font-medium">
                              {employeeData.reportingManager || "Not assigned"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <FaCheckCircle className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Employment Status
                            </p>
                            <p className="font-medium">
                              {employeeData.employmentStatus}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <FaPhone className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Contact</p>
                            <p className="font-medium">
                              {employeeData.contactNo || "Not available"}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {!employeeData && !employeeLoading && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-yellow-700 text-sm flex items-center gap-2">
                        <span>⚠️</span>
                        <span>
                          Employee details not found in master data. Showing review
                          for Employee Code: {employeeId}
                        </span>
                      </p>
                    </div>
                  )}

                  {employeeError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm flex items-center gap-2">
                        <span>❌</span>
                        <span>Error loading employee details: {employeeError}</span>
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quarter Info */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Review Period:</span> Quarter {quarter} - {year}
              </p>
            </div>

            {/* Assessment Section */}
            <div id="overall-manager-section" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-red-600 px-6 py-3 text-white font-bold">Overall Assessment</div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Overall Rating *</label>
                  <select
                    value={overallManagerRating}
                    onChange={(e) => setOverallManagerRating(e.target.value)}
                    className={`w-full p-2.5 border rounded-lg ${validationErrors.overallManagerRating ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  >
                    <option value="">Select Rating</option>
                    {ratingOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  {validationErrors.overallManagerRating && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.overallManagerRating}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Overall Comment *</label>
                  <textarea
                    value={overallManagerComment}
                    onChange={(e) => setOverallManagerComment(e.target.value)}
                    rows="3"
                    className={`w-full p-2.5 border rounded-lg ${validationErrors.overallManagerComment ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="Enter your overall assessment comments..."
                  />
                  {validationErrors.overallManagerComment && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.overallManagerComment}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Goals Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-800 px-6 py-3 text-white font-bold">Goal Reviews</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Goal</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Target/KPI</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Employee Comments</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Weightage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map(goal => (
                      <tr key={goal.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{goal.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{goal.goalDescription || "No description"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{goal.targetKPI || "Not specified"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 italic">
                          "{goal.selfReviewComments || goal.employeeComment || 'No comment submitted yet'}"
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{goal.weightage || 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance/Potential Matrix */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-purple-600 px-6 py-3 text-white font-bold">Talent & Matrix Assessment</div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Achievement Level *</label>
                    <select
                      value={achievementLevel}
                      onChange={e => setAchievementLevel(e.target.value)}
                      className={`w-full p-2.5 border rounded-lg ${validationErrors.achievementLevel ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      {achievementLevelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {validationErrors.achievementLevel && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.achievementLevel}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Potential *</label>
                    <select
                      value={potential}
                      onChange={e => setPotential(e.target.value)}
                      className={`w-full p-2.5 border rounded-lg ${validationErrors.potential ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    {validationErrors.potential && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.potential}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Performance *</label>
                    <select
                      value={performance}
                      onChange={e => setPerformance(e.target.value)}
                      className={`w-full p-2.5 border rounded-lg ${validationErrors.performance ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      <option value="High">High</option>
                      <option value="Average">Average</option>
                      <option value="Low">Low</option>
                    </select>
                    {validationErrors.performance && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.performance}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Talent Status *</label>
                    <select
                      value={talentResource}
                      onChange={e => setTalentResource(e.target.value)}
                      className={`w-full p-2.5 border rounded-lg ${validationErrors.talentResource ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      <option value="Talent">Talent</option>
                      <option value="Critical">Critical Resource</option>
                    </select>
                    {validationErrors.talentResource && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.talentResource}</p>
                    )}
                  </div>
                </div>

                {category && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaInfoCircle className="text-green-600" />
                      <span className="text-green-800 font-semibold">Matrix Category:</span>
                      <span className="text-green-700 font-bold text-lg">{category}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[200px]"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin inline mr-2" /> Submitting...
                  </>
                ) : (
                  "Submit Manager Review"
                )}
              </button>
            </div>

          </form>
        )}
      </div>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
            <p className="text-gray-600 mb-8">
              The manager assessment for <strong>{getEmployeeFullName(employeeData)}</strong> has been successfully recorded and shared.
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ManagerReview;