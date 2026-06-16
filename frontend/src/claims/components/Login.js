import React, { useState } from "react";
import { AiOutlineUser, AiOutlineUnlock } from "react-icons/ai";
import human from "../Images/istockphoto-1288129985-612x612.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginSuccessPopup from "./LoginSuccessPopup";
import InvalidCredentialsPopup from "./InvalidCredentialsPopup";
import myImage from '/people-meeting-seminar-office-concept.jpg';
import { BASE_URL } from "../../config/Config";
const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showInvalidCredentialsPopup, setShowInvalidCredentialsPopup] =
    useState(false);
  const [showLoginSuccessPopup, setShowLoginSuccessPopup] = useState(false);
  const handleChange1 = (e) => {
    setUserId(e.target.value);
  };
  const handleChange = (e) => {
    setPassword(e.target.value);
  };
  const handleCloseInvalidCredentialsPopup = () => {
    setShowInvalidCredentialsPopup(false);
  };
  const handleCloseLoginSuccessPopup = () => {
    setShowLoginSuccessPopup(false);
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}:9028/api/workflow/loginuser/${userId}/${password}`
      );
      // Assign value to a key
      console.error("Login Response:", response.data.userId);
      sessionStorage.setItem("UserId", response.data.userId);
      sessionStorage.setItem("wfLevelName", response.data.wfLevelName);
      // sessionStorage.setItem('Password', response.data.password);
      setShowLoginSuccessPopup(true);
      setTimeout(() => {
        setShowLoginSuccessPopup(false);
       // navigate("/Claimhomepage");
         navigate("/mgrApprovalReqPage");
       
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error.message);
      setShowInvalidCredentialsPopup(true);
      setTimeout(() => {
        setShowInvalidCredentialsPopup(false);
      }, 1000);
    }
  };
  return (
    <div className="bg-gray-800 bg-blend-multiply bg-center bg-no-repeat bg-cover relative">
      {/* Brand Image */}
      <div className="bg-gray-600 bg-blend-multiply bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${myImage})` }}>
      <div className="flex justify-center items-center h-screen">
          {/* Left Div */}
          <div className="w-1/2 text-center ">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-7xl font-sans">
              Welcome Back
            </h1>
            <p className="mb-8 text-lg font-bold text-gray-300 lg:text-2xl sm:px-16 lg:px-49">
              To keep connected with{" "}
              <span className="text-red-500">CMS Digital Lounge</span>, please
              login with your Email and Password
            </p>
          </div>
          {/* Right Div */}
          <div className="w-1/3 rounded overflow-hidden bg-gray-400 bg-opacity-60 p-6 shadow-2xl">
            <div className="flex justify-center items-center">
              <span className="">
                <img
                  src={human}
                  alt="Count Icon 1"
                  className="rounded-full  w-16 h-16 mb-4"
                />
              </span>
            </div>
            <form>
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="usernameOrEmail"
                  onChange={handleChange1}
                  className="block w-full shadow-2xl p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                  placeholder="Emp Code"
                  required
                />
                <AiOutlineUser
                  size={24}
                  color="black"
                  className="absolute top-2 left-2 text-gray-500 dark:text-white"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  className="block w-full shadow-2xl p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                  placeholder="Enter Your Password"
                  required
                />
                <AiOutlineUnlock
                  size={24}
                  color="black"
                  className="absolute top-2 left-2 text-gray-500 dark:text-white"
                />
              </div>
              <a href="https://www.example.com" className="text-white">
                Forgot Password ?
              </a>
            </form>
            <button
              className="text-white mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-blue-700 dark:focus:ring-green-600"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </div>
        {showInvalidCredentialsPopup && (
          <InvalidCredentialsPopup
            onClose={handleCloseInvalidCredentialsPopup}
          />
        )}
        {showLoginSuccessPopup && (
          <LoginSuccessPopup onClose={handleCloseLoginSuccessPopup} />
        )}
      </div>
    </div>
  );
};
export default Login;
