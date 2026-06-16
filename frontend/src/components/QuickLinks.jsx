import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Modal from "react-modal";
import OTPInput from "react-otp-input";
// Icon imports
import myCms from "../assets/Icons/mycms.png";
import performance from "../assets/Icons/performance.png";
import rnr from "../assets/Icons/rnr.png";
import learning from "../assets/Icons/learnings.png";
import referral from "../assets/Icons/myreferels.png";
import MyTeam from "../assets/Icons/MyTeam.png";
import documents from "../assets/Icons/documents.png";
import payslip from "../assets/Icons/payslip.png";
import tax from "../assets/Icons/tax.png";
import form from "../assets/Icons/forms.png";
import med from "../assets/Icons/med.png";
import resignation from "../assets/Icons/sepration.png";
import womenleader from "../assets/Icons/women.png";
import userMannual from "../assets/EPMS/E-PMS- User_Manual.pdf";

import SummarizeIcon from "@mui/icons-material/Summarize";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

// Set the app element for react-modal
Modal.setAppElement("#root");

const QuickLinks = ({ onCardClick }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false); // State for Performance modal
  const [isHR, setIsHR] = useState(false); // State to check if employee is in HR department
  const [loading, setLoading] = useState(true); // Loading state for department check
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const decrypt = (value) => {
    try {
      return value ? atob(value) : "";
    } catch {
      return "";
    }
  };

  const encryptedDOJ = sessionStorage.getItem("employeeDateOfJoining");
  const decryptedDOJ = decrypt(encryptedDOJ); // expected format: YYYY-MM-DD

  const isLessThanOneMonth = (() => {
    if (!decryptedDOJ) return false;

    const dojDate = new Date(decryptedDOJ);
    const today = new Date();

    const diffInMs = today - dojDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays < 40;
  })();

  const userEmpCode = localStorage.getItem("empId");

  const smartPulseAccessEcodes = [
    "9070698",
    "9085169",
    "9083338",
    "9055988",
    "33955",
    "9052934",
    "9081925",
    "9054527",
    "9083095",
    "9086154",
    "9079597",
    "9082697",
    "9081537",
    "9078973",
    "9084556",
    "9084554",
    "9084571",
    "9083096",
    "9083171",
    "9085504",
    "9085176",
  ];

  // Fetch employee details to check if department is HUMAN RESOURCES
  useEffect(() => {
    const checkIfHRDepartment = async () => {
      try {
        const empId = localStorage.getItem("empId");
        if (!empId) {
          console.log("No empId found in localStorage");
          setIsHR(false);
          setLoading(false);
          return;
        }

        // Fetch from the external API that has mainDepartment info
        const response = await axios.get(
          "http://43.205.24.208:9020/employee/getAll",
        );

        let employees = [];
        if (Array.isArray(response.data)) {
          employees = response.data;
        } else if (response.data && response.data.data) {
          employees = response.data.data;
        }

        const employee = employees.find(
          (emp) =>
            emp.empResDTO &&
            emp.empResDTO.empCode.toString() === empId.toString(),
        );

        if (employee && employee.empResDTO) {
          const mainDepartment =
            employee.empResDTO.mainDeptResDTO?.mainDepartment || "";
          console.log("Employee main department:", mainDepartment);
          setIsHR(mainDepartment === "HUMAN RESOURCES");
        } else {
          setIsHR(false);
        }
      } catch (error) {
        console.error("Error fetching employee department:", error);
        setIsHR(false);
      } finally {
        setLoading(false);
      }
    };

    checkIfHRDepartment();
  }, []);

  useEffect(() => {
    const roleListRaw = sessionStorage.getItem("role");
    let roles = [];
    try {
      roles = JSON.parse(roleListRaw);
      if (!Array.isArray(roles)) roles = roleListRaw?.split(",") || [];
    } catch {
      roles = roleListRaw?.split(",") || [];
    }
    setHasAdminRole(roles.includes("CFL"));
  }, []);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setActiveMenu(null);
      setActiveSubmenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Performance modal options data with theme colors
  const performanceOptions = [
    {
      id: 3,
      title: "My EPMS",
      description: "Track Personal Reviews",
      icon: "👤",
      link: "/EmployeeAppraisal",
      color: "bg-red-50 hover:bg-red-100 border border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      borderColor: "hover:border-red-300",
    },
    {
      id: 2,
      title: "My Team",
      description: "Oversee Team Goals & Annual Review",
      icon: "👥",
      link: "/ManagerGoalConfigPerformance",
      color: "bg-red-50 hover:bg-red-100 border border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      borderColor: "hover:border-red-300",
    },
    {
      id: 1,
      title: "HR",
      description: "Create & Start Cycles",
      icon: "⚙️",
      link: "/performance",
      color: "bg-red-50 hover:bg-red-100 border border-red-200", // Commented out HR validation: 'bg-red-50 hover:bg-red-100 border border-red-200' : 'bg-gray-50 border border-gray-200 cursor-not-allowed',
      iconBg: "bg-red-100", // Commented out HR validation: isHR ? 'bg-red-100' : 'bg-gray-100',
      iconColor: "text-red-500", // Commented out HR validation: isHR ? 'text-red-500' : 'text-gray-400',
      borderColor: "hover:border-red-300", // Commented out HR validation: isHR ? 'hover:border-red-300' : '',
      disabled: !(userEmpCode === "9085173" || userEmpCode === "9083095"),
    },
    {
      id: 4,
      title: "User Manual",
      description: "View EPMS User Guide",
      icon: "📄",
      link: userMannual,
      external: true,
      color: "bg-red-50 hover:bg-red-100 border border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      borderColor: "hover:border-red-300",
      disabled: false,
    },
  ];

  const handlePerformanceOptionClick = (option) => {
    setIsPerformanceModalOpen(false);

    // Handle external links (like PDFs)
    if (option.external) {
      window.open(option.link, "_blank");
    } else {
      navigate(option.link);
    }
  };

  const openPerformanceModal = () => {
    setIsPerformanceModalOpen(true);
  };

  const closePerformanceModal = () => {
    setIsPerformanceModalOpen(false);
  };

  const handleSubmenuClick = (sub, event, parentIndex, subIndex) => {
    if (sub.disabled) return;

    // If the item has a submenu, toggle its visibility instead of navigating
    if (sub.submenu) {
      setActiveSubmenu(
        activeSubmenu === `${parentIndex}-${subIndex}`
          ? null
          : `${parentIndex}-${subIndex}`,
      );
      return;
    }

    if (sub.external) {
      window.open(sub.link, "_blank");
    } else if (sub.link) {
      navigate(sub.link);
    }
    setActiveMenu(null);
    setActiveSubmenu(null);

    // Prevent event propagation to avoid triggering parent menu items
    if (event) {
      event.stopPropagation();
    }
  };

  const renderSubmenu = (submenuItems, level = 0, parentIndex = null) => {
    return (
      <div
        className={`absolute ${
          level === 0 ? "top-full left-0 mt-2" : "top-0 left-full ml-2"
        } w-44 bg-white shadow-xl rounded-lg border border-red-100 z-[10]`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside submenu
      >
        {submenuItems.map((sub, subIndex) => (
          <div key={subIndex} className="relative">
            <button
              onClick={(e) => handleSubmenuClick(sub, e, parentIndex, subIndex)}
              disabled={sub.disabled}
              className={`w-full text-left flex items-center px-4 py-2 gap-2 text-sm ${
                sub.disabled
                  ? "cursor-not-allowed text-gray-400"
                  : "hover:bg-red-50 text-gray-700 hover:text-red-600"
              }`}
              onMouseEnter={() => {
                // For nested submenus, we need to track which parent item is active
                if (sub.submenu && parentIndex !== null) {
                  setActiveMenu(parentIndex);
                }
              }}
            >
              {sub.icon && <span className="text-md">{sub.icon}</span>}
              <span className="text-xs font-content font-medium">
                {sub.label}
              </span>
              {sub.submenu && <span className="ml-auto text-red-500">›</span>}
            </button>
            {sub.submenu && activeSubmenu === `${parentIndex}-${subIndex}` && (
              <div className="absolute top-0 left-full">
                {renderSubmenu(sub.submenu, level + 1, parentIndex)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const quickLinksData = [
    {
      title: "MyCMS",
      icon: (
        <img
          src={myCms}
          alt="mycms"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      disabled: isLessThanOneMonth,
      submenu: [
        {
          label: "Documents",
          icon: (
            <img
              src={documents}
              alt="/mycms/documents"
              style={{ width: "18px", height: "24px" }}
            />
          ),
          link: "/mycms/documents",
          disabled: false,
        },
        {
          label: "Payslip",
          icon: (
            <img
              src={payslip}
              alt="payslip"
              style={{ width: "18px", height: "24px" }}
            />
          ),
          link: "/payslip",
        },
        {
          label: "Tax Management",
          icon: (
            <img
              src={tax}
              alt="tax"
              style={{ width: "18px", height: "24px" }}
            />
          ),
          link: "/tax",
        },
        {
          label: "Form 16",
          icon: (
            <img
              src={form}
              alt="form"
              style={{ width: "18px", height: "24px" }}
            />
          ),
          link: "/form16",
        },
        {
          label: "Upload Payslip/Form 16",
          icon: (
            <img
              src={form}
              alt="form"
              style={{ width: "18px", height: "24px" }}
            />
          ),
          link: "/payslip-upload",
        },
        {
          label: "Insurance",
          icon: (
            <img
              src={med}
              alt="med"
              style={{ width: "22px", height: "24px" }}
            />
          ),
          link: "/mediclaim",
        },
        {
          label: "Insurance Admin",
          icon: (
            <img
              src={med}
              alt="med"
              style={{ width: "22px", height: "24px" }}
            />
          ),
          link: "/admin-mediclaim",
        },
        {
          label: (
            <span
              onClick={() =>
                sessionStorage.setItem("workflowName", "E-Separation")
              }
              style={{ cursor: "pointer" }}
            >
              Separation
            </span>
          ),
          icon: (
            <img
              src={resignation}
              alt="resignation"
              style={{ width: "19px", height: "26px" }}
            />
          ),
          link: "/ExitForm",
        },
      ],
    },
    {
      title: "MyApprovals",
      icon: (
        <img
          src={MyTeam}
          alt="holiday"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      link: "/myApprovals",
    },
    {
      title: "Attendance",
      icon: (
        <img
          src="/1143e9ed7908ca087bb910427bb523e5db816c70.png"
          alt="briefcase"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      link: "/attendance",
    },
    {
      title: "EPMS",
      icon: (
        <img
          src={performance}
          alt="performance"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      hasModal: true,
      modalAction: openPerformanceModal,
    },
    {
      title: "RNR",
      icon: (
        <img src={rnr} alt="rnr" style={{ width: "45px", height: "45px" }} />
      ),
      submenu: [
        {
          label: "Recognize Now",
          link: "https://cdl.cms.co.in/group/cms/rr-dashboard",
          external: true,
        },
        {
          label: "Point Bank Campaign",
          link: "/point-bank-campaign",
        },
      ],
    },
    {
      title: "Praviin",
      icon: (
        <img
          src={learning}
          alt="learning"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      submenu: [
        {
          label: "Courses",
          link: "https://cdl.cms.co.in/lms/login/index.php",
          external: true,
        },
        {
          label: "Learning Material",
          link:
            "https://cmscomputersindia-my.sharepoint.com/:f:/g/personal/ankita_bhosle_cms_co_in/EkYFi_S9W0BKm1_3Nnw7cXABzpC3sEL5vO0n4BIu--Bwfw?e=54yHuI",
          external: true,
        },
        {
          label: "Calendar",
          link: "https://mycdl.cms.co.in/documents/access/129422",
          external: true,
        },
        ...(smartPulseAccessEcodes.includes(userEmpCode)
          ? [
              {
                label: "Smart Pulse – LND Dashboard",
                link: "https://example.com/smart-pulse-lnd-dashboard",
                external: true,
              },
            ]
          : []),
        ...(hasAdminRole
          ? [
              {
                label: "StartSmart",
                link: "http://43.204.42.69:9049/",
                external: true,
              },
            ]
          : []),
      ],
    },
    {
      title: "Hot Jobs",
      icon: (
        <img
          src={referral}
          alt="referral"
          style={{ width: "45px", height: "45px" }}
        />
      ),
      submenu: [
        { label: "Referral", link: "/referral/friend", disabled: true },
        { label: "Hot Jobs", link: "/hotjobs" },
        { label: "ERF", link: "/employeeRequisition" },
      ],
    },
    {
      title: "LeadHerShip",
      icon: (
        <img
          src={womenleader}
          alt="womenleader"
          style={{ width: "50px", height: "45px" }}
        />
      ),
      link: "/women-leadership",
    },
  ];

  // Show loading state while checking department
  if (loading) {
    return (
      <div className="w-full mx-auto bg-white p-4 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      {/* Performance Modal with Theme Colors - No background color, only blur */}
      <Modal
        isOpen={isPerformanceModalOpen}
        onRequestClose={closePerformanceModal}
        style={{
          overlay: {
            backgroundColor: "transparent",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            maxWidth: "800px",
            width: "90%",
            maxHeight: "80vh",
            padding: "0",
            borderRadius: "16px",
            border: "none",
            boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25)",
          },
        }}
      >
        <div className="relative">
          {/* Modal Header with theme color */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-red-100 bg-gradient-to-r from-red-50 to-white rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold text-red-600">EPMS</h2>
              <p className="text-sm text-gray-500 mt-1">
                Select an option to proceed
              </p>
            </div>
            <button
              onClick={closePerformanceModal}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Content - Grid of options */}
          <div className="px-6 py-6 max-h-[calc(80vh-140px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performanceOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handlePerformanceOptionClick(option)}
                  disabled={option.disabled}
                  className={`p-5 rounded-xl ${
                    option.color
                  } transition-all duration-200 transform ${
                    !option.disabled ? "hover:scale-[1.02] hover:shadow-lg" : ""
                  } text-left group border ${
                    option.disabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full ${
                        option.iconBg
                      } flex items-center justify-center ${
                        option.iconColor
                      } text-2xl ${
                        !option.disabled ? "group-hover:scale-110" : ""
                      } transition-transform duration-200`}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold text-lg ${
                          option.disabled
                            ? "text-gray-500"
                            : "text-gray-800 group-hover:text-red-600"
                        } transition-colors duration-200`}
                      >
                        {option.title}
                      </h3>
                      <p
                        className={`text-sm mt-1 leading-relaxed ${
                          option.disabled ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {option.description}
                      </p>
                      {/* Commented out HR validation warning message */}
                      {/* {option.disabled && (
                        <p className="text-xs text-red-500 mt-2">
                          ⚠️ HR department access only
                        </p>
                      )} */}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-red-100 bg-gray-50 rounded-b-2xl flex justify-end">
            <button
              onClick={closePerformanceModal}
              className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div className="w-full mx-auto bg-white p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4 relative">
        {quickLinksData.map((item, index) => {
          const isSelected = selectedCardIndex === index;
          return (
            <div
              key={index}
              className="relative border border-red-600 rounded-lg"
              ref={activeMenu === index ? dropdownRef : null}
            >
              <button
                onClick={() => {
                  if (item.disabled) return;

                  if (item.submenu) {
                    setActiveMenu(activeMenu === index ? null : index);
                    setActiveSubmenu(null);
                  } else if (item.hasModal && item.modalAction) {
                    item.modalAction();
                  } else {
                    if (item.external) {
                      window.open(item.link, "_blank");
                    } else {
                      navigate(item.link);
                    }
                    setActiveMenu(null);
                    setActiveSubmenu(null);
                  }

                  setSelectedCardIndex(index);
                  if (onCardClick) onCardClick(item);
                }}
                className={`w-full flex flex-col items-center justify-center rounded-lg p-4 shadow transition
                  ${
                    item.disabled
                      ? "bg-white text-gray-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-red-600 text-white"
                      : "bg-white text-black hover:bg-red-500 hover:text-white"
                  }`}
              >
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="text-xs font-content font-medium">
                  {item.title}
                </h3>
              </button>

              {item.submenu &&
                activeMenu === index &&
                renderSubmenu(item.submenu, 0, index)}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default QuickLinks;
