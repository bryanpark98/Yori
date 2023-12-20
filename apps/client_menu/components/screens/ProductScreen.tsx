import { AntDesign } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  QuantitySelect,
  ThemedText,
  ThemedTextInput,
  useTheme,
} from "@yori/native-ui-components";
import React from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useApi } from "../../contexts/ApiProvider";
import { useParty } from "../../contexts/PartyContext";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Divider from "../common/Divider";
import NavigationButton from "../common/NavigationButton";
import SubmitButton from "../common/SubmitButton";

const ProductScreen = () => {
  const theme = useTheme();

  const route = useRoute<RouteProp<RootStackParamList, "Product">>();
  const { product } = route.params;
  const navigation = useNavigation();
  const { placeOrder } = useApi();
  const { party, restaurant, refreshParty } = useParty();

  const [placeOrderLoading, setPlaceOrderLoading] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [specialInstructions, setSpecialInstructions] = React.useState("");

  const handlePlaceOrder = async () => {
    console.log("Placing order...", party);
    if (!party || !restaurant) return;
    setPlaceOrderLoading(true);
    await placeOrder(
      restaurant.id,
      party?.table.id,
      party.id,
      product.id,
      quantity,
      specialInstructions,
    );
    await refreshParty();
    setPlaceOrderLoading(false);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Use 'padding' for iOS and 'height' for Android
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled" // Ensures taps outside of text inputs dismiss the keyboard
      >
        <ImageBackground
          source={{ uri: product.imageUrl }}
          style={{
            height: 200,
            width: "100%",
          }}
        >
          <SafeAreaView>
            <NavigationButton
              onPress={() => {
                navigation.goBack();
              }}
            >
              <AntDesign name="back" size={20} color="white" />
            </NavigationButton>
          </SafeAreaView>
        </ImageBackground>
        <View
          style={{
            padding: theme.spacing(4),
            gap: theme.spacing(1),
          }}
        >
          <ThemedText size="large" weight="bold">
            {product.name}
          </ThemedText>
          {product.description && (
            <ThemedText>{product.description}</ThemedText>
          )}
          <ThemedText>${product.dollarPrice}</ThemedText>
        </View>
        <Divider />
        <View
          style={{
            padding: theme.spacing(4),
          }}
        >
          <ThemedTextInput
            placeholder="Special instructions..."
            placeholderTextColor={theme.colors.muted}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
          />
        </View>
        <Divider />
        <View
          style={{
            alignItems: "center",
            padding: theme.spacing(4),
          }}
        >
          <QuantitySelect value={quantity} onChange={setQuantity} />
          <SubmitButton
            onPress={handlePlaceOrder}
            title="Place Order"
            loading={placeOrderLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductScreen;
