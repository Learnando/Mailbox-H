import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PackageCard from "../components/PackageCard";
import { fetchUserPackages } from "../services/packageService";
import api from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";
import ReviewForm from "../components/ReviewForm"; // ✅ NEW
import "../styles/Dashboard.css";

interface UserPackage {
  _id: string;
  trackingNumber?: string;
  status: string;
  sender?: string;
  description?: string;
  createdAt?: string;
  screenshotUrl?: string;
  rating?: number; // ✅ NEW
  review?: string; // ✅ NEW
}

const Dashboard = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPackages = async () => {
      if (!user) return;
      try {
        const data: UserPackage[] = await fetchUserPackages(user._id);
        const sorted = [...data].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setPackages(sorted);
      } catch (err) {
        console.error("Failed to load packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [user]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(t("confirmRemove"));
    if (!confirm) return;
    try {
      await api.delete(`/packages/user-delete/${id}`);
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      toast.success(t("removed"));
    } catch (err) {
      console.error("Failed to remove package from user view:", err);
      toast.error(t("removeFail"));
    }
  };

  const handleCancel = async (id: string) => {
    const confirm = window.confirm(t("confirmCancel"));
    if (!confirm) return;
    try {
      await api.patch(`/packages/${id}/cancel`);
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg._id === id ? { ...pkg, status: "Cancelled" } : pkg
        )
      );
      toast.success(t("cancelled"));
    } catch (err) {
      console.error("Failed to cancel package:", err);
      toast.error(t("cancelFail"));
    }
  };

  const firstName = user?.name?.split(" ")[0] || t("user");

  const totalPackages = packages.length;
  const pending = packages.filter((p) => p.status === "Pending").length;
  const inTransit = packages.filter(
    (p) => p.status === "Purchased" || p.status === "Shipped"
  ).length;
  const delivered = packages.filter((p) => p.status === "Delivered").length;

  let badgeText = t("badge.newbie");
  let badgeClass = "newbie";

  if (totalPackages >= 7) {
    badgeText = t("badge.vip");
    badgeClass = "vip";
  } else if (totalPackages >= 6) {
    badgeText = t("badge.gold");
    badgeClass = "gold";
  } else if (totalPackages >= 5) {
    badgeText = t("badge.silver");
    badgeClass = "silver";
  } else if (totalPackages >= 4) {
    badgeText = t("badge.bronze");
    badgeClass = "bronze";
  }

  return (
    <div className="dashboard">
      <h2>👏{t("welcome.greeting", { name: firstName })}</h2>

      <div className="badge-container">
        <div className={`loyalty-badge ${badgeClass}`}>{badgeText}</div>
      </div>

      <div className="referral-credits-box">
        <p>
          💳 <strong>{t("referral.credits")}:</strong>{" "}
          <span>{user?.credits ?? 0}</span>
        </p>
      </div>

      {user?.referralCode && (
        <div className="referral-box">
          <p>
            🔗 <strong>{t("referral.code")}:</strong>{" "}
            <code>{user.referralCode}</code>
          </p>
          <p>
            {t("referral.share")}{" "}
            <code>{`${window.location.origin}/register?ref=${user.referralCode}`}</code>
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/register?ref=${user.referralCode}`
              );
              toast.success(t("referral.copied"));
            }}
          >
            📋 {t("referral.copyButton")}
          </button>
        </div>
      )}

      <div className="greeting-container">
        <p>{t("addressTitle")}</p>
        <div className="address-box">
          <pre>
            {user?.name} #{user?.virtualAddress}
            {"\n"}1234 NW 55th St
            {"\n"}Miami, FL <span className="highlight">33142</span>
          </pre>
          <button
            className="copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(
                `${user?.name} #${user?.virtualAddress}\n1234 NW 55th St\nMiami, FL 33142`
              );
              toast.success(t("copied"));
            }}
          >
            📋 {t("copy")}
          </button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="card total">
          <h3>{t("total")} 📦</h3>
          <p>{totalPackages}</p>
        </div>
        <div className="card pending">
          <h3>{t("pending")} 🛒</h3>
          <p>{pending}</p>
        </div>
        <div className="card in-transit">
          <h3>{t("inTransit")} ✈️</h3>
          <p>{inTransit}</p>
        </div>
        <div className="card delivered">
          <h3>{t("delivered")} 🚚</h3>
          <p>{delivered}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/submit">
          <button className="submit-package-button">
            ➕ {t("submitPackage")}
          </button>
        </Link>
        <Link to="/buy-for-me">
          <button className="submit-package-button">🛍️ {t("buyForMe")}</button>
        </Link>
        <Link to="/my-requests">
          <button className="submit-package-button">
            🛒 {t("myRequests")}
          </button>
        </Link>
      </div>

      <h3>{t("yourPackages")}:</h3>
      {loading ? (
        <Spinner />
      ) : packages.length === 0 ? (
        <p>{t("noPackages")}</p>
      ) : (
        packages.map((pkg) => (
          <div key={pkg._id} style={{ marginBottom: "30px" }}>
            {pkg.status === "Delivered" && !pkg.rating && (
              <ReviewForm
                packageId={pkg._id}
                onSubmitted={() => {
                  toast.success("Thank you for your feedback!");
                  setPackages((prev) =>
                    prev.map((p) =>
                      p._id === pkg._id
                        ? { ...p, rating: 5, review: "submitted" }
                        : p
                    )
                  );
                }}
              />
            )}

            <PackageCard
              _id={pkg._id}
              trackingNumber={pkg.trackingNumber || "N/A"}
              status={pkg.status}
              sender={pkg.sender || t("unknown")}
              description={pkg.description || t("noDescription")}
              createdAt={pkg.createdAt}
              screenshotUrl={pkg.screenshotUrl || undefined}
              onDelete={handleDelete}
              onCancel={handleCancel}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
