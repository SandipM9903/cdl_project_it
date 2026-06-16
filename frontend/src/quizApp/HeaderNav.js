import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const HeaderNav = () => {
  const navigate = useNavigate();
  const usernameOrEmail = localStorage.getItem("firstName");


  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="">

        <div className="flex justify-between h-16">
      
          <div className="flex items-center p-4  space-x-4">
            
            <NavLink to="/admin/category">Category</NavLink>
            {/* <NavLink to="/admin">Add Question</NavLink> */}
            <NavLink to="/admin/question-bank">Question Bank</NavLink>
            {/* <NavLink to="/admin/generate-quiz">Generate Quiz</NavLink> */}
            <NavLink to="/admin/manage-quiz">Quizzes</NavLink>
            {/* <NavLink to="/admin/validate-answer">Show User Response Quiz</NavLink> */}
          </div>
          <div className="flex items-center p-4">
            {usernameOrEmail && (
              <span className="text-white">Welcome, {usernameOrEmail}!</span>
            )}
            
        
          </div>
        </div>
      </div>
    </nav>
  );
};

// const NavLink = ({ to, children }) => (
//   <Link
//     to={to}
//     className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
//   >
//     {children}
//   </Link>
// );

const NavLink = ({ to, children }) => {
  const location = useLocation();

  const isActive = location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={` px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? "bg-slate-100 text-black hover:bg-slate-50" : "text-white hover:bg-gray-700"
      }`}
    >
      {children}
    </Link>
  );
};







// import React from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export const HeaderNav = ({ usernameOrEmail }) => {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     // Perform logout actions
//     navigate("/");
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="collapse navbar-collapse" id="navbarNav">
//         <ul className="navbar-nav">
//           <li className="nav-item">
//             <Link className="nav-link" to="/admin">
//               Add Question
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/admin/question-bank">
//               Show Question
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/admin/generate-quiz">
//               Generate Quiz
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/admin/validate-answer">
//               Show User Response Quiz
//             </Link>
//           </li>

//           <li className="nav-item">
//             {usernameOrEmail && <span className="nav-link">Welcome, {usernameOrEmail}!</span>}
//           </li>
//         </ul>
//         <button className="btn btn-outline-light" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };
