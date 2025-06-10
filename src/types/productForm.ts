
export interface ProductFormData {
  producerLocationId: string;
  productType: string;
  botanicalGroup: string;
  name: string;
  price: number;
  availableQuantity: number;
  containerSize: string;
  description: string;
  attributes: Record<string, any>;
}
