
import { createContext, useContext, useEffect } from 'react';
import { useNetworking } from '@/hooks/useNetworking';
import type { NetworkingContextType } from '@/types/networking';

const NetworkingContext = createContext<NetworkingContextType | null>(null);

export const NetworkingProvider = ({ children }: { children: React.ReactNode }) => {
  const networking = useNetworking();

  useEffect(() => {
    const handleOnline = () => networking.setIsOnline(true);
    const handleOffline = () => networking.setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [networking]);

  return (
    <NetworkingContext.Provider value={networking}>
      {children}
    </NetworkingContext.Provider>
  );
};

export const useNetworkingContext = () => {
  const context = useContext(NetworkingContext);
  if (!context) {
    throw new Error('useNetworkingContext must be used within a NetworkingProvider');
  }
  return context;
};
