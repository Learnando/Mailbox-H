import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PackageProgress from "../components/PackageProgress";
import { useTranslation } from "react-i18next"; // ✅
import "../styles/PackageDetails.css";

interface PackageData {
  _id: string;
  trackingNumber: string;
  status: string;
  description?: string;
  customerName?: string;
  shipping?: string;
  delivery?: string;
  note?: string;
  createdAt?: string;
}

const PackageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // ✅

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const { data } = await api.get<PackageData>(`/packages/${id}`);
        setPackageData(data);
      } catch (error) {
        console.error("Error loading package:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id]);

  if (loading) {
    return <div className="package-details">{t("loadingDetails")}</div>;
  }

  if (!packageData) {
    return <div className="package-details">{t("notFound")}</div>;
  }

  return (
    <div className="package-details">
      <h2>📦 {t("packageDetails")}</h2>

      <p>
        <strong>{t("trackingNumber")}:</strong> {packageData.trackingNumber}
      </p>

      <p>
        <strong>{t("status")}:</strong> {t(packageData.status.toLowerCase())}
      </p>

      <PackageProgress status={packageData.status} />

      <p>
        <strong>{t("customer")}:</strong> {packageData.customerName || "N/A"}
      </p>

      <p>
        <strong>{t("description")}:</strong>{" "}
        {packageData.description || t("noDescription")}
      </p>

      <p>
        <strong>{t("shippingMethod")}:</strong> {packageData.shipping || "N/A"}
      </p>

      <p>
        <strong>{t("deliveryOption")}:</strong> {packageData.delivery || "N/A"}
      </p>

      {packageData.note && (
        <p>
          <strong>{t("note")}:</strong> {packageData.note}
        </p>
      )}

      {packageData.createdAt && (
        <p>
          <strong>{t("submitted")}:</strong>{" "}
          {new Date(packageData.createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default PackageDetails;
