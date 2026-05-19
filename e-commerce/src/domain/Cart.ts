import type { CartItemSnapshot } from './CartItem';
import { CartItem } from './CartItem';
import { Money } from './Money';
import type { Product } from './Product';

export interface CartSnapshot {
  readonly items: readonly CartItemSnapshot[];
}

export class Cart {
  public constructor(private readonly itemsByProductId: ReadonlyMap<string, CartItem> = new Map()) {}

  public static empty(): Cart {
    return new Cart();
  }

  public static fromSnapshot(snapshot: CartSnapshot): Cart {
    const items = snapshot.items.map((item) => CartItem.fromSnapshot(item));
    return new Cart(new Map(items.map((item) => [item.productId, item])));
  }

  public addProduct(product: Product, quantity: number = 1): Cart {
    if (!product.isInStock()) {
      throw new Error('Cannot add an inactive or out-of-stock product to the cart.');
    }

    const existingItem = this.itemsByProductId.get(product.id);
    const nextQuantity = (existingItem?.quantity ?? 0) + quantity;

    return this.replaceItem(CartItem.fromProduct(product, nextQuantity));
  }

  public updateQuantity(productId: string, quantity: number): Cart {
    const existingItem = this.itemsByProductId.get(productId);

    if (!existingItem) {
      return this;
    }

    if (quantity <= 0) {
      return this.removeProduct(productId);
    }

    return this.replaceItem(existingItem.withQuantity(quantity));
  }

  public removeProduct(productId: string): Cart {
    const nextItems = new Map(this.itemsByProductId);
    nextItems.delete(productId);
    return new Cart(nextItems);
  }

  public clear(): Cart {
    return Cart.empty();
  }

  public items(): readonly CartItem[] {
    return Array.from(this.itemsByProductId.values());
  }

  public itemCount(): number {
    return this.items().reduce((total, item) => total + item.quantity, 0);
  }

  public total(): Money {
    return this.items().reduce((total, item) => total.add(item.subtotal()), new Money(0));
  }

  public isEmpty(): boolean {
    return this.itemsByProductId.size === 0;
  }

  public toSnapshot(): CartSnapshot {
    return {
      items: this.items().map((item) => item.toSnapshot()),
    };
  }

  private replaceItem(item: CartItem): Cart {
    const nextItems = new Map(this.itemsByProductId);
    nextItems.set(item.productId, item);
    return new Cart(nextItems);
  }
}
