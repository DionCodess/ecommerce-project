import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import { Product, type ProductSnapshot } from '../domain';
import type { ProductRepository } from './ProductRepository';

const PRODUCT_COLLECTION = 'products';

export class FirestoreProductRepository implements ProductRepository {
  public constructor(private readonly firestore: Firestore) {}

  public async listProducts(): Promise<readonly Product[]> {
    const snapshot = await getDocs(collection(this.firestore, PRODUCT_COLLECTION));
    return snapshot.docs.map((productDoc) => Product.fromSnapshot(productDoc.data() as ProductSnapshot));
  }

  public async getProductById(productId: string): Promise<Product | null> {
    const productDoc = await getDoc(doc(this.firestore, PRODUCT_COLLECTION, productId));
    return productDoc.exists() ? Product.fromSnapshot(productDoc.data() as ProductSnapshot) : null;
  }

  public async saveProduct(product: Product): Promise<void> {
    await setDoc(doc(this.firestore, PRODUCT_COLLECTION, product.id), product.toSnapshot());
  }

  public async deleteProduct(productId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, PRODUCT_COLLECTION, productId));
  }
}
