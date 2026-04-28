function required(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

/** Базовый URL WordPress без завершающего слэша */
export function getWordPressUrl(): string | undefined {
  return required("NEXT_PUBLIC_WORDPRESS_URL");
}

export function getWooCommerceCredentials(): {
  key: string;
  secret: string;
} | null {
  const key = required("WOOCOMMERCE_CONSUMER_KEY");
  const secret = required("WOOCOMMERCE_CONSUMER_SECRET");
  if (!key || !secret) return null;
  return { key, secret };
}

export function isWooConfigured(): boolean {
  return Boolean(getWordPressUrl() && getWooCommerceCredentials());
}

/** URL для гибридного оформления заказа на стороне WooCommerce */
export function getWooCommerceCheckoutUrl(): string | undefined {
  return required("NEXT_PUBLIC_WC_CHECKOUT_URL");
}

/** Тот же секрет, что у NextAuth — нужен middleware/getToken для проверки JWT */
export function getAuthSecret(): string | undefined {
  const s = required("AUTH_SECRET");
  if (s) return s;
  if (process.env.NODE_ENV === "production") return undefined;
  return "avant-aqua-dev-secret-change-me";
}

export function getWordPressAdminRoleSlugs(): string[] {
  const raw = required("WORDPRESS_ADMIN_ROLES");
  if (!raw) return ["administrator"];
  return raw
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

export function getAuthConfig(): {
  secret?: string;
  oauthIssuer?: string;
  clientId?: string;
  clientSecret?: string;
} {
  return {
    secret: getAuthSecret(),
    oauthIssuer: required("WORDPRESS_OAUTH_ISSUER"),
    clientId: required("WORDPRESS_OAUTH_CLIENT_ID"),
    clientSecret: required("WORDPRESS_OAUTH_CLIENT_SECRET"),
  };
}

export function isAuthOAuthConfigured(): boolean {
  const cfg = getAuthConfig();
  return Boolean(cfg.oauthIssuer && cfg.clientId && cfg.clientSecret);
}

export function getAbandonedCartWebhookConfig(): {
  url?: string;
  token?: string;
  provider: "generic" | "unisender";
} {
  const provider = (required("ABANDONED_CART_WEBHOOK_PROVIDER") ?? "generic").toLowerCase();
  return {
    url: required("ABANDONED_CART_WEBHOOK_URL"),
    token: required("ABANDONED_CART_WEBHOOK_TOKEN"),
    provider: provider === "unisender" ? "unisender" : "generic",
  };
}

export function getMeilisearchConfig(): {
  url?: string;
  apiKey?: string;
  index: string;
} {
  return {
    url: required("MEILISEARCH_URL"),
    apiKey: required("MEILISEARCH_API_KEY"),
    index: required("MEILISEARCH_INDEX") ?? "products",
  };
}

export function getSearchIndexRebuildToken(): string | undefined {
  return required("MEILISEARCH_REINDEX_TOKEN");
}
