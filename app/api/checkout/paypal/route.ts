import { NextResponse } from "next/server";
import { createPaypalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  const formData = await request.formData();
  const amount = String(formData.get("amount") || "0");
  const description = String(formData.get("description") || "Fanvior payment");

  const order = await createPaypalOrder(amount, description);
  const approveLink = order.links?.find((link: { rel: string }) => link.rel === "approve")?.href;

  if (!approveLink) {
    return NextResponse.json({ error: "PayPal approval URL not found" }, { status: 500 });
  }

  return NextResponse.redirect(approveLink);
}
