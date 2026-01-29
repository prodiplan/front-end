"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserIcon,
  ChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import StatisticsDashboard from "@/components/profile/StatisticsDashboard";
import SessionHistory from "@/components/profile/SessionHistory";
import ProfileSettings from "@/components/profile/ProfileSettings";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "overview">(
    "overview",
  );

  // Redirect to auth if user is not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    {
      id: "overview" as const,
      label: "Ringkasan & Riwayat",
      icon: ChartBarIcon,
    },
    { id: "settings" as const, label: "Pengaturan", icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 md:mb-6 transition-colors text-sm md:text-base"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-3xl font-bold mb-1 truncate">{user.full_name}</h1>
              <p className="text-white/80 text-sm md:text-base truncate">{user.email}</p>
              <p className="text-xs md:text-sm text-white/70 mt-1 truncate">
                {user.dream_major} • {user.school_origin}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Mobile Tabs */}
        <div className="md:hidden mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-3">
            <nav className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Desktop Sidebar - Tabs */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 sticky top-8">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-8 lg:col-span-9">
            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileSettings onLogout={() => setShowLogoutConfirm(true)} />
              </motion.div>
            )}

            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                  {/* Left Column - Ringkasan */}
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-neutral-900 mb-4 md:mb-6 flex items-center gap-2">
                      <ChartBarIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      Ringkasan
                    </h2>
                    <StatisticsDashboard />
                  </div>

                  {/* Right Column - Riwayat */}
                  <div>
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 md:p-6">
                      <h2 className="text-lg md:text-xl font-semibold text-neutral-900 mb-4 md:mb-6 flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                        Riwayat Assessment
                      </h2>
                      <SessionHistory limit={2} showFilters={false} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Konfirmasi Logout
            </h3>
            <p className="text-neutral-600 mb-6">
              Apakah Anda yakin ingin keluar dari akun Anda?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
