import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, authState, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';

interface UserWithRole extends User {
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: Observable<User | null>;
  userWithRole: Observable<UserWithRole | null>;

  constructor(private auth: Auth, private firestoreService: FirestoreService) {
    this.authState = authState(this.auth);
    this.userWithRole = this.authState.pipe(
      switchMap(async user => {
        if (user) {
          const userData = await this.firestoreService.getUserData(user.uid);
          return { ...user, role: userData?.['role'] };
        } else {
          return null;
        }
      })
    );
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);
    const user = userCredential.user;

    // Check if the user already exists in Firestore
    const existingUser = await this.firestoreService.getUserData(user.uid);
    if (!existingUser) {
      // If the user doesn't exist, save their data to Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: 'teacher' // Default role for Google login
      };
      await this.firestoreService.saveUserData(user.uid, userData);
    }

    return userCredential;
  }

  registerUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}