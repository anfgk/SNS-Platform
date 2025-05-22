import { createContext } from "react";

export const DataStateContext = createContext(null);
export const DataDispatchContext = createContext(null);
export const DarkThemeContext = createContext(null);
export const AuthContext = createContext({
  user: null,
});
