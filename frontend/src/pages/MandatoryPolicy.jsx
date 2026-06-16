import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { BASE_URL } from "../config/Config";
import WorkplaceHealthSafetyPolicy from "./WorkplaceHealthSafetyPolicy";
import PoshPolicy from "./PoshPolicy";
import EmployeeConductPolicy from "./EmployeeConductPolicy";

// ✅ FULL POLICY SEQUENCE
const POLICIES = [
  {
    id: "HSE_001",
    title: "Workplace Health & Safety Policy",
    component: <WorkplaceHealthSafetyPolicy />,
  },
  {
    id: "POSH_002",
    title: "Prevention of Sexual Harassment (POSH)",
    component: <PoshPolicy />,
  },
  {
    id: "ISMS_003",
    title: "Employee Conduct Policy",
    component: <EmployeeConductPolicy />,
  },
];

const MandatoryPolicy = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(40);
  const [acceptEnabled, setAcceptEnabled] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState([]);
  const [empCode, setEmpCode] = useState(null); // ✅ DIRECT LOCAL STORAGE
  const [employeeName, setEmployeeName] = useState("");
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  // ✅ RESOLVE EMP CODE FROM LOCAL STORAGE + CHECK STATUS
  useEffect(() => {
    const init = async () => {
      const storedEmpCode = localStorage.getItem("empId");

      if (!storedEmpCode) {
        alert("❌ Session expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      setEmpCode(storedEmpCode);

      const name = localStorage.getItem("firstName") || "Unknown";
      setEmployeeName(name);

      // 🔍 Check if user already completed all mandatory policies
      try {
        const res = await axios.get(
          `${BASE_URL}:9050/mandatory-policy/status`,
          {
            params: { empCode: storedEmpCode }, // ✅ DIRECT PARAM
          }
        );

        if (res.data && res.data.completed) {
          setAlreadyCompleted(true);
          setAcceptEnabled(true);
          setTimer(0);
          console.log("✅ Mandatory policies already completed earlier");
        }
      } catch (err) {
        console.error("❌ Failed to load mandatory policy status:", err);
      }
    };

    init();
  }, []);

  // ✅ 40-SECOND HARD TIMER (ONLY FOR FIRST-TIME USERS)
  useEffect(() => {
    if (alreadyCompleted) {
      setAcceptEnabled(true);
      setTimer(0);
      return;
    }

    setAcceptEnabled(false);
    setTimer(40);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAcceptEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeIndex, alreadyCompleted]);

  // ✅ ACCEPT HANDLER
  const handleAccept = async () => {
    if (alreadyCompleted) {
      if (activeIndex < POLICIES.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else {
        window.location.href = "/dashboard";
      }
      return;
    }

    const currentPolicy = POLICIES[activeIndex];

    const record = {
      empCode, // ✅ DIRECT LOCAL STORAGE VALUE
      employeeName,
      policyId: currentPolicy.id,
      policyTitle: currentPolicy.title,
      acceptedAt: new Date().toISOString(),
    };

    try {
      await axios.post(
        `${BASE_URL}:9050/mandatory-policy/accept-single`,
        record
      );

      setAcceptedPolicies((prev) => [...prev, record]);

      if (activeIndex < POLICIES.length - 1) {
        setActiveIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error("❌ Failed to save acceptance:", err);
      alert("❌ Failed to save acceptance. Try again.");
    }
  };

  // ✅ FINAL SUBMIT CONFIRMATION (ONLY FIRST TIME)
  const handleFinalSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}:9050/mandatory-policy/final-submit`, {
        empCode, // ✅ DIRECT LOCAL STORAGE VALUE
        employeeName,
      });

      alert("✅ All Mandatory Policies Accepted Successfully");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Final submission failed:", err);
      alert("❌ Final submission failed");
    }
  };

  const policy = POLICIES[activeIndex];

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 px-6 py-20">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-red-700 mb-1">
            Mandatory Policy {activeIndex + 1} of {POLICIES.length}
          </h2>

          <h3 className="text-lg font-semibold mb-4">{policy.title}</h3>

          <div className="h-[500px] overflow-y-auto border p-6 rounded text-sm text-gray-800 mb-6 bg-gray-50">
            {policy.component}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              {alreadyCompleted
                ? "✅ You have already accepted these policies earlier. You can review and proceed."
                : acceptEnabled
                ? "✅ You may now accept this policy."
                : `⏳ You can accept after ${timer} seconds`}
            </p>

            {activeIndex < POLICIES.length - 1 ? (
              <button
                disabled={!acceptEnabled}
                onClick={handleAccept}
                className={`px-6 py-2 rounded text-white ${
                  acceptEnabled
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Accept &amp; Continue
              </button>
            ) : (
              <button
                disabled={!acceptEnabled}
                onClick={async () => {
                  if (alreadyCompleted) {
                    window.location.href = "/dashboard";
                  } else {
                    await handleAccept();
                    await handleFinalSubmit();
                  }
                }}
                className={`px-6 py-2 rounded text-white ${
                  acceptEnabled
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Accept &amp; Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MandatoryPolicy;
