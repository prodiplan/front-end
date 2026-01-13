"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  AcademicCapIcon,
  SparklesIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { MAJORS } from "@/data/schoolsAndMajors";
import Link from "next/link";
import {
  useGradingSessions,
  useGradingResults,
} from "@/hooks/useGradingSession";

interface Assessment {
  id: string;
  session_id: string;
  target_major: string;
  status: "completed" | "in_progress" | "not_completed";
  final_score?: number;
  readiness_level?: string;
  created_at: string;
  completed_at?: string;
  question_count?: number;
  max_questions?: number;
}

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  birth_date: string;
  school_origin: string;
  dream_major: string;
  phone_number?: string;
  avatar_url?: string;
}

export default function ProfilePage() {
  const { user, isLoading, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { data: sessionsData, isLoading: isSessionsLoading } =
    useGradingSessions({ limit: 20 });

  const { data: resultsData, isLoading: isResultsLoading } = useGradingResults({
    limit: 100,
  });

  // Get set of session IDs that have results (completed/analyzed)
  const completedSessionIds = new Set(
    resultsData?.results?.map((r) => r.session_id) || []
  );

  const assessments: Assessment[] =
    sessionsData?.sessions
      .map((session) => {
        // Check if this session has a result (analyzed by AI)
        const hasResult = completedSessionIds.has(session.id);
        const result = resultsData?.results?.find(
          (r) => r.session_id === session.id
        );

        // Check if session has expired (client-side check)
        const isExpired = session.expires_at && new Date(session.expires_at) < new Date();

        if (hasResult && result) {
          // Completed - has been analyzed by AI
          return {
            id: session.id,
            session_id: session.id,
            target_major: session.target_major,
            status: "completed" as const,
            final_score: result.final_score,
            readiness_level: result.readiness_level,
            created_at: session.created_at,
            completed_at: result.created_at,
            question_count: session.question_count,
            max_questions: session.max_questions,
          };
        } else if (session.status === "active" && !isExpired) {
          // In Progress - session is still active and has not expired
          return {
            id: session.id,
            session_id: session.id,
            target_major: session.target_major,
            status: "in_progress" as const,
            final_score: session.current_score,
            readiness_level: "Sedang Berlangsung",
            created_at: session.created_at,
            completed_at: undefined,
            question_count: session.question_count,
            max_questions: session.max_questions,
          };
        } else if (session.status === "expired" || session.status === "completed" || isExpired) {
          // Not completed - session expired (by status or time), or completed but no result available yet
          return {
            id: session.id,
            session_id: session.id,
            target_major: session.target_major,
            status: "not_completed" as const,
            final_score: session.current_score,
            readiness_level: "Tidak Selesai",
            created_at: session.created_at,
            completed_at: undefined,
            question_count: session.question_count,
            max_questions: session.max_questions,
          };
        } else {
          // Fallback for any other status
          return {
            id: session.id,
            session_id: session.id,
            target_major: session.target_major,
            status: "not_completed" as const,
            final_score: session.current_score,
            readiness_level: "Tidak Selesai",
            created_at: session.created_at,
            completed_at: undefined,
            question_count: session.question_count,
            max_questions: session.max_questions,
          };
        }
      })
      .filter((a) => a !== null) as Assessment[] || [];

  const [formData, setFormData] = useState<ProfileData>({
    id: "",
    email: "",
    full_name: "",
    birth_date: "",
    school_origin: "",
    dream_major: "",
    phone_number: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    } else if (user) {
      // Always sync formData with user whenever user changes
      // This includes both initial load and after profile updates
      console.log("=== useEffect: Syncing formData with user ===");
      console.log("User data:", user);

      setFormData({
        id: user.id || "",
        email: user.email || "",
        full_name: user.full_name || "",
        birth_date: user.birth_date || "",
        school_origin: user.school_origin || "",
        dream_major: user.dream_major || "",
        phone_number: user.phone_number || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4"
          >
            <SparklesIcon className="w-8 h-8 text-primary-600" />
          </motion.div>
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare update data - only send fields that can be updated
      const updateData = {
        full_name: formData.full_name,
        dream_major: formData.dream_major,
      };

      console.log("=== Profile Save Debug ===");
      console.log("Saving profile with data:", updateData);
      console.log("Current user before update:", user);

      await updateProfile(updateData);

      console.log("After updateProfile call, user:", user);

      // After successful update, useEffect will automatically sync formData
      // from updated user context
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: user.id || "",
      email: user.email || "",
      full_name: user.full_name || "",
      birth_date: user.birth_date || "",
      school_origin: user.school_origin || "",
      dream_major: user.dream_major || "",
      phone_number: user.phone_number || "",
      avatar_url: user.avatar_url || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="border-b border-neutral-200 bg-white bg-opacity-50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 group w-fit"
          >
            <ArrowLeftIcon className="w-4 h-4 text-neutral-600 group-hover:text-primary-600 transition-colors" />
            <span className="text-neutral-600 group-hover:text-primary-600 transition-colors font-medium text-xs sm:text-sm">
              Kembali
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 space-y-6 h-fit lg:sticky lg:top-20"
          >
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Header Banner */}
              <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-600" />

              {/* Profile Content */}
              <div className="px-6 pb-6">
                {/* Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="-mt-12 mb-4"
                >
                  <div className="w-24 h-24 bg-primary-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center mx-auto">
                    <UserIcon className="w-12 h-12 text-primary-600" />
                  </div>
                </motion.div>

                {/* Name and Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center mb-6"
                >
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {formData.full_name || "User"}
                  </h1>
                  <p className="text-sm text-gray-600 mb-4">
                    {formData.dream_major || "Belum memilih jurusan"}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                    <span>📍</span>
                    <span>
                      {formData.school_origin || "Toronto, Ontario, Canada"}
                    </span>
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="flex-1 btn btn-primary text-sm py-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Stats Card - Assessment Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Assessment Summary
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Completed */}
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-700 uppercase">
                      Completed
                    </span>
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    {assessments.filter((a) => a.status === "completed").length}
                  </p>
                </div>

                {/* In Progress */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-700 uppercase">
                      In Progress
                    </span>
                    <ClockIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold text-blue-700">
                    {
                      assessments.filter((a) => a.status === "in_progress")
                        .length
                    }
                  </p>
                </div>

                {/* Not Completed */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700 uppercase">
                      Not Done
                    </span>
                    <ExclamationTriangleIcon className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-600">
                    {
                      assessments.filter((a) => a.status === "not_completed")
                        .length
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Sidebar - Assessment History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {!isEditing ? (
              <div
                className={`bg-white rounded-2xl shadow-md p-6 flex flex-col ${assessments.length === 0 ? "min-h-[520px]" : ""
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5 text-primary-600" />
                    <span>Assessment History</span>
                  </h2>
                </div>

                <div
                  className={`space-y-2 mb-4 flex flex-col ${assessments.length === 0
                    ? "flex-1 items-center justify-center"
                    : ""
                    }`}
                >
                  {assessments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <ChartBarIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium text-center mb-2">
                        Belum Ada Assessment
                      </p>
                      <p className="text-sm text-gray-500 text-center">
                        Mulai assessment sekarang untuk mengetahui kesiapan Anda
                        dan menemukan jurusan impian!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 w-full">
                      {assessments.slice(0, 5).map((assessment) => (
                        <div key={assessment.id}>
                          {assessment.status === "completed" ? (
                            <Link href={`/profile/result/${assessment.id}`}>
                              <motion.div
                                whileHover={{ x: 4 }}
                                className="p-4 bg-green-50 border border-green-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                      {assessment.target_major}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(
                                        assessment.created_at
                                      ).toLocaleDateString("id-ID")}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">
                                      {assessment.final_score}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Score
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-green-100">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <p className="text-xs font-medium text-green-700">
                                      Completed
                                    </p>
                                  </div>
                                  <p className="text-xs text-green-600 font-medium">
                                    View Details →
                                  </p>
                                </div>
                              </motion.div>
                            </Link>
                          ) : assessment.status === "in_progress" ? (
                            <Link
                              href={`/essay-grader?session=${assessment.session_id}`}
                            >
                              <motion.div
                                whileHover={{ x: 4 }}
                                className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                      {assessment.target_major}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(
                                        assessment.created_at
                                      ).toLocaleDateString("id-ID")}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                    <p className="text-xs text-blue-600 font-medium">
                                      Lanjutkan →
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          ) : (
                            <motion.div className="p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-600">
                                    {assessment.target_major}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(
                                      assessment.created_at
                                    ).toLocaleDateString("id-ID")}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-400 text-xs">
                                    ✗
                                  </span>
                                  <p className="text-xs text-gray-500 font-medium">
                                    Tidak Selesai
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {assessments.length >= 1 && (
                    <Link href="/profile/assessments">
                      <button className="w-full py-2 text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors border-t border-gray-200 pt-3">
                        Show All ({assessments.length})
                      </button>
                    </Link>
                  )}

                  <Link
                    href="/essay-grader"
                    className="btn btn-primary btn-sm w-full"
                  >
                    Start New Assessment
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Edit Data Diri
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email tidak bisa diubah
                    </p>
                  </div>

                  {/* Birth Date */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={formData.birth_date}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tanggal lahir tidak bisa diubah (ditetapkan saat
                      registrasi)
                    </p>
                  </div>

                  {/* School Origin - Read Only */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asal Sekolah
                    </label>
                    <input
                      type="text"
                      value={formData.school_origin}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Asal sekolah tidak bisa diubah (ditetapkan saat
                      registrasi)
                    </p>
                  </div>

                  {/* Dream Major - Editable with Dropdown */}
                  <div className="md:col-span-2">
                    <SearchableSelect
                      id="dream_major"
                      name="dream_major"
                      value={formData.dream_major}
                      onChange={(name, value) =>
                        setFormData({ ...formData, dream_major: value })
                      }
                      options={MAJORS}
                      label="Jurusan Pilihan"
                      placeholder="Pilih atau ketik nama jurusan..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Anda dapat mengubah jurusan pilihan kapan saja
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 btn btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <CheckIcon className="w-5 h-5" />
                    <span>
                      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="flex-1 btn btn-secondary py-3 flex items-center justify-center space-x-2"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    <span>Batal</span>
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

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
