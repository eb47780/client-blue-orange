import { Component, Input } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  private _user: User;
  itemsQuantity = 0;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  @Input()
  get user(): User {
    console.log(this._user)
    return this._user
  }

  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, curent) => prev + curent, 0);
  }

  constructor(private cartService: CartService) {}

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }
}
