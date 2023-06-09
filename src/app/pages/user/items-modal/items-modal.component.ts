import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-items-modal',
  template: `
   <h2 class="text-xl font-bold mb-4">Checkout Items Purchased</h2>
  <div class="max-h-64 overflow-y-auto">
    <div *ngFor="let item of items" class="bg-white shadow-md rounded-lg p-4 mb-4">
      <div class="flex-shrink-0">
              <img class="h-9 w-12" src="{{ 'http://localhost:8002'+item.image }}" alt="Product Image">
      </div>
      <p class="text-lg font-medium">{{ item.title }}</p>
      <p class="text-blue-400 font-bold mt-2">Quantity: {{ item.quantity }}x</p> 
      <p class="text-green-500 font-bold mt-2">{{ item.price | currency }}</p>
      <p class="text-gray-700 font-bold mt-4">Total: {{ item.quantity * item.price | currency }}</p>
    </div>
  </div>
  <div class="flex justify-end mt-4">
    <button mat-button class="bg-gray-500 text-white hover:bg-gray-600" (click)="close()">Close</button>
  </div>
  `,
})
export class ItemsModalComponent {
  items: any[];

  constructor(
    public dialogRef: MatDialogRef<ItemsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.items = data.items;
    
  }

  close() {
    this.dialogRef.close();
  }
}
