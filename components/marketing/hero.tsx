"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">
        Built from your Stitch flows
      </p>
      <h1 className="max-w-2xl text-5xl font-black leading-tight sm:text-6xl">
        Premium creator subscriptions, paywalled content, messaging, and payouts in one platform.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-slate-300">
        Fanvior turns the landing, auth, dashboard, moderation, notifications, and checkout mockups into a scalable Next.js application backed by Prisma, PostgreSQL, JWT auth, and PayPal.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/signup">
          <Button>Create account</Button>
        </Link>
        <Link href="/creator/dashboard">
          <Button variant="secondary">Open creator dashboard</Button>
        </Link>
      </div>
    </motion.div>
  );
}
