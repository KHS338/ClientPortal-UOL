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
import { motion, AnimatePresence } from "framer-motion"

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
              {items.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <React.Fragment>
                    <SidebarMenuItem>
                      {/* Handle submenu items */}
                      {item.submenu ? (
                        <SidebarMenuButton
                          onClick={() =>
                            setOpenMenu(openMenu === item.title ? null : item.title)
                          }
                          className="group relative w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#19AF1A] hover:to-[#158A15] hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#19AF1A]/50 focus:ring-offset-2 text-gray-700 hover:shadow-[0_4px_12px_rgba(25,175,26,0.3)]"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
                              <span className="transition-all duration-300">{item.title}</span>
                            </div>
                            <motion.span 
                              className="min-w-[16px] text-right transition-transform duration-300"
                              animate={{ rotate: openMenu === item.title ? 90 : 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              ▶
                            </motion.span>
                          </div>
                        </SidebarMenuButton>
                      ) : (
                        // Regular item (no submenu)
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#19AF1A] hover:to-[#158A15] hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#19AF1A]/50 focus:ring-offset-2 text-gray-700 hover:shadow-[0_4px_12px_rgba(25,175,26,0.3)]"
                          >
                            <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
                            <span className="transition-all duration-300 truncate">{item.title}</span>
                            <motion.div
                              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
                              initial={false}
                              animate={{ 
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" 
                              }}
                              transition={{ duration: 0.3 }}
                            />
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                    
                    {/* Render submenu items with animation */}
                    <AnimatePresence>
                      {item.submenu && openMenu === item.title && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          {item.submenu.map((sub, subIndex) => (
                            <motion.div
                              key={`${item.title}-${sub.title}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                            >
                              <SidebarMenuItem className="ml-4 mt-1">
                                <SidebarMenuButton asChild>
                                  <Link
                                    href={sub.url}
                                    className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#19AF1A] hover:to-[#158A15] hover:text-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#19AF1A]/50 focus:ring-offset-2 text-gray-600 hover:shadow-[0_2px_8px_rgba(25,175,26,0.25)]"
                                  >
                                    <motion.span 
                                      className="w-6 text-center text-gray-400 group-hover:text-white transition-colors duration-300"
                                      whileHover={{ scale: 1.2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      •
                                    </motion.span>
                                    <span className="transition-all duration-300 truncate">{sub.title}</span>
                                    <motion.div
                                      className="absolute left-0 top-1/2 w-1 h-0 bg-white rounded-r-full group-hover:h-4 transition-all duration-300"
                                      style={{ transform: "translateY(-50%)" }}
                                    />
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}