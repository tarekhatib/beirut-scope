import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-8xl font-black text-accent mb-4">404</p>
      <h1 className="text-2xl font-bold text-ink mb-2">Page not found</h1>
      <p className="text-ink-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors">
        Back to home
      </Link>
    </main>
  );
}
