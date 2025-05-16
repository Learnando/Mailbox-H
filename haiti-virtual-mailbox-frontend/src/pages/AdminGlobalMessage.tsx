import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import "../styles/AdminGlobalMessage.css";

const AdminGlobalMessage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await api.get<{ message: string }>(
          "/settings/global-message"
        ); // ✅ Correct path
        setMessage(res.data.message);
      } catch (err) {
        toast.error("Failed to load message.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/settings/global-message", { message }); // ✅ Correct path
      toast.success("Message updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update message.");
    }
  };

  return (
    <div className="admin-global-message">
      <h2>🛠 Global System Message</h2>
      <p>This message will be shown to all users at the top of every page.</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message (leave blank to clear)"
            rows={4}
          />
          <button type="submit">Save Message</button>
        </form>
      )}
    </div>
  );
};

export default AdminGlobalMessage;
