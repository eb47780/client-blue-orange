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

  cardForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    number: ['', [Validators.required]],
    dateExpiration: ['', Validators.required],
    cvv: ['', Validators.required],
  })

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  // Open dialog to confirm user's current address
  confirmAddress() {
    if (!this.addressForm.valid) {
      return;
      } 

    if (!this.address) {
        this.loadingaddress=true;
        setTimeout(() => {
          this.checkoutService.setAddress(this.addressForm.value).subscribe(result => {
            this.addressConfirmed = true;
            this.address = result;
            this.loadingaddress=false;
            this._snackBar.open('Address Confirmed', 'Ok', {
              duration: 1500,
            })
         })
        }, 1500)

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
              duration: 1500,
            })
          } else {
            this.checkoutService.deleteAddress(this.address.id).subscribe((result: any)=> {
              console.log(result);
            });
            this.loadingaddress=false
            this.addressConfirmed = false;
            this._snackBar.open('Address Removed', 'Ok', {
              duration: 1500,
            })
            window.location.reload();
          }
        }, 1500)
   
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
    
    console.log('got here')

    if (this.creditcard) {
      if (!this.cardForm.valid) {
        return ;
      }
    }

    this.saveCardDetails();
    this.loading = true

    const items = this.cartItems.map(item => {
      return {
        quantity: item.quantity,
        product: item.id,
        price: item.price
      };
    });

    console.log(items);

    const data = {
      items: items,
      customer: localStorage.getItem('id'),
      address: this.address.id,
      payment_method: this.payment_method_id
    };

    this.checkoutService.checkout(data).subscribe(result => {
      localStorage.removeItem('cart')
      console.log(result);
      setTimeout(() => {
        if (result.status === 'e3182812-d1b0-4585-99bf-6510497602ab') {
          window.location.href='http://localhost:4200/failed' 
        }
        window.location.href='http://localhost:4200/success'
      }, 3000)
      
    }, (error) => {
      setTimeout(() => {
        window.location.href='http://localhost:4200/failed'
      }, 3000)
    });

  }

  selectedPaymentMethod: string;
  creditcard: boolean;
  cash: boolean;

  paymentMethodSelected() {
    if (this.selectedPaymentMethod === 'card') {
      this.creditcard = true;
      this.payment_method_id = 'e0282812-d1b0-4585-99bf-6510497602ab'
    } 
  }

  cardNumberFormatted: string = '';

  formatCardNumber(event: any) {
    let inputValue = event.target.value as string;
    inputValue = inputValue.replace(/\D/g, ''); // Remove non-digit characters
    inputValue = inputValue.slice(0, 16); // Limit input to 19 characters (16 digits + 3 hyphens)
    const cardNumberGroups = inputValue.match(/.{1,4}/g);
    this.cardNumberFormatted = cardNumberGroups ? cardNumberGroups.join('-') : '';
    event.target.value = this.cardNumberFormatted; // Update the input value
  }

}
