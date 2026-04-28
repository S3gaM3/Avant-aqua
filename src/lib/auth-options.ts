import type { NextAuthOptions } from "next-auth";
import type { OAuthConfig } from "next-auth/providers/oauth";
import { getAuthConfig, isAuthOAuthConfigured } from "@/lib/env";
import { fetchWpUserRoles, parseWpRolesFromProfile, rolesIncludeAdmin } from "@/lib/wp-roles";

type WordPressProfile = {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  roles?: string[];
};

const authConfig = getAuthConfig();

const providers = isAuthOAuthConfigured()
  ? [
      {
        id: "wordpress",
        name: "WordPress",
        type: "oauth",
        issuer: authConfig.oauthIssuer,
        clientId: authConfig.clientId ?? "",
        clientSecret: authConfig.clientSecret ?? "",
        authorization: { params: { scope: "openid profile email" } },
        profile(profile: WordPressProfile) {
          const fallbackName = profile.name ?? profile.preferred_username ?? "Пользователь";
          return {
            id: profile.sub ?? profile.email ?? fallbackName,
            name: fallbackName,
            email: profile.email ?? null,
          };
        },
      } satisfies OAuthConfig<WordPressProfile>,
    ]
  : [];

export const authOptions: NextAuthOptions = {
  secret: authConfig.secret,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (profile && typeof profile === "object") {
        const p = profile as WordPressProfile & Record<string, unknown>;
        if (p.sub) token.wpSub = String(p.sub);
        const fromProfile = parseWpRolesFromProfile(p);
        if (fromProfile.length > 0) {
          token.wpRoles = fromProfile;
          token.wpIsAdmin = rolesIncludeAdmin(fromProfile);
        }
      }

      if (token.wpIsAdmin === undefined && typeof token.accessToken === "string") {
        const roles = await fetchWpUserRoles(token.accessToken);
        if (roles.length > 0) {
          token.wpRoles = roles;
          token.wpIsAdmin = rolesIncludeAdmin(roles);
        }
      }

      if (token.wpIsAdmin === undefined) {
        token.wpIsAdmin = false;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.wpSub ?? token.sub ?? session.user.email ?? "");
        session.user.wpIsAdmin = Boolean(token.wpIsAdmin);
      }
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
