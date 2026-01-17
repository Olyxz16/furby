const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  console.log("=== apiFetch ===");
  console.log("URL:", url);
  console.log("Options:", options);

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
    console.error("NETWORK ERROR (no server / wrong port)");
    console.error(err);
    throw err;
  }

  console.log("HTTP status:", res.status);

  const text = await res.text();
  console.log("Raw response:", text);

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${text}`);
  }

  try {
    return text ? JSON.parse(text) : (null as unknown as T);
  } catch {
    throw new Error("JSON parse failed");
  }
}

export default BASE_URL;
