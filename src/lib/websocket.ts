/**
 * WebSocket Configuration and Utilities
 * Based on API Specification - WebSocket Events
 *
 * Production: wss://prodiplan.my.id
 */

import { io, Socket } from "socket.io-client";

const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WS_URL || "wss://api.prodiplan.my.id";
const WEBSOCKET_PATH = "/socket.io";

/**
 * WebSocket Event Types
 */
export interface SocketQuestion {
  id: string;
  session_id: string;
  content: string;
  created_at: string;
}

export interface SocketScoreUpdate {
  session_id: string;
  current_score: number;
  question_score: number;
  question_count: number;
}

export interface SocketSessionCompleted {
  session_id: string;
  final_score: number;
  readiness_level: "not_ready" | "somewhat_ready" | "ready" | "very_ready";
  result_id: string;
}

export interface SocketError {
  code: string;
  message: string;
  session_id?: string;
}

export interface SocketGradingResult {
  messageId: string;
  score: number;
  isComplete: boolean;
  nextQuestion: string; // The content of the next question
}

/**
 * Create and configure Socket.IO connection
 */
export function createSocketConnection(token: string): Socket {
  const socket = io(WEBSOCKET_URL, {
    path: WEBSOCKET_PATH,
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // Connection event handlers
  socket.on("connect", () => {
    console.log("✅ WebSocket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ WebSocket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("🔴 WebSocket connection error:", error.message);
  });

  return socket;
}

/**
 * Join a grading session
 */
export function joinSession(socket: Socket, sessionId: string) {
  socket.emit("join_session", sessionId);
}

/**
 * Send an answer to the current session
 * NOTE: The backend accepts answers via HTTP POST to /grading-sessions/{id}/messages
 * with { message_type: "answer", content: string }
 * WebSocket is primarily for receiving questions and updates
 */
export function sendAnswer(socket: Socket, sessionId: string, content: string) {
  // Legacy WebSocket method - may not be used by backend
  socket.emit("answer", {
    session_id: sessionId,
    content,
  });
}

/**
 * Listen for new questions
 */
export function onQuestion(
  socket: Socket,
  callback: (data: SocketQuestion) => void,
) {
  socket.on("question", callback);
}

/**
 * Listen for score updates
 */
export function onScoreUpdate(
  socket: Socket,
  callback: (data: SocketScoreUpdate) => void,
) {
  socket.on("score_update", callback);
}

/**
 * Listen for session completion
 */
export function onSessionCompleted(
  socket: Socket,
  callback: (data: SocketSessionCompleted) => void,
) {
  socket.on("session_completed", callback);
}

/**
 * Listen for errors
 */
export function onError(socket: Socket, callback: (data: SocketError) => void) {
  socket.on("error", callback);
}

/**
 * Listen for grading results (AI analysis)
 */
export function onGradingResult(
  socket: Socket,
  callback: (data: SocketGradingResult) => void,
) {
  socket.on("grading_result", callback);
}

/**
 * Disconnect and cleanup
 */
export function disconnectSocket(socket: Socket) {
  socket.removeAllListeners();
  socket.disconnect();
}

/**
 * Example Usage:
 *
 * ```typescript
 * import { createSocketConnection, joinSession, onQuestion, sendAnswer } from '@/lib/websocket';
 *
 * const socket = createSocketConnection(token);
 *
 * // Join session
 * joinSession(socket, sessionId);
 *
 * // Listen for questions
 * onQuestion(socket, (data) => {
 *   console.log('New question:', data.content);
 * });
 *
 * // Send answer
 * sendAnswer(socket, sessionId, 'My answer here');
 *
 * // Cleanup on unmount
 * disconnectSocket(socket);
 * ```
 */
