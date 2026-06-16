// processLibraryData.js

const processLibraryData = [
  {
    name: "Requirements",
    subfolders: [
      {
        name: "Checklist",
        itemCount: 3,
        files: [
          { name: "REQ - Requirement Review Checklist.xls", url: "/files/1.0 Requirements/Checklist/REQ - Requirement Review Checklist.xls" },
          { name: "REQ - Requirements Gathering Checklist.xls", url: "/files/1.0 Requirements/Checklist/REQ - Requirements Gathering Checklist.xls" },
          
        ],
      },
      {
        name: "Forms and Templates",
        itemCount: 9,
        files: [
          { name: "REQ - Business and User Requirements Specification.docx", url: "/files/1.0 Requirements/Forms and Templates/REQ - Business and User Requirements Specification.docx" },
          { name: "REQ - Change Request Log.xls", url: "/files/1.0 Requirements/Forms and Templates/REQ - Change Request Log.xls" },
          { name: "REQ - Change Request.docx", url: "/files/1.0 Requirements/Forms and Templates/REQ - Change Request.docx" },
          { name: "REQ - CR Cover Letter.docx", url: "/files/1.0 Requirements/Forms and Templates/REQ - CR Cover Letter.docx" },
          { name: "REQ - Requirement Traceability Matrix.xls", url: "/files/1.0 Requirements/Forms and Templates/REQ - Requirement Traceability Matrix.xls" },
          { name: "REQ - Requirements Understanding and Clarification.xls", url: "/files/1.0 Requirements/Forms and Templates/REQ - Requirements Understanding and Clarification.xls" },
          { name: "REQ - Software Requirement Specification.doc", url: "/files/1.0 Requirements/Forms and Templates/REQ - Software Requirement Specification.doc" },
          { name: "REQ - Technical Solution Proposal.docx", url: "/files/1.0 Requirements/Forms and Templates/REQ - Software Requirement Specification.doc" },
          { name: "REQ - Use Case Template.docx", url: "/files/1.0 Requirements/Forms and Templates/REQ - Software Requirement Specification.doc" },
          
          // Add remaining 9...
        ],
      },
      {
        name: "Guidelines",
        itemCount: 2,
        files: [
          { name: "REQ - Requirements Guidelines.docx", url: "/files/1.0 Requirements/Guidelines/REQ - Requirements Guidelines.docx" },
          { name: "REQ - Use Cases Guidelines.docx", url: "/files/1.0 Requirements/Guidelines/REQ - Use Cases Guidelines.docx" },
          
          // Add 2 more...
        ],
      },
      {
        name: "Process",
        itemCount: 1,
        files: [
          { name: "REQ - Requirement Process.doc", url: "/files/1.0 Requirements/Process/REQ - Requirement Process.doc" },
          
        ],
      },
    ],
  },
  {
  name: "Design",
  subfolders: [
    {
      name: "Checklist",
      itemCount: 1,
      files: [
        {
          name: "DES - Design Review Checklist.xls",
          url: "/files/2.0 Design/Checklist/DES - Design Review Checklist.xls"
        }
      ]
    },
    {
      name: "Forms and Templates",
      itemCount: 2,
      files: [
        {
          name: "DES - Detailed Design Document.doc",
          url: "/files/2.0 Design/Forms and Templates/DES - Detailed Design Document.doc"
        },
        {
          name: "DES - Make Reuse Analysis Report.xls",
          url: "/files/2.0 Design/Forms and Templates/DES - Make Reuse Analysis Report.xls"
        }
      ]
    },
    {
      name: "Guidelines",
      itemCount: 3,
      files: [
        {
          name: "DTD Guidelines V 1.0.doc",
          url: "/files/2.0 Design/Guidelines/DTD Guidelines V 1.0.doc"
        },
        {
          name: "HLD Guidelines V 1.0.doc",
          url: "/files/2.0 Design/Guidelines/HLD Guidelines V 1.0.doc"
        },
        {
          name: "ISMS-PO-Secure Development Policy.docx",
          url: "/files/2.0 Design/Guidelines/ISMS-PO-Secure Development Policy.docx"
        }
      ]
    },
    {
      name: "Process",
      itemCount: 1,
      files: [
        {
          name: "DES - Design Process.doc",
          url: "/files/2.0 Design/Process/DES - Design Process.doc"
        }
      ]
    }
  ]
},

{
  name: "Coding and Unit Testing (CUT)",
  subfolders: [
    {
      name: "Checklists",
      itemCount: 4,
      files: [
        { name: "CUT - Code Review Checklist.xls", url: "/files/3.0 CUT/Checklists/CUT - Code Review Checklist.xls" },
        { name: "CUT - Nav Implementation Review Checklist.xls", url: "/files/3.0 CUT/Checklists/CUT - Nav Implementation Review Checklist.xls" },
        { name: "CUT - Unit Test Plan Review Checklist.xls", url: "/files/3.0 CUT/Checklists/CUT - Unit Test Plan Review Checklist.xls" },
        { name: "CUT - Validation Messages Checklist.xls", url: "/files/3.0 CUT/Checklists/CUT - Validation Messages Checklist.xls" }
       
      ]
    },
    {
      name: "Forms and Templates",
      itemCount: 4,
      files: [
        { name: "CUT - Unit Test Case.xls", url: "/files/3.0 CUT/Forms and Templates/CUT - Unit Test Case.xls" },
        { name: "CUT - Unit Test Plan.docx", url: "/files/3.0 CUT/Forms and Templates/CUT - Unit Test Plan.docx" },
        { name: "CUT - Unit Test Report.docx", url: "/files/3.0 CUT/Forms and Templates/CUT - Unit Test Report.docx" },
        { name: "CUT - User Manual.docx", url: "/files/3.0 CUT/Forms and Templates/CUT - User Manual.docx" }
      ]
    },
    {
      name: "Guideline",
      itemCount: 4,
      files: [
        { name: "CUT - Coding and Unit Testing Guidelines.docx", url: "/files/3.0 CUT/Guideline/CUT - Coding and Unit Testing Guidelines.docx" },
        { name: "CUT - Coding Standards.doc", url: "/files/3.0 CUT/Guideline/CUT - Coding Standards.doc" },
        { name: "UI Standards V 1.0.doc", url: "/files/3.0 CUT/Guideline/UI Standards V 1.0.doc" },
        { name: "Unit Testing Guidelines V 1.0.doc", url: "/files/3.0 CUT/Guideline/Unit Testing Guidelines V 1.0.doc" }
      ]
    },
    {
      name: "Process",
      itemCount: 2,
      files: [
        { name: "CUT - Coding and Unit Testing Process.doc", url: "/files/3.0 CUT/Process/CUT - Coding and Unit Testing Process.doc" },
        { name: "Development Process V 1.0.doc", url: "/files/3.0 CUT/Process/Development Process V 1.0.doc" }
      ]
    }
  ]
}
,
 {
  name: "Testing",
  subfolders: [
    {
      name: "Checklist",
      itemCount: 7,
      files: [
        { name: "VAL - Controls Testing Check List.xls", url: "/files/4.0 Testing/Checklist/VAL - Controls Testing Check List.xls" },
        { name: "VAL - Database Testing Check List.xls", url: "/files/4.0 Testing/Checklist/VAL - Database Testing Check List.xls" },
        { name: "VAL - General Test Scenarios Check List.xls", url: "/files/4.0 Testing/Checklist/VAL - General Test Scenarios Check List.xls" },
        { name: "VAL - GUI Check List.xls", url: "/files/4.0 Testing/Checklist/VAL - GUI Check List.xls" },
        { name: "VAL - Reports Testing Check List.xls", url: "/files/4.0 Testing/Checklist/VAL - Reports Testing Check List.xls" },
        { name: "VAL - System Test Cases Review Checklist.xls", url: "/files/4.0 Testing/Checklist/VAL - System Test Cases Review Checklist.xls" },
        { name: "VAL - System Test Plan Review Checklist.xls", url: "/files/4.0 Testing/Checklist/VAL - System Test Plan Review Checklist.xls" }
      ]
    },
    {
      name: "Forms and Templates",
      itemCount: 5,
      files: [
        { name: "VAL - Bug Tracking Sheet.xls", url: "/files/4.0 Testing/Forms and Templates/VAL - Bug Tracking Sheet.xls" },
        { name: "VAL - System Test Cases.xls", url: "/files/4.0 Testing/Forms and Templates/VAL - System Test Cases.xls" },
        { name: "VAL - System Test Plan.docx", url: "/files/4.0 Testing/Forms and Templates/VAL - System Test Plan.docx" },
        { name: "VAL - System Test Report.docx", url: "/files/4.0 Testing/Forms and Templates/VAL - System Test Report.docx" },
        { name: "VAL - System Test Scenarios.xls", url: "/files/4.0 Testing/Forms and Templates/VAL - System Test Scenarios.xls" }
      ]
    },
    {
      name: "Guidelines",
      itemCount: 3,
      files: [
        { name: "Integration Testing Guidelines V 1.0.doc", url: "/files/4.0 Testing/Guidelines/Integration Testing Guidelines V 1.0.doc" },
        { name: "ISMS-PO-Secure Development Policy.docx", url: "/files/4.0 Testing/Guidelines/ISMS-PO-Secure Development Policy.docx" },
        { name: "VAL - System Testing Guidelines.docx", url: "/files/4.0 Testing/Guidelines/VAL - System Testing Guidelines.docx" }
      ]
    },
    {
      name: "Process",
      itemCount: 3,
      files: [
        { name: "Integration Testing Process V 1.0.doc", url: "/files/4.0 Testing/Process/Integration Testing Process V 1.0.doc" },
        { name: "Performance Testing Process (PRO-PTP) V 1.1.doc", url: "/files/4.0 Testing/Process/Performance Testing Process (PRO-PTP) V 1.1.doc" },
        { name: "VAL - System Testing Process.docx", url: "/files/4.0 Testing/Process/VAL - System Testing Process.docx" }
      ]
    }
  ]
},

  {
  name: "Causal Analysis and Resolution (CAR)",
  subfolders: [
    {
      name: "Forms and Templates",
      itemCount: 4,
      files: [
        { name: "CAR - Causal Analysis Report.xls", url: "/files/5.0 CAR/Forms and Templates/CAR - Causal Analysis Report.xls" },
        { name: "CAR - Defect Analysis.xls", url: "/files/5.0 CAR/Forms and Templates/CAR - Defect Analysis.xls" },
        { name: "CAR - DR Planning Form.xls", url: "/files/5.0 CAR/Forms and Templates/CAR - DR Planning Form.xls" },
        { name: "CAR - Fishbone Diagram Worksheet.xls", url: "/files/5.0 CAR/Forms and Templates/CAR - Fishbone Diagram Worksheet.xls" }
      ]
    },
    {
      name: "Guideline",
      itemCount: 1,
      files: [
        { name: "CAR - Causal Analysis and Resolution Guidelines.docx", url: "/files/5.0 CAR/Guideline/CAR - Causal Analysis and Resolution Guidelines.docx" }
      ]
    },
    {
      name: "Process",
      itemCount: 1,
      files: [
        { name: "CAR - Causal Analysis and Resolution Process.do", url: "/files/5.0 CAR/Process/CAR - Causal Analysis and Resolution Process.doc" }
      ]
    }
  ]
}
,
{
  name: "Decision Analysis and Resolution (DAR)",
  subfolders: [
    {
      name: "Forms and Templates",
      itemCount: 1,
      files: [
        { name: "DAR - DAR Template.xls", url: "/files/6.0 DAR/Forms and Templates/DAR - DAR Template.xls" }
      ]
    },
    {
      name: "Process",
      itemCount: 1,
      files: [
        { name: "DAR - DAR Process.docx", url: "/files/6.0 DAR/Process/DAR - DAR Process.docx" }
      ]
    }
  ]
}
,
{
  name: "Configuration Management (CM)",
  subfolders: [
     {
      name: "Forms and Templates",
      itemCount: 2,
      files: [
        { name: "CM - Access Permissions.xls", url: "/files/7.0 Configuration Management (CM)/Forms and Templates/CM - Access Permissions.xls" },
        { name: "CM - Configuration Status Accounting.xls", url: "/files/7.0 Configuration Management (CM)/Forms and Templates/CM - Configuration Status Accounting.xls" }

      ]
    },
    {
      name: "Guidelines",
      itemCount: 3,
      files: [
        { name: "CM - Configuration Management Guidelines.docx", url: "/files/7.0 CM/Guidelines/CM - Configuration Management Guidelines.docx" },
        { name: "CM - Document Naming Convention.xls", url: "/files/7.0 CM/Guidelines/CM - Document Naming Convention.xls" },
        { name: "CM - VSS Guidelines.docx", url: "/files/7.0 CM/Guidelines/CM - VSS Guidelines.docx" }
     
      ]
    },
    {
      name: "Process",
      itemCount: 1,
      files: [
        { name: "CM - Configuration Management Process.doc", url: "/files/7.0 CM/Process/CM - Configuration Management Process.doc" }
      ]
    }
  ]
}
,
{
  name: "Project Management",
  subfolders: [
    {
      name: "Checklist",
      itemCount: 3,
      files: [
        { name: "PM - PMP Review Checklist.xls", url: "/files/8.0 Project Management/Checklist/PM - PMP Review Checklist.xls" },
        { name: "PM - Project Closure Review Checklist.xls", url: "/files/8.0 Project Management/Checklist/PM - Project Closure Review Checklist.xls" },
        { name: "PM - Project Milestone Review Checklist.xls", url: "/files/8.0 Project Management/Checklist/PM - Project Milestone Review Checklist.xls" }
      ]
    },
    {
      name: "Customer Deliverables",
      itemCount: 11,
      files: [
        { name: "PM - Customer Complaint Register.xls", url: "/files/8.0 Project Management/Customer Deliverables/PM - Customer Complaint Register.xls" },
        { name: "PM - Customer Satisfaction Survey Form.xls", url: "/files/8.0 Project Management/Customer Deliverables/PM - Customer Satisfaction Survey Form.xls" },
        { name: "PM - Go Live Readiness Checklist and Sign Off.docx", url: "/files/8.0 Project Management/Customer Deliverables/PM - Go Live Readiness Checklist and Sign Off.docx" },
        { name: "PM - Monthly Annual Technical Support Status Report.docx", url: "/files/8.0 Project Management/Customer Deliverables/PM - Monthly Annual Technical Support Status Report.docx" },
        { name: "PM - Monthly Project Status Report- Development.docx", url: "/files/8.0 Project Management/Customer Deliverables/PM - Monthly Project Status Report- Development.docx" },
        { name: "PM - Project Closure Report.docx", url: "/files/8.0 Project Management/Customer Deliverables/PM - Project Closure Report.docx" },
        { name: "PM - Project Handover Plan.docx", url: "/files/8.0 Project Management/Customer Deliverables/PM - Project Handover Plan.docx" },
        { name: "PM - Recommendation Letter.docx", url: "/files/8.0 Project Management/Customer Deliverables/PM - Recommendation Letter.docx" },
        { name: "PM - Site Readiness Report.docx", url: "/files/8.0 Project Management/Customer Deliverables/PM - Site Readiness Report.docx" },
        { name: "PM - User Acceptance Document.doc.docx", url: "/files/8.0 Project Management/Customer Deliverables/PM - User Acceptance Document.doc.docx" },
        { name: "PM - Weekly Project Status Report.docx", url: "/files/8.0 Project Management/Customer Deliverables/PM - Weekly Project Status Report.docx" }
      ]
    },
   {
  "name": "Forms and Templates",
  "itemCount": 26,
  "files": [
    { "name": "PM - Lessons Learned and Best Practices.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Lessons Learned and Best Practices.xlsx" },
    { "name": "PM - Competency Matrix With Assessment.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Competency Matrix With Assessment.xlsx" },
    { "name": "PM - Delivery Health Index.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Delivery Health Index.xlsx" },
    { "name": "PM - Estimation Report-FPA.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Estimation Report-FPA.xlsx" },
    { "name": "PM - Estimation Simple Medium Complex.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Estimation Simple Medium Complex.xlsx" },
    { "name": "PM - HOTD Form.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - HOTD Form.docx" },
    { "name": "PM - KT Plan Template.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - KT Plan Template.docx" },
    { "name": "PM - Lessons Learned and Best Practices.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Lessons Learned and Best Practices.docx" },
    { "name": "PM - Minutes Of Meeting.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Minutes Of Meeting.docx" },
    { "name": "PM - MPP-Project.mpt", "url": "/files/8.0 Project Management/Forms and Templates/PM - MPP-Project.mpt" },
    { "name": "PM - Parametric Estimation Template .NET.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Parametric Estimation Template .NET.xlsx" },
    { "name": "PM - Plan and Efforts.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Plan and Efforts.xlsx" },
    { "name": "PM - Project Closure Report.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Project Closure Report.docx" },
    { "name": "PM - Project Definition document.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Project Definition document.docx" },
    { "name": "PM - Project Health Dashboard.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Project Health Dashboard.xlsx" },
    { "name": "PM - Project Initiation Note.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Project Initiation Note.docx" },
    { "name": "PM - Project Management Plan.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Project Management Plan.docx" },
    { "name": "PM - Project Management Plan.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Project Management Plan.xlsx" },
    { "name": "PM - Project Performance Feedback.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Project Performance Feedback.docx" },
    { "name": "PM - Release Audit Checklist.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Release Audit Checklist.docx" },
    { "name": "PM - Review Report.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Review Report.docx" },
    { "name": "PM - Scope Verification and Sales Handover.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Scope Verification and Sales Handover.docx" },
    { "name": "PM - Skill Gap Analysis.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Skill Gap Analysis.xlsx" },
    { "name": "PM - Tailoring and Deviation Form.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Tailoring and Deviation Form.docx" },
    { "name": "PM - Training and Attendance.xlsx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Training and Attendance.xlsx" },
    { "name": "PM - Work Break Down Structure.docx", "url": "/files/8.0 Project Management/Forms and Templates/PM - Work Break Down Structure.docx" }
  ]
},
    {
      name: "Guidelines",
      itemCount: 3,
      files: [
        { name: "PM - Estimation Guidelines.docx", url: "/files/8.0 Project Management/Guidelines/PM - Estimation Guidelines.docx" },
        { name: "PM - Lifecycle Selection Guidelines.doc", url: "/files/8.0 Project Management/Guidelines/PM - Lifecycle Selection Guidelines.doc" },
        { name: "PM - Tailoring and Deviation Guidelines.docx", url: "/files/8.0 Project Management/Guidelines/PM - Tailoring and Deviation Guidelines.docx" }
      ]
    },
    {
      name: "Process",
      itemCount: 1,
      files: [
        { name: "PM - Project Management Process.doc", url: "/files/8.0 Project Management/Process/PM - Project Management Process.doc" }
      ]
    }
  ]
}
,
{
  name: "Peer Review and Review Process",
  subfolders: [
    {
      name: "Templates",
      itemCount: 2,
      files: [
        { name: "Peer Review Report Template _V1.0.xls", url: "/files/9.0 Peer Review and Review Process/Templates/Peer Review Report Template _V1.0.xls" },
        { name: "Review Report Template (REC-RR)  V1.0..xls", url: "/files/9.0 Peer Review and Review Process/Templates/Review Report Template (REC-RR)  V1.0..xls" },
      ]
    },
    {
      name: "Guidelines",
      itemCount: 2,
      files: [
        { name: "Peer Review Guidelines V 1.0.doc", url: "/files/9.0 Peer Review and Review Process/Guidelines/Peer Review Guidelines V 1.0.doc" },
        { name: "Review Guidelines V 1.0.doc", url: "/files/9.0 Peer Review and Review Process/Guidelines/Review Guidelines V 1.0.doc" },
       
      ]
    },
    {
      name: "Process",
      itemCount: 1,
      files: [
        { name: "Review and Peer Review Process V1.0.doc", url: "/files/9.0 Peer Review and Review Process/Process/Review and Peer Review Process V1.0.doc" },
      
      ]
    }
  ]
}
,
{
  name: "Release Process",
  subfolders: [
    {
      name: "Checklist",
      itemCount: 3,
      files: [
        { name: "BD - Build Readiness Checklist.xls", url: "/files/10.0 Release Process/Checklist/BD - Build Readiness Checklist.xls" },
        { name: "BD - Final Delivery Checklist.xls", url: "/files/10.0 Release Process/Checklist/BD - Final Delivery Checklist.xls" },
        { name: "BD - Testing Delivery Checklist.xls", url: "/files/10.0 Release Process/Checklist/BD - Testing Delivery Checklist.xls" }
      ]
    },
    {
      name: "Forms and Templates",
      itemCount: 6,
      files: [
        { name: "BD - Delivery Note.xlsx", url: "/files/10.0 Release Process/Forms and Templates/BD - Delivery Note.xlsx" },
        { name: "BD - Product Integration Plan.docx", url: "/files/10.0 Release Process/Forms and Templates/BD - Product Integration Plan.docx" },
        { name: "BD - Release Feedback Form.xlsx", url: "/files/10.0 Release Process/Forms and Templates/BD - Release Feedback Form.xlsx" },
        { name: "BD - Release Management  Log.xls", url: "/files/10.0 Release Process/Forms and Templates/BD - Release Management  Log.xls" },
        { name: "BD - Release Note.docx", url: "/files/10.0 Release Process/Forms and Templates/BD - Release Note.docx" },
        { name: "UAT - Bug Tracking Sheet.xls", url: "/files/10.0 Release Process/Forms and Templates/UAT - Bug Tracking Sheet.xls" }
      ]
    },
    {
      name: "Guidelines",
      itemCount: 2,
      files: [
        { name: "BD-Software Release Log Guidelines.docx", url: "/files/10.0 Release Process/Guidelines/BD-Software Release Log Guidelines.docx" },
        { name: "BD-Software Release Notes Guidelines.docx", url: "/files/10.0 Release Process/Guidelines/BD-Software Release Notes Guidelines.docx" }
      ]
    },
    {
      name: "Process",
      itemCount: 1,
      files: [
        { name: "BD - Release Management Process.doc", url: "/files/10.0 Release Process/Process/BD - Release Management Process.doc" }
      ]
    }
  ]
}
,
{
  name: "MA updated",
  subfolders: [
    {
      name: "Guidelines",
      itemCount: 7,
      files: [
        { name: "MA - Data Analysis Guidelines.docx", url: "/files/11.0 MA updated/Guidelines/MA - Data Analysis Guidelines.docx" },
        { name: "MA - Goal Question Metric Guidelines.docx", url: "/files/11.0 MA updated/Guidelines/MA - Goal Question Metric Guidelines.docx" },
        { name: "MA - GQM and QPPOs.xls", url: "/files/11.0 MA updated/Guidelines/MA - GQM and QPPOs.xls" },
        { name: "MA - Measuring Performance & Measurement.docx", url: "/files/11.0 MA updated/Guidelines/MA - Measuring Performance & Measurement.docx" },
        { name: "MA - Metrics Handbook.docx", url: "/files/11.0 MA updated/Guidelines/MA - Metrics Handbook.docx" },
        { name: "MA - Prediction Model Guidelines.docx", url: "/files/11.0 MA updated/Guidelines/MA - Prediction Model Guidelines.docx" },
        { name: "MA - SQC Guidelines.docx", url: "/files/11.0 MA updated/Guidelines/MA - SQC Guidelines.docx" }
      ]
    },
    {
      name: "Process",
      itemCount: 2,
      files: [
        { name: "MA - Measurement Process.doc", url: "/files/11.0 MA updated/Process/MA - Measurement Process.doc" }
      ]
    }
  ]
}
,
  {
    name: "PCM",
    subfolders: [
      {
  "name": "Forms and Templates",
  "itemCount": 14,
  "files": [
    { "name": "BCP - Business Impact Analysis.xlsx", "url": "/files/12.0 PCM/Forms and Templates/BCP - Business Impact Analysis.xlsx" },
    { "name": "BCP Exercise Report.docx", "url": "/files/12.0 PCM/Forms and Templates/BCP Exercise Report.docx" },
    { "name": "PCM - Improvement Proposal.docx", "url": "/files/12.0 PCM/Forms and Templates/PCM - Improvement Proposal.docx" },
    { "name": "PCM - Pilot and Deployment Plan.docx", "url": "/files/12.0 PCM/Forms and Templates/PCM - Pilot and Deployment Plan.docx" },
    { "name": "PEG - HOTO Checklist 1.xlsx", "url": "/files/12.0 PCM/Forms and Templates/PEG - HOTO Checklist 1.xlsx" },
    { "name": "PEG - XB Repository.xlsx", "url": "/files/12.0 PCM/Forms and Templates/PEG - XB Repository.xlsx" },
    { "name": "PEG - Metrics.xlsx", "url": "/files/12.0 PCM/Forms and Templates/PEG - Metrics.xlsx" },
    { "name": "PEG - Pilot Plan.xlsx", "url": "/files/12.0 PCM/Forms and Templates/PEG - Pilot Plan.xlsx" },
    { "name": "PEG - Process Deployment Plan.xlsx", "url": "/files/12.0 PCM/Forms and Templates/PEG - Process Deployment Plan.xlsx" },
    { "name": "PEG - Process Improvement Feedback Log.xlsx", "url": "/files/12.0 PCM/Forms and Templates/PEG - Process Improvement Feedback Log.xlsx" },
    { "name": "PEG - Process Improvement Form.docx", "url": "/files/12.0 PCM/Forms and Templates/PEG - Process Improvement Form.docx" },
    { "name": "PEG - SOA and SEPG Plan.xlsx", "url": "/files/12.0 PCM/Forms and Templates/PEG - SOA and SEPG Plan.xlsx" },
    { "name": "PEG - Tailoring and Deviation Log.xlsx", "url": "/files/12.0 PCM/Forms and Templates/PEG - Tailoring and Deviation Log.xlsx" },
    { "name": "PEG - HOTO Form.docx", "url": "/files/12.0 PCM/Forms and Templates/PEG - HOTO Form.docx" },
    { "name": "PMC - Cost Benefit Analysis.xlsx", "url": "/files/12.0 PCM/Forms and Templates/PMC - Cost Benefit Analysis.xlsx" }
  ]
},
      {
  "name": "Guidelines",
  "itemCount": 3,
  "files": [
    { "name": "PCM - Process Management Guidelines.doc", "url": "/files/12.0 PCM/Guidelines/PCM - Process Management Guidelines.doc" },
    { "name": "PEG - Organization Work Environment.doc", "url": "/files/12.0 PCM/Guidelines/PEG - Organization Work Environment.doc" },
    { "name": "PEG - Team Roles and Responsibilities.doc", "url": "/files/12.0 PCM/Guidelines/PEG - Team Roles and Responsibilities.doc" }
  ]
},
    {
  "name": "Process",
  "itemCount": 2,
  "files": [
    { "name": "PCM - Process Management Process.doc", "url": "/files/12.0 PCM/Process/PCM - Process Management Process.doc" },
    { "name": "PEG - Process Enhancement Group.doc", "url": "/files/12.0 PCM/Process/PEG - Process Enhancement Group.doc" }
  ]
},
    ],
  },
];

export default processLibraryData;
