import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/FAQPage.css";

const FAQPage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  const categories = [
    "general",
    "payments",
    "customs",
    "tracking",
    "location",
    "security",
    "prohibited",
  ];

  return (
    <div className="faq-container">
      <h1>{t("faq.title")}</h1>
      {categories.map((categoryKey) => {
        const categoryTitle = t(`faq.categories.${categoryKey}`);
        const questions = t(`faq.${categoryKey}`, {
          returnObjects: true,
        }) as Array<{ q: string; a: string }>;

        return (
          <div key={categoryKey} className="faq-section">
            <h2 onClick={() => toggleCategory(categoryKey)}>
              {categoryTitle} {activeCategory === categoryKey ? "−" : "+"}
            </h2>
            {activeCategory === categoryKey && (
              <ul>
                {questions.map((item, index) => (
                  <li key={index}>
                    <strong>❓ {item.q}</strong>
                    <p>📘 {item.a}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FAQPage;
