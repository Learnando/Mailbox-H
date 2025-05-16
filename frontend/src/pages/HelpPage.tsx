import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/HelpPage.css";

const HelpPage = () => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("help.step1.title"),
      description: t("help.step1.description"),
      image: "/help/Account.png",
    },
    {
      title: t("help.step2.title"),
      description: t("help.step2.description"),
      image: "/help/dashboard11.png",
    },
    {
      title: t("help.step3.title"),
      description: t("help.step3.description"),
      image: "/help/submit1.png",
    },
    {
      title: t("help.step4.title"),
      description: t("help.step4.description"),
      image: "/help/TrackPackage1.png",
    },
    {
      title: t("help.step5.title"),
      description: t("help.step5.description"),
      image: "/help/receipt.png",
    },
    {
      title: t("help.step6.title"),
      description: t("help.step6.description"),
      image: "/help/delivered1.png",
    },
  ];

  return (
    <div className="help-page">
      <h1>{t("help.heading")}</h1>
      <p className="help-intro">{t("help.intro")}</p>

      <div className="help-cards">
        {steps.map((step, index) => (
          <div className="help-card" key={index}>
            <img
              src={step.image}
              alt={step.title}
              className="help-card-image"
            />
            <div className="help-card-content">
              <h2>{step.title}</h2>
              <p>{step.description}</p>
              {step.title.includes(t("help.step3.title").split(":")[0]) && (
                <a href="#buyforme" className="jump-link">
                  👉 {t("help.learn_buy_for_me")}
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Buy For Me Section */}
        <div className="help-card" id="buyforme">
          <img
            src="/help/buyforme-buttons.png"
            alt="Buy For Me"
            className="help-card-image"
          />
          <div className="help-card-content">
            <h2>🛍️ {t("help.buy.title")}</h2>
            <p>{t("help.buy.description1")}</p>
            <p
              dangerouslySetInnerHTML={{ __html: t("help.buy.description2") }}
            />
            <ul>
              <li>
                ⏳ <strong>{t("help.buy.status.pending")}</strong> –{" "}
                {t("help.buy.status_text.pending")}
              </li>
              <li>
                💵 <strong>{t("help.buy.status.awaiting")}</strong> –{" "}
                {t("help.buy.status_text.awaiting")}
              </li>
              <li>
                🛒 <strong>{t("help.buy.status.ordered")}</strong> –{" "}
                {t("help.buy.status_text.ordered")}
              </li>
              <li>
                ✈️ <strong>{t("help.buy.status.shipped")}</strong> –{" "}
                {t("help.buy.status_text.shipped")}
              </li>
              <li>
                📬 <strong>{t("help.buy.status.delivered")}</strong> –{" "}
                {t("help.buy.status_text.delivered")}
              </li>
            </ul>
            <p
              dangerouslySetInnerHTML={{ __html: t("help.buy.description3") }}
            />
            <p
              dangerouslySetInnerHTML={{ __html: t("help.buy.description4") }}
            />
          </div>
        </div>

        {/* Language Section */}
        <div className="help-card" id="language">
          <img
            src="/help/language-toggle.png"
            alt="Language Switch"
            className="help-card-image"
          />
          <div className="help-card-content">
            <h2>🌐 {t("help.language.title")}</h2>
            <p>{t("help.language.intro")}</p>
            <ul>
              <li>🔧 {t("help.language.step1")}</li>
              <li>🗣️ {t("help.language.step2")}</li>
              <li>✅ {t("help.language.step3")}</li>
            </ul>
            <p>{t("help.language.outro")}</p>
          </div>
        </div>
      </div>

      <div className="help-footer">
        <Link to="/" className="btn">
          ⬅ {t("help.back")}
        </Link>
      </div>
    </div>
  );
};

export default HelpPage;
