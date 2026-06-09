import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, writeBatch, query, where } from 'firebase/firestore';
import { firebaseConfig } from '../../environments/firebase-config';

export interface AuthUser {
  id: string;
  name: string; // first name
  username: string;
  password: string;
  isAdmin: boolean;
}

/**
 * AuthenticationService handles a very lightweight auth flow for the prediction app.
 * It generates a username from the provided first name, creates a random 6‑character
 * password and stores the credentials in the Firestore `users` collection. The admin
 * user is recognised by the exact full name "Srijay Tuladhar" and is granted the
 * ability to view all credentials in the admin panel.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private app = initializeApp(firebaseConfig);
  private db = getFirestore(this.app);

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();

  constructor() {
    // Restore session on startup
    const stored = localStorage.getItem('authUser');
    if (stored) {
      try {
        const user = JSON.parse(stored) as AuthUser;
        // Keep dynamic isAdmin calculation or rely on stored status
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem('authUser');
      }
    }
  }

  /** Login with explicit credentials */
  async loginWithCredentials(username: string, password: string): Promise<AuthUser> {
    const q = query(collection(this.db, 'users'), where('username', '==', username));
    const userDoc = await getDocs(q);
    if (userDoc.empty) {
      throw new Error('User not found');
    }
    const userSnap = userDoc.docs[0];
    const user = userSnap.data() as AuthUser;
    console.log(user.password)
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    // Persist login
    localStorage.setItem('authUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return user;
  }

  /** Admin can add new users */
  async addUser(username: string, password: string, name: string): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('Only admin can add users');
    }
    const newUser: AuthUser = {
      id: username,
      name,
      username,
      password,
      isAdmin: false
    };
    await setDoc(doc(this.db, 'users', username), newUser);
  }

  /** Admin can update existing user credentials */
  async updateUserCredentials(userId: string, updates: Partial<AuthUser>): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('Only admin can update user credentials');
    }
    const userRef = doc(this.db, 'users', userId);
    await setDoc(userRef, updates, { merge: true });
    
    // If the updated user is currently logged in, update localStorage and behavior subject too
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updated = { ...currentUser, ...updates };
      localStorage.setItem('authUser', JSON.stringify(updated));
      this.currentUserSubject.next(updated);
    }
  }


  /** Generate a username from first name (lower‑cased) */
  private generateUsername(firstName: string): string {
    return firstName.trim().toLowerCase();
  }

  /** Generate a random 6‑character alphanumeric password */
  private generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pwd = '';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  }

  /** Create or fetch a user record, store credentials, and set as logged‑in */
  async login(firstName: string): Promise<AuthUser> {
    const username = this.generateUsername(firstName);
    const password = this.generatePassword();
    const isAdmin = firstName.trim() === 'Srijay Tuladhar';
    // Check if user already exists (by username)
    const q = query(collection(this.db, 'users'), where('username', '==', username));
    const existingSnap = await getDocs(q);
    let user: AuthUser;
    if (!existingSnap.empty) {
      // Use existing user data (keep stored password)
      const existing = existingSnap.docs[0].data() as AuthUser;
      user = { ...existing, isAdmin };
    } else {
      // Create new user document
      const newUser: AuthUser = {
        id: username,
        name: firstName.trim(),
        username,
        password,
        isAdmin
      };
      await setDoc(doc(this.db, 'users', username), newUser);
      user = newUser;
    }
    // Persist locally for session
    localStorage.setItem('authUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return user;
  }

  logout(): void {
    localStorage.removeItem('authUser');
    this.currentUserSubject.next(null);
  }

  /** Helpers */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.getValue();
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.getValue();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.getValue();
    return !!user?.isAdmin;
  }

  /** Retrieve all user credentials – used by admin panel */
  async getAllUsers(): Promise<AuthUser[]> {
    const snapshot = await getDocs(collection(this.db, 'users'));
    const users: AuthUser[] = [];
    snapshot.forEach(docSnap => users.push(docSnap.data() as AuthUser));
    return users;
  }
}
