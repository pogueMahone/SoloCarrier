import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {ItemService} from '../../../shared/services/item.service';
import {CartService} from '../../../shared/services/cart.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

@Input() item: any;
@Input() returnUrl : string; 
loading:boolean =false;
cQ:number = 0;
  constructor(private router: Router, private iS: ItemService, private cart: CartService) { }

  ngOnInit(): void {    
    const cartItem = this.cart.getCartItem(this.item.id);   
     if(cartItem){
      this.item['inventory'] = this.item.quantity - cartItem.quantity;
     } else{
      this.item['inventory'] = this.item.quantity;
     }
  }

  addToCart(){
    this.loading = true;
    this.item.inventory--;
    this.cart.update(this.item, 1, false);
    this.loading = false;
  }

  view() {
    this.iS.item = this.item;
    this.router.navigate(['/catalogue/item',  this.item.id ], { queryParams: { returnUrl: this.returnUrl } });
  }

}
