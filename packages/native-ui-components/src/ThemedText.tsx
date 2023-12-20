import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";
import { useTheme } from "./ThemeContext";
import { Theme } from "@yori/styles";
import { TextStyle } from "react-native";

type ColorKeys = keyof Theme["colors"];
type FontSizeKeys = keyof Theme["typography"]["fontSize"];
type FontWeightKeys = keyof Theme["typography"]["fontWeight"];

interface ThemedTextProps extends TextProps {
  color?: ColorKeys;
  size?: FontSizeKeys;
  weight?: FontWeightKeys;
  style?: TextStyle;
  // ... other props
}

const ThemedText: React.FC<ThemedTextProps> = ({
  color = "text",
  size = "medium",
  weight = "regular",
  children,
  style,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: theme.colors[color],
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize[size],
      fontWeight: theme.typography.fontWeight[weight],
      ...style,
    },
  });

  return (
    <Text style={styles.text} {...props}>
      {children}
    </Text>
  );
};

export default ThemedText;
