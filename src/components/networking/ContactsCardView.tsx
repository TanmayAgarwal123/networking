
import React from 'react';
import { motion } from "framer-motion";
import { Contact } from "@/types/contact";
import ContactCard from '@/components/ContactCard';
import { FileQuestion } from 'lucide-react';

interface ContactsCardViewProps {
  contacts: Contact[];
  handleEdit: (contact: Contact) => void;
  handleDelete: (sno: number) => void;
  handleAddTag: (contactId: number, tag: string) => void;
  handleRemoveTag: (contactId: number, tagToRemove: string) => void;
  allTags: string[];
  containerVariants: any;
  itemVariants: any;
}

const ContactsCardView: React.FC<ContactsCardViewProps> = ({
  contacts,
  handleEdit,
  handleDelete,
  handleAddTag,
  handleRemoveTag,
  allTags,
  containerVariants,
  itemVariants
}) => {
  // Handle empty contacts array
  if (!contacts || contacts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <FileQuestion className="w-16 h-16 text-purple-400 mb-4" />
        <h3 className="text-xl font-semibold text-purple-800 mb-2">No contacts found</h3>
        <p className="text-gray-600 max-w-md">
          No contacts match your current filters or you haven't added any contacts yet.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {contacts.map((contact) => (
        <ContactCard
          key={contact.sno}
          contact={contact}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          allTags={allTags}
          variants={itemVariants}
        />
      ))}
    </motion.div>
  );
};

export default ContactsCardView;
