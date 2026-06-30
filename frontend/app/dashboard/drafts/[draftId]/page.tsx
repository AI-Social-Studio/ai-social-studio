import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CampaignStudio } from "@/components/studio/campaign-studio";
import { fetchDraftServer } from "@/lib/flowforge-api-server";

type Props = {
  params: Promise<{
    draftId: string;
  }>;
};

export default async function DraftPage({ params }: Props) {
  const { draftId } = await params;
  const draft = await fetchDraftServer(draftId);

  if (!draft) notFound();

  return (
    <DashboardShell>
      <CampaignStudio initialDraft={draft} />
    </DashboardShell>
  );
}
