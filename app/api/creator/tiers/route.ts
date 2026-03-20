import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  await prisma.subscriptionTier.create({
    data: {
      creatorId: user.id,
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
      price: String(formData.get("price") || "0"),
      perks: String(formData.get("perks") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    }
  });

  return NextResponse.redirect(new URL("/creator/tiers", request.url));
}
