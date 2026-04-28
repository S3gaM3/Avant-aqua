import { GraphQLClient } from "graphql-request";
import { getWordPressUrl } from "@/lib/env";

export function getGraphqlEndpoint(): string | null {
  const explicit = process.env.WORDPRESS_GRAPHQL_URL;
  if (explicit) return explicit;
  const base = getWordPressUrl();
  if (!base) return null;
  return `${base}/graphql`;
}

export function createGraphqlClient(): GraphQLClient | null {
  const endpoint = getGraphqlEndpoint();
  if (!endpoint) return null;
  return new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
