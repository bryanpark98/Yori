import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";
import ThemedText from "./ThemedText";

interface QuantitySelectProps {
  value: number;
  onChange: (newQuantity: number) => void;
}

const QuantitySelect: React.FC<QuantitySelectProps> = ({ value, onChange }) => {
  const theme = useTheme();

  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  // TODO: replace + and - with icons
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        onPress={handleDecrease}
        style={{
          borderWidth: 2,
          borderColor: theme.colors.secondary,
          height: 20,
          width: 20,
          borderRadius: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome5 name="minus" size={8} color="white" />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: theme.spacing(1),
        }}
      >
        <ThemedText size="small" weight="bold">
          {value}
        </ThemedText>
      </View>
      <TouchableOpacity
        onPress={handleIncrease}
        style={{
          borderWidth: 2,
          borderColor: theme.colors.secondary,
          height: 20,
          width: 20,
          borderRadius: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome5 name="plus" size={8} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelect;
