export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  parent?: number;
  count?: number;
};

export type ProductImage = {
  id: number;
  src: string;
  alt: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  short_description: string;
  description: string;
  permalink: string;
  images: ProductImage[];
  categories: { id: number; name: string; slug: string }[];
  attributes?: { name: string; options: string[] }[];
  stock_status: "instock" | "outofstock" | "onbackorder";
};
