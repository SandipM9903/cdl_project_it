import React, { useState, useEffect } from 'react'; // Corrected import for useState and useEffect
import axios from 'axios'; // axios import is separate and correct
import { Mail, Phone, Briefcase, Calendar, CircleDot, ChevronRight, Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header'; // Ensure this path is correct for your Header component
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config/Config';

const API_BASE_URL = `${BASE_URL}`;

const ManagerTeamOverview = () => {
  const [manager, setManager] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This should ideally come from user context (logged-in manager's empCode)
  // For this example, we're hardcoding it to match the API URL and response.
  const managerEmpCode = localStorage.getItem("empId");

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the list of employees. The API now returns an array of objects.
        const response = await axios.get(`${API_BASE_URL}/employee/team/${managerEmpCode}`);

        // The API returns an array, where each item has a 'fileAndObjectTypeBean.empResDTO'
        const rawEmployeesData = response.data;

        // Filter and map to get only the empResDTOs that report to our managerEmpCode
        const filteredTeamMembers = rawEmployeesData
          .map(item => item.fileAndObjectTypeBean?.empResDTO) // Extract empResDTO from each item
          .filter(emp => emp && emp.reportTo === managerEmpCode); // Filter by reportTo matching managerEmpCode

        setTeamMembers(filteredTeamMembers);

        // Infer manager details from the first team member's reportingManager fields
        // Assuming all team members report to the same manager and their reportingManager details are consistent
        if (filteredTeamMembers.length > 0) {
          const firstMember = filteredTeamMembers[0];
          const inferredManager = {
            name: firstMember.reportingManager || "Manager Name",
            title: "Manager", // API doesn't provide manager's title directly
            profilePic: `https://placehold.co/120x120/DC3545/FFFFFF?text=${firstMember.reportingManager ? firstMember.reportingManager.split(' ').map(n => n[0]).join('') : 'MN'}`,
            email: firstMember.reportingManagerEmailId || "manager@example.com",
            phone: "N/A", // Not provided by this API directly for manager
            department: firstMember.mainDeptResDTO?.mainDepartment || "N/A",
            location: firstMember.userDTO?.locationResDTO?.locationName || "N/A"
          };
          setManager(inferredManager);
        } else {
          // If no team members are found, set a default manager or handle accordingly
          setManager({
            name: "No Manager Found",
            title: "N/A",
            profilePic: "https://placehold.co/120x120/DC3545/FFFFFF?text=NM",
            email: "n/a@example.com",
            phone: "N/A",
            department: "N/A",
            location: "N/A"
          });
        }

      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("Failed to fetch team data. Please ensure the API is running and accessible.");
        toast.error("Failed to load team data. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [managerEmpCode]); // Dependency array to re-run effect if managerEmpCode changes

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith('XXXX')) return 'N/A'; // Handle 'XXXX-01-10' format
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    return status ? 'text-green-600' : 'text-orange-600'; // Assuming 'status: true' is Active
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex flex-col items-center justify-center font-sans">
          <Loader2 className="animate-spin text-[#DC3545] w-12 h-12 mb-4" />
          <p className="text-xl text-gray-700">Loading team data...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex flex-col items-center justify-center font-sans">
          <p className="text-xl text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#DC3545] text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  if (!manager) { // Should be populated by now, but as a safeguard
      return (
          <>
            <Header />
            <div className="min-h-screen bg-gray-50 pt-20 flex flex-col items-center justify-center font-sans">
              <p className="text-xl text-gray-700">No manager data could be loaded.</p>
            </div>
          </>
      );
  }

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Main Content Area */}
      <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8 font-sans">
        {/* Breadcrumb / Navigation */}
      <nav className="text-sm text-gray-600 mb-6 max-w-7xl mx-auto">
  <Link to="/Dashboard" className="hover:underline">Home</Link> / <span className="font-semibold text-[#DC3545]">My Team</span>
</nav>

        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">

          {/* Manager's Profile Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-8 border-b border-gray-200 mb-8">
            <img
              src={manager.profilePic}
              alt={manager.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#DC3545] shadow-md"
            />
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">{manager.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{manager.title}</p>
              <div className="flex flex-col sm:flex-row sm:justify-center md:justify-start gap-3 text-gray-700 text-sm">
                <span className="flex items-center gap-2">
                  <Mail size={16} className="text-[#DC3545]" /> {manager.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={16} className="text-[#DC3545]" /> {manager.phone || 'N/A'}
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase size={16} className="text-[#DC3545]" /> {manager.department}
                </span>
              </div>
            </div>
          </div>

          {/* Team Overview */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            My Team ({teamMembers.length} Members)
          </h2>

          {/* Team Members Grid */}
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.empCode || member.empId} // Use empCode or empId as key
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col items-center text-center"
                >
                  <img
                    src={`https://placehold.co/100x100/A0AEC0/FFFFFF?text=${member.firstName[0]}${member.lastName ? member.lastName[0] : ''}`} // Dynamic placeholder
                    alt={member.firstName}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{member.firstName} {member.middleName ? member.middleName + ' ' : ''}{member.lastName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{member.designationResDTO?.designationName || 'N/A'}</p>

                  <div className="text-xs text-gray-500 mb-4 flex flex-col items-center gap-1">
                    <span className="flex items-center gap-1">
                      <Mail size={14} className="text-blue-500" /> {member.emailId}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} className="text-blue-500" /> {member.primaryContactNo || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-purple-500" /> Joined: {formatDate(member.dateOfJoining)}
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${getStatusColor(member.status)}`}>
                      <CircleDot size={14} /> {member.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* <button
                    onClick={() => toast.info(`Viewing profile for ${member.firstName} ${member.lastName}`)} // Replace with actual navigation
                    className="mt-auto flex items-center justify-center gap-1 px-4 py-2 bg-[#DC3545] text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors duration-200 shadow-sm"
                  >
                    View Profile <ChevronRight size={16} />
                  </button> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-600">
              <p className="text-lg">No direct team members found for this manager.</p>
              <p className="text-sm mt-2">Please ensure the manager's employee code is correct and the API provides a list of their direct reports.</p>
            </div>
          )}

          {/* Call to action or summary (optional) */}
          <div className="mt-10 text-center text-gray-700">
            <p className="text-lg">
              Empower your team and foster collaboration.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default ManagerTeamOverview;