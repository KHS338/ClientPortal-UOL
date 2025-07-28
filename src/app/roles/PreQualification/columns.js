"use client"

export const columns = [
  { accessorKey: "no", header: "No" },
  { accessorKey: "roleTitle", header: "Role Title" },
  { accessorKey: "rolePriority", header: "Role Priority" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "postalCode", header: "Postal Code" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "salaryFrom", header: "Salary From" },
  { accessorKey: "salaryTo", header: "Salary To" },
  { accessorKey: "salaryCurrency", header: "Currency" },
  { accessorKey: "salaryType", header: "Type" },
  { accessorKey: "industry", header: "Industry" },
  { accessorKey: "experienceRequired", header: "Required EXP" },
  { accessorKey: "searchRadius", header: "Search Radius" },
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
                console.log('Edit button clicked, role:', role) // Debug log
                if (window.handleEditRole) {
                  window.handleEditRole(role)
                } else {
                  console.error('handleEditRole not available on window')
                }
              }
            }}
            disabled={isDisabled}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              isDisabled 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            title={isDisabled ? "Cannot edit while processing or finished" : "Edit Role"}
          >
            Edit
          </button>
          <button
            onClick={() => {
              window.location.href = `/roles/PreQualification/${role.id}`;
            }}
            className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700"
            title="View Details"
          >
            Details
          </button>
        </div>
      );
    },
  },
]
