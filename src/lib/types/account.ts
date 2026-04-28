export type AccountProfile = {
  id: string;
  name: string;
  email: string;
};

export type AccountOrderItem = {
  productId: number;
  name: string;
  slug: string;
  quantity: number;
  unitPrice: string;
};

export type AccountOrder = {
  id: string;
  number: string;
  status: string;
  date: string;
  total: string;
  currency: string;
  items: AccountOrderItem[];
};
