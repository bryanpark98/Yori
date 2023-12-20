import { IParty, IRestaurantPublic } from "@yori/types";
import React, { ReactNode, createContext, useEffect, useState } from "react";

import { useApi } from "./ApiProvider";
import { useAuth } from "./AuthContext";

interface PartyContextProps {
  party: IParty | null;
  restaurant: IRestaurantPublic | null;
  setParty: (party: IParty | null) => void;
  setRestaurant: (restaurant: IRestaurantPublic | null) => void;
  refreshParty: () => void;
}

const initialContext: PartyContextProps = {
  party: null,
  restaurant: null,
  setParty: () => {},
  setRestaurant: () => {},
  refreshParty: () => {},
};

export const PartyContext = createContext<PartyContextProps>(initialContext);

interface PartyProviderProps {
  children: ReactNode;
}

export const PartyProvider: React.FC<PartyProviderProps> = ({ children }) => {
  const POLLING_INTERVAL = 5000;
  const RESTAURANT_ID = "64dfc223005f9563f6750b70";
  const TABLE_ID = "64ff8bd670af4da3c7028354";

  const api = useApi();
  const { token } = useAuth();

  const [party, setParty] = useState<IParty | null>(null);
  const [restaurant, setRestaurant] = useState<IRestaurantPublic | null>(null);

  useEffect(() => {
    const joinOrCreateParty = async () => {
      if (!token || !TABLE_ID) return;
      const response = await api.joinOrCreateParty(RESTAURANT_ID, TABLE_ID);
      setParty(response.party);
      setRestaurant(response.restaurant);
    };
    joinOrCreateParty();
  }, [TABLE_ID, token]);

  // poll for changes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshParty();
    }, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const refreshParty = async () => {
    if (!token || !party) return;
    const response = await api.getParty(RESTAURANT_ID, TABLE_ID, party.id);
    setParty(response.party);
  };

  return (
    <PartyContext.Provider
      value={{ party, restaurant, setParty, setRestaurant, refreshParty }}
    >
      {children}
    </PartyContext.Provider>
  );
};

export const useParty = () => {
  const context = React.useContext(PartyContext);
  if (!context) {
    throw new Error("useParty must be used within a PartyProvider");
  }
  return context;
};
