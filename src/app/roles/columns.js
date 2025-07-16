"use client"

export const columns = [
  { accessorKey: "no",             header: "No" },
  { accessorKey: "role",           header: "Role" },
  { accessorKey: "focusPoint",     header: "Focus Point" },
  { accessorKey: "stages",         header: "Stages" },
  { accessorKey: "status",         header: "Status" },
  { accessorKey: "resourcers",     header: "Resourcers" },
  { accessorKey: "months",         header: "Months" },
  { accessorKey: "salary",         header: "Salary" },
  { accessorKey: "miles",          header: "Miles" },
  { accessorKey: "industry",       header: "Industry" },
  { accessorKey: "cvs",            header: "CVs" },
  { accessorKey: "lis",            header: "LIs" },
  { accessorKey: "zi",             header: "ZI" },
  { accessorKey: "tCandidates",    header: "T Candidates" },
  { accessorKey: "rejectedCvs",    header: "Rejected CVs" },
  { accessorKey: "rejectedLis",    header: "Rejected LIs" },
  { accessorKey: "rCandidates",    header: "R Candidates" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => window.handleEditRole?.(role)}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
            title="Edit Role"
          >
            Edit
          </button>
          <button
            onClick={() => window.handleDeleteRole?.(role)}
            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700"
            title="Delete Role"
          >
            Delete
          </button>
        </div>
      );
    },
  },
]
