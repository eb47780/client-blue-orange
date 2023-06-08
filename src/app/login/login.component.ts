import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide: boolean = false;
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

  delay(message: number) {
    return new Promise( resolve => setTimeout(resolve, message) );
  }
  onLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    else {
      (async () => {
        this.loading = true;
        this.showError = false;
        await this.delay(1000);
        this.authService.login(this.loginForm.value).pipe(
          map(token => window.location.href='http://localhost:4200/home')
        ).subscribe(
          result=> {
          },
          (error) => {
            this.showError = true;
            this.message = error.error.detail;
            this.loading = false;
          }
        )
     })();
      };
    }
  }

