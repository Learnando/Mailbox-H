import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminPanel.css"; // reuse admin styles
import { toast } from "react-toastify";

interface PurchaseRequest {
  _id: string;
  itemUrl: string;
  estimatedPrice: number;
  quantity: number;
  notes?: string;
  screenshotUrl?: string;
  status: string;
  createdAt?: string;
  finalFee?: number;
  isPaid?: boolean;
  userId: {
    name: string;
    email: string;
  };
}

const AdminPurchaseRequests = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [feeInputs, setFeeInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<PurchaseRequest[]>("/purchase-requests");
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch purchase requests:", err);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/purchase-requests/${id}/status`, { status: newStatus });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
      toast.success("Status updated");
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Could not update status.");
    }
  };

  const handleSetFee = async (id: string) => {
    const finalFee = parseFloat(feeInputs[id]);
    if (isNaN(finalFee) || finalFee <= 0) {
      toast.error("Please enter a valid fee.");
      return;
    }
    try {
      await api.patch(`/purchase-requests/${id}/fee`, { finalFee });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, finalFee } : r))
      );
      toast.success("Fee set successfully.");
    } catch (err) {
      console.error("Failed to set fee", err);
      toast.error("Could not set final fee.");
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await api.patch(`/purchase-requests/${id}/paid`);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, isPaid: true, status: "Delivered" } : r
        )
      );
      toast.success("Marked as paid and delivered.");
    } catch (err) {
      console.error("Failed to mark as paid", err);
      toast.error("Could not mark as paid.");
    }
  };

  return (
    <div className="admin-panel">
      <h2>🛍️ We Buy For You Requests</h2>

      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Item</th>
              <th>Est. Price</th>
              <th>Qty</th>
              <th>Notes</th>
              <th>Screenshot</th>
              <th>Status</th>
              <th>Link</th>
              <th>Set Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.userId.name}</td>
                <td>${req.estimatedPrice}</td>
                <td>{req.quantity}</td>
                <td>{req.notes || "—"}</td>
                <td>
                  {req.screenshotUrl ? (
                    <a
                      href={`http://localhost:5000${req.screenshotUrl}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📷 View
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <select
                    value={req.status}
                    onChange={(e) =>
                      handleStatusChange(req._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <a href={req.itemUrl} target="_blank" rel="noreferrer">
                    🔗 Link
                  </a>
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Fee"
                    value={feeInputs[req._id] || ""}
                    onChange={(e) =>
                      setFeeInputs((prev) => ({
                        ...prev,
                        [req._id]: e.target.value,
                      }))
                    }
                    style={{ width: "70px" }}
                  />
                  <button onClick={() => handleSetFee(req._id)}>Set</button>
                </td>
                <td>
                  {!req.isPaid && req.finalFee && (
                    <button onClick={() => handleMarkAsPaid(req._id)}>
                      ✅ Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPurchaseRequests;
