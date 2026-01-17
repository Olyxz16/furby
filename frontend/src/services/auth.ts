import { apiFetch } from "./api";

export type SignInResponse = {
  id: number;
  mail: string;
  isDiscordLinked: boolean;
};

export async function login(mail: string, password: string): Promise<void> {
  await apiFetch<void>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ mail, password })
  });
}

export async function signin(mail: string, password: string): Promise<SignInResponse> {
  return apiFetch<SignInResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ mail, password })
  });
}

export async function logout(): Promise<void> {
  await apiFetch<void>("/auth/logout", { method: "POST" });
}
