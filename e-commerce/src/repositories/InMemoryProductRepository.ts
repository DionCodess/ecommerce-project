import { Product, type ProductSnapshot } from '../domain';
import { SampleProductCatalog } from '../data/sampleProducts';
import type { ProductRepository } from './ProductRepository';

const STORAGE_KEY = 'cs491-ecommerce-products';

export class InMemoryProductRepository implements ProductRepository {
  private productsById: Map<string, Product>;

  public constructor(initialProducts: readonly Product[] = new SampleProductCatalog().createProducts()) {
    this.productsById = new Map(initialProducts.map((product) => [product.id, product]));
    this.restoreFromStorage();
  }

  public listProducts(): Promise<readonly Product[]> {
    return Promise.resolve(Array.from(this.productsById.values()));
  }

  public getProductById(productId: string): Promise<Product | null> {
    return Promise.resolve(this.productsById.get(productId) ?? null);
  }

  public saveProduct(product: Product): Promise<void> {
    this.productsById.set(product.id, product);
    this.persist();
    return Promise.resolve();
  }

  public deleteProduct(productId: string): Promise<void> {
    this.productsById.delete(productId);
    this.persist();
    return Promise.resolve();
  }

  private restoreFromStorage(): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    const rawProducts = window.localStorage.getItem(STORAGE_KEY);

    if (!rawProducts) {
      return;
    }

    const snapshots = JSON.parse(rawProducts) as ProductSnapshot[];
    const products = snapshots.map((snapshot) => Product.fromSnapshot(snapshot));
    this.productsById = new Map(products.map((product) => [product.id, product]));
  }

  private persist(): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    const snapshots = Array.from(this.productsById.values()).map((product) => product.toSnapshot());
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  }

  private hasLocalStorage(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage.getItem === 'function' &&
      typeof window.localStorage.setItem === 'function'
    );
  }
}
