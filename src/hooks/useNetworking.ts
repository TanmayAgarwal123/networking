
import { useState, useCallback } from 'react';
import type { NetworkingState } from '@/types/networking';

export const useNetworking = () => {
  const [networkingState, setNetworkingState] = useState<NetworkingState>({
    isOnline: navigator.onLine,
    lastSyncTime: null,
    hasLocalChanges: false,
  });

  const setIsOnline = useCallback((status: boolean) => {
    setNetworkingState(prev => ({ ...prev, isOnline: status }));
  }, []);

  const setHasLocalChanges = useCallback((status: boolean) => {
    setNetworkingState(prev => ({ ...prev, hasLocalChanges: status }));
  }, []);

  const syncData = useCallback(async () => {
    try {
      // Implement your sync logic here
      setNetworkingState(prev => ({
        ...prev,
        lastSyncTime: new Date().toISOString(),
        hasLocalChanges: false,
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      setNetworkingState(prev => ({ ...prev, hasLocalChanges: true }));
    }
  }, []);

  return {
    ...networkingState,
    setIsOnline,
    setHasLocalChanges,
    syncData,
  };
};
