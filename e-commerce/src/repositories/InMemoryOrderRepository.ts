import { Order, type OrderSnapshot } from '../domain';
import type { OrderRepository } from './OrderRepository';

const STORAGE_KEY = 'cs491-ecommerce-orders';

export class InMemoryOrderRepository implements OrderRepository {
  private ordersById: Map<string, Order> = new Map();

  public constructor() {
    this.restoreFromStorage();
  }

  public listOrders(): Promise<readonly Order[]> {
    return Promise.resolve(
      Array.from(this.ordersById.values()).sort(
        (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
      ),
    );
  }

  public getOrderById(orderId: string): Promise<Order | null> {
    return Promise.resolve(this.ordersById.get(orderId) ?? null);
  }

  public saveOrder(order: Order): Promise<void> {
    this.ordersById.set(order.id, order);
    this.persist();
    return Promise.resolve();
  }

  private restoreFromStorage(): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    const rawOrders = window.localStorage.getItem(STORAGE_KEY);

    if (!rawOrders) {
      return;
    }

    const snapshots = JSON.parse(rawOrders) as OrderSnapshot[];
    const orders = snapshots.map((snapshot) => Order.fromSnapshot(snapshot));
    this.ordersById = new Map(orders.map((order) => [order.id, order]));
  }

  private persist(): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    const snapshots = Array.from(this.ordersById.values()).map((order) => order.toSnapshot());
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
