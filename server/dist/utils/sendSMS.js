"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendSMS;
// server/src/utils/sendSMS.ts
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const smsFrom = process.env.TWILIO_SMS_FROM;
const client = (0, twilio_1.default)(accountSid, authToken);
async function sendSMS(to, body) {
    return await client.messages.create({
        body,
        from: smsFrom,
        to,
    });
}
