"use client";

import { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <div className="min-h-full">{children}</div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#111827",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}
