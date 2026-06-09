import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: any, state: any): boolean | UrlTree |
    Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn()) {
      // If navigating to admin panel, enforce admin privileges
      if (state.url.startsWith('/admin')) {
        if (this.authService.isAdmin()) {
          return true;
        } else {
          // Clear credentials and log out if a non-admin attempts to access admin route
          this.authService.logout();
          return this.router.createUrlTree(['/login']);
        }
      }
      return true;
    }
    // Redirect to login page if not authenticated
    return this.router.createUrlTree(['/login']);
  }
}
