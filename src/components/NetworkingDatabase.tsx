import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter, ArrowUpDown, Database, CloudOff, Wifi, WifiOff, RefreshCw } from "lucide-react";
import ContactCard from './ContactCard';
import ContactDialog from './ContactDialog';
import { toast } from "sonner";
import { 
  Contact, 
  loadContactsFromCloud, 
  saveContactsToCloud,
  subscribeToContacts,
  updateContactInCloud,
  deleteContactFromCloud,
  addTagToContactInCloud,
  removeTagFromContactInCloud 
} from '../lib/contactService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const NetworkingDatabase: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterTag, setFilterTag] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Contact; direction: 'asc' | 'desc' }>({ key: 'rank', direction: 'desc' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isOnline = useOnlineStatus();
  
  // Extract all unique categories and tags
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(contacts.map(contact => contact.category)));
    return ['All', ...uniqueCategories].filter(Boolean);
  }, [contacts]);
  
  const allTags = useMemo(() => {
    const uniqueTags = new Set<string>();
    contacts.forEach(contact => {
      if (contact.tags) {
        contact.tags.forEach(tag => uniqueTags.add(tag));
      }
    });
    return Array.from(uniqueTags);
  }, [contacts]);
  
  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    let result = [...contacts];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(contact => 
        contact.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        contact.company.toLowerCase().includes(lowerCaseSearchTerm) ||
        contact.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        contact.notes.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'All') {
      result = result.filter(contact => contact.category === filterCategory);
    }
    
    // Apply priority filter
    if (filterPriority !== 'All') {
      result = result.filter(contact => contact.priority === filterPriority);
    }
    
    // Apply tag filter
    if (filterTag !== 'All') {
      result = result.filter(contact => contact.tags?.includes(filterTag));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    
    return result;
  }, [contacts, searchTerm, filterCategory, filterPriority, filterTag, sortConfig]);

  // Load data from Firebase on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const loadedContacts = await loadContactsFromCloud();
        setContacts(loadedContacts);
        setIsDatabaseReady(true);
        if (loadedContacts.length > 0) {
          toast.success(`${loadedContacts.length} contacts loaded successfully`);
        } else {
          toast.info("No contacts found. Add your first contact!");
        }
      } catch (error) {
        console.error("Failed to initialize contacts:", error);
        toast.error("Failed to load contacts");
        setIsDatabaseReady(false);
        
        // Try to load from local storage as fallback
        try {
          const localData = localStorage.getItem('contacts');
          if (localData) {
            const localContacts = JSON.parse(localData);
            setContacts(localContacts);
            toast.warning("Using locally stored contacts");
          }
        } catch (e) {
          console.error("Failed to load from local storage:", e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    let unsubscribe = () => {};
    
    // Only set up subscription if database is ready or we're online
    if (isDatabaseReady || isOnline) {
      unsubscribe = subscribeToContacts((updatedContacts) => {
        if (updatedContacts && Array.isArray(updatedContacts)) {
          setContacts(updatedContacts);
          setIsDatabaseReady(true);
        }
      });
    }

    return () => unsubscribe();
  }, [isDatabaseReady, isOnline]);

  // Save to localStorage as a fallback when offline
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  // Manual refresh function
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const loadedContacts = await loadContactsFromCloud();
      setContacts(loadedContacts);
      setIsDatabaseReady(true);
      toast.success("Contacts refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh contacts:", error);
      toast.error("Failed to refresh contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (key: keyof Contact) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleAddContact = () => {
    setDialogMode('create');
    setEditContact(null);
    setIsDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setDialogMode('edit');
    setEditContact(contact);
    setIsDialogOpen(true);
  };

  const handleSaveContact = async (contact: Contact) => {
    try {
      if (dialogMode === 'create') {
        const maxSno = contacts.reduce((max, c) => Math.max(max, c.sno), 0);
        const newContact = { ...contact, sno: maxSno + 1 };
        
        // Add to local state
        const updatedContacts = [...contacts, newContact];
        setContacts(updatedContacts);
        
        // Save to cloud
        await saveContactsToCloud(updatedContacts);
        toast.success("Contact added successfully");
      } else {
        // Update in local state
        const updatedContacts = contacts.map(c => c.sno === contact.sno ? contact : c);
        setContacts(updatedContacts);
        
        // Update in cloud
        await updateContactInCloud(contact);
        toast.success("Contact updated successfully");
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact");
      
      // Fallback to local storage
      if (!isOnline) {
        localStorage.setItem('contacts', JSON.stringify(contacts));
      }
    }
  };

  const handleDeleteContact = async (sno: number) => {
    try {
      // Update local state
      const updatedContacts = contacts.filter(c => c.sno !== sno);
      setContacts(updatedContacts);
      
      // Update cloud
      await deleteContactFromCloud(sno);
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const handleAddTag = async (contactId: number, tag: string) => {
    try {
      // Update local state first for quick feedback
      setContacts(prevContacts => 
        prevContacts.map(contact => {
          if (contact.sno === contactId) {
            const currentTags = contact.tags || [];
            if (!currentTags.includes(tag)) {
              return { ...contact, tags: [...currentTags, tag] };
            }
          }
          return contact;
        })
      );
      
      // Update cloud
      await addTagToContactInCloud(contactId, tag);
    } catch (error) {
      console.error("Error adding tag:", error);
      toast.error("Failed to add tag");
    }
  };

  const handleRemoveTag = async (contactId: number, tag: string) => {
    try {
      // Update local state first for quick feedback
      setContacts(prevContacts => 
        prevContacts.map(contact => {
          if (contact.sno === contactId && contact.tags) {
            return { ...contact, tags: contact.tags.filter(t => t !== tag) };
          }
          return contact;
        })
      );
      
      // Update cloud
      await removeTagFromContactInCloud(contactId, tag);
    } catch (error) {
      console.error("Error removing tag:", error);
      toast.error("Failed to remove tag");
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 md:px-6 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-purple-600 mb-4"
        >
          <RefreshCw size={40} />
        </motion.div>
        <h2 className="text-xl font-medium text-gray-700 mb-2">Loading your contacts...</h2>
        <p className="text-gray-500 text-center">Please wait while we connect to the database</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
          Networking Database
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your professional network effectively
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? "Online" : "Offline"}
          </Badge>
          
          <Badge variant={isDatabaseReady ? "outline" : "destructive"} className="flex items-center gap-1">
            {isDatabaseReady ? <Database className="w-3 h-3" /> : <CloudOff className="w-3 h-3" />}
            {isDatabaseReady ? "Database Connected" : "Database Error"}
          </Badge>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 h-7 px-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 border-purple-200 focus-visible:ring-purple-500"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500 h-4 w-4" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {allTags.length > 0 && (
            <div className="flex items-center gap-2">
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleSortChange('rank')}
          >
            <ArrowUpDown className="h-4 w-4" />
            Rank {sortConfig.key === 'rank' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleSortChange('name')}
          >
            <ArrowUpDown className="h-4 w-4" />
            Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </Button>
          
          <Button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            onClick={handleAddContact}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex justify-start overflow-x-auto mb-4 bg-purple-50">
            <TabsTrigger value="all">All Contacts ({contacts.length})</TabsTrigger>
            <TabsTrigger value="high">High Priority ({contacts.filter(c => c.priority === 'High').length})</TabsTrigger>
            <TabsTrigger value="medium">Medium Priority ({contacts.filter(c => c.priority === 'Medium').length})</TabsTrigger>
            <TabsTrigger value="low">Low Priority ({contacts.filter(c => c.priority === 'Low').length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredContacts.map(contact => (
                  <ContactCard
                    key={contact.sno}
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    allTags={allTags}
                    variants={itemVariants}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="high">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredContacts
                .filter(contact => contact.priority === 'High')
                .map(contact => (
                  <ContactCard
                    key={contact.sno}
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    allTags={allTags}
                    variants={itemVariants}
                  />
                ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="medium">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredContacts
                .filter(contact => contact.priority === 'Medium')
                .map(contact => (
                  <ContactCard
                    key={contact.sno}
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    allTags={allTags}
                    variants={itemVariants}
                  />
                ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="low">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredContacts
                .filter(contact => contact.priority === 'Low')
                .map(contact => (
                  <ContactCard
                    key={contact.sno}
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    allTags={allTags}
                    variants={itemVariants}
                  />
                ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      {filteredContacts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No contacts found.</p>
        </div>
      )}
      
      <ContactDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveContact}
        contact={editContact}
        mode={dialogMode}
        existingContacts={contacts}
      />
    </div>
  );
};

export default NetworkingDatabase;
