"use client"

import React from "react"
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
  const [mounted, setMounted] = useState(false)

  // Ensure hydration consistency
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // If not mounted yet, don't render dynamic content
  if (!mounted) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Client Portal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.submenu ? (
                      <SidebarMenuButton className="group flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#158A15] hover:to-[#0F6B0F] hover:text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#19AF1A] focus:ring-offset-2">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                        <span className="min-w-[16px] text-right">▶</span>
                      </SidebarMenuButton>
                    ) : (
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

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Client Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem>
                    {/* Handle submenu items */}
                    {item.submenu ? (
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
                        <span className="min-w-[16px] text-right">
                          {openMenu === item.title ? "▼" : "▶"}
                        </span>
                      </SidebarMenuButton>
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
                  
                  {/* Render submenu items directly below parent */}
                  {item.submenu && openMenu === item.title && 
                    item.submenu.map((sub) => (
                      <SidebarMenuItem key={`${item.title}-${sub.title}`} className="ml-4">
                        <SidebarMenuButton asChild>
                          <a
                            href={sub.url}
                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#158A15] hover:to-[#0F6B0F] hover:text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#19AF1A] focus:ring-offset-2"
                          >
                            <span className="w-6 text-center text-gray-400">•</span>
                            <span>{sub.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  }
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}