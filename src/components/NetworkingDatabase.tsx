import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { Download, Edit, Trash2, LinkedinIcon, Plus, ArrowUpDown, Search, Tags, Filter, Calendar, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ContactDialog from './ContactDialog';
import ContactCard from './ContactCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getContacts, saveContacts } from '@/services/contactService';
import { Contact } from '@/types/contact';

const defaultContacts: Contact[] = [
  {
    sno: 1,
    name: "David Fitzgerald",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Columbia University",
    columbia: "Assistant Director of Career Services",
    tips: "Provided Zoom calendar access",
    comments: "Direct access to career services; valuable for job postings and interview prep",
    category: "University Staff",
    howToUse: "Schedule regular check-ins; ask for resume feedback and employer connections",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/mrdavidfitzgerald/",
    rank: 95,
    notes: "",
    tags: ["Career Services", "Columbia Staff"]
  },
  {
    sno: 2,
    name: "Kim Nguyen",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Columbia Engineering",
    columbia: "Career & Higher Education Professional",
    tips: "N/A",
    comments: "Career services professional specialized in engineering",
    category: "University Staff",
    howToUse: "Connect for engineering-specific opportunities and career advice",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/kimnnguyen/",
    rank: 90,
    notes: "",
    tags: ["Career Services", "Columbia Staff"]
  },
  {
    sno: 3,
    name: "Jenny S. Mak",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Columbia Engineering",
    columbia: "Senior Associate Dean, Undergraduate and Graduate Student Affairs",
    tips: "N/A",
    comments: "High-level administrator with broad university insights",
    category: "University Administration",
    howToUse: "Connect for academic concerns and university-wide networking",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/jennymak/",
    rank: 85,
    notes: "",
    tags: ["Administration", "Columbia Staff"]
  },
  {
    sno: 4,
    name: "Madhurima Magesh",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Ex-Amazon",
    columbia: "MS CS Columbia",
    tips: "Very helpful for career placements",
    comments: "Former Amazon engineer with strong network",
    category: "Recent Grad - Big Tech",
    howToUse: "Ask for Amazon contacts and general tech interview preparation",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/madhurima-magesh/",
    rank: 92,
    notes: "Strong Amazon network",
    tags: ["Amazon", "Big Tech"]
  },
  {
    sno: 5,
    name: "Peize Song",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "TikTok",
    columbia: "MS CS Columbia",
    tips: "Offered referral first contact",
    comments: "Software Engineer at TikTok, very responsive",
    category: "Recent Grad - Big Tech",
    howToUse: "Follow up on referral offer and learn about TikTok culture",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/peize-song/",
    rank: 98,
    notes: "Responsive, offers referrals",
    tags: ["TikTok", "Big Tech"]
  },
  {
    sno: 6,
    name: "Maximo Librandi",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "N/A",
    columbia: "MS CS Columbia",
    tips: "Fulbright Scholar",
    comments: "Strong academic background and achievements",
    category: "Current Student with Scholarship",
    howToUse: "Connect about academic excellence and scholarship insights",
    priority: "Medium",
    linkedinUrl: "https://www.linkedin.com/in/maximolibrandi/",
    rank: 75,
    notes: "Fulbright Scholar",
    tags: ["Scholarship", "Academic"]
  },
  {
    sno: 7,
    name: "Aryan Jalali",
    contact: "+1 6466832431",
    email: "N/A",
    company: "Mechi Wellness",
    columbia: "MS CS Columbia",
    tips: "N/A",
    comments: "Software Engineer at health tech startup",
    category: "Current Student with Industry Experience",
    howToUse: "Connect for startup insights and campus life advice",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/aryanjalali/",
    rank: 88,
    notes: "Health tech startup",
    tags: ["Startup", "Health Tech"]
  },
  {
    sno: 8,
    name: "Nilaa Raghunathan",
    contact: "+91-6369647141",
    email: "N/A",
    company: "N/A",
    columbia: "MS Data Science Columbia",
    tips: "N/A",
    comments: "Data Science student with direct contact",
    category: "Current Student - Data Science",
    howToUse: "Connect about data science vs CS curriculum",
    priority: "Medium",
    linkedinUrl: "https://www.linkedin.com/in/nilaaraghunathan/",
    rank: 68,
    notes: "Data Science student",
    tags: ["Data Science", "Curriculum"]
  },
  {
    sno: 9,
    name: "Shyam Pandya",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Microsoft",
    columbia: "MS CS Columbia",
    tips: "Practice problem solving through LeetCode/Codechef, participate in hackathons",
    comments: "Gaming ML engineer at Microsoft",
    category: "Recent Grad - Big Tech",
    howToUse: "Ask for Microsoft referral and ML/gaming industry insights",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/shyam-pandya/",
    rank: 96,
    notes: "Gaming ML engineer",
    tags: ["Microsoft", "Big Tech", "ML", "Gaming"]
  },
  {
    sno: 10,
    name: "Nithishma Allu",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Meta",
    columbia: "MS CS Columbia",
    tips: "Reach out to recruiters directly rather than cold applying",
    comments: "SWE at Meta with valuable application advice",
    category: "Recent Grad - Big Tech",
    howToUse: "Ask for Meta referral and company-specific application tips",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/nithishma-allu/",
    rank: 94,
    notes: "SWE at Meta",
    tags: ["Meta", "Big Tech", "SWE"]
  },
  {
    sno: 11,
    name: "Sachi Kaushik",
    contact: "+16462065505",
    email: "N/A",
    company: "N/A",
    columbia: "N/A",
    tips: "N/A",
    comments: "Has direct phone number",
    category: "Needs Research",
    howToUse: "Research background before connecting",
    priority: "Low",
    linkedinUrl: "https://www.linkedin.com/in/sachi-kaushik30/",
    rank: 30,
    notes: "Direct phone number",
    tags: ["Research"]
  },
  {
    sno: 12,
    name: "Ishan Bansal",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Ex-DeeplogicAI",
    columbia: "MS CS Columbia",
    tips: "N/A",
    comments: "AI Engineering background",
    category: "Current Student with AI Focus",
    howToUse: "Connect about AI coursework and projects",
    priority: "Medium",
    linkedinUrl: "https://www.linkedin.com/in/sudoyolo/",
    rank: 70,
    notes: "AI Engineering",
    tags: ["AI", "Engineering"]
  },
  {
    sno: 13,
    name: "Jason Misquitta",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Ex-TCS Intern",
    columbia: "MS Data Science Columbia",
    tips: "N/A",
    comments: "TCS experience for consulting industry insights",
    category: "Current Student with Consulting Background",
    howToUse: "Connect about consulting-to-tech transition",
    priority: "Low",
    linkedinUrl: "https://www.linkedin.com/in/jmisquitta/",
    rank: 40,
    notes: "Consulting background",
    tags: ["Consulting"]
  },
  {
    sno: 14,
    name: "Alok Mathur",
    contact: "+16462263924",
    email: "N/A",
    company: "Ex-CERN Intern",
    columbia: "MS CS Columbia",
    tips: "N/A",
    comments: "Prestigious research background (CERN)",
    category: "Current Student with Research Background",
    howToUse: "Connect about research opportunities",
    priority: "Medium",
    linkedinUrl: "https://www.linkedin.com/in/alok-mathur/",
    rank: 72,
    notes: "CERN intern",
    tags: ["Research", "CERN"]
  },
  {
    sno: 15,
    name: "Bindu Madhavi M",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "N/A",
    columbia: "N/A",
    tips: "N/A",
    comments: "Limited information available",
    category: "Needs Research",
    howToUse: "Research background before connecting",
    priority: "Low",
    linkedinUrl: "https://www.linkedin.com/in/bindumadhavim/",
    rank: 25,
    notes: "Limited info",
    tags: ["Research"]
  },
  {
    sno: 16,
    name: "Sahethi Depuru Guru",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Wells Fargo",
    columbia: "N/A",
    tips: "N/A",
    comments: "Software Engineer in financial sector",
    category: "Industry Connection - Finance",
    howToUse: "Connect about finance tech opportunities",
    priority: "Medium",
    linkedinUrl: "https://www.linkedin.com/in/sahethi-depuru-guru/",
    rank: 65,
    notes: "Finance sector",
    tags: ["Finance", "SWE"]
  },
  {
    sno: 17,
    name: "Ritayan Patra",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Ex-NatWest Group",
    columbia: "MS Data Science Columbia",
    tips: "N/A",
    comments: "Financial industry background",
    category: "Current Student - Data Science",
    howToUse: "Connect about fintech opportunities",
    priority: "Medium",
    linkedinUrl: "https://www.linkedin.com/in/ritayanpatra/",
    rank: 66,
    notes: "Fintech",
    tags: ["Fintech", "Data Science"]
  },
  {
    sno: 18,
    name: "Anushka Agarwal",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "Ex-Intel",
    columbia: "MS CS Columbia",
    tips: "N/A",
    comments: "AI & Computer Vision specialization",
    category: "Current Student with Big Tech Experience",
    howToUse: "Connect about AI/CV coursework",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/anushkaagarwal24/",
    rank: 89,
    notes: "AI & CV",
    tags: ["AI", "CV", "Intel"]
  },
  {
    sno: 19,
    name: "Sejal Mittal",
    contact: "+919159256878",
    email: "N/A",
    company: "Ex-Amazon, Ex-Ericsson",
    columbia: "MS Data Science Columbia",
    tips: "N/A",
    comments: "Extensive industry experience",
    category: "Current Student with Big Tech Experience",
    howToUse: "Connect about data engineering vs data science roles",
    priority: "Medium",
    linkedinUrl: "https://www.linkedin.com/in/mittal-sejal/",
    rank: 78,
    notes: "Data Eng",
    tags: ["Data Eng", "Amazon", "Ericsson"]
  },
  {
    sno: 20,
    name: "Rashmi Chelliah",
    contact: "Via LinkedIn",
    email: "N/A",
    company: "N/A",
    columbia: "MS CS Columbia",
    tips: "N/A",
    comments: "ML Engineer background",
    category: "Current Student with ML Focus",
    howToUse: "Connect about ML curriculum",
    priority: "High",
    linkedinUrl: "https://www.linkedin.com/in/rashmi-chelliah/",
    rank: 87,
    notes: "ML Engineer",
    tags: ["ML", "Engineer"]
  }
];

const STORAGE_KEY = 'columbia_networking_contacts';

const NetworkingDatabase = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  const uniqueCategories = ["All", ...Array.from(new Set(contacts.map(c => c.category)))];
  
  const allTags = Array.from(new Set(contacts.flatMap(contact => contact.tags || [])));

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

  // Load contacts from Firebase on component mount
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      try {
        const firebaseContacts = await getContacts();
        
        if (firebaseContacts && firebaseContacts.length > 0) {
          // We found contacts in Firebase, use those
          setContacts(firebaseContacts);
        } else {
          // No contacts in Firebase yet, try local storage first
          const localContacts = localStorage.getItem(STORAGE_KEY);
          if (localContacts) {
            try {
              const parsedContacts = JSON.parse(localContacts);
              setContacts(parsedContacts);
              // Save local contacts to Firebase for future syncing
              await saveContacts(parsedContacts);
              toast.success("Contacts loaded from local storage and synced to cloud");
            } catch (error) {
              console.error("Error parsing stored contacts:", error);
              setContacts(defaultContacts);
              // Save default contacts to Firebase
              await saveContacts(defaultContacts);
            }
          } else {
            // No local storage either, use defaults
            setContacts(defaultContacts);
            // Save default contacts to Firebase
            await saveContacts(defaultContacts);
          }
        }
        setSyncStatus('synced');
      } catch (error) {
        console.error("Error loading contacts:", error);
        toast.error("Failed to sync with cloud. Using local data.");
        
        // Fallback to local storage if Firebase fails
        const localContacts = localStorage.getItem(STORAGE_KEY);
        if (localContacts) {
          try {
            setContacts(JSON.parse(localContacts));
          } catch (error) {
            setContacts(defaultContacts);
          }
        } else {
          setContacts(defaultContacts);
        }
        
        setSyncStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, []);

  // Save contacts to Firebase whenever they change
  useEffect(() => {
    if (contacts.length > 0 && !isLoading) {
      const syncToFirebase = async () => {
        try {
          setSyncStatus('syncing');
          await saveContacts(contacts);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); // Keep local copy too
          setSyncStatus('synced');
        } catch (error) {
          console.error("Error syncing contacts to Firebase:", error);
          // Still save to local storage as fallback
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
          setSyncStatus('error');
          toast.error("Failed to sync with cloud. Changes saved locally.");
        }
      };
      
      syncToFirebase();
    }
  }, [contacts, isLoading]);

  const downloadExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(contacts);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Networking");
      const maxWidth = 30;
      const colWidths = Object.keys(contacts[0]).map(() => ({ wch: maxWidth }));
      worksheet['!cols'] = colWidths;
      XLSX.writeFile(workbook, "Columbia_Networking_Database.xlsx");
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error("Failed to download Excel file. Please try again.");
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDelete = (sno: number) => {
    const newContacts = contacts.filter(c => c.sno !== sno);
    
    const renumberedContacts = newContacts.map((contact, index) => ({
      ...contact,
      sno: index + 1
    }));
    
    setContacts(renumberedContacts);
    toast.success("Contact deleted successfully!");
  };

  const handleCreateNew = () => {
    setEditingContact(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleSaveContact = (contact: Contact) => {
    if (dialogMode === 'create') {
      const nextSno = contacts.length > 0 
        ? Math.max(...contacts.map(c => c.sno)) + 1 
        : 1;
      
      const newContact = {
        ...contact,
        sno: nextSno
      };
      
      setContacts([...contacts, newContact]);
      toast.success("New contact added successfully!");
    } else {
      const newContacts = contacts.map(c => c.sno === contact.sno ? contact : c);
      setContacts(newContacts);
      toast.success("Contact updated successfully!");
    }
  };

  const handleMoveUp = (sno: number) => {
    const index = contacts.findIndex(c => c.sno === sno);
    if (index > 0) {
      const newContacts = [...contacts];
      const currentRank = newContacts[index].rank;
      const prevRank = newContacts[index - 1].rank;
      newContacts[index].rank = prevRank;
      newContacts[index - 1].rank = currentRank;
      setContacts(newContacts);
      toast.success("Contact moved up successfully!");
    }
  };

  const handleMoveDown = (sno: number) => {
    const index = contacts.findIndex(c => c.sno === sno);
    if (index < contacts.length - 1) {
      const newContacts = [...contacts];
      const currentRank = newContacts[index].rank;
      const nextRank = newContacts[index + 1].rank;
      newContacts[index].rank = nextRank;
      newContacts[index + 1].rank = currentRank;
      setContacts(newContacts);
      toast.success("Contact moved down successfully!");
    }
  };

  const handleAddTag = (contactId: number, tag: string) => {
    if (!tag.trim()) return;
    
    setContacts(prevContacts => 
      prevContacts.map(contact => {
        if (contact.sno === contactId) {
          const currentTags = contact.tags || [];
          if (!currentTags.includes(tag)) {
            return {
              ...contact,
              tags: [...currentTags, tag]
            };
          }
        }
        return contact;
      })
    );
  };

  const handleRemoveTag = (contactId: number, tagToRemove: string) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => {
        if (contact.sno === contactId && contact.tags) {
          return {
            ...contact,
            tags: contact.tags.filter(tag => tag !== tagToRemove)
          };
        }
        return contact;
      })
    );
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.columbia.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "All" || contact.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || contact.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const rankDiff = b.rank - a.rank;
    if (rankDiff !== 0) return rankDiff;
    
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  useEffect(() => {
    if (contacts.length > 0) {
      updateContactNumbers();
    }
  }, [contacts.length]);

  const updateContactNumbers = () => {
    const updatedContacts = [...contacts].map((contact, index) => ({
      ...contact,
      sno: index + 1
    }));
    
    setContacts(updatedContacts);
  };

  if (isLoading) {
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4 text-purple-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-pink-600">
          Columbia Networking Database
        </h1>
        <p className="text-lg text-purple-600 mb-6 text-center max-w-2xl">
          A comprehensive database of valuable connections for Columbia University students.
        </p>
        
        {/* Sync status indicator */}
        <div className="mb-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            syncStatus === 'synced' ? 'bg-green-500' : 
            syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : 
            'bg-red-500'
          }`}></div>
          <span className={`text-sm ${
            syncStatus === 'synced' ? 'text-green-700' : 
            syncStatus === 'syncing' ? 'text-yellow-700' : 
            'text-red-700'
          }`}>
            {syncStatus === 'synced' ? 'Synced across all devices' : 
             syncStatus === 'syncing' ? 'Syncing changes...' : 
             'Offline mode - using local storage'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={downloadExcel}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download Excel
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Contact
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Rest of the component remains the same */}
      <div className="bg-white p-6 rounded-xl shadow-xl mb-8">
        {/* ... keep existing code (search, filtering, and tab components) */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search contacts by name, company, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-purple-200 focus-visible:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              onClick={() => setViewMode('cards')}
              className="flex items-center gap-2"
            >
              <Tags className="w-4 h-4" />
              Cards
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          {/* ... keep existing code (tabs component and content) */}
          <TabsList className="w-full flex justify-start mb-4 bg-purple-50">
            <TabsTrigger value="all" className="flex-1">All Contacts ({sortedContacts.length})</TabsTrigger>
            <TabsTrigger value="high" className="flex-1">High Priority ({sortedContacts.filter(c => c.priority === 'High').length})</TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">Recently Added (5)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {/* ... keep existing code (all tab content) */}
            {viewMode === 'table' ? (
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
                    {sortedContacts.map((contact, index) => (
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
