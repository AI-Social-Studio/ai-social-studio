import type { Draft, DraftSummary } from "@/lib/flowforge-api";

const backendBaseUrl = `${process.env.BACKEND_URL ?? "http://localhost:4000"}/api/v1`;

export async function fetchDraftServer(draftId: string): Promise<Draft | null> {
  const response = await fetch(`${backendBaseUrl}/drafts/${draftId}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Failed to load draft ${draftId}`);
  return (await response.json()) as Draft;
}

export async function listDraftsServer(limit = 50): Promise<DraftSummary[]> {
  const response = await fetch(`${backendBaseUrl}/drafts?limit=${limit}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load drafts");
  return (await response.json()) as DraftSummary[];
}
