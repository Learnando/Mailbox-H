import api from "./api";

export const getUserProfile = async (id: string) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const updateUserProfile = async (id: string, data: any) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};
