import React, { useEffect, useState } from "react";
import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Register.css"; // Adjust path if different

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [ref, setRef] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false); // ✅ New state

  // ✅ Get ?ref=... from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral = params.get("ref");
    if (referral) setRef(referral);
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error("You must agree to the Terms and Conditions.");
      return;
    }

    try {
      const user = (await register(
        form.name,
        form.email,
        form.password,
        ref
      )) as {
        _id: string;
        name: string;
        email: string;
        virtualAddress: string;
        isAdmin: boolean;
        referralCode?: string;
        token: string;
      };

      login(user);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("AxiosError", err);

      if (err.response?.status === 409) {
        toast.success("You already have an account. Redirecting to login...");
        navigate("/login");
        return;
      }

      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        {/* ✅ Terms and Conditions Checkbox */}
        <div className="terms-checkbox">
          <label>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={() => setAgreedToTerms(!agreedToTerms)}
              required
            />
            &nbsp; I agree to the{" "}
            <Link to="/terms" target="_blank" rel="noopener noreferrer">
              📄 Read our full Terms and Conditions
            </Link>
          </label>
        </div>

        <button type="submit" disabled={!agreedToTerms}>
          Register
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
