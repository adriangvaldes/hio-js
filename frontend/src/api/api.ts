import axios from 'axios';
import type { TokenResponse, ActiveRoom } from './types';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const getAuthTokens = async (): Promise<TokenResponse> => {
  const response = await apiClient.post('/token');
  return response.data;
};

export const getActiveRooms = async (agentToken: string): Promise<ActiveRoom[]> => {
  const response = await apiClient.get('/rooms', {
    headers: {
      Authorization: `Bearer ${agentToken}`,
    },
  });
  return response.data;
};
