import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Product } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  message = 'You are not logged in';
  cols = 3;
  rowHeight: number = ROWS_HEIGHT[this.cols];
  products: Array<Product> | undefined;
  count = '12';
  sort = 'desc';
  category: Category;
  productsSubscription: Subscription | undefined;
  userSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private storeService: StoreService,
    private authService: AuthService,
  ) {}


  ngOnInit(): void {
    this.getProducts();
    if (!this.authService.isAuthenticated()) {
      localStorage.removeItem('cart')
    }
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[colsNum];
  }

  onItemsCountChange(count: number): void {
    this.count = count.toString();
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }

  onShowCategory(newCategory: Category): void {
    this.category = newCategory;
    this.getProducts();
  }

  getProducts(): void {
    this.products = this.testList
    console.log(this.products)

    this.productsSubscription = this.storeService
      .getAllProducts()
      .subscribe((_products) => {
        // this.products = _products.results;


      });
  }

  testList: any = [{
    id: 1,
    title: 'Dorant',
    price: 2.5,
    category: {
      id: "1",
      name: "Sport",
      slug: "test"
    },
    description: 'text',
    image: '../../',
  },{
    id: 2,
    title: 'Dorant',
    price: 2.5,
    category: {
      id: "1",
      name: "Sport",
      slug: "test"
    },
    description: 'text',
    image: '../../',
  }]

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
