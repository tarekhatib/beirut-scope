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

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
