import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from '../../../shared/services/toastr.service';
import {OrderService} from '../../../shared/services/order.service';
import {ItemService} from '../../../shared/services/item.service';
import {ConfigService} from '../../../shared/services/config.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
order:any;
items:any;
total =0;
private _buyerId : BehaviorSubject<string>;
public readonly utcOS : number;
protected get buyerId() {
  return this._buyerId.asObservable(); 
}
  constructor(private configService: ConfigService, protected router: Router, private route: ActivatedRoute, protected toastr: ToastrService, private oS: OrderService, private iS: ItemService) {
    this._buyerId = new BehaviorSubject<string>(null);
    this.utcOS = this.configService.utcOffsetHours;    
   }

  ngOnInit(): void {    
    this.route.params.subscribe((params) => {
      const id = params['id']; // (+) converts string 'id' to a number
      if(this.oS.order){        
        this.order = this.oS.order;
        this.oS.order = null;
        this.getItems();
      }else{
        this.oS.getOrder(id).subscribe(resp => {
          this.order = resp;
          this.getItems();
        },
        error => {
          this.toastr.info('Hmmm... that order could not be found','<p>We are going to redirect you back to your order list to help you find what you are looking for.</p>');
          setTimeout(() => {
            this.router.navigate(['/user/orders']);
          }, 1800);
        });
      }
       
      
    });    
  }
  private getItems(){
    this._buyerId.next(this.order.buyer_id);
    const ids = new Array<string>();
    this.order.detail.items.forEach(el => {
      ids.push(el.id);
    });
    this.iS.findList(ids).subscribe(resp => {
      this.items = resp;
      this.getTotal();
    },
    error => {
      this.toastr.warning('An Error Occurred','An error occurred retrieving order items.  Please try again');
    });
  }

  private getTotal(){  
    this.total = 0;     
    this.order.detail.items.forEach(element => {
      this.total += element.total;
    });  
    if(this.order.detail.delivery.charge > 0){
      this.total += this.order.detail.delivery.charge;
    }  
  }

  getQuantity(id:string) : number{
    const item = this.order.detail.items.find(i => i.id === id);
    return item.quantity;
  }

  getPrice(id:string) : number{
    const item = this.order.detail.items.find(i => i.id === id);
    return item.total / item.quantity;
  }

  getSubtotal(id:string) : number{
    const item = this.order.detail.items.find(i => i.id === id);
    return item.total;
  }

  getTOD(): string{
    const tod = this.order.detail.delivery.tod;    
    return this.oS.getTOD(tod);
  }

  back(){
    this.router.navigate(['/user/orders']);
  }

}
