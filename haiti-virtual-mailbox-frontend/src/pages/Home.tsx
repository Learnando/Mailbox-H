import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SupportModal from "../components/SupportModal"; // ✅ import modal

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <h1>{t("home.title")}</h1>
      <p>{t("home.subtitle")}</p>
      <Link to="/register" className="btn">
        {t("home.getStarted")}
      </Link>
      <SupportModal /> {/* ✅ floating support icon */}
    </div>
  );
};

export default Home;
