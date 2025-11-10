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
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { ProdiPlanNavBar } from "@/components/ui/prodiplan-navbar";

interface Assessment {
  id: string;
  session_id: string;
  target_major: string;
  status: "completed" | "analyzing";
  final_score?: number;
  readiness_level?: string;
  created_at: string;
  completed_at?: string;
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

// Mock data for assessments
const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: "1",
    session_id: "session-1",
    target_major: "Computer Science",
    status: "completed" as const,
    final_score: 85,
    readiness_level: "Siap",
    created_at: "2024-11-10T10:00:00Z",
    completed_at: "2024-11-10T11:30:00Z",
  },
  {
    id: "2",
    session_id: "session-2",
    target_major: "Business Administration",
    status: "completed" as const,
    final_score: 78,
    readiness_level: "Siap",
    created_at: "2024-11-09T14:30:00Z",
    completed_at: "2024-11-09T16:00:00Z",
  },
  {
    id: "3",
    session_id: "session-3",
    target_major: "Engineering",
    status: "completed" as const,
    final_score: 92,
    readiness_level: "Sangat Siap",
    created_at: "2024-11-08T09:00:00Z",
    completed_at: "2024-11-08T10:45:00Z",
  },
  {
    id: "4",
    session_id: "session-4",
    target_major: "Medicine",
    status: "completed" as const,
    final_score: 88,
    readiness_level: "Siap",
    created_at: "2024-11-07T15:20:00Z",
    completed_at: "2024-11-07T17:10:00Z",
  },
  {
    id: "5",
    session_id: "session-5",
    target_major: "Psychology",
    status: "completed" as const,
    final_score: 81,
    readiness_level: "Siap",
    created_at: "2024-11-06T11:00:00Z",
    completed_at: "2024-11-06T12:30:00Z",
  },
  {
    id: "6",
    session_id: "session-6",
    target_major: "Law",
    status: "completed" as const,
    final_score: 79,
    readiness_level: "Siap",
    created_at: "2024-11-05T13:15:00Z",
    completed_at: "2024-11-05T14:45:00Z",
  },
  {
    id: "7",
    session_id: "session-7",
    target_major: "Economics",
    status: "completed" as const,
    final_score: 87,
    readiness_level: "Siap",
    created_at: "2024-11-04T10:30:00Z",
    completed_at: "2024-11-04T12:00:00Z",
  },
  {
    id: "8",
    session_id: "session-8",
    target_major: "Architecture",
    status: "completed" as const,
    final_score: 90,
    readiness_level: "Sangat Siap",
    created_at: "2024-11-03T14:00:00Z",
    completed_at: "2024-11-03T15:30:00Z",
  },
  {
    id: "9",
    session_id: "session-9",
    target_major: "Arts",
    status: "analyzing" as const,
    created_at: "2024-11-02T11:45:00Z",
  },
  {
    id: "10",
    session_id: "session-10",
    target_major: "Nursing",
    status: "analyzing" as const,
    created_at: "2024-11-01T16:20:00Z",
  },
];

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [assessments] = useState(MOCK_ASSESSMENTS);
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
      <ProdiPlanNavBar
        user={user}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />
      
      {/* Spacer untuk header yang fixed */}
      <div className="h-16" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 space-y-6 h-fit sticky top-20"
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
                  <button className="flex-1 btn btn-secondary text-sm py-2 flex items-center justify-center gap-1">
                    <span>Share</span>
                  </button>
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
              <div className="grid grid-cols-2 gap-4">
                {/* Completed */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-700 uppercase">
                      Completed
                    </span>
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    {assessments.filter((a) => a.status === "completed").length}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Assessments</p>
                </div>

                {/* Pending/Analyzing */}
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-yellow-700 uppercase">
                      Pending
                    </span>
                    <ClockIcon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-700">
                    {assessments.filter((a) => a.status === "analyzing").length}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Analyzing</p>
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
                className={`bg-white rounded-2xl shadow-md p-6 sticky top-20 flex flex-col ${
                  assessments.length === 0 ? "min-h-[520px]" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5 text-primary-600" />
                    <span>Assessment History</span>
                  </h2>
                </div>

                <div
                  className={`space-y-2 mb-4 flex flex-col ${
                    assessments.length === 0
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
                                className="p-4 bg-blue-50 border border-primary-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
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
                                    <p className="text-lg font-bold text-primary-600">
                                      {assessment.final_score}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Score
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-primary-100">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <p className="text-xs font-medium text-green-700">
                                      {assessment.readiness_level}
                                    </p>
                                  </div>
                                  <p className="text-xs text-primary-600 font-medium">
                                    View Details →
                                  </p>
                                </div>
                              </motion.div>
                            </Link>
                          ) : (
                            <motion.div
                              whileHover={{ x: 2 }}
                              className="p-3 bg-blue-50 border border-primary-200 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900">
                                  {assessment.target_major}
                                </p>
                                <div className="flex items-center space-x-1">
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                    }}
                                    className="w-1.5 h-1.5 bg-primary-500 rounded-full"
                                  />
                                  <p className="text-xs text-primary-600">
                                    Analyzing
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  assessment.created_at
                                ).toLocaleDateString("id-ID")}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {assessments.length > 5 && (
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

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone_number || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                      placeholder="+62..."
                    />
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) =>
                        setFormData({ ...formData, birth_date: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                    />
                  </div>

                  {/* School Origin */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asal Sekolah
                    </label>
                    <input
                      type="text"
                      value={formData.school_origin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school_origin: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                      placeholder="Nama sekolah Anda"
                    />
                  </div>

                  {/* Dream Major */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jurusan Pilihan
                    </label>
                    <input
                      type="text"
                      value={formData.dream_major}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dream_major: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                      placeholder="Misal: Computer Science"
                    />
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
