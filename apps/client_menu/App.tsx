import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "@yori/native-ui-components";
import { darkTheme } from "@yori/styles";
import { StatusBar } from "expo-status-bar";
import React from "react";

import ApiProvider from "./contexts/ApiProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { PartyProvider } from "./contexts/PartyContext";
import AppNavigator from "./navigation/AppNavigator";

const App: React.FC = () => {
  const theme = useTheme();

  const CustomTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
    },
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <NavigationContainer theme={CustomTheme}>
        <StatusBar style="light" />
        <AuthProvider>
          <ApiProvider>
            <PartyProvider>
              <AppNavigator />
            </PartyProvider>
          </ApiProvider>
        </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
