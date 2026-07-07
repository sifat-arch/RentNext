import { PropertyWhereInput } from "../../../generated/prisma/models";

export interface IProperty {
  title: string;
  location: string;
  price: number;
  description: string;
  landlordId: string;
  categoryId: string;
}
export interface IPropertyUpdate {
  title?: string;
  location?: string;
  price?: number;
  description?: string;
}

export interface IPropertyQuery extends PropertyWhereInput {
  search?: string;

  minPrice?: string;
  maxPrice?: string;

  sortBy?: "price" | "createdAt";
  sortOrder?: "asc" | "desc";

  page?: string;
  limit?: string;
}
