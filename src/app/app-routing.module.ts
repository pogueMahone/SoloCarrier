import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './utilities/authguard';
import {AdminGuard} from './utilities/adminguard';
import {IndexComponent} from './index/index.component';
import { AddItemComponent } from './layouts/items/add-item/add-item.component';
import {ItemListComponent} from './layouts/items/item-list/item-list.component';
import {ShoppingCartComponent} from './layouts/items/shopping-cart/shopping-cart.component';
import {ItemComponent} from './layouts/items/item/item.component';
import {CheckoutComponent} from '../app/layouts/checkout/checkout.component';
import {LoginComponent} from '../app/users/login/login.component';
import {RegisterComponent} from '../app/users/register/register.component';
import {OrderListComponent} from '../app/layouts/orders/order-list/order-list.component';
import {OrderComponent} from '../app/layouts/orders/order/order.component';
import {StripeComponent} from '../app/layouts/orders/stripe/stripe.component';
import{DeliveryListComponent} from '../app/layouts/orders/delivery-list/delivery-list.component';
import{DeliveryComponent} from '../app/layouts/orders/delivery/delivery.component';
import { ProfileComponent } from './users/profile/profile.component';
import {PrivacyComponent} from '../app/privacy/privacy.component';
import { SendResetComponent } from './users/send-reset/send-reset.component';
import { ResetComponent } from './users/reset/reset.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'privacy-policy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/reset', component: ResetComponent },
  { path: 'user/send-reset', component: SendResetComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'user/orders', component: OrderListComponent, canActivate: [AuthGuard] },
  { path: 'user/order/:id', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'add-item', component: AddItemComponent, canActivate: [AdminGuard] },
  { path: 'delivery-list', component: DeliveryListComponent, canActivate: [AdminGuard] },
  { path: 'delivery/:id', component: DeliveryComponent, canActivate: [AdminGuard] },
  { path: 'catalogue', component: ItemListComponent },  
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'user/order/success/:id/:cid', component: StripeComponent, canActivate: [AuthGuard] },
  { path: 'user/order/cancel/:id/:cid', component: StripeComponent, canActivate: [AuthGuard] },
  { path: 'catalogue/item/:id', component: ItemComponent },
  { path: 'items/shopping-cart', component: ShoppingCartComponent }, 
  { path: '', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
