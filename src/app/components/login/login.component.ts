import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TimetableService } from '../../services/timetable.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode: boolean = true;
  email!: string;
  password!: string;
  name!: string;
  subject: string = ''; // Optional for teachers
  role: string = 'teacher'; // Default role

  constructor(
    private authService: AuthService,
    private timetableService: TimetableService,
    private router: Router
  ) { }

  async onLogin() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      // Handle successful login, e.g., navigate to home or dashboard
      console.log('User logged in:', userCredential.user);
      this.router.navigate(['/home']); // Navigate to home after login
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  }

  async onRegister() {
    try {
      const userCredential = await this.authService.registerUser(this.email, this.password);
      const uid = userCredential.user.uid;

      // Save user details to Firestore
      const userData: any = {
        email: this.email,
        name: this.name,
        role: this.role
      };

      if (this.role === 'teacher') {
        userData.subject = this.subject;
      }

      await this.timetableService.saveUser(uid, userData);

      console.log('User registered:', userCredential.user);
      alert('Registration successful! You can now log in.');
      this.isLoginMode = true; // Switch to login mode after registration
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  }
}