
import React from 'react';
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const NetworkingDatabase = () => {
  const contacts = [
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
      priority: "High"
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
      priority: "High"
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
      priority: "High"
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
      priority: "High"
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
      priority: "High"
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
      priority: "Medium"
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
      priority: "High"
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
      priority: "Medium"
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
      priority: "High"
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
      priority: "High"
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
      priority: "Low"
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
      priority: "Medium"
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
      priority: "Low"
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
      priority: "Medium"
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
      priority: "Low"
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
      priority: "Medium"
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
      priority: "Medium"
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
      priority: "High"
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
      priority: "Medium"
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
      priority: "High"
    }
  ];

  const downloadExcel = () => {
    try {
      // Create worksheet with all contact data
      const worksheet = XLSX.utils.json_to_sheet(contacts);
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Networking");
      
      // Set column widths for better readability
      const maxWidth = 30;
      const colWidths = Object.keys(contacts[0]).map(() => ({ wch: maxWidth }));
      worksheet['!cols'] = colWidths;
      
      // Generate and download Excel file
      XLSX.writeFile(workbook, "Columbia_Networking_Database.xlsx");
      
      // Show success notification
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error("Failed to download Excel file. Please try again.");
    }
  };

  // Sort contacts by priority
  const sortedContacts = [...contacts].sort((a, b) => {
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-purple-800">Columbia Networking Database</h1>
        <p className="text-lg text-purple-600 mb-6 text-center max-w-2xl">
          A comprehensive database of valuable connections for Columbia University students.
          Click the button below to download the full database as an Excel file.
        </p>
        <Button 
          onClick={downloadExcel}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Excel Database
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-6 py-4 text-left text-purple-800">No.</th>
              <th className="px-6 py-4 text-left text-purple-800">Name</th>
              <th className="px-6 py-4 text-left text-purple-800">Company</th>
              <th className="px-6 py-4 text-left text-purple-800">Columbia</th>
              <th className="px-6 py-4 text-left text-purple-800">Category</th>
              <th className="px-6 py-4 text-left text-purple-800">Priority</th>
              <th className="px-6 py-4 text-left text-purple-800">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-200">
            {sortedContacts.map((contact) => (
              <tr key={contact.sno} className="hover:bg-purple-50">
                <td className="px-6 py-4">{contact.sno}</td>
                <td className="px-6 py-4 font-medium">{contact.name}</td>
                <td className="px-6 py-4">{contact.company}</td>
                <td className="px-6 py-4">{contact.columbia}</td>
                <td className="px-6 py-4">{contact.category}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                    contact.priority === "High" ? "bg-green-100 text-green-800" :
                    contact.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {contact.priority}
                  </span>
                </td>
                <td className="px-6 py-4">{contact.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NetworkingDatabase;
