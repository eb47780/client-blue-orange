import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from './services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // check if user is authenticated
    if (!this.authService.isAuthenticated()) {
       // if not, redirect to login page
       this.snackbar.open('Not Authorized', 'Ok', {
        duration: 3000,
      })
      this.router.navigate(['/login']);
      return false; 
    }

    else if (this.authService.isAuthenticated() && localStorage.getItem('cart') !== null) {
      return true;
    } else {
      // if not, redirect to login page
      this.snackbar.open('Add Cart Items', 'Ok', {
        duration: 3000,
      })
      this.router.navigate(['/home']);
      return false;
    }
  }
  
}