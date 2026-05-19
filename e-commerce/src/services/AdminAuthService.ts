import { signInWithEmailAndPassword, signOut, type Auth } from 'firebase/auth';

export interface AdminSession {
  readonly email: string;
  readonly firebaseBacked: boolean;
}

export class AdminAuthService {
  private localSession: AdminSession | null = {
    email: 'local-admin@example.com',
    firebaseBacked: false,
  };

  public constructor(private readonly auth: Auth | null) {}

  public currentSession(): AdminSession | null {
    if (!this.auth) {
      return this.localSession;
    }

    const currentUser = this.auth.currentUser;
    return currentUser?.email ? { email: currentUser.email, firebaseBacked: true } : null;
  }

  public async signIn(email: string, password: string): Promise<AdminSession> {
    if (!this.auth) {
      this.localSession = { email, firebaseBacked: false };
      return this.localSession;
    }

    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const userEmail = credential.user.email;

    if (!userEmail) {
      throw new Error('Firebase admin user must have an email address.');
    }

    return { email: userEmail, firebaseBacked: true };
  }

  public async signOut(): Promise<void> {
    if (!this.auth) {
      this.localSession = null;
      return;
    }

    await signOut(this.auth);
  }
}
