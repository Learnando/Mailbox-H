import { useState } from "react";
import "../styles/PackageCard.css";
import { useTranslation } from "react-i18next"; // ✅

interface PackageProps {
  _id: string;
  trackingNumber: string;
  status: string;
  sender?: string;
  description?: string;
  createdAt?: string;
  screenshotUrl?: string;
  onDelete?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const PackageCard = ({
  _id,
  trackingNumber,
  status,
  sender,
  description,
  createdAt,
  screenshotUrl,
  onDelete,
  onCancel,
}: PackageProps) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { t } = useTranslation(); // ✅

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleDescription = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="package-card horizontal">
      {screenshotUrl && (
        <div className="left-section">
          <img
            src={`http://localhost:5000${screenshotUrl}`}
            alt="Screenshot"
            className="screenshot-image"
            onClick={() => setShowPreview(true)}
          />
        </div>
      )}

      <div className="right-section">
        <div className="card-header">
          <h3>
            📦 {t("card.tracking")}: {trackingNumber}
            <button onClick={handleCopy} className="copy-btn">
              {copied ? t("card.copied") : t("card.copy")}
            </button>
          </h3>
          {onDelete && (
            <button className="delete-btn" onClick={() => onDelete(_id)}>
              🗑️
            </button>
          )}
        </div>

        <p>
          <strong>{t("card.status")}:</strong>{" "}
          <span
            className={`badge badge-${status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {t(`statuses.${status.toLowerCase().replace(/\s+/g, "")}`)}
          </span>
        </p>

        {sender && (
          <p>
            <strong>{t("card.sender")}:</strong> {sender}
          </p>
        )}

        {description && (
          <p className={expanded ? "description expanded" : "description"}>
            <strong>{t("card.description")}:</strong>{" "}
            {expanded || description.length <= 100
              ? description
              : `${description.slice(0, 100)}... `}
            {description.length > 100 && (
              <button onClick={toggleDescription} className="read-more-btn">
                {expanded ? t("card.readLess") : t("card.readMore")}
              </button>
            )}
          </p>
        )}

        {createdAt && (
          <p>
            <strong>{t("card.submitted")}:</strong>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
        )}

        {status === "Delivered" && (
          <div className="delivery-message">
            <div className="icon">✔️</div>
            <div className="message-text">
              <strong>{t("card.ready")}</strong>
              <p>{t("card.pickupNote")}</p>
            </div>
          </div>
        )}

        {onCancel &&
          (status === "Pending" || status === "Awaiting Payment") && (
            <button className="cancel-btn" onClick={() => onCancel(_id)}>
              ❌ {t("card.cancel")}
            </button>
          )}
      </div>

      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowPreview(false)}>
              ❌
            </button>
            <img
              src={`http://localhost:5000${screenshotUrl}`}
              alt="Large Screenshot"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageCard;
