"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  UserIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface ProdiPlanNavBarProps {
  className?: string;
  user?: any;
  onLogoutClick?: () => void;
}

export function ProdiPlanNavBar({
  className,
  user,
  onLogoutClick,
}: ProdiPlanNavBarProps) {
  const [activeTab, setActiveTab] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const resetTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

    // For authenticated users on other pages (dashboard, etc) - same as landing page but without Testimoni
    if (user) {
      return [
        { name: "Fitur", url: "#features", icon: AcademicCapIcon },
        { name: "Cara Kerja", url: "#how-it-works", icon: DocumentTextIcon },
      ];
    }

    // For non-authenticated users
    return [
      { name: "Home", url: "/", icon: HomeIcon },
      { name: "Features", url: "/#features", icon: AcademicCapIcon },
      { name: "How It Works", url: "/#how-it-works", icon: DocumentTextIcon },
    ];
  };

  const items = getNavigationItems();

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    let scrollTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };

    const handleScrollMobile = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Close mobile menu when scrolling on mobile
        if (isMobileMenuOpen && window.innerWidth < 768) {
          setIsMobileMenuOpen(false);
        }
      }, 100);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScrollMobile, { passive: true });
    return () => {
      clearTimeout(resizeTimeout);
      clearTimeout(scrollTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScrollMobile);
    };
  }, [isMobileMenuOpen]);

  // Set active tab based on current pathname and scroll position
  useEffect(() => {
    // Debounced scroll handler to prevent excessive updates
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear existing timeout to debounce
      clearTimeout(scrollTimeout);

      // Don't update if user is manually scrolling from a click
      if (isManualScroll) return;

      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY + 200; // Offset for better accuracy

        // Check which section is in view - check in reverse order for accuracy
        const testimonialElement = document.querySelector(
          "#testimonials"
        ) as HTMLElement | null;
        const howItWorksElement = document.querySelector(
          "#how-it-works"
        ) as HTMLElement | null;
        const featureElement = document.querySelector(
          "#features"
        ) as HTMLElement | null;

        // Check sections in reverse order with better threshold
        if (
          testimonialElement &&
          scrollPosition >= testimonialElement.offsetTop + 100
        ) {
          setActiveTab("Testimoni");
        } else if (
          howItWorksElement &&
          scrollPosition >= howItWorksElement.offsetTop + 100
        ) {
          setActiveTab("Cara Kerja");
        } else if (
          featureElement &&
          scrollPosition >= featureElement.offsetTop
        ) {
          setActiveTab("Fitur");
        } else {
          setActiveTab("Fitur"); // Default to first item
        }
      }, 50); // Small debounce to batch scroll events
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Call once on mount
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isManualScroll, pathname]);

  const handleNavClick = (item: NavItem) => {
    // Clear any existing timeout to prevent race conditions
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    setActiveTab(item.name);
    setIsManualScroll(true);

    // Smooth scroll to section for hash links
    if (item.url.startsWith("#")) {
      const element = document.querySelector(item.url);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Reset manual scroll flag after smooth scroll completes
        // Use shorter timeout for more responsive behavior
        resetTimeoutRef.current = setTimeout(() => {
          setIsManualScroll(false);
          resetTimeoutRef.current = null;
        }, 700); // Reduced timeout - smooth scroll typically takes 500-800ms
      }
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 pb-2 flex justify-center">
      <div className="relative max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center space-x-2 group relative z-10 px-3 sm:px-4 py-1.5 rounded-full transition-colors"
          >
            <div className="relative">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
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
            <span className="text-gray-900 text-lg sm:text-xl font-bold">
              ProdiPlan
            </span>
            <motion.div
              className="absolute inset-0 -left-1 -right-1 bg-white rounded-full -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
          </Link>

          {/* Tubelight Navigation */}
          <div className="hidden lg:block">
            <div
              className="flex items-center gap-2 sm:gap-3 py-3 px-2 rounded-full bg-white shadow-lg border border-gray-200 backdrop-blur-sm"
              style={{ paddingTop: "0.875rem", paddingBottom: "0.875rem" }}
            >
              {items.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    {/* Tubelight glow effect - positioned in wrapper */}
                    {isActive && (
                      <>
                        {/* Top glow */}
                        <motion.div
                          className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full blur-2xl pointer-events-none"
                          style={{ pointerEvents: "none" }}
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Side glow left */}
                        <motion.div
                          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-14 bg-gradient-to-r from-blue-400 to-transparent rounded-full blur-xl pointer-events-none"
                          style={{ pointerEvents: "none" }}
                          animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Side glow right */}
                        <motion.div
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-14 bg-gradient-to-l from-blue-400 to-transparent rounded-full blur-xl pointer-events-none"
                          style={{ pointerEvents: "none" }}
                          animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.2,
                          }}
                        />

                        {/* Bottom glow */}
                        <motion.div
                          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full blur-2xl pointer-events-none"
                          style={{ pointerEvents: "none" }}
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.3,
                          }}
                        />
                      </>
                    )}

                    <Link
                      href={item.url}
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        "relative z-10 cursor-pointer text-xs sm:text-sm font-semibold px-5 sm:px-8 py-3 rounded-full transition-all duration-300 ease-out",
                        isActive
                          ? "text-white"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      <span className="hidden lg:inline">{item.name}</span>
                      <span className="lg:hidden">
                        <Icon size={18} strokeWidth={2.5} />
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId={`tubelight-${item.name}`}
                          className="absolute inset-0 -mx-1 -my-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="text-gray-900 text-xs sm:text-sm font-medium hidden sm:block max-w-[100px] truncate hover:text-primary-600 transition-colors cursor-pointer"
                >
                  {user.full_name}
                </button>

                {/* Desktop Profile Dropdown */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="relative z-10 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-colors text-gray-600 hover:text-gray-900 bg-white"
                  >
                    <UserCircleIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={onLogoutClick}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Mobile Profile Button */}
                <div className="relative sm:hidden">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors text-gray-600 hover:text-gray-900 bg-white"
                  >
                    <UserCircleIcon className="w-6 h-6" />
                  </button>

                  {/* Mobile Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.full_name}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={onLogoutClick}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm border-t border-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/auth"
                  className="relative z-10 text-blue-600 hover:text-blue-700text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all bg-white border-2 border-blue-600 hover:bg-blue-700 hover:text-white hover:border-white"
                >
                  Login
                </Link>
              </motion.div>
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
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-14 sm:top-16 left-0 right-0 z-40 lg:hidden overflow-x-hidden overflow-y-auto bg-white border-t border-gray-200"
        style={{
          maxHeight: isMobileMenuOpen ? "calc(100vh - 3.5rem)" : "0",
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 py-2 sm:py-4 space-y-0.5 sm:space-y-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isMobileMenuOpen
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -20 }
                }
                transition={{
                  duration: 0.2,
                  delay: isMobileMenuOpen ? index * 0.05 : 0,
                }}
              >
                <Link
                  href={item.url}
                  onClick={() => {
                    handleNavClick(item);
                    setIsMobileMenuOpen(false);
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
            );
          })}

          {/* Mobile User Menu */}
          <div className="pt-2 sm:pt-4 border-t border-gray-200 space-y-0.5 sm:space-y-2 mt-2">
            {user ? (
              <>
                <div className="px-2 sm:px-4 py-1.5 sm:py-2">
                  <p className="text-gray-900 font-medium text-xs sm:text-sm truncate">
                    {user.full_name}
                  </p>
                </div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={isMobileMenuOpen ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => {
                    onLogoutClick?.();
                    setIsMobileMenuOpen(false);
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
  );
}
