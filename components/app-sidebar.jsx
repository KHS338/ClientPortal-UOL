"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  UserCircleIcon,
  CircleDollarSign,
  LaptopMinimalCheck,
  Home,
  Users,
  FilePlus,
  Settings,
  LogOut,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

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
      {
        title: "Leads Generation",
        url: "/roles/leadsGeneration",
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
  {
    title: "Subscription Info",
    url: "/subscription-info",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [userSubscription, setUserSubscription] = useState(null)
  const router = useRouter()
  const { logout } = useAuth()

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      // Clear subscription data as well
      localStorage.removeItem('userSubscription')
      localStorage.removeItem('userData')
      localStorage.removeItem('userEmail')
      
      // Redirect to login page
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect to login even if logout fails
      router.push('/login')
    }
  }

  // Load user subscription from localStorage
  useEffect(() => {
    const loadSubscription = () => {
      const savedSubscription = localStorage.getItem('userSubscription');
      if (savedSubscription) {
        const data = JSON.parse(savedSubscription);
        console.log('Sidebar - Loaded subscription data:', data);
        setUserSubscription(data.service);
      } else {
        console.log('Sidebar - No subscription data found');
        setUserSubscription(null);
      }
    };

    // Load initial subscription data
    loadSubscription();

    // Listen for storage changes (when localStorage is updated from other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === 'userSubscription') {
        console.log('Sidebar - Storage change detected for userSubscription');
        loadSubscription();
      }
    };

    // Listen for custom event (when localStorage is updated from same tab)
    const handleSubscriptionUpdate = () => {
      console.log('Sidebar - Custom subscription update event detected');
      loadSubscription();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    };
  }, []);

  // Ensure hydration consistency
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Function to check if a role is accessible based on subscription
  const isRoleAccessible = (roleTitle) => {
    if (!userSubscription) {
      console.log(`Sidebar - No subscription, ${roleTitle} not accessible`);
      return false;
    }
    
    // Map role titles to subscription services
    const roleToService = {
      "CV Sourcing": "CV Sourcing",
      "PreQualification": "Prequalification", 
      "360/Direct": "360/Direct",
      "Leads Generation": "Lead Generation"
    };
    
    // If user has Free Trial, only CV Sourcing is accessible
    if (userSubscription === "Free Trial") {
      const isAccessible = roleTitle === "CV Sourcing";
      console.log(`Sidebar - Trial user, Role: ${roleTitle}, Accessible: ${isAccessible}`);
      return isAccessible;
    }
    
    // For regular subscriptions, check exact match
    const isAccessible = roleToService[roleTitle] === userSubscription;
    console.log(`Sidebar - Role: ${roleTitle}, User subscription: ${userSubscription}, Accessible: ${isAccessible}`);
    return isAccessible;
  };

  // If not mounted yet, render minimal content
  if (!mounted) {
    return (
      <Sidebar className="border-r border-gray-200 bg-white">
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              Client Portal
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2 py-2">
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/dashboard"
                      className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gradient-to-r hover:from-[#1a84de] hover:to-[#1a84de] hover:text-white text-gray-700"
                    >
                      <Home className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* Loading placeholder for other items */}
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <div className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400">
                      <LaptopMinimalCheck className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">Loading...</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                        className="group relative w-full rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gradient-to-r hover:from-[#1a84de] hover:to-[#1a84de] hover:text-white text-gray-700"
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
                          className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gradient-to-r hover:from-[#1a84de] hover:to-[#1a84de] hover:text-white text-gray-700"
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
                      {item.submenu.map((sub) => {
                        const isAccessible = isRoleAccessible(sub.title);
                        return (
                          <SidebarMenuItem key={`${item.title}-${sub.title}`} className="ml-4 mt-1">
                            <SidebarMenuButton asChild={isAccessible}>
                              {isAccessible ? (
                                <Link
                                  href={sub.url}
                                  className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gradient-to-r hover:from-[#1a84de] hover:to-[#1a84de] hover:text-white text-gray-600"
                                >
                                  <span className="w-6 text-center text-gray-400 group-hover:text-white">
                                    •
                                  </span>
                                  <span className="truncate">{sub.title}</span>
                                </Link>
                              ) : (
                                <div className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                                  <span className="w-6 text-center text-gray-400">
                                    •
                                  </span>
                                  <span className="truncate">{sub.title}</span>
                                </div>
                              )}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Logout Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white text-gray-700 w-full text-left"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}