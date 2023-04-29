import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from './models/cart.model';
import { CartService } from './services/cart.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title: string = 'Blue Orange'
  cart: Cart = { items: [] };

  constructor(private cartService: CartService, private authService: AuthService) {}

  ngOnInit() {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
    });
    
    if (!this.authService.isAuthenticated()) {
      localStorage.removeItem('access');
      localStorage.removeItem('id')
    }
  }
}
