
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online. Data will sync to cloud.");
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You are offline. Changes will be saved locally.");
    };
    
    // Check initial status
    setIsOnline(navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Additional ping test for more reliable status detection
    const checkRealConnectivity = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Try to fetch a small file to verify actual internet connectivity
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        if (!isOnline) {
          setIsOnline(true);
        }
      } catch (error) {
        if (error.name === 'AbortError' || !navigator.onLine) {
          setIsOnline(false);
        }
      }
    };
    
    // Initial check
    checkRealConnectivity();
    
    // Periodic check (every 30 seconds)
    const intervalId = setInterval(checkRealConnectivity, 30000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline]);
  
  return isOnline;
}
