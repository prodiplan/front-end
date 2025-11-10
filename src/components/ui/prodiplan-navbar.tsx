"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  HomeIcon, 
  AcademicCapIcon, 
  DocumentTextIcon, 
  UserIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface ProdiPlanNavBarProps {
  className?: string
  user?: any
  onLogoutClick?: () => void
}

export function ProdiPlanNavBar({ className, user, onLogoutClick }: ProdiPlanNavBarProps) {
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isManualScroll, setIsManualScroll] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Define navigation items based on current page and user authentication
  const getNavigationItems = (): NavItem[] => {
    // If on home page, show landing page navigation
    if (pathname === "/") {
      return [
        { name: "Fitur", url: "#features", icon: AcademicCapIcon },
        { name: "Cara Kerja", url: "#how-it-works", icon: DocumentTextIcon },
        { name: "Testimoni", url: "#testimonials", icon: UserIcon },
      ];
    }
    
    // For authenticated users on other pages
    if (user) {
      return [
        { name: "Essay Test", url: "/essay-grader", icon: DocumentTextIcon },
        { name: "Profile", url: "/profile", icon: UserIcon },
        { name: "Results", url: "/profile/result", icon: ChartBarIcon },
      ];
    }
    
    // For non-authenticated users
    return [
      { name: "Home", url: "/", icon: HomeIcon },
      { name: "Features", url: "/#features", icon: AcademicCapIcon },
      { name: "How It Works", url: "/#how-it-works", icon: DocumentTextIcon },
    ];
  };

  const items = getNavigationItems()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Set active tab based on current pathname and scroll position
  useEffect(() => {
    if (pathname !== "/") {
      // For non-home pages, set active based on pathname
      const currentItem = items.find(item => {
        if (item.url.startsWith("#")) return false;
        return pathname.startsWith(item.url);
      });
      if (currentItem) {
        setActiveTab(currentItem.name);
      }
      return;
    }

    // For home page, handle scroll-based active tab
    const handleScroll = () => {
      // Don't update if user is manually scrolling from a click
      if (isManualScroll) return;

      const scrollPosition = window.scrollY + 150; // Increased offset
      
      // Check which section is in view - check in reverse order for accuracy
      const testimonialElement = document.querySelector("#testimonials") as HTMLElement | null;
      const howItWorksElement = document.querySelector("#how-it-works") as HTMLElement | null;
      const featureElement = document.querySelector("#features") as HTMLElement | null;
      
      if (testimonialElement && scrollPosition >= testimonialElement.offsetTop) {
        setActiveTab("Testimoni");
      } else if (howItWorksElement && scrollPosition >= howItWorksElement.offsetTop) {
        setActiveTab("Cara Kerja");
      } else if (featureElement && scrollPosition >= featureElement.offsetTop) {
        setActiveTab("Fitur");
      } else {
        setActiveTab("Fitur"); // Default to first item
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, items, isManualScroll])

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.name)
    setIsManualScroll(true)
    
    // Smooth scroll to section for hash links on home page
    if (item.url.startsWith("#") && pathname === "/") {
      const element = document.querySelector(item.url);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Reset manual scroll flag after smooth scroll completes
        setTimeout(() => {
          setIsManualScroll(false);
        }, 1000);
      }
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg">
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-500 bg-opacity-20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <svg
                  className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
              </div>
            </div>
            <span className="text-gray-900 text-lg sm:text-xl font-bold">ProdiPlan</span>
          </Link>

          {/* Tubelight Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-2 sm:gap-3 backdrop-blur-lg py-1 px-1 rounded-full">
              {items.map((item, index) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.url}
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        "relative cursor-pointer text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2 rounded-full transition-colors",
                        "text-gray-600 hover:text-gray-900",
                      )}
                    >
                      <span className="hidden lg:inline">{item.name}</span>
                      <span className="lg:hidden">
                        <Icon size={18} strokeWidth={2.5} />
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="lamp"
                          className="absolute inset-0 w-full bg-blue-200 rounded-full -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {user ? (
              <>
                <span className="text-gray-900 text-xs sm:text-sm font-medium hidden sm:block max-w-[100px] truncate">
                  {user.full_name}
                </span>
                <button
                  onClick={onLogoutClick}
                  className="text-gray-700 text-xs sm:text-sm font-medium hover:text-gray-900 transition-colors px-2 sm:px-3 py-1.5 rounded-md hover:bg-gray-200 hidden sm:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="bg-blue-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-all hover:shadow-lg"
              >
                Login
              </Link>
            )}
            
            {/* Mobile Menu Button - Moved next to Login */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-900 hover:text-gray-700 p-1.5 ml-1"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, height: isMobileMenuOpen ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-14 sm:top-16 left-0 right-0 z-40 lg:hidden overflow-hidden backdrop-blur-lg max-h-[calc(100vh-56px)] sm:max-h-[calc(100vh-64px)] overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-4 space-y-0.5 sm:space-y-2">
          {items.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: isMobileMenuOpen ? index * 0.05 : 0 }}
              >
                <Link
                  href={item.url}
                  onClick={() => {
                    handleNavClick(item)
                    setIsMobileMenuOpen(false)
                  }}
                  className={cn(
                    "block px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-base",
                    isActive
                      ? "bg-blue-100 text-blue-900 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="line-clamp-1">{item.name}</span>
                </Link>
              </motion.div>
            )
          })}
          
          {/* Mobile User Menu */}
          <div className="pt-2 sm:pt-4 border-t border-gray-200 space-y-0.5 sm:space-y-2 mt-2">
            {user ? (
              <>
                <div className="px-2 sm:px-4 py-1.5 sm:py-2">
                  <p className="text-gray-900 font-medium text-xs sm:text-sm truncate">{user.full_name}</p>
                </div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={isMobileMenuOpen ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => {
                    onLogoutClick?.()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-2 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isMobileMenuOpen ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}