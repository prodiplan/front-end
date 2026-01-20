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
  questions?: {
    id: string;
    content: string;
  }[];
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
  readiness_level: "not_ready" | "somewhat_ready" | "ready" | "very_ready";
  verification_status: "pending" | "approved" | "rejected";
  feedback?: string;
  verified_at?: string;
  verified_by?: string;
  admin_notes?: string;
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
  book_recommendations?: {
    title: string;
    author: string;
    isbn?: string;
    cover_url?: string;
    description: string;
    relevance_score: number;
    difficulty_level: "beginner" | "intermediate" | "advanced";
    topics: string[];
    estimated_reading_time?: string;
    purchase_links?: {
      tokopedia?: string;
      shopee?: string;
      gramedia?: string;
    };
  }[];
  learning_path?: {
    phase: number;
    title: string;
    description: string;
    estimated_duration: string;
    skills_to_learn: string[];
    resources: string[];
    milestones: string[];
  }[];
  action_plan?: {
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    timeframe: string;
    category: "study" | "practice" | "networking" | "certification" | "project";
    completed?: boolean;
  }[];
  industry_insights?: {
    job_market_demand: "high" | "medium" | "low";
    demand_description: string;
    average_salary_range: string;
    salary_progression: {
      entry_level: string;
      mid_level: string;
      senior_level: string;
    };
    growth_potential: number;
    growth_description: string;
    top_companies: string[];
    required_certifications?: string[];
    skills_in_demand: string[];
    future_outlook: string;
  };
}

export interface GradingStatistics {
  total_sessions: number;
  average_score: number;
  readiness_distribution: {
    not_ready: number;
    somewhat_ready: number;
    ready: number;
    very_ready: number;
  };
  latest_result?: {
    session_id: string;
    final_score: number;
    readiness_level: "not_ready" | "somewhat_ready" | "ready" | "very_ready";
    created_at: string;
  };
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
