"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  AcademicCapIcon,
  FireIcon,
  TrophyIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { gradingService } from "@/lib/services/grading";
import { useAuth } from "@/components/providers/auth-provider";
import { GradingStatistics } from "@/types";
import toast from "react-hot-toast";

export default function StatisticsDashboard() {
  const { token } = useAuth();
  const [statistics, setStatistics] = useState<GradingStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await gradingService.getStatistics(token);
        setStatistics(response.data);
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat statistik");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-neutral-200 p-6 animate-pulse"
          >
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  const statCards = [
    {
      title: "Total Assessment",
      value: statistics.total_sessions,
      icon: AcademicCapIcon,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Siap",
      value:
        (statistics.readiness_distribution.ready || 0) +
        (statistics.readiness_distribution.very_ready || 0),
      icon: FireIcon,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Belum Siap",
      value:
        (statistics.readiness_distribution.somewhat_ready || 0) +
        (statistics.readiness_distribution.not_ready || 0),
      icon: ClockIcon,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} rounded-lg md:rounded-xl border border-${card.color}-200 p-3 md:p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-600 mb-1 truncate">
                  {card.title}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${card.textColor} truncate`}>
                  {card.value}
                </p>
              </div>
              <div className={`self-start md:self-auto flex-shrink-0 p-2 md:p-2.5 rounded-lg bg-white/50`}>
                <card.icon className={`w-4 h-4 md:w-5 md:h-5 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Latest Result */}
      {statistics.latest_result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg md:rounded-xl border border-blue-200 p-4 md:p-6"
        >
          <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-3 md:mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Assessment Terakhir
          </h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <p className="text-xs md:text-sm text-neutral-600 mb-1">Tingkat Kesiapan</p>
              {statistics.latest_result.verification_status === "pending" ? (
                <p className="text-sm md:text-lg font-semibold text-amber-700">
                  Sedang di Verifikasi
                </p>
              ) : (
                <p
                  className={`text-sm md:text-lg font-semibold ${
                    statistics.latest_result.readiness_level === "very_ready"
                      ? "text-emerald-600"
                      : statistics.latest_result.readiness_level === "ready"
                        ? "text-green-600"
                        : statistics.latest_result.readiness_level ===
                            "somewhat_ready"
                          ? "text-yellow-600"
                          : "text-red-600"
                  }`}
                >
                  {statistics.latest_result.readiness_level === "very_ready"
                    ? "Sangat Siap"
                    : statistics.latest_result.readiness_level === "ready"
                      ? "Siap"
                      : statistics.latest_result.readiness_level ===
                          "somewhat_ready"
                        ? "Cukup Siap"
                        : "Belum Siap"}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs md:text-sm text-neutral-600 mb-1">Tanggal</p>
              <p className="text-sm md:text-lg font-semibold text-neutral-900">
                {new Date(
                  statistics.latest_result.created_at,
                ).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
