"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "▪" },
  { label: "Articles", href: "/admin/articles", icon: "▪" },
  { label: "Updates", href: "/admin/updates", icon: "▪" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-line bg-canvas min-h-screen">
      <div className="px-6 py-5 border-b border-line">
        <Link href="/" target="_blank">
          <Image src="/logo.svg" alt="Beirut Scope" width={120} height={30} className="dark:invert" />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-accent text-white"
                  : "text-ink-soft hover:text-ink hover:bg-surface"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-line">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:text-ink hover:bg-surface transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
