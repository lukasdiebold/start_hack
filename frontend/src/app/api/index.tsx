import {
  TokenResponse
} from './types';
import { jwtDecode } from 'jwt-decode';

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000';

export const fetchToken = async (username: string, password: string): Promise<TokenResponse> => {
  const response = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch token');
  }

  const data: TokenResponse = await response.json();
  return data;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

const getTokenExpiration = (token: string): Date | null => {
  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    if (decodedToken.exp) {
      return new Date(decodedToken.exp * 1000); // Convert from seconds to milliseconds
    }
    return null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const hasValidToken = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }

  const expirationDate = getTokenExpiration(token);
  if (!expirationDate) {
    return false;
  }

  return expirationDate > new Date();
};

