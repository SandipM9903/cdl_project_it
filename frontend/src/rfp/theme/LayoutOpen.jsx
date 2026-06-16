import React from "react";
import { Outlet } from "react-router-dom";

const LayoutOpen = () => {
  return (
    <div className="flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden">
      <div className="main-content px-2 py-2">{<Outlet />}</div>
    </div>
  );
};

export default LayoutOpen;
