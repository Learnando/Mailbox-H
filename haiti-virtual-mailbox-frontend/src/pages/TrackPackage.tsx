import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUserPackages } from "../services/packageService";
import PackageProgress from "../components/PackageProgress";
import "../styles/TrackPackage.css";
import ReadMore from "../components/ReadMore";
import { useTranslation } from "react-i18next"; // ✅

interface Package {
  _id: string;
  trackingNumber?: string;
  description?: string;
  status: string;
  finalFee?: number;
  isPaid?: boolean;
  receiptUrl?: string;
}

const TrackPackage = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation(); // ✅

  useEffect(() => {
    const fetchPackages = async () => {
      if (!user) return;
      try {
        const data = await fetchUserPackages(user._id);
        setPackages(data);
      } catch (err) {
        console.error("Failed to load packages:", err);
      }
    };

    fetchPackages();
  }, [user]);

  const handleReceiptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    packageId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const res = await fetch(
        `http://localhost:5000/api/packages/${packageId}/upload-receipt`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const updated = await res.json();

      setPackages((prev) =>
        prev.map((pkg) =>
          pkg._id === packageId
            ? { ...pkg, receiptUrl: updated.receiptUrl }
            : pkg
        )
      );
    } catch (err) {
      console.error("Failed to upload receipt", err);
    }
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      (pkg.trackingNumber?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (pkg.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "pending") return "badge pending";
    if (normalized === "in transit") return "badge transit";
    if (normalized === "delivered") return "badge delivered";
    if (normalized === "awaiting payment") return "badge warning";
    return "badge default";
  };

  return (
    <div className="track-package">
      <h2>✈️ {t("trackYourPackages")}</h2>

      <input
        type="text"
        className="search-input"
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredPackages.length === 0 ? (
        <p>{t("noPackagesFound")}</p>
      ) : (
        <div className="package-list">
          {filteredPackages.map((pkg) => (
            <div key={pkg._id} className="package-item">
              <div>
                <strong>{pkg.trackingNumber || t("noTracking")}</strong>

                <ReadMore
                  text={pkg.description || t("noDescription")}
                  maxLength={100}
                />

                {pkg.status === "Awaiting Payment" && pkg.finalFee && (
                  <div className="payment-alert">
                    <p style={{ marginTop: "8px", fontWeight: "bold" }}>
                      💵 {t("yourPackageArrived")}
                    </p>
                    <p>
                      {t("shippingFee")}{" "}
                      <strong>${pkg.finalFee.toFixed(2)}</strong>
                    </p>
                    <p>
                      {t("paymentInstructions")}{" "}
                      <strong>{t("cashAppTag")}</strong>
                      <br />
                      {t("uploadReceipt")}
                    </p>

                    {pkg.receiptUrl ? (
                      <p style={{ color: "green", fontWeight: "bold" }}>
                        ✅ {t("receiptUploaded")}
                      </p>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReceiptUpload(e, pkg._id)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span className={getStatusBadge(pkg.status)}>
                {t(pkg.status.toLowerCase().replace(/\s+/g, ""))}
              </span>

              <PackageProgress status={pkg.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackPackage;
