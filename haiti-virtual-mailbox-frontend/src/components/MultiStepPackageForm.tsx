import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/MultiStepPackageForm.css"; // We'll style later

const MultiStepPackageForm = () => {
  const [step, setStep] = useState(1);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    customerName: "",
    whatsapp: "",
    description: "",
    price: "",
    shipping: "air",
    delivery: "pickup",
    note: "",
    screenshot: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);

  return (
    <div className="multi-step-form">
      <h2>
        📦 {t("submit.title")} ({t("step")} {step}/4)
      </h2>

      {/* Step 1: Customer Info */}
      {step === 1 && (
        <>
          <label>{t("submit.nameLabel")}</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder={t("submit.namePlaceholder")}
            required
          />

          <label>{t("submit.whatsappLabel")}</label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder={t("submit.whatsappPlaceholder")}
            required
          />

          <div className="button-group">
            <button onClick={nextStep}>{t("next")} ➡️</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiStepPackageForm;
