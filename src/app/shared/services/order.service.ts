import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', observe: 'events' })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {
private _order: any;
  constructor(private authService: AuthService, private http: HttpClient) { 
    this.authService.isLoggedIn.subscribe(a =>{
      if(a){
        //this.uid = this.authService.user.uid;
      }
    });    
  }

   get order(): any {
     return this._order;
   }

   set order(data:any){
     this._order = data;
   }
  public create (order: any)  {    
    const url = environment.apiHost + '/api/Order/create';
    return this.http.post(url, order);
  }

  public sendNotes (data: any)  {    
    const url = environment.apiHost + '/api/Order/notes';
    return this.http.post(url, data);
  }

  public contactReceiver (id: string, data: any)  {    
    const url = environment.apiHost + `/api/Order/contact/${id}`;
    return this.http.post(url, data);
  }

  private get(apiUrl: string){
    return this.http.get<any>(apiUrl);
  }

  commit(id:string, cid:string){    
    const url = environment.apiHost + '/api/Order/commit/'+ id + '?cid=' + cid;    
    return this.get(url);
  }

  cancel(id:string, cid:string){   
    const url = environment.apiHost + '/api/Order/cancel/'+ id + '?cid=' + cid;    
    return this.get(url);
  }

  getOrder(id:string){    
    const url = environment.apiHost + '/api/Order/';
    return this.get(url + id);
  }
  private setCompleteParameter(complete: string){
    switch(complete){
      case '1':
        return '&comp=false';
      case '2':
        return '&comp=true';
      default:
        return '';
    };
  }
  getOrders(page:number, complete: string){       
    const url = environment.apiHost + `/api/Order/list?page=${page}${this.setCompleteParameter(complete)}`;
    return this.get(url);
  }

  getDeliveries(page:number, complete: string){ 
    const url = environment.apiHost + `/api/Order/p-list?page=${page}${this.setCompleteParameter(complete)}`;   
    return this.get(url);
  }  

  getTOD(todId: number) :string{    
    switch(todId){
      case 0:
        return 'morning';
        case 1:
          return 'afternoon';
          default:
            return 'evening';
    }
  }
}
