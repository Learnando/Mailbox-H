import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const changeLanguage = (lng: "en" | "ht") => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          📦 Bwat Lakay
        </Link>

        <div className="language-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={i18n.language === "ht"}
              onChange={(e) => changeLanguage(e.target.checked ? "ht" : "en")}
            />
            <span className="slider round"></span>
          </label>
          <span className="lang-label">
            {i18n.language === "ht" ? "Kreyòl" : "English"}
          </span>
        </div>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            {user.isAdmin ? (
              <>
                <Link to="/admin/dashboard">{t("nav.dashboard")}</Link>
                <Link to="/admin/users">{t("nav.manageUsers")}</Link>
                <Link to="/admin">{t("nav.managePackages")}</Link>
                <Link to="/admin/manage-requests">
                  {t("nav.manageRequests")}
                </Link>
                <Link to="/admin/support">📨 Support Messages</Link>
                <Link to="/admin/global-message">{t("nav.globalMessage")}</Link>
                <Link to="/admin/generate-reset">
                  🔐 Reset User Password
                </Link>{" "}
                {/* ✅ New Link */}
              </>
            ) : (
              <>
                <Link to="/dashboard">{t("nav.dashboard")}</Link>
                <Link to="/submit">{t("nav.submit")}</Link>
                <Link to="/track">{t("nav.track")}</Link>
              </>
            )}
            <Link to="/account">⚙️ {t("nav.accountSettings")}</Link>
            <Link to="/help">❓ {t("nav.help")}</Link>
            <button onClick={handleLogout} className="logout-btn">
              {t("nav.logout")}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">{t("nav.login")}</Link>
            <Link to="/register">{t("nav.register")}</Link>
            <Link to="/about">{t("nav.about")}</Link> {/* Optional: use t() */}
            <Link to="/faq">❓ {t("nav.faq")}</Link>
            <Link to="/help">❓ {t("nav.help")}</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
