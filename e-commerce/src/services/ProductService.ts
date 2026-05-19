import { Money, Product, type ProductCategory } from '../domain';
import type { ProductFilter, ProductRepository } from '../repositories';

export interface ProductFormInput {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ProductCategory;
  readonly imageUrl: string;
  readonly priceInCents: number;
  readonly inventoryCount: number;
  readonly isActive: boolean;
  readonly featured: boolean;
}

export class ProductService {
  public constructor(private readonly productRepository: ProductRepository) {}

  public async getAvailableProducts(filter: ProductFilter): Promise<readonly Product[]> {
    const products = await this.productRepository.listProducts();

    return products.filter((product) => {
      const categoryMatches = filter.category === 'all' || product.category === filter.category;
      return product.isInStock() && categoryMatches && product.matchesSearch(filter.query);
    });
  }

  public async getProduct(productId: string): Promise<Product | null> {
    return this.productRepository.getProductById(productId);
  }

  public async listAllProducts(): Promise<readonly Product[]> {
    return this.productRepository.listProducts();
  }

  public async saveFromInput(input: ProductFormInput): Promise<Product> {
    const product = new Product(
      input.id,
      input.name,
      input.description,
      input.category,
      input.imageUrl,
      new Money(input.priceInCents),
      input.inventoryCount,
      input.isActive,
      input.featured,
    );

    await this.productRepository.saveProduct(product);
    return product;
  }

  public async deleteProduct(productId: string): Promise<void> {
    await this.productRepository.deleteProduct(productId);
  }
}
