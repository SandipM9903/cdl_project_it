import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
const Theme = () => {
  return (
    <div className="flex flex-row bg-neutral-100 h-full w-full">
       <Header/>
      <div className="w-full h-full overflow-y-auto mt-20">
        <div className="main-content px-2 py-2 mb-1">{<Outlet />}</div>
      </div>
    </div>
  );
};
export default Theme;