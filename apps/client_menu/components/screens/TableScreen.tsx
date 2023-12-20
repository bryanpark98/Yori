import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ThemedText, useTheme } from "@yori/native-ui-components";
import { theme } from "@yori/styles";
import { IOrder, IOrderItem, OrderStatus } from "@yori/types";
import moment from "moment";
import { useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useApi } from "../../contexts/ApiProvider";
import { useAuth } from "../../contexts/AuthContext";
import { useParty } from "../../contexts/PartyContext";
import { RootStackParamList } from "../../navigation/AppNavigator";
import AnimatedModal from "../common/AnimatedModal";
import Divider from "../common/Divider";
import NavigationButton from "../common/NavigationButton";

export default function TableScreen() {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { party, restaurant, refreshParty } = useParty();
  const { user } = useAuth();
  const { requestOrderCancellation } = useApi();

  const [optionsModalOrder, setOptionsModalOrder] = useState<IOrder | null>(
    null,
  );

  const myOrders = (party?.orders || []).filter(
    (order) => order.user.id === user?.id,
  );
  const otherOrders = (party?.orders || []).filter(
    (order) => order.user.id !== user?.id,
  );

  const getTotal = (orders: IOrder[]) =>
    orders
      .reduce(
        (total, order) =>
          total +
          order.items.reduce(
            (total, item) => total + item.product.dollarPrice * item.quantity,
            0,
          ),
        0,
      )
      .toFixed(2);

  const OrdersSection = ({
    orders,
    title,
  }: {
    orders: IOrder[];
    title: string;
  }) => {
    if (orders.length === 0) return null;
    const total = getTotal(orders);

    const renderOrderItem = (order: IOrder, item: IOrderItem) => (
      <View key={item.id}>
        <Divider />
        <TouchableOpacity
          onPress={() => {
            setOptionsModalOrder(order);
          }}
          style={{
            paddingVertical: theme.spacing(2),
            flexDirection: "column",
            gap: theme.spacing(1),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <ThemedText weight="bold">
              {item.product.name}
              {item.quantity > 1 ? ` x ${item.quantity}` : ""}
            </ThemedText>
            <ThemedText>
              ${(item.product.dollarPrice * item.quantity).toFixed(2)}
            </ThemedText>
          </View>
          <ThemedText>
            {moment(new Date(order.createdAt)).format("h:mm A")}
          </ThemedText>
          {item.specialInstructions && (
            <ThemedText>
              - Special Instructions: {item.specialInstructions}
            </ThemedText>
          )}
          <OrderStatusBadge status={order.status} />
        </TouchableOpacity>
      </View>
    );

    const renderOrders = () =>
      orders.map((order) =>
        order.items.map((item) => renderOrderItem(order, item)),
      );

    return (
      <View
        style={{
          padding: theme.spacing(4),
        }}
      >
        <ThemedText
          weight="bold"
          size="xlarge"
          style={{
            marginBottom: theme.spacing(4),
          }}
        >
          {title}
        </ThemedText>
        {renderOrders()}
        <Divider />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
            paddingVertical: theme.spacing(2),
          }}
        >
          <ThemedText
            style={{
              marginBottom: theme.spacing(4),
            }}
          >
            Total: ${total}
          </ThemedText>
        </View>
      </View>
    );
  };

  const openRequestOrderCancellation = () =>
    Alert.alert(
      "Confirm Order Cancellation",
      "Confirm that you would like to request order cancellation (this cannot be undone)",
      [
        {
          text: "Yes",
          onPress: async () => {
            if (!restaurant || !party || !optionsModalOrder) return;
            setOptionsModalOrder(null);
            await requestOrderCancellation(
              restaurant.id,
              party.table.id,
              party.id,
              optionsModalOrder.id,
            );
            Alert.alert(
              "Order Cancellation Requested",
              "Your order cancellation request has been sent to the server",
            );
            await refreshParty();
          },
          style: "destructive",
        },
        {
          text: "No",
          style: "cancel",
          onPress: () => {},
        },
      ],
    );

  const OrderStatusBadge = ({ status }: { status: string }) => {
    const color = (status: string) => {
      switch (status) {
        case OrderStatus.Completed:
          return theme.colors.success;
        case OrderStatus.Cancelled:
          return theme.colors.error;
        case OrderStatus.CancellationRequested:
          return theme.colors.warning;
        default:
          return theme.colors.accent;
      }
    };
    return (
      <View
        style={{
          alignSelf: "flex-start",
          borderColor: color(status),
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: theme.spacing(1),
          paddingHorizontal: theme.spacing(2),
        }}
      >
        <ThemedText
          style={{
            color: color(status),
            textTransform: "capitalize",
          }}
        >
          {status}
        </ThemedText>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <NavigationButton
          onPress={() => {
            navigation.goBack();
          }}
        >
          <AntDesign name="close" size={20} color="white" />
        </NavigationButton>
        <ThemedText weight="bold" size="large">
          My Table
        </ThemedText>
        <View style={{ width: 40 }} />
      </SafeAreaView>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <OrdersSection title="My Orders" orders={myOrders} />
        <OrdersSection title="Table Orders" orders={otherOrders} />
      </ScrollView>
      <AnimatedModal
        visible={optionsModalOrder !== null}
        onClose={() => setOptionsModalOrder(null)}
      >
        {/* Updated usage */}
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              paddingBottom: theme.spacing(2),
              paddingTop: theme.spacing(4),
            }}
          >
            <ThemedText size="large" weight="bold">
              Order Options
            </ThemedText>
          </View>
          <Divider />
          <TouchableOpacity
            style={{
              padding: theme.spacing(2),
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={openRequestOrderCancellation}
          >
            <ThemedText style={{ color: theme.colors.error }}>
              Request order cancellation
            </ThemedText>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity
            style={{
              padding: theme.spacing(2),
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setOptionsModalOrder(null);
            }}
          >
            <ThemedText>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </AnimatedModal>
    </View>
  );
}
