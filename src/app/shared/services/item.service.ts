import { Injectable, OnDestroy } from '@angular/core';
import {ToastrService} from '../services/toastr.service';
import {Item} from '../../models/item';
import { Observable, BehaviorSubject, of, noop } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import {environment} from '../../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', observe: 'events' })
};


@Injectable({
  providedIn: 'root'
})
export class ItemService implements OnDestroy {
  
  private _item: Item = null;

  
  constructor(private http: HttpClient, private toastrService: ToastrService) { 
   
  }

  get item(): Item {
    return this._item;
  }

  set item(data:Item){
    this._item = data;
  }
  
  getById(id: string) {
    //return this.afs.collection<Item>('items').doc('0YYnHlIF2bpdroKDMWUI').ref;
   }
  
  update(data: Item) {
		//this.items.update(data.$key, data);
  }

  findList(idList: string[]){    
    const url = environment.apiHost + '/api/Item/findlist';
    return this.post(url, idList);
  }

  private put(apiUrl: string, data: any){
    return this.http.put(apiUrl, data)
      .pipe(
        tap(e => {
          this.log(e)
        }
      )
     );
  }

  private post(apiUrl: string, data: any){
    return this.http.post(apiUrl, data)
      .pipe(
        tap(e => {
          this.log(e)
        }
      )
     );
  }

  private get(apiUrl: string){
    return this.http.get<any>(apiUrl);
  }

  public postPhoto(data:any){    
    const url = environment.apiHost + '/api/Image/upload';
    return this.http.post(url, data, { reportProgress: true, observe: 'events' });
  }
  
  create(data: Item) {    
    const url = environment.apiHost + '/api/Item';
    return this.post(url, data);
  }
  updateItem(id:string, data:any){
    const url = environment.apiHost + `/api/Item/update/${id}`;
    return this.put(url, data);   
  }
  getItem(id:string){
    const url = environment.apiHost + `/api/Item/${id}`;
    return this.get(url);   
  }
  getItems(url:string){
    return this.get(url);   
  }
   getFavorites(){     
     const url = environment.apiHost + '/api/Item/favorites';
        return this.get(url);
  }

  // getLocalFavouriteProducts(): Item[] {
	// 	return JSON.parse(localStorage.getItem('avf_item')) || [];		
	// }

  // addFavourite(data: Item): void {
	// 	let a: Item[];
	// 	a = JSON.parse(localStorage.getItem('avf_item')) || [];
	// 	a.push(data);
	// 	this.toastrService.wait('Adding Product', 'Adding Product as Favourite');
	// 	setTimeout(() => {
	// 		localStorage.setItem('avf_item', JSON.stringify(a));
	// 		this.navbarFavCount = a.length;
	// 	}, 1500);
  // }

  // getCartItems(){
  //   return JSON.parse(localStorage.getItem('avct_item')) || [];
  // }

  // private getStatus(state: number){
  //   const status = {full:false, valid:true};
  //   if(state === 0){
  //     status.full = true;
  //     status.valid = true;
  //   } else if (state < 0){
  //     status.full = true;
  //     status.valid = false;
  //   } else{
  //     status.full = false;
  //     status.valid = true;
  //   }
  //   return status;
  // }
  // getCartStatus(data:Item){    
  //   let a = JSON.parse(localStorage.getItem('avct_item')) || [];    
  //   let i = a.findIndex(item => item.id === data.id);
  //   let status: any;
  //   if(i > -1){
  //     const state = data.quantity - a[i].quantity;
  //     return new BehaviorSubject(this.getStatus(state));
  //   } else{
  //     return new BehaviorSubject(this.getStatus(1));
  //   }
  // }

  // updateCart(data: Item, quantity: number): Observable<any>{ 
  //   return this.setCart(data, quantity, false);
  // }

  // addToCart(data: Item, quantity: number): Observable<any>{ 
  //   return this.setCart(data, quantity, true);
  // }

  // private setCart(data: Item, quantity: number, increment:boolean): Observable<any>{ 
  //   //const status = {full:false, valid:true};
  //   let q = 0;
  //   let a = JSON.parse(localStorage.getItem('avct_item')) || [];    
  //   let i = a.findIndex(item => item.id === data.id);
  //   if(i > -1){
  //     q = a[i].quantity;
  //     if(increment){
  //       a[i].quantity += quantity;
  //     } else{
  //       a[i].quantity = quantity;
  //     }
  //     this.toastrService.success('Updating Product', `Updating ${data.name} in the cart`);
  //   }else{      
  //     a.push({id: data.id, quantity: quantity, data:data});
  //     this.toastrService.success('Adding Product', `Adding ${data.name} to the cart`);
  //   }
  //   const state = data.quantity - (q + quantity);
  //   const status = this.getStatus(state);
	// 	setTimeout(() => {
	// 		localStorage.setItem('avct_item', JSON.stringify(a));
  //     this._navbarCartCount = a.length;      
  //     this._nbCObs.next(this._navbarCartCount);
  //   }, 500);
  //   return new BehaviorSubject(status);
  // }
  
  // addToCart(data: Item, quantity: number): void {		
  //   let a = JSON.parse(localStorage.getItem('avct_item')) || [];    
  //   let i = a.findIndex(item => item.id === data.id);
  //   if(i> -1){    
  //     a[i].quantity = quantity;
  //   } else{
  //     a.push({id: data.id, quantity: quantity, data:data});
  //   }
		
	// 	this.toastrService.success('Adding Product', 'Adding Product to the cart');
	// 	setTimeout(() => {
	// 		localStorage.setItem('avct_item', JSON.stringify(a));
  //     this._navbarCartCount = a.length;      
  //     this._nbCObs.next(this._navbarCartCount);
	// 	}, 500);
  // }

  // updateCartItem(item_id: string, quantity:number){
  //   const a = JSON.parse(localStorage.getItem('avct_item')) || [];
  //   const index = a.findIndex(i => i.id === item_id);
  //   if(index > -1){
  //     a[index].quantity = quantity;
  //     this.toastrService.success("Cart Updated", "Your cart has been updated.");
  //   } else{
  //     this.toastrService.error("Item Not Found In Cart","Item could not be found.  Your cart has been updated.");
  //   }
  //   setTimeout(() => {
	// 		localStorage.setItem('avct_item', JSON.stringify(a));
  //     this._navbarCartCount = a.length;      
  //     this._nbCObs.next(this._navbarCartCount);
	// 	}, 500);    
  // }

  // removeFromCart(id: string){
  //   let a = JSON.parse(localStorage.getItem('avct_item')) || [];    
  //   let i = a.findIndex(item => item.id === id);
  //   let name = a[i].data.name;
  //   a.splice(i, 1);
  //   this.toastrService.info('Removing', 'Removing ' + name + ' from Cart');
	// 	setTimeout(() => {
	// 		localStorage.setItem('avct_item', JSON.stringify(a));
  //     this._navbarCartCount = a.length;      
  //     this._nbCObs.next(this._navbarCartCount);
	// 	}, 500);
  // }

  
  
  // private setCartCount(){ 
  //   let a = JSON.parse(localStorage.getItem('avct_item')) || [];
  //   this._navbarCartCount = a.length;    
  //   this._nbCObs.next(this._navbarCartCount);
  // }

  // clearCart(){
  //   localStorage.removeItem('avct_item');
  //   this._navbarCartCount = 0;    
  //   this._nbCObs.next(this._navbarCartCount);
  // }

  ngOnDestroy() {
    
  }

  private log(message: any) {
    //console.log(message);
  }
  
}
