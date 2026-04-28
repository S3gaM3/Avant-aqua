import type { LeadPayload } from "@/lib/lead";

type IntegrationResult = {
  ok: boolean;
  mode: "stub" | "live";
  provider: "crm" | "email";
  externalId?: string;
};

function isStubMode() {
  return process.env.LEAD_INTEGRATION_MODE !== "live";
}

async function sendLeadToCrm(payload: LeadPayload): Promise<IntegrationResult> {
  if (isStubMode()) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return {
      ok: true,
      mode: "stub",
      provider: "crm",
      externalId: `stub-crm-${Date.now()}`,
    };
  }

  // TODO: Подключить реальный CRM API (amoCRM/Bitrix24/другой провайдер).
  // Рекомендованный контракт: отправка normalized payload и получение внешнего ID лида.
  void payload;
  throw new Error("CRM integration is not connected");
}

async function sendLeadEmail(payload: LeadPayload): Promise<IntegrationResult> {
  if (isStubMode()) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return {
      ok: true,
      mode: "stub",
      provider: "email",
      externalId: `stub-email-${Date.now()}`,
    };
  }

  // TODO: Подключить реальную почтовую интеграцию (SMTP/API провайдера).
  void payload;
  throw new Error("Email integration is not connected");
}

export async function dispatchLead(payload: LeadPayload): Promise<{
  mode: "stub" | "live";
  results: IntegrationResult[];
}> {
  const [crm, email] = await Promise.all([sendLeadToCrm(payload), sendLeadEmail(payload)]);

  return {
    mode: crm.mode,
    results: [crm, email],
  };
}
