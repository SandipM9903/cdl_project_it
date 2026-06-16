import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import Header from "../components/Header";
import { BASE_URL } from "../config/Config";

// ✅ MUST MATCH LOGIN + PAYSLIP
const EMP_CODE_PLAIN_NAME = "emp_code";

/* ------------------------------
    HASH + COOKIE HELPERS ONLY
------------------------------- */

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const hashCookieName = async (name) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(name);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return arrayBufferToBase64(hashBuffer).replace(/=/g, "").substring(0, 32);
};

const getCookieByName = (cookieName) => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(cookieName + "="));
  return match ? match.split("=")[1] : null;
};

/* ------------------------------
         COMPONENT
------------------------------- */

const Form16 = () => {
  const [form16, setForm16] = useState([]);
  const [year, setYear] = useState("2025");
  const [encryptedEmpCode, setEncryptedEmpCode] = useState(null);

  // ✅ STEP 1: READ RAW ENCRYPTED eCode FROM COOKIE
  useEffect(() => {
    const resolveEncryptedEmpCode = async () => {
      try {
        const hashedKey = await hashCookieName(EMP_CODE_PLAIN_NAME);
        const encryptedValue = getCookieByName(hashedKey);

        if (!encryptedValue) {
          console.error("❌ Encrypted emp_code cookie not found");
          alert("Session expired. Please login again.");
          window.location.href = "/login";
          return;
        }

        console.log("✅ Encrypted emp_code (RAW from cookie):", encryptedValue);
        setEncryptedEmpCode(encryptedValue);
      } catch (err) {
        console.error("❌ Failed to resolve encrypted emp_code:", err);
      }
    };

    resolveEncryptedEmpCode();
  }, []);

  // ✅ STEP 2: SAFE ENCODE + FETCH FORM-16
  useEffect(() => {
    if (!year || !encryptedEmpCode) return;

    const safeEncodedEmpCode = encodeURIComponent(encryptedEmpCode);
    console.log("✅ Encrypted emp_code (URL SAFE):", safeEncodedEmpCode);

    axios
      .get(
        `${BASE_URL}:9023/documents/fetch/form16/${safeEncodedEmpCode}/${year}`
      )
      .then((res) => setForm16(res.data))
      .catch((err) =>
        console.error("❌ Error fetching Form-16 documents:", err)
      );
  }, [year, encryptedEmpCode]);

  const handleDownload = (docId) => {
    const docViewerUrl = `/doc-viewerPass/${docId}`;
    window.open(docViewerUrl, "_blank");
  };

  return (
    <div className="p-6 md:p-10">
      <Header />

      <div className="text-gray-600 text-sm mb-4 mt-20">
        Home / <span className="text-black font-medium">My CMS</span> /{" "}
        <span className="text-black font-semibold">Form 16</span>
      </div>

      {/* Header with Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Form 16</h2>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm text-gray-700"
        >
          <option value="2025">2025–2026</option>
          <option value="2024">2024–2025</option>
          <option value="2023">2023–2024</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-3">Year</th>
              <th className="px-6 py-3">Form 16</th>
              <th className="px-6 py-3">Tax Computation</th>
            </tr>
          </thead>
          <tbody>
            {form16.map((doc) => {
              const match = doc.itemName?.match(/_(\d{4})_(\w+)/);
              const slipYear = match ? match[1] : year;

              return (
                <tr
                  key={doc.docId}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">{slipYear}</td>

                  <td
                    className="px-6 py-4 text-blue-600 flex items-center gap-2 cursor-pointer"
                    onClick={() => handleDownload(doc.docId)}
                  >
                    Download <FaDownload className="inline-block" />
                  </td>

                  <td className="px-6 py-4 text-gray-500">NA</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Form16;
