
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Contact } from "@/types/contact";

interface ContactsHeaderProps {
  contacts: Contact[];
  syncStatus: 'synced' | 'syncing' | 'error';
  handleCreateNew: () => void;
}

const ContactsHeader: React.FC<ContactsHeaderProps> = ({ contacts, syncStatus, handleCreateNew }) => {
  const downloadExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(contacts);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Networking");
      const maxWidth = 30;
      const colWidths = Object.keys(contacts[0]).map(() => ({ wch: maxWidth }));
      worksheet['!cols'] = colWidths;
      XLSX.writeFile(workbook, "Columbia_Networking_Database.xlsx");
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error("Failed to download Excel file. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center mb-8"
    >
      <h1 className="text-4xl font-bold mb-4 text-purple-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-pink-600">
        Columbia Networking Database
      </h1>
      <p className="text-lg text-purple-600 mb-6 text-center max-w-2xl">
        A comprehensive database of valuable connections for Columbia University students.
      </p>
      
      {/* Sync status indicator */}
      <div className="mb-4 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          syncStatus === 'synced' ? 'bg-green-500' : 
          syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : 
          'bg-red-500'
        }`}></div>
        <span className={`text-sm ${
          syncStatus === 'synced' ? 'text-green-700' : 
          syncStatus === 'syncing' ? 'text-yellow-700' : 
          'text-red-700'
        }`}>
          {syncStatus === 'synced' ? 'Synced across all devices' : 
            syncStatus === 'syncing' ? 'Syncing changes...' : 
            'Offline mode - using local storage'}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={downloadExcel}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download Excel
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Contact
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactsHeader;
