import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const happitudeMembers = [
  {
    name: "Rajani Muthu",
    dept: "Marketing",
    email: "rajani_m@cms.co.in",
    img: "Rajani M_Happitude.jpg",
  },
  {
    name: "Tricia Serrao",
    dept: "Management",
    email: "tricia_serrao@cms.co.in",
    img: "tricia.jpg",
  },
  {
    name: "Prachi Rai",
    dept: "HR",
    email: "prachi_rai@cms.co.in",
    img: "Prachi Rai_Happitude.jpeg",
  },
  {
    name: "Sheetal",
    dept: "Digital",
    email: "sheetal_khodke@cms.co.in",
    img: "Sheetal_Happitude.jpg",
  },
  {
    name: "Sahitya",
    dept: "ITMS",
    email: "sahitya_b@cms.co.in",
    img: "SAHITYA_Happitude .jpeg",
  },
];
const canteenMembers = [
  {
    name: "Shikhar Mishra",
    dept: "DIGITAL PRACTICE",
    email: "shikhar_mishra@cms.co.in",
    img: "Shikhar Mishra_Canteen Committee.jpg",
  },
  {
    name: "Apaar Arora",
    dept: "Digital",
    email: "apaar_arora@cms.co.in",
    img: "Apaar Arora_Canteen Committee _1.jpg",
  },
  {
    name: "Sujata Nanhur",
    dept: "HR",
    email: "sujata_nanhur@cms.co.in",
    img: "Sujata Nanhur_Canteen.jpeg",
  },
];
const gardenMembers = [
  {
    name: "Siddhi Mundhe",
    dept: "ITMS",
    email: "siddhi_mundhe@cms.co.in",
    img: "siddhi_Munde.jpeg",
  },
  {
    name: "Akshay Shigvan",
    dept: "HR",
    email: "akshay_shigvan@cms.co.in",
    img: "Akshay Shigvan_Garden .jpg",
  },
  {
    name: "Chetan Akarte",
    dept: "Digital",
    email: "chetankumar_akarte@cms.co.in",
    img: "Chetankumar Akarte_Garden.jpg",
  },
  {
    name: "Anup Jadhav",
    dept: "P & D",
    email: "anup_jadhav@cms.co.in",
    img: "Anup Jadhav_Garden.jpg",
  },
];
const sportsMembers = [
  {
    name: "AkshayKumar Gaikwad",
    dept: "PND",
    email: "akshaykumar_gaikwad@cms.co.in",
    img: "Akshay Gaikwad_Sports.jpg",
  },
  {
    name: "Shridhar Ingle",
    dept: "PND",
    email: "shridhar_ingale@cms.co.in",
    img: "Shridhar Ingle_Sports .jpeg",
  },
  {
    name: "Diwakar Simanchal Sahu",
    dept: "HR",
    email: "diwakar_sahu@cms.co.in",
    img: "Diwakar Sahu_Sports.JPG",
  },
  {
    name: "Suhas Kadam",
    dept: "Marketing",
    email: "suhas_kadam@cms.co.in",
    img: "suhas_kadam.jpeg",
  },
  {
    name: "Manan Chhabra",
    dept: "BSD-ITMS",
    email: "manan_chhabra@cms.co.in",
    img: "Manan Chabbra_Sports.jpeg",
  },
  {
    name: "Shivam Singh Kashyap",
    dept: "DIGITAL PRACTICE",
    email: "shivam_kashyap@cms.co.in",
    img: "SHIVAM KASHYAP_Sports.jpeg",
  },
  {
    name: "Nayan Patel",
    dept: "ITS",
    email: "nayan_patel@cms.co.in",
    img: "Nayan Patel_Sports.jpeg",
  },
  {
    name: "Sivanandana N",
    dept: "Marketing",
    email: "sivanandana_s@cms.co.in",
    img: "Sivanandana S_Garden Committee.jpg",
  },
  {
    name: "Vidhi Shinde",
    dept: "HR",
    email: "vidhi_shinde@cms.co.in",
    img: "Vidhi Shinde_Sports.jpeg",
  },
];
const marcommMembers = [
  {
    name: "Damini Singh",
    dept: "Marketing",
    email: "damini_singh@cms.co.in",
    img: "damini.jpeg",
  },
  {
    name: "Rajani Madaparambil",
    dept: "Marketing",
    email: "rajani_m@cms.co.in",
    img: "profileImg.jpg",
  },
];
const committeeTagline = {
  "Happitude Committee": `The Heartbeat of Our Office Culture.`,
  "Canteen Committee": `Good Food. Great Mood.`,
  "Garden Committee": `Greening Our Workspace, One Plant at a Time`,
  "Sports Committee": `Fueling Fitness and Friendly Competition`,
  //"Marcomm Committee": `The Marcomm Committee is responsible for all communications, branding, and creative campaigns. They ensure that every message — internal or external — is clear, engaging, and reflects the company's core values and vision.`,
};
const committeeDescriptions = {
  "Happitude Committee": `The Heartbeat of Our Office Culture. From festive decorations to Friday fun, Happitude is the magic behind every celebration. This committee works year-round to plan, execute, and energize office events — whether it's Diwali, Women's Day, or a surprise treat day. Their goal? To keep spirits high, smiles wide, and create lasting memories at work.`,
  "Canteen Committee": `
Your everyday lunch just got a little more thoughtful. The Canteen Committee ensures that our food services are healthy, hygienic, and tasty. They regularly gather feedback, monitor quality, and introduce variety so that everyone has something to look forward to during meal breaks.`,
  "Garden Committee": `Greening Our Workspace, One Plant at a Time
Nature is never out of place. The Garden Committee brings life into our workspaces by maintaining indoor plants, office green zones, and gardens. They ensure we're surrounded by clean air, a touch of nature, and a calm that only green spaces can offer.`,
  "Sports Committee": `Fueling Fitness and Friendly Competition
For the ones who believe in teamwork, adrenaline, and a little healthy rivalry — the Sports Committee has your back. They organize everything from cycling events to cricket matches and wellness challenges. It's not just about playing — it's about building camaraderie, discipline, and fun through sport.`,
  "Marcomm Committee": `The Marcomm Committee is responsible for all communications, branding, and creative campaigns. They ensure that every message — internal or external — is clear, engaging, and reflects the company's core values and vision.`,
};

