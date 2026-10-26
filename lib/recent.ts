const KEY = "mdt-recent-tools";

export function rememberTool(slug: string) {
  if (typeof window === "undefined") return;
  const current = readRecent().filter((item) => item !== slug);
  current.unshift(slug);
  localStorage.setItem(KEY, JSON.stringify(current.slice(0, 8)));
}

export function readRecent() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
