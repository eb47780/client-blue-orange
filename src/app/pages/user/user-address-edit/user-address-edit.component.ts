import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Address } from 'src/app/models/address.model';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-user-address-edit',
  templateUrl: './user-address-edit.component.html',
  styleUrls: ['./user-address-edit.component.scss']
})
export class UserAddressEditComponent implements OnInit {

 // Define user form group
 addressForm: FormGroup;
 address: any;

 constructor(
   private checkoutService: CheckoutService,
   private formBuilder: FormBuilder,
   protected dialogRef: MatDialogRef<UserAddressEditComponent>,
   @Inject(MAT_DIALOG_DATA) public data: Address,
 ) {}

 ngOnInit(): void {
  this.checkoutService.getAddress().subscribe((address: any) => {
    const item = address[0]; // get the first item from the array
    const obj = item as Address;
    this.address = obj;
    this.initAddressForm();
  });
}

initAddressForm(): void {
  this.addressForm = this.formBuilder.group({
    id: [this.address.id],
    street: [this.address.street],
    street_number: [this.address.street_number],
    city: [this.address.city],
    zipcode: [this.address.zipcode]
  });
}
 // Define function to close dialog and pass back user form group value
 save(): void {
  if (!this.addressForm.valid) {
    console.log(this.address)
    return;
  }
  console.log(this.address)
  this.dialogRef.close(this.addressForm.value);
 }

}
