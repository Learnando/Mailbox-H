import React from "react";
import { useTranslation } from "react-i18next";

interface StepProps {
  formData: {
    description: string;
    price: string;
    sender: string;
    creditsToUse?: string; // ✅ Add this
  };
  availableCredits: number; // ✅ Add this prop
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const Step2PackageDetails = ({
  formData,
  availableCredits,
  onChange,
}: StepProps) => {
  const { t } = useTranslation();

  return (
    <div className="step-container">
      <h3>📦 {t("step2.title")}</h3>

      {/* Product Description */}
      <div className="form-group">
        <h4>{t("step2.descriptionLabel")}</h4>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder={t("step2.descriptionPlaceholder")}
          rows={4}
          required
        />
      </div>

      {/* Product Price */}
      <div className="form-group">
        <h4>{t("step2.priceLabel")}</h4>
        <div className="price-input-group">
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={onChange}
            placeholder={t("step2.pricePlaceholder")}
            required
          />
          <span className="usd-badge">USD</span>
        </div>
      </div>

      {/* Sender Name */}
      <div className="form-group">
        <h4>{t("step2.senderLabel")}</h4>
        <input
          type="text"
          name="sender"
          value={formData.sender}
          onChange={onChange}
          placeholder={t("step2.senderPlaceholder")}
          required
        />
      </div>

      {/* ✅ Apply Referral Credits */}
      <div className="form-group">
        <h4>💳 {t("step2.creditsUsed")}</h4>

        <input
          type="number"
          name="creditsToUse"
          min={0}
          max={availableCredits}
          value={formData.creditsToUse ?? ""}
          onChange={onChange}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default Step2PackageDetails;
