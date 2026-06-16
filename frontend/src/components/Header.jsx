import React, { useState, useRef, useEffect } from 'react';
import { Bell, Mail, User, Search, Menu, X, LogOut } from 'lucide-react';
import cmslogo from '../assets/cmslogo.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// The allModules array for search mapping
const allModules = [
  { name: "Common", route: "/Dashboard" },
  { name: "Leave Requests", route: "/LeaveRequests" },
  { name: "Profile", route: "/Profile" },
  { name: "HolidayList", route: "/holiday" },
  { name: "Helpdesk", route: "/help-desk" },
  { name: "ContactUs", route: "/Contact" },
  { name: "Corporate Hub", route: "/Corporate" }, // Renamed from "ContactUs" to "Corporate Hub" for clarity
  { name: "Employees", route: "/Employee" },
  { name: "Attendance", route: "/attendance" },
  { name: "Holidays", route: "/holiday" },
  { name: "Induction", route: "/Induction" },
  { name: "MyTeam", route: "/team" },
  { name: "ManagerTeamOverview", route: "/team" },
  { name: "MyApprovals", route: "/myApprovals" },
  { name: "Payslip", route: "/payslip" },
  { name: "Tax", route: "/tax" },
  { name: "Events", route: "/events" },
  { name: "Form16", route: "/form16" },
  { name: "Blogs", route: "/blogs" },
  { name: "Resignation", route: "/ExitForm" },
  { name: "Sepration", route: "/ExitForm" },
  { name: "Exit", route: "/ExitForm" },
  { name: "Communications", route: "/announcementDashboard" },
  { name: "ContactUs", route: "/Contact" },
  { name: "CMS Branding", route: "/cms-branding" },
  { name: "Organogram", route: "/orgStructure" },
  { name: "Employee Directory", route: "/employeeDirectory" }, // Added Employee Directory module
  { name: "Committees", route: "/Committees" }, // Added Committees module
  { name: "CEO", route: "/executive" }, // Added Committees module
  { name: "Leaders", route: "/leadership" }, // Added Committees module
  { name: "News", route: "/trending" },
  { name: "RSS", route: "/trending" },
  { name: "Treanding", route: "/trending" },
  { name: "POSH", route: "https://cdl.cms.co.in/lms/login/index.php", target: "_blank" },
  { name: "E-PMS", route: "https://cdl.cms.co.in/group/cms/e-pms", target: "_blank" },
  { name: "RNR", route: " https://cdl.cms.co.in/group/cms/rr-dashboard", target: "_blank" },
  { name: "Info Hub", route: "/infohub" },
  { name: "Corporate Hub", route: "/corporate-hub" },
  { name: "Asset Library", route: "/process-asset-library" },
  { name: "Policy", route: "/policies" },
  { name: "Forms", route: "/forms" },
  { name: "User Guide", route: "/cdl-user-guide" },
  { name: "HR Escalation Matrix", route: "/hr-escalation-matrix" },
  { name: "Social Corner", route: "/social-corner" },







  // Added Blogs module
];



const Header = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for user dropdown
  const corporateHubDropdownRef = useRef(null); // Ref for Corporate Hub dropdown
  const employeeForumDropdownRef = useRef(null); // Ref for Employee Forum dropdown
  const notificationDropdownRef = useRef(null); // NEW: Ref for notification dropdown
  const allowedEmpCodes = ["9085652", "9085363", "9087139", "9083338", "9085944", "9085176", "9085492"];
  const empCode = localStorage.getItem("empId");
  const canAccessRFP = allowedEmpCodes.includes(empCode);

  const [isOpen, setIsOpen] = useState(false); // State for Employee Forum dropdown
  const [isOpen1, setIsOpen1] = useState(false); // State for Corporate Hub dropdown
  const [showNotifications, setShowNotifications] = useState(false); // NEW: State for notification dropdown
  const handleIdeasClick = () => {
    navigate("/Dashboard", { state: { scrollToBottom: true } });
  };
  // Hardcoded notifications with specific messages and links
  const notifications = [
    { id: 1, message: "🆕 New blog just dropped! Don’t miss out on the insights.", link: "/blogs" },
    { id: 2, message: "Inspire change! Submit your idea in Ideas That Xcite 🚀", onClick: handleIdeasClick }
  ];

  // NEW: State for notification count (derived from notifications array length)
  const notificationCount = notifications.length;


  // Parse stored role from sessionStorage (array of roles)
  const storedRoles = JSON.parse(sessionStorage.getItem("role") || "[]");

  const navigate = useNavigate();

  // Unified function to handle closing dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (corporateHubDropdownRef.current && !corporateHubDropdownRef.current.contains(event.target)) {
        setIsOpen1(false);
      }
      if (employeeForumDropdownRef.current && !employeeForumDropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      // NEW: Close notification dropdown when clicking outside
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modified toggle functions to close other dropdowns
  const toggleDropdown = () => { // For Employee Forum
    setIsOpen((prev) => !prev);
    setIsOpen1(false); // Close Corporate Hub dropdown
    setUserDropdownOpen(false); // Close User dropdown
    setShowNotifications(false); // NEW: Close Notifications dropdown
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // close dropdown after selection
  };
  const handleMyteam = () => {
    navigate("/app")
  }
  const toggleDropdown1 = () => { // For Corporate Hub
    setIsOpen1((prev) => !prev);
    setIsOpen(false); // Close Employee Forum dropdown
    setUserDropdownOpen(false); // Close User dropdown
    setShowNotifications(false); // NEW: Close Notifications dropdown
  };

  const handleNavigate1 = (path) => {
    navigate(path);
    setIsOpen1(false); // close dropdown after selection
  };

  // NEW: Toggle Notification Dropdown
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setUserDropdownOpen(false); // Close User dropdown
    setIsOpen(false); // Close Employee Forum dropdown
    setIsOpen1(false); // Close Corporate Hub dropdown
  };

  // NEW: Handle click on a notification item
  const handleNotificationClick = (link) => {
    setShowNotifications(false); // Close notification dropdown
    navigate(link); // Navigate to the specified link
  };


  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const typingToastShown = useRef(false);

  const showComingSoon = () => {
    toast.info("🚧 Coming Soon!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      style: {
        background: "#f5f3ff",
        color: "#7c3aed",
        fontWeight: "500",
        borderRadius: "10px",
      },
    });
  };

  const handleSwitchToProfile = () => navigate("/Profile");
