import { useEffect, useState } from "react";
import "react-dropdown/style.css";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Header from "../components/Header";
import Service from "./Service";
import useFileStore, { useStoreFinancialYear } from "./useFileStore";
import { useNavigate, useLocation } from "react-router-dom";

function IT_Declaration_Preview() {
  const empCode = localStorage.getItem("empId");
  const { submitFinancialYear } = useStoreFinancialYear();
  const navigate = useNavigate();

  const [info, setInfo] = useState([]);
  const [master, setMaster] = useState([]);
  const [landlordDetails, setLandlordDetails] = useState({ name: "", panNumber: "" });
  const [loading, setLoading] = useState(false);
  const { regime } = useFileStore();

  const location = useLocation();
  const fromEdit = location.state?.fromEdit === true;

  const fetchInfo = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear
    ).then((res) => setInfo(res?.data?.data || []));
  };

  const fetchMaster = () => {
    Service.fetchAllSectionName().then((res) =>
      setMaster(res?.data?.data || [])
    );
  };

  // Fetch landlord details
  const fetchLandlordDetails = async () => {
    if (!empCode) return;
    setLoading(true);
    try {
      const response = await Service.getLandlordDetails(empCode);
      if (response?.data) {
        const data = response.data;
        setLandlordDetails({
          name: data.landlordName || "",
          panNumber: data.landlordPanNumber || ""
        });
      }
    } catch (error) {
      console.error("Error fetching landlord details:", error);
      setLandlordDetails({ name: "", panNumber: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
    fetchMaster();
    fetchLandlordDetails();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const allSectionName = info.map((item1) => {
    const matchingItem = master.find(
      (item2) => Number(item2.itDecId) === Number(item1.itDecId)
    );

    if (matchingItem) {
      return {
        ...matchingItem,
        ...item1,
        description: item1.description || matchingItem.description,
        additionalInformation:
          item1.additionalInformation || matchingItem.additionalInformation,
      };
    }

    return item1;
  });

  const completeSectionList = master.map((masterItem) => {
    const existingDeclaration = info.find(
      (item) => Number(item.itDecId) === Number(masterItem.itDecId)
    );

    return existingDeclaration
      ? {
          ...masterItem,
          ...existingDeclaration,
          description:
            existingDeclaration.description || masterItem.description,
          additionalInformation:
            existingDeclaration.additionalInformation ||
            masterItem.additionalInformation,
        }
      : {
          ...masterItem,
          declarationAmount: null,
        };
  });

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  let fyStartYear;

  if (currentMonth >= 3) {
    fyStartYear = currentYear;
  } else {
    fyStartYear = currentYear - 1;
  }

  const currentFinancialYear = `${fyStartYear}-${(fyStartYear + 1)
    .toString()
    .slice(-2)}`;

  const isCurrentFinancialYear = submitFinancialYear === currentFinancialYear;
  const isDeclarationClosed = !isCurrentFinancialYear;

  // Check if landlord details exist
  const hasLandlordDetails = landlordDetails.name || landlordDetails.panNumber;

  const renderSection = (title, iconSrc, filterIds) => (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg mt-5 mb-6 w-full">
      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-gray-300 p-4">
        <h2 className="text-sm text-gray-800 font-header">{title}</h2>
        <img className="h-10 w-10" src={iconSrc} alt="section icon" />
      </div>

      <div className="divide-y divide-gray-200">
        {completeSectionList
          ?.sort((a, b) => a.itDecId - b.itDecId)
          ?.filter((section) => filterIds.includes(section.itDecId))
          ?.map((section) => (
            <div
              key={section.itDecId}
              className="grid grid-cols-3 items-center p-4 text-sm font-content"
            >
              <div>
                <span className="block font-medium text-gray-700">
                  {section?.description || "Unknown Section"}
                </span>
                {section.additionalInformation && (
                  <p className="text-gray-500 text-xs mt-1">
                    {section.additionalInformation}
                  </p>
                )}
              </div>

              <div className="flex justify-center items-center text-gray-800 text-lg">
                -
              </div>

              <div className="text-right items-center text-gray-700">
                {section?.declarationAmount
                  ? `₹${Number(section.declarationAmount).toLocaleString(
                      "en-IN"
                    )}`
                  : "-"}
              </div>
            </div>
          ))}
      </div>

      {/* Landlord Details Section - Only show for Housing Loan section if details exist */}
      {title === "Section 80E/10/Housing Loan" && hasLandlordDetails && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 rounded-b-lg">
          <div className="flex items-center mb-3">
            <HomeIcon className="text-blue-600 mr-2" style={{ fontSize: 18 }} />
            <h4 className="text-sm font-semibold text-gray-700 font-header">
              Landlord Information
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {landlordDetails.name && (
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <PersonIcon className="text-blue-600" style={{ fontSize: 16 }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-content">Landlord Name</p>
                  <p className="text-sm font-medium text-gray-800 font-content">
                    {landlordDetails.name}
                  </p>
                </div>
              </div>
            )}
            
            {landlordDetails.panNumber && (
              <div className="flex items-center space-x-3">
                <div className="bg-purple-50 p-2 rounded-full">
                  <CreditCardIcon className="text-purple-600" style={{ fontSize: 16 }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-content">PAN Number</p>
                  <p className="text-sm font-medium text-gray-800 font-content font-mono">
                    {landlordDetails.panNumber}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 items-center mb-4 mt-8">
          <div className="flex-1">
            <div className="flex items-center text-sm">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer text-gray-700 font-medium hover:text-[#dc2626] hover:underline hover:underline-offset-4"
              >
                Home
              </span>

              <span className="mx-2 text-gray-400">/</span>

              <span
                onClick={() => navigate("/tax")}
                className="cursor-pointer text-gray-700 font-medium hover:text-[#dc2626] hover:underline hover:underline-offset-4"
              >
                Tax Management
              </span>

              {fromEdit && (
                <>
                  <span className="mx-2 text-gray-400">/</span>
                  <span
                    onClick={() => navigate("/declaration-dashboard")}
                    className="cursor-pointer text-gray-700 font-medium hover:text-[#dc2626] hover:underline hover:underline-offset-4"
                  >
                    Edit
                  </span>
                </>
              )}

              <span className="mx-2 text-gray-400">/</span>

              <span className="font-semibold text-[#dc2626] cursor-default">
                Preview
              </span>
            </div>
          </div>

          {/* Status box centered */}
          <div className="mx-auto bg-red-50 border border-red-100 rounded-lg w-full max-w-md shadow-sm">
            <div className="flex items-center justify-center space-x-4 py-5">
              <HiOutlineInformationCircle className="text-xl text-red-600" />
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">
                  {isDeclarationClosed
                    ? "Declaration window is closed"
                    : "Declaration window is open"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 mb-3">
          <h2 className="text-sm font-header">Declaration Summary</h2>
          <p className="text-sm text-gray-600 bg-gray-100 py-1 px-3 rounded-full">
            Financial Year:{" "}
            <span className="text-gray-900 font-medium">
              {submitFinancialYear}
            </span>
          </p>
        </div>

        {/* Header row */}
        <div className="flex justify-between items-center px-5 py-3 bg-[#fca5a5] border border-gray-300 rounded-md text-sm font-header">
          <div className="ml-1">Particulars</div>
          <div className="text-right">Declared Amount</div>
        </div>

        {renderSection("Section 80 C", require("./assets/savings 2.png"), [
          1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23,
        ])}

        {renderSection(
          "Section 80D/80DD/80DDB/80U",
          require("./assets/Medical.jpg"),
          [7, 8, 10, 11, 15, 16, 17]
        )}

        {renderSection(
          "Section 80E/10/Housing Loan",
          require("./assets/images icon.png"),
          [12, 13, 14]
        )}

        {/* Space before footer */}
        <div className="mb-20"></div>
      </div>
    </div>
  );
}

export default IT_Declaration_Preview;