
import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { toast } from 'sonner';
import { Cloud, CloudOff, RefreshCw, Database, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isFirebaseInitialized } from '@/lib/firebase';

interface ConnectionStatusProps {
  onRefresh: () => Promise<boolean>;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ onRefresh }) => {
  const isOnline = useOnlineStatus();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Check Firebase connection
  useEffect(() => {
    const checkFirebaseConnection = async () => {
      if (!isOnline) {
        setIsConnected(false);
        return;
      }
      
      setIsConnected(isFirebaseInitialized);
    };
    
    checkFirebaseConnection();
    
    // Check periodically
    const intervalId = setInterval(checkFirebaseConnection, 30000);
    
    return () => clearInterval(intervalId);
  }, [isOnline]);

  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      const success = await onRefresh();
      if (success) {
        toast.success("Data refreshed successfully");
        setLastRefreshed(new Date());
      } else {
        toast.error("Failed to refresh data");
      }
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Refresh error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusMessage = () => {
    if (!isOnline) {
      return "Offline - Using local storage";
    }
    
    if (!isConnected) {
      return "Can't connect to cloud - Using local storage";
    }
    
    return "Connected to cloud storage";
  };

  if (isConnected === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
        <div className="animate-pulse">Checking connection...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full p-2 bg-secondary/30 rounded-md">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        {isConnected ? (
          <Cloud size={16} className="text-green-500" />
        ) : (
          <CloudOff size={16} className="text-orange-500" />
        )}
        <span className="text-sm font-medium">
          {getStatusMessage()}
        </span>
        
        {isConnected && (
          <Database size={16} className="text-green-500 ml-2" />
        )}
        
        {!isConnected && isOnline && (
          <AlertTriangle size={16} className="text-orange-500 ml-2" />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {lastRefreshed && (
          <span className="text-xs text-muted-foreground">
            Last refreshed: {lastRefreshed.toLocaleTimeString()}
          </span>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="h-8 px-2"
        >
          <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default ConnectionStatus;
