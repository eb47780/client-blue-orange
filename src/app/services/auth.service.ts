import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from "rxjs/operators";
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  login(data: any) {  
    return this.http.post<any>('http://localhost:8001/api/token', data).pipe(
      map((token) => {
        console.log(token)
        console.log('token: ' + token.access);
        localStorage.setItem('access', token.access);
        localStorage.setItem('id', token.id);
        return token;
      })
    )
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('id');
  }

  signup(data: any) {
    delete data['confirmPassword'];
    console.log(data);
    return this.http.post<any>('http://localhost:8001/api/clients/v1', data).pipe(
      map((result) => {
        console.log(result);
      })
    )
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access');
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUserId(): any {
    return of(localStorage.getItem('access')).pipe(
      switchMap((jwt: any) => of(this.jwtHelper.decodeToken(jwt)).pipe(
        map((jwt: any) => jwt.user.id)
      )
    ));
  }
}
