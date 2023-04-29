import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UserEditComponent } from './user-edit/user-edit.component';

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

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,  private fb: FormBuilder, private dialog: MatDialog) { }


  user$: Observable<User> = this.userService.getUser(localStorage.getItem('id'));

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    });
    
  }

  openEditProfileModal(): void {
    // Open dialog and pass in user form group
    const dialogRef = this.dialog.open(UserEditComponent, {
      data: this.userForm.value
    });

    // Subscribe to dialog result and update user data if user clicks save
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(result).subscribe((data: any) => {
          window.location.reload();
        });
      }
    });
  }

  

}
