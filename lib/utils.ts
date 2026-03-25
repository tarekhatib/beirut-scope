export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u0600-\u06FF\s]+/g, (match) => match.trim().replace(/\s+/g, "-"))
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (n.type === "text" && typeof n.text === "string") return n.text;
  if (Array.isArray(n.content)) return (n.content as unknown[]).map(extractText).join(" ");
  return "";
}

export function readingTime(content: unknown): number {
  const words = extractText(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
