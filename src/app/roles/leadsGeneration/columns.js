"use client"

// Columns for Jobs submissions
export const jobsColumns = [
  { accessorKey: "no", header: "No" },
  { accessorKey: "jobTitle", header: "Job Title" },
  { accessorKey: "industryType", header: "Industry" },
  { accessorKey: "companySize", header: "Company Size" },
  { accessorKey: "workType", header: "Work Type" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "experience", header: "Experience" },
  { 
    accessorKey: "skills", 
    header: "Skills",
    cell: ({ row }) => {
      const skills = row.original.skills;
      if (Array.isArray(skills)) {
        return skills.join(", ");
      }
      return skills || "";
    }
  },
  { accessorKey: "hiringUrgency", header: "Urgency" },
  { accessorKey: "submittedAt", header: "Submitted" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (window.handleEditRole) {
                window.handleEditRole(role)
              }
            }}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
            title="Edit Entry"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.handleDeleteRole) {
                window.handleDeleteRole(role)
              }
            }}
            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700"
            title="Delete Entry"
          >
            Delete
          </button>
        </div>
      );
    },
  },
]

// Columns for Industry submissions
export const industryColumns = [
  { accessorKey: "no", header: "No" },
  { accessorKey: "industryType", header: "Industry Type" },
  { accessorKey: "companySize", header: "Company Size" },
  { accessorKey: "cityCountry", header: "Location" },
  { accessorKey: "leadPriority", header: "Priority" },
  { accessorKey: "submittedAt", header: "Submitted" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (window.handleEditRole) {
                window.handleEditRole(role)
              }
            }}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
            title="Edit Entry"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.handleDeleteRole) {
                window.handleDeleteRole(role)
              }
            }}
            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700"
            title="Delete Entry"
          >
            Delete
          </button>
        </div>
      );
    },
  },
]

// Default export for backwards compatibility
export const columns = jobsColumns
