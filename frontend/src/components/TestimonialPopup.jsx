import { useRef } from "react";
import nawazImg from "../assets/NAWAZ KS Photo.JPG";
import sajeshImg from "../assets/Sajesh.jpeg";
import ashwiniImg from "../assets/ashwini.jpg";
import "./TestimonialPopup.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
 
const testimonials = [
  {
    id: 1,
    name: "Nawaz KS",
    designation: "Database Administrator",
    image: nawazImg,
    description: `My experience with the POWER BI Training session was very good. The course content was vast and the trainer was knowledgeable and helped me a lot in my learning. The trainer had given a clear explanation on the PBI Development and PBI administration part. The best thing I experienced in the assignment was working on it along with the trainer for installation of POWERBI Desktop and GATEWAY software, DAX, POWER BI Report Builder and Auditing concepts. The course material was really good and helped a lot in understanding the scenario. Course Training Program with a trainer I have nothing to complain about, in fact, the support of trainer and team was always responded to in a timely manner, and would highly recommend it to anyone. The course content was well laid out and the instructor was at the best. I would like to thank the CMS HR team for conducting this training session and my manager for helping me in participating.`,
  },
  {
    id: 2,
    name: "Sajesh Kumar Y",
    designation: "Solution Architect",
    image: sajeshImg,
    description: `Pace of the training was such that any beginner can grasp the main concepts and actually learn more as the session moved ahead. Excellent instructor! Everything was well-explained. Loved the way of interaction and methodology and also the project/task which was assigned for practice. Will definitely recommend this course to my colleagues and to try more projects! Trainer helped us at every point wherever we got stuck and ensured that we solve the issue and then continue, even still does after training.`,
  },
  {
    id: 3,
    name: "Ashwini B",
    designation: "Sr. Software Developer",
    image: ashwiniImg,
    description: `Imbibed a lot of knowledge on Power BI through this training. As a developer, this training will help in building reports and dashboards in an effective and efficient manner. The handy functionalities of Power BI will make it easy to overcome any difficult business requirement.`,
  },
];
 
const TestimonialPopup = ({ onClose }) => {
  const scrollRef = useRef(null);
 
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative bg-transparent w-full max-w-6xl px-4">
        <button
          onClick={onClose}
          className="absolute right-4 text-white text-2xl font-bold z-50 hover:text-red-300"
        >
          &times;
        </button>
 
        {/* Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
        >
          <FaChevronRight />
        </button>
 
        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 py-10 hide-scrollbar"
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="testimonial-card flex-shrink-0 w-96 rounded-xl shadow-xl p-6 transition duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-full border-4 border-white -mt-16"
                />
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="designation text-sm font-medium text-black">
                    {item.designation}
                  </p>
                </div>
              </div>
              <p className="testimonial-description text-sm transition-colors">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default TestimonialPopup;