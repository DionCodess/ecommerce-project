import { Money } from './Money';

export type ProductCategory = 'electronics' | 'apparel' | 'home' | 'books' | 'fitness';

export interface ProductSnapshot {
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

export class Product {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly category: ProductCategory,
    public readonly imageUrl: string,
    public readonly price: Money,
    public readonly inventoryCount: number,
    public readonly isActive: boolean = true,
    public readonly featured: boolean = false,
  ) {
    if (id.trim().length === 0) {
      throw new Error('Product id is required.');
    }

    if (name.trim().length < 2) {
      throw new Error('Product name must contain at least two characters.');
    }

    if (!Number.isInteger(inventoryCount) || inventoryCount < 0) {
      throw new Error('Product inventory must be a non-negative integer.');
    }
  }

  public static fromSnapshot(snapshot: ProductSnapshot): Product {
    return new Product(
      snapshot.id,
      snapshot.name,
      snapshot.description,
      snapshot.category,
      snapshot.imageUrl,
      new Money(snapshot.priceInCents),
      snapshot.inventoryCount,
      snapshot.isActive,
      snapshot.featured,
    );
  }

  public isInStock(): boolean {
    return this.isActive && this.inventoryCount > 0;
  }

  public matchesSearch(query: string): boolean {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return true;
    }

    return [this.name, this.description, this.category].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    );
  }

  public toSnapshot(): ProductSnapshot {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      imageUrl: this.imageUrl,
      priceInCents: this.price.amountInCents,
      inventoryCount: this.inventoryCount,
      isActive: this.isActive,
      featured: this.featured,
    };
  }
}
