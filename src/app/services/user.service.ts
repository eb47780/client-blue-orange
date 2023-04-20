import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(id: string | null): Observable<User> {
    return this.http.get('http://localhost:8001/api/client/' + id).pipe(
      map((user:User) => user)
    )
  }

}
