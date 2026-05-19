import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { SampleProductCatalog } from '../src/data/sampleProducts';

interface ServiceAccountJson {
  readonly project_id: string;
  readonly client_email: string;
  readonly private_key: string;
}

class FirestoreSeeder {
  public constructor(serviceAccount: ServiceAccountJson) {
    initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
    });
  }

  public async seedProducts(): Promise<void> {
    const firestore = getFirestore();
    const batch = firestore.batch();

    for (const product of new SampleProductCatalog().createProducts()) {
      const productRef = firestore.collection('products').doc(product.id);
      batch.set(productRef, product.toSnapshot());
    }

    await batch.commit();
  }
}

function readServiceAccount(): ServiceAccountJson {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!rawServiceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is required to seed Firestore.');
  }

  return JSON.parse(rawServiceAccount) as ServiceAccountJson;
}

const seeder = new FirestoreSeeder(readServiceAccount());
await seeder.seedProducts();
console.log('Seeded Firestore products.');
