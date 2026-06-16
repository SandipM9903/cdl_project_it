import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const UserHeaderNav = ({ usernameOrEmail }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="navbar-collapse h-12">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Bureau_of_Indian_Standards_Logo.svg/640px-Bureau_of_Indian_Standards_Logo.svg.png" alt="Logo" className="h-10 ml-1 mr-2 rounded-lg  bg-white" />
      <h5 className="text-white ">
              Bureau of Indian Standards
            </h5>
      </div>

      <div className="navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item ">
            {usernameOrEmail && (
              <span className="nav-link text-black">
                Welcome, {usernameOrEmail}!
              </span>
            )}
          </li>
          <li className="nav-item ">
            <NavLink to="/userQuiz">Quizzes</NavLink>
          </li>
        </ul>
        <button className=" ml-2 mr-2 btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {/* </div> */}
    </nav>
  );
};

export default UserHeaderNav;
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
  >
    {children}
  </Link>
);
