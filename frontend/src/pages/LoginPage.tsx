"use client";

import React, { useState } from "react";
import { login, signin } from "../services/auth";

export function LoginPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await login(mail, password);
      } else {
        await signin(mail, password);
      }

      // backend sets session cookie → redirect
      window.location.href = "/";
    } catch {
      setError(mode === "login" ? "Probleme d'identifiant ou de mots de passe" : "Impossible de créer un compte");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>{mode === "login" ? "Connexion" : "Créer un compte"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Please wait…" : mode === "login" ? "Connexion" : "Créer un compte"}
      </button>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

      <div style={{ marginTop: 16 }}>
        {mode === "login" ? (
          <span>
            Pas de compte?{" "}
            <button onClick={() => setMode("signup")}>
              Créer un compte
            </button>
          </span>
        ) : (
          <span>
            Déjà un compte?{" "}
            <button onClick={() => setMode("login")}>
              Conextion
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
