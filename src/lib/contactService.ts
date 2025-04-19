import { database, isFirebaseInitialized } from './firebase';
import { ref, set, get, remove, update, onValue, off } from "firebase/database";
import { toast } from "sonner";

export interface Contact {
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

// Database ref path
const CONTACTS_PATH = 'contacts';

// Helper function to check if database is available
const isDatabaseAvailable = () => {
  return isFirebaseInitialized && !!database;
};

// Get local contacts
const getLocalContacts = (): Contact[] => {
  try {
    const localContacts = localStorage.getItem('contacts');
    return localContacts ? JSON.parse(localContacts) : [];
  } catch (error) {
    console.error("Error parsing local contacts:", error);
    return [];
  }
};

// Save contacts to local storage
const saveToLocalStorage = (contacts: Contact[]): void => {
  try {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    console.log("Contacts saved to local storage", contacts);
  } catch (error) {
    console.error("Error saving to local storage:", error);
    toast.error("Failed to save to local storage");
  }
};

export const saveContactsToCloud = async (contacts: Contact[]): Promise<void> => {
  // Always save to local storage first
  saveToLocalStorage(contacts);
  
  try {
    if (!isDatabaseAvailable()) {
      throw new Error("Firebase database not available");
    }
    
    const contactsRef = ref(database, CONTACTS_PATH);
    await set(contactsRef, contacts);
    console.log("Contacts saved to cloud successfully", contacts);
    return Promise.resolve();
  } catch (error) {
    console.error("Error saving contacts to cloud:", error);
    toast.error("Failed to save contacts to cloud, using local storage");
    return Promise.reject(error);
  }
};

export const loadContactsFromCloud = async (): Promise<Contact[]> => {
  try {
    if (!isDatabaseAvailable()) {
      throw new Error("Firebase database not available");
    }
    
    const contactsRef = ref(database, CONTACTS_PATH);
    const snapshot = await get(contactsRef);
    
    if (snapshot.exists()) {
      const contacts = snapshot.val() || [];
      console.log("Contacts loaded from cloud successfully", contacts);
      
      // Always save to local storage as a backup
      saveToLocalStorage(contacts);
      return contacts;
    } else {
      console.log("No contacts found in cloud, checking local storage");
      // No contacts in the cloud, try loading from local storage
      const localContacts = getLocalContacts();
      
      // If we have local contacts but none in cloud, try to save them to cloud
      if (localContacts.length > 0 && isDatabaseAvailable()) {
        try {
          await saveContactsToCloud(localContacts);
          console.log("Local contacts synced to cloud");
        } catch (syncError) {
          console.error("Failed to sync local contacts to cloud:", syncError);
        }
      }
      
      return localContacts;
    }
  } catch (error) {
    console.error("Error loading contacts from cloud:", error);
    toast.error("Failed to load contacts from cloud, using local storage");
    // Fallback to local storage
    return getLocalContacts();
  }
};

export const subscribeToContacts = (callback: (contacts: Contact[]) => void): () => void => {
  // Initial load from local storage for immediate feedback
  const localContacts = getLocalContacts();
  if (localContacts.length > 0) {
    callback(localContacts);
  }
  
  if (!isDatabaseAvailable()) {
    console.warn("Firebase database not available for subscription");
    // Return dummy unsubscribe function
    return () => {};
  }
  
  const contactsRef = ref(database, CONTACTS_PATH);
  onValue(contactsRef, (snapshot) => {
    console.log("Received contact update from cloud");
    if (snapshot.exists()) {
      const contacts = snapshot.val() || [];
      // Save to local storage as backup
      saveToLocalStorage(contacts);
      callback(contacts);
    } else {
      // If no contacts in cloud, try local storage
      const localContacts = getLocalContacts();
      if (localContacts.length > 0) {
        // If we have local contacts but none in cloud, push to cloud
        saveContactsToCloud(localContacts)
          .then(() => {
            console.log("Local contacts synced to cloud during subscription");
            callback(localContacts);
          })
          .catch((error) => {
            console.error("Failed to sync local contacts to cloud:", error);
            callback(localContacts);
          });
      } else {
        callback([]);
      }
    }
  }, (error) => {
    console.error("Error subscribing to contacts:", error);
    toast.error("Connection lost. Changes may not sync across devices.");
    // Handle error - try loading from local storage
    callback(getLocalContacts());
  });

  // Return unsubscribe function
  return () => {
    if (isDatabaseAvailable()) {
      off(contactsRef);
    }
  };
};

export const addContactToCloud = async (contact: Contact): Promise<void> => {
  try {
    // First get all contacts
    const contacts = await loadContactsFromCloud();
    // Add new contact
    contacts.push(contact);
    
    // Always save to local storage first
    saveToLocalStorage(contacts);
    
    if (isDatabaseAvailable()) {
      const contactsRef = ref(database, CONTACTS_PATH);
      await set(contactsRef, contacts);
      console.log("Contact added to cloud successfully", contact);
      return Promise.resolve();
    } else {
      throw new Error("Firebase database not available");
    }
  } catch (error) {
    console.error("Error adding contact to cloud:", error);
    // We've already saved to local storage at the beginning, so just reject the promise
    return Promise.reject(error);
  }
};

export const updateContactInCloud = async (updatedContact: Contact): Promise<void> => {
  try {
    // Get all contacts (try cloud first, then local)
    const contacts = await loadContactsFromCloud();
    // Find and update the specific contact
    const index = contacts.findIndex(c => c.sno === updatedContact.sno);
    if (index !== -1) {
      contacts[index] = updatedContact;
      // Save to local storage first
      saveToLocalStorage(contacts);
      
      // Then try saving to cloud
      if (isDatabaseAvailable()) {
        const contactsRef = ref(database, CONTACTS_PATH);
        await set(contactsRef, contacts);
        console.log("Contact updated in cloud successfully", updatedContact);
        return Promise.resolve();
      } else {
        throw new Error("Firebase database not available");
      }
    } else {
      return Promise.reject(new Error("Contact not found"));
    }
  } catch (error) {
    console.error("Error updating contact in cloud:", error);
    // We've already saved to local storage, so just reject the promise
    return Promise.reject(error);
  }
};

export const deleteContactFromCloud = async (sno: number): Promise<void> => {
  try {
    // Get all contacts
    const contacts = await loadContactsFromCloud();
    // Filter out the deleted contact
    const updatedContacts = contacts.filter(c => c.sno !== sno);
    
    // Save to local storage first
    saveToLocalStorage(updatedContacts);
    
    if (isDatabaseAvailable()) {
      const contactsRef = ref(database, CONTACTS_PATH);
      await set(contactsRef, updatedContacts);
      console.log("Contact deleted from cloud successfully", sno);
      return Promise.resolve();
    } else {
      throw new Error("Firebase database not available");
    }
  } catch (error) {
    console.error("Error deleting contact from cloud:", error);
    // We've already saved to local storage, so just reject the promise
    return Promise.reject(error);
  }
};

export const addTagToContactInCloud = async (contactId: number, tag: string): Promise<void> => {
  try {
    // Get all contacts
    const contacts = await loadContactsFromCloud();
    // Find the contact
    const index = contacts.findIndex(c => c.sno === contactId);
    if (index !== -1) {
      // Create or update tags array
      if (!contacts[index].tags) {
        contacts[index].tags = [];
      }
      // Only add if not already present
      if (!contacts[index].tags!.includes(tag)) {
        contacts[index].tags!.push(tag);
        
        // Save to local storage first
        saveToLocalStorage(contacts);
        
        if (isDatabaseAvailable()) {
          const contactsRef = ref(database, CONTACTS_PATH);
          await set(contactsRef, contacts);
          console.log("Tag added to contact in cloud successfully", contactId, tag);
          return Promise.resolve();
        } else {
          throw new Error("Firebase database not available");
        }
      }
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Contact not found"));
    }
  } catch (error) {
    console.error("Error adding tag in cloud:", error);
    // We've already saved to local storage, so just reject the promise
    return Promise.reject(error);
  }
};

export const removeTagFromContactInCloud = async (contactId: number, tag: string): Promise<void> => {
  try {
    // Get all contacts
    const contacts = await loadContactsFromCloud();
    // Find the contact
    const index = contacts.findIndex(c => c.sno === contactId);
    if (index !== -1 && contacts[index].tags) {
      // Filter out the tag
      contacts[index].tags = contacts[index].tags!.filter(t => t !== tag);
      
      // Save to local storage first
      saveToLocalStorage(contacts);
      
      if (isDatabaseAvailable()) {
        const contactsRef = ref(database, CONTACTS_PATH);
        await set(contactsRef, contacts);
        console.log("Tag removed from contact in cloud successfully", contactId, tag);
        return Promise.resolve();
      } else {
        throw new Error("Firebase database not available");
      }
    } else {
      return Promise.reject(new Error("Contact or tags not found"));
    }
  } catch (error) {
    console.error("Error removing tag in cloud:", error);
    // We've already saved to local storage, so just reject the promise
    return Promise.reject(error);
  }
};
