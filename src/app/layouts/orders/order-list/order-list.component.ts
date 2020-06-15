import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import {ToastrService} from 'src/app/shared/services/toastr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  orders:Array<any>;
public pageIndex = 0;
  public pageSize = 0;
  public pageCount = 0;
  public complete:string ='0';  
  status = {error:false, msg:null};
  public readonly utcOS: number;
  constructor(private config : ConfigService, private oS: OrderService, private toastr: ToastrService, private router: Router) { 
    this.utcOS = this.config.utcOffsetHours;
  }

  ngOnInit(): void {
    this.get();
  }

  toggle(){
    this.pageIndex = 0;
    this.get();
  }

  getTotal(i){    
    let t = 0;
    this.orders[i].detail.items.forEach(element => {
      t += element.total;
    });
    t += this.orders[i].detail.delivery.charge;
    return t;
  }

  getTOD(i:number): string{
    const tod = this.orders[i].detail.delivery.tod;    
    return this.oS.getTOD(tod);
  }

  getQuantity(i){    
    let q = 0;
    this.orders[i].detail.items.forEach(element => {
      q += element.quantity;
    });
    return q;
  }

  private get(){
    this.oS.getOrders(this.pageIndex, this.complete).subscribe(data =>{
      this.orders = data.list;
              
        this.pageCount = data.count;
        this.pageSize = data.limit;    
    },
      error => {
       this.toastr.warning('An Error Occurred','An error occurred retrieving orders.  Support has been notified');
      });
  }

  view(i){
    this.oS.order = this.orders[i];
    this.router.navigate(['/user/order/',  this.orders[i].id ]);
  }

  page(e){    
    this.pageIndex = e.pageIndex;
    this.get();
  }

}
