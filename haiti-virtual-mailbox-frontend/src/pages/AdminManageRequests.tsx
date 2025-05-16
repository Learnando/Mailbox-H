import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import "../styles/AdminPanel.css";

interface Request {
  _id: string;
  itemUrl: string;
  estimatedPrice: number;
  quantity: number;
  notes?: string;
  referenceNumber?: string; // ✅ Add this

  screenshotUrl?: string;
  receiptUrl?: string;
  status: string;
  createdAt?: string;

  userId: {
    name: string;
    email: string;
  };
  finalFee?: number;
  isPaid?: boolean;
}

const AdminManageRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [feeInputs, setFeeInputs] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get<Request[]>("/purchase-requests");
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch purchase requests:", err);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/purchase-requests/${id}/status`, { status: newStatus });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
      toast.success("Status updated");
    } catch (err) {
      toast.error("Could not update status.");
    }
  };

  const handleSetFee = async (id: string) => {
    const fee = parseFloat(feeInputs[id]);
    if (isNaN(fee) || fee <= 0) {
      toast.error("Please enter a valid fee.");
      return;
    }

    try {
      await api.patch(`/purchase-requests/${id}/fee`, {
        finalFee: fee,
        status: "Awaiting Payment",
      });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, finalFee: fee, status: "Awaiting Payment" } : r
        )
      );
      toast.success("Fee set and status updated.");
    } catch (err) {
      toast.error("Could not set fee.");
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await api.patch(`/purchase-requests/${id}/paid`, {
        isPaid: true,
        status: "Ordered",
      });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, isPaid: true, status: "Ordered" } : r
        )
      );
      toast.success("Marked as paid and updated to 'Ordered'.");
    } catch (err) {
      toast.error("Could not update payment.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to hide this request from admin view?"
    );
    if (!confirm) return;

    try {
      await api.patch(`/purchase-requests/${id}`, { isHiddenFromAdmin: true });
      setRequests((prev) => prev.filter((r) => r._id !== id));
      toast.success("Request hidden from admin view.");
    } catch (err) {
      toast.error("Could not hide request.");
    }
  };

  const filteredRequests = requests.filter((r) =>
    r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRequests = filteredRequests.filter(
    (r) => r.status !== "Cancelled"
  );
  const cancelledRequests = filteredRequests.filter(
    (r) => r.status === "Cancelled"
  );

  return (
    <div className="admin-wrapper">
      <div className="admin-panel">
        <h2>🔐 Manage Purchase Requests</h2>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <h3>🟢 Active Requests</h3>
        <div className="table-wrapper">
          <RequestTable
            data={activeRequests}
            feeInputs={feeInputs}
            setFeeInputs={setFeeInputs}
            handleStatusChange={handleStatusChange}
            handleSetFee={handleSetFee}
            handleMarkAsPaid={handleMarkAsPaid}
            handleDeleteRequest={handleDeleteRequest}
          />
        </div>

        <h3 style={{ marginTop: "2rem", color: "crimson" }}>
          ❌ Cancelled Requests
        </h3>
        <div className="table-wrapper">
          <RequestTable
            data={cancelledRequests}
            handleDeleteRequest={handleDeleteRequest}
            isReadOnly
          />
        </div>
      </div>
    </div>
  );
};

export default AdminManageRequests;

interface TableProps {
  data: Request[];
  feeInputs?: { [key: string]: string };
  setFeeInputs?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  handleStatusChange?: (id: string, newStatus: string) => void;
  handleSetFee?: (id: string) => void;
  handleMarkAsPaid?: (id: string) => void;
  handleDeleteRequest?: (id: string) => void;
  isReadOnly?: boolean;
}

const RequestTable = ({
  data,
  feeInputs,
  setFeeInputs,
  handleStatusChange,
  handleSetFee,
  handleMarkAsPaid,
  handleDeleteRequest,
  isReadOnly = false,
}: TableProps) => {
  return (
    <table className="request-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Ref #</th> {/* ✅ Add this */}
          <th>Item</th>
          <th>Qty</th>
          <th>Est. Price</th>
          <th>Status</th>
          <th>Fee</th>
          <th>Receipt</th>
          <th>Screenshot</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r._id}>
            <td>
              {r.userId.name}
              <br />
              <small>{r.userId.email}</small>
            </td>
            <td>{r.referenceNumber}</td> {/* ✅ Add this */}
            <td>
              <a href={r.itemUrl} target="_blank" rel="noreferrer">
                View
              </a>
            </td>
            <td>{r.quantity}</td>
            <td>${r.estimatedPrice.toFixed(2)}</td>
            <td>
              {isReadOnly ? (
                r.status
              ) : (
                <select
                  value={r.status}
                  onChange={(e) => handleStatusChange?.(r._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Awaiting Payment">Awaiting Payment</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              )}
            </td>
            <td>
              {r.finalFee ? (
                `$${r.finalFee}`
              ) : !isReadOnly ? (
                <>
                  <input
                    type="number"
                    placeholder="Set Fee"
                    value={feeInputs?.[r._id] || ""}
                    onChange={(e) =>
                      setFeeInputs?.((prev) => ({
                        ...prev,
                        [r._id]: e.target.value,
                      }))
                    }
                    style={{ width: "70px", marginRight: "6px" }}
                  />
                  <button onClick={() => handleSetFee?.(r._id)}>Set</button>
                </>
              ) : (
                "—"
              )}
            </td>
            <td>
              {r.receiptUrl ? (
                <a
                  href={`http://localhost:5000${r.receiptUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  🧾 View
                </a>
              ) : (
                "—"
              )}
            </td>
            <td>
              {r.screenshotUrl ? (
                <a
                  href={`http://localhost:5000${r.screenshotUrl}`}
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
              {!isReadOnly && (
                <>
                  {!r.isPaid && r.status === "Awaiting Payment" && (
                    <button onClick={() => handleMarkAsPaid?.(r._id)}>
                      ✅ Mark as Paid
                    </button>
                  )}
                  <br />
                </>
              )}
              <button
                onClick={() => handleDeleteRequest?.(r._id)}
                className="delete-btn"
              >
                🗑 Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
