import React from "react";
import { AuthContext } from "./authContext";
import { Routes, Route, Navigate } from "react-router-dom";
import SnackBar from "./components/SnackBar";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function renderRoutes(role) {
  switch (role) {
    case "admin":
      console.log(role);
      return (
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      );
    default:
      return (
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      );
  }
}

function Main() {
  const { state } = React.useContext(AuthContext);


  return (
    <div className="h-full">
      <div className="flex w-full">
        <div className="w-full">
          <div className="page-wrapper w-full ">
            {!state.isAuthenticated
              ? renderRoutes("none")
              : renderRoutes(state.role)}
          </div>
        </div>
      </div>
      <SnackBar />
    </div>
  );
}

export default Main;
