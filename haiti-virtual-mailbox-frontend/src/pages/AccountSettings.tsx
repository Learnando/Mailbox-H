import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "../styles/AccountSettings.css";

const AccountSettings = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) {
      toast.error(t("account.userIdMissing"));
      return;
    }

    try {
      await api.patch(`/users/${user._id}/update-account`, { email, password });
      toast.success(t("account.success"));
    } catch (err) {
      console.error(err);
      toast.error(t("account.error"));
    }
  };

  return (
    <div className="account-settings">
      <h2>⚙️ {t("account.title")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>📧 {t("account.email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>🔒 {t("account.newPassword")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("account.passwordPlaceholder")}
          />
        </div>
        <button type="submit">💾 {t("account.saveChanges")}</button>
      </form>
    </div>
  );
};

export default AccountSettings;
