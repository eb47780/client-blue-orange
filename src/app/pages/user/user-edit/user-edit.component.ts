import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

 // Define user form group
 userForm: FormGroup;
 user: any;

 constructor(
   private userService: UserService,
   private formBuilder: FormBuilder,
   protected dialogRef: MatDialogRef<UserEditComponent>,
   @Inject(MAT_DIALOG_DATA) public data: User,
 ) {}

 ngOnInit(): void {
  this.userService.getUser(localStorage.getItem('id')).subscribe(user => {
    this.user = user;
    this.initUserForm();
  });
}

initUserForm(): void {
  this.userForm = this.formBuilder.group({
    name: [this.user.name],
    email: [this.user.email],
    phone: [this.user.phone],
  });
}
 // Define function to close dialog and pass back user form group value
 save(): void {
   this.dialogRef.close(this.userForm.value);
 }

}
