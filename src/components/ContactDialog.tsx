
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LinkedinIcon, Save } from "lucide-react";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: any) => void;
  initialData?: any;
  mode: 'create' | 'edit';
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
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
    linkedinUrl: ''
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, sno: initialData?.sno || Date.now() });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-purple-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-800">
            {mode === 'create' ? 'Add New Contact' : 'Edit Contact'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Contact</label>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Company</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Columbia Role</label>
              <Input
                value={formData.columbia}
                onChange={(e) => setFormData({ ...formData, columbia: e.target.value })}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">LinkedIn URL</label>
            <div className="flex gap-2">
              <Input
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="border-purple-200 focus:border-purple-400"
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full p-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">Tips</label>
            <Input
              value={formData.tips}
              onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">Comments</label>
            <Input
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-700">How to Use</label>
            <Input
              value={formData.howToUse}
              onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
