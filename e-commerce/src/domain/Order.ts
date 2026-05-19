import type { Cart, CartSnapshot } from './Cart';
import type { CartItemSnapshot } from './CartItem';
import { CartItem } from './CartItem';
import { Money } from './Money';

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'cancelled';

export interface CustomerDetails {
  readonly fullName: string;
  readonly email: string;
  readonly address: string;
}

export interface OrderSnapshot {
  readonly id: string;
  readonly items: readonly CartItemSnapshot[];
  readonly customer: CustomerDetails;
  readonly status: OrderStatus;
  readonly totalInCents: number;
  readonly createdAtIso: string;
}

export class Order {
  public constructor(
    public readonly id: string,
    public readonly items: readonly CartItem[],
    public readonly customer: CustomerDetails,
    public readonly status: OrderStatus,
    public readonly total: Money,
    public readonly createdAt: Date,
  ) {
    if (items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }

    if (!customer.email.includes('@')) {
      throw new Error('Order customer must have a valid email address.');
    }
  }

  public static create(id: string, cart: Cart, customer: CustomerDetails): Order {
    if (cart.isEmpty()) {
      throw new Error('Cannot create an order from an empty cart.');
    }

    return new Order(id, cart.items(), customer, 'paid', cart.total(), new Date());
  }

  public static fromSnapshot(snapshot: OrderSnapshot): Order {
    return new Order(
      snapshot.id,
      snapshot.items.map((item) => CartItem.fromSnapshot(item)),
      snapshot.customer,
      snapshot.status,
      new Money(snapshot.totalInCents),
      new Date(snapshot.createdAtIso),
    );
  }

  public withStatus(status: OrderStatus): Order {
    return new Order(this.id, this.items, this.customer, status, this.total, this.createdAt);
  }

  public toCartSnapshot(): CartSnapshot {
    return {
      items: this.items.map((item) => item.toSnapshot()),
    };
  }

  public toSnapshot(): OrderSnapshot {
    return {
      id: this.id,
      items: this.items.map((item) => item.toSnapshot()),
      customer: this.customer,
      status: this.status,
      totalInCents: this.total.amountInCents,
      createdAtIso: this.createdAt.toISOString(),
    };
  }
}
