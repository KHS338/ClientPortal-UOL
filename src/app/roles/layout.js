// app/dashboard/layout.js
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-w-0 w-full">
        <div className="sm:hidden p-2">
          <SidebarTrigger />
        </div>
        <div className="hidden sm:block p-2">
          <SidebarTrigger />
        </div>
        <div className="w-full overflow-x-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
