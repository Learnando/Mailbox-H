import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminPanel.css";
import { toast } from "react-toastify";
import ReadMore from "../components/ReadMore";

interface AdminPackage {
  _id: string;
  customerName: string;
  whatsapp: string;
  email?: string;
  description: string;
  price: number;
  shipping: string;
  delivery: string;
  note: string;
  trackingNumber?: string;
  status?: string;
  createdAt?: string;
  isPaid?: boolean;
  receiptUrl?: string;
  finalFee?: number;
  creditsUsed?: number;
  rating?: number;
  review?: string;
  userId?: {
    name: string;
    email: string;
    credits?: number;
  };
}

interface AdminPackageResponse {
  data: AdminPackage[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const AdminPanel = () => {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [feeInputs, setFeeInputs] = useState<{ [key: string]: string }>({});

  const fetchPackages = async (currentPage = 1) => {
    try {
      const res = await api.get<AdminPackageResponse>(
        `/packages/all?page=${currentPage}&limit=10`
      );
      setPackages(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Failed to load packages", err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/packages/${id}/status`, { status: newStatus });
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg._id === id ? { ...pkg, status: newStatus } : pkg
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Could not update package status.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this package?"
    );
    if (!confirmed) return;
    try {
      await api.delete(`/packages/${id}`);
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
    } catch (err) {
      console.error("Failed to delete package", err);
      toast.error("Could not delete package.");
    }
  };

  const handleSetFee = async (id: string) => {
    const finalFee = parseFloat(feeInputs[id]);
    if (isNaN(finalFee) || finalFee <= 0) {
      toast.error("Please enter a valid fee.");
      return;
    }

    try {
      await api.patch(`/packages/${id}/fee`, {
        finalFee,
        status: "Awaiting Payment",
      });

      setPackages((prev) =>
        prev.map((pkg) =>
          pkg._id === id
            ? { ...pkg, finalFee, status: "Awaiting Payment" }
            : pkg
        )
      );

      toast.success("Final fee set successfully.");
    } catch (err) {
      console.error("Failed to set fee", err);
      toast.error("Could not set final fee.");
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await api.patch(`/packages/${id}/paid`, {
        isPaid: true,
        status: "Shipped",
      });

      setPackages((prev) =>
        prev.map((pkg) =>
          pkg._id === id ? { ...pkg, isPaid: true, status: "Shipped" } : pkg
        )
      );

      toast.success("Marked as paid and marked as shipped.");
    } catch (err) {
      console.error("Failed to mark as paid", err);
      toast.error("Could not mark as paid.");
    }
  };

  useEffect(() => {
    fetchPackages(page);
  }, [page]);

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.customerName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(search.toLowerCase()) ||
      pkg.trackingNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Submitted Packages</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by name, description or tracking #"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Price</th>
              <th>Shipping</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Cancelled?</th>
              <th>Submitted</th>
              <th>Email</th>
              <th>Receipt</th>
              <th>Credits Used</th>
              <th>Credits Remaining</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Set Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.map((pkg) => (
              <tr
                key={pkg._id}
                className={`status-${pkg.status
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <td>{pkg.customerName}</td>
                <td style={{ maxWidth: "300px" }}>
                  <ReadMore text={pkg.description} maxLength={80} />
                </td>
                <td>${pkg.price}</td>
                <td>{pkg.shipping}</td>
                <td>{pkg.delivery}</td>
                <td>
                  <select
                    className="status-select"
                    value={pkg.status || "Pending"}
                    onChange={(e) =>
                      handleStatusChange(pkg._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Purchased">Purchased</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Awaiting Payment">Awaiting Payment</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={{ color: pkg.status === "Cancelled" ? "red" : "" }}>
                  {pkg.status === "Cancelled" ? "❌ Yes" : "—"}
                </td>
                <td>{new Date(pkg.createdAt || "").toLocaleDateString()}</td>
                <td>
                  {pkg.email ? (
                    <a href={`mailto:${pkg.email}`} style={{ color: "blue" }}>
                      ✉️ {pkg.email}
                    </a>
                  ) : (
                    <span style={{ color: "gray" }}>No email</span>
                  )}
                </td>
                <td>
                  {pkg.receiptUrl ? (
                    <a
                      href={`http://localhost:5000${pkg.receiptUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="receipt-link"
                    >
                      🧾 View
                    </a>
                  ) : (
                    <span style={{ color: "gray" }}>No receipt</span>
                  )}
                </td>
                <td>{pkg.creditsUsed || 0}</td>
                <td>{pkg.userId?.credits ?? 0}</td>
                <td>{pkg.rating || "—"}</td>
                <td>
                  {pkg.review ? (
                    <ReadMore text={pkg.review} maxLength={50} />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Final Fee"
                    style={{ width: "80px" }}
                    value={feeInputs[pkg._id] || ""}
                    onChange={(e) =>
                      setFeeInputs((prev) => ({
                        ...prev,
                        [pkg._id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleSetFee(pkg._id)}
                    disabled={!feeInputs[pkg._id]}
                    style={{ marginLeft: "6px" }}
                  >
                    Set Fee
                  </button>
                </td>
                <td>
                  {pkg.status === "Awaiting Payment" && !pkg.isPaid && (
                    <button
                      onClick={() => handleMarkAsPaid(pkg._id)}
                      className="pay-btn"
                      style={{ marginBottom: "6px" }}
                    >
                      ✅ Mark as Paid
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(pkg._id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          ⬅️ Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
