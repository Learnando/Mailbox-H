import api from "./api";

// Define the expected Package shape
export interface Package {
  _id: string;
  trackingNumber?: string;
  status: string;
  sender?: string;
  description?: string;
}

export const fetchUserPackages = async (userId: string): Promise<Package[]> => {
  const res = await api.get(`/packages/user/${userId}`);
  return res.data as Package[]; // ✅ cast as expected type
};

export const getPackageDetails = async (id: string): Promise<Package> => {
  const res = await api.get(`/packages/${id}`);
  return res.data as Package;
};
