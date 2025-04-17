
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, LinkedinIcon, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

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

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (sno: number) => void;
  onAddTag: (contactId: number, tag: string) => void;
  onRemoveTag: (contactId: number, tag: string) => void;
  allTags: string[];
  variants?: any;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onEdit, 
  onDelete,
  onAddTag,
  onRemoveTag,
  allTags,
  variants 
}) => {
  const [newTag, setNewTag] = useState('');
  const [expanded, setExpanded] = useState(false);
  
  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(contact.sno, newTag.trim());
      setNewTag('');
    }
  };

  const priorityColors = {
    "High": "bg-gradient-to-r from-green-500 to-emerald-600",
    "Medium": "bg-gradient-to-r from-amber-400 to-orange-500",
    "Low": "bg-gradient-to-r from-gray-400 to-slate-500"
  };

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-t-4 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-purple-50/40" style={{ borderTopColor: contact.priority === 'High' ? '#10b981' : contact.priority === 'Medium' ? '#f59e0b' : '#6b7280' }}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
              {contact.name}
              {contact.linkedinUrl && (
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077b5] hover:text-[#006097] transition-colors"
                >
                  <motion.div whileHover={{ rotate: 10, scale: 1.2 }}>
                    <LinkedinIcon className="w-5 h-5" />
                  </motion.div>
                </a>
              )}
            </CardTitle>
            <Badge className={`${priorityColors[contact.priority as keyof typeof priorityColors]} text-white`}>
              {contact.priority}
            </Badge>
          </div>
          <div className="text-sm text-gray-500 mt-1">{contact.company}</div>
          <div className="text-sm text-purple-600">{contact.columbia}</div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-none">
              {contact.category}
            </Badge>
            {contact.tags?.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="bg-blue-100 text-blue-800 border-none flex items-center gap-1"
              >
                {tag}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => onRemoveTag(contact.sno, tag)}
                />
              </Badge>
            ))}
          </div>
          
          {contact.notes && (
            <div className="mt-3 bg-yellow-50 p-2 rounded-md">
              <div className="text-xs font-semibold text-yellow-800 mb-1">Notes:</div>
              <div className="text-sm text-gray-700">{contact.notes}</div>
            </div>
          )}
          
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3"
            >
              <Separator className="my-2" />
              
              {contact.contact && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-gray-500">Contact:</span>
                  <div className="text-sm">{contact.contact}</div>
                </div>
              )}
              
              {contact.tips && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-gray-500">Tips:</span>
                  <div className="text-sm">{contact.tips}</div>
                </div>
              )}
              
              {contact.comments && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-gray-500">Comments:</span>
                  <div className="text-sm">{contact.comments}</div>
                </div>
              )}
              
              {contact.howToUse && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-gray-500">How to Use:</span>
                  <div className="text-sm">{contact.howToUse}</div>
                </div>
              )}
              
              <div className="mt-2">
                <span className="text-xs font-semibold text-gray-500">Rank:</span>
                <div className="text-sm">{contact.rank}</div>
              </div>
            </motion.div>
          )}
          
          <Button 
            variant="link" 
            onClick={() => setExpanded(!expanded)} 
            className="mt-2 p-0 h-auto text-purple-600"
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(contact)}
              className="hover:bg-purple-50"
            >
              <Edit className="w-4 h-4" />
              <span className="ml-1">Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(contact.sno)}
              className="hover:bg-red-50 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              <span className="ml-1">Delete</span>
            </Button>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4" />
                <span className="ml-1">Tag</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Add Tag</h4>
                <div className="flex gap-2">
                  <Input 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter new tag..." 
                    className="flex-1"
                  />
                  <Button onClick={handleAddTag}>Add</Button>
                </div>
                {allTags.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-500 mb-1">Existing tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {allTags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="bg-gray-100 cursor-pointer hover:bg-blue-100"
                          onClick={() => {
                            onAddTag(contact.sno, tag);
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContactCard;
