import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";

const AppLayout: React.FC = () => {
  return (
    <div className="layout-content">
      {/* Header component can be included here if needed */}
     <Navbar />

      {/* Main content area where nested routes will be rendered */}
      <div className="main-content">
        {/* This is where the nested routes will be rendered */}
        <Outlet />
      </div>
    </div>
  );
};
export default AppLayout;
