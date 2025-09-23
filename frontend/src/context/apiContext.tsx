import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAuthToken } from '../api/api';

interface ApiContextType {
  bearerToken: string | null;
  userId: string;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const userId = useMemo(() => `user_${Math.floor(Math.random() * 10000)}`, []);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAuthToken(userId);
        setBearerToken(token.token);
      } catch (error) {
        console.error('Error fetching auth token:', error);
      }
    };
    getToken();
  }, []);

  return <ApiContext.Provider value={{ bearerToken, userId }}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
