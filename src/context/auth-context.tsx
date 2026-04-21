import { createContext } from "react";

export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  setUsername: (username: string) => void;
  generateRandomUsername: () => string;
  clearUsername: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
