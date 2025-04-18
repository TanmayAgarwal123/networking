
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ContactDialog from './ContactDialog';
import { defaultContacts } from '@/data/defaultContacts';
import { useContactManagement } from '@/hooks/useContactManagement';
import { Contact } from '@/types/contact';

// Import the components
import ContactsHeader from './networking/ContactsHeader';
import ContactsFilter from './networking/ContactsFilter';
import ContactsTable from './networking/ContactsTable';
import ContactsCardView from './networking/ContactsCardView';

const NetworkingDatabase = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const {
    contacts,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    syncStatus,
    handleSaveContact,
    handleDelete,
    handleMoveUp,
    handleMoveDown,
    handleAddTag,
    handleRemoveTag,
    sortedContacts,
    uniqueCategories,
    allTags,
    connectionAttempts
  } = useContactManagement(defaultContacts);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingContact(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  if (isLoading && connectionAttempts < 2) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-purple-700">Loading your contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50">
      {syncStatus === 'error' && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Could not connect to the cloud database. Your changes will be saved locally on this device only.
          </AlertDescription>
        </Alert>
      )}
      
      <ContactsHeader 
        contacts={contacts}
        syncStatus={syncStatus}
        handleCreateNew={handleCreateNew}
      />

      <div className="bg-white p-6 rounded-xl shadow-xl mb-8">
        <ContactsFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          uniqueCategories={uniqueCategories}
        />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex justify-start mb-4 bg-purple-50">
            <TabsTrigger value="all" className="flex-1">All Contacts ({sortedContacts.length})</TabsTrigger>
            <TabsTrigger value="high" className="flex-1">High Priority ({sortedContacts.filter(c => c.priority === 'High').length})</TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">Recently Added (5)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {viewMode === 'table' ? (
              <ContactsTable 
                contacts={sortedContacts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleMoveUp={handleMoveUp}
                handleMoveDown={handleMoveDown}
              />
            ) : (
              <ContactsCardView
                contacts={sortedContacts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAddTag={handleAddTag}
                handleRemoveTag={handleRemoveTag}
                allTags={allTags}
                containerVariants={containerVariants}
                itemVariants={itemVariants}
              />
            )}
          </TabsContent>
          
          <TabsContent value="high">
            {viewMode === 'table' ? (
              <ContactsTable 
                contacts={sortedContacts.filter(c => c.priority === 'High')}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleMoveUp={handleMoveUp}
                handleMoveDown={handleMoveDown}
              />
            ) : (
              <ContactsCardView
                contacts={sortedContacts.filter(c => c.priority === 'High')}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAddTag={handleAddTag}
                handleRemoveTag={handleRemoveTag}
                allTags={allTags}
                containerVariants={containerVariants}
                itemVariants={itemVariants}
              />
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            {viewMode === 'table' ? (
              <ContactsTable 
                contacts={sortedContacts.slice(0, 5)}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleMoveUp={handleMoveUp}
                handleMoveDown={handleMoveDown}
              />
            ) : (
              <ContactsCardView
                contacts={sortedContacts.slice(0, 5)}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAddTag={handleAddTag}
                handleRemoveTag={handleRemoveTag}
                allTags={allTags}
                containerVariants={containerVariants}
                itemVariants={itemVariants}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Dialog */}
      <ContactDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveContact}
        contact={editingContact}
        mode={dialogMode}
        existingContacts={contacts}
      />
    </div>
  );
};

export default NetworkingDatabase;
