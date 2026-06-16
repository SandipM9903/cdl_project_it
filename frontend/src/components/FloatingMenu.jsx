import React, { useState, useEffect, useRef } from "react";
import { FaBars } from "react-icons/fa";
 
// Custom icons
import holidaysIcon from "../assets/Icons/holidays.png";
import indIcon from "../assets/Icons/ind.png";
import learningsIcon from "../assets/Icons/learnings.png";
import performanceIcon from "../assets/Icons/performance.png";
import whatsnewIcon from "../assets/Icons/whatsnew.png";
 
const iconSize = 60;
 
const FloatingMenu = () => {
  const iconRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);
 
  const getInitialPosition = () => {
    const padding = 100;
    return {
      top: padding,
      left: window.innerWidth - padding,
    };
  };
 
  const [position, setPosition] = useState(getInitialPosition);
 
  const buttons = [
    { label: "Bulletin", icon: holidaysIcon, sectionId: "bulletinCard", color: "bg-red-200" },
    { label: "Quick Links", icon: indIcon, sectionId: "quickLinks", color: "bg-red-200" },
    { label: "Essentials", icon: learningsIcon, sectionId: "essentialsSection", color: "bg-red-200" },
    { label: "Milestone", icon: performanceIcon, sectionId: "milestoneSection", color: "bg-red-200" },
    { label: "Whats New", icon: whatsnewIcon, sectionId: "whatsNewSection", color: "bg-red-200" },
  ];
 
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setWasDragged(true);
      const newLeft = e.clientX - 30;
      const newTop = e.clientY - 30;
      setPosition({
        top: Math.max(10, Math.min(window.innerHeight - 60, newTop)),
        left: Math.max(10, Math.min(window.innerWidth - 60, newLeft)),
 
      });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);
 
  useEffect(() => {
    const handleResize = () => {
      if (!wasDragged) setPosition(getInitialPosition());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [wasDragged]);
 
  const toggleMenu = () => setIsOpen((prev) => !prev);
 
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false); // Close menu after scroll
    }
  };
 
  const TooltipButton = ({ icon, label, onClick, color }) => (
    <div className="relative flex items-center justify-center group">
      {/* Tooltip */}
      <div
        className="absolute top-[-25%] transform -translate-y-1/2 bg-slate-200 text-black text-xs px-3 py-1 rounded shadow-md whitespace-nowrap
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
      >
        {label}
      </div>
 
      {/* Icon Button */}
      <button
        onClick={onClick}
        className={`${color} bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-90 transition transform hover:scale-110`}
      >
        <img src={icon} alt={label} className="w-8 h-8" />
      </button>
    </div>
  );
 
  const showAbove = position.top > window.innerHeight / 2;
 
  return (
    <>
      {/* Draggable toggle icon */}
      <div
        ref={iconRef}
        onMouseDown={() => setDragging(true)}
        onClick={toggleMenu}
        style={{ top: position.top, left: position.left }}
        className="fixed z-50 cursor-move bg-black bg-opacity-50 text-white p-3 rounded-full shadow-lg hover:bg-opacity-80 transition"
      >
        <FaBars size={30} />
      </div>
 
      {/* Floating button list */}
      {isOpen && (
        <div
          className={`fixed z-40 flex ${showAbove ? "flex-col-reverse" : "flex-col"} gap-3 transition-all duration-300`}
          style={{
            top: showAbove
              ? position.top - iconSize * buttons.length - 40
              : position.top + iconSize + 10,
            left: position.left,
          }}
        >
          {buttons.map((btn, idx) => (
            <TooltipButton
              key={idx}
              icon={btn.icon}
              label={btn.label}
              onClick={() => scrollToSection(btn.sectionId)}
              color={btn.color}
            />
          ))}
        </div>
      )}
    </>
  );
};
 
export default FloatingMenu;