import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Beirut Scope",
    template: "%s | Beirut Scope",
  },
  description: "Breaking news and in-depth coverage from Lebanon and the world.",
  openGraph: {
    siteName: "Beirut Scope",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-page text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
