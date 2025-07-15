"use client"

export default function AddRoleForm() {
  // …replace with your real form fields later
  return (
    <form className="space-y-4 space-x-4 ml-3">
      <div>
        <label className="block text-sm font-medium mb-1">Role title</label>
        <input
          type="text"
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="e.g., Frontend Dev"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Focus point</label>
        <input
          type="text"
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="React UI"
        />
      </div>

      {/* add more fields here */}

      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Save role
      </button>
    </form>
  )
}
