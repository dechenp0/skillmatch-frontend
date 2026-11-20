"use client";
import { createContext, useContext } from "react";

// Lets any dashboard page read the logged-in user: const user = useUser();
const UserContext = createContext(null);

export const UserProvider = UserContext.Provider;
export const useUser = () => useContext(UserContext);

export const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "U";