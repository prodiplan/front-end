"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  SparklesIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
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

export default function AssessmentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Fetch user's grading sessions (for active/analyzing sessions)
  const { data: sessionsData, isLoading: isLoadingSessions } =
    useGradingSessions({ limit: 100 });

  // Fetch user's grading results (for completed sessions with results)
  const { data: resultsData, isLoading: isLoadingResults } = useGradingResults({
    limit: 100,
  });

  // Combine sessions and results into assessments
  const assessments = useMemo<Assessment[]>(() => {
    const assessmentMap = new Map<string, Assessment>();

    // Get set of session IDs that have results (completed/analyzed)
    const completedSessionIds = new Set(
      resultsData?.results?.map((r) => r.session_id) || []
    );

    // Add sessions
    if (sessionsData?.sessions) {
      sessionsData.sessions.forEach((session) => {
        const hasResult = completedSessionIds.has(session.id);
        const result = resultsData?.results?.find(
          (r) => r.session_id === session.id
        );

        if (hasResult && result) {
          // Completed - has been analyzed by AI
          assessmentMap.set(session.id, {
            id: session.id,
            session_id: session.id,
            target_major: session.target_major,
            status: "completed",
            final_score: result.final_score,
            readiness_level: result.readiness_level,
            created_at: session.created_at,
            completed_at: result.created_at,
            question_count: session.question_count,
            max_questions: session.max_questions,
          });
        } else if (session.status === "active") {
          // In Progress - session is still active and can be continued
          assessmentMap.set(session.id, {
            id: session.id,
            session_id: session.id,
            target_major: session.target_major,
            status: "in_progress",
            created_at: session.created_at,
            completed_at: undefined,
            question_count: session.question_count,
            max_questions: session.max_questions,
          });
        } else {
          // Not completed - session expired or cannot be continued
          assessmentMap.set(session.id, {
            id: session.id,
            session_id: session.id,
            target_major: session.target_major,
            status: "not_completed",
            created_at: session.created_at,
            completed_at: undefined,
            question_count: session.question_count,
            max_questions: session.max_questions,
          });
        }
      });
    }

    // Add results that don't have sessions (edge case)
    if (resultsData?.results) {
      resultsData.results.forEach((result) => {
        if (!assessmentMap.has(result.session_id)) {
          assessmentMap.set(result.session_id, {
            id: result.id,
            session_id: result.session_id,
            target_major: "Assessment",
            status: "completed",
            final_score: result.final_score,
            readiness_level: result.readiness_level,
            created_at: result.created_at,
            completed_at: result.created_at,
          });
        }
      });
    }

    // Convert to array and sort by created_at (newest first)
    return Array.from(assessmentMap.values()).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [sessionsData, resultsData]);

  const isDataLoading = isLoadingSessions || isLoadingResults;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading || isDataLoading) {
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
  const inProgressAssessments = assessments.filter(
    (a) => a.status === "in_progress"
  );
  const notCompletedAssessments = assessments.filter(
    (a) => a.status === "not_completed"
  );

  // Map score to category (based on score range, not backend readiness_level)
  const getScoreCategory = (score?: number) => {
    if (!score) return { label: "N/A", color: "text-gray-600" };
    if (score >= 90) return { label: "Sangat Siap", color: "text-green-700" };
    if (score >= 80) return { label: "Siap", color: "text-green-600" };
    if (score >= 70) return { label: "Cukup Siap", color: "text-blue-600" };
    if (score >= 60) return { label: "Perlu Persiapan", color: "text-yellow-600" };
    return { label: "Belum Siap", color: "text-red-600" };
  };

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
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="relative">
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
              </div>
              <span className="text-gray-900 text-lg sm:text-xl font-bold">
                ProdiPlan
              </span>
            </Link>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-sm text-gray-600 mb-2">Total</p>
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
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-sm text-gray-600 mb-2">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">
              {inProgressAssessments.length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-sm text-gray-600 mb-2">Average Score</p>
            <p className="text-3xl font-bold text-primary-600">{avgScore}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-sm text-gray-600 mb-2">Highest Score</p>
            <p className="text-3xl font-bold text-primary-600">
              {highestScore}
            </p>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* In Progress Section */}
          {inProgressAssessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                <span>In Progress ({inProgressAssessments.length})</span>
              </h2>

              <div className="space-y-3">
                {inProgressAssessments.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link
                      href={`/essay-grader?session=${assessment.session_id}`}
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="p-4 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-lg font-semibold text-gray-900">
                              {assessment.target_major}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Started on{" "}
                              {new Date(
                                assessment.created_at
                              ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {assessment.question_count || 0}/
                              {assessment.max_questions || 10} pertanyaan
                              dijawab
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <p className="text-sm text-blue-600 font-medium">
                              Lanjutkan →
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

          {/* Not Completed Section */}
          {notCompletedAssessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-gray-400">✗</span>
                <span>Tidak Selesai ({notCompletedAssessments.length})</span>
              </h2>

              <div className="space-y-3">
                {notCompletedAssessments.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <motion.div className="p-4 bg-gradient-to-r from-gray-50 to-gray-50 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-lg font-semibold text-gray-600">
                            {assessment.target_major}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
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
                          <p className="text-xs text-gray-400 mt-1">
                            {assessment.question_count || 0} pertanyaan dijawab
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-500 font-medium">
                            Tidak Selesai
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

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
                    <Link href={`/profile/result/${assessment.session_id}`}>
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
                            <p className={`text-sm font-medium ${getScoreCategory(assessment.final_score).color}`}>
                              {getScoreCategory(assessment.final_score).label}
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
