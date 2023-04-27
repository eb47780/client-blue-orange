import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Address } from 'src/app/models/address.model';

@Component({
  selector: 'app-confirm-address-dialog',
  template: `
    <h1 mat-dialog-title>Confirm Address</h1>
    <div mat-dialog-content>
      <p>Do you want to use this address?</p>
      <p>{{ data.street}} {{data.street_number}}, {{data.city}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Yes</button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </div>
  `
})
export class ConfirmAddressComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address
  ) {}
}
