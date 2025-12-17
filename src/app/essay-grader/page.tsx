"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { MAJORS } from "@/data/schoolsAndMajors";
import { useAuth, User } from "@/components/providers/auth-provider";
import SplitText from "@/components/ui/SplitText";
import Link from "next/link";
import {
  useCreateSession,
  useCompleteSession,
  useSendMessage,
  useGradingSessions,
} from "@/hooks/useGradingSession";
import { gradingService } from "@/lib/services/grading";
import {
  createSocketConnection,
  joinSession,
  onSessionCompleted,
  onGradingResult,
  onQuestion,
  onError,
  disconnectSocket,

} from "@/lib/websocket";
import { Socket } from "socket.io-client";
import { GradingSession } from "@/types";

interface Question {
  id: string;
  question: string;
  placeholder: string;
  tips: string;
}

function EssayGraderContent() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeSessionId = searchParams.get("session");

  const [currentStep, setCurrentStep] = useState<"intro" | "test" | "loading">(
    "intro"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [isWaitingForQuestion, setIsWaitingForQuestion] = useState(false);
  const [activeSession, setActiveSession] = useState<GradingSession | null>(
    null
  );
  const [showActiveSessionPopup, setShowActiveSessionPopup] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<string>(
    user?.dream_major || ""
  );
  const [showFunFactAnimation, setShowFunFactAnimation] = useState(false);

  const createSessionMutation = useCreateSession();
  const completeSessionMutation = useCompleteSession();
  const sendMessageMutation = useSendMessage();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const questionsRef = useRef<Question[]>([]);
  const answersRef = useRef<{ [key: string]: string }>({});
  const currentQuestionIndexRef = useRef<number>(0);
  const isCreatingSession = useRef(false); // Guard against double creation

  // Fetch user's sessions to check for active sessions
  const { data: sessionsData } = useGradingSessions({
    status: "active",
    limit: 10,
  });

  // Check for active session on mount
  useEffect(() => {
    if (sessionsData?.sessions && sessionsData.sessions.length > 0) {
      // Find first active session that hasn't expired
      const activeSessionFound = sessionsData.sessions.find((session) => {
        const isExpired = new Date(session.expires_at) < new Date();
        return session.status === "active" && !isExpired;
      });

      if (activeSessionFound) {
        setActiveSession(activeSessionFound);
      }
    }
  }, [sessionsData]);

  // Initialize selectedMajor with user's dream_major when user loads
  useEffect(() => {
    if (user?.dream_major && !selectedMajor) {
      setSelectedMajor(user.dream_major);
    }
  }, [user?.dream_major]);

  // Handle resume session from URL parameter
  useEffect(() => {
    if (resumeSessionId && token && !sessionId) {
      console.log("📥 Resuming session from URL:", resumeSessionId);
      handleResumeSession(resumeSessionId);
    }
  }, [resumeSessionId, token]);

  // Keep questionsRef in sync with questions state
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // Keep answersRef in sync with answers state
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Keep currentQuestionIndexRef in sync
  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  // WebSocket setup
  useEffect(() => {
    if (sessionId && token && !socketRef.current) {
      console.log("🔌 Initializing WebSocket connection...");
      const socket = createSocketConnection(token);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ WebSocket connected");
        setSocketConnected(true);
        console.log("📤 Emitting join_session for sessionId:", sessionId);
        joinSession(socket, sessionId);
      });

      socket.on("disconnect", () => {
        console.log("❌ WebSocket disconnected");
        setSocketConnected(false);
      });

      // Debug: Listen to all events
      socket.onAny((eventName, ...args) => {
        console.log(`📡 WebSocket event received: "${eventName}"`, args);
      });

      // Handle session joined confirmation
      socket.on("session_joined", async (data) => {
        console.log("✅ Session joined successfully:", data);

        // If no question loaded yet, try to fetch from API as fallback
        if (questionsRef.current.length === 0 && token) {
          console.log("⏳ No questions loaded yet, fetching from API...");
          try {
            const result = await gradingService.getMessages(
              sessionId,
              { limit: 50 },
              token
            );

            console.log("📥 Fetched messages from API:", result);

            // Find questions from the messages
            const questionMessages =
              result.data?.messages?.filter(
                (m) => m.message_type === "question"
              ) || [];

            if (questionMessages.length > 0) {
              console.log("📝 Found questions in messages:", questionMessages);
              const mappedQuestions = questionMessages.map((q) => ({
                id: q.id,
                question: q.content,
                placeholder: "Tuliskan jawaban Anda dengan detail...",
                tips: "Berikan jawaban yang jujur dan spesifik berdasarkan pengalaman pribadi Anda.",
              }));
              setQuestions(mappedQuestions);
              setCurrentQuestionIndex(0);
              setIsWaitingForQuestion(false);
            } else {
              console.log(
                "⚠️ No questions found in messages, waiting for WebSocket..."
              );
            }
          } catch (error) {
            console.error("❌ Failed to fetch messages:", error);
          }
        }
      });

      // Listen for grading results (New Flow)
      onGradingResult(socket, async (data: any) => {
        console.log("🤖 Grading result received:", data);

        // Normalize data keys (handle potential case variants)
        const score = data.score;
        const isComplete = data.isComplete || data.is_complete || data.session_completed;
        const nextQuestionContent = data.nextQuestion || data.next_question || data.question;

        // Update score
        if (score !== undefined) {
          setCurrentScore(score);
        }

        // Handle Completion
        if (isComplete) {
          console.log("🎉 Session completed via grading_result");
          setCurrentStep("loading");
          // Wait for backend to finish processing final result
          await new Promise((resolve) => setTimeout(resolve, 5000));
          router.push(`/profile/result/${sessionId}`);
          return;
        }

        // Handle Next Question
        if (nextQuestionContent) {
          console.log("📝 Next question received via grading_result:", nextQuestionContent);

          const newQuestionId = `manual-q-${Date.now()}`;

          setQuestions((prev) => {
            // Check if this question content already exists to avoid dupes
            // We check both ID (if available in some form) and Content
            const exists = prev.some(q => q.question === nextQuestionContent);
            if (exists) {
              console.log("⚠️ Question already exists, skipping addition.");
              return prev;
            }

            return [
              ...prev,
              {
                id: newQuestionId,
                question: nextQuestionContent,
                placeholder: "Tuliskan jawaban Anda dengan detail...",
                tips: "Berikan jawaban yang jujur dan spesifik berdasarkan pengalaman pribadi Anda.",
              },
            ];
          });

          // Note: State updates for index and loading are handled by the useEffect watching questions.length
        } else {
          console.log("⚠️ Grading result received but 'nextQuestion' is missing or empty.");
        }
      });

      // Listen for questions (Legacy/Alternative Flow)
      onQuestion(socket, (data) => {
        console.log("📝 Question received via 'question' event:", data);

        setQuestions((prev) => {
          // Check if already exists by ID OR Content (to avoid dupe with grading_result)
          if (prev.some(q => q.id === data.id || q.question === data.content)) {
            console.log("⚠️ Question already exists (via ID or content), skipping addition.");
            return prev;
          }

          return [
            ...prev,
            {
              id: data.id,
              question: data.content,
              placeholder: "Tuliskan jawaban Anda dengan detail...",
              tips: "Berikan jawaban yang jujur dan spesifik berdasarkan pengalaman pribadi Anda.",
            },
          ];
        });

        // Note: State updates for index and loading handled by useEffect
      });

      // Listen for session completion (Legacy support/Direct event)
      onSessionCompleted(socket, async (data) => {
        console.log("🎉 Session completed:", data);
        setCurrentStep("loading");
        // Wait for backend to finish processing final result
        await new Promise((resolve) => setTimeout(resolve, 3000));
        router.push(`/profile/result/${data.session_id}`);
      });

      // Listen for errors
      onError(socket, (data) => {
        console.error("❌ WebSocket error:", data);
        alert(`Error: ${data.message}`);
      });

      return () => {
        if (socketRef.current) {
          disconnectSocket(socketRef.current);
          socketRef.current = null;
        }
      };
    }
  }, [sessionId, token, router]);

  // Auto-advance to new question when it arrives
  const prevQuestionsLength = useRef(0);
  useEffect(() => {
    if (questions.length > prevQuestionsLength.current) {
      // Only jump if we were specifically waiting for a question
      // OR if it's the very first question arriving
      if (isWaitingForQuestion || prevQuestionsLength.current === 0) {
        console.log("📝 New question arrived, advancing index to:", questions.length - 1);
        setCurrentQuestionIndex(questions.length - 1);
        setIsWaitingForQuestion(false);
        setShowFunFactAnimation(false); // Hide fun fact animation
      }
    }
    prevQuestionsLength.current = questions.length;
  }, [questions, isWaitingForQuestion]);

  const handleAnswer = (value: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && currentQuestion.id) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }));
    }
  };

  const MIN_ANSWER_LENGTH = 100; // Minimum karakter untuk jawaban

  const handleNext = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion?.id] || "";

    if (!currentQuestion || !answer.trim()) {
      alert("Silakan isi jawaban terlebih dahulu");
      return;
    }

    if (answer.trim().length < MIN_ANSWER_LENGTH) {
      alert(
        `Jawaban minimal ${MIN_ANSWER_LENGTH} karakter. Saat ini: ${answer.trim().length} karakter`
      );
      return;
    }

    if (!sessionId || !token) {
      alert("Sesi tidak valid. Silakan mulai ulang.");
      return;
    }

    // Send answer via HTTP API
    // The next question will be received via WebSocket
    try {
      setIsWaitingForQuestion(true);
      setShowFunFactAnimation(true); // Show fun fact animation

      const response = await sendMessageMutation.mutateAsync({
        sessionId,
        data: {
          message_type: "answer",
          content: answer,
        },
      });

      console.log("✅ Answer sent successfully:", response);
      console.log("⏳ Waiting for next question via WebSocket...");

      // Update score if provided
      if (response.data.score !== undefined) {
        setCurrentScore((prev) => prev + response.data.score!);
      }

      // Check if session is completed (max_questions reached or threshold reached)
      if (response.data.session_completed) {
        console.log("🎉 Session completed automatically!");
        setShowFunFactAnimation(false);
        setCurrentStep("loading");
        // Wait for backend to finish processing final result
        await new Promise((resolve) => setTimeout(resolve, 3000));
        router.push(`/profile/result/${sessionId}`);
        return;
      }

      // Note: We now rely entirely on WebSocket for next question
      // No polling, just waiting for WebSocket events
    } catch (error) {
      console.error("❌ Error sending answer:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setIsWaitingForQuestion(false);
      setShowFunFactAnimation(false);
    }
  };

  // Simple timeout warning if WebSocket takes too long (15 seconds)
  // This doesn't poll the API, just logs a warning
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isWaitingForQuestion && sessionId) {
      console.log("⏳ Waiting for next question via WebSocket...");

      timeoutId = setTimeout(() => {
        console.warn(
          "⚠️ Question taking longer than expected. Check WebSocket connection or backend processing."
        );
        // You could optionally show a UI message to the user here
      }, 15000); // 15 seconds
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isWaitingForQuestion, sessionId]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Resume an existing active session
  const handleResumeSession = async (existingSessionId: string) => {
    if (!token) {
      alert("Anda harus login terlebih dahulu");
      router.push("/auth");
      return;
    }

    try {
      console.log("🔄 Resuming session:", existingSessionId);

      // Get session details
      const sessionResponse = await gradingService.getSession(
        existingSessionId,
        token
      );
      const session = sessionResponse.data;

      // Check if session is still active and not expired
      const isExpired = new Date(session.expires_at) < new Date();
      if (session.status !== "active" || isExpired) {
        alert("Sesi ini sudah berakhir atau tidak aktif lagi.");
        router.push("/essay-grader");
        return;
      }

      // Calculate remaining time
      const expiresAt = new Date(session.expires_at).getTime();
      const now = new Date().getTime();
      const remainingSeconds = Math.max(
        0,
        Math.floor((expiresAt - now) / 1000)
      );

      setSessionId(existingSessionId);
      setCurrentStep("test");
      setCurrentScore(session.current_score || 0);
      setIsWaitingForQuestion(true);

      // Fetch existing messages to restore state
      const messagesResponse = await gradingService.getMessages(
        existingSessionId,
        { limit: 100 },
        token
      );

      const messages = messagesResponse.data?.messages || [];
      console.log("📥 Fetched messages for resume:", messages);

      // Separate questions and answers
      const questionMessages = messages.filter(
        (m) => m.message_type === "question"
      );
      const answerMessages = messages.filter(
        (m) => m.message_type === "answer"
      );

      // Map questions
      const mappedQuestions = questionMessages.map((q) => ({
        id: q.id,
        question: q.content,
        placeholder: "Tuliskan jawaban Anda dengan detail...",
        tips: "Berikan jawaban yang jujur dan spesifik berdasarkan pengalaman pribadi Anda.",
      }));

      // Build answers map (match answers to questions by order)
      const answersMap: { [key: string]: string } = {};
      answerMessages.forEach((answer, index) => {
        if (questionMessages[index]) {
          answersMap[questionMessages[index].id] = answer.content;
        }
      });

      if (mappedQuestions.length > 0) {
        setQuestions(mappedQuestions);
        setAnswers(answersMap);
        // Set to the last unanswered question or the latest question
        const lastAnsweredIndex = Math.min(
          answerMessages.length,
          mappedQuestions.length - 1
        );
        setCurrentQuestionIndex(lastAnsweredIndex);
        setIsWaitingForQuestion(false);
        console.log("✅ Session resumed successfully!");
      } else {
        console.log("⚠️ No questions found, waiting for first question...");
      }
    } catch (error) {
      console.error("❌ Error resuming session:", error);
      alert("Gagal melanjutkan sesi. Silakan coba lagi.");
      router.push("/essay-grader");
    }
  };

  const handleStart = async () => {
    if (!token) {
      alert("Anda harus login terlebih dahulu");
      router.push("/auth");
      return;
    }

    // Validate major selection
    if (!selectedMajor) {
      alert("Silakan pilih jurusan yang ingin diuji terlebih dahulu");
      return;
    }

    // Prevent double session creation
    if (isCreatingSession.current || createSessionMutation.isPending) {
      console.log("⚠️ Session creation already in progress, ignoring...");
      return;
    }

    // Block new session if there's an active session - show popup
    if (activeSession) {
      setShowActiveSessionPopup(true);
      return;
    }

    try {
      isCreatingSession.current = true;

      const response = await createSessionMutation.mutateAsync({
        target_major: selectedMajor,
      });
      console.log("✅ Session created:", response.data);
      setSessionId(response.data.id);
      setCurrentStep("test");
      setIsWaitingForQuestion(true);

      // Check if questions array is provided in the response (matches new AI-driven flow)
      if (response.data.questions && Array.isArray(response.data.questions) && response.data.questions.length > 0) {
        console.log(
          "📝 Questions received in session creation response:",
          response.data.questions
        );

        const mappedQuestions = response.data.questions.map((q: any) => ({
          id: q.id,
          question: q.content,
          placeholder: "Tuliskan jawaban Anda dengan detail...",
          tips: "Berikan jawaban yang jujur dan spesifik berdasarkan pengalaman pribadi Anda.",
        }));

        setQuestions(mappedQuestions);
        setCurrentQuestionIndex(0);
        setIsWaitingForQuestion(false);
        console.log(`✅ Loaded ${mappedQuestions.length} questions successfully!`);
        return;
      }

      // Check if first question is provided in the response (Legacy support)
      if (response.data.first_question) {
        console.log(
          "📝 First question received in session creation response:",
          response.data.first_question
        );
        setQuestions([
          {
            id: response.data.first_question.id,
            question: response.data.first_question.content,
            placeholder: "Tuliskan jawaban Anda dengan detail...",
            tips: "Berikan jawaban yang jujur dan spesifik berdasarkan pengalaman pribadi Anda.",
          },
        ]);
        setCurrentQuestionIndex(0);
        setIsWaitingForQuestion(false);
        console.log("✅ First question loaded successfully!");
        return;
      }

      console.warn(
        "⚠️ first_question not in response. Available keys:",
        Object.keys(response.data)
      );
      console.log("⏳ Waiting for first question via WebSocket or polling...");

      // Try to fetch first question via API (WebSocket might deliver it too)
      await fetchFirstQuestion(response.data.id, token, 3);
    } catch (error) {
      console.error("Failed to create session:", error);
      alert("Gagal membuat sesi. Silakan coba lagi.");
    } finally {
      isCreatingSession.current = false;
    }
  };

  // Helper function to fetch first question with retries
  const fetchFirstQuestion = async (
    sessionId: string,
    authToken: string,
    retries: number
  ) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      console.log(
        `🔄 Attempting to fetch first question (attempt ${attempt}/${retries})...`
      );

      // Wait a bit before trying (backend might need time to generate question)
      await new Promise((resolve) =>
        setTimeout(resolve, attempt === 1 ? 1000 : 2000)
      );

      try {
        const messagesResponse = await gradingService.getMessages(
          sessionId,
          { limit: 50 },
          authToken
        );

        console.log("📥 Fetched messages:", messagesResponse);

        const questionMessages =
          messagesResponse.data?.messages?.filter(
            (m) => m.message_type === "question"
          ) || [];

        if (questionMessages.length > 0) {
          console.log("📝 Found questions:", questionMessages);
          const mappedQuestions = questionMessages.map((q) => ({
            id: q.id,
            question: q.content,
            placeholder: "Tuliskan jawaban Anda dengan detail...",
            tips: "Berikan jawaban yang jujur dan spesifik berdasarkan pengalaman pribadi Anda.",
          }));
          setQuestions(mappedQuestions);
          setCurrentQuestionIndex(0);
          setIsWaitingForQuestion(false);
          return true;
        }
      } catch (error) {
        console.error(`❌ Fetch attempt ${attempt} failed:`, error);
      }
    }

    console.log("⏳ Will continue waiting for question via WebSocket...");
    return false;
  };

  const handleSubmitTest = async (isAutoSubmit: boolean = false) => {
    console.log("🚀 handleSubmitTest called, isAutoSubmit:", isAutoSubmit);

    if (!sessionId || !token) {
      console.error("No session ID or token found");
      return;
    }

    // Use refs for auto-submit to get latest values (avoid closure issues)
    const currentQuestions = isAutoSubmit ? questionsRef.current : questions;
    const currentAnswers = isAutoSubmit ? answersRef.current : answers;
    const currentIdx = isAutoSubmit
      ? currentQuestionIndexRef.current
      : currentQuestionIndex;

    const currentQuestion = currentQuestions[currentIdx];
    const answer = currentAnswers[currentQuestion?.id] || "";

    console.log("📝 Current question:", currentQuestion?.id);
    console.log("📝 Current answer:", answer);
    console.log("📝 Answer length:", answer.trim().length);
    console.log("📝 All answers:", currentAnswers);

    // Validate all answers if NOT auto submit (manual submit)
    if (!isAutoSubmit) {
      // Check for unanswered questions
      const unansweredQuestions = questions.filter(
        (q) => !answers[q.id] || answers[q.id].trim().length === 0
      );

      if (unansweredQuestions.length > 0) {
        alert(
          `Masih ada ${unansweredQuestions.length} soal yang belum dijawab. Silakan lengkapi semua jawaban.`
        );
        return;
      }

      // Check for answers below minimum character count
      const shortAnswers = questions.filter(
        (q) => answers[q.id] && answers[q.id].trim().length < MIN_ANSWER_LENGTH
      );

      if (shortAnswers.length > 0) {
        alert(
          `Ada ${shortAnswers.length} jawaban yang kurang dari ${MIN_ANSWER_LENGTH} karakter. Silakan lengkapi jawaban Anda.`
        );
        return;
      }
    }

    setIsSubmitting(true);
    setCurrentStep("loading");

    try {
      // Send last answer if exists and not already sent
      if (currentQuestion && answer.trim()) {
        const messageResponse = await sendMessageMutation.mutateAsync({
          sessionId,
          data: {
            message_type: "answer",
            content: answer,
          },
        });
        console.log("✅ Last answer sent:", messageResponse);

        // Check if session was auto-completed after last answer
        if (messageResponse.data.session_completed) {
          console.log("🎉 Session auto-completed after last answer");
          // Wait for backend to finish processing final result
          await new Promise((resolve) => setTimeout(resolve, 3000));
          router.push(`/profile/result/${sessionId}`);
          return;
        }
      }

      // Manually complete session - backend will generate final analysis
      const completeResponse = await completeSessionMutation.mutateAsync({
        sessionId,
      });
      console.log("✅ Session completed manually:", completeResponse);

      // Wait for backend to finish processing final analysis
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Navigate to result page
      router.push(`/profile/result/${sessionId}`);
    } catch (error) {
      console.error("❌ Error submitting test:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Gagal mengirim tes"}`
      );
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
          onStart={handleStart}
          onBack={() => router.push("/dashboard")}
          activeSession={activeSession}
          onResumeSession={handleResumeSession}
          isStarting={createSessionMutation.isPending}
          showActiveSessionPopup={showActiveSessionPopup}
          onClosePopup={() => setShowActiveSessionPopup(false)}
          selectedMajor={selectedMajor}
          onMajorChange={setSelectedMajor}
        />
      )}

      {currentStep === "test" && (
        <TestScreen
          question={questions[currentQuestionIndex]}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          answer={answers[questions[currentQuestionIndex]?.id] || ""}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={() => handleSubmitTest(false)}
          isSubmitting={isSubmitting}
          answers={answers}
          questions={questions}
          onQuestionSelect={(questionId) => {
            const index = questions.findIndex((q) => q.id === questionId);
            if (index !== -1) setCurrentQuestionIndex(index);
          }}
          showReview={showReview}
          onShowReview={setShowReview}
          currentScore={currentScore}
          isWaitingForQuestion={isWaitingForQuestion}
          socketConnected={socketConnected}
          minAnswerLength={MIN_ANSWER_LENGTH}
          sessionId={sessionId}
          token={token}
          setQuestions={setQuestions}
          showFunFactAnimation={showFunFactAnimation}
        />
      )}

      {currentStep === "loading" && <LoadingScreen />}
    </div>
  );
}

export default function EssayGraderPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <EssayGraderContent />
    </Suspense>
  );
}

function IntroScreen({
  user,
  onStart,
  onBack,
  activeSession,
  onResumeSession,
  isStarting,
  showActiveSessionPopup,
  onClosePopup,
  selectedMajor,
  onMajorChange,
}: {
  user: User | null;
  onStart: () => void;
  onBack: () => void;
  activeSession: GradingSession | null;
  onResumeSession: (sessionId: string) => void;
  isStarting: boolean;
  showActiveSessionPopup: boolean;
  onClosePopup: () => void;
  selectedMajor: string;
  onMajorChange: (major: string) => void;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white bg-opacity-50 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-2">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 group"
            >
              <ArrowLeftIcon className="w-4 h-4 text-neutral-600 group-hover:text-primary-600 transition-colors" />
              <span className="text-neutral-600 group-hover:text-primary-600 transition-colors font-medium text-xs sm:text-sm">
                Kembali
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
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
              <span className="font-semibold text-neutral-900 text-xs sm:text-sm">
                ProdiPlan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full h-full overflow-y-auto"
        >
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
            {/* Gradient Header */}
            <div className="bg-primary-600 px-4 sm:px-6 py-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <SplitText
                  text="Selamat datang di Essay Preparedness Grader"
                  className="text-xl sm:text-2xl font-bold text-white mb-2"
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
                className="text-white text-center text-opacity-90 text-xs sm:text-sm"
              >
                Analisis mendalam untuk menentukan kesiapan Anda menjalani
                jurusan pilihan
              </motion.p>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 py-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-4"
              >
                <h2 className="text-lg font-semibold text-neutral-900 mb-3">
                  Tentang Test Ini
                </h2>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900 text-sm">
                        5 Pertanyaan Essay
                      </p>
                      <p className="text-neutral-600 text-xs">
                        Jawab dengan jujur dan detail sesuai dengan pengalaman
                        pribadi Anda
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900 text-sm">
                        Durasi Fleksibel
                      </p>
                      <p className="text-neutral-600 text-xs">
                        Jawab dengan santai tanpa batas waktu
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900 text-sm">
                        Analisis AI Mendalam
                      </p>
                      <p className="text-neutral-600 text-xs">
                        Sistem kami akan menganalisis esai Anda dengan teknologi
                        AI terdepan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900 text-sm">
                        Hasil Komprehensif
                      </p>
                      <p className="text-neutral-600 text-xs">
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
                className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4"
              >
                <h3 className="font-semibold text-neutral-900 mb-2 flex items-center space-x-2 text-sm">
                  <SparklesIcon className="w-4 h-4 text-primary-600" />
                  <span>Tips untuk Hasil Terbaik</span>
                </h3>
                <ul className="space-y-1 text-xs text-neutral-600">
                  <li>
                    ✓ Jawab dengan jujur dan autentik sesuai perasaan Anda
                  </li>
                  <li>✓ Berikan contoh konkret dari pengalaman pribadi</li>
                  <li>✓ Hindari jawaban umum atau generik</li>
                  <li>✓ Tunjukkan pemikiran matang dan refleksi diri</li>
                </ul>
              </motion.div>

              {/* User Info & Major Selection */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-neutral-100 rounded-lg p-4 mb-4"
              >
                <p className="text-xs text-neutral-600 mb-3">
                  <span className="font-medium">Peserta:</span> {user?.full_name}
                </p>

                {/* Major Selection Dropdown */}
                <div className="mt-2">
                  <SearchableSelect
                    id="assessment_major"
                    name="assessment_major"
                    value={selectedMajor}
                    onChange={(name, value) => onMajorChange(value)}
                    options={MAJORS}
                    label="Jurusan yang Akan Diuji"
                    placeholder="Pilih atau ketik nama jurusan..."
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Pilih jurusan yang ingin Anda uji kesiapannya
                  </p>
                </div>
              </motion.div>

              {/* Active Session Alert */}
              {activeSession && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                  className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-start space-x-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-orange-800 text-sm mb-1">
                        Assessment Belum Selesai
                      </h3>
                      <p className="text-xs text-orange-700 mb-2">
                        Anda memiliki assessment untuk jurusan{" "}
                        <strong>{activeSession.target_major}</strong> yang belum
                        diselesaikan.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onResumeSession(activeSession.id)}
                        className="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 text-xs"
                      >
                        Lanjutkan Assessment →
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center gap-2"
              >
                <motion.button
                  whileHover={{ scale: isStarting ? 1 : 1.05 }}
                  whileTap={{ scale: isStarting ? 1 : 0.95 }}
                  onClick={onStart}
                  disabled={isStarting}
                  className="flex-1 btn btn-primary btn-sm sm:btn-md px-4 sm:px-6 py-2 flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {isStarting
                      ? "Memulai..."
                      : activeSession
                        ? "Mulai Assessment Baru"
                        : "Mulai Test Sekarang"}
                  </span>
                  {isStarting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <SparklesIcon className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <SparklesIcon className="w-4 h-4" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  disabled={isStarting}
                  className="btn btn-secondary btn-sm sm:btn-md px-4 sm:px-6 py-2 text-xs sm:text-sm disabled:opacity-50"
                >
                  Kembali
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Session Blocking Popup */}
      <AnimatePresence>
        {showActiveSessionPopup && activeSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClosePopup}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-neutral-900 text-center mb-2">
                Assessment Belum Selesai
              </h3>

              {/* Description */}
              <p className="text-neutral-600 text-center mb-4 text-sm">
                Anda tidak dapat memulai assessment baru karena masih memiliki
                assessment yang belum diselesaikan.
              </p>

              {/* Session Info */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-orange-500 rounded-full"
                  />
                  <span className="text-sm font-semibold text-orange-800">
                    Assessment Aktif
                  </span>
                </div>
                <p className="text-sm text-orange-700">
                  <strong>Jurusan:</strong> {activeSession.target_major}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Dimulai pada{" "}
                  {new Date(activeSession.created_at).toLocaleDateString(
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

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClosePopup();
                    onResumeSession(activeSession.id);
                  }}
                  className="w-full btn btn-primary py-3 flex items-center justify-center space-x-2"
                >
                  <span>Lanjutkan Assessment</span>
                  <SparklesIcon className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClosePopup}
                  className="w-full btn btn-secondary py-2.5"
                >
                  Tutup
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TestScreen({
  question,
  currentQuestionIndex,
  totalQuestions,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting,
  answers,
  questions,
  onQuestionSelect,
  showReview,
  onShowReview,
  currentScore,
  isWaitingForQuestion,
  socketConnected,
  minAnswerLength,
  sessionId,
  token,
  setQuestions,
  showFunFactAnimation,
}: {
  question: Question | undefined;
  currentQuestionIndex: number;
  totalQuestions: number;
  answer: string;
  onAnswer: (value: string) => void;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  answers: { [key: string]: string };
  questions: Question[];
  onQuestionSelect: (questionId: string) => void;
  showReview: boolean;
  onShowReview: (show: boolean) => void;
  currentScore: number;
  isWaitingForQuestion: boolean;
  socketConnected: boolean;
  minAnswerLength: number;
  sessionId: string | null;
  token: string | null;
  setQuestions: (questions: Question[]) => void;
  showFunFactAnimation: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const progress =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;
  const isLastQuestion =
    totalQuestions > 0 && currentQuestionIndex === totalQuestions - 1;

  // Speech-to-text states
  const [isRecording, setIsRecording] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>(''); // Text before starting recording
  const finalTranscriptRef = useRef<string>(''); // Accumulated final transcripts
  const isRecordingRef = useRef<boolean>(false); // Track recording state for auto-restart
  const onAnswerRef = useRef(onAnswer); // Store onAnswer in ref to avoid re-creating recognition

  // Update onAnswerRef when onAnswer changes
  useEffect(() => {
    onAnswerRef.current = onAnswer;
  }, [onAnswer]);

  // Check browser support for speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsBrowserSupported(!!SpeechRecognition);
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isBrowserSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID'; // Indonesian language

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      // Process all results
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update final transcript accumulator
      if (finalTranscript) {
        finalTranscriptRef.current += finalTranscript;
      }

      // Real-time update: base text + all final transcripts + current interim
      const currentText = baseTextRef.current + finalTranscriptRef.current + interimTranscript;
      // Use ref to call onAnswer without triggering re-creation of recognition
      onAnswerRef.current(currentText);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);

      // Don't auto-restart on these errors
      if (event.error === 'not-allowed' || event.error === 'no-speech') {
        isRecordingRef.current = false;
        setIsRecording(false);
      }

      if (event.error === 'not-allowed') {
        alert('Izin mikrofon ditolak. Silakan izinkan akses mikrofon di browser Anda.');
      }
    };

    recognition.onend = () => {
      // Auto-restart if user is still in recording mode
      if (isRecordingRef.current) {
        console.log('🔄 Auto-restarting speech recognition...');
        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to restart recognition:', error);
          isRecordingRef.current = false;
          setIsRecording(false);
          finalTranscriptRef.current = '';
        }
      } else {
        setIsRecording(false);
        finalTranscriptRef.current = '';
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        isRecordingRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [isBrowserSupported]); // Removed onAnswer from dependencies!

  // Toggle recording
  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      // User intentionally stopping
      isRecordingRef.current = false;
      recognitionRef.current.stop();
      setIsRecording(false);
      finalTranscriptRef.current = '';
    } else {
      // Save current text as base when starting recording
      baseTextRef.current = answer;
      finalTranscriptRef.current = '';
      isRecordingRef.current = true;
      setIsRecording(true);

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        isRecordingRef.current = false;
        setIsRecording(false);
      }
    }
  };

  // Focus textarea when question changes
  useEffect(() => {
    if (question && textareaRef.current && !showReview) {
      // Small delay to ensure DOM is ready after animation
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, question, showReview]);

  if (!question && questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mb-4"
          >
            <SparklesIcon className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">
            Menunggu pertanyaan pertama...
          </h2>
          <p className="text-neutral-600 text-sm">
            {socketConnected
              ? "AI sedang menyiapkan pertanyaan untuk Anda"
              : "Menghubungkan ke server..."}
          </p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Pertanyaan tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white bg-opacity-50 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-600">
                  {showReview
                    ? "Review Jawaban"
                    : `Pertanyaan ${currentQuestionIndex + 1}`}
                </p>
                <p className="font-semibold text-neutral-900 text-xs sm:text-sm">
                  Essay Preparedness Grader
                </p>
              </div>
            </div>

            {/* Review Button and Score */}
            <div className="flex items-center gap-2">
              {/* Connection Status */}
              <div
                className={`w-2 h-2 rounded-full ${socketConnected ? "bg-green-500" : "bg-red-500"
                  } animate-pulse`}
                title={socketConnected ? "Connected" : "Disconnected"}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onShowReview(!showReview)}
                className="btn btn-secondary text-xs py-1 px-2"
              >
                {showReview ? "Kembali" : "Review"}
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-1 overflow-hidden">
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
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
          {!showReview && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-full">
              {/* Left Column - Question Content */}
              <div className="lg:col-span-3 flex flex-col min-h-0">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col min-h-0 flex-1"
                >
                  {/* Question Card */}
                  <div className="bg-white rounded-lg shadow-md p-4 mb-3 flex flex-col min-h-0 flex-1 overflow-hidden">
                    <div className="mb-2 flex-shrink-0">
                      <div className="inline-flex items-center space-x-2 px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs font-medium mb-2">
                        <span>Pertanyaan {currentQuestionIndex + 1}</span>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-neutral-900">
                        {question.question}
                      </h2>
                    </div>

                    {/* Tips Box */}
                    <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-3 mb-3 flex-shrink-0">
                      <p className="text-xs text-neutral-700">
                        <span className="font-semibold text-secondary-800">
                          Tip:
                        </span>{" "}
                        {question.tips}
                      </p>
                    </div>

                    {/* Text Area */}
                    <div className="mb-2 flex flex-col min-h-0 flex-1">
                      <div className="flex items-center justify-between mb-2 flex-shrink-0">
                        <label className="block text-xs font-medium text-neutral-700">
                          Jawaban Anda
                        </label>
                        {isBrowserSupported && (
                          <motion.button
                            type="button"
                            onClick={toggleRecording}
                            disabled={isWaitingForQuestion || currentQuestionIndex < questions.length - 1}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isRecording
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                              }`}
                            title={isRecording ? 'Klik untuk berhenti merekam' : 'Klik untuk mulai berbicara'}
                          >
                            {isRecording ? (
                              // Stop icon when recording
                              <motion.svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <rect x="6" y="6" width="8" height="8" rx="1" />
                              </motion.svg>
                            ) : (
                              // Microphone icon
                              <MicrophoneIcon className="w-4 h-4" />
                            )}
                            <span>
                              {isRecording ? 'Berhenti' : 'Rekam'}
                            </span>
                            {isRecording && (
                              <motion.span
                                className="w-2 h-2 bg-white rounded-full"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}
                          </motion.button>
                        )}
                      </div>
                      <textarea
                        ref={textareaRef}
                        value={answer}
                        onChange={(e) => onAnswer(e.target.value)}
                        placeholder={question.placeholder}
                        disabled={isWaitingForQuestion || currentQuestionIndex < questions.length - 1} // Disable if waiting or if viewing past question
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none resize-y font-regular text-sm text-neutral-900 placeholder-neutral-500 flex-1 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed"
                        style={{ minHeight: "150px" }}
                        rows={6}
                      />
                      <div className="flex items-center justify-between mt-1 flex-shrink-0">
                        <p className="text-xs text-neutral-500">
                          {answer.length} karakter
                        </p>
                        {isRecording && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-red-600 flex items-center gap-1"
                          >
                            <motion.span
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              🎤
                            </motion.span>
                            Sedang merekam...
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Character count indicator */}
                    {answer.length < minAnswerLength && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-2 flex-shrink-0"
                      >
                        <p className="text-xs text-yellow-800">
                          💡 Min {minAnswerLength} karakter untuk jawaban detail
                          ({answer.length}/{minAnswerLength})
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onPrevious}
                      disabled={currentQuestionIndex === 0}
                      className="btn btn-secondary px-3 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Sebelumnya
                    </motion.button>

                    {/* Question indicators */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalQuestions }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            backgroundColor:
                              i === currentQuestionIndex
                                ? "#3b82f6"
                                : i < currentQuestionIndex &&
                                  questions[i] &&
                                  answers[questions[i]?.id]
                                  ? "#10b981"
                                  : "#e5e7eb",
                          }}
                          className="w-2.5 h-2.5 rounded-full"
                        />
                      ))}
                    </div>

                    {isLastQuestion ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNext}
                        disabled={isSubmitting || isWaitingForQuestion}
                        className="btn btn-primary px-4 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        <span>
                          {isSubmitting
                            ? "Mengirim..."
                            : isWaitingForQuestion
                              ? "Menunggu Soal..."
                              : "Kirim Jawaban"}
                        </span>
                        {isWaitingForQuestion ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <SparklesIcon className="w-3.5 h-3.5" />
                          </motion.div>
                        ) : (
                          <SparklesIcon className="w-3.5 h-3.5" />
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNext}
                        disabled={
                          isWaitingForQuestion ||
                          answer.trim().length < minAnswerLength
                        }
                        className="btn btn-primary px-3 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        <span>
                          {isWaitingForQuestion
                            ? "Menunggu..."
                            : answer.trim().length < minAnswerLength
                              ? `Min ${minAnswerLength} karakter`
                              : "Kirim & Lanjut"}
                        </span>
                        {isWaitingForQuestion && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-3.5 h-3.5"
                          >
                            <SparklesIcon className="w-3.5 h-3.5" />
                          </motion.div>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Navigation Sidebar */}
              <motion.div
                className="lg:col-span-1 bg-white rounded-lg shadow-md p-3 h-fit flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="font-semibold text-neutral-900 mb-2 text-xs">
                  Navigasi Soal
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {questions.map((q, idx) => (
                    <motion.button
                      key={q.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onQuestionSelect(q.id)}
                      className={`w-full py-1.5 rounded-lg font-medium text-xs transition-colors ${idx === currentQuestionIndex
                        ? "bg-primary-600 text-white"
                        : answers[q.id] && answers[q.id].trim().length > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                        }`}
                    >
                      {idx + 1}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">
                    <span className="font-medium">
                      {
                        Object.entries(answers).filter(
                          ([, value]) => value && value.trim().length > 0
                        ).length
                      }
                      /{questions.length}
                    </span>{" "}
                    terjawab
                  </p>
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden mb-2">
                    <motion.div
                      animate={{
                        width: `${questions.length > 0 ? (Object.entries(answers).filter(([, value]) => value && value.trim().length > 0).length / questions.length) * 100 : 0}%`,
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-green-500"
                    />
                  </div>
                  {isWaitingForQuestion && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-600 flex items-center gap-1 mb-1">
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ⏳ Menunggu pertanyaan berikutnya...
                        </motion.span>
                      </p>
                      <button
                        onClick={() => {
                          // Manual refresh trigger (just calls fetch first question logic or re-checks messages)
                          const checkNow = async () => {
                            const result = await gradingService.getMessages(sessionId!, { limit: 50 }, token!);
                            const questionMessages = result.data?.messages?.filter((m) => m.message_type === "question") || [];
                            if (questionMessages.length > questions.length) {
                              const mappedQuestions = questionMessages.map((q) => ({
                                id: q.id,
                                question: q.content,
                                placeholder: "Tuliskan jawaban Anda dengan detail...",
                                tips: "Berikan jawaban yang jujur dan spesifik berdasarkan pengalaman pribadi Anda.",
                              }));
                              setQuestions(mappedQuestions);
                            }
                          };
                          checkNow();
                        }}
                        className="text-[10px] text-neutral-500 underline hover:text-primary-600"
                      >
                        Klik disini jika soal tidak muncul
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {showReview && (
            <div className="overflow-y-auto max-w-4xl mx-auto">
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs font-medium mb-2">
                          <span>Q{idx + 1}</span>
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900">
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
                        className="btn btn-secondary text-xs ml-2 flex-shrink-0 py-1 px-2"
                      >
                        {idx < questions.length - 1 ? "Lihat" : "Edit"}
                      </motion.button>
                    </div>

                    {answers[q.id] ? (
                      <div
                        className={`rounded-lg p-3 border ${answers[q.id].trim().length < minAnswerLength
                          ? "bg-orange-50 border-orange-200"
                          : "bg-neutral-50 border-neutral-200"
                          }`}
                      >
                        <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed text-xs">
                          {answers[q.id]}
                        </p>
                        <p
                          className={`text-xs mt-2 ${answers[q.id].trim().length < minAnswerLength
                            ? "text-orange-600 font-medium"
                            : "text-neutral-500"
                            }`}
                        >
                          {answers[q.id].length} karakter
                          {answers[q.id].trim().length < minAnswerLength && (
                            <span> (min. {minAnswerLength})</span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                        <p className="text-yellow-800 font-medium text-xs">
                          ⚠️ Belum dijawab
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-3 flex justify-center">
                {(() => {
                  const unansweredCount = questions.filter(
                    (q) => !answers[q.id] || answers[q.id].trim().length === 0
                  ).length;
                  const shortAnswerCount = questions.filter(
                    (q) =>
                      answers[q.id] &&
                      answers[q.id].trim().length > 0 &&
                      answers[q.id].trim().length < minAnswerLength
                  ).length;
                  const canSubmit =
                    unansweredCount === 0 && shortAnswerCount === 0;

                  if (canSubmit) {
                    return (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="btn btn-primary px-6 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        <span>
                          {isSubmitting ? "Mengirim..." : "Selesai & Analisis"}
                        </span>
                        <SparklesIcon className="w-4 h-4" />
                      </motion.button>
                    );
                  } else {
                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-yellow-50 rounded-lg p-2 border border-yellow-200"
                      >
                        <p className="text-yellow-800 font-medium text-xs">
                          {unansweredCount > 0 &&
                            `⚠️ ${unansweredCount} soal belum dijawab`}
                          {unansweredCount > 0 && shortAnswerCount > 0 && " | "}
                          {shortAnswerCount > 0 &&
                            `⚠️ ${shortAnswerCount} jawaban kurang dari ${minAnswerLength} karakter`}
                        </p>
                      </motion.div>
                    );
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fun Fact Animation Overlay */}
      <AnimatePresence>
        {showFunFactAnimation && <FunFactAnimation />}
      </AnimatePresence>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mb-4"
        >
          <SparklesIcon className="w-6 h-6 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-neutral-900 mb-2">
            Menganalisis Esai Anda...
          </h2>
          <p className="text-neutral-600 max-w-md text-xs">
            AI kami sedang menganalisis jawaban Anda dengan mendalam.
          </p>
        </motion.div>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [-4, 0, -4] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 bg-primary-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function FunFactAnimation() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const funFacts = [
    "💡 Rata-rata mahasiswa menghabiskan 15-20 jam per minggu untuk belajar mandiri!",
    "🎓 Lebih dari 80% mahasiswa sukses adalah mereka yang aktif bertanya di kelas.",
    "📚 Kuliah bukan hanya tentang nilai, tapi juga tentang networking dan pengalaman!",
    "✨ Mahasiswa yang terlibat organisasi cenderung lebih siap menghadapi dunia kerja.",
    "🌟 Passion dan ketertarikan adalah kunci kesuksesan dalam menjalani perkuliahan.",
    "🎯 Memilih jurusan yang tepat dapat meningkatkan kepuasan hidup hingga 40%!",
    "🚀 Alumni dengan pengalaman organisasi 70% lebih cepat mendapat pekerjaan.",
    "💪 Kesiapan mental sama pentingnya dengan kemampuan akademik!",
    "🎨 Kreativitas dan critical thinking adalah skill paling dicari di era digital.",
    "🌈 Setiap jurusan memiliki keunikan dan peluang karir yang luas!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 3000); // Change fact every 3 seconds

    return () => clearInterval(interval);
  }, [funFacts.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <SparklesIcon className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-center text-gray-900 mb-2"
        >
          Sedang Memproses...
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 mb-6 text-sm"
        >
          AI sedang menganalisis jawaban Anda
        </motion.p>

        {/* Fun Fact Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFactIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 border-2 border-primary-200"
          >
            <p className="text-sm font-medium text-gray-800 text-center leading-relaxed">
              {funFacts[currentFactIndex]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Loading Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                backgroundColor: ["#3b82f6", "#8b5cf6", "#3b82f6"],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-3 h-3 rounded-full"
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-gray-500 mt-4"
        >
          Tunggu sebentar ya...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