const HappitudeCommittee = () => {
  const location = useLocation();
  const initialCommittee = location.state?.committee || "Happitude Committee";
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [selectedCommittee, setSelectedCommittee] = useState(initialCommittee);
  const [currentPage, setCurrentPage] = useState(0);
  const leadersPerPage = 5;

  const getMembersByCommittee = (type) => {
    switch (type) {
      case "Canteen Committee":
        return canteenMembers;
      case "Garden Committee":
        return gardenMembers;
      case "Sports Committee":
        return sportsMembers;
      case "Marcomm Committee":
        return marcommMembers;
      default:
        return happitudeMembers;
    }
  };

  const allMembers = getMembersByCommittee(selectedCommittee);
  const totalPages = Math.ceil(allMembers.length / leadersPerPage);
  const currentLeaders = allMembers.slice(
    currentPage * leadersPerPage,
    (currentPage + 1) * leadersPerPage
  );

  return (
    <>
      <Header />
      <div className="bg-white mt-20">
        {/* Header Section Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4 sm:px-6 lg:px-8">
          {/* Text Section */}
          <div>
          <div className="text-sm text-gray-500 py-6">
  <span
    onClick={() => navigate("/Dashboard")}
    className="cursor-pointer text-black hover:underline"
  >
    Home
  </span>
  <span className="px-1">/</span>
  <span
    onClick={() => navigate("/Committees")}
    className="cursor-pointer text-black hover:underline"
  >
    Committee
  </span>
  <span className="px-1">/</span>
  <span className="text-black font-semibold">{selectedCommittee}</span>
</div>

            {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold sm:mt-10">
                  <span role="img" aria-label="smile">😊</span> Happitude Committee
              </h1> */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold sm:mt-10">
              <span role="img" aria-label="smile">
                😊
              </span>{" "}
              {selectedCommittee}
            </h1>

            <h2 className="text-xl sm:text-2xl font-medium mb-2">
              {committeeTagline[selectedCommittee] ||
                committeeTagline.Happitude}
            </h2>
            <h2 className="text-xl sm:text-2xl font-medium mb-2"></h2>

            <p className="text-sm sm:text-base font-medium">
              {committeeDescriptions[selectedCommittee] ||
                committeeDescriptions.Happitude}
            </p>
          </div>

          {/* Illustration Section */}
          <div className="text-center">
            <img
              src="/happitude.png"
              alt="Happitude Illustration"
              className="w-full h-52 sm:h-64 md:h-[50vh] object-contain"
            />
          </div>
        </div>

        {/* What They Do */}
        <div className="mx-auto text-center px-4 sm:px-6 lg:px-8 mt-8"></div>

        {/* Joy-Makers */}
        <div className=" my-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 justify-items-center">
  {currentLeaders.map((member, index) => (
    <div
      key={index}
      className={`w-40 sm:w-56 h-64 sm:h-76 ${
        index % 2 === 0 ? "mt-0" : "lg:mt-12"
      } bg-[#DC3545] rounded-xl relative group shadow-md overflow-hidden`}
    >
      <img
        src={`/${member.img}`}
        alt={member.name}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 rounded-xl transition"
      />
      <div className="absolute bottom-0 bg-black bg-opacity-70 rounded-b-xl text-white w-full p-2 text-xs sm:text-sm text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p>
          <span className="font-semibold">Name:</span> {member.name}
        </p>
        <h1>
          <span className="font-semibold">Department:</span> {member.dept}
        </h1>
        <h1>
          <span className="font-semibold">Email:</span> {member.email}
        </h1>
      </div>
    </div>
  ))}
</div>

        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <option
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`cursor-pointer text-xl mx-1 transition-colors ${
                  idx === currentPage ? "text-red-500" : "text-gray-400"
                }`}
              >
                ●
              </option>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HappitudeCommittee;
