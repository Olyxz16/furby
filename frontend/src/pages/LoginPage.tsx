// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { apiFetch } from "../services/api";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink() {
    try {
      await apiFetch("/auth/magic-link", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (sent) {
    return <div>Check your email.</div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Login</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button onClick={sendLink}>Send magic link</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
