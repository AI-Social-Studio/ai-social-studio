import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { normalizeAppRole } from "@/lib/auth/roles";

const isAdminRoute = createRouteMatcher(["/dashboard/admin(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks/clerk"]);

export default clerkMiddleware(async (auth, request) => {
  const authState = await auth();

  if (isAuthRoute(request) && authState.userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const sessionRole = normalizeAppRole(getRoleFromMetadata(authState.sessionClaims));
  if (isAdminRoute(request) && sessionRole && sessionRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
});

function getRoleFromMetadata(metadata: unknown): unknown {
  if (!metadata || typeof metadata !== "object") return null;

  const role = (metadata as { metadata?: unknown; role?: unknown }).metadata;
  if (role && typeof role === "object") {
    const nestedRole = (role as { role?: unknown }).role;
    if (nestedRole !== undefined && nestedRole !== null) return nestedRole;
  }

  return (metadata as { role?: unknown }).role ?? null;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
