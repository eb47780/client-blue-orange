import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UserEditComponent } from './user-edit/user-edit.component';
import { Address } from 'src/app/models/address.model';
import { CheckoutService } from 'src/app/services/checkout.service';
import { UserAddressEditComponent } from './user-address-edit/user-address-edit.component';
import { UserAddressCreateComponent } from './user-address-create/user-address-create.component';
import { ItemsModalComponent } from './items-modal/items-modal.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  checkoutHistory: any[] = [];
  userForm: FormGroup;
  addressForm: FormGroup;
  checkoutHistoryColumns = ['orderNumber', 'totalPrice', 'status'];
  address: Address;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,  private fb: FormBuilder, private dialog: MatDialog, private checkoutService: CheckoutService) { }


  
  user$: Observable<User> = this.userService.getUser(localStorage.getItem('id'));


  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.addressForm = this.fb.group({
      id: ['', Validators.required],
      street: ['', Validators.required],
      street_number: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
    });
    
    this.checkoutService.getAddress().subscribe((address: any) => {
      const item = address[0]; // get the first item from the array
      const obj = item as Address;
      this.address = obj;
    });

    const userId = localStorage.getItem('id');
    this.user$ = this.userService.getUser(userId);
    
    this.checkoutService.getCheckout(userId).subscribe(
      (history: any[]) => {
        this.checkoutHistory = history;
        this.checkoutHistory.forEach((checkout) => {
          this.checkoutService.getStatusName(checkout.status).subscribe((result: any) => {
            checkout.status = result.message;
          });
        });
      },
      (error) => {
        console.error('Failed to get checkout history:', error);
      }
    );


  

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

  openEditAddressModal(): void {
    // Open dialog and pass in user form group
    const dialogRef = this.dialog.open(UserAddressEditComponent, {
      data: this.addressForm.value
    });

    // Subscribe to dialog result and update user data if user clicks save
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.checkoutService.updateAddress(result.id, result).subscribe((data: any) => {
          window.location.reload();
        });
      }
    });
  }

  openCreateAddressModal(): void {
    // Open dialog and pass in user form group
    const dialogRef = this.dialog.open(UserAddressCreateComponent, {
    });

    // Subscribe to dialog result and update user data if user clicks save
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.checkoutService.setAddress(result).subscribe((data: any) => {
          console.log(data)
          window.location.reload();
        });
      }
    });
  }  

  openItemsModal(items: any[]) {
    const dialogRef = this.dialog.open(ItemsModalComponent, {
      width: '500px',
      data: { items: items }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The items modal was closed');
    });
  }

}
