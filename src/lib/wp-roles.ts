import { getWordPressAdminRoleSlugs, getWordPressUrl } from "@/lib/env";

/** Роли из ответа userinfo OIDC-плагина WordPress (форматы могут отличаться). */
export function parseWpRolesFromProfile(profile: Record<string, unknown>): string[] {
  const candidates: unknown[] = [
    profile.roles,
    profile.wp_roles,
    profile.role,
    profile["https://schemas.wordpress.org/roles"],
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) {
      const out = c.filter((x): x is string => typeof x === "string");
      if (out.length) return out;
    }
    if (typeof c === "string" && c.length > 0) {
      try {
        const parsed = JSON.parse(c) as unknown;
        if (Array.isArray(parsed)) {
          const out = parsed.filter((x): x is string => typeof x === "string");
          if (out.length) return out;
        }
      } catch {
        return [c];
      }
    }
  }

  return [];
}

export function rolesIncludeAdmin(roles: string[]): boolean {
  const adminSlugs = getWordPressAdminRoleSlugs();
  const lower = roles.map((r) => r.toLowerCase());
  return adminSlugs.some((a) => lower.includes(a));
}

/** Fallback: Bearer к WP REST, если токен принимается ядром / OAuth-плагином. */
export async function fetchWpUserRoles(accessToken: string): Promise<string[]> {
  const base = getWordPressUrl();
  if (!base) return [];
  try {
    const url = `${base.replace(/\/$/, "")}/wp-json/wp/v2/users/me`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { roles?: unknown };
    if (!Array.isArray(data.roles)) return [];
    return data.roles.filter((r): r is string => typeof r === "string");
  } catch {
    return [];
  }
}
