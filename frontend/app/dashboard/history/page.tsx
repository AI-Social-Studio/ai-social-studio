import { MyCampaignsView } from "@/components/dashboard/my-campaigns-view";
import { listDraftsServer } from "@/lib/flowforge-api-server";

export default async function MyCampaignsPage() {
  const drafts = await listDraftsServer(9999);

  return <MyCampaignsView drafts={drafts} />;
}
