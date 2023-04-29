import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) { }

    // User's address
  private _address: Address | any;

  // User's card details
  private _cardDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});


  // Set user's address
  setAddress(data: any) {
    const address_posted = {
      street: data.street,
      street_number: data.street_number,
      city: data.city,
      zipcode: data.zipcode,
      customer: localStorage.getItem('id')
    }
    return this.http.post<Address>('http://localhost:8001/api/address/v1', address_posted)
  }

  // Get user's address
  getAddress(): any {
    return this.http.get<any[]>('http://localhost:8001/api/address/v1')
  }

  // Set user's card details
  setCardDetails(cardDetails: any) {
    this._cardDetails.next(cardDetails);
  }

  updateAddress(id:string, data: Address) {
    const address_posted = {
      street: data.street,
      street_number: data.street_number,
      city: data.city,
      zipcode: data.zipcode,
      customer: localStorage.getItem('id')
    }
    return this.http.put<Address>('http://localhost:8001/api/address/'+ id, address_posted);
  }

  deleteAddress(id: string): any {
    return this.http.delete('http://localhost:8001/api/address/'+ id);
  }

  // Get user's card details
  getCardDetails() {
    return this._cardDetails.asObservable();
  }

  checkout(data: any): Observable<any>{
    return this.http.post('http://localhost:8004/api/checkouts/v1', data);
  }

  getCheckout(id: any): Observable<any> {
    return this.http.get('http://localhost:8004/api/checkout/' + id);
  }

  getStatusName(id: any): any {
    return this.http.get('http://localhost:8004/api/status/' + id);
  }
}
