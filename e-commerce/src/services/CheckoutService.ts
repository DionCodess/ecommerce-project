import { Order, type Cart, type CustomerDetails } from '../domain';
import type { OrderRepository } from '../repositories';

export class CheckoutService {
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async completeDummyPayment(cart: Cart, customer: CustomerDetails): Promise<Order> {
    const order = Order.create(this.createOrderId(), cart, customer);
    await this.orderRepository.saveOrder(order);
    return order;
  }

  private createOrderId(): string {
    const randomValue = crypto.randomUUID();
    return `order-${randomValue}`;
  }
}
