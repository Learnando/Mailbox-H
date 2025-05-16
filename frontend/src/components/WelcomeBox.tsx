import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../styles/WelcomeBox.css";

const WelcomeBox = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  const { name, virtualAddress } = user;
  const firstName = name?.split(" ")[0] || t("welcome.user");

  return (
    <div className="welcome-box">
      <h2>{t("welcome.greeting", { name: firstName })}</h2> {/* ✅ FIXED */}
      <p>{t("welcome.addressLabel")}</p>
      <div className="address-block">
        <pre>
          {name} #{virtualAddress}
          {"\n"}
          1234 NW 55th St
          {"\n"}
          Miami, FL <span className="highlight">33142</span>
        </pre>
        <button
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(
              `${name} #${virtualAddress}\n1234 NW 55th St\nMiami, FL 33142`
            );
            toast.success(t("welcome.copied"));
          }}
        >
          📋 {t("welcome.copy")}
        </button>
      </div>
    </div>
  );
};

export default WelcomeBox;
