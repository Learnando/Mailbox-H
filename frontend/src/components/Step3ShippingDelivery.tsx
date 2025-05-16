import React from "react";
import { useTranslation } from "react-i18next"; // ✅

interface StepProps {
  formData: {
    shipping: string;
    delivery: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step3ShippingDelivery = ({ formData, onChange }: StepProps) => {
  const { t } = useTranslation(); // ✅

  return (
    <div className="step-container">
      <h3>✈️ {t("step3.title")}</h3>

      {/* Shipping Method Section */}
      <div className="form-group">
        <h4>{t("step3.shippingLabel")}</h4>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="shipping"
              value="air"
              checked={formData.shipping === "air"}
              onChange={onChange}
            />
            ✈️ {t("step3.air")}
          </label>
          <label>
            <input
              type="radio"
              name="shipping"
              value="sea"
              checked={formData.shipping === "sea"}
              onChange={onChange}
            />
            🚢 {t("step3.sea")}
          </label>
        </div>
      </div>

      {/* Delivery Option Section */}
      <div className="form-group">
        <h4>{t("step3.deliveryLabel")}</h4>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="delivery"
              value="pickup"
              checked={formData.delivery === "pickup"}
              onChange={onChange}
            />
            🏢 {t("step3.pickup")}
          </label>
          <label>
            <input
              type="radio"
              name="delivery"
              value="home"
              checked={formData.delivery === "home"}
              onChange={onChange}
            />
            🏠 {t("step3.home")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step3ShippingDelivery;
