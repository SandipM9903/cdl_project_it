import { BrowserRouter, Route, Routes } from "react-router-dom";
import Common from "./components/Common";
import Login from "./config/Login";
import PrivateRoutes from "./config/PrivateRoutes";
import Profile from "./emp_Profile/Profile";
import FetchDataComponent from "./components/FetchDisplayComponent";
import AttendanceReport from "./components/AttendanceReport";
import LeaveBalanceReport from "./components/LeaveBalanceReport";
import Employees from "./components/Employees";
import EmployeeDetail from "./components/EmployeeDetail";
import ContactUs from "./components/ContactUs";
import { Attendance } from "./others/Attendance";
import MyCMS from "./pages/MyCMS";
import MgrPendingReqDashboard from "./claims/components/MgrPendingReqDashboard";
import MgrPendingReqHomePage from "./claims/components/MgrPendingReqHomePage";
import ManagerApproval from "./claims/components/ManagerApproval";
import ClaimsDashBoard from "./claims/components/ClaimsDashBoard";
import Payslip from "./payslip/Payslip";
import SelfExitForm from "./eSeperation/components/E-separation/SelfExitForm";
import Exit from "./eSeperation/components/E-separation/Exit";
import ManagerDashBoardPendingExitForm from "./eSeperation/components/E-separation/ManagerDashBoardPendingExitForm";
import ExitDashBoard from "./eSeperation/components/E-separation/ExitDashBoard";
import MainExit from "./eSeperation/components/E-separation/MainExit";
import PendingRequestForDepartmentMembers from "./eSeperation/components/E-separation/PendingRequestForDepartmentMembers";
import Footer from "./components/Footer";
import InitiateExitInManagerDashboard from "./eSeperation/components/E-separation/InitiateExitInManagerDashboard";
import AllHolidays from "./pages/AllHolidays";
import WorkflowStatusTracker from "./eSeperation/components/WorkflowStatusTracker";
import Policies from "./pages/Policies";
import DocViewer from "./pages/DocViewer";
import DocumentViewer from "./pages/DocumentViewer";
import IT_Declaration from "./itDecleration/IT_Declaration";
import IT_Declaration_Display from "./itDecleration/IT_Declaration_Display";
import Select_Regime from "./itDecleration/Select_Regime";
import DeclarationSummary from "./itDecleration/DeclarationSummary";
import IT_Declaration_Update from "./itDecleration/IT_Declaration_Update";
import IT_Declaration_Preview from "./itDecleration/IT_Declaration_Preview";
import Proof_of_Investment_Display from "./itDecleration/Proof_of_Investment_Display";
import Proof_Attach from "./itDecleration/Proof_Attach";
import Proof_Of_Investment_Update from "./itDecleration/Proof_Of_Investment_Update";
import { GetToken } from "./loginConfig/components/GetToken";
import Form16 from "./form16/Form16";
import { DocViewerPassword } from "./form16/DocViewerPassword";
import MoodSelector from "./others/Mood";
import CDLModulePage from "./Modules/CDLModulePage";
import EmployeeHierarchy from "./EmployeeHierarchy/EmployeeHierarchy";
import Layout from "./rfp/theme/Layout";
import BirthdaySection from "./events/BirthdaySection";
import WorkAnniversarySection from "./events/WorkAnniversarySection";
import HolidayList from "./pages/HolidayList";
import Events from "./events/Events";
import OrganizationChart from "./events/OrganizationStructure";
import Leadership from "./pages/Leadership";
import EmployeeRequisition from "./erf/components/EmployeeRequisition.jsx";
import QuestionBankAdd from "./quizApp/pages/quiz/QuestionBankAdd";
import QuestionBank from "./quizApp/pages/quiz/QuestionBank";
import QuizGenerator from "./quizApp/pages/quiz/QuizGenerator";
import QuizResult from "./quizApp/pages/quiz/QuizResult";
import Category from "./SurveyApplication/Category";
import UserGroup from "./SurveyApplication/UserGroup";
import SurveyList from "./SurveyApplication/SurveyList";
import ShowUserResponse from "./quizApp/ShowUserResponse";
import QuizManagement from "./quizApp/pages/quiz/QuizManagement";
import UserQuizManagement from "./quizApp/Component/UserQuizManagement";
import QuizPlay from "./quizApp/pages/quiz/QuizPlay";
import ExecutiveInsights from "./pages/ExecutiveInsights";
import Categorys from "./SurveyApplication/Category";
import SurveyScreen from "./SurveyApplication/SurveyScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Happitude from "./pages/Happitude.jsx";
import Blogs from "./pages/Blogs.jsx";
import SocialCorner from "./pages/SocialCorner.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import ManagerView from "./e-pms/GoalSetting/ManagerView";
import Open from "./e-pms/GoalSetting/Open";
import MangerReview from "./e-pms/managerReview/ManagerReview";
import ManagerScreen from "./e-pms/manager_screen/ManagerScreen";
import ManagerScreen2 from "./e-pms/manager_screen/ManagerScreen2";
import PendingAppraisal from "./e-pms/manager_screen/PendingAppraisal";
import RouteToMgrView from "./e-pms/manager_screen/RouteToMgrView";
import ProfileInfonfoFile from "./e-pms/profile-info/ProfileInfoFile";
import SelfAppraisel from "./e-pms/selfAppraisel/SelfAppraisel";
import AnnouncementDashboard from "./components/AnnouncementDashboard.jsx";
import Forms from "./pages/Forms.jsx";
import Committee from "./pages/Committee.jsx";
import HappitudeCommittee from "./pages/HappitudeCommittee.jsx";
import InfoHub from "./pages/InfoHub.jsx";
import KycComponent from "./pages/KycComponent.jsx";
import CorporateHub from "./pages/CorporateHub.jsx";
import CMSbranding from "./pages/CMSbranding.jsx";
import CMSLogo from "./pages/CMSLogo.jsx";
import CMSTemplates from "./pages/CMSTamplats.jsx";
import ExecutiveInsightsPage from "./events/ExecutiveInsightsPage.jsx";
import RequireOtp from "./config/RequireOtp.jsx";
import ProcessAssetLibrary from "./processAssetLibrary/ProcessAssetLibrary.jsx";
import ProcessFolderView from "./processAssetLibrary/ProcessFolderViewer.jsx";
import Trending from "./pages/Trending.js";
import NewsFeedPage from "./pages/NewsFeedPage.js";
import Helpdesk from "./hrHelpdesk/components/Helpdesk.jsx";
import CreateRequest from "./hrHelpdesk/components/CreateRequest.jsx";
import DashboardHR from "./hrHelpdesk/components/DashboardHR.jsx";
import MyTickets from "./hrHelpdesk/components/MyTickets.jsx";
import AssignedTickets from "./hrHelpdesk/components/AssignedTickets.jsx";
import { SearchProvider } from "./hrHelpdesk/context/SearchContext.jsx";
import { TicketRefreshProvider } from "./hrHelpdesk/context/TicketRefreshContext.jsx";
import MyTeamTickets from "./hrHelpdesk/components/MyTeamTickets.jsx";
import HelpdeskReport from "./hrHelpdesk/components/HelpdeskReport.jsx";
import TrainingModules from "./Modules/TrainingModules.jsx";
import DocViewerPage from "./pages/DocViewerPage.js";
import CMSBoilerplate from "./pages/CMSBoilerplate.jsx";
import BrandGuidelines from "./pages/BrandGuidelines.jsx";
import EmployeeInfoApproval from "./pages/EmployeeInfoApproval.jsx";
import ManagerTeamOverview from "./pages/ManagerTeamOverview.jsx";
import HotJobs from "./pages/HotJobs.jsx";
import HREscalationMatrix from "./pages/HREscalationMatrix.jsx";
import ExitDocViewer from "./pages/ExitDocViewer.js";
import BlogArticle from "./pages/BlogArticle.jsx";
import CreateBlog from "./pages/CreateBlogs.jsx";
import EditBlog from "./pages/EditBlog.jsx";
import MyApprovals from "./components/MyApprovals.jsx";
import ReimbursementMgrPendingDashboard from "./claims/components/ReimbursementMgrPendingDashboard.js";
import AdvanceClaimsMgrPendingDashboard from "./claims/components/AdvanceClaimsMgrPendingDashboard.js";
import AttendancePendingRequests from "./others/AttendancePandingRequest.jsx";
import ExitDepartmentFNFLists from "./eSeperation/components/E-separation/ExitDepartmentFNFLists.js";
import ManageIdeasPage from "./components/ManageIdeasPage.jsx";
import FlexiBenefitForm from "./components/FlexiBenefitForm.js";
import AllReports from "./others/Reports.jsx";
import MoodReport from "./others/MoodReport.jsx";
import ReportsDashboard from "./others/ReportsDashboard.jsx";
import InductionReport from "./others/InductionReport.jsx";
import PTrace from "./rfp/pages/PTrace/PTrace.jsx";
import WomenLeadership from "./pages/WomenLeadership.jsx";
import { DateFilterProvider } from "./hrHelpdesk/context/DateFilterContext.jsx";
import { SortProvider } from "./hrHelpdesk/context/SortContext.jsx";
import PublicCreateTicketForm from "./hrHelpdesk/components/PublicCreateTicketForm.jsx";
import ViewDetailsPage from "./components/ViewDetailsPage.jsx";
import UploadPayslipForm16 from "./payslip/UploadPayslipForm16.jsx";
import OrgChart from "./EmployeeHierarchy/OrgChart.jsx";
import OrganizationalChart from "./EmployeeHierarchy/OrganizationalChart.jsx";
import OrgChartContainer from "./EmployeeHierarchy/OrgChartContainer.jsx";
import TermsPopup from "./config/TearmsPopup.jsx";
import ComplianceReport from "./others/ComplianceReport.jsx";
import MandatoryPolicy from "./pages/MandatoryPolicy.jsx";
import Unauthorized from "./config/Unauthorized.jsx";
import Preview_Port_Of_Investment from "./itDecleration/Preview_Port_Of_Investment.jsx";
import ITAdminStatus from "./itDecleration/ItAdminStatus.jsx";
import AdminMediclaim from "./mediclaim/AdminMediclaim.jsx";
import report from "./reports/report.jsx";
import MoodReports from "./reports/moodReport/MoodReport.jsx";
import RecentReport from "./reports/RecentReport.jsx";
import QuatorWiseGoalReport from "./reports/quatorWiseGoalReport/QuatorWiseGoalReport.jsx";
import AnnualGoalReport from "./reports/annualGoalReport/AnnualGoalReport.jsx";
import OverallGoalSettingReport from "./reports/annualGoalReport/AnnualGoalReport.jsx";
import PerformanceAppraisalReport from "./reports/performanceAppraisalReport/PerformanceAppraisalReport.jsx";
import QualificationReport from "./reports/qualificationReport/QualificationReport.jsx";
import EmployeeHeadCountReport from "./reports/employeeHeadCountReport/EmployeeHeadCountReport.jsx";
import NewlyJoinedEmployeeReport from "./reports/newlyJoinedEmployeeReport/NewlyJoinedEmployee.jsx";
import ConfirmationDueReport from "./reports/confirmationDueReport/ConfirmationDueReport.jsx";
import DepartmentWiseEmployeeCountReport from "./reports/departmentWiseEmployeeCountReport/DepartmentWiseEmployeeCountReport.jsx";
import LocationWiseEmployeeCountReport from "./reports/locationWiseEmployeeCountReport/LocationWiseEmployeeCountReport.jsx";
import OnboardedCandidatesDueForEmployeeConversion from "./reports/onboardedCandidatesDueForEmployeeConversion/OnboardedCandidatesDueForEmployeeConversion.jsx";
import ExitedEmployeeReport from "./reports/exitedEmployeeReport/ExitedEmployeeReport.jsx";
import DeclaredEmployeeReport from "./reports/declaredEmployeeReport/DeclaredEmployeeReport.jsx";
import POISubmissionReport from "./reports/poiSubmissionReport/POISubmissionReport.jsx";
import MediclaimEnrollmentReport from "./reports/mediclaimEnrollmentReport/MediclaimEnrollmentReport.jsx";
import CDLUserLogReport from "./reports/cdlUserLogReport/CDLUserLogReport.jsx";
import ERFDetailedStatusReport from "./reports/erfDetailedStatusReport/ERFDetailedStatusReport.jsx";
import NewCandidatesOnboardedReport from "./reports/newCandidatesOnboardedReport/NewCandidatesOnboardedReport.jsx";
import CandidatesConvertedToEmployeeReport from "./reports/candidatesConvertedToEmployeeReport/CandidatesConvertedToEmployeeReport.jsx";
import JobOpeningsListReport from "./reports/jobOpeningsListReport/JobOpeningsListReport.jsx";
import JobDetailStatusReport from "./reports/jobDetailStatusReport/JobDetailStatusReport.jsx";
import HelpdeskReports from "./reports/helpdeskReport/HelpdeskReport.jsx";
import InductionReports from "./reports/inductionReport/InductionReport.jsx";
import Document from "./documents/Document.jsx";
import NewRegimeSummary from "./itDecleration/NewRegimeSummary.jsx";
import Performance from "../src/performance/Performance.jsx"
import ManagerGoalConfigPerformance from "./performance/ManagerGoalConfigPerformance.jsx";
import AppraisalList from "./performance/pages/manager/AppraisalList.jsx";
import PredefinedGoals from "./performance/pages/manager/PredefinedGoals.jsx";
import AddGoal from "./performance/pages/manager/AddGoal.jsx";
import ManagerPredefinedGoals from "./performance/pages/manager/ManagerPredefinedGoals.jsx";
import AnnualGoal from "./performance/pages/manager/AnnualGoal.jsx";
import EmployeeAppraisal from "./performance/pages/employee/EmployeeAppraisal.jsx";
import AddSelfReview from "./performance/pages/employee/AddSelfReview.jsx";
import EmployeeAnnualReview from "./performance/pages/employee/EmployeeAnnualReview.jsx";
import AnnualReviewPreview from "./performance/pages/employee/AnnualReviewPreview.jsx";
import SelfAssessmentForm from "./performance/pages/employee/SelfAssessmentForm.jsx";
import SelfReviewPreview from "./performance/pages/employee/SelfReviewPreview.jsx";
import ManagerReview from "./performance/pages/manager/ManagerReview.jsx";
import ManagerReviewPreview from "./performance/pages/manager/ManagerReviewPreview.jsx";
import EmployeeFinalAcceptance from "./performance/pages/employee/EmployeeFinalAcceptance.jsx";
import Empdirectory from "./employeeDirectory/Empdirectory.jsx";
import ViewDetails from "./employeeDirectory/ViewDetails.jsx";
import ProbationEvaluation from "./employeeDirectory/ProbationEvaluation.jsx";
import ViewFeedback from "./employeeDirectory/ViewFeedback.jsx";
import ManagerSelfReviewPreview from "./performance/pages/manager/ManagerSelfReviewPreview.jsx";
import ManagerAnnualReview from "./performance/pages/manager/ManagerAnnualReview.jsx";
import AddBulkGoal from "./performance/pages/manager/AddBulkGoal.jsx";
import ManagerBulkPredefinedGoals from "./performance/pages/manager/ManagerBulkPredefinedGoals.jsx";
import EmployeeManagerReviewPreview from "./performance/pages/employee/EmployeeManagerReviewPreview.jsx";
import EmployeeAnnualSubmitToHr from "./performance/pages/employee/EmployeeAnnualSubmitToHr.jsx";
import ManagerAnnualReviewPreview from "./performance/pages/employee/ManagerAnnualReviewPreview.jsx";
import EditGoalCreation from "./performance/pages/employee/EditGoalCreation.jsx";
import EmployeeGoalPreview from "./performance/pages/employee/EmployeeGoalPreview.jsx";
import EmployeeGoalCreation from "./performance/pages/employee/EmployeeGoalCreation.jsx";
import ManagerApprovalQuarter from "./performance/pages/manager/ManagerApprovalQuarter.jsx";
import ManagerGoalPreview from "./performance/pages/manager/ManagerGoalPreview.jsx";
import ManagerReviewQuarter from "./performance/pages/manager/ManagerReviewQuarter.jsx";
import ManagerGoalFinalPreview from "./performance/pages/manager/ManagerGoalFinalPreview.jsx";
import StartSelfReview from "./performance/pages/employee/StartSelfReview.jsx";

