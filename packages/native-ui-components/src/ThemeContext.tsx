import { Theme, darkTheme } from "@yori/styles";
import React, { createContext, useContext } from "react";

export const ThemeContext = createContext<Theme>(darkTheme);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error(
      "ThemedText: ThemeContext value is undefined. Ensure your app is wrapped with <ThemeProvider>.",
    );
  }
  return theme;
};

export const ThemeProvider: React.FC<{ theme: any }> = ({
  theme,
  children,
}) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
