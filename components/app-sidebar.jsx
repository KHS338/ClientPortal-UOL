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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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