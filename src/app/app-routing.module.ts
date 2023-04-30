import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './pages/user/user.component';
import { SignupComponent } from './signup/signup.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AuthGuard } from './auth.guard';
import { CheckoutGuard } from './checkout.guard';
import { SuccessUrlComponent } from './pages/checkout/success-url/success-url.component';
import { FailedUrlComponent } from './pages/checkout/failed-url/failed-url.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'cart',
    component: CartComponent,
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  
  {
    path: 'signup',
    component: SignupComponent,
  },


  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [CheckoutGuard],
  },

  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'success',
    component: SuccessUrlComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'failed',
    component: FailedUrlComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
