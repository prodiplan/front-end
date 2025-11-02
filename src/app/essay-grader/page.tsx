"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import SplitText from "@/components/ui/SplitText";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  placeholder: string;
  tips: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Mengapa Anda ingin mengambil jurusan ini?",
    placeholder:
      "Jelaskan motivasi dan alasan mendalam Anda memilih jurusan ini. Ceritakan bagaimana Anda tertarik dengan bidang ini...",
    tips: "Berikan jawaban yang spesifik dan personal. Hindari jawaban umum seperti 'karena prospek kerja bagus'.",
  },
  {
    id: 2,
    question:
      "Apa kekuatan dan kelemahan yang menurut Anda relevan dengan jurusan ini?",
    placeholder:
      "Deskripsikan kekuatan yang akan membantu kesuksesan Anda, serta kelemahan yang perlu dibenahi...",
    tips: "Berikan contoh konkret dari pengalaman atau prestasi Anda. Jangan hanya menyebutkan, tetapi jelaskan relevansinya.",
  },
  {
    id: 3,
    question: "Bagaimana Anda mempersiapkan diri untuk sukses di jurusan ini?",
    placeholder:
      "Jelaskan langkah-langkah konkret yang telah atau akan Anda lakukan untuk mempersiapkan diri...",
    tips: "Tunjukkan inisiatif dan komitmen. Sebutkan aktivitas, kursus, atau pengalaman yang relevan.",
  },
  {
    id: 4,
    question:
      "Apa ekspektasi Anda terhadap kehidupan sebagai mahasiswa jurusan ini?",
    placeholder:
      "Deskripsikan visi Anda tentang bagaimana hidup sebagai mahasiswa dan apa yang ingin Anda raih...",
    tips: "Tunjukkan pemahaman yang realistis tentang tantangan dan peluang di jurusan tersebut.",
  },
  {
    id: 5,
    question: "Rencana karir Anda setelah lulus dari jurusan ini?",
    placeholder:
      "Jelaskan arah karir yang Anda impikan dan bagaimana jurusan ini akan membantu mencapainya...",
    tips: "Berikan gambaran jangka panjang yang terukur. Tunjukkan pemikiran matang tentang masa depan Anda.",
  },
];

export default function EssayGraderPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<"intro" | "test" | "loading">(
    "intro"
  );
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  // Timer countdown
  useEffect(() => {
    if (currentStep !== "test") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    setCurrentStep("loading");

    // Simulate API call to submit test
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to confirmation page
      router.push("/essay-grader/confirmation");
    } catch (error) {
      console.error("Error submitting test:", error);
      setCurrentStep("test");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 animate-pulse">
            <SparklesIcon className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-neutral-600">Memuat essay grader...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {currentStep === "intro" && (
        <IntroScreen
          user={user}
          onStart={() => setCurrentStep("test")}
          onBack={() => router.push("/dashboard")}
        />
      )}

      {currentStep === "test" && (
        <TestScreen
          question={questions[currentQuestion - 1]}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          answer={answers[currentQuestion] || ""}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmitTest}
          timeLeft={timeLeft}
          formatTime={formatTime}
          isSubmitting={isSubmitting}
          answers={answers}
          questions={questions}
          onQuestionSelect={(qNum) => setCurrentQuestion(qNum)}
          showReview={showReview}
          onShowReview={setShowReview}
        />
      )}

      {currentStep === "loading" && <LoadingScreen />}
    </div>
  );
}

