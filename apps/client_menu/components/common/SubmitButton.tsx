import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import { theme } from "@yori/styles";

type SubmitButtonProps = {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function SubmitButton({
  onPress,
  title,
  loading = false,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <TouchableOpacity
      style={{
        marginTop: theme.spacing.margin,
        paddingVertical: theme.spacing.padding,
        paddingHorizontal: theme.spacing.paddingLarge,
        backgroundColor: theme.colors.primaryAccent,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <ActivityIndicator
        style={{ position: "absolute", opacity: loading ? 1 : 0 }}
        color={theme.colors.primaryBackground}
      />
      <Text
        style={[
          theme.typography.h3,
          { color: theme.colors.primaryBackground, opacity: loading ? 0 : 1 },
        ]}
      >
        Place Order
      </Text>
    </TouchableOpacity>
  );
}
