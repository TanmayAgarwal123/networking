
import { useState, useEffect } from 'react';
import { toast } from "sonner";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online");
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You are offline. Changes will be saved locally.");
    };
    
    // Set the initial status with a notification
    if (navigator.onLine) {
      toast.success("Connected to network");
    } else {
      toast.warning("You are offline. Changes will be saved locally.");
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Test the connection to confirm we're actually online
    const checkRealConnection = async () => {
      try {
        // Try to fetch a small resource to confirm internet connectivity
        const result = await fetch('https://www.google.com/favicon.ico', { 
          mode: 'no-cors',
          cache: 'no-cache'
        });
        // If we got here, we're truly online
        setIsOnline(true);
      } catch (error) {
        // If fetch fails, we're likely offline despite browser reporting online
        console.error("Connection test failed:", error);
        if (navigator.onLine) {
          toast.error("Network connection is unreliable");
        }
        setIsOnline(false);
      }
    };
    
    // Only run the check if navigator reports we're online
    if (navigator.onLine) {
      checkRealConnection();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}
