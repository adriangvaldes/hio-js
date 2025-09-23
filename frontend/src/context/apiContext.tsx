import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken } from '../api/api';

interface ApiContextType {
  bearerToken: string | null;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAuthToken();
        setBearerToken(token.token);
      } catch (error) {
        console.error('Error fetching auth token:', error);
      }
    };
    getToken();
  }, []);

  return <ApiContext.Provider value={{ bearerToken }}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
