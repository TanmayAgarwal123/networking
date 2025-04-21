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
const LOCAL_STORAGE_KEY = 'contacts';

// Helper function to check if database is available
const isDatabaseAvailable = () => {
  return isFirebaseInitialized && !!database;
};

// Save contacts to local storage as backup
const saveToLocalStorage = (contacts: Contact[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
    console.log("Contacts saved to local storage");
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

// Load contacts from local storage
const loadFromLocalStorage = (): Contact[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading from local storage:", error);
  }
  return [];
};

export const saveContactsToCloud = async (contacts: Contact[]): Promise<void> => {
  try {
    if (!isDatabaseAvailable()) {
      throw new Error("Firebase database not available");
    }
    
    const contactsRef = ref(database, CONTACTS_PATH);
    await set(contactsRef, contacts);
    console.log("Contacts saved to cloud successfully");
    
    // Always save to local storage as backup
    saveToLocalStorage(contacts);
    return Promise.resolve();
  } catch (error) {
    console.error("Error saving contacts to cloud:", error);
    toast.error("Failed to save contacts to cloud, using local storage");
    // Fallback to local storage
    saveToLocalStorage(contacts);
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
      
      // Always save to local storage as backup
      saveToLocalStorage(contacts);
      return contacts;
    } else {
      console.log("No contacts found in cloud, checking local storage");
      // No contacts in the cloud, try loading from local storage as fallback
      const localContacts = loadFromLocalStorage();
      
      if (localContacts.length > 0) {
        // Save local contacts to cloud for future syncing
        await saveContactsToCloud(localContacts);
        return localContacts;
      }
      return [];
    }
  } catch (error) {
    console.error("Error loading contacts from cloud:", error);
    toast.error("Failed to load contacts from cloud, using local storage");
    // Fallback to local storage
    return loadFromLocalStorage();
  }
};

export const subscribeToContacts = (callback: (contacts: Contact[]) => void): () => void => {
  if (!isDatabaseAvailable()) {
    console.warn("Firebase database not available for subscription");
    // Load from local storage immediately
    const localContacts = loadFromLocalStorage();
    callback(localContacts);
    // Return dummy unsubscribe function
    return () => {};
  }
  
  const contactsRef = ref(database, CONTACTS_PATH);
  const handler = onValue(contactsRef, (snapshot) => {
    console.log("Received contact update from cloud");
    if (snapshot.exists()) {
      const contacts = snapshot.val() || [];
      // Save to local storage as backup
      saveToLocalStorage(contacts);
      callback(contacts);
    } else {
      // If no contacts in cloud but we have local contacts, upload them
      const localContacts = loadFromLocalStorage();
      if (localContacts.length > 0) {
        // Save to cloud without triggering another callback
        set(contactsRef, localContacts).then(() => {
          console.log("Uploaded local contacts to cloud");
        }).catch(error => {
          console.error("Failed to upload local contacts:", error);
        });
        callback(localContacts);
      } else {
        callback([]);
      }
    }
  }, (error) => {
    console.error("Error subscribing to contacts:", error);
    toast.error("Connection lost. Changes may not sync across devices.");
    // Handle error - try loading from local storage
    const localContacts = loadFromLocalStorage();
    callback(localContacts);
  });

  // Return unsubscribe function
  return () => {
    if (isDatabaseAvailable()) {
      off(contactsRef, 'value', handler);
    }
  };
};

