
export interface NetworkingState {
  isOnline: boolean;
  lastSyncTime: string | null;
  hasLocalChanges: boolean;
}

export interface NetworkingContextType extends NetworkingState {
  syncData: () => Promise<void>;
  setIsOnline: (status: boolean) => void;
  setHasLocalChanges: (status: boolean) => void;
}
