import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/MyPurchaseRequests.css";
import ReadMore from "../components/ReadMore";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // ✅

interface UserRequest {
  _id: string;
  itemUrl: string;
  estimatedPrice: number;
  quantity: number;
  notes?: string;
  screenshotUrl?: string;
  status: string;
  createdAt?: string;
  finalFee?: number;
  receiptUrl?: string;
  isPaid?: boolean;
}

const MyPurchaseRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const { t } = useTranslation(); // ✅

  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get<UserRequest[]>(
          `/purchase-requests/user/${user._id}`
        );
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch user requests:", err);
      }
    };

    fetchMyRequests();
  }, [user]);

  const handleReceiptUpload = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      interface ReceiptUploadResponse {
        receiptUrl: string;
      }

      const res = await api.patch<ReceiptUploadResponse>(
        `/purchase-requests/${id}/receipt`,
        formData
      );

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, receiptUrl: res.data.receiptUrl } : r
        )
      );

      toast.success("✅ " + t("receiptUploaded"));
    } catch (err) {
      console.error("Upload failed", err);
      toast.error(t("uploadFail"));
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirm) return;

    try {
      await api.patch(`/purchase-requests/${id}/soft-delete`);

      // 🔥 Filter out deleted item from UI
      setRequests((prev) => prev.filter((r) => r._id !== id));

      toast.success("Request deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete request.");
    }
  };

  const handleCancel = async (id: string) => {
    const confirm = window.confirm(t("confirmCancel"));
    if (!confirm) return;

    try {
      await api.patch(`/purchase-requests/${id}/cancel`);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "Cancelled" } : r))
      );
      toast.info("❌ " + t("cancelledMsg"));
    } catch (err) {
      console.error("Cancel failed", err);
      toast.error(t("cancelFail"));
    }
  };

  const translateStatus = (status: string) => {
    const key = status.toLowerCase().replace(/\s+/g, "");
    return t(key);
  };

  return (
    <div className="dashboard">
      <h2>📟 {t("myPurchaseRequests")}</h2>

      {requests.length === 0 ? (
        <p>{t("noRequests")}</p>
      ) : (
        <ul className="purchase-list">
          {requests.map((r) => (
            <li key={r._id} className="purchase-card">
              <div className="card-header">
                <p>
                  <strong>🍎 {t("itemLink")}:</strong>{" "}
                  <a href={r.itemUrl} target="_blank" rel="noreferrer">
                    {t("viewProduct")}
                  </a>
                </p>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="delete-btn"
                >
                  🖑️
                </button>
              </div>

              <p>
                <strong>💵 {t("estimatedPrice")}:</strong> $
                {r.estimatedPrice.toFixed(2)}
              </p>
              <p>
                <strong>📦 {t("quantity")}:</strong> {r.quantity}
              </p>

              {r.notes && (
                <p>
                  <strong>📝 {t("notes")}:</strong>{" "}
                  <ReadMore text={r.notes} maxLength={80} />
                </p>
              )}

              <p>
                <strong>📌 {t("status")}:</strong>{" "}
                <span
                  className={`status-badge status-${r.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {translateStatus(r.status)}
                </span>
              </p>

              {["Pending", "Awaiting Payment"].includes(r.status) && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(r._id)}
                >
                  ❌ {t("cancelRequest")}
                </button>
              )}

              {typeof r.finalFee === "number" && (
                <div className="payment-alert-box">
                  <p>
                    <strong>💵 {t("yourPackageArrived")}</strong>
                  </p>
                  <p>
                    {t("shippingFee")} <strong>${r.finalFee.toFixed(2)}</strong>
                  </p>
                  <p>
                    {t("paymentInstructions")}{" "}
                    <strong>{t("cashAppTag")}</strong>
                    <br />
                    {t("uploadReceipt")}
                  </p>

                  {r.receiptUrl ? (
                    <>
                      <p style={{ color: "green", marginTop: "10px" }}>
                        ✅ {t("receiptUploaded")}
                      </p>
                      {r.isPaid && (
                        <p style={{ color: "blue", fontWeight: "bold" }}>
                          📦 {t("itemPaid")}
                        </p>
                      )}
                    </>
                  ) : (
                    <input
                      type="file"
                      className="file-input"
                      accept="image/*"
                      onChange={(e) => handleReceiptUpload(r._id, e)}
                    />
                  )}
                </div>
              )}

              {r.screenshotUrl && (
                <p>
                  <strong>📷 Screenshot:</strong>{" "}
                  <a
                    href={`http://localhost:5000${r.screenshotUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("viewProduct")}
                  </a>
                </p>
              )}

              <p>
                <strong>📅 {t("submitted")}:</strong>{" "}
                {new Date(r.createdAt || "").toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPurchaseRequests;
