"use client"

import React from "react"
import Link from "next/link"
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
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            Client Portal
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2 py-2">
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem>
                    {/* Handle submenu items */}
                    {item.submenu ? (
                      <SidebarMenuButton
                        onClick={() =>
                          setOpenMenu(openMenu === item.title ? null : item.title)
                        }
                        className="group relative w-full rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gradient-to-r hover:from-[#19AF1A] hover:to-[#158A15] hover:text-white text-gray-700"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.title}</span>
                          </div>
                          <span className={`min-w-[16px] text-right transition-transform `}>
                            =
                          </span>
                        </div>
                      </SidebarMenuButton>
                    ) : (
                      // Regular item (no submenu)
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gradient-to-r hover:from-[#19AF1A] hover:to-[#158A15] hover:text-white text-gray-700"
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                  
                  {/* Render submenu items */}
                  {item.submenu && openMenu === item.title && (
                    <div className="overflow-hidden">
                      {item.submenu.map((sub) => (
                        <SidebarMenuItem key={`${item.title}-${sub.title}`} className="ml-4 mt-1">
                          <SidebarMenuButton asChild>
                            <Link
                              href={sub.url}
                              className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gradient-to-r hover:from-[#19AF1A] hover:to-[#158A15] hover:text-white text-gray-600"
                            >
                              <span className="w-6 text-center text-gray-400 group-hover:text-white">
                                •
                              </span>
                              <span className="truncate">{sub.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}