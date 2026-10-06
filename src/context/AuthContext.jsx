import { createContext, useCallback, useMemo, useState } from "react";
import {
  authenticateUser,
  registerUser,
  signOutUser,
} from "../services/authService.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (localStorage.getItem("qb_auth") !== "true") return null;

    try {
      return JSON.parse(localStorage.getItem("qb_user") || "null");
    } catch (error) {
      console.warn("Could not read the saved Quantum Brain profile.", error);
      return null;
    }
  });

  const signIn = useCallback((identifier, password) => {
    const result = authenticateUser(identifier, password);
    if (result.user) setUser(result.user);
    return result;
  }, []);

  const signUp = useCallback((details) => {
    const result = registerUser(details);
    if (result.user) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    signOutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), signIn, signUp, logout }),
    [user, signIn, signUp, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
