"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  MapIcon,
  BriefcaseIcon,
  ClockIcon,
  AcademicCapIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useGradingSession, useGradingResult } from "@/hooks/useGradingSession";
import { GradingResult, AnalysisReport } from "@/types";

interface AssessmentDetail {
  id: string;
  target_major: string;
  final_score: number;
  readiness_level: string;
  completed_at: string;
  analysis_report: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    key_insights: {
      motivation_score: number;
      technical_understanding: number;
      career_alignment: number;
    };
    personality_traits: Record<string, string>;
    career_suggestions: string[];
    book_recommendations?: {
      title: string;
      author: string;
      isbn?: string;
      cover_url?: string;
      description: string;
      relevance_score: number;
      difficulty_level: "beginner" | "intermediate" | "advanced";
      topics: string[];
      estimated_reading_time?: string;
      purchase_links?: {
        tokopedia?: string;
        shopee?: string;
        gramedia?: string;
      };
    }[];
    learning_path?: {
      phase: number;
      title: string;
      description: string;
      estimated_duration: string;
      skills_to_learn: string[];
      resources: string[];
      milestones: string[];
    }[];
    action_plan?: {
      priority: "high" | "medium" | "low";
      title: string;
      description: string;
      timeframe: string;
      category: "study" | "practice" | "networking" | "certification" | "project";
      completed?: boolean;
    }[];
    industry_insights?: {
      job_market_demand: "high" | "medium" | "low";
      demand_description: string;
      average_salary_range: string;
      salary_progression: {
        entry_level: string;
        mid_level: string;
        senior_level: string;
      };
      growth_potential: number;
      growth_description: string;
      top_companies: string[];
      required_certifications?: string[];
      skills_in_demand: string[];
      future_outlook: string;
    };
  };
}

