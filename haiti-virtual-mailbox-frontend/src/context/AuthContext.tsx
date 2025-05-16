import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/User"; // ✅ Make sure this type includes `token` and `isAdmin`

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("haitiUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("haitiUser");
      }
    }
  }, []);

  const login = (userData: User) => {
    // Ensure token is included and stored
    const fullUser = { ...userData, token: userData.token };
    localStorage.setItem("haitiUser", JSON.stringify(fullUser));
    setUser(fullUser);
  };

  const logout = () => {
    localStorage.removeItem("haitiUser");
    //localStorage.removeItem("haitiUserToken"); // ✅ Clear token explicitly
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
