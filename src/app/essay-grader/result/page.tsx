"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ChartBarIcon,
  LightBulbIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import SplitText from "@/components/ui/SplitText";
import { useGradingResult } from "@/hooks/useGradingSession";

interface AnalysisResult {
  final_score: number;
  readiness_level: string;
  analysis_report: {
    strengths: string;
    weaknesses: string;
    recommendations: string;
    summary: string;
    key_insights: Record<string, string>;
    career_suggestions: string[];
  };
}

function ResultContent() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const {
    data: resultData,
    isLoading: isResultLoading,
    error,
  } = useGradingResult(sessionId || undefined);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/auth");
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || isResultLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 animate-pulse">
            <SparklesIcon className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-neutral-600">Memuat hasil analisis...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check verification status
  if (resultData && resultData.verification_status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <ClockIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Hasil Sedang Diverifikasi
          </h2>
          <p className="text-neutral-600 mb-6">
            Hasil analisis Anda sedang menunggu persetujuan dari admin. Anda
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/profil" className="btn btn-primary">
              Kembali ke Profil
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              Ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (resultData && resultData.verification_status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <LightBulbIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Hasil Ditolak
          </h2>
          <p className="text-neutral-600 mb-2">
            Maaf, hasil analisis Anda tidak dapat disetujui oleh admin.
          </p>
          {resultData.admin_notes && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-neutral-900 mb-1">
                Catatan Admin:
              </p>
              <p className="text-sm text-neutral-700">
                {resultData.admin_notes}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Link href="/essay-grader" className="btn btn-primary">
              Mulai Sesi Baru
            </Link>
            <Link href="/profil" className="btn btn-secondary">
              Kembali ke Profil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <LightBulbIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Gagal Memuat Hasil
          </h2>
          <p className="text-neutral-600 mb-6">
            Maaf, kami tidak dapat memuat hasil analisis Anda saat ini. Silakan
            coba lagi nanti atau hubungi dukungan jika masalah berlanjut.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const result = resultData;

  // Helper function to parse strings to arrays
  const parseToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    // Split by common delimiters
    return value
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  // Convert score to category
  const getScoreCategory = (score: number | string): string => {
    const numScore = typeof score === 'string' ? parseInt(score) : score;
    if (numScore >= 90) return "Sangat Baik";
    if (numScore >= 80) return "Baik";
    if (numScore >= 70) return "Cukup Baik";
    if (numScore >= 60) return "Cukup";
    return "Perlu Ditingkatkan";
  };

  // Get category color
  const getCategoryColor = (score: number | string): string => {
    const numScore = typeof score === 'string' ? parseInt(score) : score;
    if (numScore >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (numScore >= 80) return "text-green-700 bg-green-50 border-green-200";
    if (numScore >= 70) return "text-blue-700 bg-blue-50 border-blue-200";
    if (numScore >= 60) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-orange-700 bg-orange-50 border-orange-200";
  };

  const strengths = parseToArray(result.analysis_report?.strengths);
  const weaknesses = parseToArray(result.analysis_report?.weaknesses);
  const recommendations = parseToArray(result.analysis_report?.recommendations);
  
  // Convert key_insights to show categories instead of scores
  const detailed_insights = result.analysis_report?.key_insights
    ? Object.entries(result.analysis_report.key_insights).map(
        ([k, v]) => ({
          label: k.replace(/_/g, " "),
          value: v,
          category: getScoreCategory(v),
          colorClass: getCategoryColor(v)
        })
      )
    : [];

  // Map readiness_level to display labels
  const getReadinessLabel = (level: string) => {
    switch (level) {
      case "very_ready":
        return "Sangat Siap";
      case "ready":
        return "Siap";
      case "somewhat_ready":
        return "Cukup Siap";
      case "not_ready":
        return "Belum Siap";
      default:
        return level;
    }
  };

  const isReadyLevel =
    result.readiness_level === "ready" ||
    result.readiness_level === "very_ready";
  const readinessLabel = getReadinessLabel(result.readiness_level);

  // For styling purposes
  const getScoreCardClasses = () => {
    if (result.readiness_level === "very_ready") return "bg-emerald-600";
    if (result.readiness_level === "ready") return "bg-green-600";
    if (result.readiness_level === "somewhat_ready") return "bg-yellow-600";
    return "bg-red-600"; // not_ready
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors" />
              <span className="text-neutral-600 group-hover:text-primary-600 transition-colors font-medium">
                Kembali
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <span className="font-semibold text-neutral-900">ProdiPlan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Overall Score Card */}
          <motion.div
            variants={itemVariants}
            className={`${getScoreCardClasses()} rounded-2xl shadow-lg p-8 md:p-12 text-white mb-8 relative overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-multiply filter blur-xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl" />
            </div>

            <div className="relative">
              <div className="text-center mb-6">
                <SplitText
                  text="Hasil Analisis Anda"
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  tag="h1"
                  delay={80}
                  duration={1.2}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 10 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-30px"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-8 mb-8">
                {/* Readiness Level - Kategori Saja */}
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                  >
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-8 md:px-12 py-6 mb-4 inline-block">
                      <p className="text-lg md:text-2xl font-bold text-white">
                        {readinessLabel}
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-4">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span className="text-sm text-white text-opacity-90">
                        {isReadyLevel
                          ? "Anda siap untuk mengambil jurusan pilihan Anda!"
                          : "Tingkatkan persiapan Anda lebih lanjut"}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Quote */}
              <motion.div variants={itemVariants} className="text-center">
                <p className="text-white text-opacity-90 italic text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  "{result.analysis_report.summary}"
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Strengths Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-md p-8 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Kekuatan Anda
              </h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <ChartBarIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-neutral-700 leading-relaxed">{strength}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Weaknesses Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-md p-8 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <LightBulbIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Area untuk Ditingkatkan
              </h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {weaknesses.map((weakness, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <LightBulbIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-neutral-700 leading-relaxed">{weakness}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Question Scores Section - Removed as API doesn't provide it yet */}

          {/* Detailed Insights Section */}
          {detailed_insights.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-md p-8 mb-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Analisis Detail
                </h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {detailed_insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`p-6 rounded-xl border-2 ${insight.colorClass}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80">
                        {insight.label}
                      </h3>
                    </div>
                    <p className="text-lg font-bold mb-1">
                      {insight.category}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Recommendations Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-primary-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Rekomendasi Aksi
              </h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-primary-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed pt-0.5">
                    {recommendation}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Link
                href="/dashboard"
                className="w-full btn btn-primary py-3 font-medium flex items-center justify-center space-x-2"
              >
                <span>Kembali ke Dashboard</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <button className="w-full btn btn-secondary py-3 font-medium flex items-center justify-center space-x-2">
                <DocumentTextIcon className="w-5 h-5" />
                <span>Unduh Laporan</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center"
          >
            <p className="text-blue-900 text-sm">
              💡 Simpan hasil ini dengan baik. Anda dapat menggunakan laporan
              ini sebagai bahan evaluasi diri dalam proses seleksi PTN atau
              untuk persiapan lebih lanjut.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 animate-pulse">
              <SparklesIcon className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-neutral-600">Memuat hasil...</p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
