import { normalizeLeadPayload, type LeadPayload } from "@/lib/lead";
import { dispatchLead } from "@/server/lead/integrations";

export async function createLead(payload: LeadPayload): Promise<{
  leadId: string;
  mode: "stub" | "live";
}> {
  const normalizedPayload = normalizeLeadPayload(payload);
  const integration = await dispatchLead(normalizedPayload);

  return {
    leadId: `lead-${Date.now()}`,
    mode: integration.mode,
  };
}
