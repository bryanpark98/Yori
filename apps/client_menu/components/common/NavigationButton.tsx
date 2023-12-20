import { theme } from "@yori/styles";
import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

interface NavigationButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

const NavigationButton = ({
  onPress,
  style,
  children,
}: NavigationButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        style,
        {
          backgroundColor: theme.colors.primaryBackground,
          height: 40,
          width: 40,
          borderRadius: 20,
          marginLeft: theme.spacing.margin,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default NavigationButton;
