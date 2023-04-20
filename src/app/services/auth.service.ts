import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor(private http: HttpClient) { }

  onLogin(data: any):Observable<any> {
    return this.http.post(`http://localhost:8001/api/token`, data)
  }

  getUser(url: string): Observable<any> {
    return this.http.get(url)
  }

}
