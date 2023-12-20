import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { useTheme } from "./ThemeContext";
import { Theme } from "@yori/styles";
import { TextStyle } from "react-native";

type ColorKeys = keyof Theme["colors"];
type FontSizeKeys = keyof Theme["typography"]["fontSize"];
type FontWeightKeys = keyof Theme["typography"]["fontWeight"];

interface ThemedTextInputProps extends TextInputProps {
  color?: ColorKeys;
  size?: FontSizeKeys;
  weight?: FontWeightKeys;
  style?: TextStyle;
  // ... other props
}

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  color = "text",
  size = "medium",
  weight = "regular",
  style,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    input: {
      color: theme.colors[color],
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize[size],
      fontWeight: theme.typography.fontWeight[weight],
      padding: theme.spacing(0),
      ...style,
    },
  });

  return (
    <TextInput
      placeholderTextColor={theme.colors.muted}
      style={styles.input}
      {...props}
    />
  );
};

export default ThemedTextInput;
