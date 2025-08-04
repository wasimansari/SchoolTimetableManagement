import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, authState, User } from '@angular/fire/auth';
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

  registerUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}