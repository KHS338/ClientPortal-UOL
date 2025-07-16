"use client"

import {
  UserCircleIcon,
  CircleDollarSign,
  LaptopMinimalCheck,
  Home,
  Users,
  FilePlus,
  Settings,
} from "lucide-react"
import { useState } from "react"

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

// Sidebar menu items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Manage Roles",
    icon: LaptopMinimalCheck,
    submenu: [
      {
        title: "CV Sourcing",
        url: "/roles/cvSourcing",
      },
      {
        title: "PreQualification",
        url: "/roles/PreQualification",
      },
      {
        title: "360/Direct",
        url: "/roles/360Direct",
      },
    ],
  },
  {
    title: "Invoices",
    url: "/invoice",
    icon: CircleDollarSign,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserCircleIcon,
  },
]

export function AppSidebar() {
  const [openMenu, setOpenMenu] = useState(null)

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Client Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* Handle submenu items */}
                  {item.submenu ? (
                    <>
                      <SidebarMenuButton
                        onClick={() =>
                          setOpenMenu(openMenu === item.title ? null : item.title)
                        }
                        className="group flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#158A15] hover:to-[#0F6B0F] hover:text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#19AF1A] focus:ring-offset-2"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                        <span>{openMenu === item.title ? "" : ""}</span>
                      </SidebarMenuButton>

                      {openMenu === item.title &&
                        item.submenu.map((sub) => (
                          <SidebarMenuItem key={sub.title} className="ml-6">
                            <SidebarMenuButton asChild>
                              <a
                                href={sub.url}
                                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#158A15] hover:to-[#0F6B0F] hover:text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#19AF1A] focus:ring-offset-2"
                              >
                                • {sub.title}
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                    </>
                  ) : (
                    // Regular item (no submenu)
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#158A15] hover:to-[#0F6B0F] hover:text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#19AF1A] focus:ring-offset-2"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}