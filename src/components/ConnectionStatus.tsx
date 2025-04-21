
import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { toast } from 'sonner';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { testDatabaseConnection } from '@/lib/firebase';

interface ConnectionStatusProps {
  onRefresh: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ onRefresh }) => {
  const isOnline = useOnlineStatus();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check Firebase connection
  useEffect(() => {
    const checkFirebaseConnection = async () => {
      if (!isOnline) {
        setIsConnected(false);
        return;
      }
      
      try {
        const result = await testDatabaseConnection();
        setIsConnected(result);
      } catch (error) {
        setIsConnected(false);
        console.warn("Firebase connection test failed:", error);
      }
    };
    
    checkFirebaseConnection();
    
    // Check periodically
    const intervalId = setInterval(checkFirebaseConnection, 60000);
    
    return () => clearInterval(intervalId);
  }, [isOnline]);

  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      await onRefresh();
      const connectionResult = await testDatabaseConnection();
      setIsConnected(connectionResult);
      if (connectionResult) {
        toast.success("Data refreshed successfully");
      } else {
        toast.warning("Working offline, using local data");
      }
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Refresh error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
        <div className="animate-pulse">Checking connection...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full p-2 bg-secondary/30 rounded-md">
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Cloud size={16} className="text-green-500" />
        ) : (
          <CloudOff size={16} className="text-orange-500" />
        )}
        <span className="text-sm">
          {isConnected 
            ? "Connected to cloud storage" 
            : "Using local storage"
          }
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRefresh} 
        disabled={isLoading}
        className="h-8 px-2"
      >
        <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default ConnectionStatus;
