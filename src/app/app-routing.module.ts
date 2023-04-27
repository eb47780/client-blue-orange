import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './pages/user/user.component';
import { SignupComponent } from './signup/signup.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

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

  {
    path: 'checkout',
    component: CheckoutComponent
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'user',
    children: [
      {
        path: ':id',
        component: UserComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
