import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // ✅ Added useSearchParams
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useAuth from "../loginConfig/hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "./Config";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';



// ✅ AES CONFIG (MUST MATCH SPRING BOOT KEY)
const AES_KEY_BASE64 = "75Q2ykXsiKcAnooOXdT6L8m7JAysFCvzHqNQjs+euTU=";

// ✅ COOKIE BASE NAME (PLAIN — WILL BE HASHED)
const EMP_CODE_PLAIN_NAME = "emp_code";

// ✅ BASE64 ↔ BYTE UTILS
const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
};

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

// ✅ AES KEY IMPORT
const importAesKey = async (base64Key) => {
  const rawKey = base64ToArrayBuffer(base64Key);
  return crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["encrypt"]);
};

// ✅ ENCRYPT FUNCTION
const encryptEmpCode = async (plainText) => {
  const key = await importAesKey(AES_KEY_BASE64);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedText = new TextEncoder().encode(plainText);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedText
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return arrayBufferToBase64(combined.buffer);
};

// ✅ SET COOKIE
const setEncryptedCookie = (name, value) => {
  const isHttps = window.location.protocol === "https:";
  document.cookie = `${name}=${value}; path=/; max-age=604800; ${
    isHttps ? "Secure;" : ""
  } SameSite=Lax`;
};



// ✅ HASH COOKIE NAME
const hashCookieName = async (name) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(name);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return arrayBufferToBase64(hashBuffer).replace(/=/g, "").substring(0, 32);
};