const handleSwitchToKm = () => {
  const empCode = localStorage.getItem("empId");

  if (!empCode) return;

  // Base64 encode
  const encodedEmpCode = btoa(empCode);

  window.open(
    `http://43.205.24.208:9083/km?empCode=${encodeURIComponent(encodedEmpCode)}`,
    "_blank",
    "noopener,noreferrer"
  );
};




  const handleClickTicket = () => navigate("/help-desk");
  const handleHome = () => navigate("/Dashboard");
  const handleEmployee = () => navigate("/Employee");
  const handleOrg = () => navigate("/orgStructure");

  const handleContact = () => navigate("/Contact");
  const handleCorporate = () => navigate("/Corporate"); // This handler is not used directly for the dropdown, but for mobile
  const handleClickProfile = () => navigate("/Profile")
  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
    navigate("/");
  };
  const handleClickTeam = () => navigate("/Org");

  return (
    <header className="w-full fixed top-0 left-0 bg-white shadow z-50">
      <ToastContainer /> {/* Placed ToastContainer here for global access */}
      <div className="max-w-7xl mx-auto flex items-center justify-between p-2">

        {/* Logo */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <a href="https://www.cms.co.in/" target="_blank" rel="noopener noreferrer">
            <img src={cmslogo} alt="Logo" className="w-22 h-16" />
          </a>
        </div>

        {/* Menus */}
        <nav className="hidden md:flex flex-1 justify-center gap-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-red-600" onClick={handleHome}>Home</a>
          <div className="relative" ref={corporateHubDropdownRef}> {/* Attach ref here */}
            <button
              className="hover:text-red-600 font-semibold"
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                toggleDropdown1(); // This now closes others
              }}
            >
              Corporate Hub
            </button>

            {isOpen1 && (
              <div className="absolute mt-2 bg-white shadow-lg rounded-md py-2 z-50 min-w-[180px] border border-gray-200">
                <button
                  onClick={() => handleNavigate("/cms-branding")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  CMS Branding
                </button>
                <button
                  onClick={() => handleNavigate("/orgStructure")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Organogram
                </button>
              </div>
            )}
          </div>


          <div className="relative" ref={employeeForumDropdownRef}> {/* Attach ref here */}
            <button
              onClick={toggleDropdown} // This now closes others
              className="hover:text-red-600"
            >
              Employee Forum
            </button>

            {isOpen && (
              <div className="absolute mt-2 bg-white shadow-lg rounded-md py-2 z-50 min-w-[180px]">
                <button
                  onClick={() => handleNavigate("/Employee")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Employees
                </button>
                <button
                  onClick={() => handleNavigate("/Committees")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Committees
                </button>
                <a
                  href="/wistleblower.pdf#view=Fit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Whistleblower
                </a>


                {storedRoles.includes("CMS Employee") && (
                  <button
                    onClick={() => handleNavigate("/employeeDirectory")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Employee Directory
                  </button>
                )}
              </div>
            )}
          </div>
          <a href="#" className="hover:text-red-600" onClick={handleClickTicket}>Help Desk</a>
          <a href="#" className="hover:text-red-600" onClick={handleContact}>Contact Us</a>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="relative w-58 hidden md:block">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full pl-4 pr-10 py-2 rounded-full bg-gray-100 text-sm shadow-sm focus:outline-none text-xs font-content"
              value={searchText}
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);

                // Only show "Coming Soon" toast if typing starts and it hasn't been shown recently
                if (value.trim() !== "" && !typingToastShown.current) {


                }
              }}
            />
            <Search className="absolute right-3 top-2.5 text-gray-500 cursor-pointer" size={18} />
            {searchText && (
              <div className="absolute bg-white shadow rounded mt-1 w-full z-10 text-xs font-content">
                {allModules // Use allModules for filtering
                  .filter(mod =>
                    mod.name
                      .toLowerCase()
                      .split(" ") // Split module name into words
                      .some(word => word.includes(searchText.toLowerCase())) // Check if any word contains the search text
                  )
                  .map((mod, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setSearchText(""); // Clear search text on click
                        navigate(mod.route); // Navigate to the module's route
                      }}
                    >
                      {mod.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 relative">

            {/* Bell with tooltip */}
            <style>
              {`
        @keyframes pulse-blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }

        .blink-slow {
          animation: pulse-blink 1.5s infinite ease-in-out;
        }
        `}
            </style>
            <div className="relative group" ref={notificationDropdownRef}>
              <Bell
                className="cursor-pointer text-black hover:text-red-700 transition-colors" // Bell icon is now red by default
                size={22}
                onClick={toggleNotifications} // Toggle notification dropdown
              />
              {/* NEW: Red circle notification badge */}
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center blink-slow"> {/* Added blink-slow class */}
                  {notificationCount}
                </span>
              )}

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-60 bg-white rounded-lg shadow-xl z-50 text-sm border border-gray-200 overflow-hidden"> {/* Increased shadow and border */}
                  <div className="p-3 bg-red-600 text-white font-header text-center rounded-t-lg"> {/* Styled header */}
                    Notifications
                  </div>
                  {notifications.length > 0 ? (
                    <div className="py-2"> {/* Added padding for internal items */}
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.link)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200 border-b border-gray-100 last:border-b-0 font-content text-gray-800" // Improved padding, hover, and border
                        >
                          {notif.message}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-gray-500 font-content text-center">No new notifications</div>
                  )}
                </div>
              )}
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Notification
              </span>
            </div>
            <div className="relative group" ref={dropdownRef}>
              <User
                className="cursor-pointer hover:text-red-600"
                size={22}
                onClick={() => {
                  setUserDropdownOpen((prev) => !prev);
                  setIsOpen(false); // Close Employee Forum dropdown
                  setIsOpen1(false); // Close Corporate Hub dropdown
                }}
              />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Profile
              </span>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-4 w-40 bg-white rounded-lg shadow-lg z-50 text-sm border border-gray-100">

                  <button
                    onClick={handleSwitchToProfile}
                    className="w-full text-left px-2 py-2 hover:bg-gray-100"
                  >
                    👨‍💼 Profile
                  </button>
                  <button
                    onClick={handleSwitchToKm}
                    className="w-full text-left px-2 py-2 hover:bg-gray-100"
                  >
                    👨‍💼 KM
                  </button>
                  {/* ✅ RFP visible only for specific EmpCodes */}
                  {canAccessRFP && (
                    <button
                      onClick={handleMyteam}
                      className="w-full text-left px-2 py-2 hover:bg-gray-100"
                    >
                      👨‍💼 RFP
                    </button>
                  )}

                  <button
                    onClick={logout}
                    className="w-full text-left px-2 py-2 hover:bg-gray-100 text-red-500"
                  >
                    🚪 Logout
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden flex items-center justify-center" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          <div className="md:hidden p-4 bg-white shadow">
            <nav className="flex flex-col gap-4 text-gray-700 font-medium">
              <button onClick={handleHome} className="text-left hover:text-red-600">Home</button>
              <button onClick={handleCorporate} className="text-left hover:text-red-600">Corporate Hub</button>
              <button onClick={handleEmployee} className="text-left hover:text-red-600">Employee Forum</button>
              <button onClick={handleClickTicket} className="text-left hover:text-red-600">Help Desk</button>
              <button onClick={handleContact} className="text-left hover:text-red-600">Contact Us</button>
            </nav>

            <div className="relative w-full mt-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 pl-10 rounded-lg shadow bg-gray-100"
                value={searchText}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchText(value);

                  if (value.trim() !== "" && !typingToastShown.current) {
                    showComingSoon();
                    typingToastShown.current = true;

                    setTimeout(() => {
                      typingToastShown.current = false;
                    }, 3000);
                  }
                }}
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              {searchText && (
                <div className="absolute bg-white shadow rounded mt-1 w-full z-10">
                  {allModules // Use allModules for filtering
                    .filter(mod =>
                      mod.name
                        .toLowerCase()
                        .split(" ")
                        .some(word => word.includes(searchText.toLowerCase()))
                    )
                    .map((mod, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSearchText(""); // Clear search text on click
                          navigate(mod.route); // Navigate to the module's route
                        }}
                      >
                        {mod.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
