import axios from "./api";
import { User } from "../types/User";

// services/authService.ts
import api from "./api";

export const register = async (
  name: string,
  email: string,
  password: string,
  ref?: string | null
) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
    ref, // ✅ include referral
  });
  return res.data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data as User; // ✅ explicitly cast
};
