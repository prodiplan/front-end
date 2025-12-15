# Frontend Grading Session Implementation Guide

This guide details how to implement the grading session flow on the frontend, including API interactions and WebSocket event handling.

## Overview

The grading process is **asynchronous**. When a user submits an answer, the server acknowledges receipt immediately, but the AI analysis and next question generation happen in the background. The frontend must listen for WebSocket events to receive the results.

## 1. Connection Setup

Before starting a session, ensure the WebSocket connection is established.

### WebSocket Connection
*   **URL:** `ws://localhost:4000` (API Gateway) or `wss://prodiplan.my.id` (Production)
*   **Auth:** Pass the JWT token in the handshake auth or query params.

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  auth: {
    token: "YOUR_JWT_TOKEN"
  }
});

socket.on("connect", () => {
  console.log("Connected to WebSocket");
});
```

## 2. Starting a Session

### Create Session
*   **API:** `POST /api/v1/grading-sessions`
*   **Body:**
    ```json
    {
      "target_major": "Computer Science",
      "max_questions": 5,
      "session_duration_minutes": 30
    }
    ```
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "id": "session-123",
        "first_question": {
          "id": "msg-1",
          "content": "Tell me about yourself...",
          "message_type": "question"
        }
      }
    }
    ```

### Join Session Room (WebSocket)
After creating the session, join the WebSocket room to receive updates for this specific session.

*   **Event:** `join_session`
*   **Payload:** `sessionId` string

```javascript
const sessionId = "session-123"; // From create session response
socket.emit("join_session", sessionId);
```

## 3. The Grading Loop

### Step A: Display Question
Display the `first_question` from the create response, or the `nextQuestion` from a WebSocket event.

### Step B: Submit Answer
When the user submits an answer:

*   **API:** `POST /api/v1/grading-sessions/{session_id}/messages`
*   **Body:**
    ```json
    {
      "message_type": "answer",
      "content": "I am interested in..."
    }
    ```
*   **Response (Immediate):**
    ```json
    {
      "success": true,
      "message": "Message sent successfully. Analysis is processing in background.",
      "data": {
        "message": { ... }, // The answer object
        "status": "processing"
      }
    }
    ```
    *Note: This response confirms the server received the answer. It does NOT contain the score or next question yet.*

### Step C: Wait for Result (WebSocket)
Show a "Thinking..." or "Analyzing..." state in the UI. Listen for the `grading_result` event.

*   **Event Name:** `grading_result`
*   **Data Structure:**
    ```json
    {
      "messageId": "msg-answer-id",
      "score": 85,
      "isComplete": false,
      "nextQuestion": "What specific programming languages...?" // String
    }
    ```

### Step D: Handle Result
1.  **Update UI:** Remove "Thinking..." state.
2.  **Show Feedback (Optional):** You can display the score if desired.
3.  **Next Action:**
    *   **If `isComplete: false`:** Display `nextQuestion` and enable the input for the next answer.
    *   **If `isComplete: true`:** The session is finished. Redirect to the results page.

## 4. Session Completion

When `isComplete` is true, or if you manually complete the session:

*   **API:** `POST /api/v1/grading-sessions/{session_id}/complete`
*   **Response:** Contains the full analysis report.

## Summary Flow Chart

1. **User** clicks "Start Grading".
2. **App** calls `POST /grading-sessions`.
3. **App** connects WebSocket & emits `join_session`.
4. **App** displays Q1.
5. **User** types answer & submits.
6. **App** calls `POST .../messages`.
7. **App** shows "AI is thinking...".
8. **Server** processes (Async).
9. **App** receives `grading_result` event via WebSocket.
10. **App** updates UI with next question.
11. Repeat 5-10 until finished.
