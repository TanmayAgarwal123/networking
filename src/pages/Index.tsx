
import React from 'react';
import NetworkingDatabase from '../components/NetworkingDatabase';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <Link to="/auth">
          <Button variant="ghost" className="flex items-center gap-2 text-purple-600 hover:text-purple-800">
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </Link>
      </div>
      <NetworkingDatabase />
    </div>
  );
};

export default Index;
