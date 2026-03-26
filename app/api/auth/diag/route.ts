import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  const envKeys = Object.keys(process.env);
  const secretLength = (process.env.NEXTAUTH_SECRET || "").length;
  const urlSet = !!process.env.NEXTAUTH_URL;
  
  let d1Status = "Unknown";
  try {
    const ctx = getCloudflareContext();
    const d1 = (ctx?.env as any)?.DB || (globalThis as any).DB;
    d1Status = d1 ? "Connected (D1 Found)" : "Missing (DB Binding Not Found)";
  } catch (e: any) {
    d1Status = `Error getting context: ${e.message}`;
  }

  return NextResponse.json({
    diagnostics: {
      nextAuthSecretLength: secretLength,
      nextAuthUrlSet: urlSet,
      d1Status,
      envKeysSample: envKeys.slice(0, 10),
      nodeEnv: process.env.NODE_ENV,
      runtime: "Edge/Cloudflare"
    }
  });
}
