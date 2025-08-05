import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'teacher'] } },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'teacher'] } },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'teacher',
        loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'teacher'] }
    },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'home' }
];
