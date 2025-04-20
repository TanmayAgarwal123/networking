
import React, { useState, useEffect } from 'react';
import NetworkingDatabase from '../components/NetworkingDatabase';
import ConnectionStatus from '@/components/ConnectionStatus';
import { loadContactsFromCloud } from '@/lib/contactService';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await loadContactsFromCloud();
        console.log("Initial data loaded");
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Could not load contacts from cloud. Using local data if available.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Force reload of contacts from cloud
      await loadContactsFromCloud();
      toast.success("Data refreshed successfully");
      // The actual refresh will happen through the NetworkingDatabase component's subscription
      return true;
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <ConnectionStatus onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <NetworkingDatabase key="network-db" onRefresh={handleRefresh} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
