import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import {ToastrService} from 'src/app/shared/services/toastr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit {
  orders:Array<any>;
  public pageIndex = 0;
  public pageSize = 0;
  public pageCount = 0;
  public complete:string ='1';  
  constructor(private oS: OrderService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.get();
  }

  toggle(){
    this.pageIndex = 0;
    this.get();
  }

  private get(){
    this.oS.getDeliveries(this.pageIndex, this.complete).subscribe(data =>{
        this.orders = data.list;              
        this.pageCount = data.count;
        this.pageSize = data.limit;  
        if(!this.orders){
          this.toastr.info("No Deliveries", "There are currently no deliveries.");
        }  
    },
      error => {
       this.toastr.error('An Error Occurred','An error occurred retrieving orders.  Support has been notified.');
      });
  }

  formatTOD(id){
    return this.oS.getTOD(id);
  }

  page(e){    
    this.pageIndex = e.pageIndex;
    this.get();
  }
  view(i){
    this.router.navigate(['/delivery', this.orders[i].id]);
  }
}
