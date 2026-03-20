import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: { include: { profile: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Media file is required" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const filename = `${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const mediaUrl = `/uploads/${filename}`;
  const mediaType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";

  const post = await prisma.post.create({
    data: {
      authorId: user.id,
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      visibility: String(formData.get("visibility") || "PUBLIC") as "PUBLIC" | "SUBSCRIBER_ONLY" | "PAID",
      price: formData.get("price") ? String(formData.get("price")) : null,
      mediaUrl,
      mediaType
    }
  });

  return NextResponse.redirect(new URL(`/post/${post.id}`, request.url));
}
