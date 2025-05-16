import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth
import api from "../services/api";
import "../styles/AdminPanel.css";

interface SupportMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const AdminSupportMessages = () => {
  const { user } = useAuth(); // ✅ Get logged-in user

  const [messages, setMessages] = useState<SupportMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get<SupportMessage[]>("/support");
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load support messages:", err);
      }
    };

    if (user?.isAdmin) {
      fetchMessages();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirm) return;
    try {
      await api.delete(`/support/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert("Error deleting message");
    }
  };

  // ✅ Deny access to non-admins
  if (!user?.isAdmin) {
    return (
      <div className="admin-panel">
        <p className="text-red-600 font-semibold p-4">
          🚫 Access denied. Admins only.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-panel page-content">
      <h1
        style={{
          fontSize: "1.8rem",
          color: "var(--heading-color)",
          marginBottom: "1rem",
        }}
      >
        📨 Support Messages
      </h1>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <section style={{ marginBottom: "var(--spacing-lg)" }}>
          <div className="table-responsive">
            <table className="support-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg._id}>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.phone}</td>
                    <td>{msg.message}</td>
                    <td>{new Date(msg.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminSupportMessages;
