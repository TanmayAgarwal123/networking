
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

// Define the Contact interface here to match the one in NetworkingDatabase.tsx
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

// Define the props for the ContactDialog component
export interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  contact: Contact | null; // Make contact prop accept null for creating new contacts
  mode: 'create' | 'edit';
  existingContacts: Contact[];
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  contact,
  mode,
  existingContacts
}) => {
  const [formData, setFormData] = useState<Contact>({
    sno: 0,
    name: '',
    contact: '',
    email: '',
    company: '',
    columbia: '',
    tips: '',
    comments: '',
    category: '',
    howToUse: '',
    priority: 'Medium',
    linkedinUrl: '',
    rank: 50,
    notes: '',
    tags: []
  });

  useEffect(() => {
    if (mode === 'edit' && contact) {
      setFormData(contact);
    } else {
      // For create mode, generate a new sno (max + 1)
      const maxSno = existingContacts.reduce((max, c) => Math.max(max, c.sno), 0);
      setFormData({
        sno: maxSno + 1,
        name: '',
        contact: '',
        email: '',
        company: '',
        columbia: '',
        tips: '',
        comments: '',
        category: '',
        howToUse: '',
        priority: 'Medium',
        linkedinUrl: '',
        rank: 50,
        notes: '',
        tags: []
      });
    }
  }, [mode, contact, existingContacts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Name is required!");
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-purple-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-600">
            {mode === 'create' ? 'Add New Contact' : 'Edit Contact'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contact Name"
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Info</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Phone or LinkedIn"
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company / Organization"
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="columbia">Columbia Connection</Label>
              <Input
                id="columbia"
                name="columbia"
                value={formData.columbia}
                onChange={handleChange}
                placeholder="Connection to Columbia"
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Contact Category"
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                name="priority"
                value={formData.priority} 
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger className="border-purple-200 focus-visible:ring-purple-500">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="LinkedIn Profile URL"
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rank">Rank (1-100)</Label>
              <Input
                id="rank"
                name="rank"
                type="number"
                min="1"
                max="100"
                value={formData.rank}
                onChange={handleChange}
                placeholder="Contact Rank"
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tips">Tips</Label>
            <Textarea
              id="tips"
              name="tips"
              value={formData.tips}
              onChange={handleChange}
              placeholder="Networking Tips"
              className="h-20 resize-none border-purple-200 focus-visible:ring-purple-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="howToUse">How To Use</Label>
            <Textarea
              id="howToUse"
              name="howToUse"
              value={formData.howToUse}
              onChange={handleChange}
              placeholder="How to leverage this contact"
              className="h-20 resize-none border-purple-200 focus-visible:ring-purple-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Additional comments"
              className="h-20 resize-none border-purple-200 focus-visible:ring-purple-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Personal Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Your personal notes about this contact"
              className="h-20 resize-none border-purple-200 focus-visible:ring-purple-500"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {mode === 'create' ? 'Add Contact' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
