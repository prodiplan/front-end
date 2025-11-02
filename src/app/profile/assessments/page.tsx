"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  SparklesIcon,
  ArrowLeftIcon,
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
    status: "completed" as const,
    final_score: 85,
    readiness_level: "Siap",
    created_at: "2024-11-02T14:30:00Z",
    completed_at: "2024-11-02T16:00:00Z",
  },
  {
    id: "3",
    session_id: "session-3",
    target_major: "Engineering",
    status: "completed" as const,
    final_score: 92,
    readiness_level: "Sangat Siap",
    created_at: "2024-11-03T09:00:00Z",
    completed_at: "2024-11-03T10:45:00Z",
  },
  {
    id: "4",
    session_id: "session-4",
    target_major: "Medicine",
    status: "completed" as const,
    final_score: 88,
    readiness_level: "Siap",
    created_at: "2024-11-04T15:20:00Z",
    completed_at: "2024-11-04T17:10:00Z",
  },
  {
    id: "5",
    session_id: "session-5",
    target_major: "Psychology",
    status: "completed" as const,
    final_score: 81,
    readiness_level: "Siap",
    created_at: "2024-11-05T11:00:00Z",
    completed_at: "2024-11-05T12:30:00Z",
  },
  {
    id: "6",
    session_id: "session-6",
    target_major: "Law",
    status: "completed" as const,
    final_score: 79,
    readiness_level: "Siap",
    created_at: "2024-11-06T13:15:00Z",
    completed_at: "2024-11-06T14:45:00Z",
  },
  {
    id: "7",
    session_id: "session-7",
    target_major: "Economics",
    status: "completed" as const,
    final_score: 87,
    readiness_level: "Siap",
    created_at: "2024-11-07T10:30:00Z",
    completed_at: "2024-11-07T12:00:00Z",
  },
  {
    id: "8",
    session_id: "session-8",
    target_major: "Architecture",
    status: "completed" as const,
    final_score: 90,
    readiness_level: "Sangat Siap",
    created_at: "2024-11-08T14:00:00Z",
    completed_at: "2024-11-08T15:30:00Z",
  },
  {
    id: "9",
    session_id: "session-9",
    target_major: "Arts",
    status: "analyzing" as const,
    created_at: "2024-11-09T11:45:00Z",
  },
  {
    id: "10",
    session_id: "session-10",
    target_major: "Nursing",
    status: "analyzing" as const,
    created_at: "2024-11-10T16:20:00Z",
  },
];

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

export default function AssessmentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [assessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
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
          <p className="text-gray-600">Memuat assessment history...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedAssessments = assessments.filter(
    (a) => a.status === "completed"
  );
  const analyzingAssessments = assessments.filter(
    (a) => a.status === "analyzing"
  );

  const avgScore =
    completedAssessments.length > 0
      ? Math.round(
          completedAssessments.reduce(
            (sum, a) => sum + (a.final_score || 0),
            0
          ) / completedAssessments.length
        )
      : 0;

  const highestScore =
    completedAssessments.length > 0
      ? Math.max(...completedAssessments.map((a) => a.final_score || 0))
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile" className="flex items-center space-x-2 group">
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
              <span className="text-gray-600 group-hover:text-primary-600 transition-colors font-medium">
                Back to Profile
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="font-semibold text-gray-900">ProdiPlan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <ChartBarIcon className="w-8 h-8 text-primary-600" />
            <span>Assessment History</span>
          </h1>
          <p className="text-gray-600">
            Total {assessments.length} assessment
            {assessments.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-sm text-gray-600 mb-2">Total Assessment</p>
            <p className="text-3xl font-bold text-primary-600">
              {assessments.length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-sm text-gray-600 mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {completedAssessments.length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-sm text-gray-600 mb-2">Average Score</p>
            <p className="text-3xl font-bold text-blue-600">{avgScore}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-sm text-gray-600 mb-2">Highest Score</p>
            <p className="text-3xl font-bold text-primary-600">
              {highestScore}
            </p>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Completed Section */}
          {completedAssessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Completed ({completedAssessments.length})</span>
              </h2>

              <div className="space-y-3">
                {completedAssessments.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/profile/result/${assessment.id}`}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="p-4 bg-gradient-to-r from-green-50 to-green-50 border border-green-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-lg font-semibold text-gray-900">
                              {assessment.target_major}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Completed on{" "}
                              {new Date(
                                assessment.completed_at!
                              ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">
                              {assessment.final_score}
                            </div>
                            <p className="text-sm text-green-700 font-medium">
                              {assessment.readiness_level}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analyzing Section */}
          {analyzingAssessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-primary-500 rounded-full"
                />
                <span>Analyzing ({analyzingAssessments.length})</span>
              </h2>

              <div className="space-y-3">
                {analyzingAssessments.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">
                          {assessment.target_major}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Started on{" "}
                          {new Date(assessment.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-3 h-3 bg-primary-500 rounded-full"
                        />
                        <p className="text-sm text-primary-600 font-medium">
                          Analyzing...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {assessments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-md p-12 text-center"
            >
              <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-2">
                No Assessments Yet
              </p>
              <p className="text-gray-600 mb-6">
                Start your first assessment to see your results here.
              </p>
              <Link
                href="/essay-grader"
                className="inline-block btn btn-primary"
              >
                Start Assessment
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
