import express from "express";
import sendEmail from "../utils/sendEmail";

const router = express.Router();

// 🔥 Manual Email Test Route
router.post("/send-test-email", async (req, res) => {
  const { to } = req.body;

  try {
    await sendEmail(
      to,
      "Test Email from Haiti Mailbox",
      "This is a test email from your backend using SendGrid!",
      `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2>🚀 Test Email Successful!</h2>
          <p>If you see this, your SendGrid setup is working perfectly!</p>
          <br/>
          <p>— Haiti Mailbox Team 🇭🇹</p>
        </div>
      `
    );

    res.status(200).json({ message: "✅ Test email sent successfully!" });
  } catch (error) {
    console.error("❌ Failed to send test email:", error);
    res.status(500).json({ message: "Failed to send test email" });
  }
});

export default router;
