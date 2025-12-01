"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  AcademicCapIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  full_name: string;
  birth_date: string;
  school_origin: string;
  dream_major: string;
  phone_number: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface GradingSession {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  target_major: string;
  status: "active" | "completed" | "expired";
  current_score: number;
  threshold_score: number;
  question_count: number;
  max_questions: number;
  session_duration_minutes: number;
  started_at: string;
  expires_at: string;
  last_activity_at?: string;
  created_at: string;
}

// Demo users data
const INITIAL_USERS: User[] = [
  {
    id: "user-001",
    email: "budi@example.com",
    full_name: "Budi Santoso",
    birth_date: "2006-05-20",
    school_origin: "SMAN 1 Jakarta",
    dream_major: "Teknik Informatika",
    phone_number: "+62812345678",
    email_verified: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "user-002",
    email: "siti@example.com",
    full_name: "Siti Nurhaliza",
    birth_date: "2005-08-10",
    school_origin: "SMAN 2 Bandung",
    dream_major: "Kedokteran",
    phone_number: "+62812345679",
    email_verified: true,
    created_at: "2024-01-16T09:15:00Z",
    updated_at: "2024-01-16T09:15:00Z",
  },
  {
    id: "user-003",
    email: "ahmad@example.com",
    full_name: "Ahmad Rizky",
    birth_date: "2006-03-25",
    school_origin: "SMAN 3 Surabaya",
    dream_major: "Hukum",
    phone_number: "+62812345680",
    email_verified: false,
    created_at: "2024-01-17T14:45:00Z",
    updated_at: "2024-01-17T14:45:00Z",
  },
  {
    id: "user-004",
    email: "dewi@example.com",
    full_name: "Dewi Lestari",
    birth_date: "2005-12-01",
    school_origin: "SMAN 4 Yogyakarta",
    dream_major: "Psikologi",
    phone_number: "+62812345681",
    email_verified: true,
    created_at: "2024-01-18T11:20:00Z",
    updated_at: "2024-01-18T11:20:00Z",
  },
  {
    id: "user-005",
    email: "raka@example.com",
    full_name: "Raka Pratama",
    birth_date: "2006-07-15",
    school_origin: "SMAN 5 Semarang",
    dream_major: "Teknik Sipil",
    phone_number: "+62812345682",
    email_verified: true,
    created_at: "2024-01-19T08:00:00Z",
    updated_at: "2024-01-19T08:00:00Z",
  },
];

// Demo sessions data
const INITIAL_SESSIONS: GradingSession[] = [
  {
    id: "session-001",
    user_id: "user-001",
    user_name: "Budi Santoso",
    user_email: "budi@example.com",
    target_major: "Teknik Informatika",
    status: "completed",
    current_score: 85,
    threshold_score: 70,
    question_count: 10,
    max_questions: 10,
    session_duration_minutes: 45,
    started_at: "2024-01-20T09:00:00Z",
    expires_at: "2024-01-20T10:00:00Z",
    last_activity_at: "2024-01-20T09:45:00Z",
    created_at: "2024-01-20T09:00:00Z",
  },
  {
    id: "session-002",
    user_id: "user-002",
    user_name: "Siti Nurhaliza",
    user_email: "siti@example.com",
    target_major: "Kedokteran",
    status: "completed",
    current_score: 92,
    threshold_score: 70,
    question_count: 10,
    max_questions: 10,
    session_duration_minutes: 38,
    started_at: "2024-01-21T14:00:00Z",
    expires_at: "2024-01-21T15:00:00Z",
    last_activity_at: "2024-01-21T14:38:00Z",
    created_at: "2024-01-21T14:00:00Z",
  },
  {
    id: "session-003",
    user_id: "user-003",
    user_name: "Ahmad Rizky",
    user_email: "ahmad@example.com",
    target_major: "Hukum",
    status: "active",
    current_score: 45,
    threshold_score: 70,
    question_count: 5,
    max_questions: 10,
    session_duration_minutes: 20,
    started_at: "2024-01-22T10:00:00Z",
    expires_at: "2024-01-22T11:00:00Z",
    last_activity_at: "2024-01-22T10:20:00Z",
    created_at: "2024-01-22T10:00:00Z",
  },
  {
    id: "session-004",
    user_id: "user-004",
    user_name: "Dewi Lestari",
    user_email: "dewi@example.com",
    target_major: "Psikologi",
    status: "expired",
    current_score: 30,
    threshold_score: 70,
    question_count: 3,
    max_questions: 10,
    session_duration_minutes: 60,
    started_at: "2024-01-18T08:00:00Z",
    expires_at: "2024-01-18T09:00:00Z",
    last_activity_at: "2024-01-18T08:15:00Z",
    created_at: "2024-01-18T08:00:00Z",
  },
  {
    id: "session-005",
    user_id: "user-001",
    user_name: "Budi Santoso",
    user_email: "budi@example.com",
    target_major: "Sistem Informasi",
    status: "completed",
    current_score: 78,
    threshold_score: 70,
    question_count: 10,
    max_questions: 10,
    session_duration_minutes: 50,
    started_at: "2024-01-25T11:00:00Z",
    expires_at: "2024-01-25T12:00:00Z",
    last_activity_at: "2024-01-25T11:50:00Z",
    created_at: "2024-01-25T11:00:00Z",
  },
];

