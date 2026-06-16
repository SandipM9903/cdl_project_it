import React from "react";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className=" flex items-center justify-center">
      <strong>Login</strong>
      <Link to={"/app"} className="flex items-center gap-2 mr-1 ">
        <HiOutlineDocumentChartBar /> Go to Dashboard
      </Link>
    </div>
  );
}
