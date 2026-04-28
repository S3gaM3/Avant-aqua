import { jsonOk } from "@/lib/api-response";
import { getWooCommerceCredentials, getWordPressUrl, isAuthOAuthConfigured } from "@/lib/env";

export async function GET() {
  const hasWp = Boolean(getWordPressUrl());
  const hasWoo = Boolean(getWooCommerceCredentials());
  const hasAuth = isAuthOAuthConfigured();
  const hasRevalidateToken = Boolean(process.env.REVALIDATE_TOKEN);

  return jsonOk({
    ok: true,
    service: "avant-aqua-storefront",
    env: process.env.NODE_ENV ?? "unknown",
    checks: {
      wordpress: hasWp,
      wooApi: hasWoo,
      oauth: hasAuth,
      revalidateToken: hasRevalidateToken,
    },
  });
}
