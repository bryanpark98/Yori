import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ThemedText, useTheme } from "@yori/native-ui-components";
import { IMenuSection } from "@yori/types";
import moment from "moment";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../contexts/AuthContext";
import { useParty } from "../../contexts/PartyContext";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Divider from "../common/Divider";
import OrderAlertBar from "../common/OrderAlertBar";
import UserImage from "../common/UserImage";

export default function HomeScreen() {
  const theme = useTheme();

  const MY_TABLE_VISIBLE_ORDERS = 4;

  useAuth();
  const { restaurant } = useParty();
  const { party } = useParty();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  console.log(party?.users);

  // const hoursText = (hours: any) => {
  //   if (hours.length == 7) {
  //     return `${hours[new Date().getDay()].opensAtMinutes} - ${
  //       hours[new Date().getDay()].closesAtMinutes
  //     }`;
  //   } else {
  //     return "Closed";
  //   }
  // };

  const MyTableOrders = () => {
    let renderedOrders = 0;
    return party?.orders.map((order, _index) => {
      return order.items.map((item) => {
        renderedOrders++;
        if (renderedOrders > MY_TABLE_VISIBLE_ORDERS) return null;
        return (
          <View key={item.id}>
            <Divider />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Table");
              }}
              style={{
                paddingHorizontal: theme.spacing(4),
                paddingVertical: theme.spacing(2),
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                gap: theme.spacing(4),
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <UserImage
                  style={{ marginRight: theme.spacing(2) }}
                  user={order.user}
                />
                <Text style={{ flexWrap: "wrap", flex: 1 }}>
                  <ThemedText>
                    Placed {item.quantity} order
                    {item.quantity > 1 ? "s" : ""} for{" "}
                  </ThemedText>
                  <ThemedText weight="bold">{item.product.name}</ThemedText>
                </Text>
              </View>
              <View>
                <ThemedText>
                  {moment(new Date(order.createdAt)).format("h:mm A")}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        );
      });
    });
  };

  const MenuSection = ({ menuSection }: { menuSection: IMenuSection }) => {
    if (menuSection.menuItems.length === 0) return null;
    return (
      <>
        <View
          style={{
            padding: theme.spacing(4),
          }}
        >
          <ThemedText
            size="large"
            weight="bold"
            style={{ marginBottom: theme.spacing(4) }}
          >
            {menuSection.name}
          </ThemedText>
          <View
            style={{
              gap: theme.spacing(4),
            }}
          >
            {menuSection.menuItems.map((item) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    navigation.navigate("Product", { product: item });
                  }}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 4,
                      marginRight: theme.spacing(2),
                      borderWidth: 1,
                      borderColor: "white",
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText size="large">{item.name}</ThemedText>
                    <View>
                      <ThemedText>{`$${item.dollarPrice}`}</ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <Divider />
      </>
    );
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SafeAreaView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: theme.spacing(4),
            }}
          >
            <Image
              style={{
                height: 80,
                width: 80,
                borderRadius: 4,
                marginRight: theme.spacing(4),
                borderWidth: 1,
                borderColor: "white",
              }}
              source={{ uri: restaurant?.imageUrl }}
              resizeMode="cover"
            />
            <View
              style={{
                flex: 1,
                gap: 6,
              }}
            >
              <ThemedText size="xlarge" weight="bold">
                {restaurant?.name}
              </ThemedText>
              <ThemedText>{restaurant?.description}</ThemedText>
            </View>
          </View>
          <Divider large />
          <View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: theme.spacing(4),
              }}
              onPress={() => {
                navigation.navigate("Table");
              }}
            >
              <ThemedText size="large" weight="bold">
                My Table
              </ThemedText>
              <View style={{ flexDirection: "row", gap: theme.spacing(1) }}>
                {party?.users.map((user) => {
                  return <UserImage user={user} key={user.id} />;
                })}
              </View>
            </TouchableOpacity>
            <MyTableOrders />
          </View>
          <Divider large />
          <View>
            {restaurant?.menus.map((menu) => {
              return menu.menuSections.map((menuSection) => {
                return (
                  <MenuSection menuSection={menuSection} key={menuSection.id} />
                );
              });
            })}
          </View>
        </SafeAreaView>
      </ScrollView>
      <OrderAlertBar />
    </View>
  );
}
