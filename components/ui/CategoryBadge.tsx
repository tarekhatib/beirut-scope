import Link from "next/link";

type Props = {
  name: string;
  slug: string;
  variant?: "filled" | "outline";
};

export default function CategoryBadge({ name, slug, variant = "filled" }: Props) {
  const base = "inline-block text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded transition-colors";

  const styles =
    variant === "filled"
      ? `${base} bg-accent text-white hover:bg-accent-hover`
      : `${base} border border-accent text-accent hover:bg-accent hover:text-white`;

  return (
    <Link href={`/${slug}`} className={styles}>
      {name}
    </Link>
  );
}
