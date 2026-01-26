export const CREATE_USER_FORM_SECTIONS = [
  {
    title: "Basic Information",
    description: "Tell us about user",
    fields: [
      {
        label: "First Name",
        placeholder: "Enter name",
        type: "text",
        required: true,
      },
      {
        label: "Middle Name",
        placeholder: "Enter name",
        type: "text",
        required: false,
      },
      {
        label: "Last Name",
        placeholder: "Enter name",
        type: "text",
        required: true,
      },
      {
        label: "Email Address",
        placeholder: "Enter email address",
        type: "email",
        required: true,
      },
      {
        label: "Phone Number",
        placeholder: "+234 800 000 0000",
        type: "text",
        required: true,
      },
      {
        label: "Department",
        placeholder: "Select Option",
        type: "select",
        required: true,
        options: [
          { label: "Technology Team", value: "Technology Team" },
          { label: "Human Resources", value: "Human Resources" },
          { label: "Finance", value: "Finance" },
        ],
      },
    ],
  },
  {
    title: "Assign Role",
    description: "Assign a role to this user",
    fields: [
      {
        label: "Assign Role",
        placeholder: "Select Option",
        type: "select",
        required: true,
        options: [
          { label: "Approver", value: "Approver" },
          { label: "User", value: "User" },
          { label: "Viewer", value: "Viewer" },
          { label: "Auditor", value: "Auditor" },
        ],
      },
      {
        label: "Expiry Status",
        placeholder: "Select Option",
        type: "select",
        required: true,
        options: [
          { label: "Permanent", value: "Permanent" },
          { label: "Temporary", value: "Temporary" },
        ],
      },
      {
        label: "Expires",
        placeholder: "DD/MM/YYYY",
        type: "date",
        required: true,
      },
    ],
  },
];
