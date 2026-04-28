import { hasLeadErrors, type LeadPayload, validateLeadPayload } from "@/lib/lead";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { createLead } from "@/server/lead/service";

export async function POST(request: Request) {
  const payload = await parseJsonBody<LeadPayload>(request);
  if (!payload) {
    return jsonError("Некорректный формат запроса", 400);
  }

  const errors = validateLeadPayload(payload);
  if (hasLeadErrors(errors)) {
    return jsonError("Проверьте корректность заполнения формы", 400, { errors });
  }

  if (payload.website && payload.website.trim().length > 0) {
    // Honeypot: внешне возвращаем успешный ответ, но ничего не создаём.
    return jsonOk({ ok: true, leadId: null, mode: "stub" });
  }

  try {
    const lead = await createLead(payload);
    return jsonOk({ ok: true, ...lead });
  } catch (error) {
    console.error("[api/lead] failed", error);
    return jsonError("Не удалось отправить заявку. Попробуйте ещё раз.", 500);
  }
}
