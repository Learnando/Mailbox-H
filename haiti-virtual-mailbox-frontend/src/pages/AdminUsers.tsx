import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminUsers.css";
import { toast } from "react-toastify";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  virtualAddress?: string;
  isAdmin?: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<Partial<AdminUser>>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<AdminUser[]>("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error("Could not delete user.");
    }
  };

  const handlePromote = async (id: string) => {
    try {
      await api.patch(`/users/${id}/promote`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isAdmin: true } : user
        )
      );
      toast.success("✅ User promoted to admin");
    } catch (err) {
      toast.error("❌ Failed to promote user to admin");
    }
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData(user);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      await api.put(`/users/${editingUser._id}`, formData);
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? { ...u, ...formData } : u))
      );
      toast.success("User updated successfully!");
      setEditingUser(null);
    } catch (err) {
      toast.error("Could not update user.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.virtualAddress?.toLowerCase().includes(query)
    );
  });

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-wrapper">
      <div className="admin-panel">
        <h2>Admin Panel - Manage Users</h2>

        <input
          type="text"
          className="search-bar"
          placeholder="Search by name or virtual address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Virtual Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "N/A"}</td>
                  <td>{user.virtualAddress || "N/A"}</td>
                  <td>{user.isAdmin ? "✅ Admin" : "User"}</td>
                  <td className="actions-cell">
                    {!user.isAdmin && (
                      <button
                        className="action-btn promote-btn"
                        onClick={() => handlePromote(user._id)}
                      >
                        👑 Promote
                      </button>
                    )}
                    <button
                      className="action-btn edit-btn"
                      onClick={() => openEditModal(user)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit User</h3>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleFormChange}
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleFormChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleFormChange}
                placeholder="Phone"
              />
              <input
                type="text"
                name="virtualAddress"
                value={formData.virtualAddress || ""}
                onChange={handleFormChange}
                placeholder="Virtual Address"
              />
              <div className="modal-buttons">
                <button className="save-btn" onClick={handleUpdate}>
                  ✅ Update
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingUser(null)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