const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // ✅ Added
  const redirect = searchParams.get("redirect") || "/select-mood"; // ✅ Added

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { user, loading, error, login } = useAuth();
const [hashedCookieKey, setHashedCookieKey] = useState("");
  const clientId = "microsoft_client";
  const authUrl = "https://43.205.24.208:9000/realms/microsoft/protocol/openid-connect/auth";
  const redirectUri = `${BASE_URL}:9000/get-token`;

  const handleAuth = () => {
    const url = `${authUrl}?response_type=code&client_id=${clientId}`;
    window.location.href = url;
  };


    // ✅ Generate hashed cookie key ONLY ONCE
  useEffect(() => {
    const generateCookieKey = async () => {
      const key = await hashCookieName(EMP_CODE_PLAIN_NAME);
      setHashedCookieKey(key);
      console.log("🔐 Hashed Cookie Key:", key);
    };
    generateCookieKey();
  }, []);


  const preloadKeycloakSSL = async () => {
    try {
      await fetch("https://43.205.24.208:9000/realms/cdl", {
        method: "GET",
        mode: "no-cors",
      });
    } catch {}
  };

  const handleLogin = async () => {
    await preloadKeycloakSSL();

    try {
   const response = await fetch(
      `https://43.205.24.208:9000/realms/cdl/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "password",
          client_id: "cdl_client",
          client_secret: "yreZEcFSdZxFr6iKjssgVcvqX2PhnQlU",
          username: email,
          password,
          scope: "openid profile email",
        }),
      }
    ); 

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      sessionStorage.setItem("accessToken", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  };

  useEffect(() => {
    const autoLogin = async () => {
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");

      if (email && password) {
        try {
          await handleLogin(email, password);
        } catch (error) {
          console.error("Silent authentication failed:", error);
        }
      }
    };

    autoLogin();
  }, []);

  const fetchEmpByEmail = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const email = localStorage.getItem("email");

      const response = await axios.get(`${BASE_URL}:9020/employee/by/email/${email}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const employeeData = response?.data;

      const roleNames =
        employeeData?.userDTO?.userRoleResDTOS?.map((roleObj) => roleObj.roleResDTO?.name) || [];

      const locationId = employeeData?.userDTO?.locationResDTO?.locationId || "";

      const employeeName =
        employeeData?.empResDTO?.firstName ||
        employeeData?.fileAndObjectTypeBean?.empResDTO?.firstName ||
        employeeData?.userDTO?.firstName ||
        "";

      const employeeFullName =
        employeeData?.empResDTO?.fullNameAsAadhaar ||
        employeeData?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar ||
        employeeData?.userDTO?.fullNameAsAadhaar ||
        "";

      const empId =
        employeeData?.fileAndObjectTypeBean?.empResDTO?.empCode ||
        employeeData?.empResDTO?.empCode ||
        "";

      const profileImage = employeeData?.empResDTO?.profileImage || "default_profile.png";

      const contactNumber =
        employeeData?.fileAndObjectTypeBean?.empResDTO?.primaryContactNo || "Not Available";

      sessionStorage.setItem("primaryContactNo", contactNumber);
      sessionStorage.setItem("role", JSON.stringify(roleNames));
      sessionStorage.setItem("locationId", locationId);

      if (employeeName) {
        localStorage.setItem("EmployeeName", employeeName);
        localStorage.setItem("firstName", employeeName);
        setFirstName(employeeName);
      }
         // ✅ ENCRYPTED STORAGE WITH HASHED KEY
    if (hashedCookieKey) {
      const encryptedEmpCode = await encryptEmpCode(empId.toString());
      setEncryptedCookie(hashedCookieKey, encryptedEmpCode);
      //alert(`Encrypted EmpCode stored in cookie with key: ${hashedCookieKey}`);
      localStorage.setItem("km_token", encryptedEmpCode);
    }
      

      localStorage.setItem("EmployeeFullName", employeeFullName);
      localStorage.setItem("ProfileImage", profileImage);
      localStorage.setItem("empId", empId);

      if (
        roleNames.includes("CMS Employee") ||
        roleNames.includes("User") ||
        roleNames.includes("Admin") ||
        roleNames.includes("HR Payroll")
      ) {
        navigate(redirect); // ✅ Redirect to original path
      }

      return { employeeName, profileImage };
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = {};
    if (!email.trim()) validationErrors.email = "Email is required";
    if (!password.trim()) validationErrors.password = "Password is required";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const accessToken = await handleLogin();
      if (!accessToken) throw new Error("No access token received");

      const decodedToken = jwtDecode(accessToken);

      const tokenFirstName = decodedToken?.given_name || "";
      const tokenLastName = decodedToken?.family_name || "";

      sessionStorage.setItem("token", accessToken);
      localStorage.setItem("email", email);

      if (tokenFirstName) {
        localStorage.setItem("firstName", tokenFirstName);
        setFirstName(tokenFirstName);
      }

      if (tokenLastName) {
        localStorage.setItem("lastName", tokenLastName);
        setLastName(tokenLastName);
      }

      const { employeeName, profileImage } = await fetchEmpByEmail();

      if (!tokenFirstName && employeeName) {
        localStorage.setItem("firstName", employeeName);
        setFirstName(employeeName);
      }

      toast.success("Login Successful 🎉", {
        position: "top-right",
        autoClose: 3000,
      });

      // ✅ Final fallback redirect (just in case)
      navigate(redirect);

    } catch (error) {
      toast.error("Invalid Credentials. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
    return (
      <><div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex w-[900px] overflow-hidden">
        {/* Left Side - Login Form */}
        <div className="w-1/2 p-10">
          {/* Logo */}
          <div className="flex justify-start">
            <img src={require("../assets/CMS-logo.png")} alt="Logo" className="w-25 h-15" />
          </div>

          {/* Email Input */}
          <label className="block text-gray-600 text-sm font-semibold mt-6">
            EMAIL
          </label>
          <input
            type="email"
            defaultValue="@cms.co.in"
            className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 p-2 mt-1 font-content"

            name="email"
            onChange={(e) => setEmail(e.target.value)} />

          {/* Password Input */}
          <label className="block text-gray-600 text-sm font-semibold mt-6">

            PASSWORD
          </label>
          {/* Password Input */}

          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              defaultValue="********"
              className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 p-2 mt-1 font-content"
              onChange={(e) => setPassword(e.target.value)} />
            {/* Password Visibility Toggle Icon */}
            <div
              className="absolute right-3 top-2 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <AiOutlineEyeInvisible className="text-gray-600 h-6 w-6" />
              ) : (
                <AiOutlineEye className="text-gray-600 h-6 w-6" />
              )}
            </div>
          </div>


          {/* Remember Me Checkbox */}
          <div className="flex items-center mt-4">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-500 text-sm">Remember Me</span>
          </div>

          {/* Buttons */}
        <form onSubmit={handleSubmit}>
  <div className="flex space-x-4 mt-6">
    {/* Zimbra Login Button */}
 {/* Zimbra Login Button */}
<div className="relative group w-1/2 font-content z-[100]">
  <button
    type="submit"
    className="w-full py-2 bg-gradient-to-r from-red-800 via-red-600 to-red-400 text-white font-semibold rounded-full shadow-md hover:opacity-80"
  >
    ZIMBRA LOGIN
  </button>
  {/* Tooltip */}
  <div className="absolute bottom-full text-[9px] left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white rounded-md py-1 px-2 shadow-lg whitespace-nowrap z-[9999]">
    Zimbra users Login with your Zimbra credentials.
  </div>
</div>

{/* Microsoft 365 Button */}
<div className="relative group w-1/2 font-content z-[100]">
  <button
    className="w-full py-2 border border-red-700 text-red-800 font-semibold rounded-full shadow-md hover:bg-blue-100"
    onClick={handleAuth}
  >
    MICROSOFT 365
  </button>
  {/* Tooltip */}
  <div className="absolute bottom-full text-[9px] left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white rounded-md py-1 px-2 shadow-lg whitespace-nowrap z-[9999]">
    O365 users – Login with your O365 credentials.
  </div>
</div>

  </div>
</form>



          {/* Forgot Password */}
          <p className="text-gray-500 text-xs text-center mt-4" onClick={() => {navigate("/it-helpdesk")}}>
            Forgotten your login details? <span className="text- cursor-pointer">Get Help Signing In</span>
          </p>
        </div>

        {/* Right Side - Welcome Message */}

        <div className="relative w-1/2 bg-gradient-to-r from-red-900 via-red-700 to-red-400 text-white flex flex-col justify-center items-center p-7">
          <div
            className="absolute inset-0  bg-no-repeat opacity-25"
            style={{
              backgroundImage: "url('https://img.freepik.com/premium-photo/cms-content-management-system-concept-person-hand-using-laptop-computer-with-content-management-system-icon-virtual-screen-background-business-web-computer-website-administration_1296497-153.jpg')",
              backgroundSize: "cover", // Adjust this to change the image size
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>

          <h2 className="text-sm mr-[50%] font-semibold relative">WELCOME TO</h2>
          <h1 className="text-3xl font-bold mt-1 relative">CMS Digital Lounge</h1>

          {/* Add the white line */}
          <hr className="border-t-2 border-white my-2 w-1/2 mr-[25%]" />

          <p className="text-xs  mr-[35%] relative">Login to Access Dashboard</p>

        </div>
      </div>
    </div><ToastContainer /></>

  );
};

export default Login;