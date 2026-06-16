import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
function PrivateRoutes() {
  const [restrict, setRestrict] = useState(false);
  return <div>{restrict ? <Navigate to="/home" /> : <Outlet />}</div>;
}

export default PrivateRoutes;
