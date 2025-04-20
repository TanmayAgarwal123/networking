
import React, { useState, useEffect } from 'react';
import NetworkingDatabase from '../components/NetworkingDatabase';
import ConnectionStatus from '@/components/ConnectionStatus';
import { loadContactsFromCloud } from '@/lib/contactService';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Force reload of contacts from cloud
      await loadContactsFromCloud();
      // The actual refresh will happen through the NetworkingDatabase component's subscription
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
          <NetworkingDatabase />
        </div>
      </div>
    </div>
  );
};

export default Index;
