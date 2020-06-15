import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import {AuthService} from './shared/services/auth.service';
import { CartService } from './shared/services/cart.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'General Store';
  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  navCartCount$ : Observable<number>;
  constructor(private aS : AuthService, private cart: CartService){
    this.isLoggedIn$ = aS.isLoggedIn;
    this.isAdmin$ = aS.isAdmin;
    this.navCartCount$ = cart.cartCount;
  }

  logOut(){
    this.aS.logout();
  }

  ngOnInit(){
 
  }
}
