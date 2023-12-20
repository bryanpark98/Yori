import React, { useState, useRef, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import {
  StyleSheet,
  View,
  PanResponder,
  Dimensions,
  Pressable,
} from "react-native";
import ApiProvider, { useApi } from "./contexts/ApiProvider";
import DashboardScreen from "./components/screens/DashboardScreen";

const App: React.FC = () => {
  return (
    <ApiProvider>
      <DashboardScreen />
    </ApiProvider>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  childView: {
    flex: 1,
    overflow: "hidden",
  },
});

export default App;
