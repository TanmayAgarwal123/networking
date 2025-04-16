
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { Download, Edit, Trash2, LinkedinIcon, Plus, ArrowUpDown } from "lucide-react";
import ContactDialog from './ContactDialog';

const NetworkingDatabase = () => {
  const [contacts, setContacts] = useState([
    // Career Services & University Staff
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
      linkedinUrl: "https://www.linkedin.com/in/mrdavidfitzgerald/"
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
      linkedinUrl: "https://www.linkedin.com/in/kimnnguyen/"
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
      linkedinUrl: "https://www.linkedin.com/in/jennymak/"
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
      linkedinUrl: "https://www.linkedin.com/in/madhurima-magesh/"
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
      linkedinUrl: "https://www.linkedin.com/in/peize-song/"
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
      linkedinUrl: "https://www.linkedin.com/in/maximolibrandi/"
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
      linkedinUrl: "https://www.linkedin.com/in/aryanjalali/"
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
      linkedinUrl: "https://www.linkedin.com/in/nilaaraghunathan/"
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
      linkedinUrl: "https://www.linkedin.com/in/shyam-pandya/"
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
      linkedinUrl: "https://www.linkedin.com/in/nithishma-allu/"
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
      linkedinUrl: "https://www.linkedin.com/in/sachi-kaushik30/"
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
      linkedinUrl: "https://www.linkedin.com/in/sudoyolo/"
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
      linkedinUrl: "https://www.linkedin.com/in/jmisquitta/"
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
      linkedinUrl: "https://www.linkedin.com/in/alok-mathur/"
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
      linkedinUrl: "https://www.linkedin.com/in/bindumadhavim/"
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
      linkedinUrl: "https://www.linkedin.com/in/sahethi-depuru-guru/"
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
      linkedinUrl: "https://www.linkedin.com/in/ritayanpatra/"
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
      linkedinUrl: "https://www.linkedin.com/in/anushkaagarwal24/"
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
      linkedinUrl: "https://www.linkedin.com/in/mittal-sejal/"
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
      linkedinUrl: "https://www.linkedin.com/in/rashmi-chelliah/"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

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

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDelete = (sno: number) => {
    const newContacts = contacts.filter(c => c.sno !== sno);
    setContacts(newContacts);
    toast.success("Contact deleted successfully!");
  };

  const handleCreateNew = () => {
    setEditingContact(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleSaveContact = (contact: any) => {
    if (dialogMode === 'create') {
      setContacts([...contacts, contact]);
      toast.success("New contact added successfully!");
    } else {
      const newContacts = contacts.map(c => c.sno === contact.sno ? contact : c);
      setContacts(newContacts);
      toast.success("Contact updated successfully!");
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-purple-800 tracking-tight">
          Columbia Networking Database
        </h1>
        <p className="text-lg text-purple-600 mb-6 text-center max-w-2xl">
          A comprehensive database of valuable connections for Columbia University students.
        </p>
        <div className="flex gap-4 mb-8">
          <Button
            onClick={downloadExcel}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Excel
          </Button>
          <Button
            onClick={handleCreateNew}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Contact
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-xl animate-fade-in">
        <table className="min-w-full bg-white">
          <thead className="bg-purple-100">
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
              <th className="px-6 py-4 text-left text-purple-800 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-200">
            {sortedContacts.map((contact) => (
              <tr
                key={contact.sno}
                className="hover:bg-purple-50 transition-colors"
              >
                <td className="px-6 py-4">{contact.sno}</td>
                <td className="px-6 py-4 font-medium flex items-center gap-2">
                  {contact.name}
                  {contact.linkedinUrl && (
                    <a
                      href={contact.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0077b5] hover:text-[#006097] transition-colors"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                </td>
                <td className="px-6 py-4">{contact.company}</td>
                <td className="px-6 py-4">{contact.columbia}</td>
                <td className="px-6 py-4">{contact.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      contact.priority === "High"
                        ? "bg-green-100 text-green-800"
                        : contact.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {contact.priority}
                  </span>
                </td>
                <td className="px-6 py-4">{contact.contact}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(contact)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-purple-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(contact.sno)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-50 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ContactDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveContact}
        initialData={editingContact}
        mode={dialogMode}
      />
    </div>
  );
};

export default NetworkingDatabase;
