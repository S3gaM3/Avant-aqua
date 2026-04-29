import { NextResponse } from "next/server";
import {
  hasCheckoutBridgeErrors,
  type CheckoutBridgePayload,
  validateCheckoutBridgePayload,
} from "@/lib/checkout";
import { createCheckoutRedirect } from "@/server/checkout/service";
import { applyRussianNbsp } from "@/lib/ru-typography";

export async function POST(request: Request) {
  let payload: CheckoutBridgePayload;

  try {
    payload = (await request.json()) as CheckoutBridgePayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: applyRussianNbsp("Некорректный формат запроса") },
      { status: 400 },
    );
  }

  const errors = validateCheckoutBridgePayload(payload);
  if (hasCheckoutBridgeErrors(errors)) {
    return NextResponse.json(
      {
        ok: false,
        message: applyRussianNbsp("Не удалось подготовить корзину к оплате"),
        errors,
      },
      { status: 400 },
    );
  }

  try {
    const redirect = await createCheckoutRedirect(payload);
    return NextResponse.json({ ok: true, ...redirect });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: applyRussianNbsp(
          "Не удалось сформировать переход к оплате. Проверьте настройки интеграции.",
        ),
      },
      { status: 500 },
    );
  }
}
