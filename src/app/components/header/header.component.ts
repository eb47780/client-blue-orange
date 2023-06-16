import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;

  private id = localStorage.getItem('id');

  user$: Observable<User> = this.userService.getUser(this.id)

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items.map((item) => item.quantity).reduce((prev, curent) => prev + curent, 0);
  }

  constructor(private cartService: CartService, private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService) {}

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  logout() {
    this.authService.logout();
    window.location.href="http://localhost:4200/home"

  }

  onClearCart(items?: any): void {
    this.cartService.clearCart(items.length);
  }
  navigationToaster(path: any){
    this.cartService.navigationtToaster(path)
  }

  navigateToProfile() {
    this.router.navigate(['user/'], {relativeTo: this.activatedRoute});
  }
  
  onCheckout(): void {
    window.location.href='http://localhost:4200/checkout'
  }
}
