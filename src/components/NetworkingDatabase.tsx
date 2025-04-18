import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { Download, Edit, Trash2, LinkedinIcon, Plus, ArrowUpDown, Search, Tags, Filter, Calendar, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ContactDialog from './ContactDialog';
import ContactCard from './ContactCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { database } from '../firebase/config';
import { ref, onValue, set, remove } from 'firebase/database';

interface Contact {
  sno: number;
  name: string;
  contact: string;
  email: string;
  company: string;
  columbia: string;
  tips: string;
  comments: string;
  category: string;
  howToUse: string;
  priority: string;
  linkedinUrl: string;
  rank: number;
  notes: string;
  tags?: string[];
}

const defaultContacts: Contact[] = [
  {
    sno: 1,
    name: "David Fitzgerald",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Columbia University",
    columbia: "Assistant Director of Career Services",
    tips: "Provided Zoom calendar access",
    comments: "Direct access to career services; valuable for job postings and interview prep",
    category: "University Staff",
    howToUse: "Schedule regular check-ins; ask for resume feedback and employer connections",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/mrdavidfitzgerald/",
    rank: 95,
    notes: "",
    tags: ["Career Services", "Columbia Staff"]
  },
  // ... rest of defaultContacts array
];

const STORAGE_KEY = 'columbia_networking_contacts';
const FIREBASE_PATH = 'contacts';

const NetworkingDatabase = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const uniqueCategories = ["All", ...Array.from(new Set(contacts.map(c => c.category)))];
  
  const allTags = Array.from(new Set(contacts.flatMap(contact => contact.tags || [])));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    try {
      console.info("Firebase initialized successfully");
      const contactsRef = ref(database, FIREBASE_PATH);
      
      loadingTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          console.info("Loading timeout reached, using local data");
          const savedContacts = localStorage.getItem(STORAGE_KEY);
          if (savedContacts) {
            try {
              setContacts(JSON.parse(savedContacts));
            } catch (error) {
              console.error("Error parsing stored contacts:", error);
              setContacts(defaultContacts.map(contact => ({
                ...contact,
                rank: contact.rank || 50,
                notes: contact.notes || '',
                tags: contact.tags || []
              })));
            }
          } else {
            setContacts(defaultContacts.map(contact => ({
              ...contact,
              rank: contact.rank || 50,
              notes: contact.notes || '',
              tags: contact.tags || []
            })));
          }
          setIsLoading(false);
        }
      }, 8000);
      
      const unsubscribe = onValue(contactsRef, (snapshot) => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        setIsFirebaseConnected(true);
        const data = snapshot.val();
        
        if (data) {
          setContacts(data);
        } else {
          const savedContacts = localStorage.getItem(STORAGE_KEY);
          let initialContacts;
          
          if (savedContacts) {
            try {
              initialContacts = JSON.parse(savedContacts);
            } catch (error) {
              console.error("Error parsing stored contacts:", error);
              initialContacts = defaultContacts.map(contact => ({
                ...contact,
                rank: contact.rank || 50,
                notes: contact.notes || '',
                tags: contact.tags || []
              }));
            }
          } else {
            initialContacts = defaultContacts.map(contact => ({
              ...contact,
              rank: contact.rank || 50,
              notes: contact.notes || '',
              tags: contact.tags || []
            }));
          }
          
          set(contactsRef, initialContacts);
          setContacts(initialContacts);
        }
        
        setIsLoading(false);
      }, (error) => {
        console.error("Firebase error:", error);
        toast.error("Could not connect to cloud storage. Using local data instead.");
        
        const savedContacts = localStorage.getItem(STORAGE_KEY);
        if (savedContacts) {
          try {
            setContacts(JSON.parse(savedContacts));
          } catch (error) {
            console.error("Error parsing stored contacts:", error);
            setContacts(defaultContacts.map(contact => ({
              ...contact,
              rank: contact.rank || 50,
              notes: contact.notes || '',
              tags: contact.tags || []
            })));
          }
        } else {
          setContacts(defaultContacts.map(contact => ({
            ...contact,
            rank: contact.rank || 50,
            notes: contact.notes || '',
            tags: contact.tags || []
          })));
        }
        
        setIsLoading(false);
      });
      
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        unsubscribe();
      };
    } catch (error) {
      console.error("Firebase initialization error:", error);
      toast.error("Could not initialize cloud storage. Using local data instead.");
      
      const savedContacts = localStorage.getItem(STORAGE_KEY);
      if (savedContacts) {
        try {
          setContacts(JSON.parse(savedContacts));
        } catch (error) {
          console.error("Error parsing stored contacts:", error);
          setContacts(defaultContacts.map(contact => ({
            ...contact,
            rank: contact.rank || 50,
            notes: contact.notes || '',
            tags: contact.tags || []
          })));
        }
      } else {
        setContacts(defaultContacts.map(contact => ({
          ...contact,
          rank: contact.rank || 50,
          notes: contact.notes || '',
          tags: contact.tags || []
        })));
      }
      
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isFirebaseConnected && contacts.length > 0) {
      const contactsRef = ref(database, FIREBASE_PATH);
      set(contactsRef, contacts)
        .catch(error => {
          console.error("Error saving to Firebase:", error);
          toast.error("Failed to sync with cloud storage. Changes may not persist across devices.");
        });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts, isLoading, isFirebaseConnected]);

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

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDelete = (sno: number) => {
    const newContacts = contacts.filter(c => c.sno !== sno);
    
    const renumberedContacts = newContacts.map((contact, index) => ({
      ...contact,
      sno: index + 1
    }));
    
    setContacts(renumberedContacts);
    toast.success("Contact deleted successfully!");
  };

  const handleCreateNew = () => {
    setEditingContact(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleSaveContact = (contact: Contact) => {
    if (dialogMode === 'create') {
      const nextSno = contacts.length > 0 
        ? Math.max(...contacts.map(c => c.sno)) + 1 
        : 1;
      
      const newContact = {
        ...contact,
        sno: nextSno
      };
      
      setContacts([...contacts, newContact]);
      toast.success("New contact added successfully!");
    } else {
      const newContacts = contacts.map(c => c.sno === contact.sno ? contact : c);
      setContacts(newContacts);
      toast.success("Contact updated successfully!");
    }
  };

  const handleMoveUp = (sno: number) => {
    const index = contacts.findIndex(c => c.sno === sno);
    if (index > 0) {
      const newContacts = [...contacts];
      const currentRank = newContacts[index].rank;
      const prevRank = newContacts[index - 1].rank;
      newContacts[index].rank = prevRank;
      newContacts[index - 1].rank = currentRank;
      setContacts(newContacts);
      toast.success("Contact moved up successfully!");
    }
  };

  const handleMoveDown = (sno: number) => {
    const index = contacts.findIndex(c => c.sno === sno);
    if (index < contacts.length - 1) {
      const newContacts = [...contacts];
      const currentRank = newContacts[index].rank;
      const nextRank = newContacts[index + 1].rank;
      newContacts[index].rank = nextRank;
      newContacts[index + 1].rank = currentRank;
      setContacts(newContacts);
      toast.success("Contact moved down successfully!");
    }
  };

  const handleAddTag = (contactId: number, tag: string) => {
    if (!tag.trim()) return;
    
    setContacts(prevContacts => 
      prevContacts.map(contact => {
        if (contact.sno === contactId) {
          const currentTags = contact.tags || [];
          if (!currentTags.includes(tag)) {
            return {
              ...contact,
              tags: [...currentTags, tag]
            };
          }
        }
        return contact;
      })
    );
  };

  const handleRemoveTag = (contactId: number, tagToRemove: string) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => {
        if (contact.sno === contactId && contact.tags) {
          return {
            ...contact,
            tags: contact.tags.filter(tag => tag !== tagToRemove)
          };
        }
        return contact;
      })
    );
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.columbia.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "All" || contact.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || contact.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const rankDiff = b.rank - a.rank;
    if (rankDiff !== 0) return rankDiff;
    
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  useEffect(() => {
    if (contacts.length > 0) {
      updateContactNumbers();
    }
  }, [contacts.length]);

  const updateContactNumbers = () => {
    const updatedContacts = [...contacts].map((contact, index) => ({
      ...contact,
      sno: index + 1
    }));
    
    setContacts(updatedContacts);
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50">
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
          {isFirebaseConnected && (
            <span className="block text-sm text-green-600 mt-1">
              ✓ Cloud sync enabled - your data will be available on all devices
            </span>
          )}
        </p>
        
        {isLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-purple-600">Loading contacts...</p>
          </div>
        ) : (
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
        )}
      </motion.div>

      {!isLoading && (
        <div className="bg-white p-6 rounded-xl shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search contacts by name, company, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                onClick={() => setViewMode('table')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                onClick={() => setViewMode('cards')}
                className="flex items-center gap-2"
              >
                <Tags className="w-4 h-4" />
                Cards
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full flex justify-start mb-4 bg-purple-50">
              <TabsTrigger value="all" className="flex-1">All Contacts ({sortedContacts.length})</TabsTrigger>
              <TabsTrigger value="high" className="flex-1">High Priority ({sortedContacts.filter(c => c.priority === 'High').length})</TabsTrigger>
              <TabsTrigger value="recent" className="flex-1">Recently Added (5)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {viewMode === 'table' ? (
                <div className="overflow-x-auto rounded-lg shadow-lg animate-fade-in">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gradient-to-r from-purple-100 to-violet-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">
                          <div className="flex items-center gap-2">
                            No.
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Name</th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Company</th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Columbia</th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Category</th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Priority</th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Contact</th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Rank</th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Notes</th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Tags</th>
                        <th className="px-6 py-4 text-left text-purple-800 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-200">
                      {sortedContacts.map((contact, index) => (
                        <motion.tr
                          key={contact.sno}
                          className="hover:bg-purple-50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4 font-medium flex items-center gap-2">
                            {contact.name}
                            {contact.linkedinUrl && (
                              <motion.a
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                href={contact.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0077b5] hover:text-[#006097] transition-colors"
                              >
                                <LinkedinIcon className="w-4 h-4" />
                              </motion.a>
                            )}
                          </td>
                          <td className="px-6 py-4">{contact.company}</td>
                          <td className="px-6 py-4">{contact.columbia}</td>
                          <td className="px-6 py-4">{contact.category}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                contact.priority === "High"
                                  ? "bg-green-100 text-green-800"
                                  : contact.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {contact.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">{contact.contact}</td>
                          <td className="px-6 py-4">{contact.rank}</td>
                          <td className="px-6 py-4">
                            {contact.notes ? (
                              <div className="max-w-xs overflow-hidden text-ellipsis">
                                {contact.notes}
                              </div>
                            ) : (
                              <span className="text-gray-400">No notes</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {contact.tags?.map(tag => (
                                <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Button
                                  onClick={() => handleEdit(contact)}
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-purple-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Button
                                  onClick={() => handleDelete(contact.sno)}
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-red-50 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {sortedContacts.map((contact, index) => (
                    <ContactCard 
                      key={contact.sno} 
                      contact={{...contact, sno: index + 1}}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                      allTags={allTags}
                      variants={itemVariants}
                    />
                  ))}
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="high">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={viewMode === 'cards' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : ""}
              >
                {viewMode === 'cards' ? (
                  sortedContacts.filter(c => c.priority === 'High').map((contact, index) => (
                    <ContactCard 
                      key={contact.sno} 
                      contact={{...contact, sno: index + 1}}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                      allTags={allTags}
                      variants={itemVariants}
                    />
                  ))
                ) : (
                  <div className="overflow-x-auto rounded-lg shadow-lg animate-fade-in">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gradient-to-r from-purple-100 to-violet-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">
                            <div className="flex items-center gap-2">
                              No.
                              <ArrowUpDown className="w-4 h-4" />
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Name</th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Company</th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Columbia</th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Category</th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Priority</th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Contact</th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Rank</th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Notes</th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Tags</th>
                          <th className="px-6 py-4 text-left text-purple-800 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-200">
                        {sortedContacts.filter(c => c.priority === 'High').map((contact, index) => (
                          <motion.tr
                            key={contact.sno}
                            className="hover:bg-purple-50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="px-6 py-4">{index + 1}</td>
                            <td className="px-6 py-4 font-medium flex items-center gap-2">
                              {contact.name}
                              {contact.linkedinUrl && (
                                <motion.a
                                  whileHover={{ scale: 1.2, rotate: 5 }}
                                  href={contact.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0077b5] hover:text-[#006097] transition-colors"
                                >
                                  <LinkedinIcon className="w-4 h-4" />
                                </motion.a>
                              )}
                            </td>
                            <td className="px-6 py-4">{contact.company}</td>
                            <td className="px-6 py-4">{contact.columbia}</td>
                            <td className="px-6 py-4">{contact.category}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                  contact.priority === "High"
                                    ? "bg-green-100 text-green-800"
                                    : contact.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {contact.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">{contact.contact}</td>
                            <td className="px-6 py-4">{contact.rank}</td>
                            <td className="px-6 py-4">
                              {contact.notes ? (
                                <div className="max-w-xs overflow-hidden text-ellipsis">
                                  {contact.notes}
                                </div>
                              ) : (
                                <span className="text-gray-400">No notes</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {contact.tags?.map(tag => (
                                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <motion.div whileHover={{ scale: 1.1 }}>
                                  <Button
                                    onClick={() => handleEdit(contact)}
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-purple-50"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                  <Button
                                    onClick={() => handleDelete(contact.sno)}
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-red-50 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="p-4 text-center text-gray-500">
                Coming soon: View recently added contacts
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {isDialogOpen && (
        <ContactDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveContact}
          contact={editingContact}
          mode={dialogMode}
          existingContacts={contacts}
        />
      )}
    </div>
  );
};

export default NetworkingDatabase;
