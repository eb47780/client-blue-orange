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
  loadingaddress: boolean = false;
  paymentConfirmed = false;
  payment_method_id: string;
  showMessage: boolean;

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
      this.loadingaddress=false
      return;
      } 

    if (!this.address) {
        setTimeout(() => {
          this.loadingaddress=true
          this.checkoutService.setAddress(this.addressForm.value).subscribe(result => {
            this.addressConfirmed = true;
            this.address = result;
         })
        }, 2500)
        this._snackBar.open('Address Confirmed', 'Ok', {
          duration: 2500,
        })
      return;
    }

    const dialogRef = this.dialog.open(ConfirmAddressComponent, {
      data: this.address,
      disableClose: true,
    });


      dialogRef.afterClosed().subscribe(result => {
        this.loadingaddress=true;
        setTimeout(() => {
          if (result) {
            this.checkoutService.updateAddress(this.address.id, this.addressForm.value).subscribe(result => {
              this.addressConfirmed=true;
            })
            this.loadingaddress=false
            this._snackBar.open('Address Confirmed', 'Ok', {
              duration: 3000,
            })
    
    
          } else {
            this.checkoutService.deleteAddress(this.address.id).subscribe((result: any)=> {
              console.log(result.status)
              console.log(result)
            });
            this.loadingaddress=false
            this.addressConfirmed = false;
            this._snackBar.open('Address Removed', 'Ok', {
              duration: 3000,
            })
            // window.location.reload();
          }
        }, 3000)
   
      });  

  }
  
  // Save user's card details
  saveCardDetails() {
    this.checkoutService.setCardDetails(this.cardDetails);
  }
  
  getTotal(items: CartItem[]): number {
      return this.cartService.getTotal(items);
    }

  checkout() {
    this.saveCardDetails();
    this.loading = true

    const items = this.cartItems.map(item => {
      return {
        quantity: item.quantity,
        product: item.id,
        price: item.price
      };
    });

    const data = {
      items: items,
      customer: localStorage.getItem('id'),
      address: this.address.id,
      payment_method: this.payment_method_id
    };

    setTimeout(() => {
      this.showMessage = false;
      this.checkoutService.checkout(data).subscribe(result => {
        console.log(result)
        localStorage.removeItem('cart')
        this.loading= false
        window.location.href='http://localhost:4200/user' // for now
      }, (error) => {
        this.loading=false
        this.showMessage = true
        this.message = 'Something went wrong trying to process the payment!'
      });
    }, 6000);

  }

  selectedPaymentMethod: string;
  creditcard: boolean;
  cash: boolean;

  paymentMethodSelected() {
    if (this.selectedPaymentMethod === 'credit-card') {
      this.creditcard = true;
      this.cash = false
      this.payment_method_id = 'e0282812-d1b0-4585-99bf-6510497602ab'
    } else if (this.selectedPaymentMethod === 'cash') {
      this.creditcard = false;
      this.cash = true
      this.payment_method_id = 'e0982812-d1b0-4585-99bf-6510497602ab'
    }
  }

}
