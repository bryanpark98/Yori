import {
  CreateOrderRequest,
  JoinOrCreatePartyRequest,
  JoinOrCreatePartyResponse,
} from "@yori/types";
import axios from "axios";
import React, { createContext, useContext } from "react";

import { useAuth } from "./AuthContext";

const baseURL = "http://localhost:3000" + "/api";

export interface ApiMethods {
  joinOrCreateParty: (
    restaurantId: string,
    tableId: string,
  ) => Promise<JoinOrCreatePartyResponse>;
  placeOrder: (
    restaurantId: string,
    tableId: string,
    partyId: string,
    productId: string,
    quantity: number,
    specialInstructions?: string,
  ) => Promise<JoinOrCreatePartyResponse>;
  getParty: (
    restaurantId: string,
    tableId: string,
    partyId: string,
  ) => Promise<JoinOrCreatePartyResponse>;
  requestOrderCancellation: (
    restaurantId: string,
    tableId: string,
    partyId: string,
    orderId: string,
  ) => Promise<JoinOrCreatePartyResponse>;
}

export interface ApiContextType extends ApiMethods {}

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
  const auth = useAuth();

  const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth.token ? `Bearer ${auth.token}` : undefined,
    },
  });

  const joinOrCreateParty = async (restaurantId: string, tableId: string) => {
    try {
      const request = { tableId } as JoinOrCreatePartyRequest;
      const response = await api.post(
        `/restaurants/${restaurantId}/tables/${tableId}/party`,
        {
          request,
        },
      );
      return response.data as JoinOrCreatePartyResponse;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  const getParty = async (
    restaurantId: string,
    tableId: string,
    partyId: string,
  ) => {
    try {
      const response = await api.get(
        `/restaurants/${restaurantId}/tables/${tableId}/party/${partyId}`,
      );
      return response.data as JoinOrCreatePartyResponse;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  const placeOrder = async (
    restaurantId: string,
    tableId: string,
    partyId: string,
    productId: string,
    quantity: number,
    specialInstructions?: string,
  ) => {
    try {
      const request = {
        items: [
          {
            productId,
            quantity,
            options: [],
            specialInstructions,
          },
        ],
      } as CreateOrderRequest;
      const response = await api.post(
        `/restaurants/${restaurantId}/tables/${tableId}/party/${partyId}/orders`,
        {
          request,
        },
      );
      return response.data as JoinOrCreatePartyResponse;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  const requestOrderCancellation = async (
    restaurantId: string,
    tableId: string,
    partyId: string,
    orderId: string,
  ) => {
    try {
      const response = await api.post(
        `/restaurants/${restaurantId}/tables/${tableId}/party/${partyId}/orders/${orderId}/cancel`,
      );
      return response.data as JoinOrCreatePartyResponse;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };

  const apiContext: ApiContextType = {
    joinOrCreateParty,
    placeOrder,
    getParty,
    requestOrderCancellation,
  };

  return (
    <ApiContext.Provider value={apiContext}>{children}</ApiContext.Provider>
  );
};

export default ApiProvider;
