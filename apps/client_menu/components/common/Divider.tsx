import { View } from "react-native";

import { theme } from "@yori/styles";

const Divider = ({ large }: { large?: boolean }) => {
  return (
    <View
      style={{
        height: large ? 3 : 1,
        width: "100%",
        backgroundColor: theme.colors.gray,
      }}
    />
  );
};

export default Divider;
