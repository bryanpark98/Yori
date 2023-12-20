import { IUserPublic } from "@yori/types";
import { Image, View, ViewStyle } from "react-native";

import { theme } from "@yori/styles";

const UserImage = ({
  user,
  style,
}: {
  user: IUserPublic;
  style?: ViewStyle;
}) => {
  return (
    <View
      style={[
        style,
        {
          height: 24,
          width: 24,
          backgroundColor: "#" + user?.colorHex,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
          overflow: "hidden",
        },
        theme.borders.image,
      ]}
    >
      <Image
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 12,
        }}
        source={{ uri: user?.imageUrl }}
        resizeMode="cover"
      />
    </View>
  );
};

export default UserImage;
