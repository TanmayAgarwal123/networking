
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Contact } from '@/types/contact';
import { getContacts, saveContacts } from '@/services/contactService';

const STORAGE_KEY = 'columbia_networking_contacts';
const LOADING_TIMEOUT = 8000; // 8 seconds timeout for loading

export const useContactManagement = (initialContacts: Contact[]) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts || []);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('syncing');
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Load contacts on component mount
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.log("Loading timeout reached, using local data");
          const localContacts = localStorage.getItem(STORAGE_KEY);
          if (localContacts) {
            try {
              const parsed = JSON.parse(localContacts);
              setContacts(parsed);
            } catch (e) {
              setContacts(initialContacts);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContacts));
            }
          } else {
            setContacts(initialContacts);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContacts));
          }
          setSyncStatus('error');
          setIsLoading(false);
          toast.error("Connection timeout - using local data");
        }
      }, LOADING_TIMEOUT);
      
      try {
        // Try to get contacts from Firebase
        const firebaseContacts = await getContacts();
        
        if (firebaseContacts && firebaseContacts.length > 0) {
          // Firebase contacts found
          setContacts(firebaseContacts);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(firebaseContacts)); // Keep local copy
          setSyncStatus('synced');
        } else {
          // No Firebase contacts, try local storage
          const localContacts = localStorage.getItem(STORAGE_KEY);
          if (localContacts) {
            try {
              const parsedContacts = JSON.parse(localContacts);
              setContacts(parsedContacts);
              // Try to save local contacts to Firebase
              await saveContacts(parsedContacts);
              setSyncStatus('synced');
            } catch (error) {
              console.error("Error parsing stored contacts:", error);
              setContacts(initialContacts);
              // Try to save default contacts to Firebase
              await saveContacts(initialContacts);
            }
          } else {
            // No local storage either, use defaults
            setContacts(initialContacts);
            // Try to save default contacts to Firebase
            await saveContacts(initialContacts);
            setSyncStatus('synced');
          }
        }
      } catch (error) {
        console.error("Error loading contacts:", error);
        
        // Increase connection attempts counter
        setConnectionAttempts(prev => prev + 1);
        
        // Firebase connection failed, use local storage as fallback
        const localContacts = localStorage.getItem(STORAGE_KEY);
        if (localContacts) {
          try {
            const parsed = JSON.parse(localContacts);
            setContacts(parsed);
            toast.error("Using local contacts - Cloud sync unavailable");
          } catch (e) {
            setContacts(initialContacts);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContacts));
            toast.error("Using default contacts - Cloud sync unavailable");
          }
        } else {
          setContacts(initialContacts);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContacts));
          toast.error("Using default contacts - Cloud sync unavailable");
        }
        
        setSyncStatus('error');
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    loadContacts();
  }, [initialContacts]);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (contacts.length > 0 && !isLoading) {
      // Always save to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      
      // If we're not in error state, try to sync with Firebase
      if (syncStatus !== 'error') {
        const syncToFirebase = async () => {
          try {
            setSyncStatus('syncing');
            await saveContacts(contacts);
            setSyncStatus('synced');
          } catch (error) {
            console.error("Error syncing contacts to Firebase:", error);
            setSyncStatus('error');
            toast.error("Failed to sync with cloud. Changes saved locally.");
          }
        };
        
        syncToFirebase();
      }
    }
  }, [contacts, isLoading]);

  // Update contact numbers whenever contacts array changes
  useEffect(() => {
    if (contacts.length > 0) {
      updateContactNumbers();
    }
  }, [contacts.length]);

  // Function to update contact numbers
  const updateContactNumbers = () => {
    const updatedContacts = [...contacts].map((contact, index) => ({
      ...contact,
      sno: index + 1
    }));
    
    setContacts(updatedContacts);
  };
  
  const handleSaveContact = (contact: Contact) => {
    if (!contact.sno) { // Create new contact
      const nextSno = contacts.length > 0 
        ? Math.max(...contacts.map(c => c.sno)) + 1 
        : 1;
      
      const newContact = {
        ...contact,
        sno: nextSno
      };
      
      setContacts([...contacts, newContact]);
      toast.success("New contact added successfully!");
    } else { // Update existing contact
      const newContacts = contacts.map(c => c.sno === contact.sno ? contact : c);
      setContacts(newContacts);
      toast.success("Contact updated successfully!");
    }
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

  // Sort contacts by rank and priority
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const rankDiff = b.rank - a.rank;
    if (rankDiff !== 0) return rankDiff;
    
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    return (
      priorityOrder[a.priority as keyof typeof priorityOrder] - 
      priorityOrder[b.priority as keyof typeof priorityOrder]
    );
  });

  // Get unique categories
  const uniqueCategories = ["All", ...Array.from(new Set(contacts.map(c => c.category)))];
  
  // Get all tags
  const allTags = Array.from(new Set(contacts.flatMap(contact => contact.tags || [])));

  return {
    contacts,
    setContacts,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    syncStatus,
    handleSaveContact,
    handleDelete,
    handleMoveUp,
    handleMoveDown,
    handleAddTag,
    handleRemoveTag,
    sortedContacts,
    uniqueCategories,
    allTags,
    connectionAttempts
  };
};
