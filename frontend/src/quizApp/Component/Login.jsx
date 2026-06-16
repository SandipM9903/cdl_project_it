import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InvalidCredentialsPopup from "./InvalidCredentialsPopup";
import LoginSuccessPopup from "./LoginSuccessPopup";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showInvalidCredentialsPopup, setShowInvalidCredentialsPopup] =
    useState(false);
  const [showLoginSuccessPopup, setShowLoginSuccessPopup] = useState(false);
  const [errors, setErrors] = useState({});

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

        // Redirect to admin dashboard if role is admin
        if (role === "ROLE_ADMIN") {
          navigate("/admin-dashboard");
        } else {
          // Redirect to user dashboard if role is user
          navigate("/user-dashboard");
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
  //   const handleSubmit = async (e) => {
  //     e.preventDefault(); // Prevent default form submission

  //     // Reset errors
  //     setErrors({});

  //     // Custom validation for both fields
  //     const errors = {};
  //     if (!usernameOrEmail.trim()) {
  //       errors.usernameOrEmail = "Email is required";
  //     }
  //     if (!password.trim()) {
  //       errors.password = "Password is required";
  //     }

  //     // If there are errors, display them and prevent form submission
  //     if (Object.keys(errors).length > 0) {
  //       setErrors(errors);
  //       return;
  //     }

  //     try {
  //       const response = await axios.post(
  //         "http://localhost:8085/api/auth/login",
  //         {
  //           usernameOrEmail,
  //           password,
  //         }
  //       );

  //       const { token, role } = response.data;

  //       // Store token and role in local storage
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("role", role);

  //       setShowLoginSuccessPopup(true);
  //       setTimeout(() => {
  //         setShowLoginSuccessPopup(false);

  //         // Redirect to admin dashboard if role is admin
  //         if (role === "admin") {
  //           navigate("/admin-dashboard");
  //         } else {
  //           // Redirect to user dashboard if role is user
  //           navigate("/user-dashboard");
  //         }
  //       }, 1000);
  //     } catch (error) {
  //       console.error("Login failed:", error.message);
  //       setShowInvalidCredentialsPopup(true);
  //       setTimeout(() => {
  //         setShowInvalidCredentialsPopup(false);
  //       }, 1000);
  //     }
  //   };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: `url('https://png.pngtree.com/thumb_back/fh260/background/20220922/pngtree-quiz-against-green-chalkboard-apple-test-text-photo-image_19906110.jpg')`,
      }}
    >
      <div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white mb-4">
          Login
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="usernameOrEmail"
              value={usernameOrEmail}
              onChange={handleChange1}
              className={`w-full px-4 py-2 rounded-md bg-white bg-opacity-25 border border-gray-300 focus:outline-none focus:border-blue-500 text-white ${
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
              className={`w-full px-4 py-2 rounded-md bg-white bg-opacity-25 border border-gray-300 focus:outline-none focus:border-blue-500 text-white ${
                errors.password && "border-red-500"
              }`}
              placeholder="Password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="https://www.example.com" className="text-blue-500">
            Forgot Password?
          </a>
        </div>
      </div>

      {showInvalidCredentialsPopup && (
        <InvalidCredentialsPopup onClose={handleCloseInvalidCredentialsPopup} />
      )}
      {showLoginSuccessPopup && (
        <LoginSuccessPopup onClose={handleCloseLoginSuccessPopup} />
      )}
    </div>
  );
};

export default Login;
