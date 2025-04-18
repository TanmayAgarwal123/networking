
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-purple-800">Columbia Networking</h1>
          <p className="text-gray-600">Sign in to access your contacts across all devices</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 flex items-center justify-center gap-2"
            onClick={() => {
              // This will be replaced with Clerk auth
              navigate('/');
            }}
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-purple-300 hover:bg-purple-50 py-6 flex items-center justify-center gap-2"
            onClick={() => {
              // This will be replaced with Clerk auth
              navigate('/');
            }}
          >
            <UserPlus className="w-5 h-5" />
            <span>Create Account</span>
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Or continue with temporary local storage
          </p>
          <Button 
            variant="ghost" 
            className="mt-2 text-purple-600 hover:text-purple-800"
            onClick={() => navigate('/')}
          >
            Continue without signing in
          </Button>
        </div>
      </motion.div>
      
      <p className="mt-8 text-sm text-gray-500 text-center max-w-md">
        Authentication powered by Clerk. Creating an account allows you to access your contacts from any device.
      </p>
    </div>
  );
};

export default Auth;
