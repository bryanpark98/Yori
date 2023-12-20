import { View, Text } from "react-native";
import ItemSelectorGrid from "../common/ItemSelectorGrid";
import { useMemo, useState } from "react";
import { ITable } from "@yori/types";
import { IRestaurantPrivate, IParty, IRestaurantPublic } from "@yori/types";
import { useEffect } from "react";
import { useApi } from "../../contexts/ApiProvider";
import { theme } from "@yori/styles";
import { QuantitySelect } from "@yori/native-ui-components";
import stringToColor from "../../utils/string_to_color";

const DashboardScreen = () => {
  const [table, setTable] = useState<ITable | null>(null);
  const [restaurant, setRestaurant] = useState<IRestaurantPrivate | null>(null);
  const [parties, setParties] = useState<IParty[] | null>(null);

  const { login, fetchRestaurant, readParties } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      const ADMIN_TOKEN = "852ad388-4fb5-4f76-b247-e2ccea68b5a2";
      const loginResponse = await login(ADMIN_TOKEN);
      setRestaurant(loginResponse.restaurant);
      setTable(loginResponse.restaurant.tables[0]);
      const parties = await readParties(loginResponse.restaurant.id);
      setParties(parties.parties);
    };
    fetchData();
  }, [login, fetchRestaurant, readParties]);

  useEffect(() => {}, [table]);

  const tableColor = useMemo(
    () => stringToColor(table?.name || ""),
    [table?.name],
  );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        padding: 30,
        backgroundColor: theme.colors.secondaryBackground,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          ...theme.shadow,
          width: "50%",
          marginRight: 30,
          backgroundColor: theme.colors.primaryBackground,
        }}
      >
        <View
          style={{
            backgroundColor: tableColor,
            padding: theme.spacing.paddingLarge,
          }}
        >
          <Text style={theme.typography.h2}>{table?.name}</Text>
        </View>
        <View style={{ padding: theme.spacing.paddingLarge }}>
          {parties?.map((party) => {
            if (party.table.id !== table?.id) return null;
            return (
              <View
                style={{ flexDirection: "column", gap: theme.spacing.gapLarge }}
                key={party.id}
              >
                {party.orders.map((order) => {
                  return order.items.map((item) => {
                    return (
                      <View style={{ flexDirection: "row" }} key={item.id}>
                        <View
                          style={{
                            alignItems: "flex-start",
                            marginRight: theme.spacing.marginLarge,
                          }}
                        >
                          <QuantitySelect
                            value={item.quantity}
                            onChange={function (newQuantity: number): void {
                              throw new Error("Function not implemented.");
                            }}
                          />
                        </View>
                        <View style={{ flex: 1, alignItems: "flex-start" }}>
                          <Text style={theme.typography.h3}>
                            {item.product.name}
                          </Text>
                        </View>
                        <View style={{ marginLeft: theme.spacing.marginLarge }}>
                          <Text style={theme.typography.h3}>
                            ${item.product.dollarPrice}
                          </Text>
                        </View>
                        <View style={{ marginLeft: theme.spacing.marginLarge }}>
                          <Text style={theme.typography.h3}>
                            $
                            {(item.product.dollarPrice * item.quantity).toFixed(
                              2,
                            )}
                          </Text>
                        </View>
                      </View>
                    );
                  });
                })}
              </View>
            );
          })}
        </View>
      </View>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <ItemSelectorGrid
          restaurant={restaurant}
          selectTable={setTable}
          selectProduct={(product) => {
            console.log(product);
          }}
        />
      </View>
    </View>
  );
};

export default DashboardScreen;
