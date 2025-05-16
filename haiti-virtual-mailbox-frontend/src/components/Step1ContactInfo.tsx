import React from "react";
import { useTranslation } from "react-i18next"; // ✅

interface StepProps {
  formData: {
    customerName: string;
    whatsapp: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step1ContactInfo = ({ formData, onChange }: StepProps) => {
  const { t } = useTranslation(); // ✅

  return (
    <div className="step-container">
      <h3>👤 {t("step1.title")}</h3>
      <input
        type="text"
        name="customerName"
        value={formData.customerName}
        onChange={onChange}
        placeholder={t("step1.customerName")}
        required
      />
      <input
        type="text"
        name="whatsapp"
        value={formData.whatsapp}
        onChange={onChange}
        placeholder={t("step1.phone")}
        required
      />
    </div>
  );
};

export default Step1ContactInfo;
