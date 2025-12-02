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
  status: "completed" | "not_completed";
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
        } else {
          // Not completed - no result yet (can be continued)
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
  const notCompletedAssessments = assessments.filter(
    (a) => a.status === "not_completed"
  );

  // Helper function to format readiness level
  const formatReadinessLevel = (level?: string) => {
    if (!level) return "N/A";
    switch (level.toLowerCase()) {
      case "ready":
        return "Siap";
      case "not_ready":
        return "Belum Siap";
      case "needs_improvement":
        return "Perlu Peningkatan";
      default:
        return level;
    }
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
          {/* Not Completed Section */}
          {notCompletedAssessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-red-500">✗</span>
                <span>Not Completed ({notCompletedAssessments.length})</span>
              </h2>

              <div className="space-y-3">
                {notCompletedAssessments.map((assessment, index) => (
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
                        className="p-4 bg-gradient-to-r from-red-50 to-red-50 border border-red-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
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
                            <p className="text-xs text-red-500 mt-1">
                              {assessment.question_count || 0} pertanyaan
                              dijawab
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-red-600 font-medium">
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
                            <p className="text-sm text-green-700 font-medium">
                              {formatReadinessLevel(assessment.readiness_level)}
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
