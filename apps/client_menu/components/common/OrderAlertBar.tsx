import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { theme } from "@yori/styles";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";

import { useAuth } from "../../contexts/AuthContext";
import { useParty } from "../../contexts/PartyContext";
import { RootStackParamList } from "../../navigation/AppNavigator";

export default function OrderAlertBar() {
  const BAR_OFFSET = -5;

  const { party } = useParty();
  const { user } = useAuth();

  const navigator = useNavigation<StackNavigationProp<RootStackParamList>>();

  const myOrders = (party?.orders || []).filter(
    (order) => order.user.id === user?.id,
  );

  if (myOrders.length === 0) return null;

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        bottom: BAR_OFFSET,
      }}
    >
      <SafeAreaView
        style={{
          width: "70%",
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: 100,
            backgroundColor: theme.colors.primaryAccent,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
          onPress={() => {
            navigator.navigate("Table");
          }}
        >
          <Text
            style={[
              theme.typography.h3,
              { color: theme.colors.primaryBackground },
            ]}
          >
            My Table ({myOrders.length} Orders Pending)
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
