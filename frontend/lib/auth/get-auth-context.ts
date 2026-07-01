import "server-only";

import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { normalizeAppRole, type AppRole } from "@/lib/auth/roles";

type RoleSource = "session_claims" | "public_metadata" | "default";

export type AuthContext = {
  userId: string;
  primaryEmailAddress: string | null;
  role: AppRole;
  roleSource: RoleSource;
};

const getCachedAuthContext = cache(async (): Promise<AuthContext | null> => {
  const { sessionClaims, userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const primaryEmailAddress = getPrimaryEmailAddress(user);
  const role = resolveRole({
    publicMetadata: user?.publicMetadata,
    sessionClaims,
  });

  return {
    userId,
    primaryEmailAddress,
    role: role.value,
    roleSource: role.source,
  };
});

export async function getAuthContext(): Promise<AuthContext | null> {
  return getCachedAuthContext();
}

export const getSessionAppRole = cache(async (): Promise<AppRole> => {
  const { sessionClaims } = await auth();
  return getRoleFromSessionClaims(sessionClaims) ?? "user";
});

export async function requireAuthContext(): Promise<AuthContext> {
  const context = await getAuthContext();
  if (!context) redirect("/sign-in");
  return context;
}

export async function requireAdminContext(): Promise<AuthContext> {
  const context = await requireAuthContext();
  if (context.role !== "admin") redirect("/dashboard");
  return context;
}

function getPrimaryEmailAddress(
  user: Awaited<ReturnType<typeof currentUser>>,
): string | null {
  if (!user) return null;

  const primary = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId);
  return primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;
}

function resolveRole({
  publicMetadata,
  sessionClaims,
}: {
  publicMetadata: unknown;
  sessionClaims: Awaited<ReturnType<typeof auth>>["sessionClaims"];
}): { value: AppRole; source: RoleSource } {
  const sessionRole = getRoleFromSessionClaims(sessionClaims);
  if (sessionRole) return { value: sessionRole, source: "session_claims" };

  const publicRole = getRoleFromPublicMetadata(publicMetadata);
  if (publicRole) return { value: publicRole, source: "public_metadata" };

  return { value: "user", source: "default" };
}

function getRoleFromSessionClaims(sessionClaims: Awaited<ReturnType<typeof auth>>["sessionClaims"]): AppRole | null {
  if (!sessionClaims || typeof sessionClaims !== "object") return null;

  const metadata = (sessionClaims as { metadata?: unknown }).metadata;
  if (metadata && typeof metadata === "object") {
    const nestedRole = normalizeAppRole((metadata as { role?: unknown }).role);
    if (nestedRole) return nestedRole;
  }

  return normalizeAppRole((sessionClaims as { role?: unknown }).role);
}

function getRoleFromPublicMetadata(publicMetadata: unknown): AppRole | null {
  if (!publicMetadata || typeof publicMetadata !== "object") return null;
  return normalizeAppRole((publicMetadata as { role?: unknown }).role);
}
