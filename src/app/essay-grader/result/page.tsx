"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ChartBarIcon,
  LightBulbIcon,
  DocumentTextIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import SplitText from "@/components/ui/SplitText";

interface AnalysisResult {
  overall_score: number;
  readiness_level: "Siap" | "Cukup Siap" | "Perlu Persiapan";
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detailed_analysis: string;
  question_scores?: {
    question: number;
    score: number;
    feedback: string;
  }[];
  detailed_insights?: string[];
}

// Mock analysis result - dalam implementasi nyata akan dari API
const mockAnalysisResult: AnalysisResult = {
  overall_score: 82,
  readiness_level: "Siap",
  strengths: [
    "Memiliki motivasi yang kuat dan jelas",
    "Menunjukkan self-awareness yang baik",
    "Rencana persiapan yang terstruktur",
    "Visi karir yang realistis dan terukur",
  ],
  weaknesses: [
    "Perlu memperdalam pengetahuan tentang kurikulum jurusan",
    "Pengalaman praktik masih terbatas",
    "Belum banyak mengikuti kegiatan ekstrakurikuler terkait",
  ],
  recommendations: [
    "Ikuti webinar dan workshop tentang jurusan pilihan Anda",
    "Cari mentor atau mentor dari jurusan tersebut",
    "Tingkatkan kemampuan akademik terutama di mata pelajaran dasar",
    "Aktif di organisasi yang relevan dengan minat Anda",
    "Buat portfolio atau project sederhana untuk menunjukkan komitmen",
  ],
  detailed_analysis:
    "Berdasarkan analisis mendalam atas jawaban Anda, kami melihat bahwa Anda menunjukkan kesiapan yang baik untuk mengambil jurusan pilihan Anda. Motivasi Anda sangat jelas dan terukur, dengan pemahaman yang realistis tentang tantangan yang akan dihadapi. Namun, terdapat beberapa area yang dapat ditingkatkan untuk memaksimalkan kesuksesan Anda.",
  question_scores: [
    {
      question: 1,
      score: 85,
      feedback:
        "Jawaban menunjukkan pemahaman mendalam tentang jurusan pilihan",
    },
    {
      question: 2,
      score: 80,
      feedback: "Motivasi dijelaskan dengan baik, namun perlu lebih spesifik",
    },
    {
      question: 3,
      score: 82,
      feedback: "Pengalaman relevan sudah baik, tambahkan lebih banyak contoh",
    },
    {
      question: 4,
      score: 85,
      feedback: "Rencana persiapan terstruktur dan realistis",
    },
    {
      question: 5,
      score: 78,
      feedback: "Pemahaman tantangan ada, tapi kurang mendalam",
    },
  ],
  detailed_insights: [
    "Potensi akademik Anda sangat baik, terutama dalam kemampuan analitis",
    "Kepribadian Anda cocok untuk kolaborasi dalam lingkungan akademik",
    "Pastikan terus mengikuti perkembangan kurikulum di jurusan pilihan",
    "Manfaatkan kesempatan magang atau penelitian untuk memperkuat portofolio",
    "Jangan ragu untuk mencari bantuan dari senior atau mentor profesional",
  ],
};

export default function ResultPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
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

  const result = mockAnalysisResult;
  const isReadyLevel = result.readiness_level === "Siap";
  const scoreColorClass = isReadyLevel
    ? "bg-green-600"
    : result.readiness_level === "Cukup Siap"
      ? "bg-yellow-600"
      : "bg-red-600";

  // For styling purposes
  const getScoreCardClasses = () => {
    if (isReadyLevel) return "bg-green-600";
    if (result.readiness_level === "Cukup Siap") return "bg-yellow-600";
    return "bg-red-600";
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

              <div className="flex flex-col items-center justify-around gap-8 mb-8">
                {/* Score */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white border-opacity-30 flex items-center justify-center mb-4"
                  >
                    <span className="text-4xl md:text-5xl font-bold">
                      {result.overall_score}
                    </span>
                  </motion.div>
                  <p className="text-white text-opacity-90 font-medium">
                    Skor Keseluruhan
                  </p>
                </div>

                {/* Readiness Level */}
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.5,
                    }}
                  >
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 md:px-8 py-4 mb-4 inline-block">
                      <p className="text-white text-opacity-70 text-sm font-medium mb-1">
                        Level Kesiapan
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-white">
                        {result.readiness_level}
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
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
                  "{result.detailed_analysis}"
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
              {result.strengths.map((strength, index) => (
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
              {result.weaknesses.map((weakness, index) => (
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

          {/* Question Scores Section */}
          {result.question_scores && result.question_scores.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="bg-blue-50 rounded-2xl shadow-md p-8 mb-8 border border-blue-200"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Analisis Per Pertanyaan
                </h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {result.question_scores.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white rounded-lg p-5 border border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 mb-1">
                          Pertanyaan {item.question}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {item.feedback}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg">
                          <div className="text-center">
                            <div className="text-xl font-bold text-blue-600">
                              {item.score}
                            </div>
                            <div className="text-xs text-blue-600">/100</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Score Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Detailed Insights Section */}
          {result.detailed_insights && result.detailed_insights.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="bg-purple-50 rounded-2xl shadow-md p-8 mb-8 border border-purple-200"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Insight Mendalam
                </h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {result.detailed_insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-purple-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pt-0.5">
                      {insight}
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
              {result.recommendations.map((recommendation, index) => (
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
