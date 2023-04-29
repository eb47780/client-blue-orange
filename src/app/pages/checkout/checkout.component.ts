import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ConfirmAddressComponent } from './confirm-address/confirm-address.component';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cart.model';
import { Address } from 'src/app/models/address.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  animations: [
    trigger('slideIn', [
      state('void', style({
        transform: 'translateX(100%)'
      })),
      state('*', style({
        transform: 'translateX(0)'
      })),
      transition('* => void', animate('0.5s ease-in'))
    ])
  ]
})
export class CheckoutComponent implements OnInit {

  address: Address;
  addressConfirmed: boolean = false;
  cardDetails: any = {};
  cartItems: CartItem[];
  showError: boolean = false;
  message: string = '';
  loading: boolean = false;


  constructor(private checkoutService: CheckoutService, public dialog: MatDialog, private cartService: CartService, private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to user's address
    this.checkoutService.getAddress().subscribe((address: any) => {
      console.log(address)
      const item = address[0]; // get the first item from the array
      const obj = item as Address;
      this.address = obj;
    });


    // Subscribe to user's card details
    this.checkoutService.getCardDetails().subscribe(cardDetails => {
      this.cardDetails = cardDetails;
    });

    this.cartItems = this.cartService.cart.value.items;
  }

  addressForm: FormGroup = this.fb.group({
    street: ['', [Validators.required]],
    street_number: ['', [Validators.required]],
    city: ['', [Validators.required]],
    zipcode: ['', [Validators.required]]
  })

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  // Open dialog to confirm user's current address
  confirmAddress() {
    this.showError = false;
    if (!this.addressForm.valid) {
      return;
      } 

    if (!this.address) {
      this.checkoutService.setAddress(this.addressForm.value).subscribe(result => {
        this.addressConfirmed = true;
        this.address = result;
        this._snackBar.open('Address Confirmed', 'Ok', {
          duration: 2500,
        })
      })
      return;
    }

    const dialogRef = this.dialog.open(ConfirmAddressComponent, {
      data: this.address,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.checkoutService.updateAddress(this.address.id, this.addressForm.value).subscribe(result => {
          this.addressConfirmed=true;
          this.loading=false;
        })

      } else {
        this.addressConfirmed = false;
        this.checkoutService.deleteAddress(this.address.id).subscribe((result: any)=> {
          this.address = result
        });
        this._snackBar.open('Address Removed', 'Ok', {
          duration: 700,
        })
        setTimeout(() => {
          window.location.reload();
        }, 700);
        
      }
    });  
  }
  

  // Save user's card details
  saveCardDetails() {
    console.log()
    this.checkoutService.setCardDetails(this.cardDetails);
  }
  
  getTotal(items: CartItem[]): number {
      return this.cartService.getTotal(items);
    }

}
