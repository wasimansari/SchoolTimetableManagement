import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SchoolTimetableManagement';
  isLoggedIn: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authState.subscribe(user => {
      this.isLoggedIn = !!user;
      console.log('User logged in status:', this.isLoggedIn);
      console.log('Current user:', user);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
