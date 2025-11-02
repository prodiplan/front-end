"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface NavigationProps {
  showTestimonials?: boolean;
  onLogoutClick?: () => void;
}

export function Navigation({
  showTestimonials = true,
  onLogoutClick,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smooth scroll for anchor links
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Handle logout with confirmation popup
  const handleLogoutClick = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      logout();
      setIsUserDropdownOpen(false);
      setIsMenuOpen(false);
    }
  };

  const confirmLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const cancelLogout = () => {
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: "Fitur", href: "#features" },
    { name: "Cara Kerja", href: "#how-it-works" },
    ...(showTestimonials ? [{ name: "Testimoni", href: "#testimonials" }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-neutral-200"
          : "bg-white/90 backdrop-blur-sm border-b border-neutral-200"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-primary-600">
                ProdiPlan
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Menu / CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors duration-200"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>{user.full_name}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-neutral-200 overflow-hidden z-50"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 transition-colors duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-semantic-error hover:bg-neutral-50 transition-colors duration-200 border-t border-neutral-200"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Keluar</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth" className="btn btn-primary text-sm">
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4 border-t border-neutral-200">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      handleSmoothScroll(e, item.href);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-4 border-t border-neutral-200">
                  {user ? (
                    <div className="space-y-3">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserIcon className="h-5 w-5" />
                        <span>Profil</span>
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-neutral-600 hover:text-semantic-error hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth"
                      className="block mx-3 btn btn-primary text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Masuk
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
