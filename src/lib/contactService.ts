
import { database } from './firebase';
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

export const saveContactsToCloud = async (contacts: Contact[]): Promise<void> => {
  try {
    const contactsRef = ref(database, CONTACTS_PATH);
    await set(contactsRef, contacts);
    return Promise.resolve();
  } catch (error) {
    console.error("Error saving contacts to cloud:", error);
    toast.error("Failed to save contacts to cloud");
    // Fallback to local storage
    localStorage.setItem('contacts', JSON.stringify(contacts));
    return Promise.reject(error);
  }
};

export const loadContactsFromCloud = async (): Promise<Contact[]> => {
  try {
    const contactsRef = ref(database, CONTACTS_PATH);
    const snapshot = await get(contactsRef);
    if (snapshot.exists()) {
      return snapshot.val() || [];
    } else {
      // No contacts in the cloud, try loading from local storage as fallback
      const localContacts = localStorage.getItem('contacts');
      if (localContacts) {
        const parsedContacts = JSON.parse(localContacts);
        // Save local contacts to cloud for future syncing
        await saveContactsToCloud(parsedContacts);
        return parsedContacts;
      }
      return [];
    }
  } catch (error) {
    console.error("Error loading contacts from cloud:", error);
    toast.error("Failed to load contacts from cloud, using local storage");
    // Fallback to local storage
    const localContacts = localStorage.getItem('contacts');
    return localContacts ? JSON.parse(localContacts) : [];
  }
};

export const subscribeToContacts = (callback: (contacts: Contact[]) => void): () => void => {
  const contactsRef = ref(database, CONTACTS_PATH);
  onValue(contactsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() || []);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Error subscribing to contacts:", error);
    toast.error("Connection lost. Changes may not sync across devices.");
    // Handle error
  });

  // Return unsubscribe function
  return () => off(contactsRef);
};

export const addContactToCloud = async (contact: Contact): Promise<void> => {
  try {
    // First get all contacts
    const contacts = await loadContactsFromCloud();
    contacts.push(contact);
    return saveContactsToCloud(contacts);
  } catch (error) {
    console.error("Error adding contact to cloud:", error);
    return Promise.reject(error);
  }
};

export const updateContactInCloud = async (updatedContact: Contact): Promise<void> => {
  try {
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
    return Promise.reject(error);
  }
};

export const deleteContactFromCloud = async (sno: number): Promise<void> => {
  try {
    // Get all contacts
    const contacts = await loadContactsFromCloud();
    // Filter out the deleted contact
    const updatedContacts = contacts.filter(c => c.sno !== sno);
    return saveContactsToCloud(updatedContacts);
  } catch (error) {
    console.error("Error deleting contact from cloud:", error);
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
        return saveContactsToCloud(contacts);
      }
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Contact not found"));
    }
  } catch (error) {
    console.error("Error adding tag in cloud:", error);
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
      return saveContactsToCloud(contacts);
    } else {
      return Promise.reject(new Error("Contact or tags not found"));
    }
  } catch (error) {
    console.error("Error removing tag in cloud:", error);
    return Promise.reject(error);
  }
};
