export interface User {
  id: string;
  email: string;
  full_name: string;
  birth_date: string;
  school_origin: string;
  dream_major: string;
  avatar_url?: string;
  phone_number?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface GradingSession {
  id: string;
  user_id: string;
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
  first_question?: {
    id: string;
    session_id: string;
    content: string;
    created_at: string;
  };
}

export interface SessionMessage {
  id: string;
  session_id: string;
  message_type: "question" | "answer";
  content: string;
  score?: number;
  is_analyzed: boolean;
  created_at: string;
}

// Response from sending a message (answer) - includes next question and session status
export interface SendMessageResponse {
  message: SessionMessage;
  score?: number;
  next_question?: {
    id: string;
    content: string;
    message_type: "question";
  };
  session_completed: boolean;
}

export interface GradingResult {
  id: string;
  session_id: string;
  final_score: number;
  readiness_level: "ready" | "not_ready" | "needs_improvement";
  analysis_report: AnalysisReport;
  created_at: string;
}

export interface AnalysisReport {
  summary: string;
  recommendations: string;
  strengths: string;
  weaknesses: string;
  key_insights: {
    motivation_score: number;
    technical_understanding: number;
    career_alignment: number;
  };
  personality_traits: {
    analytical_thinking: string;
    problem_solving: string;
    creativity: string;
  };
  career_suggestions: string[];
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_prev: boolean;
  total_pages?: number;
  current_page?: number;
}

export interface PaginatedResponse<T> {
  items: T[]; // Some endpoints use 'sessions' or 'messages' instead of 'items', need to handle that
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
