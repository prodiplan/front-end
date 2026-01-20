"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  PhoneIcon,
  AcademicCapIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import { authService } from "@/lib/services/auth";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { MAJORS } from "@/data/schoolsAndMajors";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProfileSettingsProps {
  onUpdate?: () => void;
  onLogout?: () => void;
}

export default function ProfileSettings({
  onUpdate,
  onLogout,
}: ProfileSettingsProps) {
  const { user, updateProfile, token } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
    dream_major: user?.dream_major || "",
    avatar_url: user?.avatar_url || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      toast.success("Profil berhasil diperbarui!");
      setIsEditing(false);
      onUpdate?.();
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || "",
      dream_major: user?.dream_major || "",
      avatar_url: user?.avatar_url || "",
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Mohon masukkan password Anda");
      return;
    }

    if (!token) {
      toast.error("Sesi tidak valid");
      return;
    }

    setIsDeleting(true);
    try {
      await authService.deleteUser({ password: deletePassword }, token);
      toast.success("Akun berhasil dihapus");
      // Logout and redirect to home
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus akun");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            Informasi Profil
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <UserIcon className="w-4 h-4" />
              Edit Profil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                <XMarkIcon className="w-4 h-4" />
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Nama Lengkap
              </div>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nama lengkap Anda"
              />
            ) : (
              <p className="text-neutral-900 py-2">{user.full_name}</p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <p className="text-neutral-600 py-2 flex items-center gap-2">
              {user.email}
              {user.email_verified && (
                <CheckIcon className="w-4 h-4 text-green-500" />
              )}
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                Nomor Telepon
              </div>
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+62 812 3456 7890"
              />
            ) : (
              <p className="text-neutral-900 py-2">
                {user.phone_number || "-"}
              </p>
            )}
          </div>

          {/* Dream Major */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="w-4 h-4" />
                Jurusan Impian
              </div>
            </label>
            {isEditing ? (
              <SearchableSelect
                options={MAJORS}
                value={formData.dream_major}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, dream_major: value }))
                }
                placeholder="Pilih jurusan impian"
                className="w-full"
              />
            ) : (
              <p className="text-neutral-900 py-2">{user.dream_major}</p>
            )}
          </div>

          {/* Birth Date (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tanggal Lahir
            </label>
            <p className="text-neutral-900 py-2">
              {new Date(user.birth_date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* School Origin (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Asal Sekolah
            </label>
            <p className="text-neutral-900 py-2">{user.school_origin}</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Zona Bahaya</h3>
        <p className="text-sm text-red-700 mb-4">
          Tindakan berikut bersifat permanen dan tidak dapat dibatalkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          )}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <TrashIcon className="w-4 h-4" />
            Hapus Akun
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
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
                    Hapus Akun
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Konfirmasi penghapusan akun
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  Peringatan:
                </p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>Semua data Anda akan dihapus permanen</li>
                  <li>Riwayat assessment akan hilang</li>
                  <li>Akun tidak dapat dipulihkan kembali</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Masukkan password untuk konfirmasi
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Password Anda"
                  disabled={isDeleting}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || !deletePassword}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menghapus...
                    </div>
                  ) : (
                    "Hapus Akun"
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
