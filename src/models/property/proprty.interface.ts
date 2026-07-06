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
