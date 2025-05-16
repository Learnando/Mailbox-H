export interface User {
  _id: string;
  name: string;
  email: string;
  virtualAddress: string;
  isAdmin: boolean;
  token: string; // ✅ Authentication token (required)
  referralCode?: string; // Optional referral code
  credits?: number; // Optional referral credits
}
