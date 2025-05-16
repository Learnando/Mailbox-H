import { useTranslation } from "react-i18next";
import "../styles/AboutPage.css";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t("about.title")}</h1>

      <section className="mb-6">
        <p>{t("about.intro1")}</p>
        <p className="mt-2">{t("about.intro2")}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {t("about.problemTitle")}
        </h2>
        <p>{t("about.problem1")}</p>
        <p className="mt-2">{t("about.problem2")}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {t("about.solutionTitle")}
        </h2>
        <p>{t("about.solution1")}</p>
        <p className="mt-2">{t("about.solution2")}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t("about.whyTitle")}</h2>
        <p>{t("about.why")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t("about.visionTitle")}</h2>
        <p>{t("about.vision")}</p>
      </section>
    </div>
  );
};

export default AboutPage;
