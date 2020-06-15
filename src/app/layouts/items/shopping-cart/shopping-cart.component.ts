import { Component, OnInit, OnDestroy } from '@angular/core';
import {ItemService} from '../../../shared/services/item.service';
import {CartService} from '../../../shared/services/cart.service';
import {ConfigService} from '../../../shared/services/config.service';
import {Item} from '../../../models/item';
import {ToastrService} from '../../../shared/services/toastr.service';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy{
  cartItems:Array<any>;
  inventoryItems:any;
  total:number =0;  
  private _valid: BehaviorSubject<boolean>;
  config: any;
  get cartValid() {
    return this._valid.asObservable(); 
  }
  constructor(private configService: ConfigService, private iS: ItemService, private toastr: ToastrService, private cart: CartService) {
    this._valid = new BehaviorSubject<boolean>(true);
   }

  ngOnInit(): void {
    this.configService.getConfig().subscribe(config => {
      this.config = config;
    });
    this.cartItems = this.cart.getCartItems(); 
    this.init(); 
  }
  
  private init(){    
    this.total = 0;
    let idIdList = new Array<string>();
    this.cartItems.forEach(item =>{ 
      this.total += item.quantity * item.data.price;     
      idIdList.push(item.id);
    });
    
    setTimeout(() => {
      if(this.config && (this.total < this.config.minOrderAmount && this.total > 0)) {
        this.toastr.info('FYI!', `Minimum $${this.config.minOrderAmount} purchase for delivery`);
      }
    }, 1200);
   
    
    if(idIdList.length === 0){
      this.toastr.info("Cart Empty","Your shopping cart is empty.");
      this.inventoryItems = null;
      this.total = 0;
      return;
    }
    this.iS.findList(idIdList).subscribe(list => {
      this.inventoryItems = list;
      let isValid = true;
      this.inventoryItems.forEach(element => {
        const i = this.cartItems.findIndex(o => o.id === element.id);
        this.cartItems[i]['inventory'] = element.quantity;
        this.cartItems[i]['valid'] = (element.quantity - this.cartItems[i].quantity) > -1;
        if(isValid){
          isValid = this.cartItems[i].valid;
        }
      });  
        this._valid.next(isValid);
    },
    error => {
      this.toastr.warning('Cart Error','An error occurred initializing your cart.  Support has been notified.');
    });
  }

   private checkCartValid(){
     for(let i =0; i< this.cartItems.length; i++){
       if((this.cartItems[i].quantity > this.cartItems[i].inventory) || this.cartItems[i].inventory ===0){
         this._valid.next(false);
         return;
       }
     }
     this._valid.next(true);
   }

  delete(i:number){    
    let count = this.cartItems.length;    
    this.cart.remove(this.cartItems[i].id);  
    this.cartItems.splice(i, 1);
    this.updateTotal(); 
  }  

  private updateTotal(){
    this.total = 0;
    this.cartItems.forEach(item =>{      
      this.total += item.quantity * item.data.price;
    });
    if(this.total < this.config.minOrderAmount && this.total > 0){
      this.toastr.info('FYI!', `Minimum $${this.config.minOrderAmount} purchase for delivery`);
    }
    this.checkCartValid();
 }

  // private updateCart(id: string, quantity:number){        
  //   //this.iS.updateCartItem(id, quantity);
  //   this.updateTotal();
  //   const item = this.inventoryItems.find(i => i.id === id);    
  //   //return this.iS.updateCart(item, quantity);
  // }

  updateOrder(i:number){ 
    this.cart.update(this.cartItems[i].data, this.cartItems[i].inventory, true);
    this.cartItems[i].quantity = this.cartItems[i].inventory;      
    this.cartItems[i].valid = true;  
    this.updateTotal(); 
  }

  quantityChange(q: number, i: number){     
    if(q === null || this.cartItems[i].quantity === q) { return;} 
    //const id = this.cartItems[i].id;
    if(this.cartItems[i].inventory < q){
      this.cartItems[i].valid = false;
    }   
    this.cartItems[i].quantity = q;  
    this.cart.update(this.cartItems[i].data, q, true);
    //this.cartItems[i].quantity = q;      
    //this.cartItems[i].valid = true;
    this.updateTotal();
  }

  checkInventory(id:string, quantity: number) : boolean{
    const item = this.inventoryItems.find(i => i.id === id);     
    return (item.quantity - quantity) > -1;    
  }

  getInventory(id:string): number{
    const item = this.inventoryItems.find(i => i.id === id);     
    return item.quantity;
  }

  ngOnDestroy() {
    if(this._valid){ this._valid.unsubscribe();}
  }
  
}
