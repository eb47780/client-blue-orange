import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Address } from 'src/app/models/address.model';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-user-address-create',
  templateUrl: './user-address-create.component.html',
  styleUrls: ['./user-address-create.component.scss']
})
export class UserAddressCreateComponent implements OnInit {


 // Define user form group
 addressForm: FormGroup;
 address: any;

 constructor(
   private checkoutService: CheckoutService,
   private formBuilder: FormBuilder,
   protected dialogRef: MatDialogRef<UserAddressCreateComponent>,
   @Inject(MAT_DIALOG_DATA) public data: Address,
 ) {}

 ngOnInit(): void {
  this.initAddressForm();
}

initAddressForm(): void {
  this.addressForm = this.formBuilder.group({
    street: ['', Validators.required],
    street_number: ['', Validators.required],
    city: ['', Validators.required],
    zipcode: ['', Validators.required]
  });
}
 // Define function to close dialog and pass back user form group value
 save(): void {
  if (!this.addressForm.valid) {
    return;
  }
   this.dialogRef.close(this.addressForm.value);
 }
}
