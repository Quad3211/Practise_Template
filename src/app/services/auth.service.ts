import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    // Initialize Firebase
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);

    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  // Register new user
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Login user
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.userSubject.value;
  }
}
