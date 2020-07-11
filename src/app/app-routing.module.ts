import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationStart, NavigationEnd } from '@angular/router';
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
import { filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import {JsonLdTagService} from './shared/services/json-ld-tag.service';


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
  { path: 'catalogue/brand/:brand', component: ItemListComponent },
  { path: 'catalogue/:cat0', component: ItemListComponent }, 
  { path: 'catalogue/:cat0/:cat1', component: ItemListComponent }, 
  { path: 'catalogue/:cat0/:cat1/:cat2', component: ItemListComponent }, 
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'user/order/success/:id/:cid', component: StripeComponent, canActivate: [AuthGuard] },
  { path: 'user/order/cancel/:id/:cid', component: StripeComponent, canActivate: [AuthGuard] },
  { path: 'catalogue/item/:brand/:name/:id', component: ItemComponent },
  { path: 'items/shopping-cart', component: ShoppingCartComponent }, 
  { path: '', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router:Router, private json_ld_tag: JsonLdTagService){
    const navStartEvents = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    );
    navStartEvents.subscribe((event: NavigationStart) => {     
      this.json_ld_tag.removePageViewTags();
    });
    const navEndEvents = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );
    combineLatest(navEndEvents, this.json_ld_tag.pageTagReady).subscribe(resp =>{
      if(resp[1]) { 
        this.json_ld_tag.addPageViewTags(resp[1]);
      } 
    });
    // navEndEvents.subscribe((event: NavigationEnd) => {
    //   // let scripts = document.body.getElementsByClassName('page-view-json-ld');     
    //   // if(scripts && scripts.length > 0){
    //   //   for(let i =0; i<scripts.length; i++) {
    //   //     document.body.removeChild(scripts[i]);
    //   //   };
    //   // }
      
    //   this.json_ld_tag.pageTagReady.subscribe(tag => {
    //     let scripts = document.body.getElementsByClassName('page-view-json-ld');    

    //     // if(tag && scripts.length ===0){
    //     //   let s = document.createElement('script');
    //     //   s.type = 'application/ld+json';
    //     //   s.classList.add('page-view-json-ld');
    //     //   s.text = JSON.stringify(tag);
    //     //   document.head.append(s);
    //     //}
    //   });
    // });
  }
 }
