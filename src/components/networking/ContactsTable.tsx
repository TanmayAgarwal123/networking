
import React from 'react';
import { motion } from "framer-motion";
import { Contact } from "@/types/contact";
import { ArrowUpDown, Edit, Trash2, LinkedinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ContactsTableProps {
  contacts: Contact[];
  handleEdit: (contact: Contact) => void;
  handleDelete: (sno: number) => void;
  handleMoveUp: (sno: number) => void;
  handleMoveDown: (sno: number) => void;
}

const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  handleEdit,
  handleDelete,
  handleMoveUp,
  handleMoveDown
}) => {
  return (
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
          {contacts.map((contact, index) => (
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
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
              </td>
              <td className="px-6 py-4">{contact.company}</td>
              <td className="px-6 py-4">{contact.columbia}</td>
              <td className="px-6 py-4">{contact.category}</td>
              <td className="px-6 py-4">
                <Badge 
                  variant="outline" 
                  className={
                    contact.priority === 'High' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : contact.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }
                >
                  {contact.priority}
                </Badge>
              </td>
              <td className="px-6 py-4">{contact.contact}</td>
              <td className="px-6 py-4">{contact.rank}</td>
              <td className="px-6 py-4 max-w-[200px] truncate">{contact.notes}</td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {contact.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-blue-100 text-blue-800 border-none">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveUp(contact.sno)}
                    className="p-1 h-auto"
                  >
                    <span className="sr-only">Move Up</span>
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveDown(contact.sno)}
                    className="p-1 h-auto"
                  >
                    <span className="sr-only">Move Down</span>
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                    className="p-1 h-auto text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(contact.sno)}
                    className="p-1 h-auto text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsTable;
