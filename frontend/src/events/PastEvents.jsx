import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import womenDay from "../assets/womenDay.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BreadCrumb.css";
import Event1 from "../assets/Events/eve1.jpeg";
import Foundersday from "../assets/Events/Founderday.jpg";
import ind from "../assets/Events/ind3.jpg";
import onam from "../assets/Events/onam1.jpg";
import Navratri1 from "../assets/Events/WhatsApp Image 2025-09-22 at 6.38.54 PM (1).jpeg";
import Navratri2 from "../assets/Events/WhatsApp Image 2025-09-22 at 6.38.54 PM (2).jpeg";
import Navratri3 from "../assets/Events/WhatsApp Image 2025-09-22 at 6.38.54 PM (3).jpeg";
import Navratri4 from "../assets/Events/WhatsApp Image 2025-09-22 at 6.38.54 PM (4).jpeg";
import Navratri5 from "../assets/Events/WhatsApp Image 2025-09-22 at 6.38.54 PM (5).jpeg";
import Navratri6 from "../assets/Events/WhatsApp Image 2025-09-22 at 6.38.54 PM.jpeg";
import Navratri7 from "../assets/Events/nav-day2.1.jpg";
import Navratri8 from "../assets/Events/nav-day2.2.jpg";
import Navratri9 from "../assets/Events/nav-day2.jpg";
import Navratri10 from "../assets/Events/nav-day3.1.jpg";
import Navratri11 from "../assets/Events/nav-day3.2.jpg";
import Navratri12 from "../assets/Events/nav-day3.jpg";

import Navratri13 from "../assets/Events/MasterChef/1000050564.jpg";
import Navratri14 from "../assets/Events/MasterChef/1000050568.jpg";
import Navratri15 from "../assets/Events/MasterChef/1000050576.jpg";
import Navratri16 from "../assets/Events/MasterChef/1000050582.jpg";
import Navratri17 from "../assets/Events/MasterChef/1000050583.jpg";
import Navratri18 from "../assets/Events/MasterChef/1000050588.jpg";
import Navratri19 from "../assets/Events/MasterChef/1000050593.jpg";
import Navratri20 from "../assets/Events/MasterChef/1000050595.jpg";
import Navratri21 from "../assets/Events/MasterChef/1000050599.jpg";
import Navratri22 from "../assets/Events/MasterChef/1000050604.jpg";

import Navratri23 from "../assets/Events/nav-yellow.jpg";
import Navratri24 from "../assets/Events/nav-yellow-1.jpg";
import Navratri25 from "../assets/Events/nav-green.jpg";
import Navratri26 from "../assets/Events/Nav-pink.jpg";

import HYD1 from "../assets/Events/HYD OFFICE/1000050781.jpg";
import HYD2 from "../assets/Events/HYD OFFICE/1000050778.jpg";
import HYD3 from "../assets/Events/HYD OFFICE/1000050781.jpg";
import HYD4 from "../assets/Events/HYD OFFICE/1000050784.jpg";
import HYD5 from "../assets/Events/HYD OFFICE/1000050787.jpg";

import Founder1 from "../assets/didyouknow/1761551389672.jpg";
import Founder2 from "../assets/didyouknow/1761551390087.jpg";
import Founder3 from "../assets/didyouknow/1761551390247.jpg";

// ---------- Child Component ----------


