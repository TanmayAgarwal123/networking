
import React, { useState, useEffect } from 'react';
import NetworkingDatabase from '../components/NetworkingDatabase';
import ConnectionStatus from '@/components/ConnectionStatus';
import { loadContactsFromCloud } from '@/lib/contactService';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load initial data on mount
  useEffect(() => {
    const initData = async () => {
      try {
        await loadContactsFromCloud();
        setLoadError(null);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setLoadError("Could not load contacts. Please try refreshing.");
      } finally {
        setIsLoading(false);
      }
    };
    
    initData();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Force reload of contacts from cloud
      await loadContactsFromCloud();
      toast.success("Data refreshed successfully");
      setLoadError(null);
      // The actual refresh will happen through the NetworkingDatabase component's subscription
      return true;
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
      setLoadError("Could not refresh contacts. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <ConnectionStatus onRefresh={handleRefresh} />
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading contacts...</p>
          </div>
        )}
        
        {loadError && !isLoading && (
          <div className="text-center py-4 px-6 bg-red-50 border border-red-200 rounded-lg mx-auto my-4 max-w-md">
            <p className="text-red-600">{loadError}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {!isLoading && (
          <div className="mt-4">
            <NetworkingDatabase />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
