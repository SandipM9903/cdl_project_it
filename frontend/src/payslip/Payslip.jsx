import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import Header from "../components/Header";
import { BASE_URL } from "../config/Config";

// Cookie key must match login
const EMP_CODE_PLAIN_NAME = "emp_code";

/* ------------------------------
   AES HELPERS (MATCH LOGIN.JSX)
------------------------------- */
const AES_KEY_BASE64 = "75Q2ykXsiKcAnooOXdT6L8m7JAysFCvzHqNQjs+euTU=";

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

const importAesKey = async () => {
  const rawKey = base64ToArrayBuffer(AES_KEY_BASE64);
  return crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["encrypt"]);
};

const encryptValue = async (plainText) => {
  const key = await importAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return arrayBufferToBase64(combined.buffer);
};

/* ------------------------------
    COOKIE HELPERS
------------------------------- */
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
      MAIN COMPONENT
------------------------------- */

const PaySlip = () => {
  const [payslips, setPayslips] = useState([]);
  const [year, setYear] = useState("2025");
  const [encryptedEmpCode, setEncryptedEmpCode] = useState(null);
  const [encryptedListDocId, setEncryptedListDocId] = useState(null);

  // STEP 1 — Load encrypted empCode from cookie
  useEffect(() => {
    const loadEncryptedEmpCode = async () => {
      try {
        const hashedKey = await hashCookieName(EMP_CODE_PLAIN_NAME);
        const cookieValue = getCookieByName(hashedKey);

        if (!cookieValue) {
          console.error("❌ emp_code cookie missing.");
          return;
        }

        setEncryptedEmpCode(cookieValue);

        // create encrypted("LIST") docId
        const encListId = await encryptValue("LIST");
        setEncryptedListDocId(encListId);

      } catch (err) {
        console.error("Error reading emp_code cookie:", err);
      }
    };

    loadEncryptedEmpCode();
  }, []);

  // STEP 2 — Fetch payslips using encrypted eCode + encrypted("LIST")
  useEffect(() => {
    if (!year || !encryptedEmpCode) return;

   // const safeEncodedEmpCode = encodeURIComponent(encryptedEmpCode);
   const safeEncodedEmpCode = encryptedEmpCode;

    console.log("Encrypted emp_code (URL SAFE):", safeEncodedEmpCode);

    axios
  .get(`${BASE_URL}:9023/documents/fetch/payslip`, {
    params: {
      empCode: safeEncodedEmpCode,
      year: year
    }
  })
  .then((res) => setPayslips(res.data))
  .catch((err) => console.error("Error fetching payslips:", err));

  }, [year, encryptedEmpCode]);

  // STEP 3 — Download encrypted payslip
 const handleDownload = async (docId) => {
  try {
    if (!encryptedEmpCode) {
      alert("Session expired. Login again.");
      return;
    }

    const encryptedDocId = await encryptValue(docId.toString());

    const url =
      `${BASE_URL}:9023/documents/payslip/access` +
      `?docId=${encodeURIComponent(encryptedDocId)}` +
      `&empCode=${encodeURIComponent(encryptedEmpCode)}` +
      `&year=${encodeURIComponent(year)}`;

    window.open(url, "_blank");
  } catch (err) {
    console.error("❌ Error downloading payslip:", err);
  }
};


  return (
    <div className="p-6 md:p-10">
      <Header />

      <div className="text-gray-600 text-sm mb-4 mt-20">
        Home / <span className="text-black font-medium">My CMS</span> /{" "}
        <span className="text-black font-semibold">Payslips</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Payslips</h2>
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

      <div className="bg-white rounded-md shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-3">Month</th>
              <th className="px-6 py-3">Year</th>
              <th className="px-6 py-3">Payslip</th>
              <th className="px-6 py-3">Tax Computation</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((payslip) => {
              const match = payslip.itemName?.match(/_(\d{4})_(\w+)/);
              const slipYear = match ? match[1] : year;
              const month = match ? match[2] : "Unknown";

              return (
                <tr
                  key={payslip.docId}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">{month}</td>
                  <td className="px-6 py-4">{slipYear}</td>
                  <td
                    className="px-6 py-4 text-blue-600 flex items-center gap-2 cursor-pointer"
                    onClick={() => handleDownload(payslip.docId)}
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

      <div className="mt-8 border border-[#923A39] text-[#923A39] bg-white rounded-xl px-4 py-3 flex items-start gap-2 text-sm">
        <span className="text-xl">⭐</span>
        Please Note: To download your payslip, use the following password format:
        <br />
        First Four digits of Employee ID + Year of Birth
        <br />
        <strong>(Example: 90232001)</strong>
      </div>
    </div>
  );
};

export default PaySlip;
