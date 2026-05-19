import type { Order } from '../domain';

export interface OrderRepository {
  listOrders(): Promise<readonly Order[]>;
  getOrderById(orderId: string): Promise<Order | null>;
  saveOrder(order: Order): Promise<void>;
}
