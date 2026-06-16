import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../3188416.jpg";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    roles: [{ name: "ROLE_USER" }],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  

    try {
        const response = await axios.post(
          "http://localhost:8085/api/auth/register",
          user // Pass user directly
        );

      console.log("Response data:", response.data); // Log the response data
        alert("Registration Success")
      // Redirect to login page after successful registration
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error.message);
      // Handle error
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md p-8 bg-gray-700 bg-opacity-70 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white mb-4">
          Register
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white bg-opacity-25 border border-gray-300 focus:outline-none focus:border-blue-500 text-white"
              placeholder="Name"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white bg-opacity-25 border border-gray-300 focus:outline-none focus:border-blue-500 text-white"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white bg-opacity-25 border border-gray-300 focus:outline-none focus:border-blue-500 text-white"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white bg-opacity-25 border border-gray-300 focus:outline-none focus:border-blue-500 text-white"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-white">
            Already have an account?{" "}
            <a href="/" className="text-blue-500">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;