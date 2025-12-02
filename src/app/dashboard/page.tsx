"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import SplitText from "@/components/ui/SplitText";
import { DashboardNavBar } from "@/components/ui/dashboard-navbar";
import { Footer } from "@/components/layout/footer";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 animate-pulse">
            <SparklesIcon className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-neutral-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardNavBar
        user={user}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />
      <main className="mt-12 bg-white">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-white">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-white" />

          {/* Decorative Elements */}
          <div className="absolute top-20 -left-32 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-40 -right-32 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              {/* Greeting */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-8"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Selamat datang kembali, {user.full_name?.split(" ")[0]}!
              </motion.div>

              {/* Main Headline */}
              <div className="mb-6">
                <SplitText
                  text="Siap Menemukan Jurusan yang Tepat?"
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight"
                  tag="h1"
                  delay={100}
                  duration={2.5}
                  ease="elastic.out(0.8, 0.3)"
                  splitType="words"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-50px"
                />
              </div>

              {/* Subheadline */}
              <div className="mb-12">
                <SplitText
                  text="Analisis mendalam dengan teknologi AI untuk mengungkap potensi sejati Anda dan menemukan jurusan yang paling sesuai dengan aspirasi masa depan Anda."
                  className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed"
                  tag="p"
                  delay={70}
                  duration={1.8}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 20 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.15}
                  rootMargin="-30px"
                />
              </div>

              {/* CTA Button */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-16"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/essay-grader"
                    className="btn btn-primary btn-lg text-lg px-8 py-4 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>Mulai Test Sekarang</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-600 mb-12"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
                  <span>Durasi: ±10-15 menit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
                  <span>Hasil instan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
                  <span>Bebas revisi</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section from Landing Page */}
        <Features />

        {/* How It Works Section from Landing Page */}
        <HowItWorks />
      </main>

      <Footer />

      {/* Logout Confirmation Popup */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Konfirmasi Keluar
              </h3>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                Apakah Anda yakin ingin keluar dari akun Anda?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowLogoutConfirm(false);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-semantic-error text-white font-medium hover:bg-semantic-error/90 transition-colors duration-200"
                >
                  Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
