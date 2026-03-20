import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fanvior",
  description: "Premium creator subscription platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10 bg-black/20">
          <div className="shell flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-black tracking-tight">
              Fanvior
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-300">
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign up</Link>
              <Link href="/creator/dashboard">Dashboard</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
