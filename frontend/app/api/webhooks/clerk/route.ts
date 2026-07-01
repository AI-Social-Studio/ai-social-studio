import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { normalizeAppRole } from "@/lib/auth/roles";

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);

    if (event.type !== "user.created") {
      return NextResponse.json({ received: true });
    }

    const role = normalizeAppRole(event.data.public_metadata?.role);
    if (role) {
      return NextResponse.json({ received: true, skipped: true });
    }

    const client = await clerkClient();
    await client.users.updateUserMetadata(event.data.id, {
      publicMetadata: {
        role: "user",
      },
    });

    return NextResponse.json({ received: true, updated: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook request" }, { status: 400 });
  }
}
