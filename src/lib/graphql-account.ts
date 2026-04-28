import { gql } from "graphql-request";
import { createGraphqlClient } from "@/lib/graphql-client";
import type { AccountOrder, AccountProfile } from "@/lib/types/account";

type SessionLike = {
  user?: { name?: string | null; email?: string | null; id?: string | null };
  accessToken?: string;
};

const ACCOUNT_QUERY = gql`
  query AccountDashboard {
    viewer {
      databaseId
      name
      email
      ... on Customer {
        orders(first: 20) {
          nodes {
            databaseId
            orderNumber
            status
            date
            total
            currency
            lineItems(first: 100) {
              nodes {
                quantity
                total
                product {
                  node {
                    ... on Product {
                      databaseId
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function extractNumericPrice(value?: string | null): string {
  if (!value) return "0";
  return value.replace(/[^\d.,-]/g, "").replace(",", ".") || "0";
}

function mapStatus(status?: string | null): string {
  const normalized = (status ?? "").toLowerCase();
  if (!normalized) return "unknown";
  return normalized;
}

export async function fetchAccountDashboard(session: SessionLike): Promise<{
  profile: AccountProfile;
  orders: AccountOrder[];
}> {
  const fallbackProfile: AccountProfile = {
    id: session.user?.id ?? "",
    name: session.user?.name ?? "Пользователь",
    email: session.user?.email ?? "",
  };
  const client = createGraphqlClient();
  if (!client || !session.accessToken) {
    return { profile: fallbackProfile, orders: [] };
  }

  try {
    const data = await client.request<{
      viewer?: {
        databaseId?: number;
        name?: string | null;
        email?: string | null;
        orders?: {
          nodes?: Array<{
            databaseId?: number;
            orderNumber?: string | null;
            status?: string | null;
            date?: string | null;
            total?: string | null;
            currency?: string | null;
            lineItems?: {
              nodes?: Array<{
                quantity?: number | null;
                total?: string | null;
                product?: {
                  node?: {
                    databaseId?: number;
                    name?: string | null;
                    slug?: string | null;
                  } | null;
                } | null;
              }>;
            } | null;
          }>;
        } | null;
      };
    }>(ACCOUNT_QUERY, undefined, {
      Authorization: `Bearer ${session.accessToken}`,
    });

    const viewer = data.viewer;
    if (!viewer) return { profile: fallbackProfile, orders: [] };

    const profile: AccountProfile = {
      id: String(viewer.databaseId ?? fallbackProfile.id),
      name: viewer.name ?? fallbackProfile.name,
      email: viewer.email ?? fallbackProfile.email,
    };

    const orders: AccountOrder[] = (viewer.orders?.nodes ?? []).map((order) => ({
      id: String(order.databaseId ?? order.orderNumber ?? ""),
      number: order.orderNumber ?? String(order.databaseId ?? "—"),
      status: mapStatus(order.status),
      date: order.date ?? "",
      total: extractNumericPrice(order.total),
      currency: order.currency ?? "RUB",
      items: (order.lineItems?.nodes ?? [])
        .map((line) => {
          const product = line.product?.node;
          const quantity = Number(line.quantity ?? 0);
          if (!product?.databaseId || !product.slug || quantity < 1) return null;
          const lineTotal = Number.parseFloat(extractNumericPrice(line.total));
          const unitPrice = quantity > 0 ? String((lineTotal / quantity).toFixed(2)) : "0";
          return {
            productId: product.databaseId,
            name: product.name ?? "Товар",
            slug: product.slug,
            quantity,
            unitPrice,
          };
        })
        .filter((line): line is NonNullable<typeof line> => Boolean(line)),
    }));

    return { profile, orders };
  } catch {
    return { profile: fallbackProfile, orders: [] };
  }
}
