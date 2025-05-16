import { useState } from "react";
import { toast } from "react-toastify"; // ✅ Import toast
import "../styles/AdminPanel.css";

const AdminGenerateResetLink = () => {
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetUrl("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/generate-reset-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to generate reset link");

      const token = data.resetUrl.split("/reset/")[1];
      const fullUrl = `https://bwatlakay.com/reset/${token}`;
      setResetUrl(fullUrl);

      toast.success("✅ Reset link generated!");
    } catch (err: any) {
      setError(err.message);
      toast.error("❌ " + err.message);
    }
  };

  const handleCopy = async () => {
    if (!resetUrl) return;

    await navigator.clipboard.writeText(resetUrl);
    toast.info("📋 Link copied to clipboard!");

    // ✅ Clear everything after copy
    setEmail("");
    setResetUrl("");
    setError("");
  };

  return (
    <div className="admin-panel">
      <h2>🔐 Generate Password Reset Link</h2>
      <form onSubmit={handleGenerate}>
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Generate Reset Link</button>
      </form>

      {resetUrl && (
        <div className="reset-link-output" style={{ marginTop: "15px" }}>
          <p>✅ Reset Link:</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input readOnly value={resetUrl} style={{ flex: 1 }} />
            <button onClick={handleCopy}>📋 Copy</button>
          </div>
        </div>
      )}

      {error && <p style={{ color: "red" }}>❌ {error}</p>}
    </div>
  );
};

export default AdminGenerateResetLink;
