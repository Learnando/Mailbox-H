"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendEmail;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendEmail(to, subject, text, html) {
    try {
        await resend.emails.send({
            from: "Haiti Mailbox <onboarding@resend.dev>", // ✅ Resend allows you to send from here immediately
            to,
            subject,
            text,
            html,
        });
        console.log(`✅ Email sent to ${to}`);
    }
    catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
        throw error;
    }
}
