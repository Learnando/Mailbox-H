"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppMessage = void 0;
// server/src/utils/sendWhatsApp.ts
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = "whatsapp:+14155238886";
const client = (0, twilio_1.default)(accountSid, authToken);
// ✅ Use a named export instead of default
const sendWhatsAppMessage = async (to, body) => {
    return await client.messages.create({
        body,
        from: whatsappFrom,
        to: `whatsapp:${to}`, // Must include country code and +
    });
};
exports.sendWhatsAppMessage = sendWhatsAppMessage;
