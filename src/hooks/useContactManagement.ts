
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Contact } from '@/types/contact';
import { getContacts, saveContacts } from '@/services/contactService';

const STORAGE_KEY = 'columbia_networking_contacts';
const defaultContacts: Contact[] = []; // We'll import default contacts from a separate file

export const useContactManagement = (initialContacts: Contact[]) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  // Load contacts on component mount
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      try {
        const firebaseContacts = await getContacts();
        
        if (firebaseContacts && firebaseContacts.length > 0) {
          // We found contacts in Firebase, use those
          setContacts(firebaseContacts);
        } else {
          // No contacts in Firebase yet, try local storage first
          const localContacts = localStorage.getItem(STORAGE_KEY);
          if (localContacts) {
            try {
              const parsedContacts = JSON.parse(localContacts);
              setContacts(parsedContacts);
              // Save local contacts to Firebase for future syncing
              await saveContacts(parsedContacts);
              toast.success("Contacts loaded from local storage and synced to cloud");
            } catch (error) {
              console.error("Error parsing stored contacts:", error);
              setContacts(initialContacts);
              // Save default contacts to Firebase
              await saveContacts(initialContacts);
            }
          } else {
            // No local storage either, use defaults
            setContacts(initialContacts);
            // Save default contacts to Firebase
            await saveContacts(initialContacts);
          }
        }
        setSyncStatus('synced');
      } catch (error) {
        console.error("Error loading contacts:", error);
        toast.error("Failed to sync with cloud. Using local data.");
        
        // Fallback to local storage if Firebase fails
        const localContacts = localStorage.getItem(STORAGE_KEY);
        if (localContacts) {
          try {
            setContacts(JSON.parse(localContacts));
          } catch (error) {
            setContacts(initialContacts);
          }
        } else {
          setContacts(initialContacts);
        }
        
        setSyncStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, [initialContacts]);

  // Save contacts to Firebase whenever they change
  useEffect(() => {
    if (contacts.length > 0 && !isLoading) {
      const syncToFirebase = async () => {
        try {
          setSyncStatus('syncing');
          await saveContacts(contacts);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); // Keep local copy too
          setSyncStatus('synced');
        } catch (error) {
          console.error("Error syncing contacts to Firebase:", error);
          // Still save to local storage as fallback
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
          setSyncStatus('error');
          toast.error("Failed to sync with cloud. Changes saved locally.");
        }
      };
      
      syncToFirebase();
    }
  }, [contacts, isLoading]);

  // Update contact numbers whenever the number of contacts changes
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
  };
};
