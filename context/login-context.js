import React from "react";

export const ContextLogin = React.createContext();

export function LoginContextProvider({ children }) {
  const [login, setLogin] = React.useState(false);
  return (
    <ContextLogin.Provider value={{ login, setLogin }}>
      {children}
    </ContextLogin.Provider>
  );
}
