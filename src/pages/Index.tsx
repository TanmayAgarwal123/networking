
import React, { useState, useEffect } from 'react';
import NetworkingDatabase from '../components/NetworkingDatabase';
import ConnectionStatus from '@/components/ConnectionStatus';
import { loadContactsFromCloud, subscribeToContacts } from '@/lib/contactService';
import { testDatabaseConnection } from '@/lib/firebase';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    // Initial connection test when component mounts
    const initialSetup = async () => {
      await testDatabaseConnection();
      setIsLoading(false);
    };
    
    initialSetup();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Force reload of contacts from cloud
      await loadContactsFromCloud();
      // Force re-render of NetworkingDatabase component
      setRefreshKey(Date.now());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <ConnectionStatus onRefresh={handleRefresh} />
        <div className="mt-4">
          <NetworkingDatabase key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default Index;
