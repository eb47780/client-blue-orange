import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });

  constructor(private _snackBar: MatSnackBar) {
    // Load cart data from local storage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart.next(JSON.parse(storedCart));
    }
  }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });

    // Save cart data to local storage
    localStorage.setItem('cart', JSON.stringify(this.cart.value));
  }

  removeFromCart(item: CartItem, updateCart = true): CartItem[] {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (updateCart) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open('1 item removed from cart.', 'Ok', {
        duration: 3000,
      });

      // Save cart data to local storage
      localStorage.setItem('cart', JSON.stringify(this.cart.value));
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval!: CartItem;

    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;
        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }

      return _item;
    });

    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item removed from cart.', 'Ok', {
      duration: 3000,
    });

    // Save cart data to local storage
    localStorage.setItem('cart', JSON.stringify(this.cart.value));
  }

  clearCart(size?: any): void {
    if(size > 0){
      this.cart.next({ items: [] });
      this._snackBar.open('Cart is cleared.', 'Ok', {
        duration: 3000,
      });
      // Remove cart data from local storage
      localStorage.removeItem('cart');
    }else{
      this.cart.next({ items: [] });
      this._snackBar.open('Cart is empty.', 'Ok', {
        duration: 3000,
      });

      // Remove cart data from local storage
      localStorage.removeItem('cart');
    }
  }
  navigationtToaster(path: any){
    this._snackBar.open('Navigation to '+path, 'Ok', {
      duration: 3000,
    });
  }

  getTotal(items: CartItem[]): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }
}
