import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { JwtInterceptor } from './utilities/jwtinterceptor';
import { ErrorInterceptor } from './utilities/errorinterceptor';
import { LoaderInterceptor } from './utilities/loader-interceptor';
import { AuthGuard } from './utilities/authguard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopItemsComponent } from './layouts/items/top-items/top-items.component';
import { CarouselComponent } from './shared/components/carousel/carousel.component';
import { IndexComponent } from './index/index.component';
import { AddItemComponent } from './layouts/items/add-item/add-item.component';
import { ItemListComponent } from './layouts/items/item-list/item-list.component';
import { ItemComponent } from './layouts/items/item/item.component';
import { RatingsComponent } from './shared/components/ratings/ratings.component';
import { ShoppingCartComponent } from './layouts/items/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './layouts/checkout/checkout.component';
import { CardComponent } from './shared/components/card/card.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import {OrderListComponent} from './layouts/orders/order-list/order-list.component';
import {OrderComponent} from './layouts/orders/order/order.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import {LoaderService} from '../app/shared/services/loader.service';
import { StripeComponent } from './layouts/orders/stripe/stripe.component';
import { DeliveryListComponent } from './layouts/orders/delivery-list/delivery-list.component';
import { DeliveryComponent } from './layouts/orders/delivery/delivery.component';
import { MessageDialogComponent } from './shared/components/message-dialog/message-dialog.component';
import { ProfileComponent } from './users/profile/profile.component';
import { PrivacyComponent } from './privacy/privacy.component';
import {environment} from '../environments/environment';
import { SendResetComponent } from './users/send-reset/send-reset.component';
import { ResetComponent } from './users/reset/reset.component';
import { TermsComponent } from './terms/terms.component';


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.googleAuthClientId)
  }
]);
 
export function provideConfig() {
  return config;
}


@NgModule({
  declarations: [    
    AppComponent,    
    TopItemsComponent,    
    CarouselComponent,
    IndexComponent,
    AddItemComponent,
    ItemListComponent,
    ItemComponent,
    RatingsComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    CardComponent,    
    LoginComponent,
    RegisterComponent,
    OrderListComponent,
    OrderComponent,
    LoaderComponent,   
    StripeComponent, DeliveryListComponent, DeliveryComponent, MessageDialogComponent, ProfileComponent, PrivacyComponent, SendResetComponent, ResetComponent, TermsComponent   
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {
        timeOut: 2000,        
        closeButton: true,
        enableHtml:true
      }
    ),
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SocialLoginModule,
    AppRoutingModule,    
    MDBBootstrapModule.forRoot()
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [MatDatepickerModule, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, 
    LoaderService, { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },{provide: AuthServiceConfig, useFactory: provideConfig }],
  bootstrap: [AppComponent]
})
export class AppModule { }