const EventGroupDetail = ({ group, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === group.events.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [group.events.length]);

  return (
    <div className="">
   
      <h2 className="text-2xl font-bold text-[#923A39] mb-6">
        {group.name}
      </h2>

      {/* Carousel Wrapper */}
      <div className="relative w-full max-w-5xl mx-auto">
        {/* Carousel Image */}
        <div className="w-full h-[450px] overflow-hidden rounded-lg shadow-md">
          <img
            src={group.events[currentIndex].image}
            alt={group.events[currentIndex].title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>

        {/* Title, Date, Location */}
        <div className="text-center mt-4">
          <h3 className="text-xl font-header font-semibold text-gray-800">
            {group.events[currentIndex].title}
          </h3>
          <p className="text-base text-gray-500 mt-1">
            {group.events[currentIndex].date} |{" "}
            {group.events[currentIndex].location}
          </p>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-3 space-x-2">
          {group.events.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentIndex ? "bg-[#923A39]" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Event Cards Below Carousel */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {group.events.map((event) => (
          <div
            key={event.id}
            className="bg-white border rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-[200px] object-cover"
            />
            <div className="p-4">
             
              <p className="text-sm text-gray-500 mt-1">
                {event.date} | {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};




// ---------- Parent Component ----------
const PastEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Location");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [activeGroup, setActiveGroup] = useState(null);

  // Grouped Events
  const groupedEvents = [
    {
      name: "Navratri",
      events: [
      { id: 6, date: "22 Sep 2025", title: " Navratri begins with White, symbolizing peace, clarity, and new beginnings. At CMS, we believe clarity drives innovation — every pure idea leads to real-world impact. Wishing you a bright start to Navratri!", description: "Navratri begins with White, symbolizing peace, clarity, and new beginnings. At CMS, we believe clarity drives innovation — every pure idea leads to real-world impact. Wishing you a bright start to Navratri!", image: Navratri1, location: "Mumbai" },

        { id: 7, date: "22 Sep 2025", title: " Navratri begins with White, symbolizing peace, clarity, and new beginnings. At CMS, we believe clarity drives innovation — every pure idea leads to real-world impact. Wishing you a bright start to Navratri!", description: "Navratri begins with White, symbolizing peace, clarity, and new beginnings. At CMS, we believe clarity drives innovation — every pure idea leads to real-world impact. Wishing you a bright start to Navratri!", image: Navratri2, location: "Mumbai" },
        { id: 8, date: "22 Sep 2025", title: " Navratri begins with White, symbolizing peace, clarity, and new beginnings. At CMS, we believe clarity drives innovation — every pure idea leads to real-world impact. Wishing you a bright start to Navratri!", description: "Navratri begins with White, symbolizing peace, clarity, and new beginnings. At CMS, we believe clarity drives innovation — every pure idea leads to real-world impact. Wishing you a bright start to Navratri!", image: Navratri3, location: "Mumbai" },
   { 
  id: 9, 
  date: "23 Sep 2025", 
  
  title: " Red symbolizes energy, determination, and strength. ❤️ Just like Red fuels action, CMS powers progress with passion and technology. Here’s to a Navratri full of courage and drive!", 
  image: Navratri7, 
  location: "Mumbai" 
},
{ 
  id: 10, 
  date: "23 Sep 2025", 
  
  title: " Red continues to inspire energy, determination, and strength. ❤️ From Mumbai to Bangalore, CMS teams power progress with passion and innovation. Here's to another powerful day of Navratri!", 
  image: Navratri8, 
  location: "Bangalore" 
},

{ 
  id: 11, 
  date: "24 Sep 2025", 
 
   title: "Royal Blue stands for depth, trust, and stability. At CMS, we’ve built decades of trust — creating solutions that are as reliable as they are innovative.", 
  image: Navratri25, 
  location: "Mumbai" 
},
{ 
  id: 12, 
  date: "24 Sep 2025", 
  title: "Royal Blue reflects trust and stability — values that guide CMS across all locations. In Bangalore, our teams continue to build on a legacy of reliable innovation.", 
  image: Navratri25, 
  location: "Bangalore" 
},
 { 
    id: 29, 
    date: "26 Sep 2025", 
    title: "Yellow brings joy, energy, and positivity. At CMS, we embrace the power of optimism to light the way for brighter possibilities.", 
    image: Navratri23, 
    location: "Mumbai" 
  },
  { 
    id: 30, 
    date: "26 Sep 2025", 
    title: "Yellow brings joy, energy, and positivity. At CMS, we embrace the power of optimism to light the way for brighter possibilities.", 
    image: Navratri24, 
    location: "Bangalore" 
  },
{ 
    id: 31, 
    date: "29 Sep 2025", 
    title: "Green symbolizes renewal, growth, and prosperity. Just as green nurtures life, CMS nurtures digital growth across industries.", 
    image: Navratri10, 
    location: "Mumbai" 
  },
  { 
    id: 32, 
    date: "24 Sep 2025", 
    title: "Green symbolizes renewal, growth, and prosperity. Just as green nurtures life, CMS nurtures digital growth across industries.", 
    image: Navratri11, 
    location: "Bangalore" 
  },
 { 
  id: 33, 
  date: "24 Sep 2025", 
  title: "Navratri ends with pink, symbolizing love, harmony, and universal compassion. At CMS, we celebrate the power of togetherness and collective growth.", 
  image: Navratri26, 
  location: "Mumbai" 
},


      ],
    },
    {
      name: "Hyderabad Office Inauguration",
      events: [
        { id: 34, date: "24 Sep 2025", title: "we proudly inaugurated our Hyderabad office, marking another milestone in our journey of growth and innovation. The event was graced by our esteemed leaders, who shared valuable insights and inspired our teams for the exciting road ahead.", image: HYD1, location: "Hyderabad" },
        { id: 35, date: "24 Sep 2025", title: "we proudly inaugurated our Hyderabad office, marking another milestone in our journey of growth and innovation. The event was graced by our esteemed leaders, who shared valuable insights and inspired our teams for the exciting road ahead.", image: HYD2, location: "Hyderabad" },
        { id: 36, date: "24 Sep 2025", title: "we proudly inaugurated our Hyderabad office, marking another milestone in our journey of growth and innovation. The event was graced by our esteemed leaders, who shared valuable insights and inspired our teams for the exciting road ahead.", image: HYD3, location: "Hyderabad" },
        { id: 37, date: "24 Sep 2025", title: "we proudly inaugurated our Hyderabad office, marking another milestone in our journey of growth and innovation. The event was graced by our esteemed leaders, who shared valuable insights and inspired our teams for the exciting road ahead.", image: HYD4, location: "Hyderabad" },
        { id: 38, date: "24 Sep 2025", title: "we proudly inaugurated our Hyderabad office, marking another milestone in our journey of growth and innovation. The event was graced by our esteemed leaders, who shared valuable insights and inspired our teams for the exciting road ahead.", image: HYD5, location: "Hyderabad" },
        
      ],
    },
    {
      name: "MasterChef",
      events: [
        { id: 19, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image:  Navratri19, location: "Mumbai" },
        { id: 20, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image: Navratri14, location: "Mumbai" },
        { id: 21, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image: Navratri15, location: "Mumbai" },
        { id: 22, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image: Navratri16, location: "Mumbai" },
        { id: 23, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image: Navratri17, location: "Mumbai" },
        { id: 24, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image: Navratri18, location: "Mumbai" },
        { id: 25, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image: Navratri13, location: "Mumbai" },
        { id: 26, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image: Navratri20, location: "Mumbai" },
        { id: 27, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image: Navratri21, location: "Mumbai" },
        { id: 28, date: "24 Sep 2025", title: "Colleagues showcased their cooking skills in our 'Star Chef Competition'. From unique flavors to stunning presentations, each participant brought something special to the table. Take a look at the highlights!", image: Navratri22, location: "Mumbai" },
      ],
    },
    {
      name: "Women’s Day",
      events: [{ id: 5, date: "08 Mar 2025", title: "Women’s Day Celebration", image: womenDay, location: "Delhi" }],
    },
    {
      name: "Onam",
      events: [{ id: 4, date: "6 Sep 2024", title: "Onam Celebration", image: onam, location: "Hyderabad" }],
    },
    {
      name: "Founder's Day",
      events: [{ id: 2, date: "24 Oct 2024", title: "Founder's Day Celebration", image: Foundersday, location: "Mumbai" }],
    },
    {
      name: "Independence Day",
      events: [{ id: 3, date: "15 Aug 2024", title: "Independence Day Celebration", image: ind, location: "Bangalore" }],
    },
    {
      name: "International Day of Yoga",
      events: [{ id: 1, date: "20 Jun 2025", title: "International Day of Yoga", image: Event1, location: "Delhi" }],
    },

 {
      name: "Founder's Day 2025",
      events: [{ id: 3, date: "24 Oct 2025", title: "On October 24, 2025, the CMS family came together across all our locations to celebrate Founder’s Day, honouring Mr. Ramesh D. Grover (RDG) — the visionary who laid the foundation of CMS Computers. His values, vision, and leadership continue to guide and inspire us as we move forward together in our mission of Simplifying Life", image: Founder1, location: "Mumbai" }],
    },
     {
      name: "Founder's Day 2025",
      events: [{ id: 4,date: "24 Oct 2025", title: "On October 24, 2025, the CMS family came together across all our locations to celebrate Founder’s Day, honouring Mr. Ramesh D. Grover (RDG) — the visionary who laid the foundation of CMS Computers. His values, vision, and leadership continue to guide and inspire us as we move forward together in our mission of Simplifying Life", image: Founder2, location: "Mumbai" }],
    },
     {
      name: "Founder's Day 2025",
      events: [{ id: 5, date: "24 Oct 2025", title: "On October 24, 2025, the CMS family came together across all our locations to celebrate Founder’s Day, honouring Mr. Ramesh D. Grover (RDG) — the visionary who laid the foundation of CMS Computers. His values, vision, and leadership continue to guide and inspire us as we move forward together in our mission of Simplifying Life", image: Founder3, location: "Mumbai" }],
    },
    

  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  if (activeGroup) {
    return <EventGroupDetail group={activeGroup} onBack={() => setActiveGroup(null)} />;
  }

  return (
    <div>
      <div className="mt-10">
        <h1 className="font-raleway font-semibold text-[28px] md:text-[30px] text-[#923A39]">
          Recent Events
        </h1>
      </div>

      <div className="mt-6 w-full max-w-[1200px] mx-auto overflow-hidden rounded-lg">
        <Slider {...settings}>
          {groupedEvents.flatMap((group) => group.events).slice(0, 5).map((event) => (
            <div key={event.id} className="relative h-[400px] md:h-[500px]">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-lg" />
              <div className="absolute bottom-4 left-4 z-10 text-white text-lg font-header md:text-xl font-semibold bg-black bg-opacity-60 px-4 py-2 rounded">
                {event.title}
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="mt-12">
        <h2 className="font-raleway font-semibold text-[28px] md:text-[30px] text-[#923A39] mb-6">
          Past Events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {groupedEvents.map((group) => (
            <div
              key={group.name}
              onClick={() => setActiveGroup(group)}
              className="cursor-pointer bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img
                src={group.events[0].image}
                alt={group.name}
                className="w-full h-[200px] object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  {group.events[0].date} | {group.events[0].location}
                </p>
                <h3 className="text-sm font-header font-semibold mt-1">
                  {group.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastEvents;