type ModalType = "create" | "edit" | "delete" | "view" | "viewSession" | null;
type TabType = "users" | "sessions";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [sessions] = useState<GradingSession[]>(INITIAL_SESSIONS);
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionSearchQuery, setSessionSearchQuery] = useState("");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSession, setSelectedSession] = useState<GradingSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    birth_date: "",
    school_origin: "",
    dream_major: "",
    phone_number: "",
  });

  useEffect(() => {
    const adminToken = Cookies.get("admin_token");
    if (!adminToken) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("admin_token");
    toast.success("Logout berhasil");
    router.push("/admin/login");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.school_origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSessions = sessions.filter(
    (session) =>
      session.user_name.toLowerCase().includes(sessionSearchQuery.toLowerCase()) ||
      session.user_email.toLowerCase().includes(sessionSearchQuery.toLowerCase()) ||
      session.target_major.toLowerCase().includes(sessionSearchQuery.toLowerCase())
  );

  const openModal = (type: ModalType, user?: User, session?: GradingSession) => {
    setModalType(type);
    if (user) {
      setSelectedUser(user);
      setFormData({
        email: user.email,
        full_name: user.full_name,
        birth_date: user.birth_date,
        school_origin: user.school_origin,
        dream_major: user.dream_major,
        phone_number: user.phone_number,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        email: "",
        full_name: "",
        birth_date: "",
        school_origin: "",
        dream_major: "",
        phone_number: "",
      });
    }
    if (session) {
      setSelectedSession(session);
    } else {
      setSelectedSession(null);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
    setSelectedSession(null);
    setFormData({
      email: "",
      full_name: "",
      birth_date: "",
      school_origin: "",
      dream_major: "",
      phone_number: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (
      !formData.email ||
      !formData.full_name ||
      !formData.birth_date ||
      !formData.school_origin ||
      !formData.dream_major ||
      !formData.phone_number
    ) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: `user-${Date.now()}`,
      ...formData,
      email_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    toast.success("User berhasil ditambahkan");
    closeModal();
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    if (
      !formData.email ||
      !formData.full_name ||
      !formData.birth_date ||
      !formData.school_origin ||
      !formData.dream_major ||
      !formData.phone_number
    ) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            ...formData,
            updated_at: new Date().toISOString(),
          }
        : user
    );

    setUsers(updatedUsers);
    toast.success("User berhasil diupdate");
    closeModal();
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    toast.success("User berhasil dihapus");
    closeModal();
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: GradingSession["status"]) => {
    switch (status) {
      case "completed":
        return "bg-secondary-100 text-secondary-700";
      case "active":
        return "bg-primary-100 text-primary-700";
      case "expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getStatusLabel = (status: GradingSession["status"]) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "active":
        return "Aktif";
      case "expired":
        return "Kadaluarsa";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-900">Admin Panel</h1>
                <p className="text-xs text-neutral-500">ProdiPlan Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Users</p>
                <p className="text-2xl font-bold text-neutral-900">{users.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Sessions</p>
                <p className="text-2xl font-bold text-neutral-900">{sessions.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Completed</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {sessions.filter((s) => s.status === "completed").length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Active</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {sessions.filter((s) => s.status === "active").length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === "users"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <UserGroupIcon className="w-5 h-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === "sessions"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            Sessions
          </button>
        </div>

        {/* User Management Section */}
        {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Section Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">User Management</h2>
                <p className="text-sm text-neutral-500">
                  Kelola semua pengguna ProdiPlan
                </p>
              </div>
              <button
                onClick={() => openModal("create")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <PlusIcon className="w-5 h-5" />
                Tambah User
              </button>
            </div>

            {/* Search */}
            <div className="mt-4 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari user berdasarkan nama, email, atau sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden md:table-cell">
                    Sekolah
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden lg:table-cell">
                    Jurusan Impian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-neutral-500">Tidak ada user ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                            {user.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">
                              {user.full_name}
                            </p>
                            <p className="text-sm text-neutral-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-neutral-700">{user.school_origin}</p>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-neutral-700">{user.dream_major}</p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.email_verified
                              ? "bg-secondary-100 text-secondary-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {user.email_verified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal("view", user)}
                            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <MagnifyingGlassIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal("edit", user)}
                            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal("delete", user)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        )}

        {/* Sessions Management Section */}
        {activeTab === "sessions" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Section Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Sessions Management</h2>
                <p className="text-sm text-neutral-500">
                  Lihat semua sesi grading pengguna
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="mt-4 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari session berdasarkan nama user, email, atau jurusan..."
                value={sessionSearchQuery}
                onChange={(e) => setSessionSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Sessions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden md:table-cell">
                    Jurusan Target
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden lg:table-cell">
                    Skor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden lg:table-cell">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-neutral-500">Tidak ada session ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session, index) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                            {session.user_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">
                              {session.user_name}
                            </p>
                            <p className="text-sm text-neutral-500">{session.user_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <AcademicCapIcon className="w-4 h-4 text-neutral-400" />
                          <p className="text-neutral-700">{session.target_major}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${
                            session.current_score >= session.threshold_score 
                              ? "text-secondary-600" 
                              : "text-amber-600"
                          }`}>
                            {session.current_score}
                          </span>
                          <span className="text-neutral-400 text-sm">/ 100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}
                        >
                          {getStatusLabel(session.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-neutral-700 text-sm">{formatDate(session.started_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal("viewSession", undefined, session)}
                            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <h3 className="text-lg font-bold text-neutral-900">
                  {modalType === "create" && "Tambah User Baru"}
                  {modalType === "edit" && "Edit User"}
                  {modalType === "delete" && "Hapus User"}
                  {modalType === "view" && "Detail User"}
                  {modalType === "viewSession" && "Detail Session"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Delete Confirmation */}
                {modalType === "delete" && selectedUser && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-neutral-900 mb-2">
                      Apakah Anda yakin ingin menghapus user ini?
                    </p>
                    <p className="text-neutral-500 text-sm mb-6">
                      {selectedUser.full_name} ({selectedUser.email})
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isLoading ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                )}

                {/* View User Detail */}
                {modalType === "view" && selectedUser && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
                        {selectedUser.full_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-neutral-900">
                          {selectedUser.full_name}
                        </h4>
                        <p className="text-neutral-500">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Tanggal Lahir</p>
                        <p className="text-neutral-900">{formatDate(selectedUser.birth_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">No. Telepon</p>
                        <p className="text-neutral-900">{selectedUser.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Sekolah</p>
                        <p className="text-neutral-900">{selectedUser.school_origin}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Jurusan Impian</p>
                        <p className="text-neutral-900">{selectedUser.dream_major}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedUser.email_verified
                              ? "bg-secondary-100 text-secondary-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {selectedUser.email_verified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Terdaftar</p>
                        <p className="text-neutral-900">{formatDate(selectedUser.created_at)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* View Session Detail */}
                {modalType === "viewSession" && selectedSession && (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold">
                        {selectedSession.user_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-neutral-900">
                          {selectedSession.user_name}
                        </h4>
                        <p className="text-neutral-500">{selectedSession.user_email}</p>
                      </div>
                    </div>

                    {/* Score Display */}
                    <div className="bg-neutral-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-500">Skor</span>
                        <span className={`text-2xl font-bold ${
                          selectedSession.current_score >= selectedSession.threshold_score 
                            ? "text-secondary-600" 
                            : "text-amber-600"
                        }`}>
                          {selectedSession.current_score}/100
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedSession.current_score >= selectedSession.threshold_score 
                              ? "bg-secondary-500" 
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${selectedSession.current_score}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Threshold: {selectedSession.threshold_score} | {selectedSession.current_score >= selectedSession.threshold_score ? "Lulus" : "Belum Lulus"}
                      </p>
                    </div>

                    {/* Session Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Jurusan Target</p>
                        <p className="text-neutral-900 font-medium">{selectedSession.target_major}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status)}`}>
                          {getStatusLabel(selectedSession.status)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Pertanyaan</p>
                        <p className="text-neutral-900">{selectedSession.question_count} / {selectedSession.max_questions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Durasi</p>
                        <p className="text-neutral-900">{selectedSession.session_duration_minutes} menit</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Mulai</p>
                        <p className="text-neutral-900">{formatDateTime(selectedSession.started_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Berakhir</p>
                        <p className="text-neutral-900">{formatDateTime(selectedSession.expires_at)}</p>
                      </div>
                      {selectedSession.last_activity_at && (
                        <div className="col-span-2">
                          <p className="text-xs text-neutral-500 mb-1">Aktivitas Terakhir</p>
                          <p className="text-neutral-900">{formatDateTime(selectedSession.last_activity_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Create/Edit Form */}
                {(modalType === "create" || modalType === "edit") && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Masukkan email"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Tanggal Lahir
                        </label>
                        <input
                          type="date"
                          name="birth_date"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          No. Telepon
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          placeholder="+62..."
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Asal Sekolah
                      </label>
                      <input
                        type="text"
                        name="school_origin"
                        value={formData.school_origin}
                        onChange={handleInputChange}
                        placeholder="Masukkan asal sekolah"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Jurusan Impian
                      </label>
                      <input
                        type="text"
                        name="dream_major"
                        value={formData.dream_major}
                        onChange={handleInputChange}
                        placeholder="Masukkan jurusan impian"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={closeModal}
                        className="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={modalType === "create" ? handleCreate : handleUpdate}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all disabled:opacity-50"
                      >
                        {isLoading
                          ? "Menyimpan..."
                          : modalType === "create"
                          ? "Tambah"
                          : "Simpan"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
