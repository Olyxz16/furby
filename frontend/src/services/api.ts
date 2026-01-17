const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  console.log("[apiFetch] URL:", url);
  console.log("[apiFetch] options:", options);

  let res: Response;
  try {
    res = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (err) {
    console.error("[apiFetch] NETWORK ERROR", err);
    throw err;
  }

  console.log("[apiFetch] status:", res.status);

  const txt = await res.text();
  console.log("[apiFetch] raw response:", txt);

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${txt}`);
  }

  try {
    return txt ? JSON.parse(txt) : (null as unknown as T);
  } catch {
    throw new Error("Failed to parse JSON response");
  }
}

export default BASE_URL;
