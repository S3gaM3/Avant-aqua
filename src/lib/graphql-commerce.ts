import { gql } from "graphql-request";
import type { Product, ProductCategory } from "@/lib/types/commerce";
import { createGraphqlClient } from "@/lib/graphql-client";

type GqlCategoryNode = {
  databaseId: number;
  name: string;
  slug: string;
  parentId?: number | null;
  count?: number | null;
};

type GqlProductNode = {
  databaseId: number;
  name: string;
  slug: string;
  sku?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER" | null;
  image?: { node?: { sourceUrl?: string | null; altText?: string | null } | null } | null;
  galleryImages?: {
    nodes?: Array<{ sourceUrl?: string | null; altText?: string | null }>;
  } | null;
  productCategories?: {
    nodes?: Array<{ databaseId: number; name: string; slug: string }>;
  } | null;
  attributes?: {
    nodes?: Array<{ name?: string | null; options?: string[] | null }>;
  } | null;
};

const LIST_QUERY = gql`
  query ProductsAndCategories($first: Int!, $after: String, $categorySlug: String) {
    productCategories(first: 100) {
      nodes {
        databaseId
        name
        slug
        parentId
        count
      }
    }
    products(first: $first, after: $after, where: { category: $categorySlug, status: PUBLISH }) {
      nodes {
        databaseId
        name
        slug
        sku
        shortDescription
        description
        stockStatus
        ... on SimpleProduct {
          regularPrice
          price
          salePrice
        }
        ... on VariableProduct {
          regularPrice
          price
          salePrice
        }
        image {
          node {
            sourceUrl
            altText
          }
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            databaseId
            name
            slug
          }
        }
        attributes {
          nodes {
            name
            options
          }
        }
      }
    }
  }
`;

const BY_SLUG_QUERY = gql`
  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      databaseId
      name
      slug
      sku
      shortDescription
      description
      stockStatus
      ... on SimpleProduct {
        regularPrice
        price
        salePrice
      }
      ... on VariableProduct {
        regularPrice
        price
        salePrice
      }
      image {
        node {
          sourceUrl
          altText
        }
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          databaseId
          name
          slug
        }
      }
      attributes {
        nodes {
          name
          options
        }
      }
    }
  }
`;

const SEARCH_QUERY = gql`
  query SearchProducts($search: String!, $first: Int!) {
    products(first: $first, where: { search: $search, status: PUBLISH }) {
      nodes {
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
        image {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

function stockFromGql(value: string | null | undefined): Product["stock_status"] {
  if (value === "IN_STOCK") return "instock";
  if (value === "ON_BACKORDER") return "onbackorder";
  return "outofstock";
}

function priceToRaw(value: string | null | undefined): string {
  if (!value) return "0";
  return value.replace(/[^\d.,-]/g, "").replace(",", ".") || "0";
}

function mapProduct(node: Record<string, unknown>): Product {
  const product = node as GqlProductNode & {
    price?: string | null;
    regularPrice?: string | null;
    salePrice?: string | null;
  };
  const gallery = product.galleryImages?.nodes ?? [];
  const imageList = [
    ...(product.image?.node?.sourceUrl
      ? [
          {
            id: product.databaseId,
            src: product.image.node.sourceUrl,
            alt: product.image.node.altText ?? product.name,
          },
        ]
      : []),
    ...gallery
      .filter((img) => Boolean(img?.sourceUrl))
      .map((img, index) => ({
        id: product.databaseId * 100 + index,
        src: img.sourceUrl!,
        alt: img.altText ?? product.name,
      })),
  ];

  return {
    id: product.databaseId,
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? "",
    price: priceToRaw(product.price),
    regular_price: priceToRaw(product.regularPrice),
    sale_price: priceToRaw(product.salePrice),
    short_description: product.shortDescription ?? "",
    description: product.description ?? "",
    permalink: `/catalog/product/${product.slug}`,
    images: imageList,
    categories: (product.productCategories?.nodes ?? []).map((c) => ({
      id: c.databaseId,
      name: c.name,
      slug: c.slug,
    })),
    attributes: (product.attributes?.nodes ?? [])
      .filter((a) => Boolean(a.name))
      .map((a) => ({
        name: a.name ?? "",
        options: (a.options ?? []).filter(Boolean),
      })),
    stock_status: stockFromGql(product.stockStatus),
  };
}

export async function fetchProductsGraphql(params?: {
  category?: string;
  perPage?: number;
}): Promise<Product[] | null> {
  const client = createGraphqlClient();
  if (!client) return null;
  try {
    const data = await client.request<{
      products?: { nodes?: Record<string, unknown>[] };
    }>(LIST_QUERY, {
      first: params?.perPage ?? 24,
      categorySlug: params?.category ?? null,
      after: null,
    });
    return (data.products?.nodes ?? []).map(mapProduct);
  } catch {
    return null;
  }
}

export async function fetchCategoriesGraphql(): Promise<ProductCategory[] | null> {
  const client = createGraphqlClient();
  if (!client) return null;
  try {
    const data = await client.request<{
      productCategories?: { nodes?: GqlCategoryNode[] };
    }>(LIST_QUERY, { first: 1, after: null, categorySlug: null });
    return (data.productCategories?.nodes ?? []).map((c) => ({
      id: c.databaseId,
      name: c.name,
      slug: c.slug,
      parent: c.parentId ?? 0,
      count: c.count ?? 0,
    }));
  } catch {
    return null;
  }
}

export async function fetchProductBySlugGraphql(slug: string): Promise<Product | null> {
  const client = createGraphqlClient();
  if (!client) return null;
  try {
    const data = await client.request<{ product?: Record<string, unknown> | null }>(BY_SLUG_QUERY, {
      slug,
    });
    if (!data.product) return null;
    return mapProduct(data.product);
  } catch {
    return null;
  }
}

export type ProductSearchHit = {
  id: number;
  slug: string;
  name: string;
  price: string;
  image: string | null;
};

export async function searchProductsGraphql(
  search: string,
  limit = 6,
): Promise<ProductSearchHit[]> {
  const client = createGraphqlClient();
  if (!client || !search.trim()) return [];
  try {
    const data = await client.request<{
      products?: { nodes?: Array<Record<string, unknown>> };
    }>(SEARCH_QUERY, {
      search,
      first: limit,
    });
    return (data.products?.nodes ?? []).map((item) => {
      const node = item as {
        databaseId: number;
        name: string;
        slug: string;
        price?: string | null;
        image?: { node?: { sourceUrl?: string | null } | null } | null;
      };
      return {
        id: node.databaseId,
        slug: node.slug,
        name: node.name,
        price: priceToRaw(node.price),
        image: node.image?.node?.sourceUrl ?? null,
      };
    });
  } catch {
    return [];
  }
}