export const addContactToCloud = async (contact: Contact): Promise<void> => {
  try {
    // First get all contacts
    let contacts: Contact[];
    
    if (isDatabaseAvailable()) {
      const contactsRef = ref(database, CONTACTS_PATH);
      const snapshot = await get(contactsRef);
      contacts = snapshot.exists() ? snapshot.val() : [];
    } else {
      contacts = loadFromLocalStorage();
    }
    
    contacts.push(contact);
    
    // Always save to local storage
    saveToLocalStorage(contacts);
    
    if (isDatabaseAvailable()) {
      const contactsRef = ref(database, CONTACTS_PATH);
      await set(contactsRef, contacts);
      console.log("Contact added to cloud successfully");
    } else {
      throw new Error("Firebase database not available");
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error adding contact to cloud:", error);
    toast.error("Failed to save contact to cloud, saved locally");
    return Promise.reject(error);
  }
};

export const updateContactInCloud = async (updatedContact: Contact): Promise<void> => {
  try {
    if (!isDatabaseAvailable()) {
      throw new Error("Firebase database not available");
    }
    
    // Get all contacts
    const contacts = await loadContactsFromCloud();
    // Find and update the specific contact
    const index = contacts.findIndex(c => c.sno === updatedContact.sno);
    if (index !== -1) {
      contacts[index] = updatedContact;
      return saveContactsToCloud(contacts);
    } else {
      return Promise.reject(new Error("Contact not found"));
    }
  } catch (error) {
    console.error("Error updating contact in cloud:", error);
    // Fallback to local storage
    const localContacts = localStorage.getItem('contacts');
    if (localContacts) {
      const contacts = JSON.parse(localContacts);
      const index = contacts.findIndex(c => c.sno === updatedContact.sno);
      if (index !== -1) {
        contacts[index] = updatedContact;
        localStorage.setItem('contacts', JSON.stringify(contacts));
      }
    }
    return Promise.reject(error);
  }
};

export const deleteContactFromCloud = async (sno: number): Promise<void> => {
  try {
    if (!isDatabaseAvailable()) {
      throw new Error("Firebase database not available");
    }
    
    // Get all contacts
    const contacts = await loadContactsFromCloud();
    // Filter out the deleted contact
    const updatedContacts = contacts.filter(c => c.sno !== sno);
    return saveContactsToCloud(updatedContacts);
  } catch (error) {
    console.error("Error deleting contact from cloud:", error);
    // Fallback to local storage
    const localContacts = localStorage.getItem('contacts');
    if (localContacts) {
      const contacts = JSON.parse(localContacts);
      const updatedContacts = contacts.filter(c => c.sno !== sno);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    }
    return Promise.reject(error);
  }
};

export const addTagToContactInCloud = async (contactId: number, tag: string): Promise<void> => {
  try {
    if (!isDatabaseAvailable()) {
      throw new Error("Firebase database not available");
    }
    
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
        return saveContactsToCloud(contacts);
      }
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Contact not found"));
    }
  } catch (error) {
    console.error("Error adding tag in cloud:", error);
    // Fallback to local storage
    const localContacts = localStorage.getItem('contacts');
    if (localContacts) {
      const contacts = JSON.parse(localContacts);
      const index = contacts.findIndex(c => c.sno === contactId);
      if (index !== -1) {
        if (!contacts[index].tags) {
          contacts[index].tags = [];
        }
        if (!contacts[index].tags.includes(tag)) {
          contacts[index].tags.push(tag);
          localStorage.setItem('contacts', JSON.stringify(contacts));
        }
      }
    }
    return Promise.reject(error);
  }
};

export const removeTagFromContactInCloud = async (contactId: number, tag: string): Promise<void> => {
  try {
    if (!isDatabaseAvailable()) {
      throw new Error("Firebase database not available");
    }
    
    // Get all contacts
    const contacts = await loadContactsFromCloud();
    // Find the contact
    const index = contacts.findIndex(c => c.sno === contactId);
    if (index !== -1 && contacts[index].tags) {
      // Filter out the tag
      contacts[index].tags = contacts[index].tags!.filter(t => t !== tag);
      return saveContactsToCloud(contacts);
    } else {
      return Promise.reject(new Error("Contact or tags not found"));
    }
  } catch (error) {
    console.error("Error removing tag in cloud:", error);
    // Fallback to local storage
    const localContacts = localStorage.getItem('contacts');
    if (localContacts) {
      const contacts = JSON.parse(localContacts);
      const index = contacts.findIndex(c => c.sno === contactId);
      if (index !== -1 && contacts[index].tags) {
        contacts[index].tags = contacts[index].tags.filter(t => t !== tag);
        localStorage.setItem('contacts', JSON.stringify(contacts));
      }
    }
    return Promise.reject(error);
  }
};
