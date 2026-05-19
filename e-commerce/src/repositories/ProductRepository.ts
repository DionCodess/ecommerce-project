import type { Product, ProductCategory } from '../domain';

export interface ProductFilter {
  readonly query: string;
  readonly category: ProductCategory | 'all';
}

export interface ProductRepository {
  listProducts(): Promise<readonly Product[]>;
  getProductById(productId: string): Promise<Product | null>;
  saveProduct(product: Product): Promise<void>;
  deleteProduct(productId: string): Promise<void>;
}
