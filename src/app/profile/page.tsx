"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

// Mock data for assessments
const MOCK_ASSESSMENTS = [
  {
    id: "1",
    session_id: "session-1",
    target_major: "Computer Science",
    status: "completed" as const,
    final_score: 78,
    readiness_level: "Siap",
    created_at: "2024-11-01T10:00:00Z",
    completed_at: "2024-11-01T11:30:00Z",
  },
  {
    id: "2",
    session_id: "session-2",
    target_major: "Business Administration",
    status: "analyzing" as const,
    created_at: "2024-11-15T14:30:00Z",
  },
];

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
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4"
          >
            <SparklesIcon className="w-8 h-8 text-primary-600" />
          </motion.div>
          <p className="text-neutral-600">Memuat profil...</p>
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

  const completedAssessments = assessments.filter(
    (a) => a.status === "completed"
  );
  const pendingAssessments = assessments.filter(
    (a) => a.status !== "completed"
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 group"
            >
              <span className="text-neutral-600 group-hover:text-primary-600 transition-colors font-medium">
                Dashboard
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Assessment List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                <ChartBarIcon className="w-5 h-5 text-primary-600" />
                <span>Assessment</span>
              </h3>

              <div className="space-y-2">
                {/* Completed */}
                {completedAssessments.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-neutral-500 uppercase px-2 mt-4 mb-2">
                      Selesai
                    </p>
                    {completedAssessments.map((assessment) => (
                      <Link
                        key={assessment.id}
                        href={`/profile/result/${assessment.id}`}
                      >
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="p-3 bg-green-50 border border-green-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                        >
                          <p className="text-sm font-semibold text-neutral-900">
                            {assessment.target_major}
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Skor: {assessment.final_score}
                          </p>
                        </motion.div>
                      </Link>
                    ))}
                  </>
                )}

                {/* Pending */}
                {pendingAssessments.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-neutral-500 uppercase px-2 mt-4 mb-2">
                      Menunggu
                    </p>
                    {pendingAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <p className="text-sm font-semibold text-neutral-900">
                          {assessment.target_major}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-yellow-500 rounded-full"
                          />
                          <p className="text-xs text-yellow-700">
                            Sedang dianalisis
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {assessments.length === 0 && (
                  <p className="text-sm text-neutral-500 text-center py-4">
                    Belum ada assessment
                  </p>
                )}
              </div>

              <Link
                href="/essay-grader"
                className="btn btn-primary btn-sm w-full mt-6"
              >
                Mulai Assessment Baru
              </Link>
            </div>
          </motion.div>

          {/* Main Content - Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
              {/* Solid Blue Header */}
              <div className="h-32 bg-primary-600" />

              {/* Profile Content */}
              <div className="px-6 sm:px-8 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-6">
                  {/* Avatar */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-primary-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <UserIcon className="w-12 h-12 sm:w-14 sm:h-14 text-primary-600" />
                    </div>
                  </motion.div>

                  {/* User Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex-1 pb-2"
                  >
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                      {user.full_name}
                    </h1>
                    <p className="text-neutral-600 flex items-center space-x-2 mt-0">
                      <AcademicCapIcon className="w-4 h-4" />
                      <span>{user.dream_major || "Belum memilih jurusan"}</span>
                    </p>
                  </motion.div>

                  {/* Edit Button */}
                  {!isEditing && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="btn btn-secondary px-4 py-2 flex items-center space-x-2 self-start sm:self-auto"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit Profil</span>
                    </motion.button>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <p className="text-sm text-neutral-600 mb-1">Assessment</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {assessments.length}
                    </p>
                  </div>
                  <div className="p-4 bg-primary-100 rounded-lg border border-primary-300">
                    <p className="text-sm text-neutral-600 mb-1">Selesai</p>
                    <p className="text-2xl font-bold text-primary-700">
                      {completedAssessments.length}
                    </p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <p className="text-sm text-neutral-600 mb-1">Menunggu</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {pendingAssessments.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form or Display */}
            {isEditing ? (
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Edit Data Diri
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-neutral-900"
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Email tidak bisa diubah
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
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
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-neutral-900"
                      placeholder="+62..."
                    />
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) =>
                        setFormData({ ...formData, birth_date: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-neutral-900"
                    />
                  </div>

                  {/* School Origin */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
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
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-neutral-900"
                      placeholder="Nama sekolah Anda"
                    />
                  </div>

                  {/* Dream Major */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
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
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-neutral-900"
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Info Cards */}
                {[
                  {
                    icon: UserIcon,
                    label: "Nama Lengkap",
                    value: formData.full_name,
                  },
                  { icon: EnvelopeIcon, label: "Email", value: formData.email },
                  {
                    icon: CalendarIcon,
                    label: "Tanggal Lahir",
                    value: formData.birth_date
                      ? new Date(formData.birth_date).toLocaleDateString(
                          "id-ID"
                        )
                      : "-",
                  },
                  {
                    icon: AcademicCapIcon,
                    label: "Jurusan Pilihan",
                    value: formData.dream_major || "-",
                  },
                  {
                    icon: UserIcon,
                    label: "Asal Sekolah",
                    value: formData.school_origin || "-",
                  },
                  {
                    icon: UserIcon,
                    label: "Nomor Telepon",
                    value: formData.phone_number || "-",
                  },
                ].map((field, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 sm:p-6 border border-neutral-200 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <field.icon className="w-4 h-4 text-primary-600" />
                      <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                        {field.label}
                      </p>
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-neutral-900">
                      {field.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
