
import React from 'react';
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';

const NetworkingDatabase = () => {
  const contacts = [
    // Career Services & University Staff
    {
      category: "University Staff",
      priority: "High",
      name: "David Fitzgerald",
      role: "Assistant Director of Career Services",
      company: "Columbia University",
      contact: "Via LinkedIn",
      tips: "Provided Zoom calendar access",
      comments: "Direct access to career services; valuable for job postings and interview prep",
      useCase: "Schedule regular check-ins; ask for resume feedback and employer connections",
      linkedIn: "mrdavidfitzgerald"
    },
    // ... More contacts would be added here
  ];

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(contacts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Networking");
    
    // Add column widths
    const maxWidth = 40;
    const colWidths = Object.keys(contacts[0]).map(() => ({ wch: maxWidth }));
    worksheet['!cols'] = colWidths;

    // Generate Excel file
    XLSX.writeFile(workbook, "Columbia_Networking_Database.xlsx");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-purple-800">Columbia Networking Database</h1>
        <Button 
          onClick={downloadExcel}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          Download Excel Database
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-6 py-4 text-left text-purple-800">Name</th>
              <th className="px-6 py-4 text-left text-purple-800">Role</th>
              <th className="px-6 py-4 text-left text-purple-800">Company</th>
              <th className="px-6 py-4 text-left text-purple-800">Priority</th>
              <th className="px-6 py-4 text-left text-purple-800">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-200">
            {contacts.map((contact, index) => (
              <tr key={index} className="hover:bg-purple-50">
                <td className="px-6 py-4">{contact.name}</td>
                <td className="px-6 py-4">{contact.role}</td>
                <td className="px-6 py-4">{contact.company}</td>
                <td className="px-6 py-4">{contact.priority}</td>
                <td className="px-6 py-4">{contact.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NetworkingDatabase;