function IntroScreen({
  user,
  onStart,
  onBack,
}: {
  user: any;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors" />
              <span className="text-neutral-600 group-hover:text-primary-600 transition-colors font-medium">
                Kembali
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
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full"
        >
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {/* Gradient Header */}
            <div className="bg-primary-600 px-8 py-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <SplitText
                  text="Selamat datang di Essay Preparedness Grader"
                  className="text-3xl md:text-4xl font-bold text-white mb-3"
                  tag="h1"
                  delay={80}
                  duration={1.5}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 15 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-30px"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-white text-opacity-90 text-lg"
              >
                Analisis mendalam untuk menentukan kesiapan Anda menjalani
                jurusan pilihan
              </motion.p>
            </div>

            {/* Content */}
            <div className="px-8 py-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
                  Tentang Test Ini
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900">
                        5 Pertanyaan Essay
                      </p>
                      <p className="text-neutral-600 text-sm">
                        Jawab dengan jujur dan detail sesuai dengan pengalaman
                        pribadi Anda
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900">
                        Durasi ±10-15 Menit
                      </p>
                      <p className="text-neutral-600 text-sm">
                        Ada timer yang akan membantu Anda mengelola waktu dengan
                        baik
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900">
                        Analisis AI Mendalam
                      </p>
                      <p className="text-neutral-600 text-sm">
                        Sistem kami akan menganalisis esai Anda dengan teknologi
                        AI terdepan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900">
                        Hasil Komprehensif
                      </p>
                      <p className="text-neutral-600 text-sm">
                        Dapatkan laporan lengkap dengan rekomendasi dan insight
                        berharga
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8"
              >
                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center space-x-2">
                  <SparklesIcon className="w-5 h-5 text-primary-600" />
                  <span>Tips untuk Hasil Terbaik</span>
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>
                    ✓ Jawab dengan jujur dan autentik sesuai perasaan Anda
                  </li>
                  <li>✓ Berikan contoh konkret dari pengalaman pribadi</li>
                  <li>✓ Hindari jawaban umum atau generik</li>
                  <li>✓ Tunjukkan pemikiran matang dan refleksi diri</li>
                </ul>
              </motion.div>

              {/* User Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-neutral-100 rounded-lg p-4 mb-8"
              >
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Peserta:</span> {user.full_name}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Jurusan Pilihan:</span>{" "}
                  {user.dream_major || "Belum dipilih"}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onStart}
                  className="flex-1 btn btn-primary btn-lg px-6 py-3 flex items-center justify-center space-x-2"
                >
                  <span>Mulai Test Sekarang</span>
                  <SparklesIcon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="btn btn-secondary btn-lg px-6 py-3"
                >
                  Kembali
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TestScreen({
  question,
  currentQuestion,
  totalQuestions,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  onSubmit,
  timeLeft,
  formatTime,
  isSubmitting,
  answers,
  questions,
  onQuestionSelect,
  showReview,
  onShowReview,
}: {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  answer: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  isSubmitting: boolean;
  answers: { [key: number]: string };
  questions: Question[];
  onQuestionSelect: (qNum: number) => void;
  showReview: boolean;
  onShowReview: (show: boolean) => void;
}) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions;
  const isTimeRunningOut = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Timer */}
      <div className="border-b border-neutral-200 bg-white bg-opacity-50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">
                  {showReview
                    ? "Review Jawaban"
                    : `Pertanyaan ${currentQuestion} dari ${totalQuestions}`}
                </p>
                <p className="font-semibold text-neutral-900">
                  Essay Preparedness Grader
                </p>
              </div>
            </div>

            {/* Review Button and Timer */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onShowReview(!showReview)}
                className="btn btn-secondary text-sm py-2"
              >
                {showReview ? "Kembali" : "Review"}
              </motion.button>

              {/* Timer */}
              <motion.div
                animate={{
                  backgroundColor: isTimeRunningOut ? "#fee2e2" : "transparent",
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              >
                <ClockIcon
                  className={`w-5 h-5 ${
                    isTimeRunningOut ? "text-red-600" : "text-neutral-600"
                  }`}
                />
                <span
                  className={`font-mono font-semibold ${
                    isTimeRunningOut ? "text-red-600" : "text-neutral-900"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${showReview ? 100 : progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-primary-600"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!showReview && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Question Content */}
              <div className="lg:col-span-2">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Question Card */}
                  <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                    <div className="mb-6">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
                        <span>Pertanyaan {currentQuestion}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                        {question.question}
                      </h2>
                    </div>

                    {/* Tips Box */}
                    <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-neutral-700">
                        <span className="font-semibold text-secondary-800">
                          Tip:
                        </span>{" "}
                        {question.tips}
                      </p>
                    </div>

                    {/* Text Area */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-neutral-700 mb-3">
                        Jawaban Anda
                      </label>
                      <textarea
                        value={answer}
                        onChange={(e) => onAnswer(e.target.value)}
                        placeholder={question.placeholder}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none resize-none font-regular text-neutral-900 placeholder-neutral-500"
                        rows={8}
                      />
                      <p className="text-sm text-neutral-500 mt-2">
                        {answer.length} karakter
                      </p>
                    </div>

                    {/* Character count indicator */}
                    {answer.length < 100 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6"
                      >
                        <p className="text-sm text-yellow-800">
                          💡 Cobalah untuk menulis minimal 100 karakter untuk
                          jawaban yang lebih detail
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onPrevious}
                      disabled={currentQuestion === 1}
                      className="btn btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Sebelumnya
                    </motion.button>

                    {/* Question indicators */}
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalQuestions }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            backgroundColor:
                              i + 1 === currentQuestion
                                ? "#3b82f6"
                                : answer.length > 0 && i + 1 < currentQuestion
                                  ? "#10b981"
                                  : "#e5e7eb",
                          }}
                          className="w-3 h-3 rounded-full"
                        />
                      ))}
                    </div>

                    {isLastQuestion ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <span>
                          {isSubmitting ? "Mengirim..." : "Selesai & Analisis"}
                        </span>
                        <SparklesIcon className="w-5 h-5" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNext}
                        className="btn btn-primary px-6 py-3"
                      >
                        Selanjutnya →
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Navigation Sidebar */}
              <motion.div
                className="lg:col-span-1 h-fit sticky top-24 bg-white rounded-2xl shadow-md p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Navigasi Soal
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {questions.map((q) => (
                    <motion.button
                      key={q.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onQuestionSelect(q.id)}
                      className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                        q.id === currentQuestion
                          ? "bg-primary-600 text-white"
                          : answers[q.id] && answers[q.id].trim().length > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                      }`}
                    >
                      {q.id}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-2">
                    <span className="font-medium">
                      {
                        Object.entries(answers).filter(
                          ([, value]) => value && value.trim().length > 0
                        ).length
                      }
                      /{questions.length}
                    </span>{" "}
                    soal terjawab
                  </p>
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      animate={{
                        width: `${(Object.entries(answers).filter(([, value]) => value && value.trim().length > 0).length / questions.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-green-500"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {showReview && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {questions.map((q) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-md p-8"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
                          <span>Pertanyaan {q.id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">
                          {q.question}
                        </h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onShowReview(false);
                          onQuestionSelect(q.id);
                        }}
                        className="btn btn-secondary text-sm ml-4"
                      >
                        Edit
                      </motion.button>
                    </div>

                    {answers[q.id] ? (
                      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                        <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                          {answers[q.id]}
                        </p>
                        <p className="text-sm text-neutral-500 mt-4">
                          {answers[q.id].length} karakter
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                        <p className="text-yellow-800 font-medium">
                          ⚠️ Soal ini belum dijawab
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                {Object.entries(answers).filter(
                  ([, value]) => value && value.trim().length > 0
                ).length === questions.length ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>
                      {isSubmitting ? "Mengirim..." : "Selesai & Analisis"}
                    </span>
                    <SparklesIcon className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-yellow-50 rounded-lg p-4 border border-yellow-200"
                  >
                    <p className="text-yellow-800 font-medium">
                      ⚠️ Harap isi semua soal sebelum submit
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6"
        >
          <SparklesIcon className="w-8 h-8 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Menganalisis Esai Anda...
          </h2>
          <p className="text-neutral-600 max-w-md">
            Teknologi AI kami sedang menganalisis jawaban Anda dengan mendalam.
            Harap tunggu sebentar.
          </p>
        </motion.div>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [-6, 0, -6] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-primary-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
