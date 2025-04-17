
import { ref, set, get, remove, push, child } from 'firebase/database';
import { db } from '../config/firebase';
import { Contact } from '../types/contact';

const CONTACTS_REF = 'contacts';

export const saveContacts = async (contacts: Contact[]): Promise<void> => {
  try {
    await set(ref(db, CONTACTS_REF), contacts);
  } catch (error) {
    console.error('Error saving contacts to Firebase:', error);
    throw error;
  }
};

export const getContacts = async (): Promise<Contact[] | null> => {
  try {
    const snapshot = await get(ref(db, CONTACTS_REF));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error fetching contacts from Firebase:', error);
    throw error;
  }
};

export const updateContact = async (contact: Contact): Promise<void> => {
  try {
    // Find the index of the contact in the current list
    const snapshot = await get(ref(db, CONTACTS_REF));
    if (snapshot.exists()) {
      const contacts: Contact[] = snapshot.val();
      const index = contacts.findIndex(c => c.sno === contact.sno);
      if (index !== -1) {
        contacts[index] = contact;
        await saveContacts(contacts);
      }
    }
  } catch (error) {
    console.error('Error updating contact in Firebase:', error);
    throw error;
  }
};

export const deleteContact = async (sno: number): Promise<void> => {
  try {
    // Remove the contact from the current list
    const snapshot = await get(ref(db, CONTACTS_REF));
    if (snapshot.exists()) {
      const contacts: Contact[] = snapshot.val();
      const updatedContacts = contacts.filter(c => c.sno !== sno);
      await saveContacts(updatedContacts);
    }
  } catch (error) {
    console.error('Error deleting contact from Firebase:', error);
    throw error;
  }
};
