"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  TrashIcon,
  CalendarIcon,
  AcademicCapIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import { gradingService } from "@/lib/services/grading";
import {
  useGradingSessions,
  useGradingResults,
} from "@/hooks/useGradingSession";
import { GradingSession } from "@/types";
import Link from "next/link";
import toast from "react-hot-toast";

interface SessionHistoryProps {
  limit?: number;
  showFilters?: boolean;
}

export default function SessionHistory({
  limit,
  showFilters = true,
}: SessionHistoryProps = {}) {
  const { token } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: sessionsData,
    isLoading,
    refetch,
  } = useGradingSessions({
    limit: limit || 50,
    status: selectedStatus === "all" ? undefined : selectedStatus,
  });

  const { data: resultsData, refetch: refetchResults } = useGradingResults({ limit: 100 });

  // Auto-refetch sessions when results change to keep status in sync
  useEffect(() => {
    if (resultsData?.results) {
      refetch();
    }
  }, [resultsData?.results?.length]);

  const completedSessionIds = new Set(
    resultsData?.results?.map((r) => r.session_id) || [],
  );

  const handleDeleteSession = async () => {
    if (!sessionToDelete || !token) return;

    setIsDeleting(true);
    try {
      await gradingService.deleteSession(sessionToDelete, token);
      toast.success("Session berhasil dihapus");
      setShowDeleteModal(false);
      setSessionToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus session");
    } finally {
      setIsDeleting(false);
    }
  };

  const getSessionStatus = (session: GradingSession) => {
    const hasResult = completedSessionIds.has(session.id);
    const isExpired =
      session.expires_at && new Date(session.expires_at) < new Date();

    if (hasResult) {
      return {
        status: "completed" as const,
        label: "Selesai",
        icon: CheckCircleIcon,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    } else if (session.status === "active" && !isExpired) {
      return {
        status: "active" as const,
        label: "Berlangsung",
        icon: ClockIcon,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    } else {
      return {
        status: "expired" as const,
        label: "Kedaluwarsa",
        icon: ExclamationTriangleIcon,
        color: "text-neutral-500",
        bgColor: "bg-neutral-50",
        borderColor: "border-neutral-200",
      };
    }
  };

  const getResultForSession = (sessionId: string) => {
    return resultsData?.results?.find((r) => r.session_id === sessionId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-neutral-200 p-6 animate-pulse"
          >
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const sessions = sessionsData?.sessions || [];
  const totalSessions = sessionsData?.pagination?.total || sessions.length;
  // Show "Show All" button if limit is set and we have sessions
  const hasMore = limit && sessions.length > 0;

  return (
    <div className="space-y-6">
      {/* Filter */}
      {showFilters && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-neutral-700">Filter:</span>
          {["all", "active", "completed", "expired"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStatus === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {status === "all"
                ? "Semua"
                : status === "active"
                  ? "Berlangsung"
                  : status === "completed"
                    ? "Selesai"
                    : "Kedaluwarsa"}
            </button>
          ))}
        </div>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-12 text-center">
          <AcademicCapIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600 mb-2">Belum ada riwayat assessment</p>
          <p className="text-sm text-neutral-500">
            Mulai assessment pertama Anda untuk melihat riwayat di sini
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, index) => {
            const statusInfo = getSessionStatus(session);
            const result = getResultForSession(session.id);

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl border ${statusInfo.borderColor} p-6 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 ${statusInfo.bgColor} rounded-lg`}>
                        <statusInfo.icon
                          className={`w-5 h-5 ${statusInfo.color}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          {session.target_major}
                        </h3>
                        <p
                          className={`text-sm font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {new Date(session.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Result Preview */}
                    {result && (
                      <>
                        <div
                          className={`${statusInfo.bgColor} rounded-lg p-3 mb-2`}
                        >
                          <p className="text-sm font-medium text-neutral-700 mb-1">
                            Tingkat Kesiapan:
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              result.readiness_level === "very_ready"
                                ? "text-emerald-600"
                                : result.readiness_level === "ready"
                                  ? "text-green-600"
                                  : result.readiness_level === "somewhat_ready"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                            }`}
                          >
                            {result.readiness_level === "very_ready"
                              ? "Sangat Siap"
                              : result.readiness_level === "ready"
                                ? "Siap"
                                : result.readiness_level === "somewhat_ready"
                                  ? "Cukup Siap"
                                  : "Belum Siap"}
                          </p>
                        </div>

                        {/* Verification Status Badge */}
                        <div
                          className={`rounded-lg p-3 ${
                            result.verification_status === "approved"
                              ? "bg-green-50 border border-green-200"
                              : result.verification_status === "rejected"
                                ? "bg-red-50 border border-red-200"
                                : "bg-amber-50 border border-amber-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {result.verification_status === "approved" && (
                              <>
                                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                  Disetujui Admin
                                </span>
                              </>
                            )}
                            {result.verification_status === "rejected" && (
                              <>
                                <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-700">
                                  Ditolak Admin
                                </span>
                              </>
                            )}
                            {result.verification_status === "pending" && (
                              <>
                                <ClockIcon className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-700">
                                  Menunggu Verifikasi
                                </span>
                              </>
                            )}
                          </div>
                          {result.admin_notes && (
                            <p className="text-xs text-neutral-600 mt-1">
                              {result.admin_notes}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {statusInfo.status === "completed" &&
                      result &&
                      result.verification_status === "approved" && (
                        <Link
                          href={`/profile/result/${session.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <EyeIcon className="w-4 h-4" />
                          Lihat Detail
                        </Link>
                      )}
                    {statusInfo.status === "completed" &&
                      result &&
                      result.verification_status === "pending" && (
                        <button
                          disabled
                          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg cursor-not-allowed text-sm font-medium"
                        >
                          <ClockIcon className="w-4 h-4" />
                          Menunggu Verifikasi
                        </button>
                      )}
                    {statusInfo.status === "completed" &&
                      result &&
                      result.verification_status === "rejected" && (
                        <button
                          disabled
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg cursor-not-allowed text-sm font-medium"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Ditolak
                        </button>
                      )}
                    {statusInfo.status === "active" && (
                      <Link
                        href={`/essay-grader?session=${session.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <ClockIcon className="w-4 h-4" />
                        Lanjutkan
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setSessionToDelete(session.id);
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Show All Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Link
            href="/profile/assessments"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <ChartBarIcon className="w-5 h-5" />
            Lihat Semua Riwayat ({totalSessions})
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Hapus Session
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Konfirmasi penghapusan
                  </p>
                </div>
              </div>

              <p className="text-neutral-700 mb-6">
                Apakah Anda yakin ingin menghapus session ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSessionToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteSession}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menghapus...
                    </div>
                  ) : (
                    "Hapus"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
