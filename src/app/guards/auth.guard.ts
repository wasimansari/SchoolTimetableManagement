import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRoles = route.data['roles'] as Array<string>;

    return this.authService.userWithRole.pipe(
      take(1),
      map(user => {
        const isAuthenticated = !!user;
        if (!isAuthenticated) {
          return this.router.createUrlTree(['/login']);
        }

        if (expectedRoles && !expectedRoles.includes(user?.role || '')) {
          // Redirect to home or an unauthorized page if role doesn't match
          return this.router.createUrlTree(['/home']);
        }

        return true;
      })
    );
  }
}

