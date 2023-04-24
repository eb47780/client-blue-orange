import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  checkoutHistory = [
    { orderNumber: 1234, totalPrice: 49.99, status: 'Delivered' },
    { orderNumber: 5678, totalPrice: 29.99, status: 'In Progress' },
    { orderNumber: 9012, totalPrice: 9.99, status: 'Cancelled' }
  ];

  userForm: FormGroup;
  checkoutHistoryColumns = ['orderNumber', 'totalPrice', 'status'];

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,  private fb: FormBuilder) { }


  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  private userId$: Observable<string> = this.activatedRoute.params.pipe(
    map((params: Params) => params['id'])
  )

  user$: Observable<User> = this.userId$.pipe(
    switchMap((userId: string) => this.userService.getUser(userId))
  )

}
