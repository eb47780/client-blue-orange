import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

const STORE_BASE_URL = 'http://localhost:8002/api';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private httpClient: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.httpClient.get<Array<Product>>(
      `${STORE_BASE_URL}/products/v1`
    );
  }

  getAllCategories(): Observable<any> {
    return this.httpClient.get<any>(
      `${STORE_BASE_URL}/categories/v1`
    );
  }
  
}
