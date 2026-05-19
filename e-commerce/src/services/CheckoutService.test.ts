import { describe, expect, it } from 'vitest';
import { Cart, Money, Product, type Order } from '../domain';
import type { OrderRepository } from '../repositories';
import { CheckoutService } from './CheckoutService';

class FakeOrderRepository implements OrderRepository {
  public savedOrder: Order | null = null;

  public listOrders(): Promise<readonly Order[]> {
    return Promise.resolve(this.savedOrder ? [this.savedOrder] : []);
  }

  public getOrderById(orderId: string): Promise<Order | null> {
    return Promise.resolve(this.savedOrder?.id === orderId ? this.savedOrder : null);
  }

  public saveOrder(order: Order): Promise<void> {
    this.savedOrder = order;
    return Promise.resolve();
  }
}

describe('CheckoutService', () => {
  it('creates a paid dummy order from a non-empty cart', async () => {
    const repository = new FakeOrderRepository();
    const service = new CheckoutService(repository);
    const product = new Product(
      'prod-checkout',
      'Checkout Product',
      'A product for checkout behavior.',
      'electronics',
      '/test.jpg',
      new Money(2500),
      3,
    );
    const cart = Cart.empty().addProduct(product, 2);

    const order = await service.completeDummyPayment(cart, {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      address: '123 Typed Way',
    });

    expect(order.status).toBe('paid');
    expect(order.total.amountInCents).toBe(5000);
    expect(repository.savedOrder?.id).toBe(order.id);
  });
});
