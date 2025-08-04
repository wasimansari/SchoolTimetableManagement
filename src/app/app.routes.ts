import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Set Home as the default route
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'teacher', component: TeacherDashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'home' } // Redirect any unknown paths to the home page
];
