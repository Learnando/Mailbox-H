import React from "react";
import "../styles/Step4ConfirmSubmit.css";
import ReadMore from "../components/ReadMore";
import { useTranslation } from "react-i18next"; // ✅

interface StepProps {
  formData: {
    customerName: string;
    whatsapp: string;
    sender: string;
    description: string;
    price: string;
    shipping: string;
    delivery: string;
    creditsToUse?: string;
    screenshot: File | null;
  };
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step4ConfirmSubmit = ({ formData, onFileChange }: StepProps) => {
  const { t } = useTranslation(); // ✅

  return (
    <div className="step-container">
      <h3>📋 {t("step4.title")}</h3>

      {/* Review Section */}
      <div className="form-review">
        <p>
          <strong>📦 {t("step4.customerName")}:</strong> {formData.customerName}
        </p>
        <p>
          <strong>📞 {t("step4.whatsapp")}:</strong> {formData.whatsapp}
        </p>
        <p>
          <strong>🛍️ {t("step4.description")}:</strong>{" "}
          <ReadMore text={formData.description} maxLength={100} />
        </p>
        <p>
          <strong>💵 {t("step4.price")}:</strong> ${formData.price}
        </p>
        <p>
          <strong>✈️ {t("step4.shipping")}:</strong> {formData.shipping}
        </p>
        <p>
          <strong>🚚 {t("step4.delivery")}:</strong> {formData.delivery}
        </p>

        <p>
          💳 <strong>{t("step2.creditsUsed")}:</strong>{" "}
          {formData.creditsToUse || "0"}
        </p>

        <p>
          📦 <strong>{t("step2.senderLabel")}:</strong> {formData.sender}
        </p>

        <p>
          <strong>📸 {t("step4.screenshot")}:</strong>{" "}
          {formData.screenshot
            ? formData.screenshot.name
            : t("step4.noScreenshot")}
        </p>
      </div>

      {/* Upload Screenshot Again (Optional) */}
      <div className="form-group">
        <h4>{t("step4.updateScreenshot")}</h4>
        <input
          type="file"
          name="screenshot"
          accept="image/*"
          onChange={onFileChange}
        />
      </div>

      {/* Final Submit Button */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button type="submit" className="submit-btn">
          🚀 {t("step4.submit")}
        </button>
      </div>
    </div>
  );
};

export default Step4ConfirmSubmit;
