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
  { accessorKey: "isRecruitmentAgency", header: "Recruitment Agency" },
  { accessorKey: "submittedAt", header: "Submitted" },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "queued";
      const statusColors = {
        queued: "bg-gray-100 text-gray-800",
        processing: "bg-yellow-100 text-yellow-800",
        finished: "bg-green-100 text-green-800"
      };
      return (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[status] || statusColors.queued}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const role = row.original;
      const status = role.status || "queued";
      const isDisabled = status === "processing" || status === "finished";
      
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!isDisabled) {
                if (window.handleEditRole) {
                  window.handleEditRole(role)
                }
              }
            }}
            disabled={isDisabled}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              isDisabled 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            title={isDisabled ? "Cannot edit while processing or finished" : "Edit Entry"}
          >
            Edit
          </button>
          <button
            onClick={() => {
              window.location.href = `/roles/leadsGeneration/jobs/${role.id}`;
            }}
            className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700"
            title="View Job Details"
          >
            Details
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
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "queued";
      const statusColors = {
        queued: "bg-gray-100 text-gray-800",
        processing: "bg-yellow-100 text-yellow-800",
        finished: "bg-green-100 text-green-800"
      };
      return (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[status] || statusColors.queued}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const role = row.original;
      const status = role.status || "queued";
      const isDisabled = status === "processing" || status === "finished";
      
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!isDisabled) {
                if (window.handleEditRole) {
                  window.handleEditRole(role)
                }
              }
            }}
            disabled={isDisabled}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              isDisabled 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            title={isDisabled ? "Cannot edit while processing or finished" : "Edit Entry"}
          >
            Edit
          </button>
          <button
            onClick={() => {
              window.location.href = `/roles/leadsGeneration/industry/${role.id}`;
            }}
            className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700"
            title="View Industry Details"
          >
            Details
          </button>
          
        </div>
      );
    },
  },
]

// Default export for backwards compatibility
export const columns = jobsColumns
