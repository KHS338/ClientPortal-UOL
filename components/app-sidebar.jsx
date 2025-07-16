import { UserCircleIcon,CircleDollarSign,LaptopMinimalCheck,Calendar, Home, Inbox, Search, Settings, DollarSignIcon, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Manage Roles",
    url: "/roles",
    icon: LaptopMinimalCheck,
  },
  {
    title: "Invoices",
    url: "/invoice",
    icon: CircleDollarSign,
  },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
  {
    title: "Profile",
    url: "/profile",
    icon: UserCircleIcon,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Client Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.url}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 lg:text-xl lg-mx-4"
                    >
                      <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="transition-all duration-200">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}