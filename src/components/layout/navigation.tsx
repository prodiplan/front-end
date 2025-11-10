"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Bars3Icon, XMarkIcon, HomeIcon, ChartBarIcon, DocumentTextIcon, UserIcon, AcademicCapIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface NavigationProps {
  onLogoutClick?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode; // Heroicon component
}

export function Navigation({ onLogoutClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [selectorPos, setSelectorPos] = useState({ left: 0, width: 0, height: 0 });
  const navItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const navContainerRef = useRef<HTMLUListElement>(null);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Define navigation items based on current page
  const getNavigationItems = (): NavItem[] => {
    // If on home page, show landing page navigation
    if (pathname === "/") {
      return [
        { name: "Fitur", href: "#features", icon: <AcademicCapIcon className="w-4 h-4" /> },
        { name: "Cara Kerja", href: "#how-it-works", icon: <DocumentTextIcon className="w-4 h-4" /> },
        { name: "Testimoni", href: "#testimonials", icon: <UserIcon className="w-4 h-4" /> },
      ];
    }
    
    // For authenticated users on other pages
    if (user) {
      return [
        { name: "Essay Test", href: "/essay-grader", icon: <DocumentTextIcon className="w-4 h-4" /> },
        { name: "Profile", href: "/profile", icon: <UserIcon className="w-4 h-4" /> },
        { name: "Results", href: "/profile/result", icon: <ChartBarIcon className="w-4 h-4" /> },
      ];
    }
    
    // For non-authenticated users
    return [
      { name: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
      { name: "Features", href: "/#features", icon: <AcademicCapIcon className="w-4 h-4" /> },
      { name: "How It Works", href: "/#how-it-works", icon: <DocumentTextIcon className="w-4 h-4" /> },
    ];
  };

  const navigation = getNavigationItems();

  // Set active nav index based on current pathname
  useEffect(() => {
    const currentIndex = navigation.findIndex(item => {
      if (item.href.startsWith("#")) {
        // For hash links, only consider active if on home page
        return pathname === "/" && item.href === "#hero";
      }
      // For regular links, check if pathname starts with href
      return pathname.startsWith(item.href);
    });
    
    if (currentIndex !== -1) {
      setActiveNavIndex(currentIndex);
    } else {
      setActiveNavIndex(0);
    }
  }, [pathname, navigation]);

  // Update selector position and size based on active nav item
  useEffect(() => {
    const updateSelector = () => {
      if (navItemsRef.current[activeNavIndex] && navContainerRef.current) {
        const activeElement = navItemsRef.current[activeNavIndex];
        if (activeElement) {
          const left = activeElement.offsetLeft;
          const width = activeElement.offsetWidth;
          const height = activeElement.offsetHeight;
          setSelectorPos({ left, width, height });
        }
      }
    };

    updateSelector();
    const resizeObserver = new ResizeObserver(updateSelector);
    if (navContainerRef.current) {
      resizeObserver.observe(navContainerRef.current);
    }

    window.addEventListener("resize", updateSelector);
    return () => {
      window.removeEventListener("resize", updateSelector);
      resizeObserver.disconnect();
    };
  }, [activeNavIndex]);

  const handleNavItemClick = (index: number, href: string) => {
    setActiveNavIndex(index);
    setIsMenuOpen(false);
    
    // Smooth scroll to section for hash links on home page
    if (href.startsWith("#") && pathname === "/") {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      logout();
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg overflow-hidden">
      {/* Liquid Animation Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-2 -left-2 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute -bottom-1 left-1/3 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-white/10 rounded-full blur-xl animate-pulse animation-delay-3000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center space-x-1 sm:space-x-2 group">
            <div className="relative">
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <SparklesIcon className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-white text-base sm:text-xl font-bold hidden xs:block">ProdiPlan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4 relative">
              {/* Selector */}
              <div
                className="absolute top-0 h-full bg-white/15 rounded-t-lg backdrop-blur-sm transition-all duration-300 ease-in-out"
                style={{
                  left: `${selectorPos.left}px`,
                  width: `${selectorPos.width}px`,
                  height: `${selectorPos.height}px`,
                  marginTop: "8px",
                }}
              />

              {navigation.map((item, index) => (
                <li
                  key={item.href}
                  ref={(el) => {
                    navItemsRef.current[index] = el;
                  }}
                  className="list-none relative"
                >
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#") && pathname === "/") {
                        e.preventDefault();
                        handleNavItemClick(index, item.href);
                      }
                    }}
                    className={`text-white/75 hover:text-white px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 flex items-center ${
                      activeNavIndex === index ? "text-white font-semibold" : ""
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </div>
          </div>

          {/* User menu and mobile button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Menu */}
            {user ? (
              <>
                <span className="text-white text-xs sm:text-sm font-medium hidden sm:block max-w-[120px] truncate">
                  {user.full_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white text-xs sm:text-sm font-medium hover:text-gray-200 transition-colors px-2 sm:px-3 py-1.5 rounded-md hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="bg-white text-blue-600 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-md hover:bg-gray-100 transition-all hover:shadow-lg"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-200 focus:outline-none p-1.5 sm:p-2"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="relative px-2 sm:px-3 pt-2 pb-3 space-y-1 sm:space-y-2 bg-gradient-to-r from-blue-500 to-blue-600">
          {/* Liquid Animation Background for Mobile Menu */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/10 rounded-full blur-lg animate-pulse animation-delay-1000"></div>
          </div>
          <div className="relative z-10">
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (item.href.startsWith("#") && pathname === "/") {
                  e.preventDefault();
                  handleNavItemClick(index, item.href);
                }
              }}
              className={`text-white/75 hover:text-white block px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeNavIndex === index
                  ? "text-white bg-white/10"
                  : ""
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
