import { LoginResponse, JoinOrCreatePartyResponse } from "@yori/types";
import axios, { AxiosResponse, AxiosError } from "axios";

import { useAuth } from "../contexts/AuthContext";

/**
 * API utils for requests that DO NOT REQUIRE TOKEN AUTHENTICATION
 */

const baseURL = "http://localhost:3000" + "/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const Authentication = {
  loginDefault: async (): Promise<LoginResponse> => {
    const response = await api.post("/authentication/login/new-user");
    return response.data as LoginResponse;
  },
};
