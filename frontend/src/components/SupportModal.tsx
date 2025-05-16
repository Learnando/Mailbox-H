import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/SupportModal.css";

const SupportModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setSubmitted(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        alert(t("support.error"));
      }
    } catch (err) {
      alert(t("support.error"));
    }
  };

  return (
    <>
      <button className="support-icon" onClick={toggleModal}>
        💬 <span className="support-label">{t("support.needHelp")}</span>
      </button>

      {isOpen && (
        <div className="support-modal">
          <div className="support-modal-content">
            <button className="close-btn" onClick={toggleModal}>
              ✖
            </button>
            <h3>📨 {t("support.title")}</h3>
            {submitted ? (
              <p className="success-message">✅ {t("support.success")}</p>
            ) : (
              <form onSubmit={handleSubmit} className="support-form">
                <input
                  type="text"
                  name="name"
                  placeholder={t("support.name")}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t("support.email")}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder={t("support.phone")}
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="message"
                  placeholder={t("support.message")}
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                <button type="submit">{t("support.send")}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SupportModal;
