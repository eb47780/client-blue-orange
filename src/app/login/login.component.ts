import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { StoreService } from '../services/store.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide: boolean = false;
  user: User;
  showError: boolean = false;
  message:string = '';
  loading: boolean = false;
  

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }


  onLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    else {
      (async () => { 
        this.loading = true;
        await this.delay(1500);
        this.authService.login(this.loginForm.value).subscribe(result=> {
          localStorage.setItem('jwt',result['access']);
          this.router.navigate(['home'])
          this._snackBar.open('Logged in successfully', 'Ok', {
            duration: 5000,
            });

          },   
          (error) => {
            this.showError = true;
            this.message = 'No active account found with the given credentials';
            this.loading = false;
          }
        )
      })();
    }
  }
}