export default function ResultDetailPage() {
  const params = useParams();
  const sessionId = params.resultId as string;
  const [enableFetch, setEnableFetch] = useState(false);
  const [showNotReady, setShowNotReady] = useState(false);

  // Delay 5 detik sebelum mulai fetch result
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableFetch(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const { data: session, isLoading: isSessionLoading } =
    useGradingSession(sessionId);
  const { data: resultData, isLoading: isResultLoading } =
    useGradingResult(sessionId, enableFetch);

  // Jika sudah fetch tapi hasil tidak ada, tampilkan pesan
  useEffect(() => {
    if (enableFetch && !isResultLoading && !resultData) {
      const timer = setTimeout(() => {
        setShowNotReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resultData) {
      // Reset showNotReady jika data berhasil dimuat
      setShowNotReady(false);
    }
  }, [enableFetch, isResultLoading, resultData]);

  const isLoading = isSessionLoading || (enableFetch && isResultLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <SparklesIcon className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-neutral-800 font-medium text-lg mb-2">
            Memuat hasil grading Anda...
          </p>
          <p className="text-neutral-600 text-sm">
            Mohon tunggu sebentar
          </p>
        </div>
      </div>
    );
  }

  if (!session || !resultData || showNotReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto px-6"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <SparklesIcon className="w-10 h-10 text-primary-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            AI Sedang Menganalisis
          </h1>

          {/* Description */}
          <p className="text-neutral-600 mb-2 leading-relaxed">
            AI kami sedang menganalisis jawaban Anda secara mendalam untuk memberikan hasil terbaik.
          </p>
          <p className="text-neutral-500 text-sm mb-8">
            Silakan kembali ke profil dan cek kembali sebentar lagi.
          </p>

          {/* Action Button */}
          <Link href="/profile" className="btn btn-primary btn-lg inline-flex items-center space-x-2">
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Kembali ke Profil</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Parse analysis_report - API returns strings for strengths, weaknesses, recommendations
  // Convert them to arrays for display
  const parseToArray = (value: string | string[]): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      // First check if there are bullet points or numbered lists
      if (value.includes('\n- ') || value.includes('\n• ') || /\n\d+\.\s/.test(value)) {
        // Split by bullet points or numbered items
        return value
          .split(/\n[-•]|\n\d+\.\s/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      // Check for newline separated items (paragraphs)
      if (value.includes('\n\n')) {
        return value
          .split('\n\n')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      // Check for single newlines
      if (value.includes('\n')) {
        return value
          .split('\n')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      // If no clear delimiters, return as single item
      return value.trim().length > 0 ? [value.trim()] : [];
    }
    return [];
  };

  const result: AssessmentDetail = {
    id: resultData.id,
    target_major: session.target_major || "Unknown Major",
    final_score: resultData.final_score,
    readiness_level: resultData.readiness_level,
    completed_at: resultData.created_at,
    analysis_report: {
      summary: resultData.analysis_report?.summary || "",
      strengths: parseToArray(resultData.analysis_report?.strengths || ""),
      weaknesses: parseToArray(resultData.analysis_report?.weaknesses || ""),
      recommendations: parseToArray(
        resultData.analysis_report?.recommendations || ""
      ),
      key_insights: resultData.analysis_report?.key_insights || {
        motivation_score: 0,
        technical_understanding: 0,
        career_alignment: 0,
      },
      personality_traits: resultData.analysis_report?.personality_traits || {},
      career_suggestions: resultData.analysis_report?.career_suggestions || [],
      book_recommendations: resultData.analysis_report?.book_recommendations || [],
      learning_path: resultData.analysis_report?.learning_path || [],
      action_plan: resultData.analysis_report?.action_plan || [],
      industry_insights: resultData.analysis_report?.industry_insights,
    },
  };

  // Map readiness_level to Indonesian labels
  const getReadinessLabel = (level: string) => {
    switch (level) {
      case "ready":
        return "Siap";
      case "needs_improvement":
        return "Cukup Siap";
      case "not_ready":
        return "Perlu Persiapan";
      default:
        return level;
    }
  };

  // Map score to category (based on score range, not backend readiness_level)
  const getScoreCategory = (score: number) => {
    if (score >= 90) return { label: "Sangat Siap", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" };
    if (score >= 80) return { label: "Siap", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (score >= 70) return { label: "Cukup Siap", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    if (score >= 60) return { label: "Perlu Persiapan", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    return { label: "Belum Siap", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case "ready":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          light: "text-green-600",
        };
      case "needs_improvement":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          light: "text-yellow-600",
        };
      case "not_ready":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          light: "text-red-600",
        };
      default:
        return {
          bg: "bg-neutral-50",
          border: "border-neutral-200",
          text: "text-neutral-700",
          light: "text-neutral-600",
        };
    }
  };

  const colors = getReadinessColor(result.readiness_level);
  const scoreCategory = getScoreCategory(result.final_score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white bg-opacity-50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile" className="flex items-center space-x-2 group">
              <ArrowLeftIcon className="w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors" />
              <span className="text-neutral-600 group-hover:text-primary-600 transition-colors font-medium">
                Kembali
              </span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 group">
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
              <span className="text-gray-900 text-lg sm:text-xl font-bold">
                ProdiPlan
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${colors.bg} border ${colors.border} rounded-3xl shadow-lg overflow-hidden mb-8`}
        >
          <div className="bg-primary-600 px-6 sm:px-8 lg:px-12 py-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col lg:flex-row items-center justify-between gap-8"
            >
              {/* Left Side */}
              <div>
                <p className="text-white text-opacity-90 text-base sm:text-lg mb-2">
                  {result.target_major}
                </p>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                  {result.final_score}
                </h1>
                <div className={`inline-flex items-center space-x-2 ${scoreCategory.bg} ${scoreCategory.border} border px-4 py-2 rounded-full`}>
                  <CheckCircleIcon className={`w-5 h-5 ${scoreCategory.color}`} />
                  <span className={`text-sm font-semibold ${scoreCategory.color}`}>
                    {scoreCategory.label}
                  </span>
                </div>
              </div>

              {/* Right Side - Insights */}
              <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                {[
                  {
                    label: "Motivasi",
                    value: result.analysis_report.key_insights.motivation_score,
                  },
                  {
                    label: "Teknis",
                    value:
                      result.analysis_report.key_insights
                        .technical_understanding,
                  },
                  {
                    label: "Karir",
                    value: result.analysis_report.key_insights.career_alignment,
                  },
                ].map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                    className="bg-white bg-opacity-20 rounded-xl p-4 text-center backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold mb-1">
                      {insight.value}
                    </div>
                    <p className="text-xs sm:text-sm text-white text-opacity-80">
                      {insight.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Summary */}
          <div className="px-6 sm:px-8 lg:px-12 py-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-3">
                Ringkasan Analisis
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                {result.analysis_report.summary}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Combined Analysis Content */}
        <OverviewTab result={result} colors={colors} />

        <DetailedTab result={result} />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          <Link
            href="/profile"
            className="flex-1 btn btn-secondary btn-lg px-6 py-4 text-center"
          >
            Kembali ke Profil
          </Link>
          <Link
            href="/essay-grader"
            className="flex-1 btn btn-primary btn-lg px-6 py-4 flex items-center justify-center space-x-2"
          >
            <span>Ikuti Assessment Lagi</span>
            <SparklesIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function OverviewTab({
  result,
  colors,
}: {
  result: AssessmentDetail;
  colors: any;
}) {
  const [selectedBook, setSelectedBook] = useState<any | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Strengths & Weaknesses - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center space-x-2">
            <StarIcon className="w-6 h-6 text-yellow-500" />
            <span>Kekuatan Anda</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {result.analysis_report.strengths.map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3"
              >
                <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-neutral-700">{strength}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
            <span>Area Pengembangan</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {result.analysis_report.weaknesses.map((weakness, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                <p className="text-neutral-700">{weakness}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Recommendations */}
      {result.analysis_report.book_recommendations && result.analysis_report.book_recommendations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center space-x-2">
            <BookOpenIcon className="w-6 h-6 text-primary-600" />
            <span>Rekomendasi Buku</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {result.analysis_report.book_recommendations.map((book, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedBook(book)}
                className="bg-gradient-to-br from-neutral-50 to-primary-50 border border-neutral-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer hover:scale-105 w-full sm:w-80 max-w-sm"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-neutral-900 mb-1 line-clamp-2">
                      {book.title}
                    </h4>
                    <p className="text-sm text-neutral-600">oleh {book.author}</p>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 mb-3 line-clamp-3">
                  {book.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {book.topics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span className="flex items-center space-x-1">
                    <AcademicCapIcon className="w-4 h-4" />
                    <span className="capitalize">{book.difficulty_level}</span>
                  </span>
                  {book.estimated_reading_time && (
                    <span className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{book.estimated_reading_time}</span>
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Book Detail Modal */}
          <AnimatePresence>
            {selectedBook && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBook(null)}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-2xl flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                      <p className="text-primary-100">oleh {selectedBook.author}</p>
                    </div>
                    <button
                      onClick={() => setSelectedBook(null)}
                      className="ml-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="font-bold text-neutral-900 mb-2 flex items-center space-x-2">
                        <BookOpenIcon className="w-5 h-5 text-primary-600" />
                        <span>Deskripsi</span>
                      </h3>
                      <p className="text-neutral-700 leading-relaxed">{selectedBook.description}</p>
                    </div>

                    {/* Topics */}
                    <div>
                      <h3 className="font-bold text-neutral-900 mb-3">Topik Pembahasan</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBook.topics.map((topic: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-primary-100 text-primary-700 text-sm rounded-full font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="text-xs text-neutral-600 mb-1">Tingkat Kesulitan</p>
                        <p className="font-semibold text-neutral-900 capitalize">{selectedBook.difficulty_level}</p>
                      </div>
                      {selectedBook.estimated_reading_time && (
                        <div className="bg-neutral-50 rounded-lg p-4">
                          <p className="text-xs text-neutral-600 mb-1">Estimasi Waktu Baca</p>
                          <p className="font-semibold text-neutral-900">{selectedBook.estimated_reading_time}</p>
                        </div>
                      )}
                      {selectedBook.isbn && (
                        <div className="bg-neutral-50 rounded-lg p-4 col-span-2">
                          <p className="text-xs text-neutral-600 mb-1">ISBN</p>
                          <p className="font-semibold text-neutral-900">{selectedBook.isbn}</p>
                        </div>
                      )}
                    </div>

                    {/* Purchase Links */}
                    {selectedBook.purchase_links && (
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-3">Beli Buku</h3>
                        <div className="flex flex-wrap gap-3">
                          {selectedBook.purchase_links.tokopedia && (
                            <a
                              href={selectedBook.purchase_links.tokopedia}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 min-w-[140px] px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
                            >
                              Tokopedia
                            </a>
                          )}
                          {selectedBook.purchase_links.shopee && (
                            <a
                              href={selectedBook.purchase_links.shopee}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 min-w-[140px] px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-semibold"
                            >
                              Shopee
                            </a>
                          )}
                          {selectedBook.purchase_links.gramedia && (
                            <a
                              href={selectedBook.purchase_links.gramedia}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 min-w-[140px] px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
                            >
                              Gramedia
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Learning Path */}
      {result.analysis_report.learning_path && result.analysis_report.learning_path.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center space-x-2">
            <MapIcon className="w-6 h-6 text-primary-600" />
            <span>Roadmap Pembelajaran</span>
          </h3>
          <div className="space-y-6">
            {result.analysis_report.learning_path.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-gradient-to-r from-primary-50 to-neutral-50 border border-primary-200 rounded-xl p-6"
              >
                {/* Phase Number Badge */}
                <div className="absolute -left-4 top-6 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{phase.phase}</span>
                </div>

                <div className="ml-10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-neutral-900">{phase.title}</h4>
                    <span className="text-sm text-neutral-600 flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{phase.estimated_duration}</span>
                    </span>
                  </div>

                  <p className="text-neutral-700 mb-4">{phase.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold text-neutral-900 mb-2 flex items-center space-x-1">
                        <AcademicCapIcon className="w-4 h-4" />
                        <span>Skills yang Dipelajari:</span>
                      </p>
                      <ul className="space-y-1">
                        {phase.skills_to_learn.map((skill, i) => (
                          <li key={i} className="text-sm text-neutral-700 flex items-start space-x-2">
                            <span className="text-primary-600 mt-1">•</span>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900 mb-2">Resources:</p>
                      <ul className="space-y-1">
                        {phase.resources.map((resource, i) => (
                          <li key={i} className="text-sm text-neutral-700 flex items-start space-x-2">
                            <span className="text-primary-600 mt-1">•</span>
                            <span>{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900 mb-2 flex items-center space-x-1">
                        <TrophyIcon className="w-4 h-4" />
                        <span>Milestones:</span>
                      </p>
                      <ul className="space-y-1">
                        {phase.milestones.map((milestone, i) => (
                          <li key={i} className="text-sm text-neutral-700 flex items-start space-x-2">
                            <span className="text-primary-600 mt-1">✓</span>
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan */}
      {result.analysis_report.action_plan && result.analysis_report.action_plan.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center space-x-2">
            <CheckCircleIcon className="w-6 h-6 text-primary-600" />
            <span>Rencana Aksi</span>
          </h3>
          <div className="space-y-3">
            {result.analysis_report.action_plan.map((action, index) => {
              const priorityColors = {
                high: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", badge: "bg-red-600" },
                medium: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", badge: "bg-yellow-600" },
                low: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", badge: "bg-blue-600" },
              };
              const colors = priorityColors[action.priority];

              const categoryIcons = {
                study: AcademicCapIcon,
                practice: TrophyIcon,
                networking: BuildingOfficeIcon,
                certification: StarIcon,
                project: LightBulbIcon,
              };
              const IconComponent = categoryIcons[action.category];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`${colors.bg} border ${colors.border} rounded-lg p-4`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${colors.badge} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-neutral-900">{action.title}</h4>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <span className={`text-xs px-2 py-1 ${colors.badge} text-white rounded-full uppercase font-semibold`}>
                            {action.priority}
                          </span>
                          <span className="text-xs px-2 py-1 bg-neutral-200 text-neutral-700 rounded-full capitalize">
                            {action.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 mb-2">{action.description}</p>
                      <div className="flex items-center space-x-1 text-xs text-neutral-600">
                        <ClockIcon className="w-4 h-4" />
                        <span>{action.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Industry Insights */}
      {result.analysis_report.industry_insights && (
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center space-x-2">
            <BriefcaseIcon className="w-6 h-6 text-primary-600" />
            <span>Outlook Industri & Karir</span>
          </h3>

          <div className="space-y-6">
            {/* Market Demand & Growth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-neutral-900">Permintaan Pasar</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${result.analysis_report.industry_insights.job_market_demand === "high"
                    ? "bg-green-600 text-white"
                    : result.analysis_report.industry_insights.job_market_demand === "medium"
                      ? "bg-yellow-600 text-white"
                      : "bg-red-600 text-white"
                    }`}>
                    {result.analysis_report.industry_insights.job_market_demand.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-neutral-700">
                  {result.analysis_report.industry_insights.demand_description}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-bold text-neutral-900 mb-3">Potensi Pertumbuhan</h4>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-3xl font-bold text-primary-600">
                    {result.analysis_report.industry_insights.growth_potential}/10
                  </div>
                  <div className="flex-1 bg-neutral-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-full rounded-full transition-all"
                      style={{ width: `${result.analysis_report.industry_insights.growth_potential * 10}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-neutral-700">
                  {result.analysis_report.industry_insights.growth_description}
                </p>
              </div>
            </div>

            {/* Salary Progression */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                <CurrencyDollarIcon className="w-5 h-5" />
                <span>Proyeksi Gaji</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Entry Level</p>
                  <p className="font-bold text-neutral-900">
                    {result.analysis_report.industry_insights.salary_progression.entry_level}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Mid Level (3-5 tahun)</p>
                  <p className="font-bold text-neutral-900">
                    {result.analysis_report.industry_insights.salary_progression.mid_level}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Senior Level (7+ tahun)</p>
                  <p className="font-bold text-neutral-900">
                    {result.analysis_report.industry_insights.salary_progression.senior_level}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Companies */}
            <div>
              <h4 className="font-bold text-neutral-900 mb-3 flex items-center space-x-2">
                <BuildingOfficeIcon className="w-5 h-5" />
                <span>Top Companies</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.analysis_report.industry_insights.top_companies.map((company, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-lg text-sm font-medium"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills in Demand */}
            <div>
              <h4 className="font-bold text-neutral-900 mb-3 flex items-center space-x-2">
                <StarIcon className="w-5 h-5" />
                <span>Skills yang Paling Dicari</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.analysis_report.industry_insights.skills_in_demand.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 bg-primary-100 border border-primary-300 text-primary-700 rounded-lg text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Required Certifications */}
            {result.analysis_report.industry_insights.required_certifications &&
              result.analysis_report.industry_insights.required_certifications.length > 0 && (
                <div>
                  <h4 className="font-bold text-neutral-900 mb-3">Sertifikasi yang Direkomendasikan</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis_report.industry_insights.required_certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Future Outlook */}
            <div className="bg-gradient-to-r from-neutral-50 to-primary-50 border border-neutral-200 rounded-xl p-5">
              <h4 className="font-bold text-neutral-900 mb-2">Outlook Masa Depan</h4>
              <p className="text-sm text-neutral-700">
                {result.analysis_report.industry_insights.future_outlook}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function DetailedTab({ result }: { result: AssessmentDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 mt-8"
    >
      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center space-x-2">
          <LightBulbIcon className="w-6 h-6 text-primary-500" />
          <span>Rekomendasi Pengembangan</span>
        </h3>
        <div className="space-y-4">
          {result.analysis_report.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-l-4 border-primary-600 pl-4 py-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-neutral-700 pt-1">{rec}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Personality Traits */}
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">
          Profil Kepribadian
        </h3>
        <div className="space-y-4">
          {Object.entries(result.analysis_report.personality_traits).map(
            ([trait, level], index) => {
              const levelPercentage =
                level === "high" ? 85 : level === "medium" ? 60 : 35;
              const levelColor =
                level === "high"
                  ? "bg-green-500"
                  : level === "medium"
                    ? "bg-yellow-500"
                    : "bg-red-500";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-neutral-900 capitalize">
                      {trait.replace(/_/g, " ")}
                    </p>
                    <span className="text-sm font-semibold text-neutral-600">
                      {level.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${levelPercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full ${levelColor} transition-all`}
                    />
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </div>

      {/* Test Information */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">
          Informasi Test
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-neutral-600 mb-1">Jurusan Pilihan</p>
            <p className="font-semibold text-neutral-900">
              {result.target_major}
            </p>
          </div>
          <div>
            <p className="text-neutral-600 mb-1">Tanggal Selesai</p>
            <p className="font-semibold text-neutral-900">
              {new Date(result.completed_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
