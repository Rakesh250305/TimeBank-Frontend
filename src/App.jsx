import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import DeleteAccount from "./components/DeleteAccount";
import InstallPWA from "./components/InstallPWA";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllUsers from "./pages/admin/AllUsers";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./admin/AdminLayout";
import AllServices from "./pages/admin/AllServices";
import ReportIssue from "./components/ReportIssue";
import AllReports from "./pages/admin/AllReports";
import AllContacts from "./pages/admin/AllContacts";
import BroadcastNotification from "./pages/admin/BroadcastNotification";
import AllTransactions from "./pages/admin/AllTransactions";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// function to decode JWT token
function decodeToken(token) {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored && stored !== token) {
      setToken(stored);
    }

    // decode token to get userId
    if(stored) {
      const decoded = decodeToken(stored);
      if(decoded && decoded.id) {
        setUserId(decoded.id);
      }
    }
  }, [token]);

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserId(null);
  };

  return (
    <>
      <BrowserRouter>
      <ScrollToTop/>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/community" element={<Community />} />
          <Route path="delete-account" element={<DeleteAccount/>}/>
          <Route path="/report" element={<ReportIssue/>} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/forgetPassword" element={<ForgotPassword/>} />

          {/* Protected routes */}
          <Route path="/profile" element={
              token ? (
                <Profile token={token} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/service" element={
              token ? (
                <Services token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/create-service" element={
              token ? (
                <CreateService token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/my-services" element={
              token ? (
                <MyServices token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/edit-service/:id" element={
              token ? (
                <EditService token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/applied-services" element={
              token ? (
                <AppliedServices token={token} userId={userId}/>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/account" element={
              token ? (
                <Account token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/notifications" element={
              token ? (
                <Notification token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/transactions" element={
              token ? (
                <Transactions token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/applicant/:id" element={
              token ? (
                <ApplicantProfile token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* for admin */}
            <Route path="/adminLogin" element={<AdminLogin/>}></Route>

            <Route path="/admin" element={<AdminProtectedRoute/>}>
            <Route element={<AdminLayout/>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AllUsers/>} />
              <Route path="services" element={<AllServices/>} />
              <Route path="transactions" element={<AllTransactions/>} />
              <Route path="reports" element={<AllReports/>} />
              <Route path="broadcast" element={<BroadcastNotification/>} />
              <Route path="contacts" element={<AllContacts/>} />
            </Route>
          </Route>


          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

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
        closeButton={false}
        toastStyle={{ background: "transparent", boxShadow: "none" }}
      />
      <InstallPWA/>
      {/* button to install of PWA */}
    </>
  );
}

export default App;
