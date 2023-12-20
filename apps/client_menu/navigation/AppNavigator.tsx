// AppNavigator.tsx
import { createStackNavigator } from "@react-navigation/stack";
import { IProduct } from "@yori/types";
import React from "react";

import LoadingScreen from "../components/screens/LoadingScreen";
import HomeScreen from "../components/screens/MenuScreen";
import ProductScreen from "../components/screens/ProductScreen";
import ProfileScreen from "../components/screens/ProfileScreen";
import TableScreen from "../components/screens/TableScreen";
import { useAuth } from "../contexts/AuthContext";

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Product: { product: IProduct };
  Table: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { token } = useAuth();

  if (!token) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Table" component={TableScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppNavigator;
