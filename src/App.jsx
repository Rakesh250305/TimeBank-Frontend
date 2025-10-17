import "./App.css";
import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Services from "./pages/Service";
import Home from "./pages/Home";
import Account from "./pages/Account";
import CreateService from "./pages/CreateService";
import MyServices from "./pages/MyService";
import EditService from "./pages/EditService";
import AppliedServices from "./pages/AppliedServices";
import Notification from "./pages/Notification";
import Transactions from "./pages/Transactions";
import About from "./components/About";
import Contact from "./components/Contact";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import Community from "./components/Community";
import ApplicantProfile from "./pages/ApplicantProfile";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored && stored !== token) {
      setToken(stored);
    }
  }, [token]);

  // ✅ logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <>
      <HashRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/community" element={<Community />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              token ? (
                <Profile token={token} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/service"
            element={
              token ? (
                <Services token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/create-service"
            element={
              token ? (
                <CreateService token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/my-services"
            element={
              token ? (
                <MyServices token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/my-services/:id"
            element={
              token ? (
                <MyServices token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/edit-service/:id"
            element={
              token ? (
                <EditService token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/applied-services"
            element={
              token ? (
                <AppliedServices token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/applied-services/:id"
            element={
              token ? (
                <AppliedServices token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/account"
            element={
              token ? (
                <Account token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              token ? (
                <Notification token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/transactions"
            element={
              token ? (
                <Transactions token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/applicant/:id"
            element={
              token ? (
                <ApplicantProfile token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        closeButton={false} // hide close button for all toasts
        toastStyle={{ background: "transparent", boxShadow: "none" }} // transparent bg globally
      />
    </>
  );
}

export default App;
