"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface AnalysisReport {
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
}

interface AssessmentDetail {
  id: string;
  target_major: string;
  final_score: number;
  readiness_level: string;
  completed_at: string;
  analysis_report: AnalysisReport;
}

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.resultId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<AssessmentDetail | null>(null);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setResult({
        id: resultId,
        target_major: "Computer Science",
        final_score: 78,
        readiness_level: "Siap",
        completed_at: "2024-11-01T11:30:00Z",
        analysis_report: {
          summary:
            "Hasil analisis menunjukkan bahwa Anda memiliki kesiapan yang baik untuk melanjutkan studi Computer Science. Motivasi Anda sangat kuat dan terlihat dari jawaban-jawaban yang detail dan penuh refleksi. Anda menunjukkan pemahaman yang solid tentang tantangan yang akan dihadapi serta langkah-langkah konkret yang sudah atau akan dilakukan untuk mempersiapkan diri.",
          strengths: [
            "Motivasi yang sangat kuat dan jelas untuk mengejar Computer Science",
            "Pemahaman dasar programming yang solid dengan pengalaman praktis",
            "Kemampuan problem-solving yang baik dan logika yang terstruktur",
            "Komitmen tinggi terhadap pembelajaran berkelanjutan dan pengembangan diri",
          ],
          weaknesses: [
            "Masih perlu memperdalam pemahaman tentang algoritma dan struktur data",
            "Pengalaman proyek kolaboratif masih terbatas",
            "Perlu meningkatkan penguasaan matematika diskrit dan teori komputasi",
          ],
          recommendations: [
            "Ikuti kursus online tentang algoritma dan struktur data (misal: Coursera, EdX)",
            "Partisipasi dalam kompetisi programming seperti Codeforces atau ICPC",
            "Buat proyek portfolio yang menunjukkan skill Anda kepada industri",
            "Tingkatkan pemahaman matematika melalui latihan soal reguler",
            "Cari mentor atau bergabung dengan komunitas programming untuk belajar dari yang lebih berpengalaman",
          ],
          key_insights: {
            motivation_score: 85,
            technical_understanding: 75,
            career_alignment: 78,
          },
          personality_traits: {
            analytical_thinking: "high",
            problem_solving: "high",
            creativity: "medium",
            teamwork: "medium",
            communication: "high",
          },
          career_suggestions: [
            "Software Engineer",
            "Data Scientist",
            "Product Manager",
            "DevOps Engineer",
            "AI/ML Engineer",
          ],
        },
      });
      setIsLoading(false);
    }, 1000);
  }, [resultId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full"
        >
          <SparklesIcon className="w-8 h-8 text-primary-600" />
        </motion.div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-6">Hasil tidak ditemukan</p>
          <Link href="/profile" className="btn btn-primary">
            Kembali ke Profil
          </Link>
        </div>
      </div>
    );
  }

  const getReadinessColor = (level: string) => {
    switch (level) {
      case "Siap":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          light: "text-green-600",
        };
      case "Cukup Siap":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          light: "text-yellow-600",
        };
      case "Perlu Persiapan":
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
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="font-semibold text-neutral-900">ProdiPlan</span>
            </div>
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
                <motion.p
                  className="text-2xl font-semibold flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <CheckCircleIcon className="w-8 h-8" />
                  <span>{result.readiness_level}</span>
                </motion.p>
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Strengths */}
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center space-x-2">
          <StarIcon className="w-6 h-6 text-yellow-500" />
          <span>Kekuatan Anda</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Career Suggestions */}
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center space-x-2">
          <ArrowTrendingUpIcon className="w-6 h-6 text-primary-600" />
          <span>Saran Karir</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.analysis_report.career_suggestions.map((career, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center"
            >
              <p className="font-semibold text-neutral-900">{career}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DetailedTab({ result }: { result: AssessmentDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
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
