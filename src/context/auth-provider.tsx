import { useEffect, useState, type ReactNode } from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { AuthContext, type AuthUser } from "./auth-context";

const USERNAME_KEY = "demo_username";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUsername = localStorage.getItem(USERNAME_KEY);
    if (savedUsername) {
      setUser({ id: savedUsername, username: savedUsername });
    }
    setLoading(false);
  }, []);

  const setUsername = (username: string) => {
    localStorage.setItem(USERNAME_KEY, username);
    setUser({ id: username, username });
  };

  const generateRandomUsername = (): string => {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      length: 3,
      style: "lowerCase",
    });
  };

  const clearUsername = () => {
    localStorage.removeItem(USERNAME_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUsername, generateRandomUsername, clearUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
