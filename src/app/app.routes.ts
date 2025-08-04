import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'teacher'] } }, // Set Home as the default route
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'teacher'] } },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'teacher', component: TeacherDashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'teacher'] } },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'home' } // Redirect any unknown paths to the home page
];
