import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/TermsPage.css";

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="terms-container">
      <h1>📄 {t("terms.title")}</h1>
      <p>{t("terms.intro")}</p>

      <h2>{t("terms.section1.title")}</h2>
      <p>{t("terms.section1.content")}</p>

      <h2>{t("terms.section2.title")}</h2>
      <ul>
        <li>{t("terms.section2.point1")}</li>
        <li>{t("terms.section2.point2")}</li>
        <li>{t("terms.section2.point3")}</li>
      </ul>

      <h2>{t("terms.section3.title")}</h2>
      <p>{t("terms.section3.content")}</p>

      <h2>{t("terms.section4.title")}</h2>
      <p>{t("terms.section4.content")}</p>

      <h2>{t("terms.section5.title")}</h2>
      <p>{t("terms.section5.content")}</p>

      <h2>{t("terms.section6.title")}</h2>
      <p>{t("terms.section6.content")}</p>

      <h2>{t("terms.section7.title")}</h2>
      <p>
        {t("terms.section7.content")}{" "}
        <a href="mailto:bwatlakay@gmail.com">bwatlakay@gmail.com</a>
      </p>

      <div className="terms-footer">
        <Link to="/">{t("terms.back")}</Link>
      </div>
    </div>
  );
};

export default TermsPage;