function App() {
  return (
    <>
      <SearchProvider>
        <DateFilterProvider>
          <SortProvider>
            <TicketRefreshProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/view" element={<ViewDetailsPage />} />
                  <Route path="/Org2" element={<OrgChartContainer />} />
                  <Route path="/Org3" element={<OrganizationalChart />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/get-token" element={<GetToken />} />
                  <Route path="/select-mood" element={<MoodSelector />} />
                  <Route
                    path="/Dashboard"
                    element={
                      <PrivateRoutes
                        Component={Common}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/Org"
                    element={
                      <PrivateRoutes
                        Component={EmployeeHierarchy}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/Profile"
                    element={
                      <PrivateRoutes
                        Component={Profile}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "Admin",
                          "HR Payroll",
                        ]}
                      />
                    }
                  />
                  {/* <Route path="/signin" element={<PrivateRoutes Component={Helpdesk} requiredRoles={['CMS Employee', 'User', 'HR Payroll', 'Admin']} />} /> */}
                  <Route
                    path="/Contact"
                    element={
                      <PrivateRoutes
                        Component={ContactUs}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/mycms/documents"
                    element={
                      <PrivateRoutes
                        Component={Document}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/Corporate"
                    element={
                      <PrivateRoutes
                        Component={ContactUs}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/Employee"
                    element={
                      <PrivateRoutes
                        Component={Employees}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "Admin",
                          "CMS Employee",
                          "HR Payroll",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/attendance"
                    element={
                      <PrivateRoutes
                        Component={Attendance}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "Admin",
                          "CMS Employee",
                          "HR Payroll",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/employee/:email"
                    element={
                      <PrivateRoutes
                        Component={EmployeeDetail}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "Admin",
                          "CMS Employee",
                          "HR Payroll",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/Induction"
                    element={
                      <PrivateRoutes
                        Component={TrainingModules}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "Admin",
                          "CMS Employee",
                          "HR Payroll",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/mycms"
                    element={
                      <PrivateRoutes
                        Component={MyCMS}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "Admin",
                          "CMS Employee",
                          "HR Payroll",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/claimdashboard"
                    element={
                      <PrivateRoutes
                        Component={ClaimsDashBoard}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  {/* <Route path="/payslip" element={<PrivateRoutes Component={Payslip} requiredRoles={['CMS Employee', 'User', 'HR Payroll', 'Admin']} />} /> */}
                  <Route
                    path="/holiday"
                    element={
                      <PrivateRoutes
                        Component={HolidayList}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/employee-info-approval"
                    element={
                      <PrivateRoutes
                        Component={EmployeeInfoApproval}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                          "CMS Manager",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/team"
                    element={
                      <PrivateRoutes
                        Component={ManagerTeamOverview}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                          "CMS Manager",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/hotjobs"
                    element={
                      <PrivateRoutes
                        Component={HotJobs}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                          "CMS Manager",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/hr-escalation-matrix"
                    element={<HREscalationMatrix />}
                  />
                  <Route
                    path="/reports/compliance"
                    element={
                      <PrivateRoutes
                        Component={ComplianceReport}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                          "CMS Manager",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/mandatory-policy"
                    element={
                      <PrivateRoutes
                        Component={MandatoryPolicy}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                          "CMS Manager",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/admin-mediclaim"
                    element={
                      <PrivateRoutes
                        Component={AdminMediclaim}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                          "CMS Manager",
                        ]}
                      />
                    }
                  />
                  {/* ==========================================   Exit ================================================      */}
                  <Route
                    path="/manager_approval"
                    element={
                      <PrivateRoutes
                        Component={ManagerApproval}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/approvals/Exit%20Request"
                    element={
                      <PrivateRoutes
                        Component={MgrPendingReqDashboard}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/initiateExitByManager"
                    element={
                      <PrivateRoutes
                        Component={InitiateExitInManagerDashboard}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/MgrPendingHome"
                    element={
                      <PrivateRoutes
                        Component={MgrPendingReqHomePage}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/manager_approval"
                    element={
                      <PrivateRoutes
                        Component={ManagerApproval}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/approvals/:requestType"
                    element={
                      <PrivateRoutes
                        Component={MgrPendingReqDashboard}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/MgrPendingHome"
                    element={
                      <PrivateRoutes
                        Component={MgrPendingReqHomePage}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  {/* <Route path="/ExitForm" element={<PrivateRoutes Component={SelfExitForm} requiredRoles={['CMS Employee', 'User', 'HR Payroll', 'CMS Manager', 'Admin']} />} /> */}
                  <Route
                    path="/exit"
                    element={
                      <PrivateRoutes
                        Component={Exit}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  {/* <Route exact path="/request" element={<PrivateRoutes Component={ManagerDashBoardPendingExitForm} requiredRoles={['CMS Employee', 'User', 'HR Payroll', 'CMS Manager', 'Admin']} />} /> */}
                  <Route
                    path="/exitDashboard"
                    element={
                      <PrivateRoutes
                        Component={ExitDashBoard}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/workflowstatusTracker"
                    element={
                      <PrivateRoutes
                        Component={WorkflowStatusTracker}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/allpendingRequests"
                    element={
                      <PrivateRoutes
                        Component={PendingRequestForDepartmentMembers}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/Policies"
                    element={
                      <PrivateRoutes
                        Component={Policies}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/doc-viewer/:fileName/:docName/:view?"
                    element={
                      <PrivateRoutes
                        Component={DocumentViewer}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "Admin",
                          "HR Payroll",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/doc-viewerClaim/:docId"
                    element={<DocViewer />}
                  />
                  <Route
                    path="/doc-viewerExit/:docId"
                    element={<ExitDocViewer />}
                  />
                  <Route
                    path="/doc-viewerPass/:docId"
                    element={<DocViewerPassword />}
                  />
                  <Route
                    path="/hrdash"
                    element={
                      <PrivateRoutes
                        Component={MainExit}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route path="/fbrForm" element={<FlexiBenefitForm />} />
                  <Route
                    path="/exitDepartmentFNFLists"
                    element={
                      <PrivateRoutes
                        Component={ExitDepartmentFNFLists}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  {/* =============================================== IT DECLERATION ================================================ */}
                  <Route
                    path="/tax"
                    element={
                      <PrivateRoutes
                        Component={IT_Declaration}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/declaration-dashboard"
                    element={
                      <PrivateRoutes
                        Component={IT_Declaration_Display}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/select-regime"
                    element={
                      <PrivateRoutes
                        Component={Select_Regime}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/declaration-summary"
                    element={
                      <PrivateRoutes
                        Component={DeclarationSummary}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/new-summary"
                    element={
                      <PrivateRoutes
                        Component={NewRegimeSummary}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/declaration-update"
                    element={
                      <PrivateRoutes
                        Component={IT_Declaration_Update}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/preview"
                    element={
                      <PrivateRoutes
                        Component={IT_Declaration_Preview}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/display-proof-of-investment"
                    element={
                      <PrivateRoutes
                        Component={Proof_of_Investment_Display}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/preview-proof-of-investment"
                    element={
                      <PrivateRoutes
                        Component={Preview_Port_Of_Investment}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/proof-of-investment-update"
                    element={
                      <PrivateRoutes
                        Component={Proof_Attach}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  {/* <Route path="/admin"  element={<PrivateRoutes Component={ITAdmin}  requiredRoles={['CMS Employee', 'User','CMS Manager','HR Payroll','Admin']} />}></Route> */}
                  {/* <Route path="/exdp"  element={<PrivateRoutes Component={ExitStatusDisplay}  requiredRoles={['CMS Employee', 'User','CMS Manager','HR Payroll','Admin']} />}></Route> */}
                  <Route
                    path="/proof-of-investment-edit"
                    element={
                      <PrivateRoutes
                        Component={Proof_Of_Investment_Update}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/it-admin-status"
                    element={
                      <PrivateRoutes
                        Component={ITAdminStatus}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  {/* =================================================== RFP =================================================================================================== */}
                  <Route path="/app" element={<Layout />}>
                    <Route index element={<PTrace />} />
                    <Route path="pTrace" element={<PTrace />} />
                  </Route>
                  {/* =================================================== REPORTS =================================================================================================== */}
                  <Route path="/reports" element={<PrivateRoutes Component={report} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/mood-reports" element={<PrivateRoutes Component={MoodReports} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/recent-mood-reports" element={<PrivateRoutes Component={RecentReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/quator-wise-goal-report" element={<PrivateRoutes Component={QuatorWiseGoalReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/annual-goal-report" element={<PrivateRoutes Component={AnnualGoalReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/overall-goal-setting-report" element={<PrivateRoutes Component={OverallGoalSettingReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/performance-appraisal-report" element={<PrivateRoutes Component={PerformanceAppraisalReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/qualification-report" element={<PrivateRoutes Component={QualificationReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/employee-head-count-report" element={<PrivateRoutes Component={EmployeeHeadCountReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/newly-joined-employee-report" element={<PrivateRoutes Component={NewlyJoinedEmployeeReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/confirmation-due-report" element={<PrivateRoutes Component={ConfirmationDueReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/department-wise-employee-count-report" element={<PrivateRoutes Component={DepartmentWiseEmployeeCountReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/location-wise-employee-count-report" element={<PrivateRoutes Component={LocationWiseEmployeeCountReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/onboarded-candidates-due-for-employee-conversion" element={<PrivateRoutes Component={OnboardedCandidatesDueForEmployeeConversion} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/exited-employee-report" element={<PrivateRoutes Component={ExitedEmployeeReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/declared-employee-report" element={<PrivateRoutes Component={DeclaredEmployeeReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/poi-submission-report" element={<PrivateRoutes Component={POISubmissionReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/mediclaim-enrollment-report" element={<PrivateRoutes Component={MediclaimEnrollmentReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/cdl-user-log-report" element={<PrivateRoutes Component={CDLUserLogReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/erf-detailed-status-report" element={<PrivateRoutes Component={ERFDetailedStatusReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/new-candidates-onboarded-report" element={<PrivateRoutes Component={NewCandidatesOnboardedReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/candidates-converted-to-employee-report" element={<PrivateRoutes Component={CandidatesConvertedToEmployeeReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/job-openings-list-report" element={<PrivateRoutes Component={JobOpeningsListReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/job-detail-status-report" element={<PrivateRoutes Component={JobDetailStatusReport} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/helpdesk-report" element={<PrivateRoutes Component={HelpdeskReports} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  <Route path="/induction-report" element={<PrivateRoutes Component={InductionReports} requiredRoles={["CMS Employee", "User", "CMS Manager", "HR Payroll", "Admin"]} />} />
                  {/* ====================================================== All Events ======================================================================================================= */}
                  <Route
                    path="/birthday"
                    element={
                      <PrivateRoutes
                        Component={BirthdaySection}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/work-anniversary"
                    element={
                      <PrivateRoutes
                        Component={WorkAnniversarySection}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/events"
                    element={
                      <PrivateRoutes
                        Component={Events}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/orgStructure"
                    element={
                      <PrivateRoutes
                        Component={OrganizationChart}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/leadership"
                    element={
                      <PrivateRoutes
                        Component={Leadership}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/executive"
                    element={
                      <PrivateRoutes
                        Component={ExecutiveInsights}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/erf"
                    element={
                      <PrivateRoutes
                        Component={EmployeeRequisition}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/announcementDashboard"
                    element={
                      <PrivateRoutes
                        Component={AnnouncementDashboard}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/forms"
                    element={
                      <PrivateRoutes
                        Component={Forms}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/trending"
                    element={
                      <PrivateRoutes
                        Component={Trending}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/infohub"
                    element={
                      <PrivateRoutes
                        Component={InfoHub}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/kyc"
                    element={
                      <PrivateRoutes
                        Component={KycComponent}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/corporate-hub"
                    element={
                      <PrivateRoutes
                        Component={CorporateHub}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/cms-branding"
                    element={
                      <PrivateRoutes
                        Component={CMSbranding}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/cms-logo"
                    element={
                      <PrivateRoutes
                        Component={CMSLogo}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/cms-templates"
                    element={
                      <PrivateRoutes
                        Component={CMSTemplates}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/executive-insights-page"
                    element={
                      <PrivateRoutes
                        Component={ExecutiveInsightsPage}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/process-asset-library"
                    element={
                      <PrivateRoutes
                        Component={ProcessAssetLibrary}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/process-library"
                    element={<ProcessAssetLibrary />}
                  />
                  <Route
                    path="/process-library/:folderId"
                    element={<ProcessFolderView />}
                  />
                  <Route
                    path="/news/:type"
                    element={
                      <PrivateRoutes
                        Component={NewsFeedPage}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route path="/cdl-user-guide" element={<DocViewerPage />} />
                  <Route
                    path="/cms-boilerplate"
                    element={
                      <PrivateRoutes
                        Component={CMSBoilerplate}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/brand-guidelines"
                    element={<BrandGuidelines />}
                  />

                  <Route path="/blogs/create" element={<CreateBlog />} />
                  <Route path="/blogs/edit/:id" element={<EditBlog />} />
                  <Route
                    path="/manage-ideas"
                    element={
                      <PrivateRoutes
                        Component={ManageIdeasPage}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/reports"
                    element={
                      <PrivateRoutes
                        Component={AllReports}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/reports/mood"
                    element={
                      <PrivateRoutes
                        Component={MoodReport}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/manage-ideas/:id"
                    element={<ManageIdeasPage />}
                  />{" "}
                  {/* For editing existing ideas */}
                  <Route
                    path="/reports/dashboard"
                    element={<ReportsDashboard />}
                  />
                  <Route
                    path="/ReportDashboard"
                    element={
                      <PrivateRoutes
                        Component={ReportsDashboard}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/reports/induction"
                    element={
                      <PrivateRoutes
                        Component={InductionReport}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/women-leadership"
                    element={
                      <PrivateRoutes
                        Component={WomenLeadership}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  {/* =============================================================== Quiz App ================================================================================================================ */}
                  <Route path="/admin" element={<QuestionBankAdd />} />
                  {/* <Route path="/register" element={<Register />} /> */}
                  <Route path="/user" element={<UserQuizManagement />} />
                  <Route path="/quiz" element={<QuizPlay />} />
                  <Route path="/quiz/result" element={<QuizResult />} />
                  <Route
                    path="/admin/question-bank"
                    element={<QuestionBank />}
                  />
                  <Route
                    path="/admin/generate-quiz"
                    element={<QuizGenerator />}
                  />
                  <Route path="/userQuiz" element={<QuizManagement />} />
                  <Route path="/admin/category" element={<Category />} />
                  <Route
                    path="/admin/manage-quiz"
                    element={<QuizManagement />}
                  />
                  <Route
                    path="/admin/validate-answer"
                    element={<ShowUserResponse />}
                  />
                  {/*  ==============================================================Survey App ================================================================================================================ */}
                  {/* <Route path="/survey" element={<Navbar/>} /> */}
                  <Route path="/survey" element={<SurveyList />} />
                  <Route path="/survey-builder" element={<SurveyScreen />} />
                  <Route path="/user-group" element={<UserGroup />} />
                  <Route path="/category" element={<Categorys />} />
                  {/* ===================================================================Employee Directory=================================================================================================================== */}
                  <Route
                    path="/employeeDirectory"
                    element={
                      <PrivateRoutes
                        Component={Empdirectory}
                        requiredRoles={[
                          "CMS Manager",
                          "HR Payroll",
                          "CMS Employee",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/Committees"
                    element={
                      <PrivateRoutes
                        Component={Committee}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/committee1"
                    element={
                      <PrivateRoutes
                        Component={HappitudeCommittee}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  ></Route>
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/blogs/:id" element={<BlogPost />} />
                  <Route path="/social-corner" element={<SocialCorner />} />
                  {/* ========================================================================= HR Help Desk =============================================================================================================================== */}
                  <Route
                    path="/help-desk"
                    element={
                      <PrivateRoutes
                        Component={Helpdesk}
                        requiredRoles={["CMS Employee", "User", "Admin"]}
                      />
                    }
                  >
                    <Route index element={<CreateRequest />} />
                    <Route path="dashboard" element={<DashboardHR />} />
                    <Route path="my-tickets" element={<MyTickets />} />
                    <Route
                      path="assigned-tickets"
                      element={<AssignedTickets />}
                    />
                    <Route path="create-request" element={<CreateRequest />} />
                    <Route path="team-tickets" element={<MyTeamTickets />} />
                    <Route path="report" element={<HelpdeskReport />} />
                  </Route>
                  <Route
                    path="/it-helpdesk"
                    element={<PublicCreateTicketForm />}
                  />
                  {/* ================================================================================= e-pms ==================================== */}
                  <Route
                    path="/e-pms"
                    element={
                      <PrivateRoutes
                        Component={ProfileInfonfoFile}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Employee",
                          "Admin",
                          "HR Payroll",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/SelfAppraisel"
                    element={
                      <PrivateRoutes
                        Component={SelfAppraisel}
                        requiredRoles={["CMS Employee", "User", "Admin"]}
                      />
                    }
                  />
                  {/* <Route path="/managerView" element={<PrivateRoutes Component={ManagerView} requiredRoles={['Manager']} />} /> */}
                  <Route
                    path="/open"
                    element={
                      <PrivateRoutes
                        Component={Open}
                        requiredRoles={["CMS Employee", "User", "Admin"]}
                      />
                    }
                  />
                  <Route
                    path="/pendingMgrReview"
                    element={
                      <PrivateRoutes
                        Component={PendingAppraisal}
                        requiredRoles={["CMS Employee", "User", "Admin"]}
                      />
                    }
                  ></Route>
                  <Route
                    path="/ManagerScreen"
                    element={
                      <PrivateRoutes
                        Component={ManagerScreen}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/ManagerScreen2"
                    element={
                      <PrivateRoutes
                        Component={ManagerScreen2}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/RouteToMgrView"
                    element={
                      <PrivateRoutes
                        Component={RouteToMgrView}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/MangerReview"
                    element={
                      <PrivateRoutes
                        Component={MangerReview}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  {/* <Route path="/managerView" element={<ManagerView />} /> */}
                  <Route
                    path="/managerView"
                    element={
                      <PrivateRoutes
                        Component={ManagerView}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/attendanceapproval"
                    element={
                      <PrivateRoutes
                        Component={AttendancePendingRequests}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/reimburementReq"
                    element={
                      <PrivateRoutes
                        Component={ReimbursementMgrPendingDashboard}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/advreimburementReq"
                    element={
                      <PrivateRoutes
                        Component={AdvanceClaimsMgrPendingDashboard}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/mgrExitPendingRequest"
                    element={
                      <PrivateRoutes
                        Component={ManagerDashBoardPendingExitForm}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/myApprovals"
                    element={
                      <PrivateRoutes
                        Component={MyApprovals}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                          "CMS Manager",
                        ]}
                      />
                    }
                  />
                  {/* ====================================================OTP Based ============================================================================================= */}
                  <Route
                    path="/payslip"
                    element={
                      <PrivateRoutes
                        Component={Payslip}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/tax"
                    element={
                      <PrivateRoutes
                        Component={IT_Declaration}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/payslip-upload"
                    element={
                      <PrivateRoutes
                        Component={UploadPayslipForm16}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "CMS Manager",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/form16"
                    element={
                      <PrivateRoutes
                        Component={Form16}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "Admin",
                        ]}
                      />
                    }
                  />
                  <Route
                    path="/ExitForm"
                    element={
                      <PrivateRoutes
                        Component={SelfExitForm}
                        requiredRoles={[
                          "CMS Employee",
                          "User",
                          "HR Payroll",
                          "CMS Manager",
                          "Admin",
                        ]}
                      />
                    }
                  />

                  {/* EPMS STARTS*/}
                  <Route path="/Performance" element={<PrivateRoutes Component={Performance} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/ManagerGoalConfigPerformance" element={<PrivateRoutes Component={ManagerGoalConfigPerformance} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/AppraisalList" element={<PrivateRoutes Component={AppraisalList} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/appraisal-details/:empId" element={<PrivateRoutes Component={PredefinedGoals} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/goals/predefined/add/:empId" element={<PrivateRoutes Component={AddGoal} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/annual-goals/:empId" element={<PrivateRoutes Component={AnnualGoal} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/predefined-goals/:empId" element={<PrivateRoutes Component={ManagerPredefinedGoals} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/EmployeeAppraisal" element={<PrivateRoutes Component={EmployeeAppraisal} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/appraisal/self-review/:employeeId" element={<PrivateRoutes Component={AddSelfReview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/annual-review/:employeeId" element={<PrivateRoutes Component={EmployeeAnnualReview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/annual-review/preview/:employeeId" element={<PrivateRoutes Component={AnnualReviewPreview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/self-review/form/:quarter" element={<PrivateRoutes Component={SelfAssessmentForm} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/appraisal/preview/:employeeId" element={<PrivateRoutes Component={SelfReviewPreview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/assessment/add/:employeeId" element={<PrivateRoutes Component={ManagerReview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/review/preview/:employeeId" element={<PrivateRoutes Component={ManagerReviewPreview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/appraisal/acceptance/:employeeId" element={<PrivateRoutes Component={EmployeeFinalAcceptance} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/self-review/preview/:empId" element={<PrivateRoutes Component={ManagerSelfReviewPreview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/annual-review/:empId" element={<PrivateRoutes Component={ManagerAnnualReview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/bulk-add-goals/:quarter" element={<PrivateRoutes Component={AddBulkGoal} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/bulk-predefined-goals/:quarter" element={<PrivateRoutes Component={ManagerBulkPredefinedGoals} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/manager-review/preview/:empId" element={<PrivateRoutes Component={EmployeeManagerReviewPreview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/annual-review/submit-to-hr/:empId" element={<PrivateRoutes Component={EmployeeAnnualSubmitToHr} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/annual-review/preview/:empId" element={<PrivateRoutes Component={ManagerAnnualReviewPreview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/goal/create/:empId" element={<PrivateRoutes Component={EmployeeGoalCreation} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/goal/approve/:empId" element={<PrivateRoutes Component={ManagerApprovalQuarter} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/goal/preview/:empId" element={<PrivateRoutes Component={ManagerGoalPreview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/employee/goal/self-review/:empId" element={<PrivateRoutes Component={StartSelfReview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/manager/goal/final-review/:empId" element={<PrivateRoutes Component={ManagerReviewQuarter} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin"]} />} />
                  <Route path="/manager/goal/final-review-preview/:empId" element={<PrivateRoutes Component={ManagerGoalFinalPreview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin"]} />} />
                  <Route path="/employee/goal/edit/:empId" element={<PrivateRoutes Component={EditGoalCreation} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin"]} />} />
                  <Route path="/employee/goal/preview/:empId" element={<PrivateRoutes Component={EmployeeGoalPreview} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin"]} />} />
                  {/* EPMS ENDS */}

                  <Route path="/view-details/:empCode" element={<PrivateRoutes Component={ViewDetails} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/probation-evaluation/:empCode" element={<PrivateRoutes Component={ProbationEvaluation} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />
                  <Route path="/view-feedback/:empCode/:extensionNumber/:threeId/:sixId" element={<PrivateRoutes Component={ViewFeedback} requiredRoles={["CMS Employee", "User", "HR Payroll", "CMS Manager", "Admin",]} />} />

                </Routes>
              </BrowserRouter>
            </TicketRefreshProvider>
          </SortProvider>
        </DateFilterProvider>
      </SearchProvider>
      <ToastContainer />
      <Footer />
    </>
  );
}

export default App;
