import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {ToastrService} from '../services/toastr.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', observe: 'events' })
};

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {
  private _navbarCartCount = 0;
  private _nbCObs: BehaviorSubject<number>;
 
	navbarFavCount = 0;
  constructor(private http: HttpClient, private toastrService: ToastrService) { 
    this._nbCObs = new BehaviorSubject<number>(0);    
    this.setCartCount();
  }

  private setCartCount(){ 
    let a = JSON.parse(localStorage.getItem('avct_item')) || [];
    this._navbarCartCount = 0;
    a.forEach(element => {
      this._navbarCartCount += element.quantity;
    });
    //this._navbarCartCount = a.length;    
    this._nbCObs.next(this._navbarCartCount);
  }  

  clear(){
    localStorage.removeItem('avct_item');
    this._navbarCartCount = 0;    
    this._nbCObs.next(this._navbarCartCount);
  }

  get cartCount():Observable<number>{
    return this._nbCObs.asObservable();
  }

  getCartItems(){
    return JSON.parse(localStorage.getItem('avct_item')) || [];
  }

  getCartItem(id:string){
    const a = JSON.parse(localStorage.getItem('avct_item')) || [];
    return a.find(o => o.id === id);
  }

  update(item:any, quantity: number, overwrite: boolean)  {    
    let a = JSON.parse(localStorage.getItem('avct_item')) || [];    
    const i = a.findIndex(o => o.id === item.id);
    if(i > -1){
      if(overwrite){
        a[i].quantity = quantity;
      } else{
        a[i].quantity += quantity;
      }
      this.toastrService.success(`Updating ${item.name}`, `Updating ${item.name} in the cart`);
    } else {
      const tI = JSON.parse(JSON.stringify(item));
      delete tI.quantity;
      delete tI.inventory;
      a.push({id: item.id, quantity: quantity, data:tI});
      this.toastrService.success(`Adding ${item.name}`, `Adding ${item.name} to the cart`);      
    }
    localStorage.setItem('avct_item', JSON.stringify(a));
    //this._navbarCartCount = a.length;      
    //this._nbCObs.next(this._navbarCartCount); 
    this.setCartCount();
  }

  remove(id: string){
    let a = JSON.parse(localStorage.getItem('avct_item')) || [];    
    const i = a.findIndex(item => item.id === id);
    this.toastrService.info('Removing', `Removing ${a[i].data.name} from Cart`);
    a.splice(i, 1);
		setTimeout(() => {
			localStorage.setItem('avct_item', JSON.stringify(a));
      //this._navbarCartCount = a.length;      
      //this._nbCObs.next(this._navbarCartCount);
      this.setCartCount();
		}, 500);
  }

  ngOnDestroy() {
    if(this._nbCObs){
      this._nbCObs.unsubscribe();
    }
  }
}
