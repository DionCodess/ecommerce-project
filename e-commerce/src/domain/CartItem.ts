import { Money } from './Money';
import type { Product } from './Product';

export interface CartItemSnapshot {
  readonly productId: string;
  readonly productName: string;
  readonly unitPriceInCents: number;
  readonly imageUrl: string;
  readonly quantity: number;
}

export class CartItem {
  public constructor(
    public readonly productId: string,
    public readonly productName: string,
    public readonly unitPrice: Money,
    public readonly imageUrl: string,
    public readonly quantity: number,
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Cart item quantity must be a positive integer.');
    }
  }

  public static fromProduct(product: Product, quantity: number = 1): CartItem {
    return new CartItem(product.id, product.name, product.price, product.imageUrl, quantity);
  }

  public static fromSnapshot(snapshot: CartItemSnapshot): CartItem {
    return new CartItem(
      snapshot.productId,
      snapshot.productName,
      new Money(snapshot.unitPriceInCents),
      snapshot.imageUrl,
      snapshot.quantity,
    );
  }

  public withQuantity(quantity: number): CartItem {
    return new CartItem(this.productId, this.productName, this.unitPrice, this.imageUrl, quantity);
  }

  public subtotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  public toSnapshot(): CartItemSnapshot {
    return {
      productId: this.productId,
      productName: this.productName,
      unitPriceInCents: this.unitPrice.amountInCents,
      imageUrl: this.imageUrl,
      quantity: this.quantity,
    };
  }
}
