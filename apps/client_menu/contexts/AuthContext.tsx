import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUserPrivate } from "@yori/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { Authentication } from "../utils/api";

interface AuthContextType {
  user: IUserPrivate | null;
  token: string | null;
  signIn: (user: IUserPrivate, token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUserPrivate | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        console.log(storedToken);
        if (storedUser && storedToken) {
          await signIn(JSON.parse(storedUser), storedToken);
        } else {
          await signInNewUser();
        }
        console.log("Logged in");
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const signInNewUser = async () => {
    const response = await Authentication.loginDefault();
    signIn(response.user, response.token);
  };

  const signIn = async (user: IUserPrivate, token: string) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);
      setUser(user);
      setToken(token);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
