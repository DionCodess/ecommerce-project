import { describe, expect, it } from 'vitest';
import { Cart, Money, Product } from '../domain';

describe('Cart', () => {
  it('calculates totals and item counts with typed money values', () => {
    const product = new Product(
      'prod-test',
      'Test Product',
      'A product for cart behavior.',
      'books',
      '/test.jpg',
      new Money(1299),
      5,
    );

    const cart = Cart.empty().addProduct(product, 2).addProduct(product, 1);

    expect(cart.itemCount()).toBe(3);
    expect(cart.total().amountInCents).toBe(3897);
  });

  it('removes an item when quantity is set to zero', () => {
    const product = new Product(
      'prod-remove',
      'Remove Product',
      'A product for removal behavior.',
      'home',
      '/test.jpg',
      new Money(500),
      5,
    );

    const cart = Cart.empty().addProduct(product).updateQuantity(product.id, 0);

    expect(cart.isEmpty()).toBe(true);
  });
});
