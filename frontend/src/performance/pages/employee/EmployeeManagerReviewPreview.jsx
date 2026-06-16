import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL_EPMS } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";

const EmployeeManagerReviewPreview = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const quarter = searchParams.get("quarter");
  const year = searchParams.get("year");
  const employeeId = localStorage.getItem("empId") || empId;

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [managerData, setManagerData] = useState({
    managerOverallSelfAssessmentRating: 0,
    managerOverallSelfReviewComments: "",
    reviewedAt: null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!employeeId) {
        setError("Employee ID not found");
        setLoading(false);
        return;
      }

      if (!quarter || !year) {
        setError("Quarter and year parameters are required");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url = `${BASE_URL_EPMS}/api/goals/predefined/employee/${employeeId}/${quarter}?year=${year}`;
        console.log("Fetching from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.success && Array.isArray(result.data)) {
          setGoals(result.data);

          // Get manager review data from the first goal
          const firstGoal = result.data[0];
          setManagerData({
            managerOverallSelfAssessmentRating:
              firstGoal?.managerOverallSelfAssessmentRating || 0,
            managerOverallSelfReviewComments:
              firstGoal?.managerOverallSelfReviewComments || "",
            reviewedAt: firstGoal?.reviewedAt || null,
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
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .split("/")
      .join("-");
  };

  const getQuarterDates = (quarter) => {
    const quarterDates = {
      Q1: "01-Apr to 30-Jun",
      Q2: "01-Jul to 30-Sep",
      Q3: "01-Oct to 31-Dec",
      Q4: "01-Jan to 31-Mar",
    };
    return quarterDates[quarter] || "";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      MANAGER_REVIEWED: {
        text: "Manager Review Completed",
        color: "bg-green-100 text-green-800",
      },
      SELF_REVIEWED: {
        text: "Self Review Completed",
        color: "bg-yellow-100 text-yellow-800",
      },
      ACCEPTED_BY_EMPLOYEE: {
        text: "Accepted",
        color: "bg-teal-100 text-teal-800",
      },
      FINAL_SUBMITTED_TO_HR: {
        text: "Final Submitted",
        color: "bg-indigo-100 text-indigo-800",
      },
    };

    const config = statusConfig[status] || {
      text: status,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getRatingStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        <span className="text-lg font-semibold text-gray-900 mr-2">
          {rating}
        </span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${star <= rating ? "text-yellow-400" : "text-gray-300"
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
    if (empId && quarter && year) {
      navigate(`/employee/goals/${empId}?year=${year}&quarter=${quarter}`);
    } else {
      navigate("/dashboard");
    }
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
            <div className="flex space-x-4">
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
            onClick={() => navigate("/EmployeeAppraisal")}
            className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
          >
            My Performance
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">
            Manager Review Preview
          </span>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
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
              <h2 className="text-lg font-medium text-gray-900">
                Manager Review Status
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Reviewed on: {formatDate(managerData.reviewedAt)}
              </p>
            </div>
            <div>{goals.length > 0 && getStatusBadge(goals[0].status)}</div>
          </div>
        </div>

        {/* Manager Overall Assessment Section */}
        {(managerData.managerOverallSelfAssessmentRating > 0 ||
          managerData.managerOverallSelfReviewComments) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Manager's Overall Assessment
              </h2>
              <div className="space-y-4">
                {managerData.managerOverallSelfAssessmentRating > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Overall Rating</p>
                    {getRatingStars(
                      managerData.managerOverallSelfAssessmentRating,
                    )}
                  </div>
                )}
                {managerData.managerOverallSelfReviewComments && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Overall Comments</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        {managerData.managerOverallSelfReviewComments}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Goals Table - Without Achievement, Performance, Potential, Resource, Self Rating columns */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">
              Goal-wise Manager Assessment
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Goal
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Weightage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Target KPI
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Self Review
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
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
                        {goal.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {goal.weightage}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {goal.targetKPI || "Not specified"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {goal.selfReview || "No self review provided"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {goal.selfReviewComments || "No comments provided"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Back to Goals
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagerReviewPreview;
