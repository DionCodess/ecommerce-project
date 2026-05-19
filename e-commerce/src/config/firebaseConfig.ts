import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export interface FirebaseClientConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly appId: string;
}

export class FirebaseConfigFactory {
  public fromEnvironment(): FirebaseClientConfig {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }
}

export class FirebaseClient {
  public readonly app: FirebaseApp;
  public readonly auth: Auth;
  public readonly firestore: Firestore;

  public constructor(config: FirebaseClientConfig = new FirebaseConfigFactory().fromEnvironment()) {
    this.app = initializeApp(config);
    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);
  }
}
