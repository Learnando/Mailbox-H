import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Link added
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";
import "../styles/Auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);

      if (!user.token) {
        setMessage("Login failed. No token received.");
        return;
      }

      localStorage.setItem("haitiUserToken", user.token);
      loginUser(user);

      if (user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {message && <p className="error-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* ✅ Forgot password link */}
      <div style={{ marginTop: "1rem" }}>
        <Link to="/forgot-password" className="forgot-link">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
