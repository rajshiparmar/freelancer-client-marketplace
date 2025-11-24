import { Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { parseJwt } from "../utils/jwtHelper"
import React from "react";

const RoleRoute = ({ children, role }) => {
    const token = localStorage.getItem("token");
  
    if (!token) return <Navigate to="/login" replace />;
  
    const decoded = parseJwt(token);
    if (decoded.role !== role) return <Navigate to="/login" replace />;
  
    return children;
  };
  
export default RoleRoute;