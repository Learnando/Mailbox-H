import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PackageDetails from "./pages/PackageDetails";
import PackageForm from "./pages/PackageForm";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import TrackPackage from "./pages/TrackPackage";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminDashboard from "./pages/AdminDashboard";
import PurchaseRequestForm from "./components/PurchaseRequestForm";
import AdminPurchaseRequests from "./pages/AdminPurchaseRequests";
import MyPurchaseRequests from "./pages/MyPurchaseRequests";
import AdminManageRequests from "./pages/AdminManageRequests";
import AdminGlobalMessage from "./pages/AdminGlobalMessage";
import AdminSupportMessages from "./pages/AdminSupportMessages";
import HelpPage from "./pages/HelpPage";
import TermsPage from "./pages/TermsPage";
import AboutPage from "./pages/AboutPage";
import AccountSettings from "./pages/AccountSettings";
import FAQPage from "./pages/FAQPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminGenerateResetLink from "./pages/AdminGenerateResetLink";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";
import "./styles/GlobalBanner.css";
import api from "./services/api";

const App = () => {
  const [globalMessage, setGlobalMessage] = useState("");

  useEffect(() => {
    const fetchGlobalMessage = async () => {
      try {
        const res = await api.get<{ message: string }>(
          "/settings/global-message"
        );
        setGlobalMessage(res.data.message);
      } catch (err) {
        console.error("Failed to fetch global message:", err);
      }
    };

    fetchGlobalMessage();
  }, []);

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={4000} />

      {globalMessage.trim() !== "" && (
        <div className="global-banner">{globalMessage}</div>
      )}

      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/package/:id" element={<PackageDetails />} />
          <Route path="/track" element={<TrackPackage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />

          {/* 🔒 Protected routes for users */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <PrivateRoute>
                <PackageForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/buy-for-me"
            element={
              <PrivateRoute>
                <PurchaseRequestForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <PrivateRoute>
                <MyPurchaseRequests />
              </PrivateRoute>
            }
          />

          {/* 🔒 Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <AdminRoute>
                <AdminPurchaseRequests />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-requests"
            element={
              <AdminRoute>
                <AdminManageRequests />
              </AdminRoute>
            }
          />

          <Route path="/admin/support" element={<AdminSupportMessages />} />

          <Route
            path="/admin/global-message"
            element={
              <AdminRoute>
                <AdminGlobalMessage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/generate-reset"
            element={
              <AdminRoute>
                <AdminGenerateResetLink />
              </AdminRoute>
            }
          />
        </Routes>
      </div>

      {/* ✅ Footer */}
      <footer className="app-footer">
        <Link to="/terms"> 📄 Read our full Terms and Conditions</Link>
      </footer>
    </Router>
  );
};

export default App;
