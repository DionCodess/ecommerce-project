export type UserRole = 'shopper' | 'admin';

export interface UserProfileSnapshot {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly role: UserRole;
}

export class UserProfile {
  public constructor(
    public readonly id: string,
    public readonly displayName: string,
    public readonly email: string,
    public readonly role: UserRole,
  ) {
    if (!email.includes('@')) {
      throw new Error('User profile requires a valid email address.');
    }
  }

  public static fromSnapshot(snapshot: UserProfileSnapshot): UserProfile {
    return new UserProfile(snapshot.id, snapshot.displayName, snapshot.email, snapshot.role);
  }

  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  public toSnapshot(): UserProfileSnapshot {
    return {
      id: this.id,
      displayName: this.displayName,
      email: this.email,
      role: this.role,
    };
  }
}
