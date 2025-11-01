"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PlayIcon,
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import SplitText from "@/components/ui/SplitText";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";

export function Hero() {
  const { user } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  const buttonHoverVariants = {
    hover: {
      scale: 1.08,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1], // cubic-bezier untuk smooth elastic effect
      },
    },
    tap: {
      scale: 0.92,
      transition: { duration: 0.15, ease: "easeInOut" },
    },
  };

  const features = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Analysis",
      description: "Analisis mendalam dengan teknologi AI terkini",
    },
    {
      icon: AcademicCapIcon,
      title: "Expert Recommendations",
      description: "Rekomendasi jurusan yang tepat untuk masa depan Anda",
    },
    {
      icon: ChartBarIcon,
      title: "Real-time Feedback",
      description: "Feedback langsung untuk kemajuan pembelajaran",
    },
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-white" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-8"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Platform AI Generasi Terbaru
          </motion.div>

          {/* Main Headline - Clear Value Proposition */}
          <div className="mb-6">
            <SplitText
              text="Temukan Jurusan Kuliah yang Tepat untuk Anda dalam 5 Menit"
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight"
              tag="h1"
              delay={100}
              duration={3}
              ease="elastic.out(0.8, 0.3)"
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
            />
          </div>

          {/* Subheadline - Clear and Scannable */}
          <div className="mb-10">
            <SplitText
              text="Analisis mendalam berbasis AI mengungkap potensi tersembunyi Anda, memberikan rekomendasi jurusan yang sesuai, dan persiapan sukses masuk PTN."
              className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed"
              tag="p"
              delay={70}
              duration={2}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.15}
              rootMargin="-50px"
            />
          </div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            {user ? (
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/dashboard"
                  className="btn btn-primary btn-lg text-lg px-8 py-4 flex items-center space-x-2"
                >
                  <span>Dashboard Saya</span>
                  <ChartBarIcon className="w-5 h-5" />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <MovingBorderButton
                    as={Link}
                    href="/auth"
                    borderRadius="0.5rem"
                    duration={2000}
                    className="text-white flex items-center space-x-2 font-medium"
                    containerClassName="flex"
                  >
                    <span>Mulai Gratis</span>
                    <SparklesIcon className="w-5 h-5" />
                  </MovingBorderButton>
                </motion.div>
                <motion.div
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="btn btn-secondary btn-lg text-lg px-8 py-4 flex items-center space-x-2"
                  >
                    <PlayIcon className="w-5 h-5" />
                    <span>Lihat Demo</span>
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-neutral-600"
          >
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
              <span>Gratis untuk mencoba</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
              <span>Tidak perlu kartu kredit</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
              <span>Hasil instan</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="card card-hover p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Demo Platform</h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="aspect-video bg-neutral-100 flex items-center justify-center">
              <div className="text-center">
                <PlayIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">
                  Video demo akan segera tersedia
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
