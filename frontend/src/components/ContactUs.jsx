import React, { useState } from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';
function Contactus() {
 const locations = [
    {
  city: "Mumbai",
  name: "Mr. Dattatraya Pawar",
  role: "HR Executive & Facility Manager",
  email: " dattatraya_pawar@cms.co.in",
  phone: "+91-7738534161, 022-41259116",
  address: "70, Lake Rd, Sonapur, Bhandup West, Mumbai, Maharashtra ",
  pin: "400078",
  fax: "(+91) 22-98765432",
  emergency: `Emergency Contact:\n• +91-9812345678 / 022-41259009`,
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.647611519159!2d72.93369257512383!3d19.12234538210283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b9112e379011%3A0x23d9b16e33f588fb!2s70%2C%20Lake%20Rd%2C%20Sonapur%2C%20Bhandup%20West%2C%20Mumbai%2C%20Maharashtra%20400078!5e0!3m2!1sen!2sin!4v1720513384865!5m2!1sen!2sin",
},
  {
    city: "Delhi",
    name: "Mr. Rakesh Kumar",
    role: "HR & Admin Support",
    email: "rakesh_kumar@cms.co.in",
    phone: "+91-9868925034",
    address: "33A/2 Kilokari, Near Kilokari Shiv Mandir, Maharani Bagh, Hari Nagar Ashram, New Delhi, Delhi ",
    pin: "110014",
    fax: "(+91) 11-26348620",
    emergency: "Emergency Contact: +91-9876543210  +91-9868925034",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83920764364!2d77.0688997!3d28.5272526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c3ed7d6305%3A0xa21b57dd72fa4c89!2sMaharani%20Bagh%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1657000000000"
  },
  {
    city: "Bengaluru",
    name: "Ms. Anitha Singh",
    role: "SR IT RECRUITER-TA",
    email: "anitha_singh@cms.co.in",
    phone: "+91-9741631988",
    address: "Prestige Al- Kareem, 3, Edward Rd, Vasanth Nagar, Bengaluru, Karnataka ",
    pin: "560052",
    fax: "(+91) 80-87654321",
    emergency: "Emergency Contact: +91-9876543211  +91-9741631988",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31110.05877324364!2d77.5904825!3d12.9740352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c1f3f0ff%3A0x5771c7ef24608b6d!2sMG%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1657000000001"
  },
  {
    city: "Chennai",
    name: "Mr. S GOPINATH",
    role: "HR & Admin Operations",
    email: "s_gopinath@cms.co.in",
    phone: "+91-9445841713",
    address: "40, Bazullah Rd, Rama Kamath Puram, T. Nagar, Chennai, Tamil Nadu ",
    pin: "600017",
    fax: "(+91) 44-12345678",
    emergency: "Emergency Contact: +91-9876543214 +91-9445841713",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.11140341507!2d80.24166711498867!3d13.063218990772245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267d25ad834e3%3A0x73a26de6c9c456f1!2sT%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1657000000004"
  },
  {
    city: "Thiruvananthapuram",
    name: "Mr. UNNIKRISHNAN G",
    role: "HR & Admin Support",
    email: "unnikrishnan_g@cms.co.in",
    phone: "+91-9400107696",
    address: "5th Floor, Deepa Arcade, Convent Road, General Hospital Rd, Jn, Thiruvananthapuram, ",
    pin: "695001",
    fax: "(+91) 471-2700171",
    emergency: "Emergency Contact: +91-9876543213  +91-9400107696",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.013377232988!2d76.8843708!3d8.5575986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbb19e6cd81b%3A0x7b5120d3b3de8ed5!2sTechnopark%2C%20Trivandrum!5e0!3m2!1sen!2sin!4v1657000000003"
  },

  {
    city: "Hyderabad",
    name: "Mr. Rohan Verma",
    role: "HR Manager",
    email: "rohan_verma@cms.co.in",
    phone: "+91-9123456789",
    address: "2nd Floor, H.No. 1-8-343, M.N.J Palace, Indian Airlines Colony, Begumpet, Secunderabad, Telangana ",
    pin: "500003",
    fax: "(+91) 40-23456789",
    emergency: "Emergency Contact: +91-9876543215  +91-9123456789",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.019847798186!2d78.40087991515707!3d17.44818050526154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9147b1ebc001%3A0xa5d56bf17265d0a1!2sHITEC%20City%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1657000000005"
  },
  {
    city: "Lucknow",
    name: "Mr. Dattatraya Pawar",
    role: "Facility Manager",
    email: "dattatraya_pawar@cms.co.in",
    phone: "+91-7738534161",
     "address": "CMS Computers India Pvt. Ltd., 4th Floor, Surajdeep Complex, B-Block, 1 Jopling Road, Hazratganj, Lucknow – 226001, Uttar Pradesh, India",
    pin: "226001",
    fax: "(+91) 522-1234567",
    emergency: "Emergency Contact: +91-9876543216  +91-7738534161",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.523549855036!2d80.94304471498854!3d26.847056583137305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd4ad9b0d52b%3A0xd2f485e4030b4955!2sHazratganj%2C%20Lucknow!5e0!3m2!1sen!2sin!4v1657000000006"
  },
  {
    city: "Kolkata",
    name: "Ms. PRIYANKA DAS",
    role: "Executive HR",
    email: "priyanka_das@cms.co.in",
    phone: "+91-9038016509",
    address: "3rd Floor, Cz 1, Sec-B, Near Metropolitan, Canal South Road, Dhapa-",
    pin: "700105",
    fax: "(+91) 33-87654321  +91-9038016509",
    emergency: "Emergency Contact: +91-9876543217",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.123456789!2d88.363895!3d22.572646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277a0e0e0e0e0%3A0x0!2sKolkata!5e0!3m2!1sen!2sin!4v1657000000001"
  },
  {
    city: "Pune",
    name: "Ms. Sneha Kulkarni",
    role: "HR Coordinator",
    email: "sneha_kulkarni@cms.co.in",
    phone: "+91-9876543210",
    address: "Baner, Pune, Maharashtra",
    pin: "411045",
    fax: "(+91) 20-25468791",
    emergency: "Emergency Contact: +91-9876543220",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.490418668111!2d73.78980271511347!3d18.559791787353785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c26f55f29d37%3A0x6783ca5e834bcfa9!2sBaner%2C%20Pune!5e0!3m2!1sen!2sin!4v1657000000007"
  },
  {
    city: "Ahmedabad",
    name: "Mr. Rajesh Patel",
    role: "Facility Head",
    email: "rajesh_patel@cms.co.in",
    phone: "+91-9876512345",
    address: "Navrangpura, Ahmedabad, Gujarat",
    pin: "380009",
    fax: "(+91) 79-26345678",
    emergency: "Emergency Contact: +91-9876543230",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.524049235998!2d72.5762227151113!3d23.02250588493833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f09cabe195%3A0x1d55a99a7fbd7ca6!2sNavrangpura%2C%20Ahmedabad!5e0!3m2!1sen!2sin!4v1657000000008"
  },
  {
    city: "Jaipur",
    name: "Ms. Neha Sharma",
    role: "Admin Officer",
    email: "neha_sharma@cms.co.in",
    phone: "+91-9412345678",
    address: "Plot no. 7, Gom Defence Colony. Vashisht Marg, Near Gurudwara. Vaishali Nagar, Jaipur.",
    pin: "302001",
    fax: "(+91) 141-1234567",
    emergency: "Emergency Contact: +91-8829093776  +91-8829093777",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3567.3547265918516!2d75.81228761509853!3d26.91243398311616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5e0c7d05837%3A0x9a1f7f7ed1c3a4c7!2sC%20Scheme%2C%20Jaipur!5e0!3m2!1sen!2sin!4v1657000000009"
  },
  
];

  const [currentPage, setCurrentPage] = useState(0);
  // Set initial selectedMap to Mumbai (index 0)
  const [selectedMap, setSelectedMap] = useState(locations[0]);
  // Change initial viewMode to "all" to show all cards by default
  const [viewMode, setViewMode] = useState("all"); // Changed from "default"

  const itemsPerPage = 4;
  // totalPages should be based on the full locations array, not displayedLocations
  const totalPages = Math.ceil(locations.length / itemsPerPage);

  // This will now always paginate the full list or the filtered list
  const paginatedLocations =
    viewMode === "emergency"
      ? locations.filter(loc => loc.emergency) // Filter for emergency contacts if needed
      : locations;

  const displayedCards = paginatedLocations.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );


  // Reset currentPage to 0 whenever viewMode changes to avoid out-of-bounds issues
  const handleViewModeToggle = () => {
    setViewMode((prev) => {
      const newMode = prev === "all" ? "emergency" : "all";
      setCurrentPage(0); // Reset pagination when mode changes
      return newMode;
    });
  };

  return (
    <>
      <Header />
      <div className="pt-20 px-4 sm:px-10 lg:px-[140px]">
        <div className="text-gray-600 text-sm mb-4 mt-2">
          <Link to="/Dashboard" className="text-black hover:underline">Home</Link> / <span className="text-black font-semibold">Contact Us</span>
        </div>

        {/* Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-[28px] font-light leading-snug">
              We are always ready<br />
              to help you and<br />
              answer your<br />
              questions
            </h1>
            <p className="text-sm mt-2 text-gray-600">
              CMS Computers India Pvt Ltd.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <h2 className="font-bold">Corporate Office</h2>
                <p className="mt-2 font-bold text-[12px] text-[#923A36]">
                  CMS COMPUTERS INDIA PVT.LTD
                </p>
                <div className="text-sm mt-2 text-gray-700 font-content">
                  <p>70, Lake Road,</p>
                  <p>Kaycee Industries Compound,</p>
                  <p>Bhandup (W),</p>
                  <p>Mumbai, Maharashtra</p>
                  <p>Pin : 400078</p>
                  <div className="mt-4">
                    <h3 className="font-bold">Email</h3>
                    <p>info@cms.co.in</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-bold font-header">Contact Number</h2>
                <div className="text-sm mt-2 text-gray-700 font-content">
                  <p>Phone: (+91) 22- 41259000</p>
                  <p>Fax: (+91) 22- 41259001</p>
                  <p>CIN: U30007MH1980PLC022235</p>
                  <div className="mt-8 sm:mt-20">
                    <h3 className="font-bold">Toll Free No</h3>
                    <p>1-800-102-4914</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mt-8 mb-6">
              {/* Ensure selectedMap is always a valid location object */}
              {selectedMap && (
                <iframe
                  src={selectedMap.mapUrl}
                  width="100%"
                  height="400px"
                  className="rounded-[40px] border w-full"
                  loading="lazy"
                  title={`Map of ${selectedMap.city}`} // Added a title for accessibility
                ></iframe>
              )}
            </div>
          </div>
        </div>

        {/* Regional Offices */}
        <div className="mt-12">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {viewMode === "emergency" ? "Regional Offices Emergency Contact" : "Regional Offices"}
            </h2>

            <div className="space-x-2">
              <button
                className="text-sm px-3 py-1 border rounded-full hover:bg-white font content"
                onClick={handleViewModeToggle} // Use the new handler
              >
                {viewMode === "emergency"
                  ? "Show All Addresses"
                  : "Show Emergency Contacts"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {displayedCards.map((loc, index) => ( // Use displayedCards here
              <div
                key={loc.city} // Use a stable key like city or a unique ID
                className={`bg-white shadow-lg rounded-2xl p-4 hover:ring-red-800 cursor-pointer ${
                  selectedMap.city === loc.city ? "ring-2 ring-red-800" : ""
                }`}
                onClick={() => setSelectedMap(loc)}
              >
                <h3 className="text-lg font-semibold text-[#923A39]">{loc.city}</h3>
                <div className="text-sm text-black mt-1 font-content">
                  {viewMode === "emergency" ? (
                    <>
                      <p>{loc.name}</p>
                      {/* Using pre-wrap to respect newlines in emergency string */}
                      <p style={{ whiteSpace: 'pre-wrap' }}>{loc.emergency}</p>
                    </>
                  ) : (
                    <>
                      <p>{loc.address}</p>
                      <p>Pin: {loc.pin}</p>
                      <p className="mt-2">Phone: {loc.phone}</p>
                      <p>Fax: {loc.fax}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination for "All" view */}
          {viewMode !== "default" && ( // Show pagination if not in the old "default" single-card mode
            <div className="mt-12 flex justify-center space-x-3 mb-12">
              {Array.from({ length: Math.ceil(paginatedLocations.length / itemsPerPage) }).map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentPage ? "bg-[#923A39]" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(i)}
                ></button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Contactus;