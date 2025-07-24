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
  { accessorKey: "acmCategory", header: "ACM Category" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              console.log('Edit button clicked, role:', role) // Debug log
              if (window.handleEditRole) {
                window.handleEditRole(role)
              } else {
                console.error('handleEditRole not available on window')
              }
            }}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
            title="Edit Role"
          >
            Edit
          </button>
        </div>
      );
    },
  },
]
