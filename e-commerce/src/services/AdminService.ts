import type { Order, OrderStatus, Product } from '../domain';
import type { OrderRepository, ProductRepository } from '../repositories';

export interface DashboardMetrics {
  readonly productCount: number;
  readonly activeProductCount: number;
  readonly orderCount: number;
  readonly revenueInCents: number;
}

export class AdminService {
  public constructor(
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  public async getProducts(): Promise<readonly Product[]> {
    return this.productRepository.listProducts();
  }

  public async getOrders(): Promise<readonly Order[]> {
    return this.orderRepository.listOrders();
  }

  public async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [products, orders] = await Promise.all([
      this.productRepository.listProducts(),
      this.orderRepository.listOrders(),
    ]);

    return {
      productCount: products.length,
      activeProductCount: products.filter((product) => product.isActive).length,
      orderCount: orders.length,
      revenueInCents: orders.reduce((total, order) => total + order.total.amountInCents, 0),
    };
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error('Order not found.');
    }

    const updatedOrder = order.withStatus(status);
    await this.orderRepository.saveOrder(updatedOrder);
    return updatedOrder;
  }
}
