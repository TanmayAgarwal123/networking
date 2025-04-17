
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LinkedinIcon, Save, X, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: any) => void;
  initialData?: any;
  mode: 'create' | 'edit';
  allTags?: string[];
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
  allTags = []
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    contact: '',
    email: 'N/A',
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
    tags: [] as string[]
  });

  const [newTag, setNewTag] = React.useState('');

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        rank: initialData.rank || 50,
        notes: initialData.notes || '',
        linkedinUrl: initialData.linkedinUrl || '',
        tags: initialData.tags || []
      });
    } else {
      // Reset form when opening for create
      setFormData({
        name: '',
        contact: '',
        email: 'N/A',
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
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, sno: initialData?.sno || Date.now() });
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddExistingTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };

  const formContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const formItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600">
            {mode === 'create' ? 'Add New Contact' : 'Edit Contact'}
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            Fill in the contact details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <motion.div
            variants={formContainerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={formItemVariants} className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Name*</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Contact</label>
                <Input
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500"
                />
              </div>
            </motion.div>

            <motion.div variants={formItemVariants} className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Columbia Role</label>
                <Input
                  value={formData.columbia}
                  onChange={(e) => setFormData({ ...formData, columbia: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500"
                />
              </div>
            </motion.div>

            <motion.div variants={formItemVariants} className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </motion.div>

            <motion.div variants={formItemVariants} className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Rank (0-100)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 0 })}
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">LinkedIn URL</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                  {formData.linkedinUrl && (
                    <a
                      href={formData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 bg-[#0077b5] text-white rounded-md hover:bg-[#006097] transition-colors"
                    >
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={formItemVariants} className="space-y-1">
              <label className="text-sm font-medium text-purple-700">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1"
                  >
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {allTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Existing tags (click to add):</p>
                  <div className="flex flex-wrap gap-1">
                    {allTags.filter(tag => !formData.tags.includes(tag)).map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline"
                        className="bg-gray-100 cursor-pointer hover:bg-blue-100"
                        onClick={() => handleAddExistingTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div variants={formItemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Tips</label>
                <Textarea
                  value={formData.tips}
                  onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500 h-20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Comments</label>
                <Textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500 h-20"
                />
              </div>
            </motion.div>

            <motion.div variants={formItemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Personal Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500 h-20"
                  placeholder="Add your personal notes about this contact..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">How to Use</label>
                <Textarea
                  value={formData.howToUse}
                  onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus-visible:ring-purple-500 h-20"
                />
              </div>
            </motion.div>
          </motion.div>

          <DialogFooter className="pt-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Contact
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
