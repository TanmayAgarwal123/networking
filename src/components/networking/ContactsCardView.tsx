
import React from 'react';
import { motion } from "framer-motion";
import { Contact } from "@/types/contact";
import ContactCard from '@/components/ContactCard';

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
