import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Auth.css"; // You can reuse your auth styles

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    }
  };

  return (
    <div className="form-container">
      <h2>{t("auth.forgotTitle", "Forgot Password")}</h2>
      {success ? (
        <p style={{ color: "green" }}>
          ✅ {t("auth.resetSent", "Check your email for reset instructions.")}
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={t("auth.email", "Your email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">
            {t("auth.sendReset", "Send Reset Link")}
          </button>
        </form>
      )}
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
    </div>
  );
};

export default ForgotPassword;
