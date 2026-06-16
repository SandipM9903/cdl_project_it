// OrgData.js
export const organizationData = {
  name: "Organizational Hierarchy",
  children: [
    {
      name: "D. MARKETING",
      color: "bg-red-700",
      children: [
        { name: "SAD - Sales Automation Division", color: "bg-gray-600" },
        { name: "Sales", color: "bg-gray-600" },
        { name: "Field Sales", color: "bg-gray-600" },
        // ... (rest of D. Marketing children)
        {
          name: "Field Sales",
          color: "bg-gray-600",
          children: [
            { name: "Accounts" },
            { name: "Management" },
            { name: "New Business" },
            { name: "Operations" },
          ],
        },
        { name: "Telesales", color: "bg-gray-600" },
        { name: "Manage e-Business", color: "bg-gray-600" },
        { name: "Delivery & Support", color: "bg-gray-600" },
        { name: "Strategy & Support", color: "bg-gray-600" },
        { name: "Strategic Support", color: "bg-gray-600" },
        { name: "Operations", color: "bg-gray-600" },
      ],
    },
    {
      name: "D. COMMUNICATIONS",
      color: "bg-red-700",
      children: [
        { name: "NSE - Business Solutions Division", color: "bg-gray-600" },
        { name: "Business Support", color: "bg-gray-600" },
        { name: "Delivery & Support", color: "bg-gray-600" },
        { name: "Technical & Configuration", color: "bg-gray-600" },
        { name: "Support Office & Public Administration", color: "bg-gray-600" },
        { name: "Delivery & Support", color: "bg-gray-600" },
        { name: "Operations", color: "bg-gray-600" },
      ],
    },
    {
      name: "D. ADMINISTRATION",
      color: "bg-red-700",
      children: [
        { name: "Head" },
        { name: "Procurement & Contracts" },
        { name: "Emergency & Disaster Planning" },
        // ... (rest of D. Administration children)
        {
          name: "Head",
          color: "bg-gray-600",
          children: [{ name: "Admin" }],
        },
        { name: "Procurement & Contracts", color: "bg-gray-600" },
        { name: "Human Resource Administration", color: "bg-gray-600" },
        { name: "Financial Management", color: "bg-gray-600" },
        { name: "Communication & PR", color: "bg-gray-600" },
        { name: "Purchasing & Administration", color: "bg-gray-600" },
        { name: "Information Systems", color: "bg-gray-600" },
        { name: "MBS", color: "bg-gray-600" },
        { name: "Travel & Hospitality", color: "bg-gray-600" },
        { name: "Fleet", color: "bg-gray-600" },
        { name: "OHS&E", color: "bg-gray-600" },
        { name: "EEO & Equity", color: "bg-gray-600" },
        { name: "Quality", color: "bg-gray-600" },
        { name: "Security & Risk Management", color: "bg-gray-600" },
        { name: "Account", color: "bg-gray-600" },
        { name: "Communications", color: "bg-gray-600" },
      ],
    },
    {
      name: "D. PROJECT",
      color: "bg-red-700",
      children: [
        { name: "Digital" },
        { name: "Special Projects" },
        { name: "HR-Policies & Guidelines" },
        { name: "Public Services" },
      ],
    },
  ],
};