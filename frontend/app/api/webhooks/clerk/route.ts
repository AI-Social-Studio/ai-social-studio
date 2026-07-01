import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";
import { normalizeAppRole } from "@/lib/auth/roles";

export async function POST(request: NextRequest) {
  if (!env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return NextResponse.json({ error: "Clerk webhook is not configured" }, { status: 503 });
  }

  let event;

  try {
    event = await verifyWebhook(request);
  } catch {
    return NextResponse.json({ error: "Invalid webhook request" }, { status: 400 });
  }

  if (event.type !== "user.created") {
    return NextResponse.json({ received: true });
  }

  const role = normalizeAppRole(event.data.public_metadata?.role);
  if (role) {
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(event.data.id, {
      publicMetadata: {
        role: "user",
      },
    });
  } catch (error) {
    console.error("Failed to set default Clerk role", {
      error,
      type: event.type,
      userId: event.data.id,
    });
    return NextResponse.json({ error: "Failed to update Clerk user role" }, { status: 500 });
  }

  return NextResponse.json({ received: true, updated: true });
}
