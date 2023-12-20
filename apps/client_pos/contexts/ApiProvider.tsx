import {
  CreateOrderRequest,
  JoinOrCreatePartyRequest,
  JoinOrCreatePartyResponse,
  IRestaurantPrivate,
  IRestaurantPublic,
  ReadRestaurantPartiesResponse,
  ReadRestaurantPrivateResponse,
  LoginWithRestaurantTokenRequest,
  LoginWithRestaurantTokenResponse,
} from "@yori/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const baseURL = "http://localhost:3000" + "/api";

export interface ApiMethods {
  fetchRestaurant: (
    restaurantId: string,
  ) => Promise<ReadRestaurantPrivateResponse>;
  readParties: (restaurantId: string) => Promise<ReadRestaurantPartiesResponse>;
  login: (
    restaurantAdminToken: string,
  ) => Promise<LoginWithRestaurantTokenResponse>;
}

export interface ApiContextType extends ApiMethods {
  token: string | null;
  restaurantAdminToken: string | null;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

interface ApiProviderProps {
  children: React.ReactNode;
}

const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [restaurantAdminToken, setRestaurantAdminToken] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadToken();
  }, []);

  const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const login = async (restaurantAdminToken: string) => {
    try {
      setRestaurantAdminToken(restaurantAdminToken);
      await AsyncStorage.setItem("restaurantAdminToken", restaurantAdminToken);
      const request = {
        restaurantToken: restaurantAdminToken,
      } as LoginWithRestaurantTokenRequest;
      const response = (
        await api.post(`/authentication/login/restaurant-token`, { request })
      ).data as LoginWithRestaurantTokenResponse;
      const fetchedToken = response.token;
      setToken(fetchedToken);
      await AsyncStorage.setItem("token", fetchedToken);
      return response;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  const fetchRestaurant = async (restaurantId: string) => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/private`);
      return response.data as ReadRestaurantPrivateResponse;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  const readParties = async (restaurantId: string) => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/parties`);
      return response.data as ReadRestaurantPartiesResponse;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  const apiContext: ApiContextType = {
    fetchRestaurant,
    login,
    readParties,
    token,
    restaurantAdminToken,
  };

  return (
    <ApiContext.Provider value={apiContext}>{children}</ApiContext.Provider>
  );
};

export default ApiProvider;
