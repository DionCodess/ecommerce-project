import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import { Order, type OrderSnapshot } from '../domain';
import type { OrderRepository } from './OrderRepository';

const ORDER_COLLECTION = 'orders';

export class FirestoreOrderRepository implements OrderRepository {
  public constructor(private readonly firestore: Firestore) {}

  public async listOrders(): Promise<readonly Order[]> {
    const ordersQuery = query(
      collection(this.firestore, ORDER_COLLECTION),
      orderBy('createdAtIso', 'desc'),
    );
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map((orderDoc) => Order.fromSnapshot(orderDoc.data() as OrderSnapshot));
  }

  public async getOrderById(orderId: string): Promise<Order | null> {
    const orderDoc = await getDoc(doc(this.firestore, ORDER_COLLECTION, orderId));
    return orderDoc.exists() ? Order.fromSnapshot(orderDoc.data() as OrderSnapshot) : null;
  }

  public async saveOrder(order: Order): Promise<void> {
    await setDoc(doc(this.firestore, ORDER_COLLECTION, order.id), order.toSnapshot());
  }
}
