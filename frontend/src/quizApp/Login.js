import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "./3188416.jpg";
import { jwtDecode } from "jwt-decode";
import InvalidCredentialsPopup from "./Component/InvalidCredentialsPopup";
import LoginSuccessPopup from "./Component/LoginSuccessPopup";
import SlidingScreen from "./pages/login/SlidingScreen";

const Login = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showInvalidCredentialsPopup, setShowInvalidCredentialsPopup] = useState(false);
  const [showLoginSuccessPopup, setShowLoginSuccessPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const handleChange1 = (e) => {
    const value = e.target.value;
    setUsernameOrEmail(value);
    // Custom validation for username or email
    if (!value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        usernameOrEmail: "Email is required",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, usernameOrEmail: "" }));
    }
  };
  const handelRegister = () => {
    navigate("/register");
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Custom validation for password
    if (value.length < 5) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 5 characters",
      }));
    } else if (value.length > 12) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be less than 12 characters",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  const handleCloseInvalidCredentialsPopup = () => {
    setShowInvalidCredentialsPopup(false);
  };

  const handleCloseLoginSuccessPopup = () => {
    setShowLoginSuccessPopup(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Reset errors
    setErrors({});

    // Custom validation for both fields
    const errors = {};
    if (!usernameOrEmail.trim()) {
      errors.usernameOrEmail = "Email is required";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    }

    // If there are errors, display them and prevent form submission
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8085/api/auth/login",
        {
          usernameOrEmail,
          password,
        }
      );

      console.log("Response data:", response.data); // Log the response data

      const { accessToken } = response.data;

      console.log("Token:", accessToken); // Log the token value

      // Ensure the token is always a string
      const convertedToken = String(accessToken || "");

      const decodedToken = jwtDecode(convertedToken);

      // Get role from the decoded token
      const role = decodedToken.authorities[0]; // Assuming role is an array with a single role

      // Store token and role in local storage
      localStorage.setItem("token", convertedToken);
      localStorage.setItem("role", role);

      setShowLoginSuccessPopup(true);
      setTimeout(() => {
        setShowLoginSuccessPopup(false);
        if (role === "ROLE_ADMIN") {
          // navigate("/admin");
          navigate("/admin/question-bank", {
            state: { usernameOrEmail: usernameOrEmail },
          });
        } else if (role === "ROLE_USER") {
          // Redirect to the user page
          navigate("/admin/manage-quiz", {
            state: { usernameOrEmail: usernameOrEmail },
          });
          // navigate("/user");
          setError("User logged");
        } else {
          setError("Invalid credentials");
        }
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error.message);
      setShowInvalidCredentialsPopup(true);
      setTimeout(() => {
        setShowInvalidCredentialsPopup(false);
      }, 1000);
    }
  };

  const [isSlidingScreenOpen, setSlidingScreenOpen] = useState(false);
  const [slidingScreenNo, setSlidingScreenNo] = useState(1);
  const toggleSlidingScreen = (no) => {
    setSlidingScreenNo(no);
    setSlidingScreenOpen(!isSlidingScreenOpen);
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="flex justify-center h-16">
          <div className="flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Bureau_of_Indian_Standards_Logo.svg/640px-Bureau_of_Indian_Standards_Logo.svg.png"
              alt="Logo"
              className="h-10 ml-1 mr-2 rounded-lg  bg-white"
            />
            <h5 className="text-white ">Bureau of Indian Standards</h5>
          </div>
        </div>
      </nav>
      {/* https://i.pinimg.com/736x/d6/70/99/d670990fa86f31233a53a22d7bb2f4bc.jpg */}
      <div
        className="min-h-screen bg-cover bg-center flex justify-center items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.93), rgba(255, 255, 255, .85)), url(https://www.shutterstock.com/image-vector/horizontal-banner-hands-people-solving-260nw-1049759054.jpg)`,
        }}
      >
        <div className="w-full max-w-md p-8 bg-blue-500 bg-opacity-60 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-blue-800 mb-4">
            Welcome to Quiz
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="usernameOrEmail"
                value={usernameOrEmail}
                onChange={handleChange1}
                className={`w-full px-4 py-2 rounded-md bg-white bg-opacity-65 border border-gray-300 focus:outline-none focus:border-blue-500 text-blue-500 ${
                  errors.usernameOrEmail && "border-red-500"
                }`}
                placeholder="Email"
                required
              />
              {errors.usernameOrEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.usernameOrEmail}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md bg-white bg-opacity-65 border border-gray-300 focus:outline-none focus:border-blue-500 text-blue-500 ${
                  errors.password && "border-red-500"
                }`}
                placeholder="Password"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div className="flex">
              <button
                type="submit"
                className="flex-1 mr-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
              <button
                type="button"
                className="flex-1 ml-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handelRegister}
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <a href="https://www.example.com" className="text-blue-700">
              Forgot Password?
            </a>
          </div>
          <div>
            <button
              className="fixed bottom-16 right-4 bg-indigo-400 text-white px-2 py-1 rounded-full text-sm"
              onClick={() => toggleSlidingScreen(1)}
            >
              1
            </button>
            <button
              className="fixed bottom-24 right-4 bg-indigo-300 text-white px-2 py-1 rounded-full text-sm"
              onClick={() => toggleSlidingScreen(2)}
            >
              2
            </button>
            <button
              className="fixed bottom-32 right-4 bg-indigo-400 text-white px-2 py-1 rounded-full text-sm"
              onClick={() => toggleSlidingScreen(3)}
            >
              3
            </button>
            <button
              className="fixed bottom-40 right-4 bg-indigo-300 text-white px-2 py-1 rounded-full text-sm"
              onClick={() => toggleSlidingScreen(4)}
            >
              4
            </button>
            {/* <button className="fixed bottom-48 right-4 bg-indigo-400 text-white px-2 py-1 rounded-full text-sm" onClick={() => toggleSlidingScreen(5)}>
    5
  </button> */}
          </div>
        </div>
      </div>
      <SlidingScreen
        isOpen={isSlidingScreenOpen}
        onClose={toggleSlidingScreen}
        slideNo={slidingScreenNo}
      />
    </div>
  );
};

export default Login;
